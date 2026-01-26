import React, { useEffect, useState } from 'react'
import { getDebugSource } from './utils'
const COLORS = {
  margin: 'rgba(245, 158, 11, 0.3)', // Amber-500 (Warm)
  padding: 'rgba(16, 185, 129, 0.3)', // Emerald-500 (Fresh)
  content: 'rgba(59, 130, 246, 0.3)', // Blue-500 (Clear)
  border: 'rgba(250, 204, 21, 0.3)', // Yellow-400 (Bright)
  gap: 'rgba(139, 92, 246, 0.3)', // Violet-500 (Distinct)
}

interface BoxModel {
  top: number
  left: number
  width: number
  height: number
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  borderTop: number
  borderRight: number
  borderBottom: number
  borderLeft: number
  // New gap data
  rowGap: number
  colGap: number
  gaps?: Array<{ top: number; left: number; width: number; height: number }>
  borderRadius?: string
}

// Helper to render a box
const Box = ({
  top,
  left,
  width,
  height,
  bg,
  border,
}: {
  top: number
  left: number
  width: number
  height: number
  bg?: string
  border?: string
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left,
      width,
      height,
      backgroundColor: bg,
      border: border,
      pointerEvents: 'none', // Crucial: let clicks pass through
      boxSizing: 'border-box',
      zIndex: 10000,
    }}
  />
)

export const InspectorOverlay: React.FC = () => {
  const [targetBox, setTargetBox] = useState<BoxModel | null>(null)
  const [targetName, setTargetName] = useState<string>('')
  const [fileInfo, setFileInfo] = useState<string | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Find the element under the cursor
      // We need to temporarily hide the overlay to check what's underneath if the overlay blocks pointers
      // However, we'll set pointer-events: none on the overlay container, so we don't need to hide it.

      let element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
      if (!element || element === document.body || element.closest('#inspector-overlay-root')) {
        setTargetBox(null)
        return
      }

      // Snap to Primitive (MDK)
      const primitiveEl = element.closest('[data-primitive]') as HTMLElement
      if (primitiveEl) {
        element = primitiveEl
      }

      // Check if it's a "significant" element (optional generic filter)
      // or just inspect everything. Let's inspect everything for now,
      // but maybe prefer elements with data-rect-inspector if we want to limit scope later.
      // For now, we inspect the direct hover target.

      const rect = element.getBoundingClientRect()
      const styles = window.getComputedStyle(element)

      const getVal = (val: string) => parseFloat(val) || 0

      // Gap calculation logic
      const gaps: Array<{ top: number; left: number; width: number; height: number }> = []
      const display = styles.display
      const isFlex = display === 'flex' || display === 'inline-flex'
      const isGrid = display === 'grid' || display === 'inline-grid'

      const rowGap = getVal(styles.rowGap) || getVal(styles.gap)
      const colGap = getVal(styles.columnGap) || getVal(styles.gap)

      if (isFlex || isGrid) {
        // Determine layout direction for flex
        // For Grid, it's more complex (row/col gaps), but let's try a generic approach
        // iterating children and finding spaces.
        // Or simplified: just use row-gap and column-gap property and verify if they exist between children.

        // Let's iterate children.
        const children = Array.from(element.children) as HTMLElement[]

        if (children.length > 1) {
          // Sort children by position to support wrapping or grid order
          // Actually, let's just look for adjacency.

          // Simple approach: Check spacing between adjacent siblings in visual flow.
          // This creates a O(N^2) or O(N log N) check, but N is usually small.

          // Optimization: just check logical next sibling?
          // No, invalid for wrapped flex.

          // Heuristic:
          // 1. Collect all child rects.
          // 2. See if there is space between them matching row-gap or column-gap.

          if (rowGap > 0 || colGap > 0) {
            // We will find "empty channels" between items.
            // But a simpler visualization is often just:
            // "Draw a box in the gap area between two items".

            for (let i = 0; i < children.length; i++) {
              const current = children[i].getBoundingClientRect()

              // Compare against all other children to find "immediate neighbors"
              // This handles grid/flex-wrap better than index+1.
              for (let j = 0; j < children.length; j++) {
                if (i === j) continue
                const next = children[j].getBoundingClientRect()

                // Horizontal Gap (Current is Left, Next is Right)
                // Check if they overlap vertically (share a row)
                const verticalOverlap = Math.max(
                  0,
                  Math.min(current.bottom, next.bottom) - Math.max(current.top, next.top)
                )
                const isSameRow = verticalOverlap > 0

                if (isSameRow && colGap > 0) {
                  const distance = next.left - current.right
                  // Allow small FP tolerance
                  if (Math.abs(distance - colGap) < 2) {
                    // Found a gap! Capture it.
                    // Avoid duplicates? (i vs j). define canonical order (left -> right)
                    if (next.left > current.right) {
                      gaps.push({
                        // Better top: usage the intersection top?
                        // Actually chrome draws the gap full height of the track usually.
                        // Let's act simple: Top of the highest element, Height of the overlap.
                        // Or just use the space between.
                        top: Math.min(current.top, next.top) + window.scrollY,
                        left: current.right + window.scrollX,
                        width: distance,
                        height: Math.max(current.height, next.height), // simplified
                      })
                    }
                  }
                }

                // Vertical Gap (Current is Top, Next is Bottom)
                const horizontalOverlap = Math.max(
                  0,
                  Math.min(current.right, next.right) - Math.max(current.left, next.left)
                )
                const isSameCol = horizontalOverlap > 0

                if (isSameCol && rowGap > 0) {
                  const distance = next.top - current.bottom
                  if (Math.abs(distance - rowGap) < 2) {
                    if (next.top > current.bottom) {
                      gaps.push({
                        top: current.bottom + window.scrollY,
                        left: Math.min(current.left, next.left) + window.scrollX,
                        width: Math.max(current.width, next.width),
                        height: distance,
                      })
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Deduplicate gaps (naive O(N^2) check if sensitive, but gaps array usually small)
      // Or just render them over each other. Alpha compositing might look weird.
      // Let's filter distinct approximations.
      const distinctGaps: typeof gaps = []
      gaps.forEach(g => {
        const exists = distinctGaps.some(
          dg =>
            Math.abs(dg.top - g.top) < 1 &&
            Math.abs(dg.left - g.left) < 1 &&
            Math.abs(dg.width - g.width) < 1 &&
            Math.abs(dg.height - g.height) < 1
        )
        if (!exists) distinctGaps.push(g)
      })

      setTargetBox({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        marginTop: getVal(styles.marginTop),
        marginRight: getVal(styles.marginRight),
        marginBottom: getVal(styles.marginBottom),
        marginLeft: getVal(styles.marginLeft),
        paddingTop: getVal(styles.paddingTop),
        paddingRight: getVal(styles.paddingRight),
        paddingBottom: getVal(styles.paddingBottom),
        paddingLeft: getVal(styles.paddingLeft),
        borderTop: getVal(styles.borderTopWidth),
        borderRight: getVal(styles.borderRightWidth),
        borderBottom: getVal(styles.borderBottomWidth),
        borderLeft: getVal(styles.borderLeftWidth),
        rowGap,
        colGap,
        gaps: distinctGaps,
        borderRadius: styles.borderRadius,
      })

      // Try to get a meaningful name
      const primitiveName = element.getAttribute('data-primitive')
      let name = primitiveName || element.tagName.toLowerCase()

      if (!primitiveName) {
        if (element.id) name += `#${element.id}`
        if (element.className && typeof element.className === 'string') {
          const classes = element.className
            .split(' ')
            .filter(c => c !== 'debug-mode-active')
            .join('.')
          if (classes) name += `.${classes.split(' ')[0]}` // Simplify class display to just first one
        }
      }

      setTargetName(name)
      setFileInfo(getFileInfo(element))
    }

    window.addEventListener('mousemove', handleMouseMove, true)
    return () => window.removeEventListener('mousemove', handleMouseMove, true)
  }, [])

  if (!targetBox) return null

  // Calculate absolute positions for layers
  // Margin Box (Outer most)
  // Actual element rect includes border + padding + content.
  // Margin is outside the rect.

  // Note: getBoundingClientRect returns the border-box (content + padding + border).
  // So margin is outside of `targetBox.top/left/width/height`.

  const { top, left, width, height, gaps, rowGap, colGap } = targetBox

  // Margin Box
  const marginTopH = targetBox.marginTop
  const marginBottomH = targetBox.marginBottom
  const marginLeftW = targetBox.marginLeft
  const marginRightW = targetBox.marginRight

  // Border Box (This is exactly top/left/width/height)

  // Padding Box (Inside border)
  const borderTop = targetBox.borderTop
  const borderLeft = targetBox.borderLeft
  const borderRight = targetBox.borderRight
  const borderBottom = targetBox.borderBottom

  const paddingBoxTop = top + borderTop
  const paddingBoxLeft = left + borderLeft
  const paddingBoxWidth = width - borderLeft - borderRight
  const paddingBoxHeight = height - borderTop - borderBottom

  // Content Box (Inside padding)
  const paddingTop = targetBox.paddingTop
  const paddingLeft = targetBox.paddingLeft
  const paddingRight = targetBox.paddingRight
  const paddingBottom = targetBox.paddingBottom

  const contentBoxTop = paddingBoxTop + paddingTop
  const contentBoxLeft = paddingBoxLeft + paddingLeft
  const contentBoxWidth = paddingBoxWidth - paddingLeft - paddingRight
  const contentBoxHeight = paddingBoxHeight - paddingTop - paddingBottom

  // Tooltip Content Formatting
  const dims = `${Math.round(width)} × ${Math.round(height)}`

  // Padding shorthand
  let padInfo = ''
  if (paddingTop + paddingRight + paddingBottom + paddingLeft > 0) {
    if (paddingTop === paddingRight && paddingTop === paddingBottom && paddingTop === paddingLeft) {
      padInfo = `p: ${paddingTop}`
    } else {
      // simplified: just show distinct ones or just 'p'
      padInfo = `p: ${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`
    }
  }

  // Gap shorthand
  let gapInfo = ''
  if (rowGap > 0 || colGap > 0) {
    if (rowGap === colGap) gapInfo = `g: ${rowGap}`
    else gapInfo = `g: ${rowGap}/${colGap}`
  }

  return (
    <div
      id="inspector-overlay-root"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 99999,
      }}
    >
      {/* Render Margins (4 separate boxes to avoid overlapping the central element if transparent) */}
      {/* Top Margin */}
      {marginTopH > 0 && (
        <Box
          top={top - marginTopH}
          left={left}
          width={width}
          height={marginTopH}
          bg={COLORS.margin}
        />
      )}
      {/* Bottom Margin */}
      {marginBottomH > 0 && (
        <Box
          top={top + height}
          left={left}
          width={width}
          height={marginBottomH}
          bg={COLORS.margin}
        />
      )}
      {/* Left Margin (includes corner areas? usually margin doesn't fill corners unless block... let's keep simple strips) */}
      {/* Actually CSS margin is around the box. Let's simplfy and just draw 4 strips. */}
      {marginLeftW > 0 && (
        <Box
          top={top - marginTopH}
          left={left - marginLeftW}
          width={marginLeftW}
          height={height + marginTopH + marginBottomH}
          bg={COLORS.margin}
        />
      )}
      {marginRightW > 0 && (
        <Box
          top={top - marginTopH}
          left={left + width}
          width={marginRightW}
          height={height + marginTopH + marginBottomH}
          bg={COLORS.margin}
        />
      )}

      {/* Content/Padding/Border Visualization */}
      {/* We can stack them: Border(Yellow) -> Padding(Green) -> Content(Blue) */}
      {/* Since they are nested, we can just draw them on top of each other if sizes match. */}

      {/* Border Box (Base) */}
      <Box top={top} left={left} width={width} height={height} bg={COLORS.border} />

      {/* Padding Box (Overlays Border Box) */}
      {paddingBoxWidth > 0 && paddingBoxHeight > 0 && (
        <Box
          top={paddingBoxTop}
          left={paddingBoxLeft}
          width={paddingBoxWidth}
          height={paddingBoxHeight}
          bg={COLORS.padding}
        />
      )}

      {/* Content Box (Overlays Padding Box) */}
      {contentBoxWidth > 0 && contentBoxHeight > 0 && (
        <Box
          top={contentBoxTop}
          left={contentBoxLeft}
          width={contentBoxWidth}
          height={contentBoxHeight}
          bg={COLORS.content}
        />
      )}

      {/* Gap Visualization - Subtler Hatching */}
      {gaps &&
        gaps.map((g, i) => (
          <div
            key={`gap-${i}`}
            style={{
              position: 'absolute',
              top: g.top,
              left: g.left,
              width: g.width,
              height: g.height,
              backgroundColor: COLORS.gap,
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)`,
              pointerEvents: 'none',
              zIndex: 10005,
            }}
          />
        ))}

      {/* Tooltip - Premium Dark Mode */}
      <div
        style={{
          position: 'absolute',
          top: top - 36 > 0 ? top - 36 : top + height + 8,
          left: left,
          background: 'rgba(23, 23, 23, 0.95)', // Neutral-900 with opacity
          color: '#fff',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 100001,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap',
        }}
      >
        {fileInfo && (
          <>
            <span style={{ color: '#60A5FA', fontWeight: 600 }}>{fileInfo}</span>
            <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
          </>
        )}
        <span style={{ color: '#e5e5e5' }}>{targetName}</span>
        <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
        <span>{dims}</span>

        {padInfo && (
          <>
            <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ color: '#34D399' }}>{padInfo}</span>
          </>
        )}

        {gapInfo && (
          <>
            <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ color: '#A78BFA' }}>{gapInfo}</span>
          </>
        )}

        {targetBox.borderRadius && targetBox.borderRadius !== '0px' && (
          <>
            <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ color: '#F472B6' }}>r: {parseFloat(targetBox.borderRadius)}</span>
          </>
        )}
      </div>
    </div>
  )
}
// Helper to extract file info
function getFileInfo(element: HTMLElement): string | null {
  const source = getDebugSource(element)
  if (!source) return null
  const fileName = source.fileName.split('/').pop() || source.fileName
  return `${fileName}:${source.lineNumber}`
}
