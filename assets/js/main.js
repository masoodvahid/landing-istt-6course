/* =========================================================
   ISTT landing page — main script
   ========================================================= */

(function () {
  'use strict';

  // Fade-in on scroll
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));

  // Active nav dot on scroll
  const sections = document.querySelectorAll('section[id]');
  const dots = document.querySelectorAll('.nav-dot');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          dots.forEach((dot) => {
            dot.classList.toggle('active', dot.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((s) => navObserver.observe(s));

  /* =========================================================
     Video placeholder → <video> swap helper
     When you drop the real mp4 files into assets/videos/,
     this script automatically replaces each placeholder with
     a playable <video> element. If the file is missing, the
     placeholder stays visible.
     ========================================================= */
  document.querySelectorAll('.video-placeholder').forEach((ph) => {
    const filename = ph.getAttribute('data-video');
    if (!filename) return;

    const src = 'assets/videos/' + filename;

    // Try to load the video; only swap if the file exists
    fetch(src, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) return;

        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.display = 'block';

        // Clear placeholder content and insert the video
        ph.innerHTML = '';
        ph.classList.add('has-video');
        ph.style.borderStyle = 'solid';
        ph.appendChild(video);
      })
      .catch(() => {
        // File missing — keep the placeholder
      });
  });
})();
