"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 1025   // md breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    )

    const onChange = () => {
      setIsMobile(mediaQuery.matches)
    }

    // Set initial value
    onChange()

    mediaQuery.addEventListener("change", onChange)
    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
