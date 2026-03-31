const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

// Keep one FAQ item open at a time for cleaner reading.
const faqItems = document.querySelectorAll(".faq-list details");
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const priceAccordionItems = document.querySelectorAll(".price-accordion details");
priceAccordionItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    priceAccordionItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const lightbox = document.getElementById("portfolio-lightbox");
const lightboxImg = document.getElementById("portfolio-lightbox-img");
const lightboxClose = document.getElementById("portfolio-lightbox-close");

function openPortfolioLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose?.focus();
}

function closePortfolioLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.hidden = true;
  lightboxImg.src = "";
  lightboxImg.alt = "";
  document.body.style.overflow = "";
}

document.querySelectorAll(".portfolio-open-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-lightbox-src");
    const alt = btn.getAttribute("data-lightbox-alt") || "";
    if (src) openPortfolioLightbox(src, alt);
  });
});

lightboxClose?.addEventListener("click", (e) => {
  e.stopPropagation();
  closePortfolioLightbox();
});

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closePortfolioLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox && !lightbox.hidden) closePortfolioLightbox();
});

function initCarousel(options) {
  const {
    trackSelector,
    slideSelector,
    wrapSelector,
    prevSelector,
    nextSelector,
  } = options;
  const track = document.querySelector(trackSelector);
  const slides = track?.querySelectorAll(slideSelector);
  const wrap = document.querySelector(wrapSelector);
  const prev = document.querySelector(prevSelector);
  const next = document.querySelector(nextSelector);

  if (!track || !slides?.length) return;

  let index = 0;
  const total = slides.length;
  const ms = parseInt(track.dataset.interval || "7000", 10);
  let timerId = null;

  function goTo(i) {
    slides[index].classList.remove("is-active");
    index = (i + total) % total;
    slides[index].classList.add("is-active");
  }

  function restartTimer() {
    clearInterval(timerId);
    timerId = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      goTo(index + 1);
    }, ms);
  }

  function manualStep(delta) {
    goTo(index + delta);
    restartTimer();
  }

  prev?.addEventListener("click", () => manualStep(-1));
  next?.addEventListener("click", () => manualStep(1));

  wrap?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      manualStep(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      manualStep(1);
    }
  });

  restartTimer();
}

initCarousel({
  trackSelector: ".reviews-carousel",
  slideSelector: ".review-slide",
  wrapSelector: ".reviews-carousel-wrap",
  prevSelector: ".reviews-nav-prev",
  nextSelector: ".reviews-nav-next",
});

initCarousel({
  trackSelector: ".portfolio-carousel",
  slideSelector: ".portfolio-slide",
  wrapSelector: ".portfolio-carousel-wrap",
  prevSelector: ".portfolio-nav-prev",
  nextSelector: ".portfolio-nav-next",
});
