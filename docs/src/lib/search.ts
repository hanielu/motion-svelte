export interface SearchSection {
	/** Empty for the page's introduction. */
	heading: string;
	href: string;
	text: string;
}

export interface SearchPage {
	title: string;
	href: string;
	sections: SearchSection[];
}

export interface SearchResult {
	page: string;
	heading: string;
	href: string;
	excerpt: string;
}

/** Ranks sections by where the query appears: page title, then heading, then text. */
export function search(pages: SearchPage[], query: string, limit = 12): SearchResult[] {
	const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
	if (!terms.length) return [];

	const scored: Array<{ score: number; result: SearchResult }> = [];
	for (const page of pages) {
		for (const section of page.sections) {
			const title = page.title.toLowerCase();
			const heading = section.heading.toLowerCase();
			const text = section.text.toLowerCase();
			let score = 0;
			for (const term of terms) {
				if (title.includes(term)) score += 10;
				else if (heading.includes(term)) score += 5;
				else if (text.includes(term)) score += 1;
				else {
					score = 0;
					break;
				}
			}
			if (!score) continue;
			const at = text.indexOf(terms[0]);
			const start = Math.max(0, at - 40);
			const excerpt =
				(start ? "…" : "") + section.text.slice(start, start + 140) + (start + 140 < text.length ? "…" : "");
			scored.push({ score, result: { page: page.title, heading: section.heading, href: section.href, excerpt } });
		}
	}
	return scored
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map(({ result }) => result);
}
