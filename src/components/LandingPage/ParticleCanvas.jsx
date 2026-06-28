// src/components/ParticleCanvas.jsx
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import particleData from '../../assets/baked-particles_250.json'

export default function ParticleCanvas() {
  const mountRef = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let animId
    let geometry
    let material
    let renderer

    const width = mount.clientWidth || (window.innerWidth * 0.5)
    const height = mount.clientHeight || window.innerHeight

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 22

    const rawPositions = new Float32Array(particleData.positions)
    const rawColors    = new Float32Array(particleData.colors)
    const count        = rawPositions.length / 3
    const homePositions = rawPositions.slice()

    const scatterPositions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 18 + Math.random() * 10
      scatterPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      scatterPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      scatterPositions[i * 3 + 2] = r * Math.cos(phi) - 8
    }

    geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(scatterPositions.slice(), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(rawColors, 3))

    material = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity:   { value: 0 },
        uSize:      { value: 0.8 * renderer.getPixelRatio() }, 
      },
      vertexShader: `
        uniform float uSize;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (100.0 / -mvPosition.z); 
          gl_Position  = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          float alpha = smoothstep(0.5, 0.45, dist); 
          if (dist > 0.5) discard;
          gl_FragColor = vec4(vColor, uOpacity * alpha);
        }
      `,
      transparent: true,
      depthWrite:  false,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let isStaticImage = false 

    const proxy = { progress: 0, opacity: 0 }
    gsap.to(proxy, {
      progress: 1,
      opacity: 1,
      duration: 3.0,
      ease: 'power3.out',
      delay: 0.4,
      onStart() { setIsReady(true) },
      onUpdate() {
        if (isStaticImage) return 
        material.uniforms.uOpacity.value = proxy.opacity
        const pos = geometry.attributes.position.array
        const t   = proxy.progress
        for (let i = 0; i < count; i++) {
          const delay  = (i / count) * 0.35
          const localT = Math.max(0, Math.min(1, (t - delay) / (1 - delay)))
          const ease   = 1 - Math.pow(1 - localT, 3)
          pos[i * 3]     = scatterPositions[i * 3]     + (homePositions[i * 3]     - scatterPositions[i * 3])     * ease
          pos[i * 3 + 1] = scatterPositions[i * 3 + 1] + (homePositions[i * 3 + 1] - scatterPositions[i * 3 + 1]) * ease
          pos[i * 3 + 2] = scatterPositions[i * 3 + 2] + (homePositions[i * 3 + 2] - scatterPositions[i * 3 + 2]) * ease
        }
        geometry.attributes.position.needsUpdate = true
      },
      onComplete() {
        geometry.attributes.position.copyArray(homePositions)
        geometry.attributes.position.needsUpdate = true
        material.uniforms.uOpacity.value = 1
        material.transparent  = true
        material.blending     = THREE.NormalBlending
        material.needsUpdate  = true
        isStaticImage = true
      },
    })

    const animate = () => {
      animId = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = mount.clientWidth || (window.innerWidth * 0.5)
      const h = mount.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf(proxy) 
      if (geometry) geometry.dispose()
      if (material) material.dispose()
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  const canvasClassName = `hero-right canvas-fade ${isReady ? 'is-visible' : 'is-hidden'}`

  return <div className={canvasClassName} ref={mountRef} aria-hidden="true" />
}