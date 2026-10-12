import type { Component } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

export type ElementType = keyof SvelteHTMLElements;

export type AsTag = keyof SvelteHTMLElements | Component;
