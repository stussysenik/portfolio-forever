// Portfolio Content Data
// Matches Ricardo Cabello's format: YYYY MM Title [links]

export interface Entry {
        year: number;
        month?: number;
        title: string;
        links?: { label: string; url: string }[];
        featured?: 'yellow' | 'green';
}

export const works: Entry[] = [
        { year: 2010, month: 4, title: 'Three.js', links: [{ label: 'link', url: '#' }, { label: 'wikipedia', url: '#' }], featured: 'yellow' },
        { year: 2006, month: 4, title: 'Mr.doob', links: [{ label: 'link', url: '#' }], featured: 'yellow' },
        { year: 2023, month: 4, title: "Midjourney's Baby Celebrities (bis)", links: [{ label: 'tweet', url: '#' }] },
        { year: 2023, month: 1, title: "Midjourney's Developers (bis)", links: [{ label: 'tweet', url: '#' }] },
        { year: 2022, month: 3, title: "Midjourney's Baby Celebrities", links: [{ label: 'tweet', url: '#' }] },
        { year: 2022, month: 3, title: "Midjourney's Developers", links: [{ label: 'tweet', url: '#' }] },
        { year: 2021, month: 3, title: 'Jumpy Dot', links: [{ label: 'link', url: '#' }, { label: 'tweet', url: '#' }] },
        { year: 2020, month: 10, title: '3D Comic', links: [{ label: 'link', url: '#' }] },
        { year: 2020, month: 9, title: '13kb-404', links: [{ label: 'link', url: '#' }, { label: 'tweet', url: '#' }] },
        { year: 2020, month: 7, title: 'Obsolidian', links: [{ label: 'link', url: '#' }, { label: 'tweet', url: '#' }] },
        { year: 2019, month: 10, title: "What You Don't Know", links: [{ label: 'link', url: '#' }, { label: 'tweet', url: '#' }, { label: 'article', url: '#' }] },
        { year: 2018, month: 11, title: '<model-viewer>', links: [{ label: 'link', url: '#' }], featured: 'green' },
        { year: 2017, month: 12, title: 'Crystal', links: [{ label: 'link', url: '#' }] },
        { year: 2017, month: 4, title: 'Under Neon Lights', links: [{ label: 'link', url: '#' }, { label: 'tweet', url: '#' }] },
        { year: 2016, month: 10, title: 'Web Unleashed 2016', links: [{ label: 'link', url: '#' }] },
        { year: 2016, month: 2, title: 'Broken Mantra', links: [{ label: 'link', url: '#' }] },
];

export const talks: Entry[] = [
        { year: 2024, month: 12, title: 'SIGGRAPH Asia 2024', links: [{ label: 'info', url: '#' }] },
        { year: 2024, month: 11, title: 'JSConf JP 2024', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }] },
        { year: 2024, month: 6, title: 'JSNation 2024', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }] },
        { year: 2023, month: 1, title: 'WebGL + WebGPU Meetup', links: [{ label: 'video', url: '#' }] },
        { year: 2022, month: 8, title: 'Nakame Meetup #1', links: [{ label: 'video', url: '#' }] },
        { year: 2019, month: 10, title: 'Nordic.js 2019', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }] },
        { year: 2019, month: 7, title: 'SIGGRAPH 2019', links: [{ label: 'info', url: '#' }] },
        { year: 2019, month: 5, title: 'Google I/O 2019', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }], featured: 'green' },
        { year: 2019, month: 3, title: 'GDC 2019', links: [{ label: 'info', url: '#' }] },
        { year: 2018, month: 12, title: 'SIGGRAPH 2018', links: [{ label: 'info', url: '#' }] },
        { year: 2018, month: 10, title: 'Web Unleashed 2018', links: [{ label: 'info', url: '#' }] },
        { year: 2018, month: 9, title: 'Generate 2018', links: [{ label: 'info', url: '#' }] },
        { year: 2018, month: 9, title: 'CAMP 2018', links: [{ label: 'info', url: '#' }], featured: 'green' },
        { year: 2018, month: 8, title: 'SIGGRAPH 2018', links: [{ label: 'info', url: '#' }, { label: 'video', url: '#' }] },
];

export const interviews: Entry[] = [
        { year: 2015, month: 8, title: 'z.ultranoir.com', links: [{ label: 'link', url: '#' }] },
        { year: 2015, month: 3, title: 'cindyhwang.github.io', links: [{ label: 'link', url: '#' }] },
        { year: 2013, month: 1, title: 'realtimerendering.com', links: [{ label: 'link', url: '#' }] },
        { year: 2012, month: 3, title: 'creativecodingpodcast.com', links: [{ label: 'link', url: '#' }] },
        { year: 2011, month: 12, title: 'ubuntu.com', links: [{ label: 'link', url: '#' }] },
        { year: 2011, month: 7, title: 'hacks.mozilla.org', links: [{ label: 'link', url: '#' }] },
        { year: 2009, month: 9, title: 'ajaxian.com', links: [{ label: 'link', url: '#' }] },
        { year: 2008, month: 1, title: 'thefwa.com', links: [{ label: 'link', url: '#' }] },
];

export const socialLinks = [
        { label: 'bsky', url: 'https://bsky.app' },
        { label: 'github', url: 'https://github.com' },
        { label: 'instagram', url: 'https://instagram.com' },
        { label: 'soundcloud', url: 'https://soundcloud.com' },
        { label: 'x', url: 'https://x.com' },
];

export const siteConfig = {
        name: 'YOUR NAME',
        title: 'YOUR NAME',
        tagline: 'Creative Technologist',
};
