const menuButton = document.querySelector(".menu-toggle");
const categoryNav = document.querySelector("#category-nav");
let categoryItems = categoryNav ? Array.from(categoryNav.querySelectorAll(".category-item")) : [];
const searchForm = document.querySelector(".search");
const endorsementGrid = document.querySelector(".endorsement-grid");
const endorsementPrev = document.querySelector(".endorsement-arrow--prev");
const endorsementNext = document.querySelector(".endorsement-arrow--next");
const cartCount = document.querySelector(".cart-count");
const cartButtons = document.querySelectorAll(".add-cart");
const footerForms = document.querySelectorAll(".footer-form");
const clippersLinks = document.querySelectorAll(
  '[data-category-link="clippers"], a[href$="clippers.html"], a[href$="milking-machines.html"]'
);
const pageImages = document.querySelectorAll("img");

let cartItems = Number(cartCount?.textContent || 0);

const updateCartLabel = () => {
  const itemText = cartItems === 1 ? "item" : "items";
  cartCount?.closest(".cart-link")?.setAttribute("aria-label", `Cart with ${cartItems} ${itemText}`);
};

const normalizeText = (text = "") => {
  return text
    .replace("⌄", "")
    .trim()
    .replace(/\s+([&])/g, "$1");
};

const ensureCategoryDropdownItems = () => {
  if (!categoryNav) return;

  const directAnchors = Array.from(categoryNav.querySelectorAll(":scope > a"));
  const fallbackLabels = ["Electric Fencing", "All Farming"];

  directAnchors.forEach((anchor) => {
    const label = normalizeText(anchor.textContent || "");
    if (!fallbackLabels.includes(label)) return;

    const hasDropdown = anchor.nextElementSibling?.classList?.contains("category-dropdown");
    if (hasDropdown) {
      return;
    }

    const slug = label.toLowerCase().replace(/\s+/g, "-");
    const wrapper = document.createElement("div");
    wrapper.className = `category-item category-item--${slug}`;

    const dropdown = document.createElement("div");
    dropdown.className = "category-dropdown";
    dropdown.setAttribute("aria-label", `${label} links`);

    const link = document.createElement("a");
    link.href = anchor.getAttribute("href") || "#";
    link.textContent = label;

    if (!/⌄/.test(anchor.innerHTML)) {
      anchor.innerHTML += ' <span aria-hidden="true">⌄</span>';
    }
    anchor.classList.add("is-fallback");

    anchor.parentElement.insertBefore(wrapper, anchor);
    wrapper.appendChild(anchor);
    dropdown.appendChild(link);
    wrapper.appendChild(dropdown);
    categoryItems.push(wrapper);
  });
};

const syncItemExpandedState = (item, isOpen) => {
  const trigger = item.querySelector("a");
  const toggle = item.querySelector(".category-dropdown-toggle");

  if (trigger) {
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  if (toggle) {
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
};

const closeCategoryDropdowns = (ignoreItem = null) => {
  categoryItems.forEach((item) => {
    if (item !== ignoreItem) {
      item.classList.remove("is-open");
      syncItemExpandedState(item, false);
    }
  });
};

const canUsePointerHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isCollapsedNav = () => window.matchMedia("(max-width: 760px)").matches;

const syncMenuButtonState = (isOpen) => {
  menuButton?.setAttribute("aria-expanded", String(isOpen));
  menuButton?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
};

const closeMobileMenu = () => {
  if (!categoryNav) return;
  categoryNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  closeCategoryDropdowns();
  syncMenuButtonState(false);
};

const openMobileMenu = () => {
  if (!categoryNav) return;
  categoryNav.classList.add("is-open");
  document.body.classList.add("menu-open");
  syncMenuButtonState(true);
};

const syncCollapsedMenuState = () => {
  if (!isCollapsedNav()) {
    closeMobileMenu();
  }
};

const menuScrim = menuButton && categoryNav ? document.createElement("button") : null;
if (menuScrim) {
  menuScrim.className = "menu-scrim";
  menuScrim.type = "button";
  menuScrim.setAttribute("aria-label", "Close menu");
  document.body.appendChild(menuScrim);
  menuScrim.addEventListener("click", () => {
    closeMobileMenu();
  });
}

const setItemOpen = (item, isOpen) => {
  item.classList.toggle("is-open", isOpen);
  syncItemExpandedState(item, isOpen);
};

ensureCategoryDropdownItems();

categoryItems = Array.from(
  new Set([...(categoryNav?.querySelectorAll(".category-item") || [])])
);

const ensureMobileDropdownToggles = () => {
  categoryItems.forEach((item, index) => {
    const trigger = item.querySelector("a");
    const dropdown = item.querySelector(".category-dropdown");

    if (!trigger || !dropdown) return;

    item.classList.add("category-item--has-mobile-toggle");

    const dropdownSlug =
      Array.from(item.classList)
        .find((className) => className.startsWith("category-item--") && className !== "category-item--has-mobile-toggle")
        ?.replace("category-item--", "") || `nav-item-${index + 1}`;

    if (!dropdown.id) {
      dropdown.id = `category-dropdown-${dropdownSlug}`;
    }

    const chevron = trigger.querySelector('span[aria-hidden="true"]');
    if (chevron) {
      chevron.classList.add("category-link-chevron");
    }

    let toggle = item.querySelector(".category-dropdown-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "category-dropdown-toggle";
      toggle.innerHTML = '<span class="category-dropdown-toggle-icon" aria-hidden="true">⌄</span>';
      trigger.insertAdjacentElement("afterend", toggle);
    }

    toggle.setAttribute("aria-label", `Toggle ${normalizeText(trigger.textContent || "")} submenu`);
    toggle.setAttribute("aria-controls", dropdown.id);
    toggle.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
  });
};

ensureMobileDropdownToggles();

categoryItems.forEach((item) => {
  const trigger = item.querySelector("a");
  const dropdown = item.querySelector(".category-dropdown");
  const toggle = item.querySelector(".category-dropdown-toggle");

  if (!trigger || !dropdown) return;

  item.addEventListener("pointerenter", () => {
    if (isCollapsedNav() || !canUsePointerHover()) return;
    closeCategoryDropdowns(item);
    setItemOpen(item, true);
  });
  item.addEventListener("mouseenter", () => {
    if (isCollapsedNav() || !canUsePointerHover()) return;
    closeCategoryDropdowns(item);
    setItemOpen(item, true);
  });

  item.addEventListener("pointerleave", (event) => {
    if (isCollapsedNav() || !canUsePointerHover()) return;
    if (!item.contains(event.relatedTarget)) {
      setItemOpen(item, false);
    }
  });
  item.addEventListener("mouseleave", (event) => {
    if (isCollapsedNav() || !canUsePointerHover()) return;
    if (!item.contains(event.relatedTarget)) {
      setItemOpen(item, false);
    }
  });

  trigger.addEventListener("click", (event) => {
    if (isCollapsedNav()) {
      return;
    }

    if (canUsePointerHover()) return;

    if (!item.classList.contains("is-open")) {
      event.preventDefault();
      event.stopPropagation();
      closeCategoryDropdowns();
      setItemOpen(item, true);
      return;
    }
  });

  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");

  toggle?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const nextIsOpen = !item.classList.contains("is-open");
    closeCategoryDropdowns(nextIsOpen ? item : null);
    setItemOpen(item, nextIsOpen);
  });

  trigger.addEventListener("focusout", (event) => {
    if (!item.contains(event.relatedTarget) && !item.classList.contains("is-open")) {
      item.classList.remove("is-open");
      syncItemExpandedState(item, false);
    }
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideNav = categoryNav?.contains(event.target);
  const clickedMenuButton = menuButton?.contains(event.target);

  if (isCollapsedNav() && categoryNav?.classList.contains("is-open") && !clickedInsideNav && !clickedMenuButton) {
    closeMobileMenu();
    return;
  }

  if (!clickedInsideNav) {
    closeCategoryDropdowns();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (isCollapsedNav() && categoryNav?.classList.contains("is-open")) {
    closeMobileMenu();
    return;
  }
  closeCategoryDropdowns();
});

menuButton?.addEventListener("click", () => {
  if (categoryNav?.classList.contains("is-open")) {
    closeMobileMenu();
    return;
  }

  openMobileMenu();
});

window.addEventListener("resize", syncCollapsedMenuState);

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

clippersLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (isCollapsedNav() && categoryNav?.contains(link)) return;

    event.preventDefault();
    window.location.assign(link.href);
  });
});

const scrollEndorsements = (direction) => {
  if (!endorsementGrid) return;

  const card = endorsementGrid.querySelector(".endorsement-card");
  const distance = card ? card.getBoundingClientRect().width + 28 : 320;
  endorsementGrid.scrollBy({ left: direction * distance, behavior: "smooth" });
};

endorsementPrev?.addEventListener("click", () => {
  scrollEndorsements(-1);
});

endorsementNext?.addEventListener("click", () => {
  scrollEndorsements(1);
});

cartButtons.forEach((button) => {
  const labelNode = Array.from(button.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  const originalText = labelNode?.textContent.trim() || "Add to Cart";

  button.addEventListener("click", () => {
    cartItems += 1;

    if (cartCount) {
      cartCount.textContent = String(cartItems);
      updateCartLabel();
    }

    button.classList.add("is-added");
    if (labelNode) labelNode.textContent = " Added";

    window.setTimeout(() => {
      button.classList.remove("is-added");
      if (labelNode) labelNode.textContent = ` ${originalText}`;
    }, 1400);
  });
});

footerForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("is-submitted");
  });
});

const cattleHero = document.querySelector(".category-hero--cattle-weighing");
if (cattleHero) {
  const heroImage = cattleHero.querySelector("img");
  const imagePath = "./assets/shop/cattle-weighing-hero-hires.png";
  cattleHero.style.background = `linear-gradient(90deg, rgba(12, 24, 16, 0.78) 0%, rgba(12, 24, 16, 0.58) 48%, rgba(12, 24, 16, 0.24) 100%), url('${imagePath}') center 58% / cover no-repeat`;
  cattleHero.style.backgroundAttachment = "scroll";
  cattleHero.style.backgroundRepeat = "no-repeat";
  if (heroImage) {
    heroImage.setAttribute("src", imagePath);
  }
}

pageImages.forEach((image) => {
  const isCriticalBrandImage =
    image.closest(".brand-lockup") ||
    image.closest(".footer-brand-lockup") ||
    image.closest(".hero-section");
  const isCriticalCategoryHeroImage = image.closest(".category-hero-media");

  if (!isCriticalBrandImage && !isCriticalCategoryHeroImage) {
    image.loading = "lazy";
    image.decoding = "async";
  }
});
