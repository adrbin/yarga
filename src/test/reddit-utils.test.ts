import { extractGalleryPosts } from '../utils/reddit';

describe('extractGalleryPosts', () => {
  it('extracts images, gifs, and videos', () => {
    const listing = {
      data: {
        children: [
          {
            data: {
              id: 'img1',
              title: 'Image post',
              post_hint: 'image',
              url_overridden_by_dest: 'https://example.com/img.jpg'
            }
          },
          {
            data: {
              id: 'gif1',
              title: 'Gif post',
              preview: {
                images: [
                  {
                    variants: { gif: { source: { url: 'https://example.com/a.gif' } } }
                  }
                ]
              }
            }
          },
          {
            data: {
              id: 'vid1',
              title: 'Video post',
              is_video: true,
              media: { reddit_video: { fallback_url: 'https://example.com/v.mp4' } },
              preview: { images: [{ source: { url: 'https://example.com/v.jpg' } }] }
            }
          }
        ]
      }
    };

    const posts = extractGalleryPosts(listing);
    expect(posts).toHaveLength(3);
    expect(posts[0].media[0].url).toContain('img.jpg');
    expect(posts[1].media[0].type).toBe('gif');
    expect(posts[2].media[0].type).toBe('video');
  });

  it('extracts gallery images', () => {
    const listing = {
      data: {
        children: [
          {
            data: {
              id: 'g1',
              title: 'Gallery',
              is_gallery: true,
              gallery_data: { items: [{ media_id: 'm1' }, { media_id: 'm2' }] },
              media_metadata: {
                m1: { e: 'Image', s: { u: 'https://example.com/1.jpg' } },
                m2: { e: 'Image', s: { u: 'https://example.com/2.jpg' } }
              }
            }
          }
        ]
      }
    };

    const posts = extractGalleryPosts(listing);
    expect(posts).toHaveLength(1);
    expect(posts[0].media).toHaveLength(2);
  });
});
