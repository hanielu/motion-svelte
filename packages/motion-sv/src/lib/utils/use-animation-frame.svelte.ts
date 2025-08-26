import { cancelFrame, frame } from "framer-motion/dom";
import type { FrameData } from "framer-motion/dom";

export type FrameCallback = (timestamp: number, delta: number) => void;

export function useAnimationFrame(callback: FrameCallback) {
	let initialTimestamp = 0;

	const provideTimeSinceStart = ({ timestamp, delta }: FrameData) => {
		if (!initialTimestamp) initialTimestamp = timestamp;

		callback(timestamp - initialTimestamp, delta);
	};

	$effect.pre(() => {
		frame.update(provideTimeSinceStart, true);
		return () => cancelFrame(provideTimeSinceStart);
	});
}
