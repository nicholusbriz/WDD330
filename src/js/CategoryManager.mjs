// CategoryManager.mjs - Manages category cards and product filtering
export default class CategoryManager {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.currentCategory = 'all';
  }

  // Define category display names and SVG files
  getCategoryInfo() {
    return {
      'tents': { name: 'Tents', svg: 'tents.svg' },
      'backpacks': { name: 'Backpacks', svg: 'backpack.svg' },
      'sleeping-bags': { name: 'Sleeping Bags', svg: 'sleeping-bag.svg' },
      'hammocks': { name: 'Hammocks', svg: 'hammock.svg' }
    };
  }

  // Generate category cards dynamically from API data
  async generateCategoryCards() {
    const categoriesGrid = document.getElementById('categories-grid');
    
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    const categoryInfo = this.getCategoryInfo();
    
    // Get all categories data from API (using this.getAllCategories, not dataSource)
    const categoryData = await this.getAllCategories();
    
    // Generate category cards for each category
    for (const category in categoryData) {
      if (categoryData[category] && categoryInfo[category]) {
        const info = categoryInfo[category];
        const products = categoryData[category];
        const productCount = Array.isArray(products) ? products.length : 0;
        
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.onclick = () => window.filterByCategory(category);
        categoryCard.innerHTML = `
          <img src="/images/categories/${info.svg}" alt="${info.name}">
          <h3>${info.name}</h3>
          <span class="product-count">${productCount} items</span>
        `;
        
        categoriesGrid.appendChild(categoryCard);
      }
    }
  }

  // Get all categories data from API (business logic)
  async getAllCategories() {
    const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
    const categoryPromises = categories.map(async (category) => {
      try {
        const products = await this.dataSource.getData(category);
        console.log(`Products for ${category}:`, products); // Debug log
        
        // Extract the actual array from the Result object
        const productList = products.Result || [];
        
        return {
          category,
          products: productList
        };
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return {
          category,
          products: []
        };
      }
    });

    const results = await Promise.all(categoryPromises);
    const categoryData = {};
    
    results.forEach(result => {
      categoryData[result.category] = result.products;
    });

    console.log('Final category data:', categoryData); // Debug log
    return categoryData;
  }

  // Get products for a specific category with business logic
  async getProductsForCategory(category = 'all') {
    if (category === 'all') {
      // Get all categories and combine products
      const categoryData = await this.getAllCategories();
      let productsToShow = [];
      
      for (const cat in categoryData) {
        if (categoryData[cat]) {
          productsToShow = productsToShow.concat(categoryData[cat]);
        }
      }
      
      return productsToShow;
    } else {
      // Get specific category from API and extract from Result object
      const allProducts = await this.dataSource.getData(category);
      
      // Extract the actual array from the Result object
      const productList = allProducts.Result || [];
      
      // Filter products by category (since API doesn't filter properly)
      const filteredProducts = productList.filter(product => 
        product.Category.toLowerCase() === category.toLowerCase()
      );
      
      return filteredProducts;
    }
  }

  // Display products by category
  async displayProducts(category = 'all') {
    const listElement = document.querySelector('.product-list');
    const productsSection = document.querySelector('.products');
    this.currentCategory = category;
    
    // Show the products section when displaying products
    if (productsSection) {
      productsSection.style.display = 'block';
    }
    
    const productsToShow = await this.getProductsForCategory(category);
    
    // Completely clear the product list
    listElement.innerHTML = '';
    
    if (productsToShow.length > 0) {
      // Update title first
      this.updatePageTitle(category, productsToShow.length);
      
      // Render products directly without creating a new ProductList instance
      await this.renderProductsDirectly(productsToShow, listElement);
    } else {
      listElement.innerHTML = '<p>No products found for this category.</p>';
    }
  }

  // Render products directly to avoid ProductList state issues
  async renderProductsDirectly(products, listElement) {
    // Import the productCardTemplate function
    const { productCardTemplate } = await import('./ProductList.mjs');
    
    // Generate HTML for all products
    const productHTML = products.map(product => productCardTemplate(product)).join('');
    
    // Set the HTML directly
    listElement.innerHTML = productHTML;
  }

  // Update page title with category and product count
  updatePageTitle(category, productCount) {
    const titleElement = document.querySelector('h2');
    if (category === 'all') {
      titleElement.textContent = `Top Products (${productCount} items)`;
    } else {
      titleElement.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)} (${productCount} items)`;
    }
  }

  // Filter by category (public method for onclick handlers)
  async filterByCategory(category) {
    // Show the products section when filtering
    const productsSection = document.querySelector('.products');
    if (productsSection) {
      productsSection.style.display = 'block';
    }
    
    await this.displayProducts(category);
  }

  // Initialize the category manager
  async initialize() {
    // Generate category cards from API data
    await this.generateCategoryCards();
    
    // Hide the products section initially
    const productsSection = document.querySelector('.products');
    if (productsSection) {
      productsSection.style.display = 'none';
    }
  }
}
