<script>
  import { onMount } from 'svelte'
  import { getDog } from '../lib/db.js'
  import { calcDogStats, calcTrend, calcOdorMastery, generateRecommendations } from '../lib/stats.js'
  import Chart from 'chart.js/auto'

  let { dogId, navigate } = $props()

  let dog = $state(null)
  let stats = $state(null)
  let trend = $state(null)
  let odorMastery = $state([])
  let recommendations = $state([])
  let trendCanvas = $state(null)
  let odorCanvas = $state(null)
  let trendChart = $state(null)
  let odorChart = $state(null)

  onMount(async () => {
    dog = await getDog(dogId)
    stats = await calcDogStats(dogId)
    trend = await calcTrend(dogId)
    odorMastery = await calcOdorMastery(dogId)
    if (stats) recommendations = await generateRecommendations(dog, stats)
  })

  $effect(() => {
    if (!trendCanvas || !stats || stats.weekly.length < 2) return
    if (trendChart) trendChart.destroy()
    trendChart = new Chart(trendCanvas, {
      type: 'line',
      data: {
        labels: stats.weekly.slice(-10).map(w => {
          const d = new Date(w.weekStart)
          return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }),
        datasets: [{
          label: 'Precisión %',
          data: stats.weekly.slice(-10).map(w => {
            const t = w.hits + w.misses
            return t > 0 ? Math.round((w.hits / t) * 100) : 0
          }),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#f59e0b'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' }, min: 0, max: 100 }
        }
      }
    })
  })

  $effect(() => {
    if (!odorCanvas || odorMastery.length === 0) return
    if (odorChart) odorChart.destroy()
    odorChart = new Chart(odorCanvas, {
      type: 'radar',
      data: {
        labels: odorMastery.map(o => o.odor),
        datasets: [{
          label: 'Precisión por olor',
          data: odorMastery.map(o => o.accuracy),
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          borderColor: '#f59e0b',
          pointBackgroundColor: '#f59e0b'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          r: { ticks: { color: '#94a3b8', backdropColor: 'transparent' }, grid: { color: '#334155' }, min: 0, max: 100 }
        }
      }
    })
  })
</script>

<div style="margin-bottom:16px">
  <button class="btn btn-sm" style="background:var(--surface2);color:var(--text)" onclick={() => navigate('dogs')}>
    ← Volver a Perros
  </button>
</div>

{#if dog}
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="dog-avatar" style="width:64px;height:64px;font-size:2rem">🐕</div>
        <div>
          <h2 style="margin:0;color:var(--accent)">{dog.name}</h2>
          <p style="color:var(--text2);font-size:0.9rem">
            {dog.breed} · {dog.level} · {dog.specialty}
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
            {#if dog.age}<span class="badge badge-accent">📅 {dog.age} años</span>{/if}
            {#if dog.weight}<span class="badge badge-green">⚖️ {dog.weight} kg</span>{/if}
          </div>
        </div>
      </div>
      {#if dog.notes}
        <p style="color:var(--text2);font-size:0.85rem;margin-top:8px">{dog.notes}</p>
      {/if}
    </div>

    <div class="card">
      <h2>📊 Resumen de Rendimiento</h2>
      {#if stats}
        <div class="grid-3" style="margin-bottom:0">
          <div class="stat-card" style="padding:10px">
            <div class="stat-number" style="font-size:1.5rem">{stats.accuracy}%</div>
            <div class="stat-label">Precisión global</div>
          </div>
          <div class="stat-card" style="padding:10px">
            <div class="stat-number" style="font-size:1.5rem">{stats.totalSessions}</div>
            <div class="stat-label">Sesiones</div>
          </div>
          <div class="stat-card" style="padding:10px">
            <div class="stat-number" style="font-size:1.5rem">{stats.totalHits}/{stats.totalAttempts}</div>
            <div class="stat-label">Aciertos</div>
          </div>
        </div>
      {:else}
        <p class="empty-state" style="padding:16px">Sin datos aún. Registra sesiones para ver rendimiento.</p>
      {/if}
    </div>
  </div>

  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <h2>📈 Tendencia de Precisión</h2>
      {#if trend}
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap">
          <span style="color:var(--text2);font-size:0.85rem">
            Anterior: <strong>{trend.prevAcc}%</strong>
          </span>
          <span style="color:var(--text2);font-size:0.85rem">
            Reciente: <strong>{trend.recentAcc}%</strong>
          </span>
          <span class="badge" class:badge-green={trend.status === 'mejorando'} class:badge-red={trend.status === 'declinando'} class:badge-accent={trend.status === 'estable'}>
            {#if trend.status === 'mejorando'}📈 Mejorando (+{trend.diff}%)
            {:else if trend.status === 'declinando'}📉 Declinando ({trend.diff}%)
            {:else}➡️ Estable ({trend.diff > 0 ? '+' : ''}{trend.diff}%){/if}
          </span>
        </div>
      {/if}
      {#if stats && stats.weekly.length >= 2}
        <div class="chart-container" style="height:200px">
          <canvas bind:this={trendCanvas}></canvas>
        </div>
      {:else}
        <p class="empty-state" style="padding:16px;font-size:0.85rem">Necesitas al menos 2 semanas de datos para ver la tendencia.</p>
      {/if}
    </div>

    <div class="card">
      <h2>🧠 Dominio de Olores</h2>
      {#if odorMastery.length > 0}
        <div class="chart-container" style="height:200px">
          <canvas bind:this={odorCanvas}></canvas>
        </div>
        <div style="margin-top:10px">
          {#each odorMastery as o}
            <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:0.85rem">
              <span>{o.odor}</span>
              <span>
                <span class="badge" class:badge-green={o.level === 'dominado'} class:badge-accent={o.level === 'avanzado'} class:badge-red={o.level === 'inicial'}>
                  {o.level} ({o.accuracy}%)
                </span>
              </span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="empty-state" style="padding:16px;font-size:0.85rem">Sin datos de olores aún.</p>
      {/if}
    </div>
  </div>

  <div class="card card-pro">
    <h2>💡 Recomendaciones Personalizadas</h2>
    <ul style="list-style:none;padding:0">
      {#each recommendations as r, i}
        <li style="padding:8px 0;border-bottom:1px solid var(--surface2);color:var(--text2);font-size:0.9rem">
          {#if r.includes('joven') || r.includes('senior') || r.includes('Edad')}
            🎯
          {:else if r.includes('Peso') || r.includes('liviano') || r.includes('pesado')}
            ⚖️
          {:else if r.includes('bajo') || r.includes('moderado') || r.includes('excelente')}
            📊
          {:else if r.includes('reforzar')}
            🧠
          {:else if r.includes('Pastor') || r.includes('Retriever') || r.includes('Sabueso') || r.includes('Spaniel')}
            🐾
          {:else}
            💡
          {/if}
          {r}
        </li>
      {/each}
    </ul>
  </div>
{/if}