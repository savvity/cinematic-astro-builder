export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    slug: 'personal-training',
    name: 'Personal Training',
    shortDescription: '1-on-1 coaching tailored to your health history and goals.',
    description: 'FIT360 personal trainers build fully customized programs around your health conditions, movement patterns, and schedule. Every session is private, every plan is built from your assessment.',
    icon: 'ph:person-simple-run-fill',
  },
  {
    slug: 'nutrition-coaching',
    name: 'Nutrition Coaching',
    shortDescription: 'Personalized meal plans from licensed nutritionists. No crash diets.',
    description: 'Our licensed nutritionists create science-backed food strategies that integrate directly with your training program. Plans are flexible, condition-specific, and built for real life.',
    icon: 'ph:bowl-food-fill',
  },
  {
    slug: 'exercise-specialist',
    name: 'Exercise Specialist',
    shortDescription: 'Advanced movement programming for complex health conditions.',
    description: 'Exercise specialists design clinical-grade movement programs for clients with chronic pain, structural issues, and complex conditions who need more than a standard fitness plan.',
    icon: 'ph:heartbeat-fill',
  },
  {
    slug: 'private-studio',
    name: 'Private Studio',
    shortDescription: 'Train in a distraction-free private studio with full trainer attention.',
    description: 'FIT360 operates on a one-client, one-trainer model. No crowds, no waiting, no distractions. Just you, your trainer, and the equipment you need at our Kharadi studio.',
    icon: 'ph:buildings-fill',
  },
  {
    slug: 'home-training',
    name: 'Home Training',
    shortDescription: 'Full coaching programs delivered to your door with equipment.',
    description: 'The same expert coaching as our studio program, delivered to your home anywhere in Pune. Equipment is delivered, plans include video guides, and your coach checks in weekly.',
    icon: 'ph:house-fill',
  },
];

export interface Condition {
  slug: string;
  name: string;
  shortDescription: string;
  icon: string;
}

export const conditions: Condition[] = [
  {
    slug: 'pcod-reversal',
    name: 'PCOD Reversal',
    shortDescription: 'Hormone-friendly workouts and nutrition to restore cycle regularity and reverse insulin resistance.',
    icon: 'ph:flower-fill',
  },
  {
    slug: 'diabetes-reversal',
    name: 'Diabetes Management',
    shortDescription: 'Exercise programs that improve insulin sensitivity and lower blood sugar naturally.',
    icon: 'ph:drop-fill',
  },
  {
    slug: 'arthritis-relief',
    name: 'Arthritis Relief',
    shortDescription: 'Joint-safe strength training and mobility work to reduce pain and improve daily function.',
    icon: 'ph:bone-fill',
  },
  {
    slug: 'sciatica-pain-relief',
    name: 'Sciatica Pain Relief',
    shortDescription: 'Targeted core and spine programming to decompress the sciatic nerve and eliminate shooting pain.',
    icon: 'ph:lightning-fill',
  },
  {
    slug: 'slip-disc-back-pain',
    name: 'Slip Disc and Back Pain',
    shortDescription: 'Spine-safe exercise rehabilitation for herniated discs, lumbar pain, and postural issues.',
    icon: 'ph:stack-fill',
  },
  {
    slug: 'spondylitis-management',
    name: 'Spondylitis Management',
    shortDescription: 'Anti-inflammatory exercise protocols and posture correction for cervical and lumbar spondylitis.',
    icon: 'ph:shield-check-fill',
  },
];
