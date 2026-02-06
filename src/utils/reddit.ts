export type MediaKind = 'image' | 'video' | 'gif';

export type MediaItem = {
  id: string;
  type: MediaKind;
  url: string;
  poster?: string;
};

export type GalleryPost = {
  id: string;
  title: string;
  media: MediaItem[];
};

type RedditGalleryItem = {
  media_id: string;
};

type RedditMediaMetadata = {
  e?: string;
  s?: {
    u?: string;
  };
};

type RedditPreviewImage = {
  source?: {
    url?: string;
  };
  variants?: {
    gif?: {
      source?: {
        url?: string;
      };
    };
  };
};

type RedditPost = {
  id: string;
  title?: string;
  is_gallery?: boolean;
  gallery_data?: {
    items?: RedditGalleryItem[];
  };
  media_metadata?: Record<string, RedditMediaMetadata>;
  preview?: {
    images?: RedditPreviewImage[];
  };
  is_video?: boolean;
  media?: {
    reddit_video?: {
      fallback_url?: string;
      hls_url?: string;
    };
  };
  url_overridden_by_dest?: string;
  url?: string;
  post_hint?: string;
};

type RedditListing = {
  data?: {
    children?: { data?: RedditPost }[];
  };
};

const decodeHtml = (value: string) => value.replace(/&amp;/g, '&');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const hasImageExtension = (url: string) =>
  imageExtensions.some((ext) => url.toLowerCase().includes(ext));

const uniqueByUrl = (items: MediaItem[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
};

export function extractGalleryPosts(listing: RedditListing): GalleryPost[] {
  if (!listing?.data?.children) return [];

  return listing.data.children
    .map((child) => child?.data)
    .filter((post): post is RedditPost => Boolean(post))
    .map((post) => {
      const media: MediaItem[] = [];

      const galleryItems = post.gallery_data?.items;
      const mediaMetadata = post.media_metadata;
      if (post.is_gallery && galleryItems && mediaMetadata) {
        galleryItems.forEach((item) => {
          const meta = mediaMetadata[item.media_id];
          const source = meta?.s?.u;
          if (meta?.e === 'Image' && source) {
            media.push({
              id: item.media_id,
              type: 'image',
              url: decodeHtml(source)
            });
          }
        });
      }

      if (post.preview?.images?.[0]?.variants?.gif?.source?.url) {
        media.push({
          id: `${post.id}-gif`,
          type: 'gif',
          url: decodeHtml(post.preview.images[0].variants.gif.source.url)
        });
      }

      if (post.is_video && post.media?.reddit_video?.fallback_url) {
        const videoSource =
          post.media.reddit_video.hls_url ?? post.media.reddit_video.fallback_url;
        media.push({
          id: `${post.id}-video`,
          type: 'video',
          url: decodeHtml(videoSource),
          poster: post.preview?.images?.[0]?.source?.url
            ? decodeHtml(post.preview.images[0].source.url)
            : undefined
        });
      }

      const imageUrl = post.url_overridden_by_dest ?? post.url;
      if (imageUrl && (post.post_hint === 'image' || hasImageExtension(imageUrl))) {
        media.push({
          id: `${post.id}-image`,
          type: 'image',
          url: decodeHtml(imageUrl)
        });
      }

      return {
        id: post.id,
        title: post.title ?? 'Untitled',
        media: uniqueByUrl(media)
      } as GalleryPost;
    })
    .filter((post: GalleryPost) => post.media.length > 0);
}
