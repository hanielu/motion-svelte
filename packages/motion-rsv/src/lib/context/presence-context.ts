import { Context, type ReadableBox } from "runed";
import type { VariantLabels } from "../motion/types.js";

/**
 * @public
 */
export interface PresenceContextProps {
  id: string;
  isPresent: ReadableBox<boolean>;
  register: (id: string | number) => () => void;
  onExitComplete?: (id: string | number) => void;
  initial?: false | VariantLabels;
  custom?: any;
}

/**
 * @public
 */
export const PresenceContext = new Context<PresenceContextProps | null>("PresenceContext", null);
