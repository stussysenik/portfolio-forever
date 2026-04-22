import { writable } from 'svelte/store';

export type MediaPlaybackType = 'video' | 'gif' | 'embed';

interface RegisteredMedia {
  id: string;
  type: MediaPlaybackType;
  element: HTMLElement;
  intersectionRatio: number;
}

/** Viewport-based playback governance */
export function createViewportMediaStore() {
  const activeVideoId = writable<string | null>(null);
  const activeGifIds = writable<Set<string>>(new Set());
  const activeEmbedId = writable<string | null>(null);
  
  const registeredMedia = new Map<string, RegisteredMedia>();
  let observer: IntersectionObserver | null = null;

  if (typeof window !== 'undefined') {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).dataset.mediaId;
        if (!id) return;

        const media = registeredMedia.get(id);
        if (media) {
          media.intersectionRatio = entry.intersectionRatio;
          updatePlayback();
        }
      });
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1.0]
    });
  }

  function updatePlayback() {
    const allMedia = Array.from(registeredMedia.values());
    
    // 1. Governance for Videos (Max 1)
    const videos = allMedia
      .filter(m => m.type === 'video')
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    
    const topVideo = videos[0];
    if (topVideo && topVideo.intersectionRatio > 0) {
      activeVideoId.set(topVideo.id);
    } else {
      activeVideoId.set(null);
    }

    // 2. Governance for GIFs (Max 3)
    const gifs = allMedia
      .filter(m => m.type === 'gif')
      .filter(m => m.intersectionRatio > 0)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      .slice(0, 3);
    
    activeGifIds.set(new Set(gifs.map(g => g.id)));

    // 3. Governance for Embeds (Max 1)
    const embeds = allMedia
      .filter(m => m.type === 'embed')
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    
    const topEmbed = embeds[0];
    if (topEmbed && topEmbed.intersectionRatio > 0.5) {
      activeEmbedId.set(topEmbed.id);
    } else {
      activeEmbedId.set(null);
    }
  }

  return {
    activeVideoId,
    activeGifIds,
    activeEmbedId,
    register(element: HTMLElement, id: string, type: MediaPlaybackType) {
      element.dataset.mediaId = id;
      registeredMedia.set(id, { id, type, element, intersectionRatio: 0 });
      observer?.observe(element);
      
      return () => {
        observer?.unobserve(element);
        registeredMedia.delete(id);
        updatePlayback();
      };
    }
  };
}

export const viewportMediaStore = createViewportMediaStore();
