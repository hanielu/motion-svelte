import { Feature } from "../Feature.js";

let id = 0;

export class ExitAnimationFeature extends Feature<unknown> {
  private id: number = id++;

  update() {
    if (!this.node.presenceContext) return;

    const { isPresent, onExitComplete } = this.node.presenceContext;
    const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};

    if (!this.node.animationState || isPresent.current === prevIsPresent?.current) {
      return;
    }

    const exitAnimation = this.node.animationState.setActive("exit", !isPresent.current);

    if (onExitComplete && !isPresent.current) {
      exitAnimation.then(() => {
        onExitComplete(this.id);
      });
    }
  }

  mount() {
    const { register, onExitComplete } = this.node.presenceContext || {};

    if (onExitComplete) {
      onExitComplete(this.id);
    }

    if (register) {
      this.unmount = register(this.id);
    }
  }

  unmount() {}
}
