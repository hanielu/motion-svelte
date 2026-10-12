import { Context } from "runed";

export interface LayoutMotionScope {
	update: () => void;
	register?: (fn: () => void) => void;
	unregister?: (fn: () => void) => void;
}

export const LayoutMotionScopeContext = new Context<LayoutMotionScope>("LayoutMotionScope");
