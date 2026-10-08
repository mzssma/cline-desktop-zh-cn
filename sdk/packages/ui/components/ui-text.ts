/**
 * [zh-CN fork] Host-provided UI text translation for @cline/ui components.
 *
 * The desktop app registers its `t()` on `globalThis.__CLINE_UI_TRANSLATE__`
 * (see apps/examples/desktop-app/webview/lib/i18n.ts). When nothing is
 * registered (tests, other hosts) the English source text is returned, with
 * `{name}` placeholders filled in, so upstream behaviour is unchanged.
 */
type UiTranslate = (
	text: string,
	params?: Record<string, string | number>,
) => string;

export function uiText(
	text: string,
	params?: Record<string, string | number>,
): string {
	const translate = (globalThis as { __CLINE_UI_TRANSLATE__?: UiTranslate })
		.__CLINE_UI_TRANSLATE__;
	if (typeof translate === "function") return translate(text, params);
	let result = text;
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			result = result.replaceAll(`{${key}}`, String(value));
		}
	}
	return result;
}
