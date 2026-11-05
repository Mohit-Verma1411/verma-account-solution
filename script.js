/* ============================================================
   Verma Account Solution — interactions
   ============================================================ */
(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const closeNav = () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };
  const openNav = () => {
    nav.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  };

  navToggle.addEventListener("click", () => {
    nav.classList.contains("open") ? closeNav() : openNav();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeNav();
      navToggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeNav();
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".count");

  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ---------- Active nav link while scrolling ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll('.nav > a[href^="#"]'));

  const setActiveLink = () => {
    const pos = window.scrollY + 140;
    let current = "";

    sections.forEach((section) => {
      if (section.offsetTop <= pos) current = section.id;
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + current;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  if (navLinks.length) {
    setActiveLink();
    window.addEventListener("scroll", setActiveLink, { passive: true });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form → WhatsApp ---------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name");
      const phone = document.getElementById("phone");
      const service = document.getElementById("service");
      const message = document.getElementById("message");

      [name, phone, message].forEach((field) => field.classList.remove("invalid"));
      note.textContent = "";

      if (!name.value.trim()) {
        name.classList.add("invalid");
        name.focus();
        note.textContent = "Please enter your name.";
        return;
      }

      const digits = phone.value.replace(/\D/g, "");
      if (digits.length < 10) {
        phone.classList.add("invalid");
        phone.focus();
        note.textContent = "Please enter a valid 10-digit phone number.";
        return;
      }

      const lines = [
        "Namaste Verma ji,",
        "",
        "Name: " + name.value.trim(),
        "Phone: " + phone.value.trim(),
        "Service: " + service.value,
      ];

      if (message.value.trim()) {
        lines.push("Message: " + message.value.trim());
      }

      lines.push("", "Sent from the Verma Account Solution website.");

      const text = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/919017121251?text=" + text, "_blank", "noopener");

      note.style.color = "#9fe3c9";
      note.textContent = "Opening WhatsApp with your details…";
      form.reset();

      setTimeout(() => {
        note.textContent = "";
        note.style.color = "";
      }, 6000);
    });
  }
})();
