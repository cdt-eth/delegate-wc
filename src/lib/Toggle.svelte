<script>
  import { darkMode } from './stores/DarkModeStore';

  function enableLightMode() {
    darkMode.set(false);
  }

  function enableDarkMode() {
    darkMode.set(true);
  }
</script>

<button
  class="cursor-default flex items-center px-2.5 py-2 gap-3 rounded-full border border-light-gray"
>
  <button
    on:click={enableLightMode}
    disabled={!$darkMode}
    class={$darkMode ? 'cursor-pointer text-black' : 'cursor-default text-gray-400'}
  >
    <!-- we inline the SVGs so that we can change their color, svgs in image tags are rasterized -->
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
      ><path
        d="M9.00001 12.6363C11.0083 12.6363 12.6364 11.0082 12.6364 8.99989C12.6364 6.99158 11.0083 5.36353 9.00001 5.36353C6.9917 5.36353 5.36365 6.99158 5.36365 8.99989C5.36365 11.0082 6.9917 12.6363 9.00001 12.6363Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M9 1V2.45455"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M9 15.5454V17"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M3.3418 3.3418L4.37452 4.37452"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M13.6254 13.6255L14.6581 14.6582"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M1 9H2.45455"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M15.5455 9H17.0001"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M3.3418 14.6582L4.37452 13.6255"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /><path
        d="M13.6254 4.37452L14.6581 3.3418"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    >
  </button>

  <div class="spacer" />

  <button
    on:click={enableDarkMode}
    disabled={$darkMode}
    class={$darkMode ? 'cursor-default text-gray-400' : 'cursor-pointer text-black'}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
      ><path
        d="M15 8.63063C14.8774 9.95738 14.3795 11.2218 13.5645 12.2759C12.7495 13.33 11.6512 14.1301 10.398 14.5828C9.14485 15.0354 7.78869 15.1218 6.48822 14.8319C5.18775 14.5419 3.99677 13.8875 3.05461 12.9454C2.11246 12.0032 1.45811 10.8122 1.16814 9.51178C0.878168 8.21131 0.96456 6.85515 1.41721 5.60199C1.86986 4.34883 2.67005 3.2505 3.72413 2.43552C4.77822 1.62054 6.04262 1.12261 7.36937 1C6.5926 2.05088 6.21881 3.34566 6.31599 4.64884C6.41317 5.95202 6.97487 7.17704 7.89892 8.10109C8.82296 9.02513 10.048 9.58683 11.3512 9.68401C12.6543 9.78119 13.9491 9.4074 15 8.63063Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    >
  </button>
</button>

<style>
  .spacer {
    width: 1px;
    height: 10px;
    background: rgb(217, 217, 217);
  }
</style>
