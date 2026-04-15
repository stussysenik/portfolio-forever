export type MathSegment =
	| { type: 'text'; value: string }
	| { type: 'math'; value: string; displayMode: boolean };

/**
 * Split a string into text + math segments. Supports `$$...$$` block math
 * and `$...$` inline math. `\$` escapes a literal dollar sign.
 * Unmatched delimiters degrade gracefully to text.
 */
export function parseMath(input: string): MathSegment[] {
	if (!input) return [{ type: 'text', value: '' }];

	const out: MathSegment[] = [];
	let buf = '';
	let i = 0;
	const len = input.length;

	const flushText = () => {
		if (buf) {
			out.push({ type: 'text', value: buf });
			buf = '';
		}
	};

	while (i < len) {
		const ch = input[i];

		if (ch === '\\' && input[i + 1] === '$') {
			buf += '$';
			i += 2;
			continue;
		}

		if (ch === '$' && input[i + 1] === '$') {
			const end = input.indexOf('$$', i + 2);
			if (end === -1) {
				buf += '$$';
				i += 2;
				continue;
			}
			flushText();
			out.push({ type: 'math', value: input.slice(i + 2, end), displayMode: true });
			i = end + 2;
			continue;
		}

		if (ch === '$') {
			let end = i + 1;
			while (end < len) {
				if (input[end] === '\\' && input[end + 1] === '$') {
					end += 2;
					continue;
				}
				if (input[end] === '$') break;
				end++;
			}
			if (end >= len) {
				buf += '$';
				i += 1;
				continue;
			}
			flushText();
			out.push({
				type: 'math',
				value: input.slice(i + 1, end).replace(/\\\$/g, '$'),
				displayMode: false
			});
			i = end + 1;
			continue;
		}

		buf += ch;
		i++;
	}

	flushText();
	return out.length ? out : [{ type: 'text', value: '' }];
}
