"use client";

import { type ProviderSection, readProviderSectionInUse } from "./sections";
import { t } from "@/lib/i18n";

/** Marks the Providers sub-page whose provider the chat currently uses. */
export function InUseBadge({ section }: { section: ProviderSection }) {
	if (readProviderSectionInUse() !== section) return null;
	return (
		<span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
			<span className="size-1.5 rounded-full bg-emerald-500" />
			{t("In use")}
		</span>
	);
}
