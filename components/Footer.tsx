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
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cameroon-red via-senegal-green to-congo-blue bg-clip-text text-transparent">
                SEN CAM CONG
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              🇨🇲 🇸🇳 🇨🇬
            </p>
            <p className="text-gray-400">
              Fusion musicale du Cameroun, du Sénégal et du Congo. Découvrez nos événements, performances et dernières sorties.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/performances" className="text-gray-400 hover:text-white transition-colors">
                  Performances
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 hover:bg-primary-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} SEC CAM CONG. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

