// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://agentworkflows.dev',
	integrations: [
		sitemap(),
		starlight({
			components: {
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			title: 'AI Agents & Agentic Workflows',
			description: 'The developer\'s guide to AI agents, agentic workflows, MCP, and the tools powering the next era of AI.',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: false,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Sero01/ai-agents-guide' },
			],
			editLink: {
				baseUrl: 'https://github.com/Sero01/ai-agents-guide/edit/main/site/',
			},
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: '/og-default.png' },
				},
				{
					tag: 'script',
					attrs: {
						// Google AdSense — replace with your publisher ID
						async: true,
						src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-REPLACE_ME',
						crossorigin: 'anonymous',
					},
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
