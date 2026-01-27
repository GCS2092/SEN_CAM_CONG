"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  PlayIcon,
  StarIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  MicrophoneIcon,
  PhotoIcon,
  HeartIcon,
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

interface Performance {
  id: string;
  title: string;
  venue: string;
  date: string;
  imageUrl: string | null;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, performancesRes] = await Promise.all([
          fetch("/api/events?status=UPCOMING&limit=6"),
          fetch("/api/performances?limit=4"),
        ]);

        if (eventsRes.ok && performancesRes.ok) {
          const eventsData = await eventsRes.json();
          const performancesData = await performancesRes.json();

          setEvents(eventsData.events || []);
          setPerformances(performancesData.performances || []);
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
              imageUrl: "/uploads/IMG-20251117-WA0001.jpg",
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
              imageUrl: "/uploads/IMG-20251117-WA0001.jpg",
              price: 55,
              status: "UPCOMING",
            },
          ];

          const fallbackPerformances = [
            {
              id: "1",
              title: "Festival des Cultures Africaines",
              venue: "Parc de la Villette, Paris",
              date: new Date(
                Date.now() - 60 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              imageUrl: "/uploads/IMG-20251117-WA0001.jpg",
            },
          ];

          setEvents(fallbackEvents);
          setPerformances(fallbackPerformances);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setEvents([]);
        setPerformances([]);
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
    <div className="flex flex-col bg-white">
      <Hero />

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <SparklesIcon className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Notre Mission
                </h2>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                SEC CAM CONG unit trois cultures africaines riches et
                diversifiées dans une fusion musicale unique qui célèbre notre
                héritage commun et notre créativité sans frontières.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Sénégal - Vert, Jaune, Rouge avec étoile verte */}
                <div className="text-center p-6 bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 rounded-xl border-4 border-white shadow-xl hover:scale-105 transition-transform">
                  <div className="text-5xl mb-3 drop-shadow-lg">🇸🇳</div>
                  <div className="font-extrabold text-white text-xl drop-shadow-lg">
                    Sénégal
                  </div>
                  <div className="text-sm text-white font-bold drop-shadow-md bg-black/20 rounded-full px-3 py-1 mt-2 inline-block">
                    Terre de la Teranga
                  </div>
                </div>

                {/* Cameroun - Vert, Rouge, Jaune avec étoile jaune */}
                <div className="text-center p-6 bg-gradient-to-br from-green-600 via-red-600 to-yellow-400 rounded-xl border-4 border-white shadow-xl hover:scale-105 transition-transform">
                  <div className="text-5xl mb-3 drop-shadow-lg">🇨🇲</div>
                  <div className="font-extrabold text-white text-xl drop-shadow-lg">
                    Cameroun
                  </div>
                  <div className="text-sm text-white font-bold drop-shadow-md bg-black/20 rounded-full px-3 py-1 mt-2 inline-block">
                    L'Afrique en miniature
                  </div>
                </div>

                {/* Congo - Vert, Jaune, Rouge diagonal */}
                <div className="text-center p-6 bg-gradient-to-br from-yellow-400 via-green-600 to-red-600 rounded-xl border-4 border-white shadow-xl hover:scale-105 transition-transform">
                  <div className="text-5xl mb-3 drop-shadow-lg">🇨🇬</div>
                  <div className="font-extrabold text-white text-xl drop-shadow-lg">
                    Congo
                  </div>
                  <div className="text-sm text-white font-bold drop-shadow-md bg-black/20 rounded-full px-3 py-1 mt-2 inline-block">
                    Cœur de l'Afrique
                  </div>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
              >
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
              <div className="relative h-96 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/uploads/IMG-20251117-WA0001.jpg"
                  alt="SEC CAM CONG"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Upcoming Events Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <CalendarIcon className="h-12 w-12 text-blue-600 mr-4" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Événements à venir
              </h2>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Rejoignez-nous pour des moments musicaux inoubliables qui
              célèbrent la richesse de nos cultures africaines
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 rounded-xl shadow-sm h-96"
                >
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-gray-50 rounded-xl border-2 border-gray-200"
            >
              <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Aucun événement programmé
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Restez connecté ! De nouveaux événements seront bientôt annoncés
              </p>
              <Link
                href="/events"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>Voir tous les événements</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    className="group"
                  >
                    <Link href={`/events/${event.id}`}>
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 h-full">
                        {event.imageUrl && (
                          <div className="relative h-48 overflow-hidden rounded-t-xl">
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                                À venir
                              </span>
                            </div>
                            {event.price && (
                              <div className="absolute top-4 right-4">
                                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  {event.price.toLocaleString()} FCFA
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <CalendarIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              <span className="text-sm font-medium">
                                {new Date(event.date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              <span className="text-sm">
                                {event.location}
                                {event.venue && ` - ${event.venue}`}
                              </span>
                            </div>
                          </div>
                          {event.description && (
                            <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center text-blue-600 font-semibold text-sm">
                              En savoir plus
                              <ArrowRightIcon className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div variants={itemVariants} className="text-center">
                <Link
                  href="/events"
                  className="inline-flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-sm hover:shadow-md"
                >
                  <CalendarIcon className="h-6 w-6" />
                  <span>Voir tous les événements</span>
                  <ArrowRightIcon className="h-6 w-6" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </motion.section>

      {/* Recent Performances Section */}
      {performances.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <MicrophoneIcon className="h-12 w-12 text-blue-600 mr-4" />
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Performances Récentes
                </h2>
              </div>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Revivez nos dernières performances et découvrez la magie de
                notre fusion musicale
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {performances.map((performance, index) => (
                <motion.div
                  key={performance.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/performances/${performance.id}`}>
                    <div className="relative h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                      {performance.imageUrl ? (
                        <Image
                          src={performance.imageUrl}
                          alt={performance.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <MicrophoneIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                          {performance.title}
                        </h3>
                        <p className="text-gray-200 text-sm mb-2">
                          {performance.venue}
                        </p>
                        <p className="text-gray-300 text-xs">
                          {new Date(performance.date).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="text-center">
              <Link
                href="/performances"
                className="inline-flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-sm hover:shadow-md"
              >
                <MicrophoneIcon className="h-6 w-6" />
                <span>Toutes nos performances</span>
                <ArrowRightIcon className="h-6 w-6" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-blue-500 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <GlobeAltIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Rejoignez Notre Communauté
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
              Découvrez la richesse de la culture africaine à travers notre
              musique et devenez partie intégrante de notre famille artistique
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/gallery"
                className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-sm"
              >
                <PhotoIcon className="h-6 w-6" />
                <span>Voir notre galerie</span>
                <ArrowRightIcon className="h-6 w-6" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center space-x-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors shadow-sm"
              >
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
