<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let showModal = false;

  function close() {
    showModal = false;
    dispatch('close');
  }

  /**
   * @param {{ key: string; }} event
   */
  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      close();
    }
  }
</script>

<div
  class="{showModal
    ? 'fixed'
    : 'hidden'} fixed top-0 left-0 w-full h-full z-50 overflow-auto bg-opacity-60 bg-black cursor-default"
  on:click={close}
  on:keydown={handleKeydown}
  role="button"
  tabindex="0"
>
  <div
    role="button"
    on:click={e => e.stopPropagation()}
    on:keydown={e => e.stopPropagation()}
    tabindex="0"
    class="relative p-6 mx-auto mt-48 bg-[#2B2B2B] rounded-3xl w-11/12 md:w-6/12 lg:w-3/12 cursor-default"
  >
    <slot />
  </div>
</div>
