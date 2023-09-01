<script lang="ts">
  import ethereumLogo from '../assets/chains/ethereum.svg';
  import polygonLogo from '../assets/chains/polygon.svg';
  import zoraLogo from '../assets/chains/zora.png';
  import downArrowIcon from '../assets/downArrowIcon.svg';

  let isOpen: boolean = false;
  let selectedOption: string | null = 'Ethereum';

  function toggleDropdown(): void {
    isOpen = !isOpen;
  }

  function selectOption(option: string): void {
    selectedOption = option;
    isOpen = false;
  }

  const options = [
    { name: 'Ethereum', logo: ethereumLogo, chainId: 1 },
    { name: 'Polygon', logo: polygonLogo, chainId: 2 },
    { name: 'Zora', logo: zoraLogo, chainId: 3 },
  ];
</script>

<div class="dropdown absolute bottom-0 right-0">
  <button
    on:click={toggleDropdown}
    class="flex items-center gap-1 bg-[#333333] p-1 -mr-6 rounded-full"
  >
    <img
      src={selectedOption
        ? options.filter(option => option.name === selectedOption)[0].logo
        : ethereumLogo}
      class="h-5 w-5 rounded-full"
      alt="network"
    />

    <img src={downArrowIcon} class="h-3 w-3 mr-0.5" alt="down-arrow" />
  </button>
  <div
    style={isOpen ? 'display: flex;' : ''}
    class="dropdown-content rounded-xl w-max p-3 bg-[#383838] absolute max-h-[300px] overflow-auto text-left flex flex-col gap-1"
  >
    <p class="text-[#888]">Switch Networks</p>
    {#each options as option}
      <div
        class={`flex gap-12 p-2 ${
          selectedOption === option.name ? 'bg-[#00b3ff] bg-opacity-10 rounded-xl' : ''
        }`}
      >
        <button class="flex items-center gap-2" on:click={() => selectOption(option.name)}>
          <img src={option.logo} class="h-5 w-5 rounded-full" alt={option.name} />
          {option.name}
        </button>

        {#if selectedOption === option.name}
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
</style>