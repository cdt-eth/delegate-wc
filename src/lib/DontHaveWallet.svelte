<script lang="ts">
  import { darkMode } from './stores/DarkModeStore';

  export let handleGetAWallet: () => void;
</script>

<button
  class="text-[#999999] flex items-center gap-2 justify-center w-max-content m-auto mt-6"
  on:click={handleGetAWallet}
>
  <svg
    aria-hidden="true"
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      d="M1.57568 4.60616C1.57568 2.69827 3.12234 1.15161 5.03023 1.15161H15.3939C17.3018 1.15161 18.8484 2.69826 18.8484 4.60616V10.3637C18.8484 12.2716 17.3018 13.8183 15.3939 13.8183H5.03023C3.12234 13.8183 1.57568 12.2716 1.57568 10.3637V4.60616Z"
      stroke="currentColor"
      stroke-width="2"
    />
    <path
      class="on-hover"
      d="M1 4.79293C1 2.435 3.31004 0.770014 5.54697 1.51566L12.4561 3.81869C13.8667 4.2889 14.8182 5.60901 14.8182 7.09596V13.6313C14.8182 15.9892 12.5081 17.6542 10.2712 16.9086L3.36212 14.6056C1.95149 14.1353 1 12.8152 1 11.3283V4.79293Z"
      stroke="currentColor"
      fill={$darkMode ? '#000' : '#fff'}
      stroke-width="2"
    />
    <circle class="circleClosed" cx="14.3863" cy="8" r="1.32574" fill="currentColor" />
    <circle class="circleOpen" cx="10.3863" cy="10.1894" r="1.32574" fill="currentColor" /></svg
  >

  <p class="font-semibold pb-1">I don't have a wallet</p>
</button>

<style>
  .on-hover {
    opacity: 0;
  }
  button:hover .on-hover {
    opacity: 1;
    color: #000;
  }
  button:hover .circleClosed {
    opacity: 0;
  }
  .circleOpen {
    opacity: 0;
  }
  button:hover .circleOpen {
    opacity: 1;
  }
  button:hover :is(svg, p) {
    color: #000;
  }
  .dark button:hover :is(svg, p),
  .dark button:hover .on-hover {
    color: #fff;
  }
  .dark button:hover path {
    fill: #2b2b2b;
  }
</style>
