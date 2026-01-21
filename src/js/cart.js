import { getLocalStorage } from "./utils.mjs";

// Safe helper to get the cart as an array
function getCart() {
  const cart = getLocalStorage("so-cart");
  // Ensure it's an array
  if (!Array.isArray(cart)) return [];
  return cart;
}

// Render cart items and total
function renderCartContents() {
  const cartItems = getCart();

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );
  const listEl = document.querySelector(".product-list");
  if (listEl) listEl.innerHTML = htmlItems.join("");

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.FinalPrice || 0);
    const qty = Number(item.Quantity || 1);
    return sum + price * qty;
  }, 0);

  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = total.toFixed(2);
}

// Template for a single cart item
function cartItemTemplate(item, index) {
  return `
    <li class="cart-card divider" data-index="${index}">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}">
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="remove-item" data-index="${index}">Remove</button>
    </li>
  `;
}

// Remove item handler
function setupRemoveButtons() {
  document.querySelector(".product-list")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const index = e.target.dataset.index;
      const cart = getCart();
      cart.splice(index, 1); // remove from array
      localStorage.setItem("so-cart", JSON.stringify(cart));
      renderCartContents(); // re-render after removal
    }
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  renderCartContents();
  setupRemoveButtons();
});
