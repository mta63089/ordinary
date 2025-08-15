import { Suspense } from "react"
import { Html, OrbitControls, useProgress } from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import { motion } from "framer-motion-3d"
import { GLTFLoader } from "three/examples/jsm/Addons.js"

function Loader() {
  const { progress } = useProgress()
  console.log(progress)
  return <Html center>{progress} % loaded</Html>
}

export function Television() {
  const gltf = useLoader(GLTFLoader, "/models/television.glb")

  return (
    <Suspense fallback={<Loader />}>
      <Canvas shadows>
        <motion.primitive object={gltf.scene} position={[0, 1, 0]} />
        <OrbitControls target={[0, 1, 0]} />
      </Canvas>
    </Suspense>
  )
}

export function Scene() {}
