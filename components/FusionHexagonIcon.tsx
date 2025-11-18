'use client'

import { motion } from 'framer-motion'

export default function FusionHexagonIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient fusionnant les 3 pays */}
          <linearGradient id="fusion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CE1126" stopOpacity="0.9" /> {/* Cameroun Rouge */}
            <stop offset="33%" stopColor="#FCD116" stopOpacity="0.9" /> {/* Cameroun/Sénégal Jaune */}
            <stop offset="50%" stopColor="#00853F" stopOpacity="0.9" /> {/* Sénégal Vert */}
            <stop offset="66%" stopColor="#009739" stopOpacity="0.9" /> {/* Congo Vert */}
            <stop offset="100%" stopColor="#DC143C" stopOpacity="0.9" /> {/* Congo Rouge */}
          </linearGradient>
        </defs>
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill="url(#fusion-gradient)"
          stroke="white"
          strokeWidth="1.5"
          className="drop-shadow-md"
        />
      </svg>
    </div>
  )
}

