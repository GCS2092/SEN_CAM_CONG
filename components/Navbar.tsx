'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté avec persistance améliorée
    async function checkAuth() {
      const { isAuthenticated, getUserRole } = await import('@/lib/auth-persistence')
      if (isAuthenticated()) {
        setIsAuthenticated(true)
        setUserRole(getUserRole())
      } else {
        setIsAuthenticated(false)
        setUserRole(null)
      }
    }
    checkAuth()
    
    // Écouter les changements de localStorage pour mettre à jour l'état
    const handleStorageChange = () => {
      checkAuth()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = async () => {
    const { clearAuth } = await import('@/lib/auth-persistence')
    clearAuth()
    setIsAuthenticated(false)
    setUserRole(null)
    router.push('/')
    setIsOpen(false)
  }

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/events', label: 'Événements' },
    { href: '/performances', label: 'Performances' },
    { href: '/gallery', label: 'Galerie' },
    { href: '/about', label: 'À propos' },
  ]

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 relative">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Mobile Menu Button - À gauche */}
          <button
            className="md:hidden p-2 z-50 relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            type="button"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-gray-700 transition-all"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-gray-700 transition-all"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-gray-700 transition-all"
              />
            </div>
          </button>

          <Link href="/" className="flex items-center gap-2 md:gap-3 flex-1 justify-center md:justify-start">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cameroon-red via-senegal-green to-congo-blue bg-clip-text text-transparent">
              SEN CAM CONG
            </span>
          </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
            ))}
            {/* Menu selon le rôle - Chaque utilisateur voit uniquement son propre menu */}
            {isAuthenticated && userRole === 'ADMIN' && (
              <>
                <Link
                  href="/admin"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                >
                  Admin
                </Link>
                <Link
                  href="/artist/dashboard"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                >
                  Artiste
                </Link>
              </>
            )}
            {isAuthenticated && userRole === 'ARTIST' && (
              <Link
                href="/artist/dashboard"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
              >
                Artiste
              </Link>
            )}
            {isAuthenticated && userRole === 'USER' && (
              <Link
                href="/user/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                Mon compte
              </Link>
            )}
            <ThemeToggle />
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                Déconnexion
              </button>
            ) : (
                  <Link
                    href="/login"
                    className="btn-primary text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2"
                  >
                    Connexion
                  </Link>
            )}
              </div>
        </div>

        {/* Mobile Menu Overlay - Design Moderne */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop avec blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              {/* Menu Panel - Design moderne avec gradient */}
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl z-50 overflow-y-auto border-r border-gray-200"
              >
                {/* Header du menu avec logo */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold bg-gradient-to-r from-cameroon-red via-senegal-green to-congo-blue bg-clip-text text-transparent">
                        SEN CAM CONG
                      </span>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Fermer le menu"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="px-4 py-6 flex flex-col gap-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 font-medium group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>
                  
                  {/* Menu selon le rôle - Chaque utilisateur voit uniquement son propre menu */}
                  {isAuthenticated && userRole === 'ADMIN' && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navItems.length * 0.05 }}
                      >
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-600 hover:text-primary-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 font-semibold group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                          <span>Admin</span>
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 1) * 0.05 }}
                      >
                        <Link
                          href="/artist/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all duration-200 font-semibold group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                          <span>Artiste</span>
                        </Link>
                      </motion.div>
                    </>
                  )}
                  {isAuthenticated && userRole === 'ARTIST' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.05 }}
                    >
                      <Link
                        href="/artist/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-600 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all duration-200 font-semibold group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                        <span>Artiste</span>
                      </Link>
                    </motion.div>
                  )}
                  {isAuthenticated && userRole === 'USER' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.05 }}
                    >
                      <Link
                        href="/user/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 font-semibold group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>Mon compte</span>
                      </Link>
                    </motion.div>
                  )}
                  
                  {isAuthenticated ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + (isAuthenticated && userRole === 'ADMIN' ? 1 : 0)) * 0.05 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all duration-200 font-medium text-left group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>Déconnexion</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.05 }}
                      className="px-4 pt-4"
                    >
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="btn-primary w-full text-center block"
                      >
                        Connexion
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Footer avec drapeaux */}
                <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-gray-50 to-transparent border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-2xl">
                    <span>🇨🇲</span>
                    <span className="text-gray-400">+</span>
                    <span>🇸🇳</span>
                    <span className="text-gray-400">+</span>
                    <span>🇨🇬</span>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-2">Fusion Musicale</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}


