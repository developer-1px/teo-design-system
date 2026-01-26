import React, { useEffect, useState } from 'react'
import { getDebugSource } from './utils'
import './DebugManager.css'
import { InspectorOverlay } from './InspectorOverlay'

export const DebugManager: React.FC = () => {
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Toggle Debug Mode with Cmd+D / Ctrl+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        setIsDebugMode(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Manage Body Class and Click Interception
  useEffect(() => {
    if (isDebugMode) {
      document.body.classList.add('debug-mode-active')
      setToastMessage('Debug Mode ON (Cmd+D to toggle)')
    } else {
      document.body.classList.remove('debug-mode-active')
      // Only clear toast if it was the ON message
      setToastMessage(prev => (prev === 'Debug Mode ON (Cmd+D to toggle)' ? null : prev))
    }

    const handleClick = (e: MouseEvent) => {
      if (!isDebugMode) return

      e.preventDefault()
      e.stopPropagation()

      // Find closest fiber source
      const target = e.target as HTMLElement
      // We traverse up to find the closest source
      let current = target
      let source: { fileName: string; lineNumber: number; columnNumber: number } | null = null

      while (current && current !== document.body) {
        source = getDebugSource(current)
        if (source) break
        current = current.parentElement as HTMLElement
      }

      if (source) {
        const { fileName, lineNumber, columnNumber } = source

        // Copy to clipboard
        const textToCopy = `${fileName}:${lineNumber}:${columnNumber}`
        navigator.clipboard.writeText(textToCopy)

        // Display simplified name in toast
        const shortName = fileName.split('/').pop()
        setToastMessage(`Copied: ${shortName}:${lineNumber}:${columnNumber}`)

        // Disable debug mode after click (optional, but convenient)
        setIsDebugMode(false)
      } else {
        setToastMessage('No source found')
      }
    }

    if (isDebugMode) {
      window.addEventListener('click', handleClick, true) // Capture phase to block others
    }

    return () => {
      window.removeEventListener('click', handleClick, true)
    }
  }, [isDebugMode])

  // Toast Auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  return (
    <>
      {isDebugMode && <InspectorOverlay />}
      {toastMessage && (
        <div className="debug-toast">
          <span className="debug-toast-icon" />
          {toastMessage}
        </div>
      )}
    </>
  )
}
