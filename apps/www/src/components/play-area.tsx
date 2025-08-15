"use client"

import * as React from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  type MotionValue,
} from "framer-motion"

type BallState = {
  id: number
  r: number
  color: string
  x: number
  y: number
  vx: number
  vy: number
  dragging: boolean
  mx?: MotionValue<number>
  my?: MotionValue<number>
  lastX: number
  lastY: number
  lastT: number
}

type BallPitProps = {
  count?: number
  minR?: number
  maxR?: number
  colors?: string[]
  restitution?: number
  gravity?: number
  className?: string
}

export default function BallPit({
  count = 12,
  minR = 14,
  maxR = 26,
  colors = ["#22d3ee", "#f472b6", "#a78bfa", "#34d399", "#facc15", "#fb7185"],
  restitution = 0.92,
  gravity = 0,
  className = "",
}: BallPitProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const sizeRef = React.useRef({ w: 0, h: 0 })
  const ballsRef = React.useRef<BallState[]>([])
  const [, force] = React.useState(0) // render once after init

  // init once (after we know container size)
  React.useEffect(() => {
    const wrap = wrapRef.current!
    const rect = wrap.getBoundingClientRect()
    sizeRef.current = { w: rect.width || 600, h: rect.height || 400 }
    if (ballsRef.current.length) return

    const rng = (a: number, b: number) => a + Math.random() * (b - a)
    const list: BallState[] = []
    for (let i = 0; i < count; i++) {
      const r = Math.round(rng(minR, maxR))
      const x = rng(r, sizeRef.current.w - r)
      const y = rng(r, sizeRef.current.h - r)
      const vx = rng(-100, 100)
      const vy = rng(-100, 100)
      list.push({
        id: i,
        r,
        color: colors[i % colors.length] || "#214a32",
        x,
        y,
        vx,
        vy,
        dragging: false,
        lastX: x,
        lastY: y,
        lastT: performance.now(),
      })
    }
    ballsRef.current = list

    const ro = new ResizeObserver(() => {
      const r2 = wrap.getBoundingClientRect()
      sizeRef.current = { w: r2.width, h: r2.height }
    })
    ro.observe(wrap)

    force((n) => n + 1) // mount Ball components

    return () => ro.disconnect()
  }, [count, minR, maxR, colors])

  // physics
  useAnimationFrame((_, ms) => {
    const dt = Math.min(32, ms) / 1000
    const { w, h } = sizeRef.current
    const balls = ballsRef.current
    if (!w || !h || balls.length === 0) return

    // integrate + walls
    for (const b of balls) {
      if (!b.dragging) {
        b.vy += gravity * dt
        b.x += b.vx * dt
        b.y += b.vy * dt

        if (b.x - b.r < 0) {
          b.x = b.r
          b.vx = Math.abs(b.vx) * restitution
        }
        if (b.x + b.r > w) {
          b.x = w - b.r
          b.vx = -Math.abs(b.vx) * restitution
        }
        if (b.y - b.r < 0) {
          b.y = b.r
          b.vy = Math.abs(b.vy) * restitution
        }
        if (b.y + b.r > h) {
          b.y = h - b.r
          b.vy = -Math.abs(b.vy) * restitution
        }

        b.vx *= 0.999
        b.vy *= 0.999
      } else {
        // sync when dragging
        b.x = b.mx!.get()
        b.y = b.my!.get()
      }
    }

    // collisions
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i]!,
          c = balls[j]! // non-null
        const dx = c.x - a.x
        const dy = c.y - a.y
        const dist = Math.hypot(dx, dy)
        const minDist = a.r + c.r
        if (dist === 0 || dist >= minDist) continue

        const nx = dx / dist
        const ny = dy / dist
        const overlap = minDist - dist + 0.5

        if (!a.dragging && !c.dragging) {
          a.x -= nx * overlap * 0.5
          a.y -= ny * overlap * 0.5
          c.x += nx * overlap * 0.5
          c.y += ny * overlap * 0.5
        } else if (a.dragging && !c.dragging) {
          c.x += nx * overlap
          c.y += ny * overlap
        } else if (!a.dragging && c.dragging) {
          a.x -= nx * overlap
          a.y -= ny * overlap
        }

        const rvx = c.vx - a.vx
        const rvy = c.vy - a.vy
        const vn = rvx * nx + rvy * ny
        if (vn < 0) {
          const jImp = (-(1 + restitution) * vn) / 2
          const jx = jImp * nx,
            jy = jImp * ny
          if (!a.dragging) {
            a.vx -= jx
            a.vy -= jy
          }
          if (!c.dragging) {
            c.vx += jx
            c.vy += jy
          }
        }
      }
    }

    // flush positions to motion values
    for (const b of balls) {
      b.mx?.set(b.x)
      b.my?.set(b.y)
    }
  })

  // drag handlers
  const onDragStart = (b: BallState) => () => {
    b.dragging = true
    b.vx = 0
    b.vy = 0
    b.lastX = b.x
    b.lastY = b.y
    b.lastT = performance.now()
  }
  const onDrag = (b: BallState) => () => {
    const now = performance.now()
    const dt = Math.max(1, now - b.lastT) / 1000
    const nx = b.mx!.get(),
      ny = b.my!.get()
    b.vx = (nx - b.lastX) / dt
    b.vy = (ny - b.lastY) / dt
    b.lastX = nx
    b.lastY = ny
    b.lastT = now
  }
  const onDragEnd = (b: BallState) => () => {
    b.dragging = false
    b.vx *= 0.9
    b.vy *= 0.9
  }

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-2xl bg-neutral-900/50 ring-1 ring-white/10 ${className}`}
      style={{ width: "100%", height: 420, touchAction: "none" }}
    >
      {ballsRef.current.map((b) => (
        <Ball
          key={b.id}
          b={b}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        />
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-white/60">
        drag the balls
      </div>
    </div>
  )
}

/* Child component: owns the hooks */
function Ball({
  b,
  onDragStart,
  onDrag,
  onDragEnd,
}: {
  b: BallState
  onDragStart: (b: BallState) => () => void
  onDrag: (b: BallState) => () => void
  onDragEnd: (b: BallState) => () => void
}) {
  const mx = useMotionValue(b.x)
  const my = useMotionValue(b.y)

  // expose motion values to parent physics
  React.useEffect(() => {
    b.mx = mx
    b.my = my
  }, [b, mx, my])

  return (
    <motion.div
      className="absolute top-0 left-0 cursor-grab rounded-full shadow-lg active:cursor-grabbing"
      drag
      dragMomentum={false}
      style={{
        x: mx,
        y: my,
        width: b.r * 2,
        height: b.r * 2,
        background: b.color,
      }}
      onDragStart={onDragStart(b)}
      onDrag={onDrag(b)}
      onDragEnd={onDragEnd(b)}
      aria-label="ball"
    />
  )
}
