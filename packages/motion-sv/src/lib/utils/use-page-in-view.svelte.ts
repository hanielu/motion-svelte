class UsePageInView {
	isInView = $state(true);

	constructor() {
		$effect(() => {
			if (document.hidden) {
				this.handleVisibilityChange();
			}

			document.addEventListener("visibilitychange", this.handleVisibilityChange);

			return () => {
				document.removeEventListener("visibilitychange", this.handleVisibilityChange);
			};
		});
	}
	handleVisibilityChange() {
		this.isInView = !document.hidden;
	}
}

export const usePageInView = () => new UsePageInView();
