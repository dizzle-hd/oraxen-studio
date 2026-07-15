import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Alert, Box } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { parseBlockModel, type ParsedModel } from '../../domain/minecraft/blockModelParser'

interface ModelPreview3DProps {
  modelAbsPath: string
}

/** Untextured box preview of an imported Blockbench model - see blockModelParser.ts for scope note. */
export function ModelPreview3D({ modelAbsPath }: ModelPreview3DProps): ReactElement {
  const { t } = useTranslation('items')
  const [model, setModel] = useState<ParsedModel | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    window.oraxenStudio.fs
      .readTextFile(modelAbsPath)
      .then((text) => {
        if (!cancelled) setModel(parseBlockModel(text))
      })
      .catch((err) => !cancelled && setError(String(err)))
    return () => {
      cancelled = true
    }
  }, [modelAbsPath])

  if (error) {
    return <Alert color="red">{error}</Alert>
  }
  if (!model) {
    return <Box h={240} />
  }

  return (
    <Box h={240} style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: 8 }}>
      <Canvas camera={{ position: [24, 24, 24], fov: 35 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <group position={[-8, -8, -8]}>
          {model.elements.map((el, i) => {
            const size: [number, number, number] = [
              (el.to[0] - el.from[0]) / 16,
              (el.to[1] - el.from[1]) / 16,
              (el.to[2] - el.from[2]) / 16
            ]
            const center: [number, number, number] = [
              (el.from[0] + el.to[0]) / 32,
              (el.from[1] + el.to[1]) / 32,
              (el.from[2] + el.to[2]) / 32
            ]
            return (
              <mesh key={i} position={center}>
                <boxGeometry args={size} />
                <meshStandardMaterial color="#7c9cff" />
              </mesh>
            )
          })}
        </group>
        <OrbitControls />
      </Canvas>
      {model.elements.length === 0 && (
        <Alert color="yellow" mt={4}>
          {t('pack.customModel')}: {t('assets.model')} — 0 elements
        </Alert>
      )}
    </Box>
  )
}
