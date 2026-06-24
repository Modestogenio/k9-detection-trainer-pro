<script>
  import { onMount } from 'svelte'
  import { getAllDogs } from '../lib/db.js'
  import { calcOverall, calcDogStats } from '../lib/stats.js'
  import Charts from './Charts.svelte'

  let dogs = $state([])
  let overall = $state({ totalDogs: 0, totalSessions: 0, accuracy: 0 })
  let dogStatsMap = $state({})

  onMount(async () => {
    dogs = await getAllDogs()
    overall = await calcOverall()

    const map = {}
    for (const d of dogs) {
      map[d.id] = await calcDogStats(d.id)
    }
    dogStatsMap = map
  })

  async function exportOverallPDF() {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    doc.setFontSize(22)
    doc.text('K9 Detection Trainer - Reporte General', 20, 30)
    doc.setFontSize(14)
    doc.text(`Perros: ${overall.totalDogs}`, 20, 50)
    doc.text(`Sesiones totales: ${overall.totalSessions}`, 20, 65)
    doc.text(`Precisión global: ${overall.accuracy}%`, 20, 80)
    doc.text(`Aciertos: ${overall.totalHits}`, 20, 95)
    doc.text(`Errores: ${overall.totalMisses}`, 20, 110)

    let y = 130
    for (const d of dogs) {
      const s = dogStatsMap[d.id]
      if (!s) continue
      if (y > 250) { doc.addPage(); y = 30 }
      doc.setFontSize(12)
      doc.text(`${d.name} - Precisión: ${s.accuracy}% - Sesiones: ${s.sessions.length}`, 20, y)
      y += 10
    }
    doc.save('k9-reporte-general.pdf')
  }
</script>

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
  <h2>📊 Estadísticas Pro</h2>
  <button class="btn btn-pro" onclick={exportOverallPDF}>📄 Exportar PDF General</button>
</div>

<div class="grid-3">
  <div class="card stat-card">
    <div class="stat-number">{overall.totalDogs}</div>
    <div class="stat-label">Perros</div>
  </div>
  <div class="card stat-card">
    <div class="stat-number">{overall.totalSessions}</div>
    <div class="stat-label">Sesiones totales</div>
  </div>
  <div class="card stat-card">
    <div class="stat-number">{overall.accuracy}%</div>
    <div class="stat-label">Precisión global</div>
  </div>
</div>

<div class="card card-pro" style="text-align:center">
  <h3 style="color:var(--accent)">🤖 Agente AI Training Coach</h3>
  <p style="color:var(--text2);font-size:0.9rem;margin:8px 0">
    Los sponsors Pro obtienen planes de entrenamiento personalizados generados por IA (DeepSeek V4 Flash + Ollama).
  </p>
  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
    <a href="https://github.com/sponsors/Modestogenio" target="_blank" class="btn btn-pro">⭐ Sponsor Pro $10/mes</a>
    <a href="https://paypal.me/marcelocorales" target="_blank" class="btn btn-success">☕ Donar</a>
  </div>
</div>

{#each dogs as dog}
  {@const stats = dogStatsMap[dog.id]}
  {#if stats}
    {@const total = dog.hits + dog.misses}
    {@const acc = total > 0 ? Math.round((dog.hits / total) * 100) : 0}
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div class="dog-avatar">🐕</div>
        <div style="flex:1">
          <strong style="font-size:1.1rem">{dog.name}</strong>
          <span class="badge badge-accent" style="margin-left:6px">{dog.level}</span>
        </div>
        <div style="text-align:right">
          <span style="font-size:1.5rem;font-weight:700;color:var(--accent)">{acc}%</span>
          <div style="font-size:0.75rem;color:var(--text2)">{dog.totalSessions} sesiones</div>
        </div>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:{acc}%"></div></div>

      <div style="display:flex;gap:16px;margin:12px 0;font-size:0.85rem;color:var(--text2)">
        <span>✅ {stats.totalHits} aciertos</span>
        <span>❌ {stats.totalMisses} errores</span>
        <span>📊 {stats.totalAttempts} intentos</span>
      </div>

      <Charts {stats} />
    </div>
  {/if}
{/each}

{#if dogs.length === 0}
  <div class="card empty-state">
    <p>Registra perros y sesiones para ver estadísticas avanzadas.</p>
  </div>
{/if}
