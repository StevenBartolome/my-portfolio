import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { ThemeMode } from '../types';

interface LampPullCordProps {
  theme: ThemeMode;
  onToggle: () => void;
  onSetTheme?: (theme: ThemeMode) => void;
}

// Crisp mechanical pull-switch audio synthesizer
const playSwitchSound = (turningLampOn: boolean) => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Primary metallic "snap" click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const startFreq = turningLampOn ? 1020 : 720;
    const endFreq = turningLampOn ? 120 : 60;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.032);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.032);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.032);

    // Subtle high-pitch spring ping
    const ping = ctx.createOscillator();
    const pingGain = ctx.createGain();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(turningLampOn ? 1600 : 1100, ctx.currentTime + 0.008);
    ping.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.045);

    pingGain.gain.setValueAtTime(0.09, ctx.currentTime + 0.008);
    pingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

    ping.connect(pingGain);
    pingGain.connect(ctx.destination);

    ping.start(ctx.currentTime + 0.008);
    ping.stop(ctx.currentTime + 0.045);
  } catch {
    // AudioContext might be blocked or restricted; fail gracefully
  }
};

const BEAD_SPACING = 13.5; // Consistent distance between beads in pixels
const TOTAL_REST_LEN = 120; // 120px resting cord length
const PIVOT_Y = 12; // Ceiling suspension pivot Y
const SOCKET_OFFSET_Y = 48; // Distance from ceiling pivot to socket collar
const RESTING_TOTAL_L = PIVOT_Y + SOCKET_OFFSET_Y + TOTAL_REST_LEN - PIVOT_Y; // 168px
const TRIGGER_THRESHOLD = 48; // Pull displacement required to trigger switch

// Cubic Bézier calculation
function getCubicBezier(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
) {
  const oneMinusT = 1 - t;
  const a = oneMinusT * oneMinusT * oneMinusT;
  const b = 3 * oneMinusT * oneMinusT * t;
  const c = 3 * oneMinusT * t * t;
  const d = t * t * t;

  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

export const LampPullCord: React.FC<LampPullCordProps> = ({ theme, onToggle }) => {
  // Sequence rule:
  // Lamp is OPEN (ON)  => Light Mode
  // Lamp is OFF        => Dark Mode
  const isLampOn = theme === 'light';

  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // Stationary ceiling fixture: Anchor X is fixed near top right (adapted for mobile)
  const lampX = Math.max(50, windowDimensions.width - (windowDimensions.width < 480 ? 56 : 72));

  // Synchronized lamp tilt angle (in degrees, rotates smoothly towards pull vector)
  const [lampTilt, setLampTilt] = useState(0);
  const lampTiltRef = useRef(0);

  // Pendulum oscillation physics refs
  const velAngleRef = useRef(0); // Angular velocity in rad/s
  const currentLRef = useRef(RESTING_TOTAL_L); // Distance from pivot (lampX, PIVOT_Y) to handle
  const velLRef = useRef(0); // Velocity of distance contraction

  const [isDraggingRope, setIsDraggingRope] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    return !localStorage.getItem('steven_lamp_hint_dismissed');
  });

  // Socket anchor point (at rest)
  const defaultAnchorY = PIVOT_Y + SOCKET_OFFSET_Y; // 60px
  const restHandleY = defaultAnchorY + TOTAL_REST_LEN; // 180px

  // Handle position
  const handlePosRef = useRef({ x: lampX, y: restHandleY });

  // Initial bead count at rest
  const initialBeadCount = Math.round(TOTAL_REST_LEN / BEAD_SPACING);

  // SVG rendering states (strictly straight vertical plumb-line at rest)
  const [ropePathString, setRopePathString] = useState(
    () => `M ${lampX} ${defaultAnchorY} L ${lampX} ${restHandleY}`
  );
  const [beadPositions, setBeadPositions] = useState<{ x: number; y: number }[]>(() => {
    const beads: { x: number; y: number }[] = [];
    for (let i = 1; i <= initialBeadCount; i++) {
      const t = i / (initialBeadCount + 1);
      beads.push({ x: lampX, y: defaultAnchorY + TOTAL_REST_LEN * t });
    }
    return beads;
  });
  const [handleTransform, setHandleTransform] = useState<{ x: number; y: number; angle: number }>({
    x: lampX,
    y: restHandleY,
    angle: 0,
  });

  const isDraggingRef = useRef(false);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: lampX, y: restHandleY });
  const hasTriggeredRef = useRef(false);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isAwakeRef = useRef(false);
  const isLoopRunningRef = useRef(false);

  // Set strictly straight vertical rest state
  const setExactRestPosition = useCallback((currentLampX: number) => {
    handlePosRef.current = { x: currentLampX, y: restHandleY };
    lampTiltRef.current = 0;
    velAngleRef.current = 0;
    currentLRef.current = RESTING_TOTAL_L;
    velLRef.current = 0;
    setLampTilt(0);

    const restBeadCount = Math.round(TOTAL_REST_LEN / BEAD_SPACING);
    const beads: { x: number; y: number }[] = [];
    for (let i = 1; i <= restBeadCount; i++) {
      const t = i / (restBeadCount + 1);
      beads.push({ x: currentLampX, y: defaultAnchorY + TOTAL_REST_LEN * t });
    }

    setBeadPositions(beads);
    setRopePathString(`M ${currentLampX} ${defaultAnchorY} L ${currentLampX} ${restHandleY}`);
    setHandleTransform({
      x: currentLampX,
      y: restHandleY,
      angle: 0, // Always 0 degrees (pointing straight down)
    });
  }, [defaultAnchorY, restHandleY]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      setWindowDimensions({ width: newW, height: newH });
      const newLampX = Math.max(50, newW - (newW < 480 ? 56 : 72));
      if (!isDraggingRef.current) {
        setExactRestPosition(newLampX);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setExactRestPosition]);

  // Main physics step calculation
  const updatePhysics = useCallback(() => {
    const dt = 0.016;

    // 1. CALCULATE TILT & POSITION (DRAGGING vs PENDULUM RELEASE)
    if (isDraggingRef.current) {
      handlePosRef.current = {
        x: pointerPosRef.current.x,
        y: pointerPosRef.current.y,
      };

      const dx = handlePosRef.current.x - lampX;
      const dy = Math.max(20, handlePosRef.current.y - PIVOT_Y);
      // Raw angle: negative dx (dragged left) produces positive clockwise rotation
      const rawAngle = -Math.atan2(dx, dy) * (180 / Math.PI);
      // Aim directly along chord towards the hand up to ±58 degrees
      const targetTilt = Math.max(-58, Math.min(58, rawAngle * 0.92));

      // Track angular velocity so dropping carries inertia
      const dAngleDeg = targetTilt - lampTiltRef.current;
      velAngleRef.current = (dAngleDeg * (Math.PI / 180)) / dt;
      velAngleRef.current = Math.max(-12, Math.min(12, velAngleRef.current));

      lampTiltRef.current += dAngleDeg * 0.22;
      setLampTilt(lampTiltRef.current);

      // Track total distance from pivot
      currentLRef.current = Math.hypot(dx, dy);

      // Check pull threshold for theme trigger
      const pullDy = handlePosRef.current.y - restHandleY;
      const pullStretch = Math.hypot(handlePosRef.current.x - lampX, handlePosRef.current.y - defaultAnchorY) - TOTAL_REST_LEN;

      if ((pullDy > TRIGGER_THRESHOLD || pullStretch > TRIGGER_THRESHOLD) && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        setIsTriggered(true);

        playSwitchSound(!isLampOn);
        onToggle();

        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.([20, 10, 20]);
        }

        setTimeout(() => setIsTriggered(false), 360);
      }
    } else {
      // PENDULUM SWING ANIMATION:
      // When dropped from the side, swings side-to-side with natural harmonic physics!
      const omega = 4.8; // Natural frequency rad/s (gives ~1.3s swing period)

      // Angular acceleration: a = -omega^2 * sin(theta)
      const thetaRad = (lampTiltRef.current * Math.PI) / 180;
      const accel = -Math.sin(thetaRad) * (omega * omega);

      // Damped harmonic angular velocity: 0.968 allows ~4-5 natural visible swings before resting
      velAngleRef.current = (velAngleRef.current + accel * dt) * 0.968;
      lampTiltRef.current += (velAngleRef.current * (180 / Math.PI)) * dt;
      setLampTilt(lampTiltRef.current);

      // Cord length contracts back towards resting length with damped spring
      const fL = (RESTING_TOTAL_L - currentLRef.current) * 0.08;
      velLRef.current = (velLRef.current + fL) * 0.82;
      currentLRef.current += velLRef.current;

      // Handle position follows the swinging pendulum arc
      const swingRad = (lampTiltRef.current * Math.PI) / 180;
      handlePosRef.current.x = lampX - currentLRef.current * Math.sin(swingRad);
      handlePosRef.current.y = PIVOT_Y + currentLRef.current * Math.cos(swingRad);

      // Settling condition: when swing has naturally died down, lock into straight plumb line
      if (
        Math.abs(lampTiltRef.current) < 0.25 &&
        Math.abs(velAngleRef.current) < 0.08 &&
        Math.abs(currentLRef.current - RESTING_TOTAL_L) < 0.8
      ) {
        isAwakeRef.current = false;
        setExactRestPosition(lampX);
        return;
      }
    }

    // 2. CALCULATE EXACT ROTATED SOCKET ANCHOR POINT
    // Pivot is at (lampX, 12). Distance to socket collar is 48px.
    const rad = (lampTiltRef.current * Math.PI) / 180;
    const currentAnchorX = lampX - SOCKET_OFFSET_Y * Math.sin(rad);
    const currentAnchorY = PIVOT_Y + SOCKET_OFFSET_Y * Math.cos(rad);

    // Tangential direction vector leaving socket
    const exitDirX = -Math.sin(rad);
    const exitDirY = Math.cos(rad);

    // 3. TENSION ALIGNMENT & DYNAMIC BÉZIER CONTROL POINTS
    const p0 = { x: currentAnchorX, y: currentAnchorY };
    const p3 = { x: handlePosRef.current.x, y: handlePosRef.current.y };

    const dx = p3.x - p0.x;
    const dy = p3.y - p0.y;
    const chordDist = Math.hypot(dx, dy) || 1;
    const chordDirX = dx / chordDist;
    const chordDirY = dy / chordDist;

    // Tension factor: 0 when resting/slack (<=120px), blends to 1 when pulled taut (>=220px)
    const tension = Math.max(0, Math.min(1, (chordDist - TOTAL_REST_LEN) / 100));

    // Direction vector at the socket collar smoothly blends into the chord direction under tension
    const exitBlendX = exitDirX * (1 - tension) + chordDirX * tension;
    const exitBlendY = exitDirY * (1 - tension) + chordDirY * tension;
    const exitLen = Math.hypot(exitBlendX, exitBlendY) || 1;
    const normalExitX = exitBlendX / exitLen;
    const normalExitY = exitBlendY / exitLen;

    // Control point 1: Aligns onto the straight line under tension
    const p1 = {
      x: p0.x + normalExitX * (chordDist * 0.33),
      y: p0.y + normalExitY * (chordDist * 0.33),
    };

    // Control point 2: Aligns onto the straight line under tension
    const p2 = {
      x: p3.x - chordDirX * (chordDist * 0.33),
      y: p3.y - chordDirY * (chordDist * 0.33),
    };

    // SVG cubic bezier path (Guaranteed perfectly straight under tension!)
    const path = `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}, ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}`;
    setRopePathString(path);

    // 4. DYNAMIC BEAD COUNT & EVEN SPACING BASED ON LENGTH
    // Automatically scales the number of beads to keep consistent ~13.5px spacing across any distance
    const beadCount = Math.max(6, Math.round(chordDist / BEAD_SPACING));
    const beads: { x: number; y: number }[] = [];
    for (let i = 1; i <= beadCount; i++) {
      const t = i / (beadCount + 1);
      beads.push(getCubicBezier(p0, p1, p2, p3, t));
    }
    setBeadPositions(beads);

    // 5. HANDLE ORIENTATION: Aligns directly along the cord direction
    const angle = Math.abs(dx) < 0.3 && Math.abs(lampTiltRef.current) === 0
      ? 0
      : (Math.atan2(chordDirY, chordDirX) * 180) / Math.PI - 90;

    setHandleTransform({
      x: p3.x,
      y: p3.y,
      angle,
    });
  }, [defaultAnchorY, restHandleY, isLampOn, onToggle, lampX, setExactRestPosition]);

  // Continuous animation frame runner
  const runPhysicsLoop = useCallback(function tick() {
    updatePhysics();
    if (isAwakeRef.current || isDraggingRef.current) {
      rafIdRef.current = requestAnimationFrame(tick);
    } else {
      isLoopRunningRef.current = false;
      rafIdRef.current = null;
    }
  }, [updatePhysics]);

  // Reliable wake mechanism that starts loop immediately
  const wakePhysics = useCallback(() => {
    isAwakeRef.current = true;
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(runPhysicsLoop);
    }
  }, [runPhysicsLoop]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const activeTouchIdRef = useRef<number | null>(null);

  // Core unified drag starter
  const startDrag = useCallback((clientX: number, clientY: number) => {
    setIsDraggingRope(true);
    isDraggingRef.current = true;
    hasTriggeredRef.current = false;
    dragStartPosRef.current = { x: clientX, y: clientY };
    dragStartTimeRef.current = Date.now();
    pointerPosRef.current = { x: clientX, y: clientY };

    if (showHint) {
      setShowHint(false);
      localStorage.setItem('steven_lamp_hint_dismissed', 'true');
    }

    wakePhysics();
    updatePhysics();
  }, [showHint, wakePhysics, updatePhysics]);

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    pointerPosRef.current = { x: clientX, y: clientY };
    wakePhysics();
  }, [wakePhysics]);

  const endDrag = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingRope(false);

    const dragDuration = Date.now() - dragStartTimeRef.current;
    const dragDist = Math.hypot(
      clientX - dragStartPosRef.current.x,
      clientY - dragStartPosRef.current.y
    );

    // Quick tap / click behavior without drag
    if (dragDist < 10 && dragDuration < 350 && !hasTriggeredRef.current) {
      playSwitchSound(!isLampOn);
      onToggle();
      setIsTriggered(true);
      setTimeout(() => setIsTriggered(false), 360);

      // Downward vertical impulse for click spring bounce
      velLRef.current = 28;
    }

    wakePhysics();
  }, [isLampOn, onToggle, wakePhysics]);

  // Touch event handler: Crucial for mobile! Prevents page scrolling with non-passive touchmove
  const handleTouchStart = (e: React.TouchEvent<HTMLElement | SVGGElement>) => {
    // Unconditionally prevent mobile browser from initiating vertical scrolling / gestures
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();

    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    activeTouchIdRef.current = touch.identifier;

    startDrag(touch.clientX, touch.clientY);

    const onTouchMove = (ev: TouchEvent) => {
      // Non-passive listener allows e.preventDefault() to unconditionally suppress page scrolling
      if (ev.cancelable) {
        ev.preventDefault();
      }
      for (let i = 0; i < ev.touches.length; i++) {
        if (ev.touches[i].identifier === activeTouchIdRef.current) {
          updateDrag(ev.touches[i].clientX, ev.touches[i].clientY);
          break;
        }
      }
    };

    const onTouchEnd = (ev: TouchEvent) => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);

      let found = false;
      for (let i = 0; i < ev.changedTouches.length; i++) {
        if (ev.changedTouches[i].identifier === activeTouchIdRef.current) {
          endDrag(ev.changedTouches[i].clientX, ev.changedTouches[i].clientY);
          found = true;
          break;
        }
      }
      if (!found) {
        endDrag(pointerPosRef.current.x, pointerPosRef.current.y);
      }
      activeTouchIdRef.current = null;
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
  };

  // Pointer event handler for mouse, stylus, and desktop drag
  const handlePointerDown = (e: React.PointerEvent<HTMLElement | SVGGElement>) => {
    // If a touch gesture is already being handled via handleTouchStart, skip duplicate pointerdown
    if (e.pointerType === 'touch' && activeTouchIdRef.current !== null) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }

    startDrag(e.clientX, e.clientY);

    const onPointerMove = (ev: PointerEvent) => {
      updateDrag(ev.clientX, ev.clientY);
    };

    const onPointerUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);

      endDrag(ev.clientX, ev.clientY);
    };

    const onPointerCancel = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);

      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDraggingRope(false);
        wakePhysics();
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
  };

  return (
    <aside className="lamp-pull-cord-root" aria-label="Interactive Lamp Theme Switcher">
      <svg
        className="lamp-svg-canvas"
        viewBox={`0 0 ${windowDimensions.width} ${windowDimensions.height}`}
        aria-hidden="true"
      >
        <defs>
          {/* Drop shadow */}
          <filter id="lampDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="3"
              floodOpacity={isLampOn ? '0.15' : '0.45'}
              floodColor="#000000"
            />
          </filter>

          {/* Lamp shade metallic finish */}
          <linearGradient id="shadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F333E" />
            <stop offset="50%" stopColor="#1B1D24" />
            <stop offset="100%" stopColor="#0B0D11" />
          </linearGradient>

          {/* Golden brass gradient */}
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ECC875" />
            <stop offset="40%" stopColor="#FFF1B8" />
            <stop offset="70%" stopColor="#D4A747" />
            <stop offset="100%" stopColor="#A67B22" />
          </linearGradient>

          {/* Rope bead gradient */}
          <radialGradient id="beadGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF4D0" />
            <stop offset="45%" stopColor="#DEAC42" />
            <stop offset="100%" stopColor="#875E12" />
          </radialGradient>

          {/* LAMP OPEN: Radiant Light Cone Beam (Illuminates scene in Light Mode) */}
          <radialGradient id="lampOpenConeGrad" cx="50%" cy="0%" r="95%">
            <stop offset="0%" stopColor="rgba(255, 205, 80, 0.42)" />
            <stop offset="25%" stopColor="rgba(255, 185, 50, 0.22)" />
            <stop offset="60%" stopColor="rgba(255, 170, 30, 0.08)" />
            <stop offset="100%" stopColor="rgba(255, 170, 30, 0)" />
          </radialGradient>

          {/* Bulb glowing bloom */}
          <radialGradient id="bulbBloomGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 230, 130, 0.95)" />
            <stop offset="45%" stopColor="rgba(255, 170, 40, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 150, 30, 0)" />
          </radialGradient>
        </defs>

        {/* =================================================================
            1. CEILING CANOPY (Stationary ceiling mount - stays flat on ceiling)
            ================================================================= */}
        <g className="lamp-canopy">
          <path
            d={`M ${lampX - 22} 0 L ${lampX + 22} 0 Q ${lampX + 22} 10 ${lampX + 14} 12 L ${lampX - 14} 12 Q ${lampX - 22} 10 ${lampX - 22} 0 Z`}
            fill="url(#brassGrad)"
            filter="url(#lampDropShadow)"
          />
          <circle cx={lampX - 6} cy={6} r={1.2} fill="#694D12" />
          <circle cx={lampX} cy={6} r={1.2} fill="#694D12" />
          <circle cx={lampX + 6} cy={6} r={1.2} fill="#694D12" />
        </g>

        {/* =================================================================
            2. SYNCHRONIZED PENDANT ASSEMBLY (Shade, Bulb, AND Light Cone)
            - Pivots smoothly around the ceiling suspension point (lampX, 12)
            - When dropped from the side, swings side-to-side with natural pendulum physics!
            - Light cone projects in the exact direction the lamp is pointing!
            ================================================================= */}
        <g transform={`rotate(${lampTilt.toFixed(2)}, ${lampX}, ${PIVOT_Y})`}>
          {/* Light Cone: Inside rotated group, casts light in the direction the lamp is aimed */}
          <polygon
            className="lamp-light-cone"
            points={`${lampX - 24},47 ${lampX + 24},47 ${lampX + 175},${windowDimensions.height} ${lampX - 175},${windowDimensions.height}`}
            fill="url(#lampOpenConeGrad)"
            style={{
              opacity: isLampOn ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />

          {/* Suspension cord (Pivoting from y = 12) */}
          <line
            x1={lampX}
            y1={12}
            x2={lampX}
            y2={30}
            stroke="#181A20"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Lamp shade body & bulb */}
          <g className="lamp-shade-assembly">
            {/* Top brass mounting nut */}
            <rect
              x={lampX - 5}
              y={26}
              width={10}
              height={6}
              rx={1.5}
              fill="url(#brassGrad)"
            />

            {/* Lamp shade body */}
            <path
              d={`M ${lampX - 9} 31 L ${lampX + 9} 31 L ${lampX + 26} 47 L ${lampX - 26} 47 Z`}
              fill="url(#shadeGrad)"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="0.8"
              filter="url(#lampDropShadow)"
            />

            {/* Shade brass rim */}
            <ellipse
              cx={lampX}
              cy={47}
              rx={26}
              ry={3.5}
              fill="none"
              stroke="url(#brassGrad)"
              strokeWidth="1.6"
            />

            {/* Lamp OPEN bulb bloom */}
            {isLampOn && (
              <circle
                className="lamp-bulb-bloom"
                cx={lampX}
                cy={52}
                r={28}
                fill="url(#bulbBloomGrad)"
                style={{ opacity: 0.9 }}
              />
            )}

            {/* Bulb glass dome */}
            <ellipse
              cx={lampX}
              cy={52}
              rx={8.5}
              ry={9.5}
              fill={isLampOn ? '#FFF2BA' : '#22252E'}
              stroke={isLampOn ? '#FFA812' : '#3E4352'}
              strokeWidth="1"
              filter={isLampOn ? 'drop-shadow(0 0 6px #FFB800)' : undefined}
            />

            {/* Bulb filament */}
            <path
              d={`M ${lampX - 3} 51 Q ${lampX} 47 ${lampX + 3} 51 Q ${lampX} 55 ${lampX - 3} 51`}
              fill="none"
              stroke={isLampOn ? '#FF5500' : '#454955'}
              strokeWidth="1.2"
            />

            {/* Socket collar where rope emerges */}
            <ellipse
              cx={lampX}
              cy={defaultAnchorY}
              rx={4}
              ry={2}
              fill="url(#brassGrad)"
              stroke="#916916"
              strokeWidth="0.8"
            />
          </g>
        </g>

        {/* =================================================================
            3. THE ROPE (Originates exactly from the rotated socket collar)
            - 100% straight and tension-aligned under pull
            - Swings side-to-side along the pendulum arc when released
            ================================================================= */}
        {ropePathString && (
          <>
            {/* Outer drop shadow */}
            <path
              d={ropePathString}
              fill="none"
              stroke="rgba(0, 0, 0, 0.22)"
              strokeWidth="4"
              strokeLinecap="round"
              transform="translate(1, 2)"
            />

            {/* Main rope line */}
            <path
              d={ropePathString}
              fill="none"
              stroke="url(#brassGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Subtle inner sheen */}
            <path
              d={ropePathString}
              fill="none"
              stroke="#FFF8E0"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Beaded balls spaced evenly based on distance along the cord curve */}
            {beadPositions.map((pos, idx) => (
              <circle
                key={idx}
                cx={pos.x}
                cy={pos.y}
                r={2.4}
                fill="url(#beadGrad)"
                stroke="#7A5610"
                strokeWidth="0.4"
              />
            ))}
          </>
        )}

        {/* =================================================================
            4. THE ROPE HANDLE / FOB (Aligned along the cord line, straight at rest)
            ================================================================= */}
        <g
          className={`lamp-handle-group ${isDraggingRope ? 'is-dragging' : ''}`}
          transform={`translate(${handleTransform.x}, ${handleTransform.y}) rotate(${handleTransform.angle})`}
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
          role="presentation"
        >
          <title>{isLampOn ? 'Pull rope to turn off lamp' : 'Pull rope to turn on lamp'}</title>

          {/* Invisible enlarged hit target for effortless grab & mobile touch */}
          <circle cx={0} cy={16} r={32} fill="transparent" />

          {/* Trigger pulse ring (Centered on the handle itself, never moves the lamp) */}
          {isTriggered && (
            <circle
              cx={0}
              cy={16}
              r={24}
              fill="none"
              stroke="#FFB800"
              strokeWidth="2.5"
              className="lamp-switch-triggered"
            />
          )}

          {/* Knurled brass handle body */}
          <rect
            x={-4.5}
            y={0}
            width={9}
            height={16}
            rx={2}
            fill="url(#brassGrad)"
            stroke="#7A5610"
            strokeWidth="0.7"
            filter="url(#lampDropShadow)"
          />

          {/* Ridges */}
          <line x1={-3.5} y1={4} x2={3.5} y2={4} stroke="#7A5610" strokeWidth="0.8" />
          <line x1={-3.5} y1={7} x2={3.5} y2={7} stroke="#7A5610" strokeWidth="0.8" />
          <line x1={-3.5} y1={10} x2={3.5} y2={10} stroke="#7A5610" strokeWidth="0.8" />
          <line x1={-3.5} y1={13} x2={3.5} y2={13} stroke="#7A5610" strokeWidth="0.8" />

          {/* Weight sphere */}
          <circle
            cx={0}
            cy={19}
            r={5.5}
            fill="url(#brassGrad)"
            stroke="#7A5610"
            strokeWidth="0.8"
          />

          {/* Pull ring */}
          <circle
            cx={0}
            cy={28}
            r={5.5}
            fill="none"
            stroke="url(#brassGrad)"
            strokeWidth="2.2"
          />
        </g>
      </svg>

      {/* =================================================================
          4. UNIVERSAL TOUCH & MOUSE HIT OVERLAY
          HTML element supporting touch-action: none across all mobile browsers
          ================================================================= */}
      <div
        className={`lamp-touch-handle ${isDraggingRope ? 'is-dragging' : ''}`}
        style={{
          left: `${handleTransform.x}px`,
          top: `${handleTransform.y + 16}px`,
        }}
        onPointerDown={handlePointerDown}
        onTouchStart={handleTouchStart}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playSwitchSound(!isLampOn);
            onToggle();
            setIsTriggered(true);
            velLRef.current = 28;
            wakePhysics();
            setTimeout(() => setIsTriggered(false), 360);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={isLampOn ? 'Turn off lamp (Switch to Dark Mode)' : 'Turn on lamp (Switch to Light Mode)'}
        title={isLampOn ? 'Pull rope to turn off lamp' : 'Pull rope to turn on lamp'}
      />

      {/* =================================================================
          5. FLOATING HINT BADGE (Guides user, auto-fades on interaction)
          ================================================================= */}
      {showHint && (
        <div
          className="lamp-hint-badge"
          style={{
            top: `${handleTransform.y + 6}px`,
            ...(windowDimensions.width < 640
              ? {
                  right: `${Math.max(12, windowDimensions.width - handleTransform.x + 24)}px`,
                  left: 'auto',
                }
              : {
                  left: `${handleTransform.x + 34}px`,
                  right: 'auto',
                }),
            opacity: isDraggingRope ? 0 : 1,
            transform: isDraggingRope ? 'scale(0.9) translateX(10px)' : 'scale(1) translateX(0)',
          }}
        >
          <span className="hint-dot" />
          <span>{isLampOn ? 'Pull rope to turn off light' : 'Pull rope to turn on light'}</span>
        </div>
      )}
    </aside>
  );
};
