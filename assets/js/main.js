/* =========================================================
   ISTT landing page — main script
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     Fade-in on scroll
  --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
     Active nav dot on scroll
  --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
     Image galleries + modal
  --------------------------------------------------------- */
  const GALLERIES = {
    'course-1': { folder: '1st',  count: 25  },
    'course-2': { folder: '2nd',  count: 135 },
    'course-3': { folder: '3rd',  count: 73  },
    'course-4': { folder: '4th',  count: 58  },
    'course-5': { folder: '5th',  count: 77  },
  };

  // ---- Modal ----
  const modal = document.createElement('div');
  modal.className = 'gallery-modal';
  modal.innerHTML = `
    <img class="gallery-modal-img" src="" alt="">
    <button class="gallery-modal-btn gallery-modal-close" aria-label="بستن">✕</button>
    <button class="gallery-modal-btn gallery-modal-prev" aria-label="قبلی">&#8250;</button>
    <button class="gallery-modal-btn gallery-modal-next" aria-label="بعدی">&#8249;</button>
    <div class="gallery-modal-counter"></div>
  `;
  document.body.appendChild(modal);

  const modalImg     = modal.querySelector('.gallery-modal-img');
  const modalCounter = modal.querySelector('.gallery-modal-counter');
  let currentImages  = [];
  let currentIndex   = 0;

  function showModalImage() {
    modalImg.src = currentImages[currentIndex];
    modalCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
  }

  function openModal(images, index) {
    currentImages = images;
    currentIndex  = index;
    showModalImage();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function step(dir) {
    currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
    showModalImage();
  }

  modal.querySelector('.gallery-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.gallery-modal-prev').addEventListener('click', () => step(+1));
  modal.querySelector('.gallery-modal-next').addEventListener('click', () => step(-1));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   step(+1);
    if (e.key === 'ArrowRight')  step(-1);
  });

  // ---- Poster click → modal ----
  document.querySelectorAll('.poster-frame').forEach((frame) => {
    const img = frame.querySelector('img');
    if (!img) return;
    frame.addEventListener('click', () => openModal([img.src], 0));
  });

  // ---- Build galleries ----
  document.querySelectorAll('.img-gallery[data-gallery]').forEach((el) => {
    const id   = el.dataset.gallery;
    const info = GALLERIES[id];
    if (!info || info.count === 0) {
      el.innerHTML = '<div class="img-gallery-empty">تصاویر به زودی اضافه می‌شود</div>';
      return;
    }

    const images = Array.from({ length: info.count }, (_, i) =>
      'assets/images/' + info.folder + '/' + id + '-photo-' + String(i + 1).padStart(3, '0') + '.jpg'
    );

    // Inject image count into the sibling label
    const label = el.previousElementSibling;
    if (label && label.classList.contains('meta-label')) {
      label.style.display        = 'flex';
      label.style.justifyContent = 'space-between';
      label.style.alignItems     = 'center';
      const badge = document.createElement('span');
      badge.className   = 'gallery-count-badge';
      badge.textContent = images.length + ' تصویر';
      label.appendChild(badge);
    }

    images.forEach((src, idx) => {
      const item = document.createElement('div');
      item.className = 'img-gallery-item';
      const img = document.createElement('img');
      img.src     = src;
      img.loading = 'lazy';
      img.alt     = '';
      item.appendChild(img);
      item.addEventListener('click', () => openModal(images, idx));
      el.appendChild(item);
    });
  });

})();
