import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from './utils.mjs';
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  const productList = document.querySelector(".cart-list");
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotalEl = document.querySelector(".cart-total");

  if (!cartItems || cartItems.length === 0) {
    productList.innerHTML = "<li>Your cart is empty</li>";
    cartFooter.classList.add("hide"); // hide footer when not items yet
    return;
  }

  // Renderizamos los items
  const htmlItems = cartItems.map(cartItemTemplate);
  productList.innerHTML = htmlItems.join("");

  // Calculamos el total
  const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);

  // Mostramos el footer con el total
  cartFooter.classList.remove("hide");
  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  // Agregar botón de Checkout si aún no existe
  if (!document.querySelector(".checkout-btn")) {
    const checkoutBtn = document.createElement("button");
    checkoutBtn.textContent = "Checkout";
    checkoutBtn.className = "checkout-btn";
    checkoutBtn.addEventListener("click", () => {
      alert("Checkout not implement yet"); // Message
    });
    cartFooter.appendChild(checkoutBtn);
  }
}

function cartItemTemplate(item) {
  const imagePath = item.Image.replace("../", "/");

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${imagePath}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

// Ejecutamos al cargar la página
renderCartContents();
