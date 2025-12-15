import { GAD7_ITEMS, PHQ9_ITEMS } from './scales'
import type { Gad7Severity, Phq9Severity } from './scoring'

export type AssessmentSnapshot = {
  ts: number
  phq9: number[]
  gad7: number[]
  phqTotal: number
  gadTotal: number
  phqLevel: Phq9Severity
  gadLevel: Gad7Severity
}

const ALLOW_LOCAL_SAVE_KEY = 'cbt-diagnostic-allow-save'
const LATEST_SNAPSHOT_KEY = 'cbt-diagnostic-latest'

export const readAllowLocalSavePreference = (): boolean => {
  try {
    return localStorage.getItem(ALLOW_LOCAL_SAVE_KEY) === 'true'
  } catch {
    return false
  }
}

export const writeAllowLocalSavePreference = (allow: boolean): void => {
  try {
    localStorage.setItem(ALLOW_LOCAL_SAVE_KEY, allow ? 'true' : 'false')
  } catch {}
}

export const validateSnapshot = (raw: unknown): raw is AssessmentSnapshot => {
  if (typeof raw !== 'object' || raw === null) return false
  const snapshot = raw as Partial<AssessmentSnapshot>

  const isValidResponses = (arr: unknown, length: number) =>
    Array.isArray(arr) && arr.length === length && arr.every(v => typeof v === 'number')

  return (
    typeof snapshot.ts === 'number' &&
    isValidResponses(snapshot.phq9, PHQ9_ITEMS.length) &&
    isValidResponses(snapshot.gad7, GAD7_ITEMS.length) &&
    typeof snapshot.phqTotal === 'number' &&
    typeof snapshot.gadTotal === 'number' &&
    typeof snapshot.phqLevel === 'string' &&
    typeof snapshot.gadLevel === 'string'
  )
}

export const readLatestSnapshot = (): AssessmentSnapshot | null => {
  try {
    const raw = localStorage.getItem(LATEST_SNAPSHOT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!validateSnapshot(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export const writeLatestSnapshot = (snapshot: AssessmentSnapshot): void => {
  try {
    localStorage.setItem(LATEST_SNAPSHOT_KEY, JSON.stringify(snapshot))
  } catch {}
}

export const clearLatestSnapshot = (): void => {
  try {
    localStorage.removeItem(LATEST_SNAPSHOT_KEY)
  } catch {}
}
