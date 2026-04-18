export interface Collaborator {
  id: string
  name: string
  specialty: string
  bio: { en: string; es: string; he: string }
  location: string
  websiteUrl?: string
  contactUrl?: string
}

export const collaborators: Collaborator[] = [
  {
    id: 'cr-acu-1',
    name: 'Name · Acupuncturist',
    specialty: 'Acupuncture & Traditional Chinese Medicine',
    bio: {
      en: 'Experienced acupuncturist based in Costa Rica, specializing in stress, anxiety, and somatic integration alongside emotional therapy.',
      es: 'Acupunturista con experiencia en Costa Rica, especializada en estrés, ansiedad e integración somática junto con terapia emocional.',
      he: 'דיקור מנוסה בקוסטה ריקה, המתמחה בלחץ, חרדה ואינטגרציה סומטית לצד טיפול רגשי.',
    },
    location: 'San José, Costa Rica',
    websiteUrl: 'https://example.com',
    contactUrl: 'https://example.com/contact',
  },
  {
    id: 'il-acu-1',
    name: 'Name · Acupuncturist',
    specialty: 'Acupuncture & Body-Mind Integration',
    bio: {
      en: 'Practitioner based in Israel offering physical and energetic treatments that complement emotional therapy for a holistic approach to wellbeing.',
      es: 'Practicante en Israel que ofrece tratamientos físicos y energéticos que complementan la terapia emocional para un enfoque integral del bienestar.',
      he: 'מטפל/ת בישראל המציע/ת טיפולים פיזיים ואנרגטיים המשלימים את הטיפול הרגשי לגישה הוליסטית לרווחה.',
    },
    location: 'Israel',
    websiteUrl: 'https://example.com',
    contactUrl: 'https://example.com/contact',
  },
]
