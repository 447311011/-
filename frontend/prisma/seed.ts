import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SEED_USERS = [
  { email: 'sofia@test.com', displayName: 'Sofia', gender: 'FEMALE', city: 'Paris', country: 'France', bio: 'Passionnée de musique et de voyages 🎵✈️', goal: 'SERIOUS', interests: ['Musique', 'Voyages', 'Photographie'], lat: 48.8566, lon: 2.3522 },
  { email: 'amara@test.com', displayName: 'Amara', gender: 'FEMALE', city: 'Lyon', country: 'France', bio: 'Foodie et artiste à mes heures perdues 🎨', goal: 'FRIENDSHIP', interests: ['Art', 'Cuisine', 'Yoga'], lat: 45.7640, lon: 4.8357 },
  { email: 'karim@test.com', displayName: 'Karim', gender: 'MALE', city: 'Marseille', country: 'France', bio: 'Sport, bonne humeur et ambition 💪', goal: 'CASUAL', interests: ['Sport', 'Fitness', 'Gaming'], lat: 43.2965, lon: 5.3698 },
  { email: 'lena@test.com', displayName: 'Léna', gender: 'FEMALE', city: 'Madrid', country: 'Espagne', bio: 'La vida es bella 🌹', goal: 'SERIOUS', interests: ['Danse', 'Voyages', 'Cinéma'], lat: 40.4168, lon: -3.7038 },
  { email: 'alex@test.com', displayName: 'Alex', gender: 'MALE', city: 'London', country: 'UK', bio: 'Coffee addict & tech enthusiast ☕', goal: 'NETWORKING', interests: ['Tech', 'Café', 'Lecture'], lat: 51.5074, lon: -0.1278 },
  { email: 'nina@test.com', displayName: 'Nina', gender: 'FEMALE', city: 'Berlin', country: 'Allemagne', bio: 'Electro music & night vibes 🎧', goal: 'CASUAL', interests: ['Musique', 'Fêtes', 'Art'], lat: 52.5200, lon: 13.4050 },
  { email: 'marco@test.com', displayName: 'Marco', gender: 'MALE', city: 'Rome', country: 'Italie', bio: 'Cucina, amore e passione 🍕', goal: 'SERIOUS', interests: ['Cuisine', 'Football', 'Voyages'], lat: 41.9028, lon: 12.4964 },
  { email: 'yasmine@test.com', displayName: 'Yasmine', gender: 'FEMALE', city: 'Casablanca', country: 'Maroc', bio: 'Entre deux mondes, une âme libre 🌟', goal: 'FRIENDSHIP', interests: ['Lecture', 'Voyages', 'Musique'], lat: 33.5731, lon: -7.5898 },
]

async function main() {
  console.log('🌱 Seeding Hilunia database...')

  const password = await bcrypt.hash('Test1234!', 12)

  for (const u of SEED_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      console.log(`  ↩ Skipped ${u.email} (already exists)`)
      continue
    }

    const user = await prisma.user.create({
      data: {
        email: u.email,
        passwordHash: password,
        goldCoins: 300,
        gameTokens: 0,
        diamonds: 0,
        vipLevel: 'NONE',
        selfieVerified: Math.random() > 0.5,
        isOnline: Math.random() > 0.4,
        level: Math.floor(Math.random() * 5) + 1,
        xp: Math.floor(Math.random() * 500),
        bonusProfileDone: true,
      },
    })

    await prisma.profile.create({
      data: {
        userId: user.id,
        displayName: u.displayName,
        birthDate: new Date(1995 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: u.gender as 'MALE' | 'FEMALE',
        interestedIn: 'BOTH',
        bio: u.bio,
        city: u.city,
        country: u.country,
        latitude: u.lat,
        longitude: u.lon,
        goal: u.goal,
        interests: JSON.stringify(u.interests),
        isComplete: true,
      },
    })

    await prisma.coinTransaction.create({
      data: {
        userId: user.id,
        amount: 300,
        type: 'WELCOME_BONUS',
        description: 'Bonus de bienvenue',
        balanceAfter: 300,
      },
    })

    console.log(`  ✅ Created ${u.displayName} (${u.email})`)
  }

  // Test admin account
  const adminEmail = 'admin@hilunia.com'
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!adminExists) {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await bcrypt.hash('Admin1234!', 12),
        goldCoins: 9999,
        isAdmin: true,
        selfieVerified: true,
        vipLevel: 'DIAMOND',
        level: 50,
        xp: 50000,
      },
    })
    await prisma.profile.create({
      data: {
        userId: admin.id,
        displayName: 'Admin',
        gender: 'OTHER',
        interestedIn: 'BOTH',
        isComplete: true,
      },
    })
    console.log(`  ✅ Created admin (${adminEmail})`)
  }

  console.log('✨ Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => void prisma.$disconnect())
