"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { partNames, type FridgeKind, type PartId } from "@/lib/site";
import { buildFridge } from "./buildFridge";

export type FridgeSceneProps = {
  kind?: FridgeKind;
  body?: string;
  accent?: string;
  /** подсвеченный узел */
  highlight?: PartId | null;
  /** полупрозрачный корпус — видно внутренности */
  xray?: boolean;
  /** 0..1 — насколько открыты двери */
  open?: number;
  /** открывать двери при наведении / касании */
  hoverOpen?: boolean;
  /** начальный поворот, радианы */
  yaw?: number;
  spin?: boolean;
  label?: boolean;
  className?: string;
};

export default function FridgeScene({
  kind = "double",
  body = "#cfd6dd",
  accent = "#4fd1ff",
  highlight = null,
  xray = false,
  open = 0,
  hoverOpen = false,
  yaw = -0.5,
  spin = true,
  label = true,
  className = "",
}: FridgeSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // «живые» значения — меняются без пересборки сцены
  const live = useRef({ highlight, xray, open, accent, hover: false });
  live.current.highlight = highlight;
  live.current.xray = xray;
  live.current.open = open;
  live.current.accent = accent;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.55;

    const model = buildFridge(kind, body);
    const { w, h, d } = model.size;
    const rig = new THREE.Group();
    rig.add(model.group);
    model.group.position.y = -h / 2;
    scene.add(rig);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    const key = new THREE.DirectionalLight("#ffffff", 2.2);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(accent, 3);
    rim.position.set(-3, 1.5, -3);
    scene.add(rim);
    const fill = new THREE.PointLight(accent, 6, 6, 1.8);
    fill.position.set(-1.4, -h / 2 + 0.2, 1.6);
    scene.add(fill);
    scene.add(new THREE.AmbientLight("#8fb7d9", 0.35));

    // подсветка-кольцо на полу
    const fc = document.createElement("canvas");
    fc.width = fc.height = 256;
    const g2 = fc.getContext("2d")!;
    const grad = g2.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,0.55)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.16)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g2.fillStyle = grad;
    g2.fillRect(0, 0, 256, 256);
    const floorTex = new THREE.CanvasTexture(fc);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: floorTex, color: accent, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.scale.setScalar(Math.max(w, d) * 3.4);
    floor.position.y = -h / 2 - 0.03;
    scene.add(floor);

    // холодный туман из открытой двери
    const N = 140;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    for (let i = 0; i < N; i++) seed[i] = Math.random();
    const mistGeo = new THREE.BufferGeometry();
    mistGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mistMat = new THREE.PointsMaterial({
      map: floorTex, color: "#dff6ff", size: 0.16, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const mist = new THREE.Points(mistGeo, mistMat);
    model.group.add(mist);

    // маркер подсвеченного узла
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: floorTex, color: accent, transparent: true, opacity: 0, depthTest: false, blending: THREE.AdditiveBlending }));
    halo.scale.setScalar(0.5);
    model.group.add(halo);

    // материалы узлов
    const partMats = new Map<PartId, THREE.MeshStandardMaterial[]>();
    (Object.keys(model.parts) as PartId[]).forEach((id) => {
      const set = new Set<THREE.MeshStandardMaterial>();
      model.parts[id]!.forEach((m) => set.add(m.material as THREE.MeshStandardMaterial));
      partMats.set(id, [...set]);
    });
    const glow: Partial<Record<PartId, number>> = {};

    let width = 0;
    let height = 0;
    const fit = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const vFov = (camera.fov * Math.PI) / 180;
      const span = Math.max(h * 1.22, (Math.hypot(w, d) * 1.75) / camera.aspect);
      const dist = span / 2 / Math.tan(vFov / 2);
      camera.position.set(0, h * 0.06, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();

    // управление
    let dragYaw = 0;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let pointerX = 0;
    let pointerY = 0;
    const dom = renderer.domElement;
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      dom.style.cursor = "grabbing";
      dom.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const r = dom.getBoundingClientRect();
      pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointerY = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx * 0.008;
      dragYaw += velocity;
    };
    const up = () => {
      dragging = false;
      dom.style.cursor = "grab";
    };
    const enter = () => (live.current.hover = true);
    const leave = () => {
      live.current.hover = false;
      pointerX = pointerY = 0;
    };
    dom.addEventListener("pointerdown", down);
    dom.addEventListener("pointermove", move);
    dom.addEventListener("pointerup", up);
    dom.addEventListener("pointercancel", up);
    dom.addEventListener("pointerenter", enter);
    dom.addEventListener("pointerleave", leave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);

    const clock = new THREE.Clock();
    let openCur = 0;
    let xrayCur = 0;
    let raf = 0;
    const accentColor = new THREE.Color(accent);
    const v = new THREE.Vector3();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || !width) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const tm = clock.elapsedTime;
      const L = live.current;
      accentColor.set(L.accent);

      // вращение
      if (!dragging) {
        velocity *= 0.92;
        dragYaw += velocity;
      }
      const idle = spin && !reduce ? Math.sin(tm * 0.35) * 0.22 : 0;
      const targetYaw = yaw + dragYaw + idle + pointerX * 0.12;
      rig.rotation.y += (targetYaw - rig.rotation.y) * Math.min(1, dt * 5);
      rig.rotation.x += (pointerY * 0.05 - rig.rotation.x) * Math.min(1, dt * 4);
      rig.position.y = reduce ? 0 : Math.sin(tm * 0.9) * 0.012;

      // двери
      const openTarget = Math.max(L.open, hoverOpen && L.hover ? 0.85 : 0);
      openCur += (openTarget - openCur) * Math.min(1, dt * 3.2);
      model.doors.forEach((dr, i) => {
        const k = Math.max(0, Math.min(1, openCur * (1 + i * 0.12) - i * 0.1));
        dr.pivot.rotation[dr.axis] = dr.max * k * 0.62;
      });
      model.interiorLight.intensity = openCur * 2.4;

      // рентген
      xrayCur += ((L.xray ? 1 : 0) - xrayCur) * Math.min(1, dt * 4);
      const op = 1 - xrayCur * 0.86;
      model.shell.forEach((m) => {
        m.opacity = op;
        m.depthWrite = op > 0.6;
      });

      // подсветка узлов
      partMats.forEach((mats, id) => {
        const tgt = L.highlight === id ? 1 : 0;
        const cur = (glow[id] = (glow[id] ?? 0) + (tgt - (glow[id] ?? 0)) * Math.min(1, dt * 6));
        const pulse = 0.75 + Math.sin(tm * 4) * 0.25;
        mats.forEach((m) => {
          m.emissive.copy(accentColor);
          m.emissiveIntensity = cur * 0.9 * pulse;
        });
      });
      const a = L.highlight ? model.anchors[L.highlight] : undefined;
      const hm = halo.material as THREE.SpriteMaterial;
      hm.color.copy(accentColor);
      if (a) {
        halo.position.lerp(a, Math.min(1, dt * 8));
        hm.opacity += (0.75 - hm.opacity) * Math.min(1, dt * 5);
        halo.scale.setScalar(0.42 + Math.sin(tm * 4) * 0.06);
      } else hm.opacity += (0 - hm.opacity) * Math.min(1, dt * 5);

      if (model.fanRotor) model.fanRotor.rotation.z -= dt * (L.highlight === "fan" ? 14 : 5);

      // туман
      mistMat.opacity = openCur * 0.2;
      if (openCur > 0.02) {
        const p = mistGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < N; i++) {
          const s = seed[i];
          const life = (tm * (0.12 + s * 0.1) + s * 7) % 1;
          p.setXYZ(
            i,
            (s - 0.5) * w * 0.9 + Math.sin(tm * 0.6 + i) * 0.05,
            h * (0.55 - life * 0.55) * (0.4 + ((i * 7) % 10) / 16),
            d / 2 + 0.05 + life * 0.55 + Math.cos(i) * 0.05,
          );
        }
        p.needsUpdate = true;
      }

      renderer.render(scene, camera);

      // подпись узла
      const lb = labelRef.current;
      if (lb) {
        if (a && label) {
          v.copy(a);
          model.group.localToWorld(v);
          v.project(camera);
          const x = (v.x * 0.5 + 0.5) * width;
          const y = (-v.y * 0.5 + 0.5) * height;
          lb.style.opacity = "1";
          lb.style.transform = `translate(${Math.round(Math.min(Math.max(x, 70), width - 70))}px, ${Math.round(Math.max(y - 38, 8))}px) translateX(-50%)`;
          const name = partNames[L.highlight!];
          if (lb.textContent !== name) lb.textContent = name;
        } else lb.style.opacity = "0";
      }
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      dom.removeEventListener("pointerdown", down);
      dom.removeEventListener("pointermove", move);
      dom.removeEventListener("pointerup", up);
      dom.removeEventListener("pointercancel", up);
      dom.removeEventListener("pointerenter", enter);
      dom.removeEventListener("pointerleave", leave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      floorTex.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      dom.remove();
    };
    // сцена пересобирается только при смене геометрии/цвета корпуса
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, body]);

  return (
    <div ref={wrap} className={`relative h-full w-full select-none ${className}`} role="img" aria-label="3D-модель холодильника">
      {failed && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-[70%] w-[32%] rounded-2xl border border-white/15 bg-gradient-to-b from-white/15 to-white/5 shadow-[0_0_80px_rgba(79,209,255,.25)]" />
        </div>
      )}
      <div
        ref={labelRef}
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full border border-white/20 bg-ink/80 px-3 py-1 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300"
      />
    </div>
  );
}
