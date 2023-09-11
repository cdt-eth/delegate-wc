<script lang="ts">
  import Toggle from './lib/Toggle.svelte';
  import { walletStore } from './lib/stores/WalletStore';
  import ConnectWallet from './lib/ConnectWallet.svelte';
  import { onMount } from 'svelte';
  import { getAccount, getNetwork } from '@wagmi/core';
  import { get } from 'svelte/store';
  import { getPublicClient } from '@wagmi/core';
  import { fetchEnsData } from './utils/fetchENSData';
  import { fetchWalletBalance } from './utils/fetchWalletBalance';

  const account = getAccount();
  const { chain } = getNetwork();

  let address = account.address as `0x${string}`;

  onMount(async () => {
    const currentState = get(walletStore);

    if (currentState.status !== 'connected') {
      walletStore.update(state => ({ ...state, status: 'connecting' }));

      if (account.isConnected) {
        const ensData = await fetchEnsData(address);
        const balance = await fetchWalletBalance(address);
        const publicClient = getPublicClient();

        walletStore.update(state => ({
          ...state,
          address: account.address as `0x${string}`,
          chain: publicClient.chain.name,
          chainId: publicClient.chain.id,
          status: 'connected',
          provider: publicClient,
          balance,
          ...ensData,
        }));
      } else {
        walletStore.update(state => ({
          ...state,
          address: null,
          chain: chain?.name,
          status: 'disconnected',
        }));
      }
    }
  });
</script>

<main class="flex gap-2 ml-20">
  <ConnectWallet />

  <Toggle />
</main>
