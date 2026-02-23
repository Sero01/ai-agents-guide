// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://agentguides.dev',
	integrations: [
		sitemap(),
		starlight({
			components: {
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			title: 'AI Agents Guide — AI Agents, AI Tools & Agentic Workflows',
			description: 'The most comprehensive, free guide to AI agents, agentic workflows, AI tools, MCP, LangChain, CrewAI, AutoGen, prompt engineering, and advanced agent patterns. Code-first. Updated 2026.',
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
					attrs: { name: 'theme-color', content: '#4f46e5' },
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
					attrs: { property: 'og:image:alt', content: 'AI Agents Guide — Free comprehensive guide to AI agents and AI tools' },
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
					attrs: { name: 'twitter:image:alt', content: 'AI Agents Guide — Free comprehensive guide to AI agents and AI tools' },
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
						'@graph': [
							{
								'@type': 'WebSite',
								'name': 'AI Agents Guide — Complete AI Agents & AI Tools Guide',
								'alternateName': ['AgentGuide', 'AI Agents Guide', 'AI Guide', 'AI Tools Guide'],
								'url': 'https://agentguides.dev',
								'description': 'The most comprehensive free guide to AI agents, agentic workflows, AI tools, MCP, LangChain, CrewAI, AutoGen, and advanced agent patterns. Updated 2026.',
								'inLanguage': 'en-US',
								'publisher': {
									'@type': 'Person',
									'name': 'Parvez Ahmed',
									'url': 'https://github.com/Sero01',
								},
								'potentialAction': {
									'@type': 'SearchAction',
									'target': {
										'@type': 'EntryPoint',
										'urlTemplate': 'https://agentguides.dev/getting-started/?q={search_term_string}',
									},
									'query-input': 'required name=search_term_string',
								},
							},
							{
								'@type': 'Organization',
								'name': 'AgentGuide',
								'url': 'https://agentguides.dev',
								'logo': 'https://agentguides.dev/favicon.svg',
								'sameAs': [
									'https://github.com/Sero01/ai-agents-guide',
								],
							},
						],
					}),
				},
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started' },
					],
				},
				{
					label: 'AI Agents',
					items: [
						{ label: 'Concepts & Architecture', slug: 'ai-agents' },
						{ label: 'Agent Patterns', slug: 'ai-agents/patterns' },
						{ label: 'Tokens & Context', slug: 'ai-agents/tokens-context' },
					],
				},
				{
					label: 'Agentic Workflows',
					items: [
						{ label: 'Overview', slug: 'agentic-workflows' },
						{ label: 'Multi-Agent Pipelines', slug: 'agentic-workflows/multi-agent' },
					],
				},
				{
					label: 'MCP',
					badge: { text: 'Hot', variant: 'tip' },
					items: [
						{ label: 'What is MCP?', slug: 'mcp' },
						{ label: 'Setup & Installation', slug: 'mcp/setup' },
						{ label: 'Available Servers', slug: 'mcp/servers' },
						{ label: 'Building MCP Servers', slug: 'mcp/building-servers' },
					],
				},
				{
					label: 'Agent Frameworks',
					items: [
						{ label: 'Framework Comparison', slug: 'frameworks' },
						{ label: 'LangChain', slug: 'frameworks/langchain' },
						{ label: 'CrewAI', slug: 'frameworks/crewai' },
						{ label: 'AutoGen', slug: 'frameworks/autogen' },
					],
				},
				{
					label: 'Tools, Skills & Memory',
					items: [
						{ label: 'Overview', slug: 'tools-memory' },
					],
				},
				{
					label: 'Agent Instructions',
					items: [
						{ label: 'CLAUDE.md / AgentMD', slug: 'agent-instructions' },
					],
				},
				{
					label: 'Prompt Engineering',
					items: [
						{ label: 'For Agents', slug: 'prompt-engineering' },
					],
				},
				{
					label: 'Code Examples',
					items: [
						{ label: 'All Examples', slug: 'code-examples' },
					],
				},
			],
		}),
	],
});
