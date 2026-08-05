// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://awakendiscovery.co.uk",
	trailingSlash: "never",
	integrations: [
		sitemap({
			filter: (page) =>
				!page.includes("/style-guide") &&
				!page.includes("/thank-you") &&
				!page.includes("/bulk-thank-you"),
		}),
	],
});
