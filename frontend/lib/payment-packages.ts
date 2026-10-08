export const COIN_PACKAGES = [
  {
    id: 'starter',
    coins: 500,
    bonusCoins: 0,
    priceEur: 4.99,
    priceStripe: 499, // centimes
    label: '500 pièces',
    badge: null,
    popular: false,
  },
  {
    id: 'popular',
    coins: 1000,
    bonusCoins: 200,
    priceEur: 9.99,
    priceStripe: 999,
    label: '1 000 + 200 pièces',
    badge: '🔥 Populaire',
    popular: true,
  },
  {
    id: 'value',
    coins: 2500,
    bonusCoins: 500,
    priceEur: 19.99,
    priceStripe: 1999,
    label: '2 500 + 500 pièces',
    badge: '💎 Meilleur rapport',
    popular: false,
  },
  {
    id: 'mega',
    coins: 5000,
    bonusCoins: 1500,
    priceEur: 34.99,
    priceStripe: 3499,
    label: '5 000 + 1 500 pièces',
    badge: '🚀 Mega Pack',
    popular: false,
  },
] as const

export const VIP_PACKAGES = [
  {
    id: 'silver',
    level: 'SILVER',
    priceEur: 9.99,
    priceStripe: 999,
    label: 'VIP Silver',
    color: '#C0C0C0',
    perks: ['Profil mis en avant', '5 Super Likes/jour', 'Voir qui t\'a liké'],
  },
  {
    id: 'gold',
    level: 'GOLD',
    priceEur: 19.99,
    priceStripe: 1999,
    label: 'VIP Gold',
    color: '#FFD700',
    perks: ['Tout Silver', '15 Super Likes/jour', 'Mode Incognito', 'Boost x2/semaine'],
  },
  {
    id: 'diamond',
    level: 'DIAMOND',
    priceEur: 49.99,
    priceStripe: 4999,
    label: 'VIP Diamond',
    color: '#7C5CFF',
    perks: ['Tout Gold', 'Super Likes illimités', 'Badge Diamond', 'Support prioritaire', 'Boost quotidien'],
  },
] as const

export type CoinPackageId = typeof COIN_PACKAGES[number]['id']
export type VipPackageId = typeof VIP_PACKAGES[number]['id']
