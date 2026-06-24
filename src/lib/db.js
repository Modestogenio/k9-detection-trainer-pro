import Dexie from 'dexie'

const db = new Dexie('K9ProDB')

db.version(1).stores({
  dogs: '++id, name, breed, level, specialty, created',
  sessions: '++id, dogId, date, sessionType, odor, rating'
})

export const dogsTable = db.dogs
export const sessionsTable = db.sessions

export async function addDog(data) {
  data.created = new Date().toISOString()
  data.totalSessions = 0
  data.hits = 0
  data.misses = 0
  return await dogsTable.add(data)
}

export async function updateDog(id, data) {
  return await dogsTable.update(id, data)
}

export async function deleteDog(id) {
  await sessionsTable.where('dogId').equals(id).delete()
  return await dogsTable.delete(id)
}

export async function getAllDogs() {
  return await dogsTable.toArray()
}

export async function getDog(id) {
  return await dogsTable.get(id)
}

export async function addSession(data) {
  data.created = new Date().toISOString()
  const id = await sessionsTable.add(data)
  await recalcDogStats(data.dogId)
  return id
}

export async function deleteSession(id) {
  const session = await sessionsTable.get(id)
  await sessionsTable.delete(id)
  if (session) await recalcDogStats(session.dogId)
}

export async function getSessionsByDog(dogId) {
  return await sessionsTable
    .where('dogId').equals(dogId)
    .reverse()
    .sortBy('date')
}

export async function getAllSessions() {
  return await sessionsTable.reverse().toArray()
}

export async function getRecentSessions(limit = 10) {
  const all = await sessionsTable.reverse().toArray()
  return all.slice(0, limit)
}

async function recalcDogStats(dogId) {
  const sessions = await sessionsTable.where('dogId').equals(dogId).toArray()
  const dog = await dogsTable.get(dogId)
  if (!dog) return
  const hits = sessions.reduce((sum, s) => sum + (s.hits || 0), 0)
  const misses = sessions.reduce((sum, s) => sum + (s.misses || 0), 0)
  await dogsTable.update(dogId, {
    totalSessions: sessions.length,
    hits,
    misses,
    lastSession: sessions.length > 0
      ? sessions.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
      : null
  })
}

export const DOG_LEVELS = ['básico', 'intermedio', 'avanzado', 'experto']
export const DOG_SPECIALTIES = ['explosivos', 'narcóticos', 'búsqueda', 'armas', 'divisas', 'multiespecialidad']
export const DOG_BREEDS = [
  'Pastor Alemán', 'Pastor Belga Malinois', 'Labrador Retriever',
  'Golden Retriever', 'Springer Spaniel', 'Bloodhound', 'Beagle',
  'Cocker Spaniel', 'Otra'
]
export const SESSION_TYPES = [
  'libre olfativa', 'alineación', 'búsqueda en vehículo',
  'búsqueda en área', 'búsqueda en edificio', 'bodega/equipaje',
  'mantenimiento', 'evaluación'
]
export const ODOR_TYPES = [
  'explosivos', 'narcóticos', 'búsqueda personas', 'armas',
  'divisas', 'acelerantes', 'tabaco', 'multiolor'
]
export const SESSION_RATINGS = ['excelente', 'bueno', 'regular', 'deficiente']
