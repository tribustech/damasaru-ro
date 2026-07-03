import { marked } from 'marked'

// Strapi's `richtext` field stores Markdown, but the article/event bodies are
// rendered via dangerouslySetInnerHTML — so convert to HTML at the render
// boundary. Runs server-side (organisms are Server Components). Content is
// authored by trusted editors in the CMS, same trust model as before.
marked.setOptions({ gfm: true, breaks: false })

export function mdToHtml(md: string | null | undefined): string {
  if (!md) return ''
  // Seed content is already HTML (<p>…</p>); marked passes block-level HTML
  // through untouched, so this is safe for both Markdown and legacy HTML bodies.
  return marked.parse(md, { async: false }) as string
}
