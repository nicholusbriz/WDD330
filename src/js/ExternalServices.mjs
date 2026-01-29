// ExternalServices.mjs - PURE data layer - API calls only
const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';

// Convert response to JSON with proper error handling
async function convertToJson(res) {
  const jsonResponse = await res.json();
  
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    // API service 
  }

  // Get products for a specific category from API
  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Find a specific product by ID
  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Checkout method - simplified for W04
  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    return fetch('https://wdd330-backend.onrender.com/checkout', options)
      .then(convertToJson);
  }
}
