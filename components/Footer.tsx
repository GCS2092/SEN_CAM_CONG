import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'YouTube', href: '#' },
    { name: 'Spotify', href: '#' },
    { name: 'Deezer', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'Facebook', href: '#' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto border-t border-gray-700">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-senegal-green via-cameroon-red to-congo-blue bg-clip-text text-transparent">
                SEN CAM CONG
              </h3>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Link href="/members/senegal" className="w-10 h-7 rounded border border-gray-700 bg-gradient-to-b from-green-600 via-yellow-400 to-red-600 flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-sm">🇸🇳</span>
              </Link>
              <span className="text-gray-500 text-xs">+</span>
              <Link href="/members/cameroon" className="w-10 h-7 rounded border border-gray-700 bg-gradient-to-b from-green-500 via-red-500 to-yellow-400 flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-sm">🇨🇲</span>
              </Link>
              <span className="text-gray-500 text-xs">+</span>
              <Link href="/members/congo" className="w-10 h-7 rounded border border-gray-700 bg-gradient-to-b from-blue-600 via-yellow-400 to-red-600 flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-sm">🇨🇬</span>
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Fusion musicale du Sénégal, du Cameroun et du Congo.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-base font-bold mb-3 text-white">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/performances" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Performances
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="text-base font-bold mb-3 text-white">Réseaux</h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-800 hover:bg-primary-600 rounded text-gray-300 hover:text-white transition-all duration-200 text-xs font-medium"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-gray-400 text-xs">
              &copy; {currentYear} SEN CAM CONG. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <span>Fait avec</span>
              <span className="text-red-500">❤️</span>
              <span>pour l&apos;Afrique</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
