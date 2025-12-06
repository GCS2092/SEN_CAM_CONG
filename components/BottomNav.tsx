'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Accueil', icon: '🏠' },
    { href: '/events', label: 'Événements', icon: '📅' },
    { href: '/performances', label: 'Performances', icon: '🎵' },
    { href: '/gallery', label: 'Galerie', icon: '🖼️' },
    { href: '/about', label: 'À propos', icon: 'ℹ️' },
  ]

  // Ne pas afficher sur les pages admin/artist/login
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/artist') || pathname?.startsWith('/user') || pathname === '/login') {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="container mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full relative group"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-primary-700 rounded-b-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className={`text-2xl mb-1 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

