const menuButton = document.querySelector(".menu-toggle");
const categoryNav = document.querySelector("#category-nav");
const searchForm = document.querySelector(".search");
const endorsementGrid = document.querySelector(".endorsement-grid");
const endorsementPrev = document.querySelector(".endorsement-arrow--prev");
const endorsementNext = document.querySelector(".endorsement-arrow--next");
const cartCount = document.querySelector(".cart-count");
const cartButtons = document.querySelectorAll(".add-cart");
const footerForms = document.querySelectorAll(".footer-form");
const clippersLinks = document.querySelectorAll('[data-category-link="clippers"], a[href$="clippers.html"]');
const pageImages = document.querySelectorAll("img");

let cartItems = Number(cartCount?.textContent || 0);

const updateCartLabel = () => {
  const itemText = cartItems === 1 ? "item" : "items";
  cartCount?.closest(".cart-link")?.setAttribute("aria-label", `Cart with ${cartItems} ${itemText}`);
};

menuButton?.addEventListener("click", () => {
  const isOpen = categoryNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

clippersLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

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

pageImages.forEach((image) => {
  const isCriticalBrandImage =
    image.closest(".brand-lockup") ||
    image.closest(".footer-brand-lockup") ||
    image.closest(".hero-section");

  if (!isCriticalBrandImage) {
    image.loading = "lazy";
    image.decoding = "async";
  }
});
