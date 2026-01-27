#!/bin/bash

echo "🧹 Nettoyage du cache Next.js..."

# Arrêter tous les processus Node
echo "📛 Arrêt des processus Node..."
pkill -f "next dev" 2>/dev/null || true

# Supprimer le cache
echo "🗑️  Suppression du cache..."
rm -rf .next
rm -rf .turbo

echo "✅ Cache nettoyé !"
echo ""
echo "🚀 Relance du serveur..."
npm run dev
