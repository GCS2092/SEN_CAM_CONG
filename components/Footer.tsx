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
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-senegal-green via-cameroon-red to-congo-blue bg-clip-text text-transparent">
                SEN CAM CONG
              </h3>
            </div>
            <div className="flex items-center gap-2 mb-4 text-2xl">
              <span>🇸🇳</span>
              <span className="text-gray-500">+</span>
              <span>🇨🇲</span>
              <span className="text-gray-500">+</span>
              <span>🇨🇬</span>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Fusion musicale du Sénégal, du Cameroun et du Congo. Découvrez nos événements, performances et dernières sorties.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/performances" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Performances
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Réseaux sociaux</h4>
            <div className="flex flex-col gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-gray-800 hover:bg-primary-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium text-center"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} SEN CAM CONG. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
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

