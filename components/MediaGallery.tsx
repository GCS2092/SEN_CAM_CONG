'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SocialLink {
  id: string
  name: string
  url: string
  icon: string | null
  description: string | null
}

const iconMap: Record<string, JSX.Element> = {
  YouTube: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Spotify: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.36.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),
  Deezer: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.81 4.16v3.23h-3.5v1.62h3.5v3.23h-5.13V4.16h5.13zm-5.13 8.1v3.23H6.18v1.62h7.5v3.23H5.05V12.26h8.63zm-8.63-8.1v3.23H0v1.62h5.05V4.16h5.13z"/>
    </svg>
  ),
  Instagram: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  Facebook: (
    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
}

const colorMap: Record<string, string> = {
  YouTube: 'text-red-600',
  Spotify: 'text-green-500',
  Deezer: 'text-purple-600',
  Instagram: 'text-pink-600',
  Facebook: 'text-blue-600',
}

export default function MediaGallery() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch('/api/social-links')
        const data = await res.json()
        setSocialLinks(data.socialLinks || [])
      } catch (error) {
        console.error('Error fetching social links:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSocialLinks()
  }, [])
  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Suivez-nous</h2>
        <p className="text-sm md:text-base text-gray-600 px-4">Retrouvez-nous sur toutes les plateformes</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : socialLinks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun lien social disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="card card-hover p-6 text-center cursor-pointer group"
            >
              <div className={`mb-4 flex justify-center ${colorMap[link.name] || 'text-primary-600'} group-hover:scale-110 transition-transform duration-300`}>
                {iconMap[link.name] || (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">{link.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{link.name}</h3>
              <p className="text-gray-600 text-sm">{link.description || 'Suivez-nous'}</p>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  )
}

