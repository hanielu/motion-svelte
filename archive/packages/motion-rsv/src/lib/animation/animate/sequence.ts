import { type AnimationPlaybackControlsWithThen, type AnimationScope, spring } from "motion-dom";
import { createAnimationsFromSequence } from "../sequence/create.js";
import type { AnimationSequence, SequenceOptions } from "../sequence/types.js";
import { animateSubject } from "./subject.js";

export function animateSequence(sequence: AnimationSequence, options?: SequenceOptions, scope?: AnimationScope) {
	const animations: AnimationPlaybackControlsWithThen[] = [];

	const animationDefinitions = createAnimationsFromSequence(sequence, options, scope, { spring });

	animationDefinitions.forEach(({ keyframes, transition }, subject) => {
		animations.push(...animateSubject(subject, keyframes, transition));
	});

	return animations;
}
