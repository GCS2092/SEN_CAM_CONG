'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface HexagonCardProps {
  country: {
    code: string
    name: string
    description: string
    colors: string[]
    flag: string
    href: string
  }
  index: number
}

export default function HexagonCard({ country, index }: HexagonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex justify-center"
    >
      <Link href={country.href}>
        <div className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer group">
          {/* Hexagone */}
          <div className="absolute inset-0">
            <svg
              className="w-full h-full transform transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 200 200"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id={`gradient-${country.code}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={country.colors[0]} stopOpacity="0.15" />
                  <stop offset="50%" stopColor={country.colors[1]} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={country.colors[2]} stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <polygon
                points="100,10 190,60 190,150 100,190 10,150 10,60"
                fill={`url(#gradient-${country.code})`}
                stroke={country.colors[0]}
                strokeWidth="2"
                className="transition-all duration-300 group-hover:stroke-[3px]"
              />
            </svg>
          </div>

          {/* Contenu */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl md:text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
              {country.flag}
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">
              {country.code}
            </div>
            <div className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
              {country.name}
            </div>
            <div className="text-sm md:text-base text-gray-600 mb-4">
              {country.description}
            </div>

            {/* Barres de couleurs */}
            <div className="flex gap-1 mt-2">
              {country.colors.map((color, i) => (
                <div
                  key={i}
                  className="h-2 w-8 md:w-10 rounded-full transition-all duration-300 group-hover:h-3"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Effet hover */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-all duration-300" />
        </div>
      </Link>
    </motion.div>
  )
}

