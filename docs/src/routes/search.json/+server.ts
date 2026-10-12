import { json } from "@sveltejs/kit";
import GithubSlugger from "github-slugger";
import type { SearchPage } from "#lib/search.js";

export const prerender = true;

const sources = import.meta.glob<string>("/src/routes/docs/**/+page.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

/** Markdown and Svelte markup, reduced to the words a reader would search for. */
function plainText(markdown: string) {
	return markdown
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/<script[\s\S]*?<\/script>/g, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, " ")
		.replace(/[`*_>|#]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function toPage(path: string, source: string): SearchPage {
	const slug = path.slice("/src/routes/docs".length, -"/+page.md".length);
	const href = `/docs${slug}`;
	const [, frontmatter = "", body = source] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
	const title = frontmatter.match(/^title: (.*)$/m)?.[1] ?? slug;
	const description = frontmatter.match(/^description: (.*)$/m)?.[1] ?? "";

	// The same ids as rehype-slug gives the page's headings
	const slugger = new GithubSlugger();
	const sections = body.split(/^(?=#{2,4} )/m).map((chunk) => {
		const heading = chunk.match(/^#{2,4} (.*)$/m)?.[1]?.replace(/`/g, "") ?? "";
		const text = plainText(heading ? chunk.slice(chunk.indexOf("\n")) : `${description} ${chunk}`);
		return { heading, href: heading ? `${href}#${slugger.slug(heading)}` : href, text };
	});
	return { title, href, sections };
}

export const GET = () => json(Object.entries(sources).map(([path, source]) => toPage(path, source)));
