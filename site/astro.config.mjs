// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://agentworkflows.dev',
  integrations: [
    starlight({
      title: 'Agent Workflows',
      description: 'Learn how to build AI agents and agentic workflows',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      customCss: [
        './src/styles/custom.css',
      ],
      head: [
        {
          tag: 'script',
          attrs: {
            async: true,
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-REPLACE_ME',
            crossorigin: 'anonymous',
          },
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Sero01/ai-agents-guide' },
      ],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Getting Started', slug: 'getting-started' },
          ],
        },
        {
          label: 'AI Agents',
          items: [
            { label: 'What are AI Agents?', slug: 'ai-agents' },
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
          items: [
            { label: 'What is MCP?', slug: 'mcp' },
            { label: 'Setup & Configuration', slug: 'mcp/setup' },
            { label: 'Available Servers', slug: 'mcp/servers' },
            { label: 'Building MCP Servers', slug: 'mcp/building-servers' },
          ],
        },
        {
          label: 'Frameworks',
          items: [
            { label: 'Comparison', slug: 'frameworks' },
            { label: 'LangChain', slug: 'frameworks/langchain' },
            { label: 'CrewAI', slug: 'frameworks/crewai' },
            { label: 'AutoGen', slug: 'frameworks/autogen' },
          ],
        },
        {
          label: 'Tools & Memory',
          items: [
            { label: 'Overview', slug: 'tools-memory' },
          ],
        },
        {
          label: 'Agent Instructions',
          items: [
            { label: 'CLAUDE.md Pattern', slug: 'agent-instructions' },
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
            { label: 'Examples', slug: 'code-examples' },
          ],
        },
      ],
    }),
    sitemap(),
  ],
});
