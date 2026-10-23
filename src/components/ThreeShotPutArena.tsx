import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Play,
  RotateCcw,
  Camera,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Volume2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Flag,
  Move,
  ZoomIn,
  AlertTriangle,
  Info
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { GLIDE_STEPS, LESSON_INFO } from '../data/lessonData';

export const ThreeShotPutArena: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Simulation & Athlete State
  const [shotGender, setShotGender] = useState<'women' | 'men'>('women');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingFullGlide, setIsPlayingFullGlide] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 1.0 or 0.5 (slow-motion)
  const [simulationMode, setSimulationMode] = useState<'legal' | 'foul_stop_board' | 'foul_front_exit'>('legal');
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const [showTrajectoryArc, setShowTrajectoryArc] = useState<boolean>(true);
  const [throwJudgment, setThrowJudgment] = useState<{
    legal: boolean;
    title: string;
    reason: string;
    ruleCode: string;
  } | null>(null);

  const [cameraPreset, setCameraPreset] = useState<'side' | 'cinematic' | 'top' | 'stopBoard' | 'referee'>('side');
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Procedural Realistic Athlete Model Parts
  const athleteGroupRef = useRef<THREE.Group | null>(null);
  const torsoRef = useRef<THREE.Group | null>(null);
  const neckHeadRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightLegRef = useRef<THREE.Group | null>(null);
  const leftLegRef = useRef<THREE.Group | null>(null);
  const shotInHandRef = useRef<THREE.Mesh | null>(null);
  const freeShotMeshRef = useRef<THREE.Mesh | null>(null);
  const trajectoryCurveMeshRef = useRef<THREE.Line | null>(null);
  const impactMarkRef = useRef<THREE.Mesh | null>(null);

  // Referee Model Parts
  const refereeGroupRef = useRef<THREE.Group | null>(null);
  const refArmGroupRef = useRef<THREE.Group | null>(null);
  const refWhiteFlagRef = useRef<THREE.Mesh | null>(null);
  const refRedFlagRef = useRef<THREE.Mesh | null>(null);

  // Dynamic 3D Jumbotron Canvas Texture
  const jumbotronCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const jumbotronTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Camera Orbit & Navigation Refs
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 4.8,
    theta: 0.65,
    phi: 1.15,
  });
  const targetCamLookRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.1, -0.3));
  const currentCamLookRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.1, -0.3));

  // Animation timeline state
  const glideTimeRef = useRef<number>(0);
  const isBallisticActiveRef = useRef<boolean>(false);
  const ballisticTimeRef = useRef<number>(0);
  const ballisticStartRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const simulationModeRef = useRef<'legal' | 'foul_stop_board' | 'foul_front_exit'>('legal');

  // Keep ref in sync
  useEffect(() => {
    simulationModeRef.current = simulationMode;
  }, [simulationMode]);

  const currentStep = GLIDE_STEPS[currentStepIndex];

  // Helper to update 3D Jumbotron screen in real time
  const updateJumbotron = useCallback((phaseName: string, speedStr: string, angleStr: string, statusStr: string, statusColor: string) => {
    const canvas = jumbotronCanvasRef.current;
    const texture = jumbotronTextureRef.current;
    if (!canvas || !texture) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 256);

    // Glowing border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 504, 248);

    // Header bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(6, 6, 500, 48);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px Cairo, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('بطولة ألعاب القوى المدرسية - سلطنة عُمان', 490, 38);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('LIVE 3D REPLAY', 20, 36);

    // Main content: Phase name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(phaseName, 256, 100);

    // Kinetic parameters (Angle & Speed)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Cairo, sans-serif';
    ctx.fillText('زاوية الانطلاق المثالية', 140, 140);
    ctx.fillText('سرعة الانطلاق التقديرية', 372, 140);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(angleStr, 140, 175);
    ctx.fillText(speedStr, 372, 175);

    // Status Banner
    ctx.fillStyle = statusColor;
    ctx.fillRect(20, 196, 472, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(statusStr, 256, 228);

    texture.needsUpdate = true;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    // 1. Scene with crisp daylight sports atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e0f2fe'); // Clear stadium sky
    scene.fog = new THREE.FogExp2('#e0f2fe', 0.010);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    cameraRef.current = camera;

    // 3. Renderer with ACES ToneMapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Daylight & Stadium Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x86efac, 0.8);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.4);
    sunLight.position.set(12, 22, 10);
    sunLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 60;
      sunLight.shadow.bias = -0.0003;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);

    // 6. Canvas Textures
    // A) Athlete Singlet BIB Texture (Front & Back)
    const bibCanvas = document.createElement('canvas');
    bibCanvas.width = 512;
    bibCanvas.height = 512;
    const bibCtx = bibCanvas.getContext('2d');
    if (bibCtx) {
      // Red base jersey
      bibCtx.fillStyle = '#dc2626';
      bibCtx.fillRect(0, 0, 512, 512);

      // White Athletic Panel
      bibCtx.fillStyle = '#ffffff';
      bibCtx.fillRect(60, 80, 392, 240);
      bibCtx.lineWidth = 8;
      bibCtx.strokeStyle = '#10b981'; // Green border (Omani athletic badge)
      bibCtx.strokeRect(60, 80, 392, 240);

      // Ribbon header
      bibCtx.fillStyle = '#dc2626';
      bibCtx.fillRect(68, 88, 376, 24);
      bibCtx.fillStyle = '#10b981';
      bibCtx.fillRect(68, 114, 376, 24);

      // Big BIB number
      bibCtx.fillStyle = '#0f172a';
      bibCtx.font = 'bold 96px monospace';
      bibCtx.textAlign = 'center';
      bibCtx.fillText('2026', 256, 225);

      // Team Label
      bibCtx.font = 'bold 30px Cairo, sans-serif';
      bibCtx.fillText('OMAN ATHLETICS', 256, 290);
    }
    const bibTexture = new THREE.CanvasTexture(bibCanvas);
    bibTexture.colorSpace = THREE.SRGBColorSpace;

    // B) Natural Infield Grass Texture
    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = 512;
    grassCanvas.height = 512;
    const gCtx = grassCanvas.getContext('2d');
    if (gCtx) {
      gCtx.fillStyle = '#15803d';
      gCtx.fillRect(0, 0, 512, 512);
      // Mower stadium stripes
      gCtx.fillStyle = '#16a34a';
      for (let i = 0; i < 512; i += 64) {
        gCtx.fillRect(0, i, 512, 32);
      }
    }
    const grassTexture = new THREE.CanvasTexture(grassCanvas);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(8, 10);
    grassTexture.colorSpace = THREE.SRGBColorSpace;

    // C) Red Tartan Track Texture
    const tartanCanvas = document.createElement('canvas');
    tartanCanvas.width = 256;
    tartanCanvas.height = 256;
    const tCtx = tartanCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = '#b91c1c';
      tCtx.fillRect(0, 0, 256, 256);
      tCtx.fillStyle = 'rgba(0,0,0,0.06)';
      for (let i = 0; i < 2000; i++) {
        tCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
      }
    }
    const tartanTexture = new THREE.CanvasTexture(tartanCanvas);
    tartanTexture.wrapS = THREE.RepeatWrapping;
    tartanTexture.wrapT = THREE.RepeatWrapping;
    tartanTexture.repeat.set(12, 12);
    tartanTexture.colorSpace = THREE.SRGBColorSpace;

    // D) 3D Stadium Jumbotron Screen Canvas
    const jumbotronCanvas = document.createElement('canvas');
    jumbotronCanvas.width = 512;
    jumbotronCanvas.height = 256;
    jumbotronCanvasRef.current = jumbotronCanvas;
    const jumbotronTexture = new THREE.CanvasTexture(jumbotronCanvas);
    jumbotronTexture.colorSpace = THREE.SRGBColorSpace;
    jumbotronTextureRef.current = jumbotronTexture;

    // 7. Ground Surfaces
    const tartanFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(65, 65),
      new THREE.MeshStandardMaterial({
        map: tartanTexture,
        roughness: 0.85,
        metalness: 0.05,
      })
    );
    tartanFloor.rotation.x = -Math.PI / 2;
    tartanFloor.receiveShadow = true;
    scene.add(tartanFloor);

    // Infield Grass Sector
    const grassFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 46),
      new THREE.MeshStandardMaterial({
        map: grassTexture,
        roughness: 0.85,
      })
    );
    grassFloor.rotation.x = -Math.PI / 2;
    grassFloor.position.set(0, 0.012, -23);
    grassFloor.receiveShadow = true;
    scene.add(grassFloor);

    // 8. Stadium Grandstands & Background Architecture
    const standsGroup = new THREE.Group();
    const seatColors = [0x2563eb, 0xdc2626, 0xffffff, 0x16a34a, 0xf59e0b];
    for (let tier = 0; tier < 8; tier++) {
      const standR = 30 + tier * 1.4;
      const standGeo = new THREE.CylinderGeometry(standR, standR + 0.5, 0.8, 64, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
      const standMat = new THREE.MeshStandardMaterial({
        color: seatColors[tier % seatColors.length],
        roughness: 0.8,
      });
      const standMesh = new THREE.Mesh(standGeo, standMat);
      standMesh.position.set(0, tier * 0.7 + 0.4, -5);
      standsGroup.add(standMesh);
    }

    // Stadium Canopy Roof Arch
    const roofCurve = new THREE.CylinderGeometry(44, 44, 12, 32, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const roofMesh = new THREE.Mesh(roofCurve, roofMat);
    roofMesh.position.set(0, 10, -5);
    standsGroup.add(roofMesh);
    scene.add(standsGroup);

    // 9. Four Stadium Floodlight Masts
    const mastGeo = new THREE.CylinderGeometry(0.2, 0.45, 18, 12);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
    const lampArrayGeo = new THREE.BoxGeometry(2.4, 1.8, 0.4);
    const lampArrayMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfffbeb,
      emissiveIntensity: 0.8,
    });

    [
      { x: -22, z: -15 },
      { x: 22, z: -15 },
      { x: -20, z: 12 },
      { x: 20, z: 12 },
    ].forEach((pos) => {
      const tower = new THREE.Group();
      tower.position.set(pos.x, 9, pos.z);
      const mast = new THREE.Mesh(mastGeo, mastMat);
      tower.add(mast);
      const lamps = new THREE.Mesh(lampArrayGeo, lampArrayMat);
      lamps.position.set(0, 9, 0);
      lamps.lookAt(0, 1, 0);
      tower.add(lamps);
      scene.add(tower);
    });

    // 10. Large In-Stadium 3D Jumbotron Video Screen (Facing Circle)
    const jumbotronGroup = new THREE.Group();
    jumbotronGroup.position.set(0, 5.2, -26);

    const jumbotronFrame = new THREE.Mesh(
      new THREE.BoxGeometry(8.6, 4.6, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 })
    );
    jumbotronGroup.add(jumbotronFrame);

    const jumbotronScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(8.2, 4.2),
      new THREE.MeshBasicMaterial({ map: jumbotronTexture })
    );
    jumbotronScreen.position.z = 0.22;
    jumbotronGroup.add(jumbotronScreen);

    // Support pillars for jumbotron
    [-3.2, 3.2].forEach((px) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 6, 16), mastMat);
      pillar.position.set(px, -2.5, 0);
      jumbotronGroup.add(pillar);
    });
    scene.add(jumbotronGroup);

    // Initial render of Jumbotron
    updateJumbotron(
      'المرحلة 1: الوقفة الابتدائية',
      '0.0 م/ث',
      '41.5°',
      'جاهز للتنفيذ - زحفة أوبراين القانونية',
      '#10b981'
    );

    // 11. Official Shot Put Circle (2.135m Diameter, Recessed 2cm)
    const circleRadius = 1.0675; // 2.135 / 2
    const concreteGeo = new THREE.CylinderGeometry(circleRadius, circleRadius, 0.04, 64);
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.7,
      metalness: 0.15,
    });
    const concreteFloor = new THREE.Mesh(concreteGeo, concreteMat);
    concreteFloor.position.set(0, 0.0, 0);
    concreteFloor.receiveShadow = true;
    scene.add(concreteFloor);

    // Outer Chrome Rim (>= 6mm thickness, polished steel)
    const rimGeo = new THREE.RingGeometry(circleRadius, circleRadius + 0.04, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.15,
      metalness: 0.95,
      side: THREE.DoubleSide,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = -Math.PI / 2;
    rimMesh.position.set(0, 0.022, 0);
    scene.add(rimMesh);

    // Mid Dividing Line & 75cm Back White Boundary Lines
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const midLineMesh = new THREE.Mesh(new THREE.PlaneGeometry(circleRadius * 2 + 1.5, 0.05), whiteMat);
    midLineMesh.rotation.x = -Math.PI / 2;
    midLineMesh.position.set(0, 0.023, 0);
    scene.add(midLineMesh);

    // 12. Official Curved Stop Board (1.21–1.23m inner chord, width 11.4cm, height 10cm, pure white)
    const boardArcAngle = 1.22 / circleRadius;
    const stopShape = new THREE.Shape();
    stopShape.absarc(0, 0, circleRadius, -boardArcAngle / 2, boardArcAngle / 2, false);
    stopShape.absarc(0, 0, circleRadius + 0.114, boardArcAngle / 2, -boardArcAngle / 2, true);
    stopShape.closePath();

    const stopGeo = new THREE.ExtrudeGeometry(stopShape, {
      depth: 0.10,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
    });
    const stopMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.05,
    });
    const stopBoard = new THREE.Mesh(stopGeo, stopMat);
    stopBoard.rotation.x = Math.PI / 2;
    stopBoard.rotation.z = Math.PI; // Face forward towards -Z sector
    stopBoard.position.set(0, 0.10, 0);
    stopBoard.castShadow = !isSoftwareGl;
    stopBoard.receiveShadow = true;
    scene.add(stopBoard);

    // 13. Sector Lines (34.92 degrees) & Distance Markers with 3D Flags
    const sectorAngleHalf = (34.92 / 2) * (Math.PI / 180);
    const secLen = 35;
    [-sectorAngleHalf, sectorAngleHalf].forEach((ang) => {
      const lineMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.06, secLen), whiteMat);
      lineMesh.rotation.x = -Math.PI / 2;
      lineMesh.rotation.z = ang;
      lineMesh.position.set(Math.sin(ang) * (secLen / 2), 0.024, -Math.cos(ang) * (secLen / 2));
      scene.add(lineMesh);
    });

    // Distance Arcs and 3D Metric Boards
    [10, 14, 18, 22].forEach((dist) => {
      const arcMesh = new THREE.Mesh(
        new THREE.RingGeometry(dist, dist + 0.05, 32, 1, -sectorAngleHalf + Math.PI / 2, sectorAngleHalf * 2),
        whiteMat
      );
      arcMesh.rotation.x = -Math.PI / 2;
      arcMesh.rotation.z = Math.PI;
      arcMesh.position.set(0, 0.024, 0);
      scene.add(arcMesh);

      // Distance Sign Board at boundary
      const signX = Math.sin(sectorAngleHalf) * dist + 0.5;
      const signZ = -Math.cos(sectorAngleHalf) * dist;

      const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8), mastMat);
      signPost.position.set(signX, 0.4, signZ);
      scene.add(signPost);

      const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.4, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
      );
      signBoard.position.set(signX, 0.8, signZ);
      signBoard.lookAt(0, 1, 0);
      scene.add(signBoard);
    });

    // 14. Highly Articulated Realistic 3D Athlete
    const athlete = new THREE.Group();
    athlete.position.set(0, 0, 0.7); // Start at back half of circle

    // Realistic Anatomical Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf3b896, // Realistic warm athletic skin
      roughness: 0.5,
      metalness: 0.05,
    });
    const singletMat = new THREE.MeshStandardMaterial({
      map: bibTexture,
      roughness: 0.65,
    });
    const shortsMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Dark Navy athletic compression shorts
      roughness: 0.7,
    });
    const shoesMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Track spikes blue
      roughness: 0.4,
    });
    const shoeSoleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });
    const socksMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
    });
    const wristWrapMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // White medical wrist support wrap
      roughness: 0.8,
    });
    const shotIronMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Polished cast-iron
      metalness: 0.95,
      roughness: 0.2,
    });

    // Pelvis / Hips Group
    const hipsGroup = new THREE.Group();
    hipsGroup.position.set(0, 0.95, 0);
    const hipsMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.24, 0.22), shortsMat);
    hipsGroup.add(hipsMesh);
    athlete.add(hipsGroup);

    // Torso with Contoured Athletic Chest & Singlet
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.25, 0);

    const chestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.16, 0.48, 16), singletMat);
    chestMesh.castShadow = !isSoftwareGl;
    torsoGroup.add(chestMesh);

    // Trapezius / Clavicle slope
    const trapMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.20, 0.12, 16), singletMat);
    trapMesh.position.set(0, 0.26, 0);
    torsoGroup.add(trapMesh);

    athlete.add(torsoGroup);
    torsoRef.current = torsoGroup;

    // Head, Neck & Expressive Athletic Features
    const neckHeadGroup = new THREE.Group();
    neckHeadGroup.position.set(0, 1.58, 0);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.14, 16), skinMat);
    neckHeadGroup.add(neckMesh);

    // Head
    const headGeo = new THREE.SphereGeometry(0.12, 24, 24);
    headGeo.scale(1, 1.15, 1.1);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(0, 0.14, 0.02);
    headMesh.castShadow = !isSoftwareGl;
    neckHeadGroup.add(headMesh);

    // Hair
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.126, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
    );
    hair.position.set(0, 0.15, 0);
    neckHeadGroup.add(hair);

    // Athletic Headband
    const headband = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.128, 0.035, 24), whiteMat);
    headband.position.set(0, 0.16, 0.02);
    neckHeadGroup.add(headband);

    // Facial Features (Nose, Brows)
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 8), skinMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0.14, 0.13);
    neckHeadGroup.add(nose);

    athlete.add(neckHeadGroup);
    neckHeadRef.current = neckHeadGroup;

    // RIGHT ARM: Holding Shot Put Firmly Against Neck / Chin
    const rightArm = new THREE.Group();
    rightArm.position.set(0.23, 1.48, 0);

    // Shoulder Deltoid
    const rDelt = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), skinMat);
    rightArm.add(rDelt);

    // Upper Arm
    const rUpper = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.18, 8, 16), skinMat);
    rUpper.position.set(0.02, -0.10, 0);
    rightArm.add(rUpper);

    // Forearm angled up to neck
    const rForearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.18, 8, 16), skinMat);
    rForearm.position.set(-0.11, -0.12, -0.05);
    rForearm.rotation.z = Math.PI / 2.8;
    rightArm.add(rForearm);

    // White Wrist Wrap / Support Band
    const rWristWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.05, 16), wristWrapMat);
    rWristWrap.position.set(-0.15, -0.07, -0.07);
    rWristWrap.rotation.z = Math.PI / 2.8;
    rightArm.add(rWristWrap);

    // Hand Palm
    const handPalm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.08), skinMat);
    handPalm.position.set(-0.18, -0.04, -0.08);
    rightArm.add(handPalm);

    // The Shot Put in athlete's hand
    const shotRadius = shotGender === 'women' ? 0.062 : 0.072;
    const shotInHand = new THREE.Mesh(new THREE.SphereGeometry(shotRadius, 32, 32), shotIronMat);
    shotInHand.position.set(-0.19, -0.01, -0.08);
    shotInHand.castShadow = !isSoftwareGl;
    rightArm.add(shotInHand);
    shotInHandRef.current = shotInHand;

    athlete.add(rightArm);
    rightArmRef.current = rightArm;

    // LEFT ARM: Counterbalance Equilibrium Arm
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.23, 1.48, 0);

    const lDelt = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), skinMat);
    leftArm.add(lDelt);

    const lUpper = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.18, 8, 16), skinMat);
    lUpper.position.set(-0.02, -0.12, 0.06);
    leftArm.add(lUpper);

    const lForearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.18, 8, 16), skinMat);
    lForearm.position.set(-0.08, -0.24, 0.18);
    lForearm.rotation.x = -Math.PI / 3;
    leftArm.add(lForearm);

    athlete.add(leftArm);
    leftArmRef.current = leftArm;

    // RIGHT LEG (Support & Drive Leg)
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.12, 0.88, 0);

    const rThigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.28, 8, 16), skinMat);
    rThigh.position.set(0, -0.16, 0);
    rightLeg.add(rThigh);

    const rKnee = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), skinMat);
    rKnee.position.set(0, -0.34, 0.01);
    rightLeg.add(rKnee);

    const rCalf = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.28, 8, 16), skinMat);
    rCalf.position.set(0, -0.52, 0);
    rightLeg.add(rCalf);

    // Ankle Sock
    const rSock = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.08, 16), socksMat);
    rSock.position.set(0, -0.66, 0.02);
    rightLeg.add(rSock);

    // Athletic Throwing Spikes
    const rShoeGroup = new THREE.Group();
    rShoeGroup.position.set(0, -0.72, 0.04);
    const rShoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.24), shoesMat);
    const rShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.025, 0.245), shoeSoleMat);
    rShoeSole.position.set(0, -0.045, 0);
    rShoeGroup.add(rShoeUpper);
    rShoeGroup.add(rShoeSole);
    rightLeg.add(rShoeGroup);

    athlete.add(rightLeg);
    rightLegRef.current = rightLeg;

    // LEFT LEG (Kicking & Balance Leg)
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.12, 0.88, 0);

    const lThigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.28, 8, 16), skinMat);
    lThigh.position.set(0, -0.16, 0);
    leftLeg.add(lThigh);

    const lKnee = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), skinMat);
    lKnee.position.set(0, -0.34, 0.01);
    leftLeg.add(lKnee);

    const lCalf = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.28, 8, 16), skinMat);
    lCalf.position.set(0, -0.52, 0);
    leftLeg.add(lCalf);

    const lSock = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.08, 16), socksMat);
    lSock.position.set(0, -0.66, 0.02);
    leftLeg.add(lSock);

    const lShoeGroup = new THREE.Group();
    lShoeGroup.position.set(0, -0.72, 0.04);
    const lShoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.24), shoesMat);
    const lShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.025, 0.245), shoeSoleMat);
    lShoeSole.position.set(0, -0.045, 0);
    lShoeGroup.add(lShoeUpper);
    lShoeGroup.add(lShoeSole);
    leftLeg.add(lShoeGroup);

    athlete.add(leftLeg);
    leftLegRef.current = leftLeg;

    scene.add(athlete);
    athleteGroupRef.current = athlete;

    // 15. The Official Field Judge (حكم الدائرة) with White & Red Flags
    const referee = new THREE.Group();
    referee.position.set(1.9, 0, -0.2); // Standing safely beside circle
    referee.rotation.y = -Math.PI / 2.2; // Facing the circle & stop board

    const refBlazerMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 }); // Official blue blazer
    const refPantsMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });

    // Referee Torso & Cap
    const refTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.55, 12), refBlazerMat);
    refTorso.position.y = 1.25;
    referee.add(refTorso);

    const refHead = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), skinMat);
    refHead.position.set(0, 1.62, 0);
    referee.add(refHead);

    const refCap = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.04, 16), refBlazerMat);
    refCap.position.set(0, 1.70, 0);
    referee.add(refCap);

    const refLegs = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.75, 0.18), refPantsMat);
    refLegs.position.y = 0.65;
    referee.add(refLegs);

    // Referee Flag Arm (Raises white or red flag)
    const refArmGroup = new THREE.Group();
    refArmGroup.position.set(-0.2, 1.45, 0);

    const refArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8), refBlazerMat);
    refArmMesh.position.set(0, -0.2, 0);
    refArmGroup.add(refArmMesh);

    // Flag Stick
    const flagStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    flagStick.position.set(0, -0.38, 0.1);
    refArmGroup.add(flagStick);

    // White Flag (Legal)
    const whiteFlag = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.22),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    whiteFlag.position.set(0.14, -0.28, 0.1);
    refArmGroup.add(whiteFlag);
    refWhiteFlagRef.current = whiteFlag;

    // Red Flag (Foul)
    const redFlag = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.22),
      new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
    );
    redFlag.position.set(0.14, -0.28, 0.1);
    redFlag.visible = false;
    refArmGroup.add(redFlag);
    refRedFlagRef.current = redFlag;

    referee.add(refArmGroup);
    refArmGroupRef.current = refArmGroup;

    scene.add(referee);
    refereeGroupRef.current = referee;

    // 16. Free Ballistic Flying Shot Put
    const freeShot = new THREE.Mesh(new THREE.SphereGeometry(shotRadius, 32, 32), shotIronMat);
    freeShot.visible = false;
    freeShot.castShadow = !isSoftwareGl;
    scene.add(freeShot);
    freeShotMeshRef.current = freeShot;

    // 17. Parabolic Trajectory Guide Line
    const trajectoryPoints: THREE.Vector3[] = [];
    const v0 = 14.8;
    const launchAng = (41.5 * Math.PI) / 180;
    const g = 9.81;
    const totalT = (2 * v0 * Math.sin(launchAng)) / g;
    for (let t = 0; t <= totalT; t += 0.05) {
      const fwd = v0 * Math.cos(launchAng) * t;
      const y = 1.82 + v0 * Math.sin(launchAng) * t - 0.5 * g * t * t;
      if (y >= 0.06) {
        trajectoryPoints.push(new THREE.Vector3(0, y, -0.2 - fwd));
      }
    }
    const trajectoryGeo = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
    const trajectoryMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.4,
      gapSize: 0.2,
      linewidth: 2,
    });
    const trajectoryLine = new THREE.Line(trajectoryGeo, trajectoryMat);
    trajectoryLine.computeLineDistances();
    trajectoryLine.visible = true;
    scene.add(trajectoryLine);
    trajectoryCurveMeshRef.current = trajectoryLine;

    // 18. Impact Sand/Crater Mark
    const impactMark = new THREE.Mesh(
      new THREE.CircleGeometry(0.28, 24),
      new THREE.MeshBasicMaterial({ color: 0x052e16, side: THREE.DoubleSide })
    );
    impactMark.rotation.x = -Math.PI / 2;
    impactMark.position.set(0, 0.015, -21.5);
    impactMark.visible = false;
    scene.add(impactMark);
    impactMarkRef.current = impactMark;

    // 19. Interactive Orbit / Drag Controls
    const dom = renderer.domElement;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      sphericalRef.current.theta -= deltaX * 0.008;
      sphericalRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - deltaY * 0.008));

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRef.current.radius = Math.max(2.2, Math.min(18.0, sphericalRef.current.radius + e.deltaY * 0.005));
    };

    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 20. Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 21. Main Animation & Kinetic Physics Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      // Update camera position based on spherical orbit coords
      if (cameraRef.current) {
        const { radius, theta, phi } = sphericalRef.current;
        const targetX = targetCamLookRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
        const targetY = targetCamLookRef.current.y + radius * Math.cos(phi);
        const targetZ = targetCamLookRef.current.z + radius * Math.sin(phi) * Math.cos(theta);

        cameraRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 4);
        currentCamLookRef.current.lerp(targetCamLookRef.current, delta * 4);
        cameraRef.current.lookAt(currentCamLookRef.current);
      }

      // Ballistic Flight for Shot Put
      if (isBallisticActiveRef.current && freeShotMeshRef.current) {
        ballisticTimeRef.current += delta;
        const bt = ballisticTimeRef.current;
        const speed = 14.8;
        const angle = (41.5 * Math.PI) / 180;
        const gravity = 9.81;

        const forward = speed * Math.cos(angle) * bt;
        const y = ballisticStartRef.current.y + speed * Math.sin(angle) * bt - 0.5 * gravity * bt * bt;

        freeShotMeshRef.current.position.z = ballisticStartRef.current.z - forward;
        freeShotMeshRef.current.position.y = Math.max(y, 0.06);

        // Spin the iron shot put in air
        freeShotMeshRef.current.rotation.x += delta * 8;

        if (y <= 0.06 && bt > 0.2) {
          isBallisticActiveRef.current = false;
          const dist = parseFloat((forward + 0.8).toFixed(2));
          setLastDistance(dist);

          if (impactMarkRef.current) {
            impactMarkRef.current.position.set(0, 0.015, freeShotMeshRef.current.position.z);
            impactMarkRef.current.visible = true;
          }

          // Referee Flag Logic based on mode
          const currentMode = simulationModeRef.current;
          if (currentMode === 'legal') {
            soundManager.playCorrect();
            soundManager.playCelebration();
            if (refArmGroupRef.current) refArmGroupRef.current.rotation.z = Math.PI * 0.75; // Raise flag high
            if (refWhiteFlagRef.current) refWhiteFlagRef.current.visible = true;
            if (refRedFlagRef.current) refRedFlagRef.current.visible = false;

            updateJumbotron(
              'محاولة صحيحة ومسجلة رسمياً 🏳️',
              '14.8 م/ث',
              '41.5°',
              `المسافة المحققة: ${dist} متر - راية بيضاء من الحكم!`,
              '#10b981'
            );

            setThrowJudgment({
              legal: true,
              title: "محاولة صحيحة ومسجلة رسمياً (Legal Throw) 🏳️",
              reason: `أداء حركي سليم ومطابق للمواصفات القانونية! زحف سلس داخل الدائرة، انطلاق بزاوية 41.5°، واستقرار الجلة داخل قطاع الرمي (34.92°) على مسافة ${dist} متر دون أي ملامسة للوحة الإيقاف أو خروج خاطئ.`,
              ruleCode: "القاعدة 187/188 من الاتحاد الدولي لألعاب القوى"
            });
          } else if (currentMode === 'foul_stop_board') {
            soundManager.playWrong();
            if (refArmGroupRef.current) refArmGroupRef.current.rotation.z = Math.PI * 0.75;
            if (refWhiteFlagRef.current) refWhiteFlagRef.current.visible = false;
            if (refRedFlagRef.current) refRedFlagRef.current.visible = true; // Red flag!

            updateJumbotron(
              'محاولة ملغاة: خطأ ملامسة لوحة الإيقاف 🚩',
              '14.8 م/ث',
              '41.5°',
              'خطأ قانوني: ملامسة قمة لوحة الإيقاف (Foul)',
              '#ef4444'
            );

            setThrowJudgment({
              legal: false,
              title: "محاولة خاطئة وغير محتسبة (Foul - Red Flag) 🚩",
              reason: "وفقاً للمادة القانونية في المنهاج: يُسمح للاعبة بملامسة الحافة الداخلية فقط للوحة الإيقاف، وتعتبر المحاولة فاشلة إذا لامست قدمها أو أي جزء من جسمها السطح العلوي أو الخارجي للوحة!",
              ruleCode: "كتاب التربية الرياضية ص 23 - شروط صحة الرمية"
            });
          } else {
            soundManager.playWrong();
            if (refArmGroupRef.current) refArmGroupRef.current.rotation.z = Math.PI * 0.75;
            if (refWhiteFlagRef.current) refWhiteFlagRef.current.visible = false;
            if (refRedFlagRef.current) refRedFlagRef.current.visible = true;

            updateJumbotron(
              'محاولة ملغاة: خروج خاطئ من الدائرة 🚩',
              '14.8 م/ث',
              '41.5°',
              'خطأ قانوني: الخروج من النصف الأمامي لدائرة الرمي',
              '#ef4444'
            );

            setThrowJudgment({
              legal: false,
              title: "محاولة ملغاة: مخالفة خط الخروج (Foul) 🚩",
              reason: "يجب على المتسابقة بعد استقرار الجلة أن تخرج من النصف الخلفي للدائرة وخلف خطي الامتداد الأبيضين (75 سم). الخروج من النصف الأمامي يبطل المحاولة تماماً!",
              ruleCode: "كتاب التربية الرياضية ص 23 - إجراءات خروج الرامي"
            });
          }
        }
      }

      // Continuous Glide Motion Controller
      if (isPlayingFullGlide) {
        glideTimeRef.current += delta * playbackSpeed;
        const gt = glideTimeRef.current;

        if (athleteGroupRef.current && torsoRef.current && rightArmRef.current && leftArmRef.current && rightLegRef.current && leftLegRef.current) {
          if (gt < 1.0) {
            // Phase 1: Starting Stance (Back to sector, loaded on right leg)
            athleteGroupRef.current.position.set(0, 0, 0.7);
            athleteGroupRef.current.rotation.y = 0;
            torsoRef.current.rotation.x = -0.2;
            rightLegRef.current.rotation.x = 0.2;
            leftLegRef.current.rotation.x = -0.15;
            leftArmRef.current.rotation.x = -0.3;
            if (shotInHandRef.current) shotInHandRef.current.visible = true;
            if (freeShotMeshRef.current) freeShotMeshRef.current.visible = false;

            updateJumbotron('المرحلة 1: الوقفة الابتدائية', '0.0 م/ث', '41.5°', 'اتخاذ الوقفة وبداية التركيز', '#38bdf8');
          } else if (gt < 2.0) {
            // Phase 2: Preliminary Dip & Swing
            const p = (gt - 1.0) / 1.0;
            torsoRef.current.rotation.x = -0.2 - 0.45 * p;
            rightLegRef.current.rotation.x = 0.2 + 0.35 * p;
            leftLegRef.current.rotation.x = -0.15 + 0.55 * p;
            athleteGroupRef.current.position.y = -0.09 * p;

            updateJumbotron('المرحلة 2: الانثناء والمرجحة التمهيدية', '2.8 م/ث', '35.0°', 'شحن الطاقة ومرجحة الرجل اليسرى', '#f59e0b');
          } else if (gt < 3.0) {
            // Phase 3: The Glide Across Circle
            const p = (gt - 2.0) / 1.0;
            athleteGroupRef.current.position.z = 0.7 - 0.7 * p;
            leftLegRef.current.position.z = -0.65 * p;
            leftLegRef.current.rotation.x = -0.45 * p;
            athleteGroupRef.current.position.y = -0.09 + 0.05 * p;

            updateJumbotron('المرحلة 3: زحفة أوبراين عبر الدائرة', '6.5 م/ث', '38.0°', 'انزلاق سريع ومستوٍ بالقدم اليمنى للمنتصف', '#f59e0b');
          } else if (gt < 4.0) {
            // Phase 4: Power Position & Explosive Delivery
            const p = (gt - 3.0) / 1.0;
            athleteGroupRef.current.rotation.y = Math.PI * p;
            torsoRef.current.rotation.x = -0.65 + 0.85 * p;
            rightArmRef.current.rotation.x = (-Math.PI / 2.1) * p;

            updateJumbotron('المرحلة 4: وضع القوة والدفع الانفجاري', '14.8 م/ث', '41.5°', 'دفع الكتف والذراع للأمام ولأعلى بقوة', '#10b981');

            if (p > 0.85 && !isBallisticActiveRef.current && freeShotMeshRef.current) {
              if (shotInHandRef.current) shotInHandRef.current.visible = false;
              freeShotMeshRef.current.visible = true;
              freeShotMeshRef.current.position.set(0, 1.82, -0.2);
              ballisticStartRef.current.set(0, 1.82, -0.2);
              ballisticTimeRef.current = 0;
              isBallisticActiveRef.current = true;
              soundManager.playWhistle();
            }
          } else if (gt < 5.0) {
            // Phase 5: Recovery
            const currentMode = simulationModeRef.current;
            athleteGroupRef.current.rotation.y = Math.PI;

            if (currentMode === 'foul_stop_board') {
              // Athlete steps right on top of the stop board
              athleteGroupRef.current.position.z = -1.02; // Over front rim!
              rightLegRef.current.position.z = -0.15;
              rightLegRef.current.position.y = 0.12; // Foot resting on stop board top
            } else if (currentMode === 'foul_front_exit') {
              // Athlete walks forward out of circle
              athleteGroupRef.current.position.z = -1.5;
            } else {
              // Legal safe recovery inside circle
              athleteGroupRef.current.position.z = -0.2;
              rightLegRef.current.position.z = -0.38;
              leftLegRef.current.position.z = 0.32;
            }

            torsoRef.current.rotation.x = 0.2;
            rightArmRef.current.rotation.x = 0;
          } else {
            setIsPlayingFullGlide(false);
          }
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [playbackSpeed, isPlayingFullGlide, shotGender, updateJumbotron]);

  // Handle Preset Camera Changes
  useEffect(() => {
    if (cameraPreset === 'side') {
      sphericalRef.current = { radius: 4.8, theta: 0.65, phi: 1.15 };
      targetCamLookRef.current.set(0, 1.15, -0.3);
    } else if (cameraPreset === 'cinematic') {
      sphericalRef.current = { radius: 5.8, theta: 0.1, phi: 1.25 };
      targetCamLookRef.current.set(0, 1.2, -1.5);
    } else if (cameraPreset === 'top') {
      sphericalRef.current = { radius: 9.5, theta: 0.0, phi: 0.2 };
      targetCamLookRef.current.set(0, 0, -1.0);
    } else if (cameraPreset === 'stopBoard') {
      sphericalRef.current = { radius: 2.8, theta: 2.4, phi: 1.3 };
      targetCamLookRef.current.set(0, 0.25, -1.0);
    } else if (cameraPreset === 'referee') {
      sphericalRef.current = { radius: 3.2, theta: -1.4, phi: 1.2 };
      targetCamLookRef.current.set(0.6, 1.1, -0.2);
    }
  }, [cameraPreset]);

  // Jump to specific step
  const handleSelectStep = (index: number) => {
    soundManager.playClick();
    setCurrentStepIndex(index);
    setIsPlayingFullGlide(false);
    isBallisticActiveRef.current = false;

    if (freeShotMeshRef.current) freeShotMeshRef.current.visible = false;
    if (shotInHandRef.current) shotInHandRef.current.visible = true;

    if (athleteGroupRef.current && torsoRef.current && rightArmRef.current && leftArmRef.current && rightLegRef.current && leftLegRef.current) {
      if (index === 0) {
        athleteGroupRef.current.position.set(0, 0, 0.7);
        athleteGroupRef.current.rotation.y = 0;
        torsoRef.current.rotation.x = -0.2;
        rightLegRef.current.rotation.x = 0.2;
        leftLegRef.current.rotation.x = -0.15;
        leftArmRef.current.rotation.x = -0.3;
        rightArmRef.current.rotation.x = 0;
        updateJumbotron('المرحلة 1: الوقفة الابتدائية', '0.0 م/ث', '41.5°', 'اتخاذ الوقفة وبداية التركيز', '#38bdf8');
      } else if (index === 1) {
        athleteGroupRef.current.position.set(0, -0.09, 0.7);
        athleteGroupRef.current.rotation.y = 0;
        torsoRef.current.rotation.x = -0.65;
        rightLegRef.current.rotation.x = 0.55;
        leftLegRef.current.rotation.x = 0.40;
        updateJumbotron('المرحلة 2: الانثناء والمرجحة التمهيدية', '2.8 م/ث', '35.0°', 'شحن الطاقة ومرجحة الرجل اليسرى', '#f59e0b');
      } else if (index === 2) {
        athleteGroupRef.current.position.set(0, -0.04, 0.2);
        athleteGroupRef.current.rotation.y = 0;
        torsoRef.current.rotation.x = -0.5;
        leftLegRef.current.position.z = -0.55;
        updateJumbotron('المرحلة 3: زحفة أوبراين عبر الدائرة', '6.5 م/ث', '38.0°', 'انزلاق سريع ومستوٍ بالقدم اليمنى للمنتصف', '#f59e0b');
      } else if (index === 3) {
        athleteGroupRef.current.position.set(0, 0, -0.1);
        athleteGroupRef.current.rotation.y = Math.PI * 0.85;
        torsoRef.current.rotation.x = 0.2;
        rightArmRef.current.rotation.x = -Math.PI / 2.1;
        updateJumbotron('المرحلة 4: وضع القوة والدفع الانفجاري', '14.8 م/ث', '41.5°', 'دفع الكتف والذراع للأمام ولأعلى بقوة', '#10b981');
      } else if (index === 4) {
        athleteGroupRef.current.position.set(0, 0, -0.2);
        athleteGroupRef.current.rotation.y = Math.PI;
        rightLegRef.current.position.z = -0.38;
        leftLegRef.current.position.z = 0.32;
        torsoRef.current.rotation.x = 0.2;
        updateJumbotron('المرحلة 5: التوازن والتغطية (Recovery)', '0.0 م/ث', '0.0°', 'تبديل القدمين لمنع تخطي لوحة الإيقاف', '#38bdf8');
      }
    }
  };

  const handleStartFullGlide = () => {
    soundManager.playWhistle();
    glideTimeRef.current = 0;
    isBallisticActiveRef.current = false;
    setThrowJudgment(null);
    setLastDistance(null);
    if (impactMarkRef.current) impactMarkRef.current.visible = false;
    if (refArmGroupRef.current) refArmGroupRef.current.rotation.z = 0;
    setIsPlayingFullGlide(true);
  };

  return (
    <div className="space-y-6">
      {/* Light Transparent Glassmorphic Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-700 mb-1">
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>الميدان الذكي ثلاثي الأبعاد الواقعي</span>
            </span>
            <span className="text-slate-500 font-semibold hidden sm:inline">
              المحاكاة التشريحية والقانونية: طريقة الزحف (O'Brien Glide)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ملعب البطولة الواقعي: لاعبة دفع الجلة والحكم الميداني 3D
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            محاكاة رياضية واقعية تحاكي تفاصيل بطولة ألعاب القوى: لاعبة ثلاثية الأبعاد بزيها الرياضي المعتمد ورقَم الصدرية، شاشة الاستاد الذكية 3D، لوحة الإيقاف القانونية، وحكم الدائرة مع الرايتين البيضاء والحمراء.
          </p>
        </div>

        {/* Camera Views Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
          <Camera className="w-4 h-4 text-slate-500 mr-1" />
          {[
            { id: 'side', label: 'المنظور الجانبي' },
            { id: 'cinematic', label: 'البث المباشر' },
            { id: 'referee', label: 'زاوية الحكم' },
            { id: 'stopBoard', label: 'لوحة الإيقاف' },
            { id: 'top', label: 'عين الصقر' },
          ].map((cam) => (
            <button
              key={cam.id}
              onClick={() => {
                soundManager.playClick();
                setCameraPreset(cam.id as any);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                cameraPreset === cam.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cam.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Viewport with Light Realistic Stadium Environment */}
      <div className="relative w-full h-[600px] sm:h-[660px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50">
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Orbit Helper Tip */}
        <div className="absolute top-4 left-4 bg-white/85 backdrop-blur-xl px-3 py-2 rounded-2xl border border-white/90 text-slate-800 text-[11px] font-bold shadow-md flex items-center gap-2 pointer-events-none">
          <Move className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>اسحبي بالفأرة أو اللمس لتدوير الكاميرا 360° | تكبير بالبكرة</span>
        </div>

        {/* Top-Right HUD Badge: Light Frosted Glass */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/90 text-slate-900 text-xs space-y-1 shadow-lg pointer-events-none max-w-xs">
          <div className="font-black text-amber-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>بيانات الميدان واللاعبة 3D</span>
          </div>
          <div className="text-slate-600 text-[11px] space-y-0.5">
            <div>• الدائرة: <strong className="text-slate-900">قطر 2.135 م (عمق 2 سم)</strong></div>
            <div>• لوحة الإيقاف: <strong className="text-slate-900">طول 1.22م، عرض 11.4سم، ارتفاع 10سم</strong></div>
            <div>• أسلوب الدفع: <strong className="text-amber-700 font-bold">طريقة الزحف (O'Brien Glide)</strong></div>
            <div>• وزن الجلة: <strong className="text-slate-900">4 كغم (إناث) / 7.260 كغم (رجال)</strong></div>
          </div>
        </div>

        {/* Referee Decision Banner Overlay */}
        {throwJudgment && (
          <div className="absolute top-16 left-4 max-w-sm bg-white/95 backdrop-blur-xl p-4 rounded-3xl border-2 border-amber-300 text-slate-900 shadow-2xl animate-fade-in z-10">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  throwJudgment.legal
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                    : 'bg-rose-100 text-rose-950 border-rose-300'
                }`}
              >
                <span>{throwJudgment.legal ? '🏳️ الراية البيضاء مرفوعة' : '🚩 الراية الحمراء مرفوعة'}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold">قرار التحكيم الرسمي</span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              {throwJudgment.legal ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <h4 className="font-black text-sm text-slate-900">{throwJudgment.title}</h4>
            </div>

            {lastDistance !== null && (
              <div className="text-3xl font-black text-amber-600 font-mono my-1 tracking-tight">
                {lastDistance} <span className="text-xs text-slate-700 font-sans font-bold">متر رسمي</span>
              </div>
            )}
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 mt-2 font-medium">
              {throwJudgment.reason}
            </p>
            <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Info className="w-3 h-3 text-amber-600" />
              <span>{throwJudgment.ruleCode}</span>
            </div>
          </div>
        )}

        {/* Light Glassmorphic Step-by-Step Bottom Dock */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl transition-all duration-300 z-20 ${
            isDockCollapsed ? 'translate-y-[85%]' : 'translate-y-0'
          }`}
        >
          {/* Toggle Tab */}
          <div className="flex justify-center -mb-1">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsDockCollapsed(!isDockCollapsed);
              }}
              className="bg-white/90 hover:bg-white text-slate-800 px-4 py-1.5 rounded-t-2xl border-t border-x border-white/80 text-xs font-black flex items-center gap-1 shadow-md transition-colors"
            >
              {isDockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>إظهار لوحة خطوات الزحف والأداء</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
                  <span>إخفاء لوحة التحكم</span>
                </>
              )}
            </button>
          </div>

          {/* Unified Transparent Glassmorphic Body */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-5 border border-white/90 shadow-2xl text-slate-900 space-y-4">
            {/* Simulation Mode Toggle (Legal vs Common Fouls for PE training) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-100/90 border border-slate-200/80 text-xs font-bold">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-600" />
                <span>اختبار القانون والتحكيم:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'legal', label: 'محاولة قانونية سليمة 🏳️' },
                  { id: 'foul_stop_board', label: 'خطأ: ملامسة قمة لوحة الإيقاف 🚩' },
                  { id: 'foul_front_exit', label: 'خطأ: الخروج من الأمام 🚩' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSimulationMode(mode.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      simulationMode === mode.id
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Bar: 5 Glide Steps Selector */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              {GLIDE_STEPS.map((st, idx) => (
                <button
                  key={st.stepNumber}
                  onClick={() => handleSelectStep(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                    currentStepIndex === idx && !isPlayingFullGlide
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300/40'
                      : 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-mono">
                    {st.stepNumber}
                  </span>
                  <span>{st.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* Current Step Technical Explanation Card */}
            <div className="bg-gradient-to-r from-amber-50/70 via-white to-sky-50/70 p-4 rounded-2xl border border-amber-200/60 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    المرحلة {currentStep.stepNumber} من 5
                  </span>
                  <h4 className="text-sm font-black text-slate-900">
                    {currentStep.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentStep.description}
                </p>

                {/* Key Technical Bullets */}
                <ul className="text-[11px] text-slate-600 space-y-1 pt-1">
                  {currentStep.technicalPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coaching Tip from Teacher Salma */}
              <div className="md:w-72 bg-white/80 p-3 rounded-xl border border-amber-200/80 space-y-1 text-xs shrink-0">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>توجيه الأستاذة سالمة الحكماني:</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug italic">
                  "{currentStep.teacherTip}"
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">توجيه ميداني</span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      soundManager.speakArabic(`${currentStep.title}. ${currentStep.description}`);
                    }}
                    className="text-[10px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3 text-amber-600" />
                    <span>استماع للشرح</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Full Play & Speed Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  disabled={isPlayingFullGlide}
                  onClick={handleStartFullGlide}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {isPlayingFullGlide ? 'جارٍ تنفيذ الزحف الكامل...' : 'تشغيل الأداء الحركي الكامل للزحف 🏃‍♀️'}
                  </span>
                </button>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
                  <span className="text-[11px] text-slate-500 px-1">السرعة:</span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setPlaybackSpeed(1.0);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      playbackSpeed === 1.0 ? 'bg-white shadow text-slate-950' : 'text-slate-500'
                    }`}
                  >
                    عادية (1x)
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setPlaybackSpeed(0.5);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      playbackSpeed === 0.5 ? 'bg-white shadow text-amber-700 font-black' : 'text-slate-500'
                    }`}
                  >
                    تصوير بطيء (0.5x)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => handleSelectStep(0)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة البداية</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
