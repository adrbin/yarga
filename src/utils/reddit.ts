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

const decodeHtml = (value: string) => value.replaceAll('&amp;', '&');

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

export function extractGalleryPosts(listing: any): GalleryPost[] {
  if (!listing?.data?.children) return [];

  return listing.data.children
    .map((child: any) => child?.data)
    .filter(Boolean)
    .map((post: any) => {
      const media: MediaItem[] = [];

      if (post.is_gallery && post.gallery_data?.items && post.media_metadata) {
        post.gallery_data.items.forEach((item: any) => {
          const meta = post.media_metadata[item.media_id];
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
        media.push({
          id: `${post.id}-video`,
          type: 'video',
          url: post.media.reddit_video.fallback_url,
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
