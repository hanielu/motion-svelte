<script lang="ts">
	import IconMoon from "~icons/lucide/moon";
	import IconSun from "~icons/lucide/sun";

	// app.html applies the theme as a `.dark` class on <html>, so the icon follows it in CSS, including system changes
	function toggle() {
		const isDark = document.documentElement.classList.toggle("dark");
		try {
			localStorage.setItem("theme", isDark ? "dark" : "light");
		} catch {
			// Storage can be unavailable (private mode); the theme still applies for this visit
		}
	}
</script>

<button type="button" class="icon-button" onclick={toggle} aria-label="Toggle theme">
	<IconMoon class="moon" />
	<IconSun class="sun" />
</button>

<style>
	button :global(.sun),
	:global(.dark) button :global(.moon) {
		display: none;
	}

	:global(.dark) button :global(.sun) {
		display: block;
	}
</style>
