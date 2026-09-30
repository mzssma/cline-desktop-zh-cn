"use client";

import { providerOffersModelTool } from "@cline/llms/browser";
import { useEffect, useState } from "react";
import {
	fetchProviderCatalog,
	subscribeToProviderCatalogInvalidation,
} from "@/lib/provider-model-catalog";
import { t } from "@/lib/i18n";

export function WebSearchProviderGuidance({
	onOpenModelProviders,
}: {
	onOpenModelProviders?: () => void;
}) {
	const [readyProviders, setReadyProviders] = useState<string[] | null>(null);
	useEffect(() => {
		let generation = 0;
		const load = () => {
			const request = ++generation;
			void fetchProviderCatalog()
				.then((payload) => {
					if (request !== generation) return;
					setReadyProviders(
						(payload.providers ?? [])
							.filter(
								(provider) =>
									provider.enabled &&
									providerOffersModelTool(provider.id, "web_search"),
							)
							.map((provider) => provider.name),
					);
				})
				.catch(() => {
					// Preserve the last successful guidance during a temporary failure.
				});
		};
		const unsubscribe = subscribeToProviderCatalogInvalidation(load);
		load();
		return () => {
			generation++;
			unsubscribe();
		};
	}, []);
	if (readyProviders === null) return null;
	if (readyProviders.length > 0)
		return (
			<p className="text-xs text-muted-foreground">
				{t(
					"Ready to use with {providers} on models that support web search.",
					{ providers: readyProviders.join(", ") },
				)}
			</p>
		);
	return (
		<p className="text-xs text-amber-700 dark:text-amber-300">
			{t(
				"None of your connected providers support built-in web search, so this setting has no effect yet.",
			)}{" "}
			{onOpenModelProviders ? (
				<button
					type="button"
					className="underline underline-offset-2 hover:text-foreground"
					onClick={onOpenModelProviders}
				>
					{t("Connect a provider")}
				</button>
			) : (
				t("Connect a provider in Settings")
			)}{" "}
			{t("that supports it.")}
		</p>
	);
}
