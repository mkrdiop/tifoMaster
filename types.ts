
export interface Team {
  id: string;
  name: string;
  colors: string[];
  flag: string;
  isClub?: boolean;
}

export interface AppState {
  image: string | null;
  selectedTeam: Team | null;
  generatedImage: string | null;
  status: 'idle' | 'processing' | 'completed' | 'error';
  errorMessage: string | null;
}

export const TEAMS: Team[] = [
  // Équipes Nationales (Existantes + quelques ajouts)
  { id: 'senegal', name: 'Sénégal', colors: ['#00853f', '#fdef42', '#e31b23'], flag: '🇸🇳' },
  { id: 'ivorycoast', name: 'Côte d\'Ivoire', colors: ['#ff8200', '#ffffff', '#009e60'], flag: '🇨🇮' },
  { id: 'morocco', name: 'Maroc', colors: ['#c1272d', '#006233'], flag: '🇲🇦' },
  { id: 'cameroon', name: 'Cameroun', colors: ['#007a5e', '#ce1126', '#fcd116'], flag: '🇨🇲' },
  { id: 'algeria', name: 'Algérie', colors: ['#ffffff', '#006233', '#d21034'], flag: '🇩🇿' },
  { id: 'france', name: 'France', colors: ['#002395', '#ffffff', '#ed2939'], flag: '🇫🇷' },
  { id: 'brazil', name: 'Brésil', colors: ['#fedf00', '#009b3a', '#002776'], flag: '🇧🇷' },
  { id: 'argentina', name: 'Argentine', colors: ['#75aadb', '#ffffff', '#fcbf49'], flag: '🇦🇷' },
  
  // Grands Clubs Internationaux
  { id: 'realmadrid', name: 'Real Madrid', colors: ['#ffffff', '#00529f', '#fecb00'], flag: '⚪', isClub: true },
  { id: 'barcelona', name: 'FC Barcelone', colors: ['#a50044', '#004d98', '#edbb00'], flag: '🔵🔴', isClub: true },
  { id: 'mancity', name: 'Manchester City', colors: ['#6cabdd', '#ffffff', '#1c2c5b'], flag: '🩵', isClub: true },
  { id: 'liverpool', name: 'Liverpool FC', colors: ['#c8102e', '#f6eb61', '#00b2a9'], flag: '🔴', isClub: true },
  { id: 'manunited', name: 'Manchester United', colors: ['#da291c', '#000000', '#fbe122'], flag: '👹', isClub: true },
  { id: 'psg', name: 'Paris Saint-Germain', colors: ['#004170', '#da291c', '#ffffff'], flag: '🗼', isClub: true },
  { id: 'bayern', name: 'Bayern Munich', colors: ['#dc052d', '#ffffff', '#0066b2'], flag: '🥨', isClub: true },
  { id: 'juventus', name: 'Juventus', colors: ['#ffffff', '#000000'], flag: '🦓', isClub: true },
  { id: 'acmilan', name: 'AC Milan', colors: ['#fb090b', '#000000'], flag: '🔴⚫', isClub: true },
  { id: 'inter', name: 'Inter Milan', colors: ['#0068a8', '#000000', '#c2923b'], flag: '🔵⚫', isClub: true },
  { id: 'arsenal', name: 'Arsenal FC', colors: ['#ef0107', '#ffffff', '#063672'], flag: '🔫', isClub: true },
  { id: 'chelsea', name: 'Chelsea FC', colors: ['#034694', '#ffffff', '#dba111'], flag: '🦁', isClub: true },
  { id: 'dortmund', name: 'B. Dortmund', colors: ['#fde100', '#000000'], flag: '🐝', isClub: true },
];
