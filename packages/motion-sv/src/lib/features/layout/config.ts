import { correctBorderRadius } from '@/projection/styles/scale-border-radius.js';
import { correctBoxShadow } from '@/projection/styles/scale-box-shadow.js';

export const defaultScaleCorrector = {
	borderRadius: {
		...correctBorderRadius,
		applyTo: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'],
	},
	borderTopLeftRadius: correctBorderRadius,
	borderTopRightRadius: correctBorderRadius,
	borderBottomLeftRadius: correctBorderRadius,
	borderBottomRightRadius: correctBorderRadius,
	boxShadow: correctBoxShadow,
};
