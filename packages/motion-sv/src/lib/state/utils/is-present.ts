import { doneCallbacks } from '@/components/animate-presence/presence.svelte.js';
import type { VisualElement } from 'framer-motion';

export function isPresent(visualElement: VisualElement) {
	return !doneCallbacks.has(visualElement.current as Element);
}
