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
              { label: 'Aciertos', data: stats.weekly.slice(-8).map(w => w.hits), backgroundColor: '#10b981', borderRadius: 4 },
              { label: 'Errores', data: stats.weekly.slice(-8).map(w => w.misses), backgroundColor: '#ef4444', borderRadius: 4 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
              x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
              y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' }, beginAtZero: true }
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
              backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right', labels: { color: '#94a3b8' } }
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
        <h3 style="font-size:0.9rem;margin-bottom:8px;color:var(--text2)">📈 Progreso semanal</h3>
        <div class="chart-container">
          <canvas bind:this={weeklyCanvas}></canvas>
        </div>
      </div>
    {/if}
    {#if stats.byOdor.length > 0}
      <div>
        <h3 style="font-size:0.9rem;margin-bottom:8px;color:var(--text2)">🎯 Precisión por olor</h3>
        <div class="chart-container">
          <canvas bind:this={odorCanvas}></canvas>
        </div>
      </div>
    {/if}
  </div>
{/if}
