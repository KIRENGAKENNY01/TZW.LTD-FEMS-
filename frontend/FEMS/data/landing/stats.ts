export interface LandingStat {
  value: string;
  suffix?: string;
  label: string;
}

export const landingStats: LandingStat[] = [
  { value: '25', suffix: '+', label: 'Years of Experience' },
  { value: '10', suffix: 'K', label: 'Satisfied Clients' },
  { value: '1', suffix: 'K+', label: 'Projects Complete' },
  { value: '2', suffix: 'K+', label: 'Awards Winning' },
];
