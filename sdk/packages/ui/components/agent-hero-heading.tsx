"use client";

import { useEffect, useState } from "react";
import { uiText } from "./ui-text.js";

const HERO_VERBS = ["build", "create", "fix", "know"] as const;
const HERO_CYCLE_MS = 5000;

export function AgentHeroHeading() {
	const [verbIndex, setVerbIndex] = useState(0);

	useEffect(() => {
		const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
		if (media?.matches) return;
		const interval = window.setInterval(() => {
			setVerbIndex((current) => (current + 1) % HERO_VERBS.length);
		}, HERO_CYCLE_MS);
		return () => window.clearInterval(interval);
	}, []);

	const verb = HERO_VERBS[verbIndex];
	const verbText = uiText(verb);
	// "{verb}" marks where the animated word goes, so languages can reorder it.
	const [prefix, suffix = ""] = uiText("What would you like to {verb}?").split(
		"{verb}",
	);

	return (
		<h1
			aria-label={uiText("What would you like to build?")}
			className="cline-ui-agent-hero-heading"
		>
			<span aria-hidden="true">
				{prefix}
				<span className="cline-ui-agent-hero-heading__word" key={verb}>
					{Array.from(verbText).map((character, index) => (
						<span
							className="cline-ui-agent-hero-heading__character"
							// biome-ignore lint/suspicious/noArrayIndexKey: the keyed word remounts as a unit and character positions never reorder
							key={`${verb}-${index}`}
							style={{ animationDelay: `${index * 45}ms` }}
						>
							{character}
						</span>
					))}
				</span>
				{suffix}
			</span>
		</h1>
	);
}
