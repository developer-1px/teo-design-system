import React, { useEffect, useState } from 'react'
import { getDebugSource } from './utils'
import './DebugManager.css'
import { InspectorOverlay } from './InspectorOverlay'
// @ts-ignore - Importing from src outside of vite-plugins context
import { DesignLinterOverlay } from '../../../src/lib/design-lint/DesignLinterOverlay'

export const DebugManager: React.FC = () => {
  const [isInspectorActive, setIsInspectorActive] = useState(false)
  const [isLintActive, setIsLintActive] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null)
  const [lockedElement, setLockedElement] = useState<HTMLElement | null>(null)
  const [traversalHistory, setTraversalHistory] = useState<HTMLElement[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const copyElementSource = (element: HTMLElement) => {
    let current = element
    let source: { fileName: string; lineNumber: number; columnNumber: number } | null = null

    while (current && current !== document.body) {
      source = getDebugSource(current)
      if (source) break
      current = current.parentElement as HTMLElement
    }

    if (source) {
      const { fileName, lineNumber, columnNumber } = source
      const textToCopy = `${fileName}:${lineNumber}:${columnNumber}`
      navigator.clipboard.writeText(textToCopy)
      setToastMessage(`Locked & Copied: ${fileName}:${lineNumber}:${columnNumber}`)
    } else {
      setToastMessage('Locked (No source found)')
    }
  }

  // Track hovered element globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInspectorActive && !isLintActive) return

      let target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
      if (!target || target === document.body || target.closest('#inspector-overlay-root') || target.closest('.debug-toast')) {
        setHoveredElement(null)
        return
      }

      // Snap to SVG if inside one
      const svgRoot = target.closest('svg')
      if (svgRoot) {
        target = svgRoot as any
      }

      setHoveredElement(target)
    }

    if (isInspectorActive || isLintActive) {
      window.addEventListener('mousemove', handleMouseMove, true)
    }
    return () => window.removeEventListener('mousemove', handleMouseMove, true)
  }, [isInspectorActive, isLintActive])

  // Key Event Handling (Toggles + Traversal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+D: Toggle Inspector
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        setIsInspectorActive(prev => {
          if (!prev) {
            setToastMessage('Inspector Mode ON')
          } else {
            setLockedElement(null)
            setTraversalHistory([])
          }
          return !prev
        })
        return
      }

      // Cmd+E: Toggle Design Lint
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        setIsLintActive(prev => {
          setToastMessage(prev ? 'Design Lint OFF' : 'Design Lint Mode ON')
          return !prev
        })
        return
      }

      if (!isInspectorActive && !isLintActive) return

      // Cmd+Up: Traverse to parent
      if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowUp') {
        e.preventDefault()
        const current = lockedElement || hoveredElement
        if (current && current.parentElement && current.parentElement !== document.body) {
          const parent = current.parentElement
          setTraversalHistory(prev => [...prev, current])
          setLockedElement(parent)
          copyElementSource(parent)
        }
      }

      // Cmd+Down: Back to child
      if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowDown') {
        e.preventDefault()
        if (traversalHistory.length > 0) {
          const nextStack = [...traversalHistory]
          const lastChild = nextStack.pop()
          const target = lastChild || null
          setLockedElement(target)
          setTraversalHistory(nextStack)
          if (target) copyElementSource(target)
        }
      }

      if (e.key === 'Escape') {
        setLockedElement(null)
        setTraversalHistory([])
        setIsInspectorActive(false)
        setIsLintActive(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isInspectorActive, isLintActive, lockedElement, hoveredElement, traversalHistory])

  // Manage Body Class and Click Interception
  useEffect(() => {
    if (isInspectorActive) {
      document.body.classList.add('debug-mode-active')
    } else {
      document.body.classList.remove('debug-mode-active')
    }

    const handleClick = (e: MouseEvent) => {
      if (!isInspectorActive) return

      e.preventDefault()
      e.stopPropagation()

      // Lock the hovered element
      if (hoveredElement) {
        setLockedElement(hoveredElement)
        setTraversalHistory([]) // Clear traversal history on fresh click
        copyElementSource(hoveredElement)
      }
    }

    if (isInspectorActive) {
      window.addEventListener('click', handleClick, true)
    }

    return () => {
      window.removeEventListener('click', handleClick, true)
    }
  }, [isInspectorActive, hoveredElement])

  // Toast Auto-dismiss
  useEffect(() => {
    if (toastMessage && !toastMessage.includes('Mode ON')) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const activeElement = lockedElement || hoveredElement

  return (
    <>
      {(isInspectorActive || lockedElement) && (
        <InspectorOverlay activeElement={activeElement} />
      )}
      {isLintActive && <DesignLinterOverlay isEnabled={true} />}
      {toastMessage && (
        <div className="debug-toast">
          <span className="debug-toast-icon" />
          {toastMessage}
        </div>
      )}
    </>
  )
}
