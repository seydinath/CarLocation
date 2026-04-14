import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Environment, MeshReflectorMaterial, OrbitControls, useGLTF } from '@react-three/drei';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';

function RealCarModel({ url }) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  return <primitive object={clonedScene} rotation={[0, Math.PI, 0]} />;
}

function ProceduralFallbackCar() {
  return (
    <group position={[0, -0.45, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[2.5, 0.48, 1.12]} />
        <meshStandardMaterial color="#b8c2cc" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 0.52, 0]}>
        <boxGeometry args={[1.2, 0.38, 1.04]} />
        <meshStandardMaterial color="#10141a" metalness={0.35} roughness={0.2} transparent opacity={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.92, -0.08, 0.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 26]} />
        <meshStandardMaterial color="#121212" roughness={0.88} metalness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.92, -0.08, -0.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 26]} />
        <meshStandardMaterial color="#121212" roughness={0.88} metalness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.92, -0.08, 0.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 26]} />
        <meshStandardMaterial color="#121212" roughness={0.88} metalness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.92, -0.08, -0.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 26]} />
        <meshStandardMaterial color="#121212" roughness={0.88} metalness={0.2} />
      </mesh>
    </group>
  );
}

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modelKey !== this.props.modelKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ShowroomFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.74, 0]} receiveShadow>
      <circleGeometry args={[7.2, 96]} />
      <MeshReflectorMaterial
        blur={[280, 72]}
        mixBlur={0.85}
        mixStrength={1.2}
        resolution={1024}
        mirror={0.8}
        roughness={0.12}
        color="#0f1218"
        metalness={0.75}
        depthScale={0.03}
        minDepthThreshold={0.6}
        maxDepthThreshold={1.35}
      />
    </mesh>
  );
}

function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight intensity={0.35} groundColor={0x07090d} color={0xdfe8ff} />

      <directionalLight
        castShadow
        position={[6.5, 7.8, 4.8]}
        intensity={1.35}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <spotLight position={[-6.2, 4.8, 4.2]} intensity={1.1} angle={0.42} penumbra={0.6} color={0xfff4de} />
      <spotLight position={[5.8, 3.6, -6.8]} intensity={0.8} angle={0.48} penumbra={0.7} color={0xbad8ff} />
      <pointLight position={[0, 2.2, -4.6]} intensity={0.5} color={0x8bb7ff} />
    </>
  );
}

export default function CarViewer3D({ car }) {
  const sketchfabUrl = car?.sketchfabEmbed;
  const modelUrl = useMemo(() => car?.model3d || '/models/Ferrari.glb', [car?.model3d]);
  const modelFrame = useMemo(() => {
    const frames = {
      '/models/CarConcept.glb': { position: [0, -0.52, 0], margin: 1.08 },
      '/models/ClearCoatCarPaint.glb': { position: [0, -0.46, 0], margin: 1.08 },
      '/models/Ferrari.glb': { position: [0, -0.44, 0], margin: 1.08 },
      '/models/ToyCar.glb': { position: [0, -0.45, 0], margin: 1.08 }
    };

    return frames[modelUrl] || { position: [0, -0.45, 0], margin: 1.08 };
  }, [modelUrl]);

  if (sketchfabUrl) {
    return (
      <div className="car-viewer-3d sketchfab-viewer">
        <iframe
          title={`${car?.brand || 'car'}-sketchfab`}
          frameBorder="0"
          allowFullScreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src={sketchfabUrl}
        />
      </div>
    );
  }

  return (
    <div className="car-viewer-3d">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4.2, 2.2, 4.2], fov: 38 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          outputColorSpace: SRGBColorSpace
        }}
      >
        <CinematicLights />

        <Suspense fallback={null}>
          <ModelErrorBoundary modelKey={modelUrl} fallback={<ProceduralFallbackCar />}>
            <Bounds fit clip observe margin={modelFrame.margin}>
              <group position={modelFrame.position}>
                <RealCarModel url={modelUrl} />
              </group>
            </Bounds>
          </ModelErrorBoundary>
        </Suspense>

        <ShowroomFloor />
        <Environment preset="warehouse" background={false} />
        <OrbitControls
          enablePan={false}
          minDistance={2.2}
          maxDistance={5.8}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.9}
          target={[0, 0, 0]}
          rotateSpeed={0.8}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/Ferrari.glb');
