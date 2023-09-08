<script lang="ts">
  import { writable } from 'svelte/store';
  import { defaultState, connectRequestStore } from './stores/ConnectRequestStore';
  import { walletStore } from './stores/WalletStore';
  import type { FallbackTransport } from 'viem';
  import { type Config, type PublicClient, type WebSocketPublicClient } from '@wagmi/core';

  export let size = '100px';
  export let color = '#1A88F8';
  export let image = '';
  export let showSpinner = true;
  export let errorCircle = false;
  export let connectWallet: (index: number) => void;
  export let config: Config<
    PublicClient<FallbackTransport>,
    WebSocketPublicClient<FallbackTransport>
  >;
  export let qrCodeUrl: string;

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

  function retryWalletConnectionRequest() {
    connectRequestStore.set(defaultState);
    hideErrorCircle.set(false);
    showRetryButton.set(false);
    connectWallet(
      config.connectors.findIndex(connector => connector.name === $walletStore.connector)!,
    );
  }
</script>

<div
  class={`spinner-container  ${errorCircle ? 'shake' : ''}`}
  style="--size: {size}; --color: {color};"
  on:animationend={handleAnimationEnd}
>
  {#if showSpinner}
    <div class="spinner" />
  {/if}
  {#if errorCircle}
    <div class={`error ${$hideErrorCircle ? 'hide' : ''}`} on:transitionend={handleErrorFadeOut} />
  {/if}

  {#if qrCodeUrl && $walletStore.connector !== 'Metamask'}
    <div class="border rounded-xl border-[#f7f6f8] dark:border-[#383838]">
      <img class="qrCode rounded-xl" src={qrCodeUrl} alt="WalletConnect QR Code" />
    </div>
  {/if}

  {#if image}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={image} alt="Image" class="image" />

    {#if $showRetryButton}
      <div class="retryButton absolute bottom-0 right-0">
        <button
          on:click={retryWalletConnectionRequest}
          class="flex items-center gap-1 bg-black border border-black dark:bg-[#333333] -mr-6 rounded-full shadow"
        >
          <svg
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM24.5001 8.74263C25.0834 8.74263 25.5563 9.21551 25.5563 9.79883V14.5997C25.5563 15.183 25.0834 15.6559 24.5001 15.6559H19.6992C19.1159 15.6559 18.643 15.183 18.643 14.5997C18.643 14.0164 19.1159 13.5435 19.6992 13.5435H21.8378L20.071 11.8798C20.0632 11.8724 20.0555 11.865 20.048 11.8574C19.1061 10.915 17.8835 10.3042 16.5643 10.1171C15.2452 9.92999 13.9009 10.1767 12.7341 10.82C11.5674 11.4634 10.6413 12.4685 10.0955 13.684C9.54968 14.8994 9.41368 16.2593 9.70801 17.5588C10.0023 18.8583 10.711 20.0269 11.7273 20.8885C12.7436 21.7502 14.0124 22.2582 15.3425 22.336C16.6726 22.4138 17.9919 22.0572 19.1017 21.3199C19.5088 21.0495 19.8795 20.7333 20.2078 20.3793C20.6043 19.9515 21.2726 19.9262 21.7004 20.3228C22.1282 20.7194 22.1534 21.3876 21.7569 21.8154C21.3158 22.2912 20.8176 22.7161 20.2706 23.0795C18.7793 24.0702 17.0064 24.5493 15.2191 24.4448C13.4318 24.3402 11.7268 23.6576 10.3612 22.4998C8.9956 21.3419 8.0433 19.7716 7.6478 18.0254C7.2523 16.2793 7.43504 14.4519 8.16848 12.8186C8.90192 11.1854 10.1463 9.83471 11.7142 8.97021C13.282 8.10572 15.0884 7.77421 16.861 8.02565C18.6282 8.27631 20.2664 9.09278 21.5304 10.3525L23.4439 12.1544V9.79883C23.4439 9.21551 23.9168 8.74263 24.5001 8.74263Z"
              fill="white"
            /></svg
          >
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .shadow {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 6px;
  }
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
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 75%;
    height: 75%;
  }
  .retryButton {
    margin-bottom: 10px;
    margin-right: 25px;
  }
  .retryButton:hover path {
    fill: #f6f7f9;
    transition: opacity 0.5s ease-out;
  }
  .hide {
    opacity: 0;
  }
  .qrCode {
    width: 100%;
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