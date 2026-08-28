// src/data/memberData.ts
export const MEMBER = {
  name: 'Maxwell Adjavon',
  number: 'AM-00001',
  tier: 'founding' as TierKey,
  since: '2024',
  handle: '@maxwelladjavon',
};

export type TierKey = 'core' | 'select' | 'elite' | 'founding';

export const TIER_LABELS: Record<TierKey, string> = { core:'Core', select:'Select', elite:'Elite', founding:'Founding ✦' };

export const TIER_ORDER: TierKey[] = ['core', 'select', 'elite', 'founding'];

export const TIER_DISPLAY: Record<TierKey, {
  title: string; subtitle: string; badge: string; perks: string; prof: string;
}> = {
  core:     { title:'Core',     subtitle:'Member',  badge:'Core Member · Verdant Tier',     perks:'Verdant tier',    prof:'◈ Verdant · Core Member' },
  select:   { title:'Select',   subtitle:'Member',  badge:'Select Member · Champagne Tier', perks:'Champagne tier',  prof:'◈ Champagne · Select Member' },
  elite:    { title:'Elite',    subtitle:'Member',  badge:'Elite Member · Platinum Tier',   perks:'Platinum tier',   prof:'◈ Platinum · Elite Member' },
  founding: { title:'Founding', subtitle:'Member',  badge:'Founding Member · Obsidian Tier',perks:'Obsidian tier',   prof:'✦ Obsidian · Founding Member' },
};

export const EVENTS = [
  {
    id:1, day:'08', month:'Mar', name:'Rooftop Sundowner',
    time:'18:30', location:'Accra', venue:'Skybar 57',
    tier:'core', status:'open', emoji:'🌅',
    desc:'An open-air evening on one of Accra\u2019s finest rooftops. Sundowners, light bites, and the city below. Open to all members \u2014 come as you are.',
    capacity:'60 guests', dress:'Smart casual'
  },
  {
    id:2, day:'12', month:'Mar', name:'Art Basel Dinner',
    time:'20:00', location:'Basel', venue:'Private Residence',
    tier:'elite', status:'invite', emoji:'🎨',
    desc:'An intimate dinner hosted alongside Art Basel, in a private collector\u2019s home. Works by emerging African artists on display throughout the evening.',
    capacity:'18 guests', dress:'Evening wear'
  },
  {
    id:3, day:'14', month:'Mar', name:'Private Dinner — Lagos',
    time:'20:00', location:'Lagos', venue:'The Terrace',
    tier:'select', status:'booked', emoji:'🕯️',
    desc:"A curated dinner for Select and above members at our Lagos chapter. Seasonal menu by resident chef Temi Adeyemi, paired wines, and unhurried conversation.",
    capacity:'24 guests', dress:'Smart casual'
  },
  {
    id:4, day:'19', month:'Mar', name:'Music & Minds Session',
    time:'19:00', location:'London', venue:'The Vaults',
    tier:'core', status:'open', emoji:'🎵',
    desc:'A hybrid listening session and panel conversation on the intersection of music, culture and African creative identity. Featured artists announced day-of.',
    capacity:'80 guests', dress:'Casual'
  },
  {
    id:5, day:'22', month:'Mar', name:'Wellness Retreat Weekend',
    time:'All day', location:'Nairobi', venue:'Ngong Hills Estate',
    tier:'select', status:'open', emoji:'🌿',
    desc:'Three days of intentional rest in the Ngong Hills. Morning movement, group sessions, local cuisine and space to disconnect. Select tier and above.',
    capacity:'20 guests', dress:'Comfortable'
  },
  {
    id:6, day:'28', month:'Mar', name:'Founding Members Gala',
    time:'21:00', location:'Accra', venue:'The Grand Hall',
    tier:'founding', status:'invite', emoji:'✦',
    desc:'Our annual celebration for Founding Members. An evening of reflection, recognition and revelry. The one night we close the doors to the world and gather as family.',
    capacity:'247 founding members', dress:'Black tie'
  }
];
