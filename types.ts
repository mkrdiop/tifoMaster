
export interface Team {
  id: string;
  name: string;
  colors: string[];
  flag: string;
}

export interface AppState {
  image: string | null;
  selectedTeam: Team | null;
  generatedImage: string | null;
  status: 'idle' | 'processing' | 'completed' | 'error';
  errorMessage: string | null;
}

export const TEAMS: Team[] = [
  { id: 'senegal', name: 'Sénégal', colors: ['#00853f', '#fdef42', '#e31b23'], flag: '🇸🇳' },
  { id: 'ivorycoast', name: 'Côte d\'Ivoire', colors: ['#ff8200', '#ffffff', '#009e60'], flag: '🇨🇮' },
  { id: 'morocco', name: 'Maroc', colors: ['#c1272d', '#006233'], flag: '🇲🇦' },
  { id: 'cameroon', name: 'Cameroun', colors: ['#007a5e', '#ce1126', '#fcd116'], flag: '🇨🇲' },
  { id: 'algeria', name: 'Algérie', colors: ['#ffffff', '#006233', '#d21034'], flag: '🇩🇿' },
  { id: 'nigeria', name: 'Nigeria', colors: ['#008751', '#ffffff'], flag: '🇳🇬' },
  { id: 'egypt', name: 'Égypte', colors: ['#ce1126', '#ffffff', '#000000'], flag: '🇪🇬' },
  { id: 'mali', name: 'Mali', colors: ['#14b53a', '#fcd116', '#ce1126'], flag: '🇲🇱' },
  { id: 'drcongo', name: 'RD Congo', colors: ['#007fff', '#f7d618', '#ce1126'], flag: '🇨🇩' },
  { id: 'tunisia', name: 'Tunisie', colors: ['#e70013', '#ffffff'], flag: '🇹🇳' },
  { id: 'ghana', name: 'Ghana', colors: ['#ef3340', '#ffd100', '#009b48'], flag: '🇬🇭' },
  { id: 'guinea', name: 'Guinée', colors: ['#ce1126', '#fcd116', '#009460'], flag: '🇬🇳' },
];
