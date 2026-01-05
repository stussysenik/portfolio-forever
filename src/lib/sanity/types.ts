// Type definitions for Sanity content
import type { PortableTextBlock } from '@portabletext/types';

export interface SanityPost {
        _id: string;
        title: string;
        slug: string;
        publishedAt: string;
        excerpt?: string;
        tags?: string[];
        image?: {
                asset: {
                        _ref: string;
                };
        };
        body?: PortableTextBlock[];
}
