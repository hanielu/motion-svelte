import { Context } from "runed";
import type { CreateVisualElement } from "../render/types.js";

export interface LazyContextProps {
	renderer?: CreateVisualElement;
	strict: boolean;
}

export const LazyContext = Context.boxed<LazyContextProps>("LazyContext", { strict: false });
