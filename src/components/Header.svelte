<script>
  import { onMount } from 'svelte'

  let { view, navigate } = $props()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'dogs', label: 'Perros', icon: '🐕' },
    { id: 'sessions', label: 'Sesiones', icon: '📋' },
    { id: 'stats', label: 'Estadísticas', icon: '📈' }
  ]
</script>

<header>
  <div class="header-glow"></div>
  <div class="container header-content">
    <div class="header-brand">
      <div class="logo-wrapper">
        <span class="logo">🐕</span>
      </div>
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
          <span class="nav-icon">{item.icon}</span>
          {item.label}
        </button>
      {/each}
    </nav>
    <div class="sponsor-area">
      <a href="https://paypal.me/marcelocorales" target="_blank" class="btn btn-sm sponsor-btn sponsor-paypal">
        ☕ Donar
      </a>
      <a href="https://github.com/sponsors/Modestogenio" target="_blank" class="btn btn-sm sponsor-btn sponsor-gh">
        ⭐ Sponsor
      </a>
    </div>
  </div>
</header>

<style>
  header {
    background: var(--glass);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), rgba(139, 92, 246, 0.4), transparent);
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 12px 24px;
    flex-wrap: wrap;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }

  .logo { font-size: 1.5rem; }
  .header-brand h1 { font-size: 1.15rem; font-weight: 700; white-space: nowrap; letter-spacing: -0.02em; }

  .pro-tag {
    background: var(--pro-gradient);
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.6rem;
    font-weight: 800;
    vertical-align: super;
    margin-left: 3px;
    letter-spacing: 0.04em;
  }

  .subtitle { font-size: 0.68rem; color: var(--text3); display: block; letter-spacing: 0.03em; }

  nav { display: flex; gap: 4px; flex-wrap: wrap; flex: 1; justify-content: center; }

  .nav-btn {
    background: transparent;
    color: var(--text3);
    border: 1px solid transparent;
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.85rem;
    font-family: var(--font);
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav-icon { font-size: 1rem; }

  .nav-btn:hover {
    background: var(--surface2);
    color: var(--text);
    border-color: var(--border);
  }

  .nav-btn.active {
    background: rgba(245, 158, 11, 0.1);
    color: var(--accent);
    border-color: rgba(245, 158, 11, 0.2);
    font-weight: 600;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.05);
  }

  .sponsor-area { display: flex; gap: 8px; margin-left: auto; }

  .sponsor-btn { font-size: 0.78rem; padding: 6px 14px; border-radius: var(--radius-xs); }

  .sponsor-paypal {
    background: linear-gradient(135deg, #00457C, #0070BA);
    color: #fff;
    box-shadow: 0 2px 10px rgba(0, 69, 124, 0.3);
  }

  .sponsor-gh {
    background: var(--pro-gradient2);
    color: #fff;
    box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
  }

  @media (max-width: 700px) {
    .header-content { flex-direction: column; align-items: stretch; padding: 12px 16px; }
    .header-brand { justify-content: center; }
    .sponsor-area { margin-left: 0; justify-content: center; }
    nav { justify-content: center; }
  }
</style>
