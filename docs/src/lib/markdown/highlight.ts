import { createHighlighter, type Highlighter } from "shiki";

const LANGS = ["svelte", "typescript", "javascript", "html", "css", "json", "shellscript"] as const;

let highlighter: Promise<Highlighter> | undefined;

/**
 * Highlights code at build time, as a `<pre class="shiki">`, with light and dark colours as CSS variables (see
 * `.shiki` in app.css).
 */
export async function highlight(code: string, lang = "svelte") {
	highlighter ??= createHighlighter({ themes: ["github-light-default", "github-dark-default"], langs: [...LANGS] });
	const shiki = await highlighter;
	const known = (shiki.getLoadedLanguages() as string[]).includes(lang);
	return shiki.codeToHtml(code.trimEnd(), {
		lang: known ? lang : "text",
		themes: { light: "github-light-default", dark: "github-dark-default" },
		defaultColor: false,
	});
}

/** Just the highlighted `<code>`, for a markdown code block, whose `<pre>` is the blueprint's own. */
export async function highlightCode(code: string, lang = "svelte") {
	return (await highlight(code, lang)).replace(/^<pre[^>]*>|<\/pre>$/g, "");
}
