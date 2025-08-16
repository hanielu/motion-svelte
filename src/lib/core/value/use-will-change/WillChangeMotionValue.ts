import { acceleratedValues, MotionValue, transformProps } from "motion-dom";
import type { WillChange } from "./types.js";

export class WillChangeMotionValue extends MotionValue<string> implements WillChange {
  private isEnabled = false;

  add(name: string) {
    if (transformProps.has(name) || acceleratedValues.has(name)) {
      this.isEnabled = true;
      this.update();
    }
  }

  private update() {
    this.set(this.isEnabled ? "transform" : "auto");
  }
}
