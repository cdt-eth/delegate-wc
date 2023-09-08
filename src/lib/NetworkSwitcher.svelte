<script lang="ts">
  import {
    Config,
    switchNetwork,
    type PublicClient,
    type WebSocketPublicClient,
    fetchBalance,
  } from '@wagmi/core';
  import downArrowIcon from '../assets/icons/downArrow.svg';
  import { walletStore } from './stores/WalletStore';
  import type { FallbackTransport } from 'viem';
  import defaultLogo from '../assets/chains/default.jpeg';
  import ethereumLogo from '../assets/chains/ethereum.svg';
  import goerliLogo from '../assets/chains/goerli.webp';
  import sepoliaLogo from '../assets/chains/sepolia.webp';
  import arbitrumoneLogo from '../assets/chains/arbitrumone.png';
  import arbitrumgoerliLogo from '../assets/chains/arbitrumgoerli.png';
  import avalancheLogo from '../assets/chains/avalanche.png';
  import avalanchefujiLogo from '../assets/chains/avalanchefuji.png';
  import baseLogo from '../assets/chains/base.webp';
  import basegoerliLogo from '../assets/chains/basegoerli.jpeg';
  import bnbsmartchainLogo from '../assets/chains/bnbsmartchain.png';
  import binancesmartchaintestnetLogo from '../assets/chains/binancesmartchaintestnet.webp';
  import cantoLogo from '../assets/chains/canto.png';
  import celoLogo from '../assets/chains/celo.png';
  import alfajoresLogo from '../assets/chains/alfajores.jpeg';
  import fantomLogo from '../assets/chains/fantom.png';
  import fantomtestnetLogo from '../assets/chains/fantomtestnet.png';
  import gnosisLogo from '../assets/chains/gnosis.png';
  import gnosischiadoLogo from '../assets/chains/gnosischiado.jpeg';
  import klaytnLogo from '../assets/chains/klaytn.png';
  import opmainnetLogo from '../assets/chains/opmainnet.png';
  import optimismgoerliLogo from '../assets/chains/optimismgoerli.png';
  import polygonLogo from '../assets/chains/polygon.svg';
  import polygonmumbaiLogo from '../assets/chains/polygonmumbai.jpeg';
  import zoraLogo from '../assets/chains/zora.png';
  import zoragoerlitestnetLogo from '../assets/chains/zoragoerlitestnet.svg';

  let selectedOption: string | null = 'Ethereum';

  export let config: Config<
    PublicClient<FallbackTransport>,
    WebSocketPublicClient<FallbackTransport>
  >;

  export let isOpen = false;
  export let toggleDropdown: () => void;

  async function selectOption(option: Option): Promise<void> {
    selectedOption = option.name;
    isOpen = false;

    try {
      const network = await switchNetwork({ chainId: option.chainId });
      const balance = await fetchBalance({ address: $walletStore.address as `0x${string}` });
      const formattedBalance = await parseFloat(balance.formatted).toFixed(
        Math.max(2, Math.min(4, (balance.formatted.split('.')[1] || '').length)),
      );

      walletStore.update(state => {
        return {
          ...state,
          chain: option.name,
          balance: formattedBalance + ' ' + balance.symbol,
        };
      });

      console.log('Network switched:', network);
    } catch (error) {
      console.error('Error switching network:', error);
    }
  }

  type Option = {
    name: string;
    logo: string;
    chainId: number;
  };

  function convertToOption(chain: Option) {
    const imageName = chain.name.toLowerCase().replace(/\s+/g, '');

    let logo;
    switch (imageName) {
      case 'ethereum':
        logo = ethereumLogo;
        break;
      case 'goerli':
        logo = goerliLogo;
        break;
      case 'sepolia':
        logo = sepoliaLogo;
        break;
      case 'arbitrumone':
        logo = arbitrumoneLogo;
        break;
      case 'arbitrumgoerli':
        logo = arbitrumgoerliLogo;
        break;
      case 'avalanche':
        logo = avalancheLogo;
        break;
      case 'avalanchefuji':
        logo = avalanchefujiLogo;
        break;
      case 'base':
        logo = baseLogo;
        break;
      case 'basegoerli':
        logo = basegoerliLogo;
        break;
      case 'bnbsmartchain':
        logo = bnbsmartchainLogo;
        break;
      case 'binancesmartchaintestnet':
        logo = binancesmartchaintestnetLogo;
        break;
      case 'canto':
        logo = cantoLogo;
        break;
      case 'celo':
        logo = celoLogo;
        break;
      case 'alfajores':
        logo = alfajoresLogo;
        break;
      case 'fantom':
        logo = fantomLogo;
        break;
      case 'fantomtestnet':
        logo = fantomtestnetLogo;
        break;
      case 'gnosis':
        logo = gnosisLogo;
        break;
      case 'gnosischiado':
        logo = gnosischiadoLogo;
        break;
      case 'klaytn':
        logo = klaytnLogo;
        break;
      case 'opmainnet':
        logo = opmainnetLogo;
        break;
      case 'optimismgoerli':
        logo = optimismgoerliLogo;
        break;
      case 'polygon':
        logo = polygonLogo;
        break;
      case 'polygonmumbai':
        logo = polygonmumbaiLogo;
        break;
      case 'zora':
        logo = zoraLogo;
        break;
      case 'zoragoerlitestnet':
        logo = zoragoerlitestnetLogo;
        break;
      default:
        logo = defaultLogo;
    }

    return {
      name: chain.name,
      logo: logo,
      chainId: chain.chainId,
    };
  }

  const options: Option[] =
    config.chains && config.chains.length
      ? config.chains?.map(c =>
          convertToOption({
            name: c.name,
            chainId: c.id,
            logo: '',
          }),
        )
      : [];
</script>

<div class="dropdown absolute bottom-0 right-0">
  <button
    on:click={toggleDropdown}
    class="flex items-center gap-1 bg-white border border-light-button dark:bg-[#333333] dark:border-[#333333] p-1 -mr-6 rounded-full"
  >
    <img
      src={selectedOption
        ? options.filter(option => option.name === $walletStore.chain)[0].logo
        : ethereumLogo}
      class="h-5 w-5 rounded-full object-cover"
      alt="network"
    />

    <img src={downArrowIcon} class="h-3 w-3 mr-0.5" alt="down-arrow" />
  </button>
  <div
    style={isOpen ? 'display: flex;' : ''}
    class="dropdown-content rounded-xl w-max p-3 bg-white dark:bg-[#383838] absolute max-h-[300px] overflow-auto text-left flex flex-col gap-1"
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
