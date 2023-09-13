<script lang="ts">
  import Button from './atoms/Button.svelte';
  import GradientWave from './svgs/GradientWave.svelte';
  import RightArrowIcon from './svgs/RightArrow.svelte';
</script>

<div class="flex flex-col gap-4">
  <GradientWave />

  <div class="mb-4 flex flex-col gap-2">
    <p class="text-lg font-semibold leading-5">Start Exploring Web3</p>
    <p class="text-base font-normal leading-[21px] text-midgray">
      Your wallet is the gateway to all things Ethereum, the magical technology that makes it
      possible to explore web3.
    </p>
  </div>

  <Button
    on:click={() => {
      window.open('https://ethereum.org/en/wallets/find-wallet/', '_blank');
    }}
    buttonText="Chose Your First Wallet"
    classes="arrowBtn"
    icon={RightArrowIcon}
    iconAfter
  />
</div>
