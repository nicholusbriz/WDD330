import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from './utils.mjs';
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const listElement = document.querySelector('.cart-list');

  if (cartItems.length === 0) {
    listElement.innerHTML = '<li>Your cart is empty</li>';
    displayTotals(0, 0, 0, 0);
    return;
  }

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index)
  );
  listElement.innerHTML = htmlItems.join('');

  // Calculate and display totals
  calculateAndDisplayTotals(cartItems);

  // Attach event listeners for remove buttons
  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      removeCartItem(index);
    });
  });
}

function cartItemTemplate(item, index) {
  // Handle API image structure
  const getImage = (p) => {
    if (!p) return '';
    // Handle API structure with Images object
    if (p.Images && p.Images.PrimaryMedium) {
      return p.Images.PrimaryMedium;
    }
    // Fallback for other structures
    if (p.PrimaryMedium) {
      if (typeof p.PrimaryMedium === 'string') return p.PrimaryMedium;
      if (p.PrimaryMedium.Url) return p.PrimaryMedium.Url;
    }
    if (p.Image) return p.Image.replace('../', '/');
    return '';
  };

  const imagePath = getImage(item);
  const name = item.Name || item.NameWithoutBrand;

  return `
    <li class="cart-card divider">
      <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${imagePath}" alt="${name}" />
      </a>
      <h2 class="card__name">${name}</h2>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || 'No color selected'}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="remove-item" data-index="${index}">Remove</button>
    </li>
  `;
}

function removeCartItem(index) {
  let cartItems = getLocalStorage('so-cart') || [];
  cartItems.splice(index, 1); // remove item at that index
  setLocalStorage('so-cart', cartItems);
  renderCartContents(); // re-render cart after removal
}

function calculateAndDisplayTotals(cartItems) {
  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + item.FinalPrice;
  }, 0);

  // Calculate tax (6%)
  const tax = subtotal * 0.06;

  // Calculate shipping ($10 for first item + $2 for each additional)
  const shipping = cartItems.length > 0 ? 10 + (cartItems.length - 1) * 2 : 0;

  // Calculate total
  const total = subtotal + tax + shipping;

  // Display all totals
  displayTotals(subtotal, tax, shipping, total);
}

function displayTotals(subtotal, tax, shipping, total) {
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

renderCartContents();
