<script lang="ts">
  import { darkMode } from './stores/DarkModeStore';
  import Slide1 from './svgs/Slide1.svelte';
  import Slide2 from './svgs/Slide2.svelte';
  import Slide3 from './svgs/Slide3.svelte';
  import RightArrowIcon from './svgs/RightArrow.svelte';
  import Button from './atoms/Button.svelte';

  const slides = [
    {
      svg: Slide1,
      title: 'For your digital assets',
      subtitle:
        'Wallets let you send, receive, store, and interact with digital assets like NFTs and other Ethereum tokens.',
    },
    {
      svg: Slide2,
      title: 'A better way to login',
      subtitle:
        'With modern apps, your wallet can be used as an easy way to login, instead of having to remember a password.',
    },
    {
      svg: Slide3,
      title: 'Explore the world of web3',
      subtitle:
        'Your wallet is an essential utility that lets you explore and participate in the fast evolving world of web3.',
    },
  ];

  let idx = 1;
  const current = slides[idx - 1];
</script>

<div class="flex flex-col gap-4">
  <div class="min-h-[100px] h-fit-content flex gap-2 m-auto">
    <svelte:component this={current.svg} />
  </div>
  <div class="mb-4 flex flex-col gap-2">
    <p class="title">{current.title}</p>
    <p class="subtitle">{current.subtitle}</p>
  </div>

  <div
    class={`button-switcher ${
      $darkMode ? 'darkMode' : ''
    }before:bg-[#f7f6f8] before:dark:bg-[#383838]`}
  >
    <span class="buttonSpan bg-white dark:bg-[#2B2B2B] px-3.5 z-10">
      {#each slides as _, index (index)}
        <button
          class="btn before:bg-[#373737] before:dark:bg-[#ffffff] {idx === index + 1
            ? 'active'
            : ''}"
          on:click={() => (idx = index + 1)}
        />
      {/each}
    </span>
  </div>

  <Button
    classes="arrowBtn"
    buttonText="Learn More"
    onClick={() => window.open('https://ethereum.org/en/wallets/', '_blank')}
    icon={RightArrowIcon}
    iconAfter
  />
</div>

<style>
  .btn {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 28px;
    padding: 2px;
    background: none;
    cursor: pointer;
    z-index: 3;
  }
  .btn::before {
    content: '';
    display: block;
    width: 16px;
    height: 3px;
    border-radius: 4px;
    opacity: 0.12;
    transition: transform 200ms ease 0s, opacity 180ms ease 0s;
    z-index: 3;
  }
  .active::before {
    opacity: 1;
    z-index: 3;
  }
  .button-switcher {
    position: relative;
    top: -1px;
    display: flex;
    justify-content: center;
    pointer-events: auto;
    z-index: 3;
  }
  .button-switcher::before {
    z-index: 1;
    content: '';
    position: absolute;
    top: 50%;
    left: 0px;
    right: 0px;
    height: 1px;
    transform: translateY(-1px);
  }
  .buttonSpan {
    display: flex;
    transition: background-color 200ms ease 0s;
  }
  .title {
    line-height: 20px;
    font-size: 17px;
    font-weight: 600;
  }
  .subtitle {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
  }
</style>
