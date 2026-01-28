import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from './utils.mjs';
loadHeaderFooter();

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
  }

  addToCart() {
    let cart = getLocalStorage('so-cart') || [];
    cart.push(this.product);
    setLocalStorage('so-cart', cart);

    alert('Product added to cart!');
  }

  renderProductDetails() {
    document.querySelector('title').textContent =
      `SleepOutside | ${this.product.Name}`;

    const imagePath = this.product.Image.replace('../', '/');

    const main = document.querySelector('main');
    main.innerHTML = `
      <section class="product-detail">
        <h3>${this.product.Brand.Name}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        <img
          class="divider"
          src="${imagePath}"
          alt="${this.product.Name}"
        />
        <p class="product-card__price">$${this.product.FinalPrice}</p>
        <p class="product__color">${this.product.Colors[0].ColorName}</p>
        <p class="product__description">${this.stripHtmlTags(this.product.DescriptionHtmlSimple)}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;

    // ✅ Attach event listener AFTER rendering
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  stripHtmlTags(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  }
}
