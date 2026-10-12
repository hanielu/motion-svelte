<script lang="ts">
	import { createLayoutMotion, motion } from "motion-sv";

	interface Props {
		images: Array<{ id: string; r2Url: string }>;
		selectedIndex: number;
		onClose: () => void;
		layout: ReturnType<typeof createLayoutMotion>;
	}

	let { images, selectedIndex = $bindable(), onClose, layout }: Props = $props();

	function handleClose() {
		onClose();
		layout.update();
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center">
	<!-- Backdrop with exit animation -->
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		transition={{ duration: 0.3 }}
		class="lightbox-backdrop absolute inset-0 z-0 bg-black/95"
		onclick={handleClose}
	/>

	<!-- Layout animated image -->
	<layout.div
		class="relative"
		layoutId={selectedIndex?.toString()}
		transition={{
			layout: { type: "spring", stiffness: 300, damping: 30 },
		}}
	>
		<motion.div class="z-50 h-[600px] w-[800px] bg-pink"></motion.div>

		<!-- <img
      src={images[selectedIndex].r2Url}
      alt=""
      class="z-50 max-h-[80vh] max-w-[90vw]"
    /> -->
	</layout.div>
</div>
