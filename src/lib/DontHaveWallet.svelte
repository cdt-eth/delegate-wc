<script lang="ts">
  import WalletIcon from './svgs/Wallet.svelte';

  export let handleGetAWallet: () => void;
</script>

<button
  class="walletBtn text-[#999999] flex items-center gap-2 justify-center w-max-content m-auto mt-6"
  on:click={handleGetAWallet}
>
  <WalletIcon />

  <p class="font-semibold pb-1">I don't have a wallet</p>
</button>
