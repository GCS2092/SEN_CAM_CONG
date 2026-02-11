"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClockIcon,
  Bars3Icon,
  MusicalNoteIcon,
  HomeIcon,
  PhotoIcon,
  MicrophoneIcon,
  InformationCircleIcon,
  CalendarIcon,
} from "@/components/Icons";

interface Event {
  id: string;
  title: string;
  date: string;
  ticketPrice: number | null;
}

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Accueil", href: "/", icon: HomeIcon },
    { name: "Événements", href: "/events", icon: CalendarIcon },
    { name: "Performances", href: "/performances", icon: MicrophoneIcon },
    { name: "Galerie", href: "/gallery", icon: PhotoIcon },
    { name: "À propos", href: "/about", icon: InformationCircleIcon },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadNextEvent() {
      try {
        const res = await fetch("/api/events?status=UPCOMING&limit=1");
        if (res.ok) {
          const data = await res.json();
          if (data.events?.length > 0) {
            const sorted = data.events.sort(
              (a: Event, b: Event) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            setNextEvent(sorted[0]);
          }
        }
      } catch {
        setNextEvent(null);
      }
    }
    loadNextEvent();
  }, []);

  const formatEventDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const diffDays = Math.ceil(
      (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      countdown: diffDays > 0 ? `Dans ${diffDays}j` : "Bientôt",
    };
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface-dark/95 backdrop-blur border-b border-white/10 shadow-lg"
          : "bg-surface-dark border-b border-white/5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-accent rounded-full flex items-center justify-center">
              <MusicalNoteIcon className="h-5 w-5 lg:h-6 lg:w-6 text-surface-dark" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg lg:text-xl font-bold text-white">
                SEN CAM CONG
              </span>
              <p className="text-xs text-slate-400 -mt-0.5 hidden lg:block">
                Fusion Musicale
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    active
                      ? "text-accent bg-white/10"
                      : "text-slate-200 hover:text-accent hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {nextEvent && (
              <Link
                href={`/events/${nextEvent.id}`}
                className="hidden xl:flex items-center gap-2 bg-surface-light/80 hover:bg-surface-light border border-white/10 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-2 h-2 bg-accent rounded-full shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-xs text-slate-400 font-medium">
                    Prochain
                  </div>
                  <div className="font-semibold text-white truncate text-sm">
                    {nextEvent.title}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatEventDateTime(nextEvent.date).countdown}
                    {nextEvent.ticketPrice && (
                      <> · {nextEvent.ticketPrice.toLocaleString()} FCFA</>
                    )}
                  </div>
                </div>
              </Link>
            )}

            <div className="flex items-center gap-2 bg-surface-light/60 rounded-lg px-3 py-2 border border-white/10">
              <ClockIcon className="h-4 w-4 text-accent shrink-0" />
              <span className="font-mono font-semibold text-white text-sm">
                {currentTime}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
              aria-label="Menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-surface-dark">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                    isActive(item.href)
                      ? "text-accent bg-white/10"
                      : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
