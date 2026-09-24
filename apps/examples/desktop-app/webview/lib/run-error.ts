import {
	isCredentialFailure,
	resolveCredentialFailureHint,
} from "@/hooks/chat-session/helpers";
import { t } from "@/lib/i18n";

/** The same presentation for live failures and restored transcript errors. */
export function formatRunError(detail: string, providerId = ""): string {
	const description = detail.trim();
	const guidance = resolveCredentialFailureHint(providerId);
	const looksCredentialRelated =
		!description || isCredentialFailure(description);
	const runFailedPrefix = t("The run failed:");
	const alreadyHasPrefix =
		description.startsWith("The run failed") ||
		description.startsWith("运行失败") ||
		(Boolean(runFailedPrefix) && description.startsWith(runFailedPrefix.trim()));
	const translatedDescription = t(description);
	return [
		description
			? alreadyHasPrefix
				? description
				: `${runFailedPrefix} ${translatedDescription}`
			: t("The run failed before a response was produced."),
		looksCredentialRelated &&
		!translatedDescription.includes(guidance) &&
		!description.includes(guidance)
			? guidance
			: "",
	]
		.filter(Boolean)
		.join(" ");
}
