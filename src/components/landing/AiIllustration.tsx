'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AiIllustration() {
  // SVG network node coordinate points
  const nodes = [
    { cx: 100, cy: 120, r: 8, color: 'var(--color-brand-indigo)', delay: 0 },
    { cx: 200, cy: 80, r: 12, color: 'var(--color-brand-violet)', delay: 0.5 },
    { cx: 300, cy: 150, r: 6, color: 'var(--color-brand-pink)', delay: 1 },
    { cx: 140, cy: 220, r: 10, color: 'var(--color-brand-emerald)', delay: 1.5 },
    { cx: 260, cy: 260, r: 14, color: 'var(--color-brand-indigo)', delay: 0.2 },
    { cx: 380, cy: 200, r: 10, color: 'var(--color-brand-violet)', delay: 0.8 },
    { cx: 220, cy: 360, r: 8, color: 'var(--color-brand-pink)', delay: 1.2 },
    { cx: 340, cy: 320, r: 12, color: 'var(--color-brand-emerald)', delay: 0.4 },
  ];

  // SVG paths connecting nodes
  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 4, to: 6 },
    { from: 5, to: 7 },
    { from: 6, to: 7 },
  ];

  return (
    <div className="relative flex items-center justify-center w-full h-[450px] overflow-hidden select-none">
      {/* Decorative Glow Ring */}
      <div className="absolute inset-0 m-auto h-[350px] w-[350px] rounded-full bg-brand-violet/5 blur-3xl" />
      
      {/* Floating Animated Wrapper */}
      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-full max-w-[450px] h-full"
      >
        <svg viewBox="0 0 450 450" className="w-full h-full">
          {/* Grid lines in background */}
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-brand-violet)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-brand-indigo)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="var(--color-brand-violet)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-brand-pink)" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Core Central Glow */}
          <circle cx="240" cy="220" r="140" fill="url(#grad1)" />

          {/* Connection Lines (Cables) */}
          {connections.map((conn, idx) => {
            const start = nodes[conn.from];
            const end = nodes[conn.to];
            return (
              <g key={`conn-${idx}`}>
                {/* Background static line */}
                <line
                  x1={start.cx}
                  y1={start.cy}
                  x2={end.cx}
                  y2={end.cy}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="2"
                />
                {/* Animated pulsing path */}
                <motion.line
                  x1={start.cx}
                  y1={start.cy}
                  x2={end.cx}
                  y2={end.cy}
                  stroke="url(#lineGrad)"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: idx * 0.3,
                  }}
                />
              </g>
            );
          })}

          {/* Data Packets Flowing */}
          {connections.map((conn, idx) => {
            const start = nodes[conn.from];
            const end = nodes[conn.to];
            return (
              <motion.circle
                key={`packet-${idx}`}
                r="3"
                fill="var(--color-brand-emerald)"
                initial={{ cx: start.cx, cy: start.cy, opacity: 0 }}
                animate={{
                  cx: [start.cx, end.cx],
                  cy: [start.cy, end.cy],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: idx * 0.4 + 1,
                }}
              />
            );
          })}

          {/* Nodes (Neuronal intersections) */}
          {nodes.map((node, idx) => (
            <g key={`node-${idx}`}>
              {/* Outer pulsing ring */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.r + 6}
                fill={node.color}
                opacity="0.15"
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.1, 0.25, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: node.delay,
                }}
              />
              
              {/* Core solid node */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill={node.color}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
                className="cursor-pointer"
                whileHover={{ scale: 1.3 }}
                animate={{
                  filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: node.delay,
                }}
              />
              
              {/* Node interior particle dot */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r="2.5"
                fill="white"
                opacity="0.8"
              />
            </g>
          ))}

          {/* Floating UI Widget mockup in background */}
          <motion.g
            transform="translate(290, 40)"
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            {/* Mock layout card */}
            <rect width="110" height="50" rx="10" fill="rgba(10, 7, 26, 0.65)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="20" cy="25" r="8" fill="var(--color-brand-emerald)" opacity="0.2" />
            <path d="M17 25h6" stroke="var(--color-brand-emerald)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 22v6" stroke="var(--color-brand-emerald)" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="36" y="16" width="55" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
            <rect x="36" y="28" width="35" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
          </motion.g>

          <motion.g
            transform="translate(40, 290)"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.2,
            }}
          >
            {/* Mock layout card */}
            <rect width="100" height="46" rx="10" fill="rgba(10, 7, 26, 0.65)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="20" cy="23" r="8" fill="var(--color-brand-violet)" opacity="0.25" />
            <path d="M16 23c2 2 4-2 6 0" stroke="var(--color-brand-violet)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <rect x="36" y="15" width="48" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
            <rect x="36" y="26" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
