// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	site: 'https://agentguides.dev',
	integrations: [
		icon(),
		sitemap(),
		starlight({
			components: {
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			title: 'AI Agents & Agentic Workflows Guide',
			description: 'A free, code-first reference for developers building AI agents and agentic systems. Covers MCP, LangChain, CrewAI, AutoGen, prompt engineering, and agent design patterns. Updated 2026.',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: false,
			},
			social: {
				github: 'https://github.com/Sero01/ai-agents-guide',
			},
			editLink: {
				baseUrl: 'https://github.com/Sero01/ai-agents-guide/edit/main/site/',
			},
			customCss: ['./src/styles/custom.css'],
			head: [
				// Google Fonts — Cormorant Garamond (serif), Libre Franklin (sans), JetBrains Mono
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Franklin:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap',
					},
				},
				// SEO meta tags applied to all Starlight doc pages
				{
					tag: 'meta',
					attrs: { name: 'keywords', content: 'AI, AI agents, AI guide, AI tools, artificial intelligence, agentic workflows, AI automation, MCP, Model Context Protocol, LangChain, CrewAI, AutoGen, AI frameworks, prompt engineering, multi-agent systems, AI agent tutorial, build AI agents, AI development, LLM agents, AI tools guide, AI agents 2026' },
				},
				{
					tag: 'meta',
					attrs: { name: 'author', content: 'Parvez Ahmed' },
				},
				{
					tag: 'meta',
					attrs: { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
				},
				{
					tag: 'meta',
					attrs: { name: 'theme-color', content: '#0c0c0c' },
				},
				{
					tag: 'meta',
					attrs: { name: 'rating', content: 'general' },
				},
				// Open Graph
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://agentguides.dev/og-default.png' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image:alt', content: 'AI Agents Guide — Free, code-first guide to AI agents and AI tools' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:site_name', content: 'AgentGuide — AI Agents & AI Tools Guide' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:locale', content: 'en_US' },
				},
				// Twitter Card
				{
					tag: 'meta',
					attrs: { name: 'twitter:card', content: 'summary_large_image' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image', content: 'https://agentguides.dev/og-default.png' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image:alt', content: 'AI Agents Guide — Free, code-first guide to AI agents and AI tools' },
				},
				// Google AdSense
				{
					tag: 'script',
					attrs: {
						async: true,
						src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7347042268747630',
						crossorigin: 'anonymous',
					},
				},
				// JSON-LD: sitewide structured data
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						'name': 'AI Agents & Agentic Workflows Guide',
						'alternateName': ['AgentGuide', 'AI Agents Guide'],
						'url': 'https://agentguides.dev',
						'description': 'A free, code-first guide to AI agents, agentic workflows, MCP, LangChain, CrewAI, AutoGen, and agent design patterns. Updated 2026.',
						'inLanguage': 'en-US',
						'publisher': {
							'@type': 'Person',
							'name': 'Parvez Ahmed',
							'url': 'https://github.com/Sero01',
						},
					}),
				},
			],
			sidebar: [
				{
					label: 'Reviews',
					badge: { text: 'New', variant: 'tip' },
					items: [
						{ label: 'All Reviews', slug: 'reviews' },
						{ label: 'CrewAI vs LangGraph vs AutoGen', slug: 'reviews/crewai-vs-langgraph-vs-autogen' },
						{ label: 'Claude Code vs Cursor vs Codex', slug: 'reviews/claude-code-vs-cursor-vs-codex' },
					],
				},
				{
					label: 'Best Of',
					items: [
						{ label: 'All Lists', slug: 'best' },
						{ label: 'AI Agent Frameworks 2026', slug: 'best/ai-agent-frameworks-2026' },
						{ label: 'AI Engineer Certifications 2026', slug: 'best/ai-engineer-certifications-2026' },
						{ label: 'LLM Benchmark Comparison 2026', slug: 'best/llm-benchmark-comparison-2026' },
					],
				},
				{
					label: 'Build Tutorials',
					items: [
						{ label: 'All Tutorials', slug: 'build' },
						{ label: 'Research Agent with CrewAI', slug: 'build/research-agent-with-crewai' },
					],
				},
				{
					label: 'Leaderboard',
					badge: { text: 'New', variant: 'tip' },
					items: [
						{ label: 'AI Models Leaderboard', link: '/leaderboard/' },
					],
				},
				{
					label: 'Learn: AI Agents',
					items: [
						{ label: 'Overview', slug: 'learn' },
						{ label: 'Concepts & Architecture', slug: 'ai-agents' },
						{ label: 'Agent Patterns', slug: 'ai-agents/patterns' },
						{ label: 'Tokens & Context', slug: 'ai-agents/tokens-context' },
					],
				},
				{
					label: 'Learn: Agentic Workflows',
					items: [
						{ label: 'Overview', slug: 'agentic-workflows' },
						{ label: 'Multi-Agent Pipelines', slug: 'agentic-workflows/multi-agent' },
					],
				},
				{
					label: 'Learn: MCP',
					badge: { text: 'Hot', variant: 'tip' },
					items: [
						{ label: 'What is MCP?', slug: 'mcp' },
						{ label: 'Setup & Installation', slug: 'mcp/setup' },
						{ label: 'Available Servers', slug: 'mcp/servers' },
						{ label: 'Building MCP Servers', slug: 'mcp/building-servers' },
					],
				},
				{
					label: 'Learn: Frameworks',
					items: [
						{ label: 'Framework Comparison', slug: 'frameworks' },
						{ label: 'LangChain', slug: 'frameworks/langchain' },
						{ label: 'CrewAI', slug: 'frameworks/crewai' },
						{ label: 'AutoGen', slug: 'frameworks/autogen' },
					],
				},
				{
					label: 'Learn: More',
					items: [
						{ label: 'Getting Started', slug: 'getting-started' },
						{ label: 'Tools & Memory', slug: 'tools-memory' },
						{ label: 'Agent Instructions', slug: 'agent-instructions' },
						{ label: 'Prompt Engineering', slug: 'prompt-engineering' },
						{ label: 'Code Examples', slug: 'code-examples' },
					],
				},
				{
					label: 'Site',
					items: [
						{ label: 'About', slug: 'about' },
						{ label: 'Privacy Policy', slug: 'privacy' },
					],
				},
			],
		}),
	],
});
