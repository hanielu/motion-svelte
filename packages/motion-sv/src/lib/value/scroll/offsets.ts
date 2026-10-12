import type {
	Edge,
	Intersection,
	NamedEdges,
	ProgressIntersection,
	ScrollOffset as ScrollOffsetDefinition,
} from "#lib/types/framer-motion.js";

export type ScrollOffset = ScrollOffsetDefinition;

/**
 * Preset scroll offsets matching framer-motion's ScrollOffset presets.
 * Use with useScroll's offset option to define scroll-linked animation ranges.
 *
 * @example
 * useScroll({ target: el, offset: ScrollOffset.Enter })
 */
export const ScrollOffset = {
	/** Progress 0→1 as target enters the container */
	Enter: [
		[0, 1],
		[1, 1],
	],
	/** Progress 0→1 as target exits the container */
	Exit: [
		[0, 0],
		[1, 0],
	],
	/** Progress 0→1 across any overlap between target and container */
	Any: [
		[1, 0],
		[0, 1],
	],
	/** Progress 0→1 while target is fully contained within the container */
	All: [
		[0, 0],
		[1, 1],
	],
} satisfies Record<string, ProgressIntersection[]>;

const namedEdges: Record<NamedEdges, number> = {
	start: 0,
	center: 0.5,
	end: 1,
};

function resolveEdge(edge: Edge, length: number, inset = 0) {
	let delta = 0;

	if (edge in namedEdges) {
		edge = namedEdges[edge as NamedEdges];
	}

	if (typeof edge === "string") {
		const asNumber = parseFloat(edge);

		if (edge.endsWith("px")) {
			delta = asNumber;
		} else if (edge.endsWith("%")) {
			edge = asNumber / 100;
		} else if (edge.endsWith("vw")) {
			delta = (asNumber / 100) * document.documentElement.clientWidth;
		} else if (edge.endsWith("vh")) {
			delta = (asNumber / 100) * document.documentElement.clientHeight;
		} else {
			edge = asNumber;
		}
	}

	if (typeof edge === "number") {
		delta = length * edge;
	}

	return inset + delta;
}

function resolveOffset(
	offset: Edge | Intersection | ProgressIntersection,
	containerLength: number,
	targetLength: number,
	targetInset: number
) {
	let offsetDefinition: ProgressIntersection | [Edge, Edge] = Array.isArray(offset) ? offset : [0, 0];

	if (typeof offset === "number") {
		offsetDefinition = [offset, offset];
	} else if (typeof offset === "string") {
		const edges = offset.trim();
		offsetDefinition = edges.includes(" ")
			? (edges.split(" ") as [Edge, Edge])
			: [edges as Edge, namedEdges[edges as NamedEdges] ? (edges as Edge) : `0`];
	}

	const targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
	const containerPoint = resolveEdge(offsetDefinition[1], containerLength);

	return targetPoint - containerPoint;
}

/**
 * A ViewTimeline range for a scroll offset. `points` are the range's start and end; `a` and `b` are how the progress
 * moves with the target and container lengths, so the direction can flip when the target is longer than the
 * container. `cover` marks the ViewTimeline's default range.
 */
export interface ViewTimelineRange {
	points: string[];
	a: number;
	b: number;
	cover: boolean;
}

const toIntersection = (o: ScrollOffset[number]) => {
	if (/v/u.test(o as string)) return [];
	const px = resolveOffset(o, 0, 0, 0);
	return [resolveOffset(o, 0, 1, 0) - px, px - resolveOffset(o, 1, 0, 0), px];
};

const toRange = ([t, c, px]: number[]) => !px && (c === 0 || c === 1) && `${c ? "entry" : "exit"}-crossing ${t * 100}%`;

/**
 * Maps a scroll offset to a ViewTimeline range. Returns undefined when the offset can't be expressed as one, which
 * means falling back to JS scroll tracking.
 *
 * Ported from framer-motion's internal render/dom/scroll/utils/offset-to-range.
 */
export function offsetToViewTimelineRange(offset: ScrollOffset = ScrollOffset.All): ViewTimelineRange | undefined {
	if (offset.length !== 2) return;

	const [start, end] = offset.map(toIntersection);
	const points = [toRange(start), toRange(end)];
	const a = end[0] - start[0];
	const b = start[1] - end[1];

	if (points[0] && points[1] && (a || b)) {
		return {
			points: points as string[],
			a,
			b,
			cover: !start[0] && a === 1 && b === 1,
		};
	}
}
