export type CachedCommand = {
	action: string;
	args: Record<string, unknown>;
};

export class LRUCache<V> {
	private max: number;
	private map = new Map<string, V>();

	constructor(max = 20) {
		this.max = max;
	}

	get(key: string): V | undefined {
		const value = this.map.get(key);
		if (value === undefined) return undefined;
		this.map.delete(key);
		this.map.set(key, value);
		return value;
	}

	set(key: string, value: V): void {
		if (this.map.has(key)) this.map.delete(key);
		this.map.set(key, value);
		if (this.map.size > this.max) {
			const oldest = this.map.keys().next().value;
			if (oldest !== undefined) this.map.delete(oldest);
		}
	}

	clear(): void {
		this.map.clear();
	}

	get size(): number {
		return this.map.size;
	}
}

export const commandCache = new LRUCache<CachedCommand>(20);
