import { getAllDogs, getAllSessions, getSessionsByDog } from './db.js'

export async function calcOverall() {
  const dogs = await getAllDogs()
  const sessions = await getAllSessions()
  const totalHits = sessions.reduce((s, x) => s + (x.hits || 0), 0)
  const totalMisses = sessions.reduce((s, x) => s + (x.misses || 0), 0)
  const totalAttempts = totalHits + totalMisses
  return {
    totalDogs: dogs.length,
    totalSessions: sessions.length,
    totalHits,
    totalMisses,
    totalAttempts,
    accuracy: totalAttempts > 0 ? Math.round((totalHits / totalAttempts) * 100) : 0
  }
}

export async function calcDogStats(dogId) {
  const sessions = await getSessionsByDog(dogId)
  if (sessions.length === 0) return null
  const totalHits = sessions.reduce((s, x) => s + (x.hits || 0), 0)
  const totalMisses = sessions.reduce((s, x) => s + (x.misses || 0), 0)
  const totalAttempts = totalHits + totalMisses
  const accuracy = totalAttempts > 0 ? Math.round((totalHits / totalAttempts) * 100) : 0

  const byOdor = {}
  const byType = {}
  const weekly = {}

  for (const s of sessions) {
    if (s.odor) {
      byOdor[s.odor] = byOdor[s.odor] || { hits: 0, misses: 0, sessions: 0 }
      byOdor[s.odor].hits += s.hits || 0
      byOdor[s.odor].misses += s.misses || 0
      byOdor[s.odor].sessions++
    }
    if (s.sessionType) {
      byType[s.sessionType] = byType[s.sessionType] || { hits: 0, misses: 0, sessions: 0 }
      byType[s.sessionType].hits += s.hits || 0
      byType[s.sessionType].misses += s.misses || 0
      byType[s.sessionType].sessions++
    }
    const d = new Date(s.date)
    const ws = new Date(d); ws.setDate(d.getDate() - d.getDay())
    const key = ws.toISOString().split('T')[0]
    weekly[key] = weekly[key] || { weekStart: key, hits: 0, misses: 0, sessions: 0 }
    weekly[key].hits += s.hits || 0
    weekly[key].misses += s.misses || 0
    weekly[key].sessions++
  }

  return {
    totalHits, totalMisses, totalAttempts, accuracy,
    byOdor: Object.entries(byOdor).map(([k, v]) => ({ ...v, odor: k })),
    byType: Object.entries(byType).map(([k, v]) => ({ ...v, type: k })),
    weekly: Object.values(weekly).sort((a, b) => a.weekStart.localeCompare(b.weekStart)),
    sessions
  }
}
