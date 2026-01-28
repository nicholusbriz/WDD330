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
    return;
  }

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index)
  );
  listElement.innerHTML = htmlItems.join('');

  // Attach event listeners for remove buttons
  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      removeCartItem(index);
    });
  });
}

function cartItemTemplate(item, index) {
  const imagePath = item.Image.replace('../', '/');
  const name = item.Name || item.NameWithoutBrand;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
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

renderCartContents();
