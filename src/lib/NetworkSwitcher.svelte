<script lang="ts">
  import downArrowIcon from '../assets/icons/downArrow.svg';
  import { walletStore } from './stores/WalletStore';
  import defaultLogo from '../assets/chains/default.jpeg';
  import ethereumLogo from '../assets/chains/ethereum.svg';
  import { config } from '../utils/wagmiConfig';
  import { switchNetwork } from '@wagmi/core';
  import { fetchWalletBalance } from '../utils/fetchWalletBalance';
  import { fetchChainLogo, type Option } from '../utils/fetchChainLogo';

  let selectedOption: string | null = 'Ethereum';

  export let isOpen = false;
  export let toggleDropdown: () => void;

  async function selectOption(option: Option): Promise<void> {
    selectedOption = option.name;
    isOpen = false;

    try {
      const network = await switchNetwork({ chainId: option.chainId });
      const balance = await fetchWalletBalance($walletStore.address as `0x${string}`);

      walletStore.update(state => {
        return { ...state, chain: option.name, balance };
      });

      console.log('Network switched:', network);
    } catch (error) {
      console.error('Error switching network:', error);
    }
  }

  const options: Option[] =
    config.chains && config.chains.length
      ? config.chains.map(c => ({
          name: c.name,
          chainId: c.id,
          logo: fetchChainLogo(c.name),
        }))
      : [];
</script>

<div class="dropdown absolute bottom-0 right-0">
  <button
    on:click={toggleDropdown}
    class="flex items-center gap-1 bg-white border border-light-button dark:bg-[#333333] dark:border-[#333333] p-1 -mr-6 rounded-full"
  >
    <img
      src={selectedOption
        ? options.find(option => option.name === $walletStore.chain)?.logo || defaultLogo
        : ethereumLogo}
      class="h-5 w-5 rounded-full object-cover"
      alt="network"
    />

    <img src={downArrowIcon} class="h-3 w-3 mr-0.5" alt="down-arrow" />
  </button>
  <div
    class={`dropdown-content rounded-xl w-max p-3 bg-white dark:bg-[#383838] absolute max-h-[300px] overflow-auto text-left flex flex-col gap-1 ${
      isOpen ? 'open' : ''
    }`}
  >
    <p class="text-[#888]">Switch Networks</p>

    {#each options as option}
      <div
        class={`flex gap-12 p-2 
        hover:bg-light-button dark:bg-[#383838] dark:hover:bg-white dark:hover:bg-opacity-10 rounded-xl
        ${
          $walletStore.chain === option.name
            ? 'bg-[#00b3ff] bg-opacity-10 dark:bg-[#00b3ff] dark:bg-opacity-20'
            : ''
        }`}
      >
        <button
          class="flex items-center gap-2 w-full cursor-pointer"
          on:click={() => selectOption(option)}
        >
          <img src={option.logo} class="h-5 w-5 rounded-full object-cover" alt={option.name} />
          {option.name}
        </button>

        {#if $walletStore.chain === option.name}
          <div class="text-[#008AFF]">Connected</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .dropdown-content {
    display: none;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  .dropdown-content::-webkit-scrollbar {
    width: 7px;
    height: 0px;
  }
  .dropdown-content::-webkit-scrollbar-track {
    border-radius: 10px;
    margin: 10px 0px;
  }
  .dropdown-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: white;
    background: rgba(102, 102, 102, 0.25);
  }
</style>
