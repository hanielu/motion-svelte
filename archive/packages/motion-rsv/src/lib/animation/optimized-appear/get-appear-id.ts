import { optimizedAppearDataAttribute } from "./data-id.js";
import type { WithAppearProps } from "./types.js";

export function getOptimisedAppearId(visualElement: WithAppearProps): string | undefined {
	return visualElement.props[optimizedAppearDataAttribute];
}
