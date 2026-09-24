import zhCN from "../locales/zh-CN.json";

const dictionary: Record<string, string> = zhCN as Record<string, string>;

/**
 * 简体中文本地化翻译函数
 *
 * @param text 待翻译的英文原文
 * @param params 动态插值参数，例如 { count: 3 }
 * @returns 翻译后的简体中文；如果字典中不存在，则安全回退返回英文原文
 */
export function t(text: string, params?: Record<string, string | number>): string {
	if (!text) return "";
	let translation = dictionary[text] ?? text;
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			translation = translation.replaceAll(`{${key}}`, String(value));
		}
	}
	return translation;
}

export default t;
