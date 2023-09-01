<script>
  export let size = '50px';
  export let color = '#333';
  export let image = '';
</script>

<div class="spinner-container" style="--size: {size}; --color: {color};">
  <div class="spinner" />
  {#if image}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={image} alt="Image" class="image" />
  {/if}
</div>

<style>
  .spinner-container {
    position: relative;
    width: var(--size);
    height: var(--size);
    margin: auto;
  }

  .spinner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    animation: spin 1s linear infinite;
    border: 2px solid var(--color);
    border-top: 2px solid transparent;
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  .image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 50%;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
