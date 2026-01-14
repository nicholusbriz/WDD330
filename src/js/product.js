import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cart = JSON.parse(localStorage.getItem("so-cart") || "[]");

  const itemIndex = cart.findIndex((item) => item.Id === product.Id);

  if (itemIndex >= 0) {
    cart[itemIndex].qty += 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }

  localStorage.setItem("so-cart", JSON.stringify(cart));
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
