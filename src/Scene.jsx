import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Float, Trail } from '@react-three/drei'
import * as THREE from 'three'

// Floating neural nodes
function NeuralNodes({ scrollY }) {
  const groupRef = useRef()
  const count = 80

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.8 + Math.random() * 0.8
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.12 + scrollY * 0.002
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.15 + scrollY * 0.001
  })

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7C5CFC"
          size={0.04}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
        />
      </Points>
    </group>
  )
}

// Connection lines between points
function ConnectionLines({ scrollY }) {
  const ref = useRef()
  const lines = useMemo(() => {
    const pts = []
    for (let i = 0; i < 24; i++) {
      const theta1 = Math.random() * Math.PI * 2
      const phi1 = Math.acos(2 * Math.random() - 1)
      const r1 = 1.9 + Math.random() * 0.4
      const theta2 = Math.random() * Math.PI * 2
      const phi2 = Math.acos(2 * Math.random() - 1)
      const r2 = 1.9 + Math.random() * 0.4
      pts.push([
        new THREE.Vector3(r1 * Math.sin(phi1) * Math.cos(theta1), r1 * Math.sin(phi1) * Math.sin(theta1), r1 * Math.cos(phi1)),
        new THREE.Vector3(r2 * Math.sin(phi2) * Math.cos(theta2), r2 * Math.sin(phi2) * Math.sin(theta2), r2 * Math.cos(phi2)),
      ])
    }
    return pts
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.12 + scrollY * 0.002
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.15 + scrollY * 0.001
  })

  return (
    <group ref={ref}>
      {lines.map((pair, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(pair)
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#00D9B1" transparent opacity={0.15} />
          </line>
        )
      })}
    </group>
  )
}

// Core glowing orb
function CoreOrb({ scrollY }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.distort = 0.3 + Math.sin(t * 0.5) * 0.1
    // Scale down as user scrolls
    const scale = Math.max(0.3, 1 - scrollY * 0.001)
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          color="#1a0a3d"
          emissive="#7C5CFC"
          emissiveIntensity={0.4}
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  )
}

// Orbiting ring
function Ring({ scrollY }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.PI / 2.5 + scrollY * 0.003
    ref.current.rotation.z = t * 0.2
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.012, 8, 120]} />
      <meshBasicMaterial color="#7C5CFC" transparent opacity={0.35} />
    </mesh>
  )
}

function Ring2({ scrollY }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.PI / 3 + scrollY * 0.002
    ref.current.rotation.y = t * 0.15
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.6, 0.008, 8, 120]} />
      <meshBasicMaterial color="#00D9B1" transparent opacity={0.2} />
    </mesh>
  )
}

export default function Scene({ scrollY }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#7C5CFC" />
      <pointLight position={[-5, -3, -5]} intensity={1} color="#00D9B1" />
      <pointLight position={[0, 5, -5]} intensity={0.8} color="#FF4D6D" />
      <CoreOrb scrollY={scrollY} />
      <Ring scrollY={scrollY} />
      <Ring2 scrollY={scrollY} />
      <NeuralNodes scrollY={scrollY} />
      <ConnectionLines scrollY={scrollY} />
    </>
  )
}
