import { z } from 'zod';
import { registry, type RegistryKey } from './registry';

export type AnthropicToolSpec = {
	name: string;
	description: string;
	input_schema: Record<string, unknown>;
};

export function getRegistrySchema(): AnthropicToolSpec[] {
	return (Object.keys(registry) as RegistryKey[]).map((key) => {
		const spec = registry[key];
		const json = z.toJSONSchema(spec.parameters) as Record<string, unknown>;
		return {
			name: spec.name,
			description: spec.description,
			input_schema: json,
		};
	});
}

export function getRegistrySummary(): { name: string; description: string }[] {
	return (Object.keys(registry) as RegistryKey[]).map((key) => ({
		name: registry[key].name,
		description: registry[key].description,
	}));
}
