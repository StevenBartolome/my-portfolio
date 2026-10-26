import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

interface BlockPortraitProps {
  imageSrc: string;
  altText: string;
}

interface BlockState {
  key: string;
  bx: number;
  by: number;
  centerX: number;
  centerY: number;
  color: [number, number, number, number]; // r, g, b, a
  state: 'appearing' | 'visible' | 'disappearing';
  startTime: number;
  duration: number;
  dist: number;
  ring: number;
  angle: number;
}

// Subtle spring ease for smooth tactile pop-in
function easeOutBack(t: number): number {
  const c1 = 1.35;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Smooth cubic ease for liquid dissolve reset
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export const BlockPortrait: React.FC<BlockPortraitProps> = ({
  imageSrc,
  altText,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasBlocks, setHasBlocks] = useState(false);
  const [isOverBlock, setIsOverBlock] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Map of active animated blocks
  const blocksMapRef = useRef<Map<string, BlockState>>(new Map());
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const blockSize = 14;
  const cursorRadius = 110;

  // Load image once into offscreen canvas for fast pixel sampling
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageObjRef.current = img;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = img.naturalWidth;
      offCanvas.height = img.naturalHeight;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (offCtx) {
        offCtx.drawImage(img, 0, 0);
        offscreenCanvasRef.current = offCanvas;
        setIsLoaded(true);
      }
    };
  }, [imageSrc]);

  // Main canvas render frame
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const offCanvas = offscreenCanvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !offCanvas || !img || !isLoaded) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const width = canvas.width;
    const height = canvas.height;
    const now = performance.now();

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw smooth base photo first
    ctx.drawImage(img, 0, 0, width, height);

    let stillAnimating = false;
    const blocksMap = blocksMapRef.current;

    // 2. Render animated blocks one block by block
    blocksMap.forEach((block, key) => {
      let scale = 1;
      let alphaMultiplier = 1;

      if (block.state === 'appearing') {
        if (now < block.startTime) {
          // Hasn't started yet, remains smooth photo underneath
          stillAnimating = true;
          return;
        }
        const elapsed = now - block.startTime;
        const t = Math.min(1, elapsed / block.duration);
        scale = Math.max(0, easeOutBack(t));
        alphaMultiplier = Math.min(1, t * 1.25);

        if (t < 1) {
          stillAnimating = true;
        } else {
          block.state = 'visible';
          scale = 1;
          alphaMultiplier = 1;
        }
      } else if (block.state === 'disappearing') {
        if (now < block.startTime) {
          // Waiting its turn to dissolve: remains fully visible
          scale = 1;
          alphaMultiplier = 1;
          stillAnimating = true;
        } else {
          const elapsed = now - block.startTime;
          const t = Math.min(1, elapsed / block.duration);
          const easeT = easeOutCubic(t);
          scale = Math.max(0, 1 - easeT * 0.85);
          alphaMultiplier = Math.max(0, 1 - easeT);

          if (t < 1) {
            stillAnimating = true;
          } else {
            // Finished disappearing, remove from map!
            blocksMap.delete(key);
            return;
          }
        }
      }

      // Draw the block scaled around its center
      const [r, g, b, baseAlpha] = block.color;
      const finalAlpha = Math.min(1, Math.max(0.4, baseAlpha)) * alphaMultiplier;

      if (scale > 0.02 && finalAlpha > 0.03) {
        const renderSize = blockSize * scale;
        const offsetX = block.centerX - renderSize / 2;
        const offsetY = block.centerY - renderSize / 2;

        // Fill block body directly over the base photo for seamless, tear-free transition
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
        ctx.fillRect(offsetX, offsetY, renderSize, renderSize);

        // Highlight top-left edge & shadow bottom-right edge for 3D pixel block feel
        if (renderSize > 5) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.18 * finalAlpha})`;
          ctx.fillRect(offsetX, offsetY, renderSize, 1);
          ctx.fillRect(offsetX, offsetY, 1, renderSize);

          ctx.fillStyle = `rgba(0, 0, 0, ${0.22 * finalAlpha})`;
          ctx.fillRect(offsetX, offsetY + renderSize - 1, renderSize, 1);
          ctx.fillRect(offsetX + renderSize - 1, offsetY, 1, renderSize);
        }
      }
    });

    // 3. Draw subtle cursor scope ring while hovering
    if (isHovering && mousePosRef.current) {
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, cursorRadius, 0, Math.PI * 2);
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(255, 122, 0, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    const currentBlocksCount = blocksMap.size;
    setHasBlocks(currentBlocksCount > 0);
    if (currentBlocksCount === 0) {
      setShowReset(false);
    }

    return stillAnimating;
  }, [isLoaded, isHovering]);

  // Animation loop runner
  const startAnimationLoop = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const loop = () => {
      const stillRunning = renderFrame();
      if (stillRunning || isHovering) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        isAnimatingRef.current = false;
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, [renderFrame, isHovering]);

  // Adjust canvas resolution to match display size
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const displayWidth = Math.floor(rect.width);
      const displayHeight = Math.floor(displayWidth * 1.25);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
      renderFrame();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [renderFrame]);

  useEffect(() => {
    renderFrame();
  }, [renderFrame, isLoaded]);

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current = { x, y };
    setIsHovering(true);

    // Detect if cursor is near any existing blocks
    let over = false;
    for (const block of blocksMapRef.current.values()) {
      if (Math.hypot(block.centerX - x, block.centerY - y) < cursorRadius * 0.85) {
        over = true;
        break;
      }
    }
    setIsOverBlock(over);
    if (over) {
      setShowReset(true);
    }

    if (!isAnimatingRef.current) {
      startAnimationLoop();
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (!isAnimatingRef.current) startAnimationLoop();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsOverBlock(false);
    mousePosRef.current = null;
    if (!isAnimatingRef.current) startAnimationLoop();
  };

  // Click on photo: stamps only the scope of the cursor ONE BLOCK BY BLOCK
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicked on reset chip, ignore canvas click
    if ((e.target as HTMLElement).closest('.block-reset-chip')) {
      return;
    }

    const canvas = canvasRef.current;
    const offCanvas = offscreenCanvasRef.current;
    if (!canvas || !offCanvas) return;

    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const scaleX = offCanvas.width / width;
    const scaleY = offCanvas.height / height;

    const startX = Math.max(0, Math.floor((mx - cursorRadius) / blockSize) * blockSize);
    const endX = Math.min(width, Math.ceil((mx + cursorRadius) / blockSize) * blockSize);
    const startY = Math.max(0, Math.floor((my - cursorRadius) / blockSize) * blockSize);
    const endY = Math.min(height, Math.ceil((my + cursorRadius) / blockSize) * blockSize);

    // Gather candidate blocks in cursor scope
    const candidates: Array<{
      key: string;
      bx: number;
      by: number;
      centerX: number;
      centerY: number;
      color: [number, number, number, number];
      dist: number;
      ring: number;
      angle: number;
    }> = [];

    for (let bx = startX; bx < endX; bx += blockSize) {
      for (let by = startY; by < endY; by += blockSize) {
        const centerX = bx + blockSize / 2;
        const centerY = by + blockSize / 2;
        const dist = Math.hypot(centerX - mx, centerY - my);

        if (dist <= cursorRadius) {
          const sampleX = Math.floor(centerX * scaleX);
          const sampleY = Math.floor(centerY * scaleY);
          if (sampleX >= 0 && sampleX < offCanvas.width && sampleY >= 0 && sampleY < offCanvas.height) {
            const pixel = offCtx.getImageData(sampleX, sampleY, 1, 1).data;
            const alpha = pixel[3] / 255;

            if (alpha > 0.08) {
              const angle = Math.atan2(centerY - my, centerX - mx);
              const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
              const ring = Math.floor(dist / blockSize);

              candidates.push({
                key: `${bx},${by}`,
                bx,
                by,
                centerX,
                centerY,
                color: [pixel[0], pixel[1], pixel[2], alpha],
                dist,
                ring,
                angle: normalizedAngle,
              });
            }
          }
        }
      }
    }

    if (candidates.length === 0) return;

    // Filter out blocks that are already completely visible to keep new animations crisp
    const toAnimate = candidates.filter((c) => {
      const existing = blocksMapRef.current.get(c.key);
      return !existing || existing.state !== 'visible';
    });

    // Sort blocks by ring outward, and then by angle around center:
    // This creates an organic, smooth outward spiral ripple ONE BLOCK BY BLOCK!
    toAnimate.sort((a, b) => {
      if (a.ring !== b.ring) {
        return a.ring - b.ring;
      }
      return a.angle - b.angle;
    });

    const now = performance.now();
    // Dynamically calculate stagger delay so the wave always feels energetic and distinctly block-by-block
    const totalWaveTime = 420;
    const stepDelay = Math.max(3.5, Math.min(9, totalWaveTime / Math.max(1, toAnimate.length)));
    const blockDuration = 200;

    toAnimate.forEach((cand, index) => {
      blocksMapRef.current.set(cand.key, {
        ...cand,
        state: 'appearing',
        startTime: now + index * stepDelay,
        duration: blockDuration,
      });
    });

    setHasBlocks(true);
    setIsOverBlock(true);
    setShowReset(true);
    startAnimationLoop();
  };

  // Reset option: dissolves blocks ONE BLOCK BY BLOCK in a smooth wave back to smooth photo
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blocksMap = blocksMapRef.current;
    if (blocksMap.size === 0) return;

    const now = performance.now();

    // Collect all blocks that are currently visible or already appearing
    // If a block was scheduled in the future and hasn't appeared yet, cancel it immediately
    const activeBlocks: BlockState[] = [];
    blocksMap.forEach((block, key) => {
      if (block.state === 'appearing' && now < block.startTime) {
        blocksMap.delete(key);
      } else {
        activeBlocks.push(block);
      }
    });

    if (activeBlocks.length === 0) {
      setHasBlocks(false);
      setShowReset(false);
      renderFrame();
      return;
    }

    // Sort blocks from outside to inside, and around the ring:
    // Outermost ring dissolves first, shrinking inward to the center ONE BLOCK BY BLOCK!
    activeBlocks.sort((a, b) => {
      if (b.ring !== a.ring) {
        return b.ring - a.ring; // outer ring first
      }
      return b.angle - a.angle;
    });

    const totalResetTime = 400;
    const resetStepDelay = Math.max(3, Math.min(8, totalResetTime / Math.max(1, activeBlocks.length)));
    const resetDuration = 190;

    activeBlocks.forEach((block, index) => {
      block.state = 'disappearing';
      block.startTime = now + index * resetStepDelay;
      block.duration = resetDuration;
    });

    setIsOverBlock(false);
    startAnimationLoop();
  };

  return (
    <div
      className="portrait-wrapper"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title="Click on the photo to turn cursor area into blocks"
    >
      {/* Clean Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="portrait-cutout portrait-canvas"
        aria-label={altText}
      />

      {/* Reset Option: Appears when blocks exist and cursor hovers over them */}
      {hasBlocks && showReset && (isOverBlock || isHovering) && (
        <button
          type="button"
          className="block-reset-chip"
          onClick={handleReset}
          title="Reset photo back to smooth (block by block)"
          aria-label="Reset photo back to smooth"
        >
          <RotateCcw size={13} />
          <span>Reset Photo</span>
        </button>
      )}
    </div>
  );
};

