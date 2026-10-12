<script lang="ts">
	import LetterSwap from "./letter-swap.svelte";
</script>

<div>
	<div
		class="w-dvw h-dvh text-3xl flex md:flex-row flex-col items-center justify-center font-calendas gap-x-12 gap-y-4 bg-white text-[#0015ff]"
	>
		<LetterSwap label="First" staggerFrom={"first"} />
		<LetterSwap label="Center" staggerFrom={"center"} />
		<LetterSwap label="Last" staggerFrom={"last"} />
	</div>
</div>
