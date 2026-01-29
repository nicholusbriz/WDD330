import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
  alertMessage,
} from './utils.mjs';
loadHeaderFooter();

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    const response = await this.dataSource.findProductById(this.productId);
    // Handle the nested Result structure from the API
    this.product = response.Result || response;
    this.renderProductDetails();
  }

  addToCart() {
    let cart = getLocalStorage('so-cart') || [];
    cart.push(this.product);
    setLocalStorage('so-cart', cart);

    alertMessage('Product added to cart!', false); // Don't scroll on product pages
  }

  renderProductDetails() {
    if (!this.product) {
      document.querySelector('main').innerHTML = '<p>Product not found</p>';
      return;
    }

    document.querySelector('title').textContent =
      `SleepOutside | ${this.product.Name || this.product.NameWithoutBrand || 'Product'}`;

    // Handle image from API structure
    const getImage = (p) => {
      if (!p) return '';
      // Handle API structure with Images object
      if (p.Images && p.Images.PrimaryLarge) {
        return p.Images.PrimaryLarge;
      }
      // Fallback for other structures
      if (p.PrimaryLarge) {
        if (typeof p.PrimaryLarge === 'string') return p.PrimaryLarge;
        if (p.PrimaryLarge.Url) return p.PrimaryLarge.Url;
      }
      if (p.Image) return p.Image.replace('../', '/');
      return '';
    };

    const imagePath = getImage(this.product);

    const main = document.querySelector('main');
    main.innerHTML = `
      <section class="product-detail">
        <div class="product-detail__brand">
          ${this.product.Brand?.LogoSrc ? `<img src="${this.product.Brand.LogoSrc}" alt="${this.product.Brand.Name}" class="brand-logo" />` : ''}
          <h3>${this.product.Brand?.Name || ''}</h3>
        </div>
        <h2 class="divider">${this.product.NameWithoutBrand || this.product.Name || ''}</h2>
        <img
          class="divider"
          src="${imagePath}"
          alt="${this.product.Name || ''}"
        />
        <p class="product-card__price">$${this.product.FinalPrice || ''}</p>
        <p class="product__color">${this.product.Colors?.[0]?.ColorName || ''}</p>
        <p class="product__description">${this.stripHtmlTags(this.product.DescriptionHtmlSimple || '')}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;

    // Attach event listener AFTER rendering
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  stripHtmlTags(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  }
}
