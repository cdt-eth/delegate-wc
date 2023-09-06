<script lang="ts">
  import { writable } from 'svelte/store';
  import { defaultState, metamaskStateStore } from './stores/MetamaskStore';

  export let size = '50px';
  export let color = '#1A88F8';
  export let image = '';
  export let showSpinner = true;
  export let errorCircle = false;
  export let connectWallet: (index: number) => void;

  const hideErrorCircle = writable(false);
  const showRetryButton = writable(false);

  function handleAnimationEnd(event: { animationName: string | string[] }) {
    if (event.animationName.includes('shake')) {
      hideErrorCircle.set(true);
    }
  }

  function handleErrorFadeOut(event: { propertyName: string }) {
    if (event.propertyName === 'opacity' && $hideErrorCircle) {
      showRetryButton.set(true);
    }
  }

  function resetMetamaskState() {
    metamaskStateStore.set(defaultState);
    hideErrorCircle.set(false);
    showRetryButton.set(false);
    connectWallet(0);
  }
</script>

<div
  class={`spinner-container ${errorCircle ? 'shake' : ''}`}
  style="--size: {size}; --color: {color};"
  on:animationend={handleAnimationEnd}
>
  {#if showSpinner}
    <div class="spinner" />
  {/if}
  {#if errorCircle}
    <div class={`error ${$hideErrorCircle ? 'hide' : ''}`} on:transitionend={handleErrorFadeOut} />
  {/if}
  {#if $showRetryButton}
    <button on:click={resetMetamaskState}>Retry Connection</button>
  {/if}
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

  :is(.spinner, .error) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
  .spinner {
    border: 2px solid var(--color);
    border-top: 2px solid transparent;
    animation: spin 1s linear infinite;
  }
  .error {
    border: 3px solid red;
    transition: opacity 0.5s ease-out;
  }
  .spinner-container.shake {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  .image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 75%;
    height: 75%;
  }
  .hide {
    opacity: 0;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes shake {
    10%,
    90% {
      transform: translateX(-1px);
    }

    20%,
    80% {
      transform: translateX(2px);
    }

    30%,
    50%,
    70% {
      transform: translateX(-2px);
    }

    40%,
    60% {
      transform: translateX(2px);
    }
  }
</style>
