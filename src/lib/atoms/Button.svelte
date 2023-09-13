<script lang="ts">
  import { createEventDispatcher, SvelteComponent } from 'svelte';
  const dispatch = createEventDispatcher();

  export let classes: string = '';
  export let icon: any = null;
  export let iconAfter: boolean = false;
  export let buttonText: string = '';
  export let imageSrc: string | null = null;
  export let altText: string = 'image';
  export let onClick: () => void = () => {};
</script>

<button
  class="text-base font-semibold rounded-2xl border border-transparent h-11 px-3 dark:text-white dark:bg-dark-button text-light-text bg-light-button hover:bg-opacity-[60%] dark:hover:bg-opacity-[95%] cursor-pointer transition-border-color duration-200 focus:outline-none flex items-center justify-center gap-2 w-full
   {classes}"
  on:click={onClick}
>
  {#if icon && !iconAfter}
    <svelte:component this={icon} />
  {/if}

  {#if imageSrc}
    <img class="w-3 h-3 m-auto" src={imageSrc} alt={altText} />
  {/if}

  {buttonText}

  {#if icon && iconAfter}
    <svelte:component this={icon} />
  {/if}
</button>
