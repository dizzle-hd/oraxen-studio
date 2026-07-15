import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import type { AssetReference } from '../../domain/types/asset'

interface ItemIconPreviewProps {
  textures: AssetReference[]
  size?: number
}

/**
 * `generate_model` items are just layered PNGs composited bottom-to-top -
 * that's cheap enough to draw with Canvas2D per list row, no need for a
 * WebGL/three.js context (that's reserved for real custom 3D models).
 */
export function ItemIconPreview({ textures, size = 48 }: ItemIconPreviewProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, size, size)
    if (textures.length === 0) return

    let cancelled = false
    ;(async () => {
      for (const texture of textures) {
        if (!texture.absPath) continue
        const img = new Image()
        img.src = window.oraxenStudio.assetUrl(texture.absPath)
        await new Promise<void>((resolve) => {
          img.onload = () => resolve()
          img.onerror = () => resolve()
        })
        if (cancelled) return
        ctx.drawImage(img, 0, 0, size, size)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [textures, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated', background: 'repeating-conic-gradient(#2b2b2b 0% 25%, #232323 0% 50%) 50% / 12px 12px' }}
    />
  )
}
