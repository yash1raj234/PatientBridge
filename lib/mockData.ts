export const MOCK_DOCTORS = [
  {
    id: 'doc_1',
    name: 'Dr. Ananya Sharma',
    specialty: 'General Physician',
    qualifications: 'MBBS, MD — 12 years experience',
    bio: 'Compassionate general physician specializing in holistic care and chronic disease management.',
    availableToday: true,
  },
  {
    id: 'doc_2',
    name: 'Dr. Rakesh Verma',
    specialty: 'Pulmonologist',
    qualifications: 'MBBS, MD (Pulmonary Medicine) — 20 years experience',
    bio: 'Expert in respiratory conditions with extensive experience in treating Bhopal Gas Tragedy survivors.',
    availableToday: true,
  },
  {
    id: 'doc_3',
    name: 'Dr. Sunita Rao',
    specialty: 'Ayurvedic Specialist',
    qualifications: 'BAMS, MD (Ayu) — 15 years experience',
    bio: 'Dedicated practitioner of traditional Ayurvedic medicine, focusing on natural remedies.',
    availableToday: false,
  },
];

export const MOCK_TESTIMONIALS = [
  {
    id: 't1',
    quote: "The AI pre-screening saved me so much time. Dr. Sharma already knew my symptoms before I sat down.",
    author: 'Priya K.',
    type: 'First-time patient',
    initials: 'PK'
  },
  {
    id: 't2',
    quote: "Sambhavna has been treating my family for decades. The new digital booking is seamless and wonderful.",
    author: 'Ramesh T.',
    type: 'Regular patient',
    initials: 'RT'
  },
  {
    id: 't3',
    quote: "I was nervous about the AI, but it felt like chatting with a nurse. Very intuitive and easy to use.",
    author: 'Meera D.',
    type: 'Consultation',
    initials: 'MD'
  },
  {
    id: 't4',
    quote: "The combination of modern tech and traditional compassion is what makes this clinic so special.",
    author: 'Arjun S.',
    type: 'Follow-up patient',
    initials: 'AS'
  },
  {
    id: 't5',
    quote: "Quick booking and zero wait time at the clinic because of the pre-consultation report.",
    author: 'Nikita M.',
    type: 'First-time patient',
    initials: 'NM'
  },
  {
    id: 't6',
    quote: "The doctor was extremely well-prepared. Excellent facility and great new website.",
    author: 'Vikram B.',
    type: 'Regular patient',
    initials: 'VB'
  }
];

export const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1',
    patientName: 'Priya Verma',
    age: 34,
    time: '09:00 AM',
    status: 'Completed',
    complaint: 'Persistent dry cough for 3 weeks',
    hasAiReport: true,
  },
  {
    id: 'apt_2',
    patientName: 'Rahul Singh',
    age: 45,
    time: '09:30 AM',
    status: 'In Progress',
    complaint: 'Joint pain in knees and ankles',
    hasAiReport: true,
  },
  {
    id: 'apt_3',
    patientName: 'Meera Joshi',
    age: 28,
    time: '10:00 AM',
    status: 'Waiting',
    complaint: 'Migraine and light sensitivity',
    hasAiReport: true,
  },
  {
    id: 'apt_4',
    patientName: 'Amit Patel',
    age: 52,
    time: '10:30 AM',
    status: 'Waiting',
    complaint: 'Routine follow up for hypertension',
    hasAiReport: false,
  },
  {
    id: 'apt_5',
    patientName: 'Sneha Gupta',
    age: 19,
    time: '11:00 AM',
    status: 'Waiting',
    complaint: 'Fever and throat irritation',
    hasAiReport: true,
  }
];

export const AI_REPORT_MOCK = {
  summary: "Patient presents with a 3-week history of persistent dry cough, worsening at night. No history of fever or weight loss. Patient mentions slight shortness of breath after climbing stairs.",
  keySymptoms: ["Dry Cough", "Night Aggravation", "Mild Dyspnea"],
  riskLevel: "LOW", 
  focusPoints: [
    "Check lung sounds for wheezing",
    "Inquire about exposure to dust/allergens recently",
    "Consider basic spirometry depending on auscultation"
  ]
};

export const SERVICES = [
  {
    id: 'general',
    title: 'General Consultation',
    icon: 'Stethoscope',
    description: 'Comprehensive health checkups and primary care for families.'
  },
  {
    id: 'ai',
    title: 'AI Pre-Screening',
    icon: 'Brain',
    description: 'Our new AI assistant gathers your symptoms before the visit so the doctor is fully prepared.'
  },
  {
    id: 'bhopal',
    title: 'Bhopal Gas Relief',
    icon: 'HeartPulse',
    description: 'Specialized ongoing care for survivors of the Bhopal gas tragedy.'
  },
  {
    id: 'ayush',
    title: 'Ayurvedic Care',
    icon: 'Leaf',
    description: 'Traditional holistic treatments and natural remedies.'
  },
  {
    id: 'follow',
    title: 'Follow-up Care',
    icon: 'CalendarCheck',
    description: 'Continuous monitoring and management of chronic conditions.'
  }
];
