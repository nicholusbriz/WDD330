// main.js
import ExternalServices from './ExternalServices.mjs';
import CategoryManager from './CategoryManager.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

// Initialize category manager
const dataSource = new ExternalServices();
const categoryManager = new CategoryManager(dataSource);

// Make filterByCategory available globally for onclick handlers
window.filterByCategory = async (category) => await categoryManager.filterByCategory(category);

// Initialize the page
categoryManager.initialize();
