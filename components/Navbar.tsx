"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  CalendarIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  MusicalNoteIcon,
  HomeIcon,
  PhotoIcon,
  MicrophoneIcon,
  InformationCircleIcon,
  UsersIcon,
  CogIcon,
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
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items - simplifié pour éviter la redondance
  const navItems = [
    { name: "Accueil", href: "/", icon: HomeIcon },
    { name: "Événements", href: "/events", icon: CalendarIcon },
    { name: "Performances", href: "/performances", icon: MicrophoneIcon },
    { name: "Galerie", href: "/gallery", icon: PhotoIcon },
    { name: "À propos", href: "/about", icon: InformationCircleIcon },
  ];

  // Mettre à jour l'heure chaque seconde
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Charger le prochain événement avec fallback
  useEffect(() => {
    async function loadNextEvent() {
      try {
        const res = await fetch("/api/events?status=UPCOMING&limit=1");
        if (res.ok) {
          const data = await res.json();
          if (data.events && data.events.length > 0) {
            const sortedEvents = data.events.sort(
              (a: Event, b: Event) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
            setNextEvent(sortedEvents[0]);
          }
        } else {
          // Fallback avec données statiques
          setNextEvent({
            id: "fallback",
            title: "Concert à Paris",
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            ticketPrice: 45,
          });
        }
      } catch (error) {
        console.error("Error loading next event:", error);
        // Fallback en cas d'erreur
        setNextEvent({
          id: "fallback",
          title: "Concert à Paris",
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          ticketPrice: 45,
        });
      }
    }
    loadNextEvent();
    const interval = setInterval(loadNextEvent, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatEventDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      countdown: diffDays > 0 ? `Dans ${diffDays}j` : "Aujourd'hui",
    };
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Main Navbar - Desktop & Tablet */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo and Brand - Toujours visible */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-900 rounded-full flex items-center justify-center">
                  <MusicalNoteIcon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                    SEC CAM CONG
                  </h1>
                  <p className="text-xs text-gray-600 -mt-1 hidden lg:block">
                    Fusion Musicale
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      isActive(item.href)
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Next Event Info - Hidden on small screens */}
              {nextEvent && (
                <div className="hidden xl:block">
                  <Link
                    href={`/events/${nextEvent.id}`}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-600 font-medium">
                          Prochain
                        </div>
                        <div className="font-semibold text-gray-900 truncate text-sm">
                          {nextEvent.title}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span>
                            {formatEventDateTime(nextEvent.date).countdown}
                          </span>
                          {nextEvent.ticketPrice && (
                            <>
                              <span>•</span>
                              <span className="font-semibold">
                                {nextEvent.ticketPrice.toLocaleString()} FCFA
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Compact Clock Display */}
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                <div className="bg-gray-900 p-1.5 rounded-full">
                  <ClockIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide leading-none">
                    Heure
                  </div>
                  <div className="font-mono font-bold text-gray-900 text-sm leading-tight">
                    {currentTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
