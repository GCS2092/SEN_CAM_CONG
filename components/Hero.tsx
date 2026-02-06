"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDownIcon, PlayIcon, SparklesIcon } from "@/components/Icons";

interface HeroSettings {
  hero_background_image?: { value: string | null };
  hero_title?: { value: string | null };
  hero_subtitle?: { value: string | null };
}

export default function Hero() {
  const [settings, setSettings] = useState<HeroSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [bgRes, titleRes, subtitleRes] = await Promise.all([
          fetch("/api/site-settings?key=hero_background_image").catch(() => ({
            json: async () => ({ setting: null }),
          })),
          fetch("/api/site-settings?key=hero_title").catch(() => ({
            json: async () => ({ setting: null }),
          })),
          fetch("/api/site-settings?key=hero_subtitle").catch(() => ({
            json: async () => ({ setting: null }),
          })),
        ]);

        const bgData = await bgRes.json().catch(() => ({ setting: null }));
        const titleData = await titleRes
          .json()
          .catch(() => ({ setting: null }));
        const subtitleData = await subtitleRes
          .json()
          .catch(() => ({ setting: null }));

        setSettings({
          hero_background_image: bgData.setting,
          hero_title: titleData.setting,
          hero_subtitle: subtitleData.setting,
        });
      } catch (error) {
        console.error("Error loading hero settings:", error);
        setSettings({});
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const backgroundImage =
    settings.hero_background_image?.value || "/placeholder.svg";
  const title = settings.hero_title?.value || "SEN CAM CONG";
  const subtitle =
    settings.hero_subtitle?.value ||
    "La fusion musicale du Sénégal, du Cameroun et du Congo";

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Simple Light Overlay */}
      <div className="absolute inset-0 z-10 bg-white/60" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center px-4 w-full max-w-6xl mx-auto"
      >
        {/* Decorative Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <SparklesIcon className="h-10 w-10 text-blue-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 text-gray-900"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-700 font-normal leading-relaxed max-w-4xl mx-auto mb-10"
        >
          {subtitle}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="btn-primary flex items-center justify-center gap-2">
            <PlayIcon className="h-5 w-5" />
            Écouter
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2">
            Découvrir
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDownIcon className="h-6 w-6 text-gray-500 animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
}
