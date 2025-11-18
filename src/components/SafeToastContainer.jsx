import React, { useState, useEffect } from 'react'

// Dynamically import ToastContainer from react-toastify and render it
// If import fails or the export is missing, render null and log the error.
export default function SafeToastContainer() {
  const [ToastComp, setToastComp] = useState(null)

  useEffect(() => {
    let mounted = true
    import('react-toastify')
      .then((mod) => {
        // Prefer named export, fallback to default
        const TC = mod.ToastContainer || (mod.default && mod.default.ToastContainer) || mod.default
        if (mounted && TC) {
          setToastComp(() => TC)
        } else if (!TC) {
          console.warn('SafeToastContainer: ToastContainer not found on react-toastify module')
        }
      })
      .catch((err) => {
        console.error('SafeToastContainer import failed:', err)
      })

    return () => {
      mounted = false
    }
  }, [])

  if (!ToastComp) return null
  return <ToastComp />
}
