<script>
  let { title, onclose, children } = $props()
</script>

<div class="modal-overlay" onclick={onclose} role="presentation">
  <div class="modal-box" onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1">
    <button class="modal-close" onclick={onclose}>&times;</button>
    <h2>{title}</h2>
    {@render children?.()}
  </div>
</div>
