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

export interface Tag {
  label: string
  dotColor: string
}
