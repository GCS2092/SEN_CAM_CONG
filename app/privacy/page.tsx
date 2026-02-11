'use client'

import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l&apos;accueil
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Politique de confidentialité</h1>
        <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
          <p>
            SEN CAM CONG respecte votre vie privée. Les données collectées via le site (formulaires, connexion)
            sont utilisées uniquement pour le fonctionnement du site et ne sont pas cédées à des tiers.
          </p>
          <p>
            Conformément au RGPD, vous pouvez demander l&apos;accès ou la suppression de vos données en nous contactant.
          </p>
          <p>
            Contact : <a href="mailto:contact@seccamcong.com" className="text-primary-600 hover:underline">contact@seccamcong.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
