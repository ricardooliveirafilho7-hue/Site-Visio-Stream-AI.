const revealElements = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt]");
const magneticItems = document.querySelectorAll(".magnetic");
const countItems = document.querySelectorAll(".count-up");
const parallaxRoots = document.querySelectorAll("[data-parallax-root]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => revealObserver.observe(element));

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform =
      `perspective(1000px) rotateX(${y * -4.5}deg) rotateY(${x * 6}deg) translateY(-2px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 7;

    item.style.transform = `translate(${x}px, ${y}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

parallaxRoots.forEach((root) => {
  const items = root.querySelectorAll(".parallax-item");

  root.addEventListener("pointermove", (event) => {
    const rect = root.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    items.forEach((item) => {
      const depth = Number(item.dataset.depth || 0);
      item.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });

  root.addEventListener("pointerleave", () => {
    items.forEach((item) => {
      item.style.transform = "";
    });
  });
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.target || 0);
      const prefix = element.dataset.prefix || "";
      const suffix = element.textContent.includes("x") ? "x" : "%";
      const duration = 1400;
      const start = performance.now();

      const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        element.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
      countObserver.unobserve(element);
    });
  },
  { threshold: 0.5 }
);

countItems.forEach((item) => countObserver.observe(item));
