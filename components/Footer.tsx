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
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const socialLinks = [
    { name: "YouTube", href: "#" },
    { name: "Spotify", href: "#" },
    { name: "Deezer", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "TikTok", href: "#" },
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
    { name: "Sénégal", flag: "🇸🇳", href: "/members/senegal", description: "Terre de la Teranga" },
    { name: "Cameroun", flag: "🇨🇲", href: "/members/cameroon", description: "L'Afrique en miniature" },
    { name: "Congo", flag: "🇨🇬", href: "/members/congo", description: "Cœur de l'Afrique" },
  ];

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const allLinks = [
    { name: "Accueil", href: "/" },
    { name: "À propos", href: "/about" },
    { name: "Événements", href: "/events" },
    { name: "Performances", href: "/performances" },
    { name: "Galerie", href: "/gallery" },
    { name: "Membres", href: "/members" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-warm-100 border-t border-warm-200 mt-auto">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-3 lg:flex lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <MusicalNoteIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">SEN CAM CONG</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              La fusion musicale authentique de trois cultures africaines exceptionnelles.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="px-2.5 py-1 rounded-md border border-warm-200 text-gray-600 text-xs hover:text-accent hover:border-accent/50 transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-gray-900 font-bold mb-4">Nous contacter</h3>
            <div className="space-y-3 text-gray-600 text-sm mb-4">
              <div className="flex items-start gap-2">
                <EnvelopeIcon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <a href="mailto:contact@seccamcong.com" className="hover:text-accent transition-colors">contact@seccamcong.com</a>
              </div>
              <div className="flex items-start gap-2">
                <PhoneIcon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <a href="tel:+221123456789" className="hover:text-accent transition-colors">+221 12 345 67 89</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>Dakar, Sénégal</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mb-3">Horaires : 7h - 17h Lun - Sam</p>
            <a href="tel:+221123456789" className="inline-flex items-center gap-2 btn-primary text-sm">
              <PhoneIcon className="h-4 w-4" />
              Nous appeler
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-warm-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} SEN CAM CONG. Tous droits réservés.
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Heure</span>
            <span className="font-mono font-semibold text-gray-800">
              {currentTime ? formatTime(currentTime) : "--:--"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>Fait avec</span>
            <HeartIcon className="h-4 w-4 text-accent" />
            <span>en Afrique</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-accent transition-colors">Politique de confidentialité</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-accent transition-colors">Conditions d&apos;utilisation</Link>
          <span>·</span>
          <Link href="/admin" className="hover:text-accent transition-colors">Administration</Link>
        </div>
      </div>
    </footer>
  );
}
