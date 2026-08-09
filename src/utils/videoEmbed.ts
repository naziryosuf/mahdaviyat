/**
 * Utility to parse and format video URLs from YouTube, Aparat, Vimeo, or direct MP4/WebM files.
 */

export interface VideoEmbedInfo {
  type: 'youtube' | 'aparat' | 'vimeo' | 'direct';
  embedUrl: string;
  thumbnailUrl?: string;
}

export function parseVideoUrl(url: string): VideoEmbedInfo {
  if (!url) {
    return { type: 'direct', embedUrl: '' };
  }

  // 1. YouTube Parsing
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 2. Aparat Parsing (www.aparat.com/v/VIDEO_ID)
  const aparatMatch = url.match(/aparat\.com\/v\/([\w-]+)/);
  if (aparatMatch && aparatMatch[1]) {
    const videoId = aparatMatch[1];
    return {
      type: 'aparat',
      embedUrl: `https://www.aparat.com/video/video/embed/videohash/${videoId}/vt/frame`,
    };
  }

  // 3. Vimeo Parsing (vimeo.com/VIDEO_ID)
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
    };
  }

  // 4. Direct Video File Link (MP4, WebM, Ogg, or cloud storage)
  return {
    type: 'direct',
    embedUrl: url,
  };
}
