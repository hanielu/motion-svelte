import { language as bash } from "@twinkleplop/bash";
import { escape_html } from "@twinkleplop/core";
import { language as svelte } from "@twinkleplop/svelte";
import { language as typescript } from "@twinkleplop/typescript";

const languages: Record<string, (code: string) => string> = {
	svelte: svelte(),
	typescript: typescript(),
	shellscript: bash(),
};

/**
 * Highlights code at build time, as a `<pre class="twinkleplop">` with a class per token. Their colours come from
 * the theme imported in the root layout.
 */
export function highlight(code: string, lang = "svelte") {
	const source = code.trimEnd();
	return languages[lang]?.(source) ?? `<pre class="twinkleplop"><code>${escape_html(source)}</code></pre>`;
}

/** Just the highlighted `<code>`, for a markdown code block, whose `<pre>` is the blueprint's own. */
export function highlightCode(code: string, lang = "svelte") {
	return highlight(code, lang).replace(/^<pre[^>]*>|<\/pre>$/g, "");
}
