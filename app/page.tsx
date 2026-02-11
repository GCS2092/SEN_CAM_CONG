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
    <div className="flex flex-col bg-white min-h-screen min-w-0">
      <Hero />

      {/* About Section – fond léger beige/gris (mix comme watermark) */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-12 sm:py-16 md:py-20 bg-warm-100"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <SparklesIcon className="h-8 w-8 text-accent mr-3" />
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Notre Mission
                </h2>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                SEC CAM CONG unit trois cultures africaines riches et
                diversifiées dans une fusion musicale unique qui célèbre notre
                héritage commun et notre créativité sans frontières.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 rounded-xl border-2 border-white/20 shadow-xl hover:scale-105 transition-transform">
                  <div className="text-5xl mb-3 drop-shadow-lg">🇸🇳</div>
                  <div className="font-extrabold text-white text-xl drop-shadow-lg">Sénégal</div>
                  <div className="text-sm text-white font-bold drop-shadow-md bg-black/20 rounded-full px-3 py-1 mt-2 inline-block">Terre de la Teranga</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-600 via-red-600 to-yellow-400 rounded-xl border-2 border-white/20 shadow-xl hover:scale-105 transition-transform">
                  <div className="text-5xl mb-3 drop-shadow-lg">🇨🇲</div>
                  <div className="font-extrabold text-white text-xl drop-shadow-lg">Cameroun</div>
                  <div className="text-sm text-white font-bold drop-shadow-md bg-black/20 rounded-full px-3 py-1 mt-2 inline-block">L&apos;Afrique en miniature</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-yellow-400 via-green-600 to-red-600 rounded-xl border-2 border-white/20 shadow-xl hover:scale-105 transition-transform">
                  <div className="text-5xl mb-3 drop-shadow-lg">🇨🇬</div>
                  <div className="font-extrabold text-white text-xl drop-shadow-lg">Congo</div>
                  <div className="text-sm text-white font-bold drop-shadow-md bg-black/20 rounded-full px-3 py-1 mt-2 inline-block">Cœur de l&apos;Afrique</div>
                </div>
              </div>
              <Link href="/about" className="btn-primary inline-flex items-center gap-2">
                <span>Découvrir notre histoire</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 rounded-xl overflow-hidden shadow-xl border border-white/10">
                <Image src="/placeholder.svg" alt="SEC CAM CONG" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </motion.div>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
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
                  {events[0].imageUrl && (
                    <div className="relative h-44 overflow-hidden rounded-t-xl">
                      <Image src={events[0].imageUrl} alt={events[0].title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 bg-accent text-white text-xs font-semibold rounded-full">À venir</span>
                      </div>
                      {events[0].price != null && events[0].price > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/95 text-gray-900 px-2.5 py-1 rounded-full text-xs font-semibold">{events[0].price.toLocaleString()} FCFA</span>
                        </div>
                      )}
                    </div>
                  )}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Rejoignez Notre Communauté</h2>
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
