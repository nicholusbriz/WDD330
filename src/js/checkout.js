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
      // Form validation (REQUIRED by W04)
      const form = e.target;
      const chk_status = form.checkValidity();
      form.reportValidity();
      
      if (!chk_status) {
        return; // Stop if form is not valid
      }

      const response = await checkout.checkout(e.target);
      // Success: Clear cart and redirect to success page
      localStorage.removeItem('so-cart');
      window.location.href = '/checkout/success.html';
    } catch (error) {
      // Handle detailed error messages from server
      let errorMessage = 'Order processing failed. Please check your information and try again.';
      
      if (error.name === 'servicesError' && error.message) {
        // Extract specific error details from server response
        if (typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (error.message.message) {
          errorMessage = error.message.message;
        } else if (Array.isArray(error.message)) {
          errorMessage = error.message.join(', ');
        }
      }
      
      alertMessage(errorMessage);
    }
  });
