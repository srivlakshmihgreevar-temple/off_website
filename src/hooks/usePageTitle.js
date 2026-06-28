// src/hooks/usePageTitle.js
import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
    return () => {
      document.title = 'ஸ்ரீவித்யாலக்ஷ்மி ஹயக்ரீவர்' // resets on unmount
    }
  }, [title])
}