<script>
  import { onMount } from 'svelte'
  import { getAllDogs, getRecentSessions, getDog } from '../lib/db.js'
  import { calcOverall } from '../lib/stats.js'

  let dogs = $state([])
  let recent = $state([])
  let overall = $state({ totalDogs: 0, totalSessions: 0, accuracy: 0 })

  onMount(async () => {
    dogs = await getAllDogs()
    recent = await getRecentSessions(5)
    overall = await calcOverall()
  })
</script>

<div class="grid-3">
  <div class="card stat-card">
    <div class="stat-number">{overall.totalDogs}</div>
    <div class="stat-label">Perros registrados</div>
  </div>
  <div class="card stat-card">
    <div class="stat-number">{overall.totalSessions}</div>
    <div class="stat-label">Sesiones totales</div>
  </div>
  <div class="card stat-card">
    <div class="stat-number">{overall.accuracy}%</div>
    <div class="stat-label">Precisión general</div>
  </div>
</div>

<div class="card card-pro" style="text-align:center">
  <p style="font-size:0.9rem;color:var(--text2);max-width:600px;margin:0 auto;line-height:1.7">
    <strong style="color:var(--accent)">K9 Detection Trainer Pro</strong>
    — App instalable en tu celular, gráficos avanzados, exportación PDF y agente AI de entrenamiento.
  </p>
  <div style="margin-top:14px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    <a href="https://github.com/sponsors/Modestogenio" target="_blank" class="btn btn-pro">
      ⭐ Hacerse sponsor desde $3/mes
    </a>
    <a href="https://paypal.me/marcelocorales" target="_blank" class="btn btn-success">
      ☕ Donación única
    </a>
  </div>
</div>

<div class="grid-2">
  <div class="card">
    <h2>🐕 Mis Perros</h2>
    {#if dogs.length === 0}
      <div class="empty-state">
        <p>No hay perros registrados</p>
        <p style="font-size:0.85rem;color:var(--text3)">Comienza añadiendo tu primer perro detector.</p>
      </div>
    {:else}
      {#each dogs as dog}
        {@const total = dog.hits + dog.misses}
        {@const acc = total > 0 ? Math.round((dog.hits / total) * 100) : 0}
        <div class="dog-row" onclick={() => window.dispatchEvent(new CustomEvent('viewDog', { detail: dog.id }))} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && window.dispatchEvent(new CustomEvent('viewDog', { detail: dog.id }))}>
          <div class="dog-avatar">🐕</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <strong>{dog.name}</strong>
              <span class="badge badge-accent">{dog.level}</span>
            </div>
            <div style="color:var(--text3);font-size:0.82rem;margin-top:2px">{dog.breed} · {dog.specialty}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div class="stat-number-mono" style="font-size:1.3rem">{acc}%</div>
            <div style="font-size:0.7rem;color:var(--text3);letter-spacing:0.02em">{dog.totalSessions} sesiones</div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:{acc}%"></div>
        </div>
      {/each}
    {/if}
  </div>

  <div class="card">
    <h2>📋 Últimas Sesiones</h2>
    {#if recent.length === 0}
      <div class="empty-state">
        <p>No hay sesiones aún</p>
      </div>
    {:else}
      <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Perro</th><th>Tipo</th><th>Olor</th><th>Resultado</th><th>Fecha</th></tr></thead>
          <tbody>
            {#each recent as s}
              <tr>
                <td><strong>{s.dogName || '?'}</strong></td>
                <td>{s.sessionType}</td>
                <td><span class="badge badge-accent">{s.odor}</span></td>
                <td>{s.hits || 0}/{(s.hits || 0) + (s.misses || 0)}</td>
                <td style="color:var(--text3);font-size:0.82rem">{new Date(s.date).toLocaleDateString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .dog-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.3s ease;
  }
  .dog-row:hover {
    background: var(--surface-hover);
    padding: 10px 14px;
    margin: 0 -14px;
  }
</style>
