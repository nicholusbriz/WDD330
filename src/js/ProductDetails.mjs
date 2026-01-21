export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = null;
  }

  async init() {
    // 1. Fetch product
    this.product = await this.dataSource.findProductById(this.productId);

    // 2. Render product
    this.renderProductDetails();

    // 3. Attach Add-to-Cart listener
    const addToCartBtn = document.getElementById("addToCart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener(
        "click",
        this.addProductToCart.bind(this)
      );
    }
  }

  renderProductDetails() {
    if (!this.product) return;

    const titleEl = document.getElementById("productTitle");
    const descEl = document.getElementById("productDescription");
    const priceEl = document.getElementById("productPrice");
    const imageEl = document.getElementById("productImage");
    const brandEl = document.getElementById("productBrand");
    const colorEl = document.getElementById("productColor");

    if (titleEl) titleEl.textContent = this.product.NameWithoutBrand;
    if (descEl) descEl.innerHTML = this.product.DescriptionHtmlSimple;
    if (priceEl) priceEl.textContent = `$${this.product.FinalPrice}`;

    if (imageEl) {
      imageEl.src = this.product.Image;
      imageEl.alt = this.product.Name;
    }

    if (brandEl) brandEl.textContent = this.product.Brand?.Name || "";
    if (colorEl) colorEl.textContent = this.product.Colors?.[0]?.Name || "";
  }

  addProductToCart() {
    let cart = JSON.parse(localStorage.getItem("so-cart"));

    if (!Array.isArray(cart)) {
      cart = [];
    }

    cart.push({
      ...this.product,
      Quantity: 1
    });

    localStorage.setItem("so-cart", JSON.stringify(cart));
    console.log("✅ Added to cart:", this.product.Name);
  }
}
