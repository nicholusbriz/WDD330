import { loadHeaderFooter, getLocalStorage, alertMessage } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

// Initialize checkout process
const checkout = new CheckoutProcess('so-cart', 'main');
checkout.init();

// Calculate order total when zip code is filled
document.getElementById('zip').addEventListener('change', () => {
  checkout.calculateOrderTotal();
});

// Handle form submission
document
  .getElementById('checkout-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    // Make sure totals are calculated
    checkout.calculateOrderTotal();

    try {
      // Form validation
    const form = e.target;
    const isFormValid = form.checkValidity();
    form.reportValidity();
    
    if (!isFormValid) {
      return; // Stop if form is not valid
    }

      const response = await checkout.checkout(e.target);
      // Success: Clear cart and redirect to success page
      localStorage.removeItem('so-cart');
      window.location.href = '/checkout/success.html';
    } catch (error) {
      // Show user-friendly error message
      let userMessage = 'Order processing failed. Please check your information and try again.';
      
      // If server sent specific error details, use those
      if (error.name === 'servicesError' && error.message) {
        if (typeof error.message === 'string') {
          userMessage = error.message;
        } else if (error.message.message) {
          userMessage = error.message.message;
        } else if (Array.isArray(error.message)) {
          userMessage = error.message.join(', ');
        }
      }
      
      alertMessage(userMessage);
    }
  });
