/**
 * Hero Story block - Dell-style video hero with full canvas image,
 * centered overlay content, and play button for video.
 *
 * Content model (rows):
 * - Row 1: image (full canvas background)
 * - Row 2: content (overlay, center-middle)
 * - Row 3: video URL (play button initiates playback)
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows[0]) return;

  const imageRow = rows[0];
  const contentRow = rows[1];
  const videoRow = rows[2];

  const hasImage = imageRow?.querySelector('picture, img');
  const hasContent = contentRow && contentRow.children.length > 0;
  const hasVideo = videoRow && (videoRow.querySelector('a[href]') || videoRow.textContent?.trim());

  if (!hasImage) {
    block.classList.add('no-image');
  }

  const bg = document.createElement('div');
  bg.classList.add('hero-story-background');

  const overlay = document.createElement('div');
  overlay.classList.add('hero-story-overlay', 'hero-story-copytext-container');

  // Row 1: image as full canvas background
  if (hasImage) {
    const pic = imageRow.querySelector('picture');
    const img = imageRow.querySelector('img');
    if (pic) {
      bg.append(pic);
    } else if (img) {
      const picture = document.createElement('picture');
      picture.append(img.cloneNode(true));
      bg.append(picture);
    }
  }

  // Row 2: split content into main content (h2, h3, p) and links (a)
  const contentParent = hasContent && (contentRow.children.length === 1 ? contentRow.children[0] : contentRow);
  const contentNodes = contentParent ? [...contentParent.children] : [];
  const mainContent = [];
  const linkNodes = [];
  const videoLinkPattern = /\.(mp4|webm)(\?|$)/i;
  const isVideoUrl = (href) => href && (videoLinkPattern.test(href) || href.includes('youtube') || href.includes('vimeo'));

  contentNodes.forEach((node) => {
    if (node.tagName === 'A' && isVideoUrl(node.href)) {
      linkNodes.push({ node, isVideo: true });
    } else if (node.tagName === 'A') {
      linkNodes.push({ node, isVideo: false });
    } else {
      mainContent.push(node);
    }
  });

  // Video URL: row 3 first (link or plain URL), then video link in row 2
  let videoUrl = null;
  if (hasVideo) {
    const link = videoRow.querySelector('a[href]');
    if (link?.href) {
      videoUrl = link.href;
    } else {
      const text = videoRow.textContent?.trim() || '';
      if (isVideoUrl(text) || text.startsWith('http')) videoUrl = text;
    }
  }
  if (!videoUrl) {
    const videoLink = linkNodes.find((l) => l.isVideo);
    if (videoLink) {
      videoUrl = videoLink.node.href;
      linkNodes.splice(linkNodes.indexOf(videoLink), 1);
    }
  }

  // Build overlay: content | play button | links
  if (mainContent.length) {
    const content = document.createElement('div');
    content.classList.add('hero-story-content');
    mainContent.forEach((child) => content.append(child));
    overlay.append(content);
  }

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.classList.add('hero-story-play');
  playBtn.setAttribute('aria-label', 'Play video');
  playBtn.innerHTML = `
    <span class="hero-story-play-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </span>
  `;

  if (videoUrl) {
    playBtn.classList.add('hero-story-play-visible');
    playBtn.addEventListener('click', () => {
      const container = block.querySelector('.hero-story-video-container');
      if (!container) return;
      container.innerHTML = '';
      container.classList.add('hero-story-video-active');

      if (videoUrl.includes('youtube') || videoUrl.includes('youtu.be')) {
        const vid = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1];
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;
        iframe.classList.add('hero-story-video');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.allowFullscreen = true;
        container.append(iframe);
      } else if (videoUrl.includes('vimeo')) {
        const vid = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${vid}?autoplay=1`;
        iframe.classList.add('hero-story-video');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.allowFullscreen = true;
        container.append(iframe);
      } else {
        const video = document.createElement('video');
        video.controls = true;
        video.src = videoUrl;
        video.classList.add('hero-story-video');
        container.append(video);
        video.play();
      }

    });
  }

  overlay.append(playBtn);

  if (linkNodes.length) {
    const linksWrap = document.createElement('div');
    linksWrap.classList.add('hero-story-links');
    linkNodes.forEach(({ node }) => linksWrap.append(node));
    overlay.append(linksWrap);
  }

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('hero-story-video-container');

  block.innerHTML = '';
  block.append(bg);
  block.append(overlay);
  block.append(videoContainer);
}
