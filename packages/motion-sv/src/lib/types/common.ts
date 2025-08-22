// import type { Component, DefineComponent, ExtractPropTypes, ExtractPublicPropTypes, IntrinsicElementAttributes, MaybeRef } from 'vue'

import type { Component } from 'svelte';
import type { HTMLElements, SVGElements } from './supported-elements.js';
import type { SvelteHTMLElements } from 'svelte/elements';

export type ElementType = keyof SvelteHTMLElements;

// export type ToRefs<T> = {
//   [K in keyof T]: MaybeRef<T[K]>
// }

// export type AsTag = keyof HTMLElements | SVGElements;
export type AsTag = keyof SvelteHTMLElements | Component;
