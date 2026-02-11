/**
 * Génère la requête SQL pour réinitialiser le mot de passe d'un utilisateur.
 * À exécuter en local, puis copier-coller le SQL dans le Supabase SQL Editor.
 *
 * Usage: node scripts/sql-reset-password.js [nouveau_mot_de_passe]
 * Exemple: node scripts/sql-reset-password.js Admin123!
 */

const bcrypt = require('bcryptjs')

const email = 'slovengama@gmail.com'
const password = process.argv[2] || 'Admin123!'

async function main() {
  const hash = await bcrypt.hash(password, 10)
  const sql = `-- Réinitialisation du mot de passe pour ${email}
-- Mot de passe (pour vous en souvenir): ${password}

UPDATE users
SET password = '${hash}'
WHERE email = '${email}';

-- Vérification (optionnel)
SELECT id, email, name, role FROM users WHERE email = '${email}';`
  console.log(sql)
  console.log('\n--- Copiez le bloc SQL ci-dessus et exécutez-le dans le Supabase SQL Editor ---')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
