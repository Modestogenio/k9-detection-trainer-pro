<script>
  import Header from './components/Header.svelte'
  import Dashboard from './components/Dashboard.svelte'
  import Dogs from './components/Dogs.svelte'
  import Sessions from './components/Sessions.svelte'
  import Stats from './components/Stats.svelte'
  import DogDashboard from './components/DogDashboard.svelte'

  let view = $state('dashboard')
  let selectedDogId = $state(null)

  function navigate(v, dogId) {
    view = v
    if (dogId !== undefined) selectedDogId = dogId
  }
</script>

<Header {view} {navigate} />

<main class="container">
  {#if view === 'dashboard'}
    <Dashboard />
  {:else if view === 'dogs'}
    <Dogs {navigate} />
  {:else if view === 'sessions'}
    <Sessions />
  {:else if view === 'stats'}
    <Stats />
  {:else if view === 'dog-dashboard' && selectedDogId}
    <DogDashboard dogId={selectedDogId} {navigate} />
  {/if}
</main>
