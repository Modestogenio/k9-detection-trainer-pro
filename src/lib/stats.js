import { getAllDogs, getAllSessions, getSessionsByDog, getDog, DOG_BREEDS } from './db.js'

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

export async function calcTrend(dogId) {
  const sessions = await getSessionsByDog(dogId)
  if (sessions.length < 4) return null

  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date))
  const mid = Math.floor(sorted.length / 2)
  const recent = sorted.slice(mid)
  const previous = sorted.slice(0, mid)

  function avg(arr) {
    const hits = arr.reduce((s, x) => s + (x.hits || 0), 0)
    const misses = arr.reduce((s, x) => s + (x.misses || 0), 0)
    const total = hits + misses
    return total > 0 ? (hits / total) * 100 : 0
  }

  const recentAcc = avg(recent)
  const prevAcc = avg(previous)
  const diff = recentAcc - prevAcc

  let status
  if (diff > 5) status = 'mejorando'
  else if (diff < -5) status = 'declinando'
  else status = 'estable'

  return { recentAcc: Math.round(recentAcc), prevAcc: Math.round(prevAcc), diff: Math.round(diff), status }
}

export async function calcOdorMastery(dogId) {
  const sessions = await getSessionsByDog(dogId)
  if (sessions.length === 0) return []

  const byOdor = {}
  for (const s of sessions) {
    if (!s.odor) continue
    byOdor[s.odor] = byOdor[s.odor] || { hits: 0, misses: 0, sessions: 0, lastDate: null }
    byOdor[s.odor].hits += s.hits || 0
    byOdor[s.odor].misses += s.misses || 0
    byOdor[s.odor].sessions++
    if (!byOdor[s.odor].lastDate || s.date > byOdor[s.odor].lastDate) {
      byOdor[s.odor].lastDate = s.date
    }
  }

  return Object.entries(byOdor)
    .map(([odor, data]) => {
      const total = data.hits + data.misses
      const acc = total > 0 ? Math.round((data.hits / total) * 100) : 0
      let level
      if (acc >= 90) level = 'dominado'
      else if (acc >= 70) level = 'avanzado'
      else if (acc >= 50) level = 'en progreso'
      else level = 'inicial'
      return { odor, ...data, accuracy: acc, level }
    })
    .sort((a, b) => a.accuracy - b.accuracy)
}

export async function generateRecommendations(dog, stats) {
  if (!stats || stats.sessions.length < 2) return ['Registra más sesiones para obtener recomendaciones personalizadas.']

  const reco = []
  const age = dog.age || 0
  const weight = dog.weight || 0
  const latest = stats.sessions.sort((a, b) => new Date(b.date) - new Date(a.date))

  const recentSessions = latest.slice(0, Math.min(5, latest.length))
  const recentHits = recentSessions.reduce((s, x) => s + (x.hits || 0), 0)
  const recentMisses = recentSessions.reduce((s, x) => s + (x.misses || 0), 0)
  const recentTotal = recentHits + recentMisses
  const recentAcc = recentTotal > 0 ? (recentHits / recentTotal) * 100 : 0

  if (age > 0 && age < 2) {
    reco.push('Perro joven: prioriza sesiones cortas (10-15 min) para evitar fatiga. Aumenta progresivamente.')
  } else if (age >= 7) {
    reco.push('Perro senior: reduce intensidad. Sesiones de mantenimiento con descansos frecuentes.')
  } else {
    reco.push('Edad óptima de trabajo. Mantén 3-4 sesiones por semana para rendimiento máximo.')
  }

  if (weight > 0) {
    if (weight < 20) {
      reco.push('Peso liviano: ideal para búsquedas en altura y espacios reducidos. Enfócate en agilidad.')
    } else if (weight > 40) {
      reco.push('Peso pesado: limita saltos y superficies inestables. Prioriza búsquedas en área abierta.')
    } else {
      reco.push('Peso equilibrado: versátil para todo tipo de búsqueda.')
    }
  }

  if (recentAcc < 50) {
    reco.push('Rendimiento bajo: vuelve a lo básico. Reduce distracciones y simplifica los blancos.')
  } else if (recentAcc < 70) {
    reco.push('Rendimiento moderado: aumenta la complejidad gradualmente. Varía posiciones de blancos.')
  } else if (recentAcc >= 90) {
    reco.push('Rendimiento excelente: introduce distracciones avanzadas y generalización de olores.')
  }

  if (stats.byOdor.length > 0) {
    const weakest = stats.byOdor.sort((a, b) => {
      const aTot = a.hits + a.misses
      const bTot = b.hits + b.misses
      const aAcc = aTot > 0 ? a.hits / aTot : 1
      const bAcc = bTot > 0 ? b.hits / bTot : 1
      return aAcc - bAcc
    })[0]
    reco.push(`Olor a reforzar: "${weakest.odor}". Dedica sesiones extras a este blanco específico.`)
  }

  const breedLower = dog.breed ? dog.breed.toLowerCase() : ''
  if (breedLower.includes('pastor')) {
    reco.push('Pastor: responde bien al trabajo estructurado. Establece rutinas claras.')
  } else if (breedLower.includes('labrador') || breedLower.includes('golden')) {
    reco.push('Retriever: motivación por juego. Usa recompensa lúdica para reforzar aciertos.')
  } else if (breedLower.includes('beagle') || breedLower.includes('bloodhound')) {
    reco.push('Sabueso: excelente olfato natural. Aprovecha para búsquedas de larga distancia.')
  } else if (breedLower.includes('spaniel')) {
    reco.push('Spaniel: energía alta. Sesiones dinámicas con cambios de terreno.')
  }

  return reco
}
