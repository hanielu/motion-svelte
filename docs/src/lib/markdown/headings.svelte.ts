import { createContext } from "svelte";

export interface Heading {
	id: string;
	text: string;
	level: number;
	element: HTMLElement;
}

/** The headings of the page being read, which its article publishes for the table of contents. */
export class PageHeadings {
	current = $state.raw<Heading[]>([]);
}

export const [getPageHeadings, setPageHeadings] = createContext<PageHeadings>();
