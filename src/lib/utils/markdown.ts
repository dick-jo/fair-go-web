import { marked } from 'marked';

export function processMarkdown(content: string): string {
	return marked.parse(content, {
		breaks: true,
		gfm: true,
		async: false
	}) as string;
}
