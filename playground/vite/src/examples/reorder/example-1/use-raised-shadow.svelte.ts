import { animate, useMotionValue, type MotionValue } from "motion-sv";

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

export function useRaisedShadow(value: MotionValue<number>) {
	const boxShadow = useMotionValue(inactiveShadow);

	$effect(() => {
		let isActive = false;
		return value.on("change", (latest) => {
			const wasActive = isActive;
			isActive = latest !== 0;
			if (isActive !== wasActive) animate(boxShadow, isActive ? "5px 5px 10px rgba(0,0,0,0.3)" : inactiveShadow);
		});
	});

	return boxShadow;
}
