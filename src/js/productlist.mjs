// src/js/ProductList.mjs
import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const { Id, Brand, Name, FinalPrice, Image } = product;
  const price = Number(FinalPrice).toFixed(2);
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${encodeURIComponent(Id)}" aria-label="${Brand} ${Name}">
        <img src="${Image}" alt="Image of ${Brand} ${Name}" loading="lazy">
        <h2 class="card__brand">${Brand}</h2>
        <h3 class="card__name">${Name}</h3>
        <p class="product-card__price">$${price}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    const list = await this.dataSource.getData();
    this.products = this.category ? list.filter(p => p.Category === this.category) : list;
    this.renderList(this.products);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
