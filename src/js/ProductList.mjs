// ProductList.mjs
import { renderListWithTemplate, loadHeaderFooter } from './utils.mjs';
loadHeaderFooter();

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const list = await this.dataSource.getData(this.category);
      this.renderList(list);
    } catch (error) {
      this.listElement.innerHTML = '<p>Error loading products. Please try again.</p>';
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}

export function productCardTemplate(product) {
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

  const imagePath = getImage(product);

  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${imagePath}" alt="${product.Name}" />
      <div class="product-card__brand">
        ${product.Brand?.LogoSrc ? `<img src="${product.Brand.LogoSrc}" alt="${product.Brand.Name}" class="brand-logo" />` : ''}
        <h3>${product.Brand?.Name ?? ''}</h3>
      </div>
      <h2 class="card__name">${product.NameWithoutBrand ?? product.Name ?? ''}</h2>
      <p class="product-card__price">$${product.FinalPrice ?? ''}</p>
    </a>
  </li>`;
}
