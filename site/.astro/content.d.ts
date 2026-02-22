declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.mdx': Promise<RenderResult>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof DataEntryMap | keyof ContentEntryMap;
	export type AnyEntryMap = DataEntryMap & ContentEntryMap;

	export type ContentEntryMap = {
		"docs": {
	"getting-started.md": {
		id: "getting-started.md";
	  slug: "getting-started";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"index.mdx": {
		id: "index.mdx";
	  slug: "index";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".mdx"] };
	"agent-instructions/index.md": {
		id: "agent-instructions/index.md";
	  slug: "agent-instructions";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"agentic-workflows/index.md": {
		id: "agentic-workflows/index.md";
	  slug: "agentic-workflows";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"agentic-workflows/multi-agent.md": {
		id: "agentic-workflows/multi-agent.md";
	  slug: "agentic-workflows/multi-agent";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"ai-agents/index.md": {
		id: "ai-agents/index.md";
	  slug: "ai-agents";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"ai-agents/patterns.md": {
		id: "ai-agents/patterns.md";
	  slug: "ai-agents/patterns";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"ai-agents/tokens-context.md": {
		id: "ai-agents/tokens-context.md";
	  slug: "ai-agents/tokens-context";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"code-examples/index.md": {
		id: "code-examples/index.md";
	  slug: "code-examples";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"frameworks/autogen.md": {
		id: "frameworks/autogen.md";
	  slug: "frameworks/autogen";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"frameworks/crewai.md": {
		id: "frameworks/crewai.md";
	  slug: "frameworks/crewai";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"frameworks/index.md": {
		id: "frameworks/index.md";
	  slug: "frameworks";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"frameworks/langchain.md": {
		id: "frameworks/langchain.md";
	  slug: "frameworks/langchain";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"mcp/building-servers.md": {
		id: "mcp/building-servers.md";
	  slug: "mcp/building-servers";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"mcp/index.md": {
		id: "mcp/index.md";
	  slug: "mcp";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"mcp/servers.md": {
		id: "mcp/servers.md";
	  slug: "mcp/servers";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"mcp/setup.md": {
		id: "mcp/setup.md";
	  slug: "mcp/setup";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"prompt-engineering/index.md": {
		id: "prompt-engineering/index.md";
	  slug: "prompt-engineering";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
	"tools-memory/index.md": {
		id: "tools-memory/index.md";
	  slug: "tools-memory";
	  body: string;
	  collection: "docs";
	  data: InferEntrySchema<"docs">;
	} & { render(): Render[".md"] };
};
	};

	export type DataEntryMap = {
		
	};

	export type CollectionEntry<C extends CollectionKey> = (AnyEntryMap)[C][keyof (AnyEntryMap)[C]];

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<ContentEntryMap[C]>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C>
	>(
		collection: C,
		entrySlug: E
	): E extends ValidContentEntrySlug<C> ? Promise<CollectionEntry<C>> : Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends CollectionKey, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: E) => entry is E
	): Promise<E[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C>
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C> ? Promise<CollectionEntry<C>> : Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C]
	>(entry: {
		collection: C;
		entryId: E;
	}): Promise<CollectionEntry<C>>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C>
	>(
		collection: C,
		entrySlug: E
	): E extends ValidContentEntrySlug<C> ? Promise<CollectionEntry<C>> : Promise<CollectionEntry<C> | undefined>;
	export function getEntry<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	/** This is a convenience function that always returns an array. */
	export function getEntries<C extends CollectionKey>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends CollectionKey>(
		entries: {
			collection: C;
			entryId: string;
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends CollectionKey>(
		entry: AnyEntryMap[C][string]
	): Promise<RenderResult>

	export function reference<C extends CollectionKey>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, CollectionEntry<C> | undefined, string>;

	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, CollectionEntry<C> | undefined, string>;

	export function isValidSlug<C extends keyof ContentEntryMap>(
		collection: C,
		slug: string
	): slug is ValidContentEntrySlug<C>;
}
