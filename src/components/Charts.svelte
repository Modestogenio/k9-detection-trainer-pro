<script>
  import { onMount } from 'svelte'
  import Chart from 'chart.js/auto'

  let { stats } = $props()

  let weeklyCanvas = $state(null)
  let odorCanvas = $state(null)
  let weeklyChart = $state(null)
  let odorChart = $state(null)

  $effect(() => {
    if (weeklyCanvas) {
      if (weeklyChart) weeklyChart.destroy()
      if (stats.weekly.length > 0) {
        weeklyChart = new Chart(weeklyCanvas, {
          type: 'bar',
          data: {
            labels: stats.weekly.slice(-8).map(w => {
              const d = new Date(w.weekStart)
              return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            }),
            datasets: [
              { label: 'Aciertos', data: stats.weekly.slice(-8).map(w => w.hits), backgroundColor: 'rgba(16, 185, 129, 0.7)', borderColor: '#10b981', borderWidth: 1, borderRadius: 6 },
              { label: 'Errores', data: stats.weekly.slice(-8).map(w => w.misses), backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: '#ef4444', borderWidth: 1, borderRadius: 6 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#64748b', font: { family: 'Inter' } } } },
            scales: {
              x: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' } },
              y: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true }
            }
          }
        })
      }
    }
  })

  $effect(() => {
    if (odorCanvas) {
      if (odorChart) odorChart.destroy()
      if (stats.byOdor.length > 0) {
        odorChart = new Chart(odorCanvas, {
          type: 'doughnut',
          data: {
            labels: stats.byOdor.map(o => o.odor),
            datasets: [{
              data: stats.byOdor.map(o => o.hits + o.misses > 0 ? Math.round((o.hits / (o.hits + o.misses)) * 100) : 0),
              backgroundColor: ['rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(20, 184, 166, 0.8)', 'rgba(249, 115, 22, 0.8)'],
              borderColor: 'transparent',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
              legend: { position: 'right', labels: { color: '#64748b', font: { family: 'Inter' } } }
            }
          }
        })
      }
    }
  })
</script>

{#if stats.weekly.length > 0 || stats.byOdor.length > 0}
  <div class="grid-2" style="margin-bottom:0">
    {#if stats.weekly.length > 0}
      <div>
        <h3 style="font-size:0.85rem;margin-bottom:10px;color:var(--text3);font-weight:600;letter-spacing:0.02em;text-transform:uppercase">📈 Progreso semanal</h3>
        <div class="chart-container">
          <canvas bind:this={weeklyCanvas}></canvas>
        </div>
      </div>
    {/if}
    {#if stats.byOdor.length > 0}
      <div>
        <h3 style="font-size:0.85rem;margin-bottom:10px;color:var(--text3);font-weight:600;letter-spacing:0.02em;text-transform:uppercase">🎯 Precisión por olor</h3>
        <div class="chart-container">
          <canvas bind:this={odorCanvas}></canvas>
        </div>
      </div>
    {/if}
  </div>
{/if}
