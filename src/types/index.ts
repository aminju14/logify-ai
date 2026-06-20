export interface WorkLog {
  id: string
  date: string
  title: string
  tag: string
  tagColor: string
  time: string
  input: string
  report?: GeneratedReport
}

export interface GeneratedReport {
  summary: string
  accomplishments: string[]
  challenges: string[]
  nextSteps: string[]
}

export interface Settings {
  theme: 'dark' | 'light' | 'system'
  accent: string
  reportStyle: 'professional' | 'casual'
  outputLength: 'short' | 'detailed'
  language: 'english' | 'indonesia'
  /** Optional user-set display name, used in greetings and the profile card. */
  displayName: string
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  accent: '#F4C430',
  reportStyle: 'professional',
  outputLength: 'short',
  language: 'english',
  displayName: '',
}
