<script lang="ts">
  import GradientWave from './svgs/GradientWave.svelte';
  import RightArrowIcon from './svgs/RightArrow.svelte';
</script>

<div class="flex flex-col gap-4">
  <GradientWave />

  <div class="mb-4 flex flex-col gap-2">
    <p class="text-lg font-semibold leading-5">Start Exploring Web3</p>
    <p class="text-base font-normal leading-[21px] text-[#999]">
      Your wallet is the gateway to all things Ethereum, the magical technology that makes it
      possible to explore web3.
    </p>
  </div>

  <button
    on:click={() => {
      window.open('https://ethereum.org/en/wallets/find-wallet/', '_blank');
    }}
    class="arrowBtn text-base font-semibold rounded-xl border border-transparent h-11 px-3 dark:text-white dark:bg-dark-button text-light-text bg-light-button hover:bg-opacity-[60%] dark:hover:bg-opacity-[95%] cursor-pointer transition-border-color duration-200 focus:outline-none flex items-center justify-center gap-2"
  >
    Chose Your First Wallet

    <RightArrowIcon />
  </button>
</div>
