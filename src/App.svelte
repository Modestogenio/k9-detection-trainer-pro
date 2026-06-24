<script>
  import Header from './components/Header.svelte'
  import Dashboard from './components/Dashboard.svelte'
  import Dogs from './components/Dogs.svelte'
  import Sessions from './components/Sessions.svelte'
  import Stats from './components/Stats.svelte'

  let view = $state('dashboard')

  function navigate(v) { view = v }
</script>

<Header {view} {navigate} />

<main class="container">
  {#if view === 'dashboard'}
    <Dashboard />
  {:else if view === 'dogs'}
    <Dogs />
  {:else if view === 'sessions'}
    <Sessions />
  {:else if view === 'stats'}
    <Stats />
  {/if}
</main>
