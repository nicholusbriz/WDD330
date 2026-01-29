import { getLocalStorage } from './utils.mjs';

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    // Calculate and display the total dollar amount of the items in the cart
    this.itemTotal = this.list.reduce((sum, item) => {
      return sum + item.FinalPrice;
    }, 0);

    // Display the subtotal
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #summary-subtotal`
    );
    if (subtotalElement) {
      subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    // Simple tax and shipping calculation
    this.tax = this.itemTotal * 0.06; // 6% tax
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0; // $10 + $2 each
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElement = document.querySelector(
      `${this.outputSelector} #summary-tax`
    );
    const shippingElement = document.querySelector(
      `${this.outputSelector} #summary-shipping`
    );
    const totalElement = document.querySelector(
      `${this.outputSelector} #summary-total`
    );

    if (taxElement) {
      taxElement.textContent = `$${this.tax.toFixed(2)}`;
    }
    if (shippingElement) {
      shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
    }
    if (totalElement) {
      totalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  // Package items for checkout
  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name || item.NameWithoutBrand,
      price: item.FinalPrice,
      quantity: 1,
    }));
  }

  // Checkout method
  async checkout(form) {
    const formData = new FormData(form);
    const orderData = {
      orderDate: new Date().toISOString(),
      fname: formData.get('fname'),
      lname: formData.get('lname'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      cardNumber: formData.get('cardNumber'),
      expiration: formData.get('expiration'),
      code: formData.get('code'),
      items: this.packageItems(getLocalStorage(this.key)),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    // Format expiration date from YYYY-MM to MM/YY
    if (orderData.expiration && orderData.expiration.includes('-')) {
      const [year, month] = orderData.expiration.split('-');
      orderData.expiration = `${month}/${year.slice(2)}`;
    }

    // Import ExternalServices here to avoid circular dependency
    const { default: ExternalServices } = await import('./ExternalServices.mjs');
    const externalServices = new ExternalServices();
    
    try {
      const response = await externalServices.checkout(orderData);
      return response;
    } catch (err) {
      if (err.name === 'servicesError') {
        throw err; // Re-throw service errors to be handled by checkout.js
      } else {
        throw { name: 'checkoutError', message: 'Checkout failed' };
      }
    }
  }
}
