import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { FridgeKind, PartId } from "@/lib/site";

export type Door = { pivot: THREE.Group; axis: "x" | "y"; max: number };

export type FridgeModel = {
  group: THREE.Group;
  doors: Door[];
  parts: Partial<Record<PartId, THREE.Mesh[]>>;
  anchors: Partial<Record<PartId, THREE.Vector3>>;
  shell: THREE.MeshStandardMaterial[];
  fanRotor?: THREE.Object3D;
  interiorLight: THREE.PointLight;
  size: { w: number; h: number; d: number };
};

const DIMS: Record<FridgeKind, [number, number, number]> = {
  double: [0.7, 1.9, 0.66],
  single: [0.62, 1.55, 0.62],
  sbs: [0.98, 1.8, 0.7],
  chest: [1.15, 0.86, 0.62],
  wine: [0.6, 1.5, 0.6],
  showcase: [1.35, 1.25, 0.72],
};

export function buildFridge(kind: FridgeKind, bodyColor: string): FridgeModel {
  const [W, H, D] = DIMS[kind];
  const t = 0.035;
  const group = new THREE.Group();
  const parts: FridgeModel["parts"] = {};
  const anchors: FridgeModel["anchors"] = {};
  const doors: Door[] = [];

  const dark = kind === "wine" || kind === "showcase";
  const shellMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    metalness: dark ? 0.75 : 0.55,
    roughness: dark ? 0.32 : 0.38,
    transparent: true,
  });
  const doorMat = shellMat.clone();
  const shell = [shellMat, doorMat];
  const linerMat = new THREE.MeshStandardMaterial({ color: "#eef5fa", roughness: 0.85, side: THREE.BackSide, transparent: true });
  shell.push(linerMat);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: "#bfe9ff", transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0, transmission: 0.6, depthWrite: false,
  });
  const trimMat = new THREE.MeshStandardMaterial({ color: "#1a1f27", metalness: 0.9, roughness: 0.25 });

  const box = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0, r = 0.012) => {
    const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.1, h / 2.1, d / 2.1)) : new THREE.BoxGeometry(w, h, d);
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    return m;
  };
  const part = (id: PartId, mesh: THREE.Mesh, anchor = true) => {
    (parts[id] ??= []).push(mesh);
    if (anchor && !anchors[id]) anchors[id] = mesh.position.clone();
    group.add(mesh);
    return mesh;
  };
  const partMat = (color: string, metal = 0.4, rough = 0.5) =>
    new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough, emissive: "#000000" });

  /* ── Корпус ── */
  const openTop = kind === "chest";
  const bodyH = kind === "showcase" ? H * 0.42 : H;
  group.add(box(W, bodyH, t, shellMat, 0, bodyH / 2, -D / 2 + t / 2));
  group.add(box(t, bodyH, D, shellMat, -W / 2 + t / 2, bodyH / 2, 0));
  group.add(box(t, bodyH, D, shellMat, W / 2 - t / 2, bodyH / 2, 0));
  group.add(box(W, t, D, shellMat, 0, t / 2, 0));
  if (!openTop) group.add(box(W, t, D, shellMat, 0, bodyH - t / 2, 0));
  if (kind === "chest") group.add(box(W, bodyH, t, shellMat, 0, bodyH / 2, D / 2 - t / 2));
  if (kind === "showcase") {
    group.add(box(W, bodyH, t, shellMat, 0, bodyH / 2, D / 2 - t / 2));
    // стеклянный купол витрины
    const gh = H - bodyH;
    group.add(box(W - 0.02, gh, D - 0.02, glassMat, 0, bodyH + gh / 2, 0, 0.03));
    group.add(box(W, 0.03, D, trimMat, 0, H, 0));
    for (let i = 0; i < 2; i++) group.add(box(W - 0.08, 0.012, D - 0.12, glassMat, 0, bodyH + 0.2 + i * 0.26, 0, 0));
  }
  // ножки / цоколь
  group.add(box(W - 0.04, 0.03, D - 0.06, trimMat, 0, -0.015, 0, 0.005));

  // внутренний лайнер
  const liner = new THREE.Mesh(new THREE.BoxGeometry(W - 2 * t - 0.004, bodyH - 2 * t - 0.004, D - t - 0.004), linerMat);
  liner.position.set(0, bodyH / 2, t / 2);
  group.add(liner);

  const splitY = kind === "double" ? H * 0.345 : 0;
  if (kind === "double") group.add(box(W - 2 * t, t, D - t, shellMat, 0, splitY, t / 2));
  if (kind === "sbs") group.add(box(t, H - 2 * t, D - t, shellMat, -W * 0.1, H / 2, t / 2));

  /* ── Содержимое ── */
  const foodColors = ["#ff8a5c", "#ffd166", "#7bd88f", "#6ec3ff", "#f472b6", "#f4f4f5"];
  const food = (x: number, y: number, z: number, i: number) => {
    const c = new THREE.MeshStandardMaterial({ color: foodColors[i % foodColors.length], roughness: 0.6 });
    const shape = i % 3;
    const m =
      shape === 0 ? new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 16), c)
      : shape === 1 ? new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.11, 0.09, 2, 0.015), c)
      : new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), c);
    m.position.set(x, y + (shape === 0 ? 0.08 : shape === 1 ? 0.055 : 0.045), z);
    group.add(m);
  };
  if (kind === "double" || kind === "single" || kind === "sbs") {
    const x0 = kind === "sbs" ? -W * 0.1 + t : -W / 2 + t;
    const x1 = W / 2 - t;
    const cw = x1 - x0;
    const yBase = kind === "double" ? splitY + t : t + 0.02;
    const n = kind === "single" ? 4 : kind === "sbs" ? 5 : 4;
    const step = (H - yBase - 0.1) / n;
    for (let i = 1; i < n; i++) {
      const y = yBase + step * i;
      group.add(box(cw - 0.02, 0.01, D - t - 0.14, glassMat, (x0 + x1) / 2, y, -0.02, 0));
      for (let k = 0; k < 3; k++) food(x0 + cw * (0.22 + k * 0.28), y, -0.05 + (k % 2) * 0.08, i * 3 + k);
    }
    // ящик для овощей
    group.add(box(cw - 0.04, step * 0.62, D - t - 0.16, glassMat, (x0 + x1) / 2, yBase + step * 0.36, 0, 0.02));
  }
  if (kind === "double") {
    // ящики морозилки
    for (let i = 0; i < 3; i++) {
      const dh = (splitY - t * 2) / 3;
      group.add(box(W - 2 * t - 0.04, dh - 0.02, D - t - 0.12, glassMat, 0, t + dh * (i + 0.5), 0.01, 0.015));
    }
  }
  if (kind === "sbs") {
    const fw = W * 0.4 - t * 2;
    for (let i = 0; i < 6; i++) group.add(box(fw - 0.02, 0.01, D - t - 0.14, glassMat, -W / 2 + t + fw / 2, 0.2 + i * 0.26, -0.02, 0));
  }
  if (kind === "wine") {
    const bottleMat = new THREE.MeshStandardMaterial({ color: "#20402c", roughness: 0.25, metalness: 0.1 });
    const rackMat = new THREE.MeshStandardMaterial({ color: "#8a5a2b", roughness: 0.7 });
    for (let r = 0; r < 6; r++) {
      const y = 0.16 + r * 0.22;
      group.add(box(W - 2 * t - 0.02, 0.012, D - t - 0.12, rackMat, 0, y, 0, 0));
      for (let b = 0; b < 4; b++) {
        const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.3, 14), bottleMat);
        bt.rotation.x = Math.PI / 2;
        bt.position.set(-W / 2 + t + 0.075 + b * 0.125, y + 0.045, 0);
        group.add(bt);
      }
    }
  }
  if (kind === "chest") {
    for (let i = 0; i < 5; i++) food(-W / 2 + 0.18 + i * 0.2, H * 0.45, (i % 2) * 0.12 - 0.06, i);
    group.add(box(W - 2 * t - 0.02, 0.012, D - 2 * t - 0.02, glassMat, 0, H * 0.45, 0, 0));
  }
  if (kind === "showcase") {
    for (let i = 0; i < 7; i++) food(-W / 2 + 0.14 + i * 0.18, bodyH + 0.2, (i % 2) * 0.14 - 0.07, i);
    for (let i = 0; i < 6; i++) food(-W / 2 + 0.2 + i * 0.19, bodyH + 0.46, (i % 2) * 0.12 - 0.06, i + 2);
  }

  /* ── Двери ── */
  const dt = 0.055;
  const addDoor = (w: number, h: number, cx: number, cy: number, hinge: "l" | "r", glass = false) => {
    const pivot = new THREE.Group();
    const hx = hinge === "r" ? cx + w / 2 : cx - w / 2;
    pivot.position.set(hx, cy, D / 2);
    const off = hinge === "r" ? -w / 2 : w / 2;
    if (glass) {
      const fr = 0.05;
      pivot.add(box(w, fr, dt, doorMat, off, h / 2 - fr / 2, dt / 2));
      pivot.add(box(w, fr, dt, doorMat, off, -h / 2 + fr / 2, dt / 2));
      pivot.add(box(fr, h, dt, doorMat, off - w / 2 + fr / 2, 0, dt / 2));
      pivot.add(box(fr, h, dt, doorMat, off + w / 2 - fr / 2, 0, dt / 2));
      pivot.add(box(w - fr * 2, h - fr * 2, 0.012, glassMat, off, 0, dt / 2, 0));
    } else {
      pivot.add(box(w - 0.006, h - 0.006, dt, doorMat, off, 0, dt / 2, 0.02));
      // дверные полки
      const sm = glassMat;
      for (let i = 0; i < Math.max(1, Math.floor(h / 0.36)); i++) {
        pivot.add(box(w - 0.12, 0.07, 0.07, sm, off, -h / 2 + 0.16 + i * 0.34, -0.045, 0.01));
      }
    }
    // ручка
    const hxo = hinge === "r" ? off - w / 2 + 0.06 : off + w / 2 - 0.06;
    pivot.add(box(0.018, Math.min(0.46, h * 0.5), 0.03, trimMat, hxo, 0, dt + 0.02, 0.008));
    group.add(pivot);
    doors.push({ pivot, axis: "y", max: hinge === "r" ? 1.75 : -1.75 });
    // петли
    for (const s of [-1, 1]) {
      const hg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.05, 12), partMat("#9aa3ad", 0.9, 0.3));
      hg.position.set(hx + (hinge === "r" ? -0.012 : 0.012), cy + (s * h) / 2 - s * 0.02, D / 2 + 0.012);
      part("hinge", hg);
    }
    // уплотнитель — рамка вокруг проёма
    const sMat = partMat("#3a424d", 0.1, 0.9);
    const sw = 0.016;
    const z = D / 2 + 0.004;
    for (const m of [
      box(w - 0.02, sw, 0.012, sMat, cx, cy + h / 2 - sw, z, 0),
      box(w - 0.02, sw, 0.012, sMat, cx, cy - h / 2 + sw, z, 0),
      box(sw, h - 0.02, 0.012, sMat, cx - w / 2 + sw, cy, z, 0),
      box(sw, h - 0.02, 0.012, sMat, cx + w / 2 - sw, cy, z, 0),
    ]) part("seal", m, false);
    anchors.seal ??= new THREE.Vector3(cx - w / 2 + sw, cy, z);
  };

  if (kind === "double") {
    addDoor(W, H - splitY - 0.005, 0, (H + splitY) / 2 + 0.0025, "r");
    addDoor(W, splitY - 0.005, 0, splitY / 2 - 0.0025, "r");
  } else if (kind === "single") {
    addDoor(W, H, 0, H / 2, "r");
  } else if (kind === "wine") {
    addDoor(W, H, 0, H / 2, "r", true);
  } else if (kind === "sbs") {
    const lw = W * 0.4;
    addDoor(lw, H, -W / 2 + lw / 2, H / 2, "l");
    addDoor(W - lw, H, W / 2 - (W - lw) / 2, H / 2, "r");
    // дисплей и диспенсер
    const disp = box(0.16, 0.24, 0.006, new THREE.MeshStandardMaterial({ color: "#05080d", emissive: "#3fd7ff", emissiveIntensity: 0.35 }), lw / 2 - 0.02 + 0.0, H * 0.12, dt + 0.002, 0);
    doors[0].pivot.add(disp);
  } else if (kind === "chest") {
    const pivot = new THREE.Group();
    pivot.position.set(0, H, -D / 2);
    pivot.add(box(W + 0.01, 0.06, D + 0.01, doorMat, 0, 0.03, D / 2, 0.02));
    pivot.add(box(0.3, 0.02, 0.03, trimMat, 0, 0.03, D + 0.02, 0.006));
    group.add(pivot);
    doors.push({ pivot, axis: "x", max: -1.15 });
    const sMat = partMat("#3a424d", 0.1, 0.9);
    part("seal", box(W - 0.02, 0.012, 0.016, sMat, 0, H + 0.004, D / 2 - 0.02, 0));
    part("seal", box(W - 0.02, 0.012, 0.016, sMat, 0, H + 0.004, -D / 2 + 0.02, 0), false);
    const hg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.08, 12), partMat("#9aa3ad", 0.9, 0.3));
    hg.rotation.z = Math.PI / 2;
    hg.position.set(W * 0.3, H + 0.01, -D / 2 - 0.01);
    part("hinge", hg);
  } else {
    // витрина: уплотнитель и «петли» раздвижных створок условные
    part("seal", box(W - 0.04, 0.014, 0.014, partMat("#3a424d", 0.1, 0.9), 0, bodyH + 0.01, D / 2 - 0.02, 0));
    part("hinge", box(0.05, 0.02, 0.02, partMat("#9aa3ad", 0.9, 0.3), W / 2 - 0.06, H - 0.02, -D / 2 + 0.03, 0.004));
  }

  /* ── Узлы ── */
  const backZ = -D / 2;
  const lowY = Math.min(0.15, bodyH * 0.2);

  // компрессор
  const cMat = partMat("#14171c", 0.7, 0.35);
  const comp = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), cMat);
  comp.scale.set(1, 0.82, 1);
  comp.position.set(W * 0.18, lowY, backZ + 0.02);
  part("compressor", comp);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.03, 20), cMat);
  cap.position.set(W * 0.18, lowY - 0.085, backZ + 0.02);
  part("compressor", cap, false);

  // реле
  part("relay", box(0.05, 0.06, 0.04, partMat("#e8e2d0", 0.1, 0.7), W * 0.18 + 0.125, lowY, backZ + 0.02, 0.008));

  // конденсатор — решётка сзади
  const condMat = partMat("#2b3138", 0.85, 0.35);
  const cy0 = bodyH * 0.3;
  const cy1 = bodyH * 0.92;
  const rows = Math.max(5, Math.round((cy1 - cy0) / 0.075));
  for (let i = 0; i < rows; i++) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, W * 0.78, 6), condMat);
    m.rotation.z = Math.PI / 2;
    m.position.set(0, cy0 + ((cy1 - cy0) * i) / (rows - 1), backZ - 0.03);
    part("condenser", m, i === Math.floor(rows / 2));
  }
  for (const sx of [-1, 1]) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, cy1 - cy0, 6), condMat);
    m.position.set(sx * W * 0.3, (cy0 + cy1) / 2, backZ - 0.038);
    part("condenser", m, false);
  }
  anchors.condenser = new THREE.Vector3(0, (cy0 + cy1) / 2, backZ - 0.03);

  // испаритель — пластина на задней стенке камеры
  const evY = kind === "double" ? (H + splitY) / 2 + 0.1 : bodyH * 0.62;
  const evH = Math.min(0.5, bodyH * 0.4);
  const ev = box(W * 0.62, evH, 0.012, partMat("#cfe9f7", 0.8, 0.25), 0, evY, backZ + t + 0.012, 0.004);
  part("evaporator", ev);
  for (let i = 0; i < 5; i++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, W * 0.54, 6), partMat("#9fd3ee", 0.9, 0.2));
    tube.rotation.z = Math.PI / 2;
    tube.position.set(0, evY - evH / 2 + 0.05 + (i * (evH - 0.1)) / 4, backZ + t + 0.024);
    part("evaporator", tube, false);
  }

  // термостат
  const thY = kind === "chest" || kind === "showcase" ? bodyH * 0.3 : bodyH - 0.2;
  const thZ = kind === "chest" || kind === "showcase" ? D / 2 + 0.01 : 0.12;
  const thX = kind === "chest" || kind === "showcase" ? W / 2 - 0.14 : W / 2 - t - 0.03;
  part("thermostat", box(0.05, 0.07, 0.09, partMat("#f2f2f2", 0.1, 0.6), thX, thY, thZ, 0.01));
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 20), partMat("#3a424d", 0.3, 0.5));
  if (kind === "chest" || kind === "showcase") knob.rotation.x = Math.PI / 2;
  else knob.rotation.z = Math.PI / 2;
  knob.position.set(thX - (kind === "chest" || kind === "showcase" ? 0 : 0.034), thY, thZ + (kind === "chest" || kind === "showcase" ? 0.05 : 0));
  part("thermostat", knob, false);

  // вентилятор
  const fanY = kind === "double" ? splitY * 0.62 : bodyH * 0.3;
  const fanGroup = new THREE.Group();
  fanGroup.position.set(-W * 0.12, fanY, backZ + t + 0.03);
  const fMat = partMat("#dfe6ec", 0.2, 0.5);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.01, 8, 28), fMat);
  fanGroup.add(ring);
  const rotor = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const bl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.022, 0.004), fMat);
    bl.position.x = 0.036;
    bl.rotation.x = 0.5;
    const h = new THREE.Group();
    h.rotation.z = (i * Math.PI * 2) / 5;
    h.add(bl);
    rotor.add(h);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.02, 12), fMat);
  hub.rotation.x = Math.PI / 2;
  rotor.add(hub);
  fanGroup.add(rotor);
  group.add(fanGroup);
  parts.fan = [ring, hub];
  anchors.fan = fanGroup.position.clone();

  // ТЭН оттайки — зигзаг
  const hMat = partMat("#6b4a3a", 0.6, 0.4);
  const hY = fanY - 0.13;
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, W * 0.5, 6), hMat);
    m.rotation.z = Math.PI / 2;
    m.position.set(0.04, Math.max(0.06, hY) + i * 0.022, backZ + t + 0.03);
    part("heater", m, i === 1);
  }

  // плата управления
  const bY = kind === "chest" || kind === "showcase" ? lowY + 0.02 : bodyH - t - 0.012;
  const bX = kind === "chest" || kind === "showcase" ? -W * 0.25 : -W * 0.12;
  const brd = box(0.2, 0.012, 0.13, partMat("#0f6b4a", 0.2, 0.6), bX, bY, kind === "chest" || kind === "showcase" ? backZ + 0.06 : -0.08, 0);
  part("board", brd);
  for (let i = 0; i < 4; i++) {
    part("board", box(0.022, 0.02, 0.022, partMat(i % 2 ? "#1c1c1c" : "#c9a13b", 0.5, 0.4), bX - 0.07 + i * 0.045, bY - 0.014, brd.position.z + (i % 2 ? 0.03 : -0.03), 0), false);
  }

  // датчик
  const sn = new THREE.Mesh(new THREE.SphereGeometry(0.018, 14, 10), partMat("#f5f5f5", 0.2, 0.4));
  sn.position.set(-W / 2 + t + 0.02, evY + 0.05, 0.02);
  part("sensor", sn);
  const snW = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.2, 6), partMat("#f5f5f5", 0.2, 0.4));
  snW.position.set(-W / 2 + t + 0.02, evY + 0.16, 0.02);
  part("sensor", snW, false);

  // лампа
  const lamp = box(0.09, 0.02, 0.05, new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#fff7d6", emissiveIntensity: 0.6 }), 0.1, bodyH - t - 0.025, 0.14, 0.006);
  part("lamp", lamp);

  // дренаж
  const drMat = partMat("#b9c4cf", 0.2, 0.6);
  const drTop = kind === "double" ? splitY + t + 0.03 : bodyH * 0.35;
  const dr = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, Math.max(0.1, drTop - lowY - 0.12), 8), drMat);
  dr.position.set(-W * 0.22, (drTop + lowY + 0.12) / 2, backZ - 0.012);
  part("drain", dr);
  part("drain", box(0.2, 0.025, 0.12, drMat, -W * 0.16, lowY + 0.115, backZ + 0.03, 0.008), false);

  // контур с фреоном
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(W * 0.18, lowY + 0.08, backZ + 0.02),
    new THREE.Vector3(W * 0.36, lowY + 0.2, backZ - 0.03),
    new THREE.Vector3(W * 0.36, cy1, backZ - 0.045),
    new THREE.Vector3(W * 0.1, cy1 + 0.02, backZ - 0.03),
    new THREE.Vector3(-W * 0.34, cy1 - 0.02, backZ - 0.03),
    new THREE.Vector3(-W * 0.36, evY, backZ - 0.01),
    new THREE.Vector3(-W * 0.34, evY - evH / 2, backZ + t + 0.02),
    new THREE.Vector3(-W * 0.36, lowY + 0.25, backZ - 0.02),
    new THREE.Vector3(W * 0.08, lowY + 0.06, backZ + 0.02),
  ]);
  const pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 0.008, 8), partMat("#c98b4a", 0.95, 0.25));
  part("pipes", pipe, false);
  anchors.pipes = new THREE.Vector3(-W * 0.36, evY, backZ - 0.01);

  const interiorLight = new THREE.PointLight("#dff3ff", 0, 2.2, 1.6);
  interiorLight.position.set(0, kind === "double" ? (H + splitY) / 2 : bodyH * 0.6, 0.1);
  group.add(interiorLight);

  return { group, doors, parts, anchors, shell, fanRotor: rotor, interiorLight, size: { w: W, h: H, d: D } };
}
