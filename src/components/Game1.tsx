'use client';

import { useEffect, useState, useRef } from 'react';

const CANVAS_W = 480;
const CANVAS_H = 320;
const PLAYER_SIZE = 28;
const POOP_SIZE = 22;
const PLAYER_SPEED = 3;
const INITIAL_POOP_SPEED = 1.8;
const SPAWN_INTERVAL = 900;

interface Poop {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function PoopSurvivors({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    player: { x: CANVAS_W / 2, y: CANVAS_H / 2 },
    poops: [] as Poop[],
    score: 0,
    alive: true,
    keys: {} as Record<string, boolean>,
    lastSpawn: 0,
    nextId: 0,
    speed: INITIAL_POOP_SPEED,
  });

  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      s.keys[e.key] = down;
    };

    window.addEventListener('keydown', (e) => onKey(e, true));
    window.addEventListener('keyup', (e) => onKey(e, false));

    let last = performance.now();

    function spawnPoop(now: number) {
      if (now - s.lastSpawn < SPAWN_INTERVAL) return;
      s.lastSpawn = now;
      const edge = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (edge === 0) { x = Math.random() * CANVAS_W; y = -POOP_SIZE; }
      else if (edge === 1) { x = CANVAS_W + POOP_SIZE; y = Math.random() * CANVAS_H; }
      else if (edge === 2) { x = Math.random() * CANVAS_W; y = CANVAS_H + POOP_SIZE; }
      else { x = -POOP_SIZE; y = Math.random() * CANVAS_H; }

      const dx = s.player.x - x, dy = s.player.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      s.poops.push({ id: s.nextId++, x, y, vx: (dx / dist) * s.speed, vy: (dy / dist) * s.speed });
    }

    function loop(now: number) {
      if (!s.alive) return;
      const dt = Math.min(now - last, 50);
      last = now;
      s.score += dt / 1000;
      s.speed = INITIAL_POOP_SPEED + s.score * 0.12;
      setScore(Math.floor(s.score));

      if (s.keys['ArrowLeft'] || s.keys['a']) s.player.x = Math.max(PLAYER_SIZE / 2, s.player.x - PLAYER_SPEED);
      if (s.keys['ArrowRight'] || s.keys['d']) s.player.x = Math.min(CANVAS_W - PLAYER_SIZE / 2, s.player.x + PLAYER_SPEED);
      if (s.keys['ArrowUp'] || s.keys['w']) s.player.y = Math.max(PLAYER_SIZE / 2, s.player.y - PLAYER_SPEED);
      if (s.keys['ArrowDown'] || s.keys['s']) s.player.y = Math.min(CANVAS_H - PLAYER_SIZE / 2, s.player.y + PLAYER_SPEED);

      spawnPoop(now);

      for (const p of s.poops) {
        p.x += p.vx;
        p.y += p.vy;
        const dx = p.x - s.player.x, dy = p.y - s.player.y;
        if (Math.sqrt(dx * dx + dy * dy) < (PLAYER_SIZE + POOP_SIZE) / 2 - 4) {
          s.alive = false;
          setDead(true);
          return;
        }
      }

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < CANVAS_W; gx += 32) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, CANVAS_H); ctx.stroke(); }
      for (let gy = 0; gy < CANVAS_H; gy += 32) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(CANVAS_W, gy); ctx.stroke(); }

      ctx.font = `${PLAYER_SIZE}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧍', s.player.x, s.player.y);

      ctx.font = `${POOP_SIZE}px serif`;
      for (const p of s.poops) ctx.fillText('💩', p.x, p.y);

      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${Math.floor(s.score)}`, 10, 20);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', (e) => onKey(e, true));
      window.removeEventListener('keyup', (e) => onKey(e, false));
    };
  }, []);

  const restart = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl border-2 border-gray-700 shadow-2xl"
        />
        {dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl gap-4">
            <p className="text-4xl">💀</p>
            <p className="text-white text-2xl font-bold">Game Over!</p>
            <p className="text-gray-300 text-lg">Score: {score}</p>
            <div className="flex gap-3">
              <button
                onClick={restart}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl transition-all active:scale-95"
              >
                Main Lagi
              </button>
              <button
                onClick={onExit}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-xl transition-all active:scale-95"
              >
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="text-white/70 text-xs">Gunakan Arrow Keys atau WASD untuk bergerak</p>
    </div>
  );
}