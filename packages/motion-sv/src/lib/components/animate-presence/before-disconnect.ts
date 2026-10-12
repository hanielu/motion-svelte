type Snapshot = {
	el: Element;
	rect: DOMRect;
	clone: HTMLElement;
	mountInFlow: () => void; // insert at the same DOM index
	mountFixed: () => void; // overlay at same screen coords
};
type Listener = (s: Snapshot) => void;

const subsMap = new WeakMap<Element, Set<Listener>>();
const onceMap = new WeakMap<Listener, boolean>();
const watched = new Set<Element>();
const seen = new WeakSet<Element>();
let patched = false;

export function onBeforeDisconnect(el: Element, fn: Listener, opts?: { once?: boolean }) {
	if (!hasDOM()) return () => {};
	ensurePatched();

	let set = subsMap.get(el);
	if (!set) subsMap.set(el, (set = new Set()));
	set.add(fn);
	watched.add(el);
	onceMap.set(fn, !!opts?.once);

	// defer unsubscribe so Svelte cleanup doesn’t preempt removal
	return (immediate = false) => {
		const dispose = () => {
			const s = subsMap.get(el);
			if (!s) return;
			s.delete(fn);
			onceMap.delete(fn);
			if (s.size === 0) {
				subsMap.delete(el);
				watched.delete(el);
			}
		};
		immediate ? dispose() : setTimeout(dispose, 0);
	};
}

function hasDOM() {
	return typeof window !== "undefined" && typeof document !== "undefined";
}

function ensurePatched() {
	if (patched || !hasDOM()) return;
	patched = true;

	const patch = (obj: any, key: string, wrap: (orig: any) => any) => {
		const orig = obj?.[key];
		if (!orig) return;
		obj[key] = wrap(orig);
	};

	const snapUnder = (node: Node) => {
		if (node.nodeType !== 1) return;
		const el = node as Element;
		if (watched.has(el)) fire(el);
		for (const w of watched) if (w !== el && el.contains(w)) fire(w);
	};

	const fire = (el: Element) => {
		if (seen.has(el)) return;
		const subs = subsMap.get(el);
		if (!subs || subs.size === 0) return;
		seen.add(el);

		const rect = el.getBoundingClientRect();
		const clone = el.cloneNode(true) as HTMLElement;
		inlineComputedStylesDeep(el as HTMLElement, clone);

		// capture DOM position
		const parent = el.parentNode as (Node & ParentNode) | null;
		const next = el.nextSibling;
		const prev = el.previousSibling;
		const index = parent ? Array.prototype.indexOf.call(parent.childNodes, el) : -1;

		const isNodeConnected = (n: Node | null) =>
			!!n && ("isConnected" in n ? (n as any).isConnected : document.contains(n));

		const mountFixed = () => {
			document.body.appendChild(clone);
			Object.assign(clone.style, {
				position: "fixed",
				top: `${rect.top}px`,
				left: `${rect.left}px`,
				width: `${rect.width}px`,
				height: `${rect.height}px`,
				margin: "0",
				pointerEvents: "none",
				zIndex: "2147483647",
			} as Partial<CSSStyleDeclaration>);
		};

		const mountInFlow = () => {
			const p = isNodeConnected(parent) ? parent! : null;
			if (!p) {
				mountFixed();
				return;
			}
			try {
				if (next && next.parentNode === p) {
					p.insertBefore(clone, next);
					return;
				}
				if (prev && prev.parentNode === p) {
					const ref = prev.nextSibling; // after prev
					p.insertBefore(clone, ref);
					return;
				}
				if (index >= 0) {
					const ref = p.childNodes[index] || null; // same slot if possible
					p.insertBefore(clone, ref);
					return;
				}
				p.appendChild(clone); // last resort
			} catch {
				mountFixed();
			}
		};

		// deliver next frame to ignore pure moves
		requestAnimationFrame(() => {
			if (!document.contains(el)) {
				const snap: Snapshot = { el, rect, clone, mountInFlow, mountFixed };
				const toDelete: Listener[] = [];
				for (const fn of subs) {
					fn(snap);
					if (onceMap.get(fn)) toDelete.push(fn);
				}
				if (toDelete.length) {
					for (const fn of toDelete) {
						subs.delete(fn);
						onceMap.delete(fn);
					}
					if (subs.size === 0) {
						subsMap.delete(el);
						watched.delete(el);
					}
				}
			}
		});

		queueMicrotask(() => seen.delete(el));
	};

	if (typeof Element !== "undefined") {
		patch(
			Element.prototype,
			"remove",
			(orig: Function) =>
				function (this: Element) {
					if (document.contains(this)) snapUnder(this);
					return orig.call(this);
				}
		);
		patch(
			Element.prototype,
			"replaceWith",
			(orig: Function) =>
				function (this: Element, ...nodes: (Node | string)[]) {
					if (document.contains(this)) snapUnder(this);
					return orig.call(this, ...nodes);
				}
		);
	}
	if (typeof Node !== "undefined") {
		patch(
			Node.prototype,
			"removeChild",
			(orig: Function) =>
				function <T extends Node>(this: Node, child: T) {
					if (document.contains(child)) snapUnder(child);
					return orig.call(this, child);
				}
		);
		patch(
			Node.prototype,
			"replaceChild",
			(orig: Function) =>
				function <T extends Node>(this: Node, n: T, o: T) {
					if (document.contains(o)) snapUnder(o);
					return orig.call(this, n, o);
				}
		);
	}
	try {
		const desc = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
		if (desc?.set) {
			Object.defineProperty(Element.prototype, "innerHTML", {
				...desc,
				set(this: Element, v: string) {
					if ((v ?? "") === "") snapUnder(this);
					return desc.set!.call(this, v);
				},
			});
		}
	} catch {}
}

function inlineComputedStylesDeep(src: HTMLElement, dst: HTMLElement) {
	const copy = (a: Element, b: Element) => {
		const cs = getComputedStyle(a);
		const st = (b as HTMLElement).style;
		st.cssText = "";
		for (const prop of cs as any as Iterable<string>) {
			st.setProperty(prop, cs.getPropertyValue(prop), cs.getPropertyPriority(prop));
		}
	};
	copy(src, dst);
	const A = src.querySelectorAll("*"),
		B = dst.querySelectorAll("*");
	for (let i = 0; i < A.length; i++) copy(A[i], B[i]);
}
