<script lang="ts">
	import IconMoon from "~icons/lucide/moon";
	import IconSun from "~icons/lucide/sun";

	type Theme = "light" | "dark";

	// The saved theme is applied by app.html before the first paint; this reads it back.
	let theme = $state<Theme | undefined>();

	$effect(() => {
		theme =
			(document.documentElement.dataset.theme as Theme | undefined) ??
			(matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	});

	function toggle() {
		theme = theme === "dark" ? "light" : "dark";
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem("theme", theme);
		} catch {
			// Storage can be unavailable (private mode); the theme still applies for this visit
		}
	}
</script>

<button type="button" class="icon-button" onclick={toggle} aria-label="Toggle theme">
	{const Icon = $derived(theme === "dark" ? IconSun : IconMoon)}
	<Icon />
</button>
