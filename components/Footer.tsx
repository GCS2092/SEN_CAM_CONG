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

  return (
    <footer className="bg-surface-darker border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <MusicalNoteIcon className="h-6 w-6 text-surface-dark" />
              </div>
              <span className="text-xl font-bold text-white">SEN CAM CONG</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              La fusion musicale authentique de trois cultures africaines exceptionnelles.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 text-sm hover:text-accent hover:border-accent/50 transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-300 hover:text-accent transition-colors">Accueil</Link></li>
              <li><Link href="/about" className="text-slate-300 hover:text-accent transition-colors">À propos</Link></li>
              <li><Link href="/events" className="text-slate-300 hover:text-accent transition-colors">Événements</Link></li>
              <li><Link href="/gallery" className="text-slate-300 hover:text-accent transition-colors">Galerie</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-300 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-white font-bold mb-4">Nous contacter</h3>
            <div className="space-y-3 text-slate-300 text-sm mb-4">
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
            <p className="text-slate-400 text-xs mb-3">Horaires : 7h - 17h Lun - Sam</p>
            <a
              href="tel:+221123456789"
              className="inline-flex items-center gap-2 btn-primary text-sm"
            >
              <PhoneIcon className="h-4 w-4" />
              Nous appeler
            </a>
          </div>
        </div>

        {/* Countries */}
        <div className="mb-10">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5 text-accent" />
            Nos pays
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {countries.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/30 hover:bg-white/10 transition-all"
              >
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm text-center md:text-left">
            © {currentYear} SEN CAM CONG. Tous droits réservés.
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>Heure</span>
            <span className="font-mono font-semibold text-white">
              {currentTime ? formatTime(currentTime) : "--:--"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <span>Fait avec</span>
            <HeartIcon className="h-4 w-4 text-accent" />
            <span>en Afrique</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
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
