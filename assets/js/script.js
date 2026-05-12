document.addEventListener('DOMContentLoaded', () => {

  // 1. Footer Year
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // 2. Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // 3. Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu ul');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = !navMenu.classList.contains('active');
      hamburger.classList.toggle('active', isOpen);
      navMenu.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.querySelectorAll('.nav-menu a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Hero Slideshow
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  // 5. Scroll Animation Observer
  if ('IntersectionObserver' in window) {
    document.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
      if (!el.closest('.hero-content')) {
        el.style.setProperty('--i', i);
      }
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      if (!el.closest('.hero-content')) {
        observer.observe(el);
      }
    });
  }

  // 6. Package Tabs Filter (Termasuk Penginapan)
  const tabs = document.querySelectorAll('.package-tab');
  const cards = document.querySelectorAll('.cards-grid .card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.dataset.category;

      // Jika tab "Penginapan", scroll ke section penginapan
          // Jika tab "Penginapan" diklik
      if (category === 'penginapan') {
        const section = document.getElementById('preview-penginapan') || document.getElementById('paket-penginapan');
        
        if (section) {
          // 1. Filter card terlebih dahulu
          cards.forEach(card => {
            const cardCat = card.dataset.category;
            card.style.display = cardCat === 'penginapan' ? 'flex' : 'none';
            if (cardCat === 'penginapan') {
              card.classList.remove('is-visible');
              setTimeout(() => card.classList.add('is-visible'), 60);
            }
          });

          // 2. Tunggu DOM reflow selesai, baru hitung scroll presisi
          setTimeout(() => {
            const navbarOffset = 90; // Navbar + padding aman
            const targetPos = section.getBoundingClientRect().top + window.scrollY - navbarOffset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }, 100);
        }
        return; // Stop di sini
      }

      // Filter cards untuk kategori aktivitas
      cards.forEach(card => {
        const cardCat = card.dataset.category || 'satuan';
        const show = (category === 'all') || (cardCat === category);
        card.style.display = show ? 'flex' : 'none';
        if (show) {
          card.classList.remove('is-visible');
          setTimeout(() => card.classList.add('is-visible'), 60);
        }
      });
    });
  });

  // 7. WA Modal Logic
  const waModal = document.getElementById('wa-modal');
  const openWA = (message = '') => {
    if (!waModal) return;
    const suffix = message ? `?text=${encodeURIComponent(message)}` : '';
    const admin1 = waModal.querySelector('[data-admin="1"]');
    const admin2 = waModal.querySelector('[data-admin="2"]');
    if (admin1) admin1.href = `https://wa.me/6281339582713${suffix}`;
    if (admin2) admin2.href = `https://wa.me/6283840329826${suffix}`;
    waModal.classList.add('active');
    waModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeWA = () => {
    if (!waModal) return;
    waModal.classList.remove('active');
    waModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (waModal) {
    document.getElementById('wa-modal-close')?.addEventListener('click', closeWA);
    waModal.addEventListener('click', e => {
      if (e.target === waModal) closeWA();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeWA();
    });
  }

  document.getElementById('floating-wa')?.addEventListener('click', e => {
    e.preventDefault();
    openWA('');
  });

  document.querySelectorAll('.open-wa-modal-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openWA('Halo Admin, saya ingin bertanya tentang paket wisata');
    });
  });

  document.querySelectorAll('.btn-book-wa').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const activity = btn.dataset.activity || 'Paket';
      const price = btn.dataset.price || 'Hubungi Admin';
      const msg = `Halo Admin,\n\nSaya ingin BOOKING:\n🎯 ${activity}\n💰 ${price}\n\nMohon info ketersediaan.`;
      openWA(msg);
    });
  });

  // 8. Custom Select Dropdown
  const wrapper = document.querySelector('.custom-select-wrapper');
  const trigger = document.querySelector('.custom-select-trigger');
  const input = document.querySelector('.custom-select-input');
  const options = document.querySelectorAll('.custom-option');

  if (wrapper && trigger) {
    trigger.addEventListener('click', () => {
      wrapper.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('open');
      }
    });
  }

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      if (trigger) trigger.textContent = opt.textContent.trim();
      if (input) input.value = opt.dataset.value;
      if (wrapper) wrapper.classList.remove('open');
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  // 9. Form Category Filter
  const formCats = document.querySelectorAll('.form-category-btn');
  formCats.forEach(btn => {
    btn.addEventListener('click', () => {
      formCats.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      options.forEach(opt => {
        const optCat = opt.dataset.category;
        opt.classList.toggle('show', cat === 'all' || optCat === cat);
      });
      if (trigger) trigger.textContent = '-- Pilih Paket --';
      if (input) input.value = '';
      options.forEach(o => o.classList.remove('selected'));
    });
  });

  // 10. Form Submit - FORMAT PESAN SESUAI REQUEST
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      let isValid = true;
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      const name = form.name?.value.trim();
      const phone = form.phone?.value.trim();
      const activity = input?.value.trim();
      const date = form.date?.value;
      const pax = form.pax?.value;

      // Validation
      if (!name) {
        form.name.closest('.form-group')?.classList.add('error');
        isValid = false;
      }
      if (!phone || !/^[0-9+\-\s]{8,15}$/.test(phone)) {
        form.phone.closest('.form-group')?.classList.add('error');
        isValid = false;
      }
      if (!activity) {
        trigger?.closest('.form-group')?.classList.add('error');
        isValid = false;
      }
      if (!date) {
        form.date.closest('.form-group')?.classList.add('error');
        isValid = false;
      }
      if (!pax || parseInt(pax) < 1) {
        form.pax.closest('.form-group')?.classList.add('error');
        isValid = false;
      }

      const feedback = document.getElementById('formFeedback');

      if (!isValid) {
        if (feedback) {
          feedback.textContent = '⚠️ Mohon lengkapi data yang ditandai.';
          feedback.className = 'form-feedback error';
        }
        return; // STOP: jangan kirim ke WA
      }

      // ✅ FORMAT PESAN SESUAI REQUEST USER
      const message = `Halo Admin,

*FORM BOOKING BERJELAJAH RAFTING*
👤 Nama: ${name}
📱 HP: ${phone}
🎯 Paket: ${activity}
📅 Tanggal: ${date}
👥 Jumlah: ${pax} orang

Mohon info jadwal & DP. Terima kasih!`;

      openWA(message);

      if (feedback) {
        feedback.textContent = '✅ Data valid! Silakan pilih admin di popup.';
        feedback.className = 'form-feedback success';
      }

      // Reset form
      form.reset();
      if (trigger) trigger.textContent = '-- Pilih Paket --';
      options.forEach(o => o.classList.remove('selected'));
    });
  }

  // 11. Video Auto-Pause
  document.querySelectorAll('.auto-pause-video').forEach(video => {
    video.addEventListener('play', () => {
      document.querySelectorAll('.auto-pause-video').forEach(v => {
        if (v !== video && !v.paused) v.pause();
      });
    });
  });

  // 12. Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    backToTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log('✅ Loaded - All features working!');
});