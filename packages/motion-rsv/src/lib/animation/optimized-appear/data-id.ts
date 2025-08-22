import { camelToDash } from "../../render/dom/utils/camel-to-dash.js";

export const optimizedAppearDataId = "framerAppearId";

export const optimizedAppearDataAttribute = ("data-" + camelToDash(optimizedAppearDataId)) as "data-framer-appear-id";
