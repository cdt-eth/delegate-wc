<script lang="ts">
  import Button from './atoms/Button.svelte';
  import WalletIcon from './svgs/Wallet.svelte';

  export let handleGetAWallet: () => void;
</script>

<Button
  classes="walletBtn bg-transparent dark:bg-transparent text-midgray dark:text-midgray hover:text-black hover:dark:text-white flex items-center gap-2 justify-center w-max-content m-auto mt-6"
  buttonText="I don't have a wallet"
  onClick={handleGetAWallet}
  icon={WalletIcon}
/>
