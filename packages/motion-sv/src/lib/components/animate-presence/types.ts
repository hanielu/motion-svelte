export interface AnimatePresenceProps {
	// Animation mode: wait (wait for the previous one to complete), popLayout (popup layout), sync (synchronous)
	mode?: 'wait' | 'popLayout' | 'sync';
	// Whether to show the initial animation
	initial?: boolean;
	as?: string;
	custom?: any;
	onExitComplete?: VoidFunction;
	anchorX?: 'left' | 'right';
}
