<script>
  let { view, navigate } = $props()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'dogs', label: 'Perros', icon: '🐕' },
    { id: 'sessions', label: 'Sesiones', icon: '📋' },
    { id: 'stats', label: 'Estadísticas', icon: '📈' }
  ]
</script>

<header>
  <div class="container header-content">
    <div class="header-brand">
      <span class="logo">🐕</span>
      <div>
        <h1>K9 Trainer <span class="pro-tag">PRO</span></h1>
        <span class="subtitle">Detection Dog Training</span>
      </div>
    </div>
    <nav>
      {#each navItems as item}
        <button
          class="nav-btn"
          class:active={view === item.id}
          onclick={() => navigate(item.id)}
        >
          {item.icon} {item.label}
        </button>
      {/each}
    </nav>
    <div class="sponsor-area">
      <a href="https://paypal.me/marcelocorales" target="_blank" class="btn btn-sm sponsor-paypal">
        ☕ Donar
      </a>
      <a href="https://github.com/sponsors/Modestogenio" target="_blank" class="btn btn-sm sponsor-gh">
        ⭐ Sponsor
      </a>
    </div>
  </div>
</header>

<style>
  header {
    background: var(--surface); border-bottom: 1px solid var(--surface2);
    position: sticky; top: 0; z-index: 100;
  }
  .header-content {
    display: flex; align-items: center; gap: 16px; padding: 10px 20px; flex-wrap: wrap;
  }
  .header-brand { display: flex; align-items: center; gap: 10px; }
  .logo { font-size: 1.8rem; }
  .header-brand h1 { font-size: 1.2rem; white-space: nowrap; }
  .pro-tag {
    background: var(--pro-gradient); color: #fff; padding: 1px 6px;
    border-radius: 4px; font-size: 0.65rem; vertical-align: super; margin-left: 2px;
  }
  .subtitle { font-size: 0.7rem; color: var(--text2); display: block; }
  nav { display: flex; gap: 4px; flex-wrap: wrap; flex: 1; justify-content: center; }
  .nav-btn {
    background: transparent; color: var(--text2); border: 1px solid transparent;
    padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem;
    transition: all 0.2s; white-space: nowrap;
  }
  .nav-btn:hover { background: var(--surface2); color: var(--text); }
  .nav-btn.active { background: var(--accent); color: #000; border-color: var(--accent); font-weight: 600; }
  .sponsor-area { display: flex; gap: 6px; margin-left: auto; }
  .sponsor-paypal { background: #00457C; color: #fff !important; }
  .sponsor-gh { background: #ea4aaa; color: #fff !important; }
  @media (max-width: 600px) {
    .header-content { flex-direction: column; align-items: stretch; }
    .sponsor-area { margin-left: 0; justify-content: center; }
    nav { justify-content: center; }
  }
</style>
