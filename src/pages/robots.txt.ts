import type { APIRoute } from "astro";

const ROBOTS_URL =
	"https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.txt";

export const GET: APIRoute = async ({ site }) => {
	const response = await fetch(ROBOTS_URL);
	const aiRobots = await response.text();

	const sitemapURL = new URL("sitemap-index.xml", site).href;

	const content = `
	${aiRobots}
User-agent: *
Allow: /

Sitemap: ${sitemapURL}`.trim();

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
