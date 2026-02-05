<script>
  import { onMount } from "svelte";
  import { socialNames } from "@/site.config";

  let status = null;
  let loading = true;

  async function getStatus() {
    try {
      const res = await fetch(`https://status.cafe/users/${socialNames.status}/status.json`);
      status = await res.json();
    } catch (e) {
      console.error("Status.cafe fetch failed", e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    getStatus();
    const interval = setInterval(getStatus, 300000); // 5 minutes
    return () => clearInterval(interval);
  });
</script>

<a
  href={`https://status.cafe/users/${socialNames.status}`}
  target="_blank"
  rel="noopener noreferrer"
  class="border rounded p-4 flex items-center gap-4 bg-global-text/10 xl:w-1/2 hover:shadow-md  transition-all"
>
  <div class="w-12 h-12 shrink-0 rounded-full bg-linear-to-tr from-accent to-accent-2 flex items-center justify-center text-2xl text-shadow-lg shadow-xl">
    {#if loading}
      <span class="animate-pulse">...</span>
    {:else}
      {status?.face}
    {/if}
  </div>

  <div class="flex flex-col gap-1 overflow-hidden">
    <div class="flex items-center gap-2">
      <span class="font-bold">status.cafe</span>
      {#if status}
        <span class="text-[10px] px-1.5 py-0.5 rounded bg-global-text/25 text-global-text uppercase tracking-tighter">
          {status.timeAgo}
        </span>
      {/if}
    </div>

    {#if loading}
      <div class="h-4 w-32 bg-global-text/10 animate-pulse rounded" ></div>
    {:else if status}
      <p class="text-sm text-global-text">
        {@html status.content}
      </p>
    {/if}
  </div>
</a>
