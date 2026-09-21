document.addEventListener('DOMContentLoaded', function () {
  // Sticky header state
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  var burger = document.querySelector('.hamburger');
  var panel = document.querySelector('.mobile-panel');
  if (burger && panel) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      panel.classList.toggle('open');
      document.body.style.overflow = panel.classList.contains('open') ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        panel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Count-up stats
  var stats = document.querySelectorAll('.stat[data-count]');
  if ('IntersectionObserver' in window && stats.length) {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          statIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (el) { statIo.observe(el); });
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var numEl = el.querySelector('b');
    var start = 0;
    var duration = 1400;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = start + (target - start) * eased;
      numEl.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Simple client-side property filter (properties.html)
  var filterForm = document.querySelector('[data-filter-form]');
  if (filterForm) {
    var cards = document.querySelectorAll('[data-property-card]');
    function applyFilters() {
      var loc = filterForm.querySelector('[name="location"]').value;
      var type = filterForm.querySelector('[name="type"]').value;
      var price = filterForm.querySelector('[name="price"]').value;
      cards.forEach(function (card) {
        var matchLoc = !loc || card.dataset.location === loc;
        var matchType = !type || card.dataset.type === type;
        var matchPrice = true;
        if (price) {
          var min = parseFloat(card.dataset.priceFrom || '0');
          if (price === 'under20') matchPrice = min < 20;
          else if (price === '20to50') matchPrice = min >= 20 && min <= 50;
          else if (price === 'over50') matchPrice = min > 50;
        }
        card.parentElement.style.display = (matchLoc && matchType && matchPrice) ? '' : 'none';
      });
    }
    filterForm.addEventListener('change', applyFilters);
  }

  // Contact / inspection forms — front-end only (no backend wired up)
  document.querySelectorAll('[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) {
        note.textContent = 'Thank you — your enquiry has been noted. Our team will reach out shortly.';
        note.style.display = 'block';
      }
      form.reset();
    });
  });
});
