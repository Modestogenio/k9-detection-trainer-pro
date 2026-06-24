<script>
  import { onMount } from 'svelte'
  import { getAllDogs, deleteDog, DOG_BREEDS, DOG_LEVELS, DOG_SPECIALTIES, addDog, updateDog, getDog } from '../lib/db.js'
  import Modal from './Modal.svelte'

  let dogs = $state([])
  let showModal = $state(false)
  let editing = $state(null)
  let form = $state({ name: '', breed: 'Pastor Belga Malinois', level: 'básico', specialty: 'explosivos', age: '', notes: '' })
  let dogDetail = $state(null)

  onMount(async () => { dogs = await getAllDogs() })

  async function refresh() { dogs = await getAllDogs() }

  function openAdd() {
    editing = null
    form = { name: '', breed: 'Pastor Belga Malinois', level: 'básico', specialty: 'explosivos', age: '', notes: '' }
    showModal = true
  }

  function openEdit(dog) {
    editing = dog.id
    form = { name: dog.name, breed: dog.breed, level: dog.level, specialty: dog.specialty, age: dog.age || '', notes: dog.notes || '' }
    showModal = true
  }

  async function handleSubmit() {
    if (editing) {
      await updateDog(editing, form)
    } else {
      await addDog({ ...form, age: form.age ? Number(form.age) : null })
    }
    showModal = false
    await refresh()
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este perro y todas sus sesiones?')) return
    await deleteDog(id)
    dogDetail = null
    await refresh()
  }

  async function viewDetail(id) {
    const d = await getDog(id)
    const { calcDogStats } = await import('../lib/stats.js')
    const stats = await calcDogStats(id)
    dogDetail = { dog: d, stats }
  }

  async function exportDogPDF(id) {
    const d = await getDog(id)
    const { calcDogStats } = await import('../lib/stats.js')
    const stats = await calcDogStats(id)
    const { default: jsPDF } = await import('jspdf')

    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text(`K9 Reporte: ${d.name}`, 20, 30)
    doc.setFontSize(12)
    doc.text(`Raza: ${d.breed}  |  Nivel: ${d.level}  |  Especialidad: ${d.specialty}`, 20, 45)
    if (stats) {
      doc.text(`Precisión: ${stats.accuracy}%`, 20, 60)
      doc.text(`Sesiones: ${stats.sessions.length}`, 20, 70)
      doc.text(`Aciertos: ${stats.totalHits}  |  Errores: ${stats.totalMisses}`, 20, 80)
    }
    doc.save(`${d.name}-reporte-k9.pdf`)
  }
</script>

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
  <h2>🐕 Perros Registrados</h2>
  <button class="btn btn-primary" onclick={openAdd}>+ Añadir Perro</button>
</div>

{#if dogs.length === 0}
  <div class="card empty-state">
    <p>Aún no has registrado ningún perro detector.</p>
    <p style="font-size:0.85rem">Comienza añadiendo tu primer perro.</p>
    <button class="btn btn-primary" onclick={openAdd}>+ Añadir Perro</button>
  </div>
{:else}
  {#each dogs as dog}
    {@const total = dog.hits + dog.misses}
    {@const acc = total > 0 ? Math.round((dog.hits / total) * 100) : 0}
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="dog-avatar">🐕</div>
        <div style="flex:1">
          <strong style="font-size:1.1rem">{dog.name}</strong>
          <span class="badge badge-accent" style="margin-left:6px">{dog.level}</span>
          <span class="badge badge-pro" style="margin-left:4px">{dog.specialty}</span><br>
          <span style="color:var(--text2);font-size:0.85rem">{dog.breed}{dog.age ? ` · ${dog.age} años` : ''}</span>
        </div>
        <div style="text-align:right">
          <div style="font-size:1.3rem;font-weight:700;color:var(--accent)">{acc}%</div>
          <div style="font-size:0.75rem;color:var(--text2)">{dog.totalSessions} sesiones</div>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:{acc}%"></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm btn-info" onclick={() => viewDetail(dog.id)}>📖 Ver</button>
        <button class="btn btn-sm btn-primary" onclick={() => openEdit(dog)}>✏️ Editar</button>
        <button class="btn btn-sm btn-pro" onclick={() => exportDogPDF(dog.id)}>📄 PDF</button>
        <button class="btn btn-sm btn-danger" onclick={() => handleDelete(dog.id)}>🗑️</button>
      </div>
    </div>
  {/each}
{/if}

<!-- Dog Detail Modal -->
{#if dogDetail}
  <div class="modal-overlay" onclick={() => dogDetail = null} role="presentation">
    <div class="modal-box" onclick={(e) => e.stopPropagation()} role="dialog">
      <button class="modal-close" onclick={() => dogDetail = null}>&times;</button>
      <h2>🐕 {dogDetail.dog.name}</h2>
      {#if dogDetail.stats}
        {@const s = dogDetail.stats}
        <div class="grid-3">
          <div class="stat-card" style="padding:12px">
            <div class="stat-number">{s.accuracy}%</div>
            <div class="stat-label">Precisión</div>
          </div>
          <div class="stat-card" style="padding:12px">
            <div class="stat-number">{s.sessions.length}</div>
            <div class="stat-label">Sesiones</div>
          </div>
          <div class="stat-card" style="padding:12px">
            <div class="stat-number">{s.totalHits}/{s.totalAttempts}</div>
            <div class="stat-label">Aciertos</div>
          </div>
        </div>
      {/if}
      <p style="color:var(--text2);font-size:0.9rem">
        {dogDetail.dog.breed} · {dogDetail.dog.level} · {dogDetail.dog.specialty}
        {dogDetail.dog.notes ? `<br>${dogDetail.dog.notes}` : ''}
      </p>
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn btn-sm btn-pro" onclick={() => exportDogPDF(dogDetail.dog.id)}>📄 Exportar PDF</button>
        <button class="btn btn-sm btn-danger" onclick={() => { handleDelete(dogDetail.dog.id); dogDetail = null }}>🗑️ Eliminar</button>
      </div>
    </div>
  </div>
{/if}

<!-- Add/Edit Modal -->
{#if showModal}
  <Modal title={editing ? 'Editar Perro' : 'Añadir Perro'} onclose={() => showModal = false}>
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <div class="form-group">
        <label>Nombre</label>
        <input bind:value={form.name} required placeholder="Ej: Rocky">
      </div>
      <div class="form-group">
        <label>Raza</label>
        <select bind:value={form.breed}>
          {#each DOG_BREEDS as b}<option value={b}>{b}</option>{/each}
        </select>
      </div>
      <div class="form-group">
        <label>Nivel</label>
        <select bind:value={form.level}>
          {#each DOG_LEVELS as l}<option value={l}>{l}</option>{/each}
        </select>
      </div>
      <div class="form-group">
        <label>Especialidad</label>
        <select bind:value={form.specialty}>
          {#each DOG_SPECIALTIES as s}<option value={s}>{s}</option>{/each}
        </select>
      </div>
      <div class="form-group">
        <label>Edad (años)</label>
        <input bind:value={form.age} type="number" min="0" step="0.5" placeholder="Ej: 3">
      </div>
      <div class="form-group">
        <label>Notas</label>
        <textarea bind:value={form.notes} placeholder="Características, observaciones..."></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">
        {editing ? 'Guardar Cambios' : 'Añadir Perro'}
      </button>
    </form>
  </Modal>
{/if}
