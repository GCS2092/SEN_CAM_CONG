'use client'

import FusionHexagonIcon from './FusionHexagonIcon'

export default function FusionBanner() {
  return (
    <div className="relative bg-white border-b border-gray-200">
      {/* Barre de texte */}
      <div className="bg-gradient-to-r from-senegal-green/10 to-congo-blue/10 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-gray-700">
            <FusionHexagonIcon size={20} />
            <span className="font-bold">CM</span>
            <span className="text-gray-400">+</span>
            <span className="font-bold">SN</span>
            <span className="text-gray-400">+</span>
            <span className="font-bold">CG</span>
            <span className="mx-1 md:mx-2 text-gray-400">•</span>
            <span className="font-medium hidden sm:inline">Fusion Musicale</span>
          </div>
        </div>
      </div>
    </div>
  )
}

