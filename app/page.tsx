"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import {
  CalendarIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowRightIcon,
  PhotoIcon,
  GlobeAltIcon,
} from "@/components/Icons";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  venue: string | null;
  imageUrl: string | null;
  status: string;
  price?: number | null;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsRes = await fetch("/api/events?status=UPCOMING&limit=1");

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const list = eventsData.events || [];
          setEvents(list);
        } else {
          // Fallback data
          const fallbackEvents = [
            {
              id: "1",
              title: "Concert d'ouverture - Paris",
              description:
                "Première représentation de notre tournée européenne avec un mélange unique de sonorités sénégalaises, camerounaises et congolaises.",
              date: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              location: "Paris, France",
              venue: "Olympia",
              imageUrl: "/placeholder.svg",
              price: 45,
              status: "UPCOMING",
            },
            {
              id: "2",
              title: "Festival Afro-Fusion - Londres",
              description:
                "Une soirée exceptionnelle célébrant la diversité musicale africaine.",
              date: new Date(
                Date.now() + 45 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              location: "Londres, UK",
              venue: "Royal Festival Hall",
              imageUrl: "/placeholder.svg",
              price: 55,
              status: "UPCOMING",
            },
          ];

          setEvents(fallbackEvents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col min-h-screen min-w-0 bg-gradient-to-b from-warm-50 via-white to-warm-50">
      <Hero />

      {/* Bande intro très légère au lieu d'une grosse section "Notre mission / pays" */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-8 sm:py-10 bg-warm-100/80"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-xs font-semibold text-primary-700 mb-3">
            <SparklesIcon className="h-4 w-4" />
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex gap-0.5" aria-hidden>
                <span className="w-1.5 h-1.5 rounded-full bg-senegal-green" />
                <span className="w-1.5 h-1.5 rounded-full bg-senegal-yellow" />
                <span className="w-1.5 h-1.5 rounded-full bg-senegal-red" />
              </span>
              Fusion musicale Sénégal · Cameroun · Congo
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 pl-3 border-l-4 border-senegal-green">
            Trois pays, une même vibration
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-5">
            SEC CAM CONG rassemble des artistes du Sénégal, du Cameroun et du Congo pour créer une
            expérience scénique moderne, chaleureuse et profondément africaine.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/about" className="btn-secondary inline-flex items-center justify-center gap-2">
              <span>En savoir plus</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/members" className="btn-secondary inline-flex items-center justify-center gap-2">
              <span>Voir les membres</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Prochain événement uniquement */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="py-10 sm:py-14 bg-white pb-20 md:pb-14"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 pl-3 border-l-4 border-senegal-yellow max-w-fit mx-auto">
              Prochain événement
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mt-2">
              Rejoignez-nous pour notre prochaine date
            </p>
          </motion.div>

          {loading ? (
            <div className="max-w-2xl mx-auto animate-pulse bg-gray-100 rounded-xl h-64">
              <div className="h-40 bg-gray-200 rounded-t-xl" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ) : events.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-warm-100 rounded-xl border border-warm-200"
            >
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun événement programmé</h3>
              <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">Restez connecté ! De nouveaux événements seront bientôt annoncés.</p>
              <Link href="/events" className="btn-primary inline-flex items-center gap-2">
                <span>Voir les événements</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
              <Link href={`/events/${events[0].id}`}>
                <div className="card group-hover:border-accent/30 transition-colors">
                  <div className="relative h-44 overflow-hidden rounded-t-xl">
                    <Image
                      src={events[0].imageUrl || "/placeholder.svg"}
                      alt={events[0].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                        À venir
                      </span>
                    </div>
                    {events[0].price != null && events[0].price > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/95 text-gray-900 px-2.5 py-1 rounded-full text-xs font-semibold">
                          {events[0].price.toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors">{events[0].title}</h3>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <CalendarIcon className="w-4 h-4 text-accent flex-shrink-0" />
                        {new Date(events[0].date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPinIcon className="w-4 h-4 text-accent flex-shrink-0" />
                        {events[0].location}{events[0].venue ? ` – ${events[0].venue}` : ""}
                      </div>
                    </div>
                    {events[0].description && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{events[0].description}</p>
                    )}
                    <span className="inline-flex items-center text-accent font-semibold text-sm">
                      Voir les détails
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
              <p className="text-center mt-4">
                <Link href="/events" className="text-sm text-accent hover:underline font-medium">
                  Voir tous les événements
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-12 sm:py-16 bg-warm-100 text-gray-900 pb-24 md:pb-16"
      >
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-7xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
                <GlobeAltIcon className="h-12 w-12 text-accent" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 pl-3 border-l-4 border-senegal-red max-w-fit mx-auto">Rejoignez Notre Communauté</h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-600">
              Découvrez la richesse de la culture africaine à travers notre musique et devenez partie intégrante de notre famille artistique
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/gallery" className="btn-primary inline-flex items-center gap-3">
                <PhotoIcon className="h-6 w-6" />
                <span>Voir notre galerie</span>
                <ArrowRightIcon className="h-6 w-6" />
              </Link>
              <Link href="/about" className="btn-secondary inline-flex items-center gap-3">
                <SparklesIcon className="h-6 w-6" />
                <span>Notre histoire</span>
                <ArrowRightIcon className="h-6 w-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
