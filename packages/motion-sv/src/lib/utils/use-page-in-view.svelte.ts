import { on } from "svelte/events";

class PageInView {
	#isInView = $state(true);

	constructor() {
		$effect(() => {
			this.#update();
			return on(document, "visibilitychange", this.#update);
		});
	}

	/** Whether the page is visible: its tab is active and its window isn't minimised. */
	get current() {
		return this.#isInView;
	}

	#update = () => {
		this.#isInView = !document.hidden;
	};
}

export const usePageInView = () => new PageInView();
