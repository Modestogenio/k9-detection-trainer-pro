<script>
  import { onMount } from 'svelte'
  import { getAllSessions, getAllDogs, addSession, deleteSession, getDog, SESSION_TYPES, ODOR_TYPES, SESSION_RATINGS } from '../lib/db.js'
  import Modal from './Modal.svelte'

  let sessions = $state([])
  let dogs = $state([])
  let showModal = $state(false)
  let form = $state({ dogId: '', date: '', sessionType: 'libre olfativa', odor: 'explosivos', hits: 0, misses: 0, rating: 'bueno', notes: '' })

  onMount(async () => {
    dogs = await getAllDogs()
    sessions = await getAllSessions()
  })

  async function refresh() {
    sessions = await getAllSessions()
    dogs = await getAllDogs()
  }

  function openAdd() {
    if (dogs.length === 0) { alert('Primero registra un perro.'); return }
    form = { dogId: dogs[0].id, date: new Date().toISOString().split('T')[0], sessionType: 'libre olfativa', odor: 'explosivos', hits: 0, misses: 0, rating: 'bueno', notes: '' }
    showModal = true
  }

  function openForDog(dogId) {
    if (dogs.length === 0) { alert('Primero registra un perro.'); return }
    form = { dogId, date: new Date().toISOString().split('T')[0], sessionType: 'libre olfativa', odor: 'explosivos', hits: 0, misses: 0, rating: 'bueno', notes: '' }
    showModal = true
  }

  async function handleSubmit() {
    const f = { ...form, hits: Number(form.hits), misses: Number(form.misses) }
    const dog = dogs.find(d => d.id === f.dogId)
    f.dogName = dog ? dog.name : '?'
    await addSession(f)
    showModal = false
    await refresh()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta sesión?')) return
    await deleteSession(id)
    await refresh()
  }
</script>

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
  <h2>📋 Sesiones de Entrenamiento</h2>
  <button class="btn btn-primary" onclick={openAdd}>+ Nueva Sesión</button>
</div>

{#if sessions.length === 0}
  <div class="card empty-state">
    <p>No hay sesiones registradas.</p>
    <button class="btn btn-primary" onclick={openAdd}>+ Registrar primera sesión</button>
  </div>
{:else}
  <div class="card" style="overflow-x:auto">
    <table>
      <thead>
        <tr><th>Fecha</th><th>Perro</th><th>Tipo</th><th>Olor</th><th>Aciertos</th><th>Rating</th><th></th></tr>
      </thead>
      <tbody>
        {#each sessions as s}
          <tr>
            <td>{new Date(s.date).toLocaleDateString()}</td>
            <td><strong>{s.dogName || '?'}</strong></td>
            <td>{s.sessionType}</td>
            <td><span class="badge badge-accent">{s.odor}</span></td>
            <td>{s.hits || 0}/{(s.hits || 0) + (s.misses || 0)}</td>
            <td><span class="badge" class:badge-green={s.rating === 'excelente'} class:badge-accent={s.rating === 'bueno'} class:badge-red={s.rating === 'deficiente'}>{s.rating}</span></td>
            <td><button class="btn btn-sm btn-danger" onclick={() => handleDelete(s.id)}>✕</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<!-- New Session Modal -->
{#if showModal}
  <Modal title="Nueva Sesión" onclose={() => showModal = false}>
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <div class="form-group">
        <label>Perro</label>
        <select bind:value={form.dogId}>
          {#each dogs as d}<option value={d.id}>{d.name}</option>{/each}
        </select>
      </div>
      <div class="form-group">
        <label>Fecha</label>
        <input bind:value={form.date} type="date" required>
      </div>
      <div class="form-group">
        <label>Tipo de sesión</label>
        <select bind:value={form.sessionType}>
          {#each SESSION_TYPES as t}<option value={t}>{t}</option>{/each}
        </select>
      </div>
      <div class="form-group">
        <label>Olor/Blanco</label>
        <select bind:value={form.odor}>
          {#each ODOR_TYPES as o}<option value={o}>{o}</option>{/each}
        </select>
      </div>
      <div class="grid-2" style="margin-bottom:0">
        <div class="form-group">
          <label>Aciertos</label>
          <input bind:value={form.hits} type="number" min="0" required>
        </div>
        <div class="form-group">
          <label>Errores</label>
          <input bind:value={form.misses} type="number" min="0" required>
        </div>
      </div>
      <div class="form-group">
        <label>Rating</label>
        <select bind:value={form.rating}>
          {#each SESSION_RATINGS as r}<option value={r}>{r}</option>{/each}
        </select>
      </div>
      <div class="form-group">
        <label>Notas</label>
        <textarea bind:value={form.notes} placeholder="Condiciones, comportamiento, novedades..."></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">Guardar Sesión</button>
    </form>
  </Modal>
{/if}
