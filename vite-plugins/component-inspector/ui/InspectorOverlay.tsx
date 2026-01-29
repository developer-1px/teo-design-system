import React, { useEffect, useState, useCallback } from 'react'
import { getDebugSource, getComponentStack } from './utils'

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
  rowGap: number
  colGap: number
  gaps?: Array<{ top: number; left: number; width: number; height: number }>
  borderRadius?: string
  display: string
}

const Box = ({
  top,
  left,
  width,
  height,
  bg,
  border,
  borderRadius,
}: {
  top: number
  left: number
  width: number
  height: number
  bg?: string
  border?: string
  borderRadius?: string
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
      borderRadius: borderRadius && borderRadius !== '0px' ? borderRadius : undefined,
      pointerEvents: 'none',
      boxSizing: 'border-box',
      zIndex: 10000,
    }}
  />
)

export const InspectorOverlay: React.FC<{ activeElement: HTMLElement | null }> = ({ activeElement }) => {
  const [targetBox, setTargetBox] = useState<BoxModel | null>(null)
  const [targetName, setTargetName] = useState<string>('')
  const [fileInfo, setFileInfo] = useState<string | null>(null)
  const [componentStack, setComponentStack] = useState<string[]>([])
  const [loc, setLoc] = useState<number | undefined>()
  const [isExpanded, setIsExpanded] = useState(false)

  const updateBox = useCallback(() => {
    if (!activeElement || activeElement === document.body || activeElement.closest('#inspector-overlay-root')) {
      setTargetBox(null)
      return
    }

    const element = (activeElement.closest('[data-primitive]') as HTMLElement) || (activeElement.closest('svg') as unknown as HTMLElement) || activeElement
    const styles = window.getComputedStyle(element)
    const display = styles.display
    const getVal = (val: string) => parseFloat(val) || 0

    let rect = element.getBoundingClientRect()

    if (display === 'contents') {
      const children = Array.from(element.children)
      if (children.length > 0) {
        let minTop = Infinity, minLeft = Infinity, maxBottom = -Infinity, maxRight = -Infinity
        children.forEach(child => {
          const r = child.getBoundingClientRect()
          if (r.width === 0 && r.height === 0) return
          minTop = Math.min(minTop, r.top)
          minLeft = Math.min(minLeft, r.left)
          maxBottom = Math.max(maxBottom, r.bottom)
          maxRight = Math.max(maxRight, r.right)
        })

        if (minTop !== Infinity) {
          rect = {
            top: minTop,
            left: minLeft,
            bottom: maxBottom,
            right: maxRight,
            width: maxRight - minLeft,
            height: maxBottom - minTop,
            x: minLeft,
            y: minTop,
            toJSON: () => { }
          } as any
        }
      }
    }

    const gaps: Array<{ top: number; left: number; width: number; height: number }> = []
    const isFlex = display === 'flex' || display === 'inline-flex'
    const isGrid = display === 'grid' || display === 'inline-grid'
    const rowGap = getVal(styles.rowGap) || getVal(styles.gap)
    const colGap = getVal(styles.columnGap) || getVal(styles.gap)

    if ((isFlex || isGrid) && (rowGap > 0 || colGap > 0)) {
      const children = Array.from(element.children) as HTMLElement[]
      if (children.length > 1) {
        for (let i = 0; i < children.length; i++) {
          const current = children[i].getBoundingClientRect()
          for (let j = 0; j < children.length; j++) {
            if (i === j) continue
            const next = children[j].getBoundingClientRect()
            const verticalOverlap = Math.max(0, Math.min(current.bottom, next.bottom) - Math.max(current.top, next.top))
            if (verticalOverlap > 0 && colGap > 0 && next.left > current.right && Math.abs(next.left - current.right - colGap) < 2) {
              gaps.push({
                top: Math.min(current.top, next.top) + window.scrollY,
                left: current.right + window.scrollX,
                width: next.left - current.right,
                height: Math.max(current.height, next.height),
              })
            }
            const horizontalOverlap = Math.max(0, Math.min(current.right, next.right) - Math.max(current.left, next.left))
            if (horizontalOverlap > 0 && rowGap > 0 && next.top > current.bottom && Math.abs(next.top - current.bottom - rowGap) < 2) {
              gaps.push({
                top: current.bottom + window.scrollY,
                left: Math.min(current.left, next.left) + window.scrollX,
                width: Math.max(current.width, next.width),
                height: next.top - current.bottom,
              })
            }
          }
        }
      }
    }

    const distinctGaps: typeof gaps = []
    gaps.forEach(g => {
      if (!distinctGaps.some(dg => Math.abs(dg.top - g.top) < 1 && Math.abs(dg.left - g.left) < 1 && Math.abs(dg.width - g.width) < 1 && Math.abs(dg.height - g.height) < 1)) {
        distinctGaps.push(g)
      }
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
      display
    })

    const name = element.getAttribute('data-primitive') || ''
    setTargetName(name)

    const source = getDebugSource(element)
    if (source) {
      setFileInfo(`${source.fileName}:${source.lineNumber}`)
      setLoc(source.loc)
    } else {
      setFileInfo(null)
      setLoc(undefined)
    }

    setComponentStack(getComponentStack(element))
    setIsExpanded(false)
  }, [activeElement])

  useEffect(() => {
    updateBox()
    window.addEventListener('scroll', updateBox, true)
    window.addEventListener('resize', updateBox, true)
    return () => {
      window.removeEventListener('scroll', updateBox, true)
      window.removeEventListener('resize', updateBox, true)
    }
  }, [updateBox])

  if (!targetBox) return null

  const { top, left, width, height, gaps, rowGap, colGap } = targetBox
  const marginTopH = targetBox.marginTop
  const marginBottomH = targetBox.marginBottom
  const marginLeftW = targetBox.marginLeft
  const marginRightW = targetBox.marginRight

  const borderTop = targetBox.borderTop
  const borderLeft = targetBox.borderLeft
  const borderRight = targetBox.borderRight
  const borderBottom = targetBox.borderBottom

  const paddingBoxTop = top + borderTop
  const paddingBoxLeft = left + borderLeft
  const paddingBoxWidth = width - borderLeft - borderRight
  const paddingBoxHeight = height - borderTop - borderBottom

  const paddingTop = targetBox.paddingTop
  const paddingLeft = targetBox.paddingLeft
  const paddingRight = targetBox.paddingRight
  const paddingBottom = targetBox.paddingBottom

  const contentBoxTop = paddingBoxTop + paddingTop
  const contentBoxLeft = paddingBoxLeft + paddingLeft
  const contentBoxWidth = paddingBoxWidth - paddingLeft - paddingRight
  const contentBoxHeight = paddingBoxHeight - paddingTop - paddingBottom

  const dims = `${Math.round(width)} × ${Math.round(height)}`

  let mInfo = ''
  if (marginTopH + marginRightW + marginBottomH + marginLeftW > 0) {
    if (marginTopH === marginRightW && marginTopH === marginBottomH && marginTopH === marginLeftW) {
      mInfo = `m: ${marginTopH}`
    } else {
      mInfo = `m: ${marginTopH} ${marginRightW} ${marginBottomH} ${marginLeftW}`
    }
  }

  let padInfo = ''
  if (paddingTop + paddingRight + paddingBottom + paddingLeft > 0) {
    if (paddingTop === paddingRight && paddingTop === paddingBottom && paddingTop === paddingLeft) {
      padInfo = `p: ${paddingTop}`
    } else {
      padInfo = `p: ${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`
    }
  }

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
      {/* Margins */}
      {marginTopH > 0 && <Box top={top - marginTopH} left={left} width={width} height={marginTopH} bg={COLORS.margin} />}
      {marginBottomH > 0 && <Box top={top + height} left={left} width={width} height={marginBottomH} bg={COLORS.margin} />}
      {marginLeftW > 0 && <Box top={top - marginTopH} left={left - marginLeftW} width={marginLeftW} height={height + marginTopH + marginBottomH} bg={COLORS.margin} />}
      {marginRightW > 0 && <Box top={top - marginTopH} left={left + width} width={marginRightW} height={height + marginTopH + marginBottomH} bg={COLORS.margin} />}

      {/* Border Box */}
      <Box top={top} left={left} width={width} height={height} bg={COLORS.border} borderRadius={targetBox.borderRadius} />

      {/* Padding Box */}
      {paddingBoxWidth > 0 && paddingBoxHeight > 0 && (
        <Box top={paddingBoxTop} left={paddingBoxLeft} width={paddingBoxWidth} height={paddingBoxHeight} bg={COLORS.padding} />
      )}

      {/* Content Box */}
      {contentBoxWidth > 0 && contentBoxHeight > 0 && (
        <Box top={contentBoxTop} left={contentBoxLeft} width={contentBoxWidth} height={contentBoxHeight} bg={COLORS.content} />
      )}

      {/* Gaps */}
      {gaps && gaps.map((g, i) => (
        <div key={`gap-${i}`} style={{
          position: 'absolute', top: g.top, left: g.left, width: g.width, height: g.height,
          backgroundColor: COLORS.gap, backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)`,
          pointerEvents: 'none', zIndex: 10005,
        }} />
      ))}

      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          top: top - (componentStack.length > 0 ? 76 : 58) > 0 ? top - (componentStack.length > 0 ? 76 : 58) : top + height + 8,
          left: left,
          background: 'rgba(23, 23, 23, 0.95)',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 100001,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {fileInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontWeight: 600, fontSize: '11px', opacity: 0.9 }}>
            <span>{fileInfo}</span>
            {loc !== undefined && (
              <span style={{
                color: loc > 200 ? '#EF4444' : '#94A3B8',
                fontSize: '10px',
                fontWeight: loc > 200 ? 700 : 400,
                background: loc > 200 ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                padding: loc > 200 ? '1px 4px' : '0',
                borderRadius: '4px'
              }}>
                ({loc} lines) {loc > 200 ? '⚠️' : ''}
              </span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {targetName && (
            <>
              <span style={{ color: '#e5e5e5' }}>{targetName}</span>
              <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
            </>
          )}
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>{targetBox.display}</span>
          <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
          <span>{dims}</span>
          {mInfo && <><span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} /><span style={{ color: '#F59E0B' }}>{mInfo}</span></>}
          {padInfo && <><span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} /><span style={{ color: '#34D399' }}>{padInfo}</span></>}
          {gapInfo && <><span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} /><span style={{ color: '#A78BFA' }}>{gapInfo}</span></>}
          {targetBox.borderRadius && targetBox.borderRadius !== '0px' && <><span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} /><span style={{ color: '#F472B6' }}>r: {targetBox.borderRadius}</span></>}
        </div>

        {componentStack.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              color: '#9ca3af',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '4px',
              marginTop: '2px',
              pointerEvents: 'auto', // Allow clicking the breadcrumbs
            }}
          >
            {(!isExpanded && componentStack.length > 3 ? ['...', ...componentStack.slice(-3)] : componentStack).map((name, i, arr) => (
              <React.Fragment key={i}>
                <span
                  onClick={() => name === '...' && setIsExpanded(true)}
                  style={{
                    color: i === arr.length - 1 ? '#F472B6' : 'inherit',
                    fontWeight: i === arr.length - 1 ? 600 : 400,
                    cursor: name === '...' ? 'pointer' : 'default',
                    textDecoration: name === '...' ? 'underline' : 'none',
                  }}
                >
                  {name}
                </span>
                {i < arr.length - 1 && <span style={{ opacity: 0.5 }}>›</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getFileInfo(element: HTMLElement): string | null {
  const source = getDebugSource(element)
  if (!source) return null
  return `${source.fileName}:${source.lineNumber}`
}
