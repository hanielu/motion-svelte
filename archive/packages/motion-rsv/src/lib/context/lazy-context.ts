import { Context } from "runed";
import type { CreateVisualElement } from "../render/types.js";

export interface LazyContextProps {
	renderer?: CreateVisualElement;
	strict: boolean;
}

export const LazyContext = new Context<LazyContextProps>("LazyContext", { strict: false });
