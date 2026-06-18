import { Users, Code2, Bug, BookOpen, Palette, FileText, type LucideIcon } from 'lucide-react'

/**
 * Single source of truth for work-log tags. Previously this config was
 * duplicated (with subtle inconsistencies) across InputCard, RecentLogs,
 * the dashboard, calendar, and my-logs pages. Everything is keyed by tag
 * NAME here; the per-tag `color` slug is derived, not stored separately.
 */
export interface TagConfig {
  /** Color slug (also persisted on legacy logs as `tagColor`). */
  color: string
  /** Small accent dot, e.g. for chips. */
  dot: string
  /** Icon background tint. */
  iconBg: string
  /** Icon foreground color. */
  iconColor: string
  /** Pill/badge background+text. */
  badge: string
  /** Soft badge variant used in compact lists (lighter bg). */
  badgeSoft: string
  Icon: LucideIcon
}

export const TAGS: Record<string, TagConfig> = {
  Meeting: {
    color: 'purple',
    dot: 'bg-purple-400',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400',
    badgeSoft: 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
    Icon: Users,
  },
  Development: {
    color: 'indigo',
    dot: 'bg-indigo-400',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-400',
    badgeSoft: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    Icon: Code2,
  },
  'Bug Fix': {
    color: 'orange',
    dot: 'bg-orange-400',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    badge: 'bg-orange-500/10 text-orange-400',
    badgeSoft: 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
    Icon: Bug,
  },
  Research: {
    color: 'emerald',
    dot: 'bg-emerald-400',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400',
    badgeSoft: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    Icon: BookOpen,
  },
  Design: {
    color: 'sky',
    dot: 'bg-sky-400',
    iconBg: 'bg-sky-500/20',
    iconColor: 'text-sky-400',
    badge: 'bg-sky-500/10 text-sky-400',
    badgeSoft: 'bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400',
    Icon: Palette,
  },
  General: {
    color: 'gray',
    dot: 'bg-gray-400',
    iconBg: 'bg-gray-500/20',
    iconColor: 'text-gray-400',
    badge: 'bg-gray-500/10 text-gray-400',
    badgeSoft: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
    Icon: FileText,
  },
}

export const TAG_NAMES = Object.keys(TAGS)

const FALLBACK = TAGS.General

/** Resolve a tag's config by its name, falling back to General. */
export function tagConfig(name: string): TagConfig {
  return TAGS[name] ?? FALLBACK
}

/** The color slug for a tag name — what gets stored on a new log. */
export function tagColor(name: string): string {
  return tagConfig(name).color
}
