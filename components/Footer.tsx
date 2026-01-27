"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  HeartIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@/components/Icons";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const socialLinks = [
    { name: "YouTube", href: "#", icon: "🎬" },
    { name: "Spotify", href: "#", icon: "🎵" },
    { name: "Deezer", href: "#", icon: "🎼" },
    { name: "Instagram", href: "#", icon: "📸" },
    { name: "Facebook", href: "#", icon: "👥" },
    { name: "TikTok", href: "#", icon: "🎭" },
  ];

  const quickLinks = [
    { name: "Événements", href: "/events" },
    { name: "Performances", href: "/performances" },
    { name: "Galerie", href: "/gallery" },
    { name: "À propos", href: "/about" },
    { name: "Membres", href: "/members" },
    { name: "Contact", href: "/contact" },
  ];

  const countries = [
    {
      name: "Sénégal",
      flag: "🇸🇳",
      href: "/members/senegal",
      description: "Terre de la Teranga",
    },
    {
      name: "Cameroun",
      flag: "🇨🇲",
      href: "/members/cameroon",
      description: "L&apos;Afrique en miniature",
    },
    {
      name: "Congo",
      flag: "🇨🇬",
      href: "/members/congo",
      description: "Cœur de l'Afrique",
    },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            SEN CAM CONG
          </h2>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            La fusion musicale authentique de trois cultures africaines
            exceptionnelles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Countries Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
              Nos Pays
            </h3>
            <div className="space-y-4">
              {countries.map((country) => {
                // Définir les vraies couleurs des drapeaux
                let gradientClass = "";
                let textColor = "text-white";

                if (country.name === "Sénégal") {
                  // Vert, Jaune, Rouge (Sénégal)
                  gradientClass =
                    "bg-gradient-to-r from-green-600 via-yellow-400 to-red-600";
                } else if (country.name === "Cameroun") {
                  // Vert, Rouge, Jaune (Cameroun)
                  gradientClass =
                    "bg-gradient-to-r from-green-600 via-red-600 to-yellow-400";
                } else if (country.name === "Congo") {
                  // Vert, Jaune, Rouge diagonal (Congo)
                  gradientClass =
                    "bg-gradient-to-br from-yellow-400 via-green-600 to-red-600";
                }

                return (
                  <Link
                    key={country.name}
                    href={country.href}
                    className={`flex items-center p-4 rounded-xl ${gradientClass} border-4 border-white shadow-lg hover:scale-105 hover:shadow-xl transition-transform`}
                  >
                    <div className="text-4xl mr-4 drop-shadow-lg">
                      {country.flag}
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-lg drop-shadow-lg">
                        {country.name}
                      </div>
                      <div className="text-sm text-white font-semibold drop-shadow-md bg-black/20 rounded-full px-3 py-1 mt-1 inline-block">
                        {country.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              Liens Rapides
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-blue-600 transition-colors inline-block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              Nous Contacter
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <a
                    href="mailto:contact@sencamcong.com"
                    className="text-gray-900 hover:text-blue-600"
                  >
                    contact@sencamcong.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Téléphone</div>
                  <a
                    href="tel:+221123456789"
                    className="text-gray-900 hover:text-blue-600"
                  >
                    +221 12 345 67 89
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Adresse</div>
                  <p className="text-gray-900">Dakar, Sénégal</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-900">
                Réseaux Sociaux
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  // Couleurs authentiques de marque pour chaque réseau
                  let colorClass = "bg-white hover:bg-blue-50";
                  let iconBg = "bg-gradient-to-br from-blue-500 to-blue-600";

                  if (social.name === "YouTube")
                    iconBg = "bg-gradient-to-br from-red-600 to-red-700";
                  else if (social.name === "Spotify")
                    iconBg = "bg-gradient-to-br from-green-500 to-green-600";
                  else if (social.name === "Deezer")
                    iconBg = "bg-gradient-to-br from-orange-500 to-orange-600";
                  else if (social.name === "Instagram")
                    iconBg =
                      "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400";
                  else if (social.name === "Facebook")
                    iconBg = "bg-gradient-to-br from-blue-600 to-blue-700";
                  else if (social.name === "TikTok")
                    iconBg = "bg-gradient-to-br from-black to-gray-800";

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      title={social.name}
                      className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-xl shadow-md hover:shadow-lg hover:scale-110 transition-all`}
                    >
                      <span className="drop-shadow-lg">{social.icon}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} SEN CAM CONG. Tous droits réservés.
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-600">Heure</div>
                <div className="font-mono font-bold text-gray-900 text-sm">
                  {formatTime(currentTime)}
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <span>Fait avec</span>
              <HeartIcon className="h-4 w-4 text-red-500 mx-1" />
              <span>en Afrique</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <Link
              href="/privacy"
              className="hover:text-blue-600 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-blue-600 transition-colors"
            >
              Conditions d&apos;utilisation
            </Link>
            <span>•</span>
            <Link
              href="/admin"
              className="hover:text-blue-600 transition-colors"
            >
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
