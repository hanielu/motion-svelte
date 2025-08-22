import type { VisualElement } from "../../render/VisualElement.js";

export abstract class Feature<T extends any = any> {
	isMounted = false;

	node: VisualElement<T>;

	constructor(node: VisualElement<T>) {
		this.node = node;
	}

	abstract mount(): void;

	abstract unmount(): void;

	update(): void {}
}
