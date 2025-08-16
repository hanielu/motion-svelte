import type { MotionStyle } from "../../../motion/types.js";
import type { IProjectionNode } from "../../../projection/node/types.js";
import type { HTMLRenderState } from "../types.js";

export function renderHTML(
  element: HTMLElement,
  { style, vars }: HTMLRenderState,
  styleProp?: MotionStyle,
  projection?: IProjectionNode
) {
  if ((styleProp as any)?.__logRender) {
    console.log(
      "[haniel][renderHTML] render: projection=",
      !!projection,
      "style keys=",
      Object.keys(style)
    );
  }
  const elementStyle = element.style;

  let key: string;
  for (key in style) {
    // Assign using string keys so properties like "transform" apply correctly
    // on CSSStyleDeclaration at runtime.
    (elementStyle as any)[key] = style[key] as string;
  }

  // Write projection styles directly to element style
  projection?.applyProjectionStyles(elementStyle, styleProp);

  for (key in vars) {
    // Loop over any CSS variables and assign those.
    // They can only be assigned using `setProperty`.
    elementStyle.setProperty(key, vars[key] as string);
  }
}
