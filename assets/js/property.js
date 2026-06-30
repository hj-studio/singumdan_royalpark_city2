(function () {
  'use strict';

  // 단일 물건 사이트: ?p= 가 없으면 기본 물건을 보여준다
  const DEFAULT_SLUG = 'sample-property';

  function getSlug() {
    const params = new URLSearchParams(location.search);
    if (params.get('p')) return params.get('p');
    return DEFAULT_SLUG;
  }

  function imgPath(slug, rel) {
    return `content/${slug}/images/${rel}`;
  }

  function makeImg(src, alt) {
    const img = document.createElement('img');
    img.alt = alt || '';
    img.loading = 'lazy';
    img.src = src;
    return img;
  }

  // ── NAV scroll effect ──────────────────────────────────────────────────────
  function initNav() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Hero ───────────────────────────────────────────────────────────────────
  function buildHero(data, slug) {
    const imgs = (data.images && data.images.hero) || [];
    const slidesEl = document.querySelector('.hero-slides');
    const dotsEl = document.querySelector('.hero-dots');
    if (!slidesEl) return;

    if (!imgs.length) {
      const s = document.createElement('div');
      s.className = 'hero-slide active';
      s.style.background = 'linear-gradient(135deg,#1a1a2e 0%,#2d2d4e 100%)';
      slidesEl.appendChild(s);
      return;
    }

    imgs.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
      const full = imgPath(slug, src);
      const tmp = new Image();
      tmp.onload = () => { slide.style.backgroundImage = `url('${full}')`; };
      tmp.src = full;
      slidesEl.appendChild(slide);

      if (dotsEl && imgs.length > 1) {
        const dot = document.createElement('button');
        dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
        dot.addEventListener('click', () => goSlide(i));
        dotsEl.appendChild(dot);
      }
    });

    let current = 0;
    function goSlide(n) {
      const slides = slidesEl.querySelectorAll('.hero-slide');
      const dots = dotsEl ? dotsEl.querySelectorAll('.hero-dot') : [];
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    if (imgs.length > 1) setInterval(() => goSlide(current + 1), 5000);
  }

  // ── Overview specs ─────────────────────────────────────────────────────────
  function buildSpecs(specs) {
    const grid = document.querySelector('.spec-grid');
    if (!grid || !specs) return;
    Object.entries(specs).forEach(([k, v]) => {
      const item = document.createElement('div');
      item.className = 'spec-item';
      item.innerHTML = `<div class="spec-label">${k}</div><div class="spec-value">${v}</div>`;
      grid.appendChild(item);
    });
  }

  // ── Generic scroll-snap image grid ────────────────────────────────────────
  let lightboxImages = [];
  let lbIndex = 0;

  function buildImgGrid(selector, images, slug) {
    const grid = document.querySelector(selector);
    if (!grid || !images || !images.length) return;
    const startIdx = lightboxImages.length;
    images.forEach((src, i) => {
      lightboxImages.push(imgPath(slug, src));
      const item = document.createElement('div');
      item.className = 'scroll-item';
      item.appendChild(makeImg(imgPath(slug, src), `이미지 ${i + 1}`));
      item.addEventListener('click', () => openLightbox(startIdx + i));
      grid.appendChild(item);
    });
  }

  // ── Community grid ────────────────────────────────────────────────────────
  function buildCommunity(sec, slug) {
    const grid = document.querySelector('.community-grid');
    if (!grid || !sec || !sec.items) return;
    sec.items.forEach((item, i) => {
      lightboxImages.push(imgPath(slug, item.image));
      const idx = lightboxImages.length - 1;
      const card = document.createElement('div');
      card.className = 'comm-card';
      const imgWrap = document.createElement('div');
      imgWrap.className = 'comm-card-img';
      imgWrap.appendChild(makeImg(imgPath(slug, item.image), item.label));
      imgWrap.addEventListener('click', () => openLightbox(idx));
      const label = document.createElement('div');
      label.className = 'comm-card-label';
      label.textContent = item.label;
      card.appendChild(imgWrap);
      card.appendChild(label);
      grid.appendChild(card);
    });
  }

  // ── Gallery ───────────────────────────────────────────────────────────────
  function buildGallery(data, slug) {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;
    const imgs = (data.images && data.images.gallery) || [];
    if (!imgs.length) return;
    const startIdx = lightboxImages.length;
    imgs.forEach((src, i) => {
      lightboxImages.push(imgPath(slug, src));
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.appendChild(makeImg(imgPath(slug, src), `갤러리 ${i + 1}`));
      item.addEventListener('click', () => openLightbox(startIdx + i));
      grid.appendChild(item);
    });
  }

  // ── Units ─────────────────────────────────────────────────────────────────
  function buildUnits(units) {
    const grid = document.querySelector('.units-grid');
    const sel = document.getElementById('unit-select');
    if (!grid || !units) return;
    units.forEach(u => {
      const card = document.createElement('div');
      card.className = 'unit-card';
      card.innerHTML = `
        <div class="unit-type">TYPE ${u.type}</div>
        <div class="unit-area">${u.area}</div>
        <div class="unit-count">${u.households}</div>
        <div class="unit-price">
          <div class="unit-price-label">분양가</div>
          ${u.price}
        </div>`;
      grid.appendChild(card);

      if (sel) {
        const opt = document.createElement('option');
        opt.value = u.type;
        opt.textContent = `${u.type} (${u.area})`;
        sel.appendChild(opt);
      }
    });
  }

  // ── Floor plans ───────────────────────────────────────────────────────────
  function buildFloorplan(data, slug) {
    const tabsEl = document.querySelector('.floorplan-tabs');
    const contentsEl = document.querySelector('.floorplan-contents');
    if (!tabsEl || !contentsEl) return;
    const imgs = (data.images && data.images.floorplan) || [];
    const units = data.units || [];
    if (!imgs.length) return;

    imgs.forEach((src, i) => {
      const label = units[i] ? units[i].type : `타입 ${i + 1}`;
      const tab = document.createElement('button');
      tab.className = 'floorplan-tab' + (i === 0 ? ' active' : '');
      tab.textContent = label;
      tab.addEventListener('click', () => {
        tabsEl.querySelectorAll('.floorplan-tab').forEach(t => t.classList.remove('active'));
        contentsEl.querySelectorAll('.floorplan-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        contentsEl.children[i].classList.add('active');
      });
      tabsEl.appendChild(tab);

      lightboxImages.push(imgPath(slug, src));
      const lbIdx = lightboxImages.length - 1;
      const content = document.createElement('div');
      content.className = 'floorplan-content' + (i === 0 ? ' active' : '');
      const wrap = document.createElement('div');
      wrap.className = 'floorplan-img-wrap';
      const img = makeImg(imgPath(slug, src), `평면도 ${label}`);
      img.addEventListener('click', () => openLightbox(lbIdx));
      img.style.cursor = 'zoom-in';
      wrap.appendChild(img);
      content.appendChild(wrap);
      contentsEl.appendChild(content);
    });
  }

  // ── Media / Videos ────────────────────────────────────────────────────────
  function buildVideos(data) {
    const grid = document.querySelector('.video-grid');
    const section = document.getElementById('media');
    const vids = data.videos || [];
    if (!grid) return;
    if (!vids.length) { if (section) section.style.display = 'none'; return; }
    vids.forEach(v => {
      const card = document.createElement('div');
      card.className = 'video-card';
      const frame = document.createElement('div');
      frame.className = 'video-frame';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${v.youtube}`;
      iframe.title = v.title || '';
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      card.appendChild(frame);
      if (v.title) {
        const label = document.createElement('div');
        label.className = 'video-label';
        label.textContent = v.title;
        card.appendChild(label);
      }
      grid.appendChild(card);
    });
  }

  // ── Location ──────────────────────────────────────────────────────────────
  function buildLocation(data, slug) { // data.mapLink 사용
    const wrap = document.querySelector('.location-imgs');
    if (!wrap) return;
    const locImgs = (data.images && data.images.location) || [];

    if (data.mapEmbed) {
      const iframe = document.createElement('iframe');
      iframe.src = data.mapEmbed;
      iframe.className = 'location-map-embed';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      wrap.appendChild(iframe);
    }

    locImgs.forEach((src, i) => {
      const item = document.createElement('div');
      item.className = 'location-img-item';
      const img = makeImg(imgPath(slug, src), `위치 ${i + 1}`);

      if (src.includes('loc_map') && data.mapLink) {
        img.style.cursor = 'pointer';
        item.addEventListener('click', () => window.open(data.mapLink, '_blank', 'noopener'));
      } else {
        lightboxImages.push(imgPath(slug, src));
        const lbIdx = lightboxImages.length - 1;
        item.addEventListener('click', () => openLightbox(lbIdx));
      }

      item.appendChild(img);
      wrap.appendChild(item);
    });
  }

  // ── Contact ───────────────────────────────────────────────────────────────
  function buildContact(data) {
    const c = data.contact;
    if (!c) return;
    const set = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.textContent = val; };
    const phoneEl = document.querySelector('.contact-phone');
    if (phoneEl && c.phone) {
      const clean = c.phone.replace(/[^0-9]/g, '');
      phoneEl.innerHTML = `<a href="tel:${clean}">${c.phone}</a>`;
    }
    set('.contact-hours', c.hours);
    set('.contact-email', c.email);
    set('.contact-showroom', c.showroom);

    const form = document.getElementById('contact-form');
    if (form) {
      const endpoint = c.formEndpoint || '';
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('.form-submit');
        const fd = new FormData(form);
        fd.append('property', data.name || '');
        fd.append('submittedAt', new Date().toLocaleString('ko-KR'));

        if (!endpoint) {
          alert('문의가 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.');
          form.reset();
          return;
        }

        const orig = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = '전송 중...'; }
        try {
          // Google Apps Script 웹앱으로 전송 (CORS 회피 위해 no-cors)
          await fetch(endpoint, {
            method: 'POST',
            mode: 'no-cors',
            body: new URLSearchParams(fd)
          });
          alert('문의가 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.');
          form.reset();
        } catch (err) {
          alert('전송 중 오류가 발생했습니다. 대표전화로 연락 부탁드립니다.');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
      });
    }
  }

  // ── Lightbox ──────────────────────────────────────────────────────────────
  function openLightbox(i) {
    lbIndex = i;
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lb-img');
    if (!lb || !img || !lightboxImages.length) return;
    img.src = lightboxImages[lbIndex];
    lb.classList.add('open');
  }
  function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }
  function lbPrev() { lbIndex = (lbIndex - 1 + lightboxImages.length) % lightboxImages.length; document.getElementById('lb-img').src = lightboxImages[lbIndex]; }
  function lbNext() { lbIndex = (lbIndex + 1) % lightboxImages.length; document.getElementById('lb-img').src = lightboxImages[lbIndex]; }

  // ── Section text helper ───────────────────────────────────────────────────
  function setSectionText(sec, titleSel, subtitleSel) {
    if (!sec) return;
    const t = document.querySelector(titleSel);
    const s = document.querySelector(subtitleSel);
    if (t && sec.title) t.textContent = sec.title;
    if (s && sec.subtitle) s.textContent = sec.subtitle;
  }

  // ── Main render ───────────────────────────────────────────────────────────
  async function render() {
    const slug = getSlug();
    if (!slug) {
      document.body.innerHTML = '<div style="display:flex;height:100vh;align-items:center;justify-content:center;font-family:sans-serif;color:#999">프로젝트를 찾을 수 없습니다.</div>';
      return;
    }

    let data;
    try {
      const res = await fetch(`content/${slug}/data.json`);
      if (!res.ok) throw new Error('not found');
      data = await res.json();
    } catch {
      document.body.innerHTML = `<div style="display:flex;height:100vh;align-items:center;justify-content:center;font-family:sans-serif;color:#999">"${slug}" 프로젝트를 찾을 수 없습니다.</div>`;
      return;
    }

    document.title = `${data.name} | HJ Studio`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.description) metaDesc.content = data.description;

    const set = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.textContent = val; };
    set('.hero-title', data.name);
    set('.hero-subtitle', data.subtitle);
    set('.hero-address', data.address);
    set('.overview-title', data.name);
    set('.overview-description', data.description);
    set('.property-name', data.name);

    const hl = document.querySelector('.overview-highlights');
    if (hl && data.highlights) {
      data.highlights.forEach(h => {
        const li = document.createElement('li');
        li.textContent = h;
        hl.appendChild(li);
      });
    }

    const secs = data.sections || {};

    buildHero(data, slug);
    buildSpecs(data.specs);

    setSectionText(secs.design, '.design-title', '.design-subtitle');
    buildImgGrid('.design-grid', secs.design && secs.design.images, slug);

    setSectionText(secs.landscaping, '.landscaping-title', '.landscaping-subtitle');
    buildImgGrid('.landscaping-grid', secs.landscaping && secs.landscaping.images, slug);

    setSectionText(secs.community, '.community-title', '.community-subtitle');
    buildCommunity(secs.community, slug);

    buildGallery(data, slug);
    set('.units-note', data.unitsNote);
    buildUnits(data.units);
    buildFloorplan(data, slug);

    setSectionText(secs.royal_service, '.royal-service-title', '.royal-service-subtitle');
    buildImgGrid('.royal-service-grid', secs.royal_service && secs.royal_service.images, slug);

    buildVideos(data);
    buildLocation(data, slug);
    buildContact(data);

    // lightbox events
    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', lbPrev);
    document.getElementById('lb-next').addEventListener('click', lbNext);
    document.getElementById('lightbox').addEventListener('click', e => { if (e.target === document.getElementById('lightbox')) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!document.getElementById('lightbox').classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev();
      if (e.key === 'ArrowRight') lbNext();
    });

    initNav();
    initCallPopup();
  }

  function initCallPopup() {
    const popup   = document.getElementById('call-popup');
    const numEl   = document.getElementById('call-popup-number');
    const confirm = document.getElementById('call-popup-confirm');
    const cancel  = document.getElementById('call-popup-cancel');
    if (!popup) return;

    function openPopup(number, href) {
      numEl.textContent = number;
      confirm.href = href;
      popup.classList.add('active');
    }
    function closePopup() { popup.classList.remove('active'); }

    document.addEventListener('click', e => {
      const link = e.target.closest('a[href^="tel:"]');
      if (!link) return;
      e.preventDefault();
      const href   = link.getAttribute('href');
      const number = link.textContent.trim() || href.replace('tel:', '');
      openPopup(number, href);
    });

    cancel.addEventListener('click', closePopup);
    popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
  }

  document.addEventListener('DOMContentLoaded', render);

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
})();
