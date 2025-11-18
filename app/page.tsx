'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import EventsSection from '@/components/EventsSection'
import PerformancesSection from '@/components/PerformancesSection'

export default function Home() {
  const [events, setEvents] = useState([])
  const [performances, setPerformances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, performancesRes] = await Promise.all([
          fetch('/api/events?limit=3'),
          fetch('/api/performances?limit=3'),
        ])
        
        const eventsData = await eventsRes.json()
        const performancesData = await performancesRes.json()
        
        setEvents(eventsData.events || [])
        setPerformances(performancesData.performances || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="flex flex-col">
      <Hero />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 md:px-6 py-12 md:py-16"
      >
        <EventsSection events={events} loading={loading} />
        <PerformancesSection performances={performances} loading={loading} />
      </motion.div>
    </div>
  )
}

