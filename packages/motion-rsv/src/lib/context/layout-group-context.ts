import { Context } from "runed";
import type { NodeGroup } from "../projection/node/group.js";

export interface LayoutGroupContextProps {
  id?: string;
  group?: NodeGroup;
  forceRender?: VoidFunction;
}

export const LayoutGroupContext = Context.boxed<LayoutGroupContextProps>("LayoutGroupContext", {});
