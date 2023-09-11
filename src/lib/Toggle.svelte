<script>
  import SunIcon from './svgs/Sun.svelte';
  import MoonIcon from './svgs/Moon.svelte';
  import { darkMode } from './stores/DarkModeStore';

  /**
   * @param {boolean} enableDark
   */
  function toggleDarkMode(enableDark) {
    darkMode.set(enableDark);
  }
</script>

<button
  class="cursor-default flex items-center px-2.5 py-2 gap-3 rounded-full border border-light-gray"
>
  <button
    on:click={() => toggleDarkMode(false)}
    disabled={!$darkMode}
    class={$darkMode ? 'cursor-pointer text-black' : 'cursor-default text-gray-400'}
  >
    <SunIcon />
  </button>

  <div class="spacer" />

  <button
    on:click={() => toggleDarkMode(true)}
    disabled={$darkMode}
    class={$darkMode ? 'cursor-default text-gray-400' : 'cursor-pointer text-black'}
  >
    <MoonIcon />
  </button>
</button>

<style>
  .spacer {
    width: 1px;
    height: 10px;
    background: rgb(217, 217, 217);
  }
</style>
