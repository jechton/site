<script>
	import { onMount } from "svelte";
	import { socialNames } from "@/site.config";

	let data = null;
	let loading = true;
	let refreshing = false;

	async function fetchMusicData() {
		refreshing = true;
		try {
			const [listensRes, playingRes] = await Promise.all([
				fetch(`https://api.listenbrainz.org/1/user/${socialNames.ListenBrainz}/listens?count=1`),
				fetch(`https://api.listenbrainz.org/1/user/${socialNames.ListenBrainz}/playing-now`),
			]);

			const listensData = await listensRes.json();
			const playingData = await playingRes.json();

			data = {
				song: listensData.payload.listens[0].track_metadata,
				isPlaying: playingData.payload.playing_now,
			};
		} catch (e) {
			console.error("ListenBrainz fetch failed", e);
		} finally {
			loading = false;
			refreshing = false;
		}
	}

	onMount(() => {
		fetchMusicData();
		const interval = setInterval(fetchMusicData, 60000); // 1 minute
		return () => clearInterval(interval);
	});
</script>

{#if loading}
	<div
		class="border flex gap-4 xl:w-1/2 rounded overflow-hidden animate-pulse bg-global-text/10 h-26"
	></div>
{:else}
	<a
		href={`https://listenbrainz.org/user/${socialNames.ListenBrainz}`}
		target="_blank"
		rel="noopener noreferrer"
		class="group border flex gap-4 xl:w-1/2 rounded overflow-hidden bg-global-text/10 relative transition-all hover:shadow-md {refreshing
			? 'opacity-70'
			: 'opacity-100'}"
	>
		<div class="aspect-square h-26 sm:h-30 shrink-0 bg-global-text/25">
			{#if data?.song?.mbid_mapping?.caa_release_mbid}
				<img
					class="h-full w-full object-cover"
					src={`https://coverartarchive.org/release/${data.song.mbid_mapping.caa_release_mbid}/front-250`}
					alt={data.song.track_name}
				/>
			{:else}
				<div
					class="w-full h-full bg-linear-to-br from-accent to-accent-2 flex items-center justify-center"
				>
					<span class="text-xs font-bold text-white/50 uppercase tracking-widest"> No Art </span>
				</div>
			{/if}
		</div>

		<div class="flex flex-col justify-center py-2 pr-4 overflow-hidden">
			<span class="text-xs opacity-60">
				{data?.isPlaying ? "Now Playing" : "Last Played"}
			</span>
			<span class="font-bold text-lg truncate">
				{data?.song?.track_name ?? "Unknown Track"}
			</span>
			<span class="opacity-80 truncate">
				{data?.song?.artist_name ?? "Unknown Artist"}
			</span>
		</div>

		<span
			class="text-[10px] absolute bottom-0.5 right-1 opacity-75 group-hover:opacity-100 group-hover:font-bold transition-all"
		>
			listenbrainz
		</span>
	</a>
{/if}
