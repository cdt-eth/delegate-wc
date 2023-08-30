<script lang="ts">
  import delegateLogo from './assets/logo.svg';
  import ConnectButton from './lib/ConnectButton.svelte';
  // import { WagmiConfig, createConfig } from 'wagmi';
</script>

<main class="w-2/3 m-auto flex flex-col gap-8">
  <div class="p-2 flex items-center m-auto w-[300px] justify-center gap-4">
    <a class="cursor-default p-2" href="https://delegate.xyz/" target="_blank" rel="noreferrer">
      <img
        id="logo"
        class="logo h-24 p-6 transition duration-300 m-auto cursor-pointer"
        src={delegateLogo}
        alt="Delegate Logo"
        style="padding: 1.5em;"
      />
    </a>

    <ConnectButton />
  </div>

  <div>
    <p class="text-4xl">Secure your onchain identity</p>

    <p class="text-[#888] pt-3 m-auto">
      Keep your vaulted NFTs and ERC20s safe by linking wallets together. Claim airdrops, prove
      token ownership, and more from your hot wallet.
    </p>
  </div>
</main>
