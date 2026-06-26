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
          tension: 0.4,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#64748b', font: { family: 'Inter' } } } },
        scales: {
          x: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 0, max: 100 }
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
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderColor: '#f59e0b',
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#64748b', font: { family: 'Inter' } } } },
        scales: {
          r: {
            ticks: { color: '#64748b', backdropColor: 'transparent', font: { family: 'Inter' } },
            grid: { color: 'rgba(255,255,255,0.04)' },
            min: 0, max: 100
          }
        }
      }
    })
  })
</script>

<div style="margin-bottom:20px">
  <button class="btn btn-sm" style="background:var(--surface2);color:var(--text2);border:1px solid var(--border);margin-bottom:16px" onclick={() => navigate('dogs')}>
    ← Volver a Perros
  </button>
</div>

{#if dog}
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div style="display:flex;align-items:center;gap:16px">
        <div class="dog-avatar" style="width:68px;height:68px;font-size:2.2rem">🐕</div>
        <div style="flex:1;min-width:0">
          <h2 style="margin:0;color:var(--accent);font-size:1.4rem">{dog.name}</h2>
          <p style="color:var(--text3);font-size:0.88rem;margin-top:4px">
            {dog.breed} · {dog.level} · {dog.specialty}
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
            {#if dog.age}<span class="badge badge-accent">📅 {dog.age} años</span>{/if}
            {#if dog.weight}<span class="badge badge-green">⚖️ {dog.weight} kg</span>{/if}
          </div>
        </div>
      </div>
      {#if dog.notes}
        <p style="color:var(--text3);font-size:0.85rem;margin-top:12px;line-height:1.6">{dog.notes}</p>
      {/if}
    </div>

    <div class="card">
      <h2>📊 Resumen de Rendimiento</h2>
      {#if stats}
        <div class="grid-3" style="margin-bottom:0">
          <div class="stat-card" style="padding:12px">
            <div class="stat-number" style="font-size:1.6rem">{stats.accuracy}%</div>
            <div class="stat-label">Precisión global</div>
          </div>
          <div class="stat-card" style="padding:12px">
            <div class="stat-number" style="font-size:1.6rem">{stats.totalSessions}</div>
            <div class="stat-label">Sesiones</div>
          </div>
          <div class="stat-card" style="padding:12px">
            <div class="stat-number-mono" style="font-size:1.3rem">{stats.totalHits}/{stats.totalAttempts}</div>
            <div class="stat-label">Aciertos</div>
          </div>
        </div>
      {:else}
        <p class="empty-state" style="padding:16px;font-size:0.85rem">Sin datos aún. Registra sesiones para ver rendimiento.</p>
      {/if}
    </div>
  </div>

  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <h2>📈 Tendencia de Precisión</h2>
      {#if trend}
        <div style="display:flex;gap:16px;align-items:center;margin-bottom:14px;flex-wrap:wrap">
          <span style="color:var(--text3);font-size:0.82rem">Anterior: <strong>{trend.prevAcc}%</strong></span>
          <span style="color:var(--text3);font-size:0.82rem">Reciente: <strong>{trend.recentAcc}%</strong></span>
          <span class="badge" class:badge-green={trend.status === 'mejorando'} class:badge-red={trend.status === 'declinando'} class:badge-accent={trend.status === 'estable'}>
            {#if trend.status === 'mejorando'}📈 Mejorando (+{trend.diff}%)
            {:else if trend.status === 'declinando'}📉 Declinando ({trend.diff}%)
            {:else}➡️ Estable ({trend.diff > 0 ? '+' : ''}{trend.diff}%){/if}
          </span>
        </div>
      {/if}
      {#if stats && stats.weekly.length >= 2}
        <div class="chart-container" style="height:220px">
          <canvas bind:this={trendCanvas}></canvas>
        </div>
      {:else}
        <p class="empty-state" style="padding:16px;font-size:0.82rem">Necesitas al menos 2 semanas de datos para ver la tendencia.</p>
      {/if}
    </div>

    <div class="card">
      <h2>🧠 Dominio de Olores</h2>
      {#if odorMastery.length > 0}
        <div class="chart-container" style="height:220px">
          <canvas bind:this={odorCanvas}></canvas>
        </div>
        <div style="margin-top:14px">
          {#each odorMastery as o}
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:0.85rem;border-bottom:1px solid var(--border)">
              <span style="color:var(--text2)">{o.odor}</span>
              <span>
                <span class="badge" class:badge-green={o.level === 'dominado'} class:badge-accent={o.level === 'avanzado'} class:badge-blue={o.level === 'en progreso'} class:badge-red={o.level === 'inicial'}>
                  {o.level} ({o.accuracy}%)
                </span>
              </span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="empty-state" style="padding:16px;font-size:0.82rem">Sin datos de olores aún.</p>
      {/if}
    </div>
  </div>

  <div class="card card-pro">
    <h2>💡 Recomendaciones Personalizadas</h2>
    <ul style="list-style:none;padding:0">
      {#each recommendations as r, i}
        <li style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:var(--text3);font-size:0.9rem;line-height:1.6;display:flex;gap:10px">
          <span style="flex-shrink:0;font-size:1.1rem">
            {#if r.includes('joven') || r.includes('senior') || r.includes('Edad')}🎯
            {:else if r.includes('Peso') || r.includes('liviano') || r.includes('pesado')}⚖️
            {:else if r.includes('bajo') || r.includes('moderado') || r.includes('excelente')}📊
            {:else if r.includes('reforzar')}🧠
            {:else if r.includes('Pastor') || r.includes('Retriever') || r.includes('Sabueso') || r.includes('Spaniel')}🐾
            {:else}💡
            {/if}
          </span>
          <span>{r}</span>
        </li>
      {/each}
    </ul>
  </div>
{/if}
