(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Cabecera: menu movil */
  var navToggle = document.querySelector(".nav-toggle");
  var navMobile = document.querySelector(".nav-mobile");

  function closeMobileNav() {
    if (!navToggle || !navMobile) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMobile.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navMobile.classList.toggle("is-open", !expanded);
      document.body.style.overflow = !expanded ? "hidden" : "";
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* Resaltado de enlace activo en scroll */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a, .nav-mobile a"));

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            var match = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", match);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* Reveal on scroll */
  var revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length && "IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Lightbox de galeria */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.querySelector(".lightbox");

  if (galleryItems.length && lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var lightboxCaption = lightbox.querySelector("figcaption");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var currentIndex = 0;
    var lastFocused = null;

    function openLightbox(index) {
      currentIndex = index;
      var item = galleryItems[currentIndex];
      var img = item.querySelector("img");
      var caption = item.querySelector(".gallery-caption");
      lightboxImg.src = img.getAttribute("src");
      lightboxImg.alt = img.getAttribute("alt") || "";
      lightboxCaption.textContent = caption ? caption.textContent.trim() : "";
      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    function showRelative(delta) {
      currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
      openLightbox(currentIndex);
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener("click", function () { openLightbox(index); });
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", function () { showRelative(-1); });
    nextBtn.addEventListener("click", function () { showRelative(1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showRelative(1);
      if (e.key === "ArrowLeft") showRelative(-1);
    });
  }

  /* Mapa: carga bajo consentimiento */
  var mapConsent = document.querySelector(".map-consent");
  var mapFrame = document.querySelector(".map-frame");

  function loadMap() {
    if (!mapFrame) return;
    var iframe = mapFrame.querySelector("iframe");
    if (iframe && !iframe.src && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
    if (mapConsent) mapConsent.remove();
    try { localStorage.setItem("mapaConsentido", "1"); } catch (err) {}
  }

  if (mapConsent) {
    var mapLoadBtn = mapConsent.querySelector("[data-load-map]");
    if (mapLoadBtn) mapLoadBtn.addEventListener("click", loadMap);
    try {
      if (localStorage.getItem("mapaConsentido") === "1") loadMap();
    } catch (err) {}
  }

  /* Banner de cookies */
  var cookieBanner = document.querySelector(".cookie-banner");
  if (cookieBanner) {
    var acceptBtn = cookieBanner.querySelector("[data-cookie-accept]");
    var rejectBtn = cookieBanner.querySelector("[data-cookie-reject]");

    function hideCookieBanner() { cookieBanner.classList.remove("is-visible"); }

    try {
      if (!localStorage.getItem("cookiesDecision")) {
        cookieBanner.classList.add("is-visible");
      }
    } catch (err) {
      cookieBanner.classList.add("is-visible");
    }

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        try { localStorage.setItem("cookiesDecision", "aceptado"); } catch (err) {}
        loadMap();
        hideCookieBanner();
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        try { localStorage.setItem("cookiesDecision", "rechazado"); } catch (err) {}
        hideCookieBanner();
      });
    }
  }

  /* Formulario de contacto: validacion + fallback mailto */
  var form = document.querySelector(".contact-form");
  if (form) {
    var statusBox = form.querySelector(".form-status");
    var DEST_EMAIL = "lacatsamengual@gmail.com";

    function setError(row, message) {
      row.classList.toggle("has-error", Boolean(message));
      var errorEl = row.querySelector(".field-error");
      if (errorEl) errorEl.textContent = message || "";
    }

    function validate() {
      var valid = true;
      var nameField = form.querySelector("#contact-name");
      var phoneField = form.querySelector("#contact-phone");
      var typeField = form.querySelector("#contact-type");
      var messageField = form.querySelector("#contact-message");

      if (!nameField.value.trim()) {
        setError(nameField.closest(".form-row"), "Indica tu nombre.");
        valid = false;
      } else {
        setError(nameField.closest(".form-row"), "");
      }

      var phoneDigits = phoneField.value.replace(/\D/g, "");
      if (phoneDigits.length < 9) {
        setError(phoneField.closest(".form-row"), "Indica un telefono valido (al menos 9 digitos).");
        valid = false;
      } else {
        setError(phoneField.closest(".form-row"), "");
      }

      if (!typeField.value) {
        setError(typeField.closest(".form-row"), "Selecciona el tipo de trabajo.");
        valid = false;
      } else {
        setError(typeField.closest(".form-row"), "");
      }

      if (!messageField.value.trim()) {
        setError(messageField.closest(".form-row"), "Cuentanos brevemente que necesitas.");
        valid = false;
      } else {
        setError(messageField.closest(".form-row"), "");
      }

      return valid;
    }

    form.addEventListener("submit", function (e) {
      var honeypot = form.querySelector('input[name="empresa-web"]');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return;
      }

      if (!validate()) {
        e.preventDefault();
        statusBox.textContent = "Revisa los campos marcados antes de enviar.";
        statusBox.className = "form-status is-visible is-error";
        return;
      }

      /* Si el formulario no esta conectado a Netlify Forms / Formspree
         (ver README), se usa mailto como envio de reserva. */
      if (form.dataset.backend !== "connected") {
        e.preventDefault();
        var name = form.querySelector("#contact-name").value.trim();
        var phone = form.querySelector("#contact-phone").value.trim();
        var type = form.querySelector("#contact-type").value;
        var message = form.querySelector("#contact-message").value.trim();

        var subject = "Consulta desde la web – " + type;
        var body =
          "Nombre: " + name + "\n" +
          "Telefono: " + phone + "\n" +
          "Tipo de trabajo: " + type + "\n\n" +
          message;

        var mailtoUrl =
          "mailto:" + DEST_EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);

        window.location.href = mailtoUrl;
        statusBox.textContent = "Se abrira tu gestor de correo para enviar la consulta. Si no se abre, llamanos al 971 55 36 13.";
        statusBox.className = "form-status is-visible is-success";
        form.reset();
      }
    });
  }

  /* Enlaces #anclas: cierre de menu movil ya cubierto arriba */
})();
