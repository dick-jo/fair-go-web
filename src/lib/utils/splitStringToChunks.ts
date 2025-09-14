export function splitStringToChunks(text: string, chunkSize: number): string[] {
	const words = text.trim().split(/\s+/);
	const chunks: string[] = [];

	for (let i = 0; i < words.length; i += chunkSize) {
		chunks.push(words.slice(i, i + chunkSize).join(' '));
	}

	return chunks;
}
