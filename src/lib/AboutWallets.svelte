<script lang="ts">
  import { darkMode } from './stores/DarkModeStore';

  let currentSlide = 1;

  const slides = [
    {
      svg: ``,
      title: 'For your digital assets',
      subtitle:
        'Wallets let you send, receive, store, and interact with digital assets like NFTs and other Ethereum tokens.',
      buttonText: 'Learn More',
      buttonLink: 'https://ethereum.org/en/wallets/',
    },
    {
      svg: ``,
      title: 'A better way to login',
      subtitle:
        'With modern apps, your wallet can be used as an easy way to login, instead of having to remember a password.',
      buttonText: 'Learn More',
      buttonLink: 'https://ethereum.org/en/wallets/',
    },
    {
      svg: ``,
      title: 'Explore the world of web3',
      subtitle:
        'Your wallet is an essential utility that lets you explore and participate in the fast evolving world of web3.',
      buttonText: 'Learn More',
      buttonLink: 'https://ethereum.org/en/wallets/',
    },
  ];
</script>

<div class="flex flex-col gap-4">
  <div>
    {@html slides[currentSlide - 1].svg}
  </div>
  <div class="mb-4 flex flex-col gap-2">
    <p class="title">{slides[currentSlide - 1].title}</p>
    <p class="subtitle">{slides[currentSlide - 1].subtitle}</p>
  </div>

  <div class={`button-switcher ${$darkMode ? 'darkMode' : ''}`}>
    <span class="buttonSpan">
      <button
        class="btn {currentSlide === 1 ? 'active' : ''}"
        on:click={() => (currentSlide = 1)}
      />
      <button
        class="btn {currentSlide === 2 ? 'active' : ''}"
        on:click={() => (currentSlide = 2)}
      />
      <button
        class="btn {currentSlide === 3 ? 'active' : ''}"
        on:click={() => (currentSlide = 3)}
      />
    </span>
  </div>

  <button
    on:click={() => window.open(slides[currentSlide - 1].buttonLink, '_blank')}
    class="text-base font-semibold rounded-xl border border-transparent h-11 px-3 dark:text-white dark:bg-dark-button text-light-text bg-light-button hover:bg-opacity-[60%] dark:hover:bg-opacity-[95%] cursor-pointer transition-border-color duration-200 focus:outline-none flex items-center justify-center gap-2"
  >
    {slides[currentSlide - 1].buttonText}

    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line
        stroke="currentColor"
        x1="1"
        y1="6"
        x2="12"
        y2="6"
        stroke-width="2"
        stroke-linecap="round"
        class="on-hover"
      />
      <path
        stroke="currentColor"
        d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
        stroke-width="2"
        stroke-linecap="round"
        class="point"
      />
    </svg>
  </button>
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
    background: #373737;
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
    background: #f7f6f8;
  }
  .buttonSpan {
    z-index: 2;
    display: flex;
    padding: 0px 14px;
    background: white;
    transition: background-color 200ms ease 0s;
  }

  .darkMode .buttonSpan {
    background: #2b2b2b !important;
  }
  .darkMode .button-switcher::before {
    background: #383838;
  }
  .darkMode .btn::before {
    background-color: #fff;
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
    color: #999;
  }
  .dark .subtitle {
    color: #fff6;
  }
  .point {
    transition: all 75ms ease 0s;
    transform: translateX(-3px);
    /* left: -0.5px; */
  }
  .on-hover {
    opacity: 0;
  }
  button:hover .on-hover {
    opacity: 1;
  }
  button:hover .point {
    transform: translateX(0px);
  }
</style>
