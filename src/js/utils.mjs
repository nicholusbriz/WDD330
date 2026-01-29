// utils.mj
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = '';
  }

  const validList = list.filter((item) => {
    // Check for API image structure with Images object
    const hasImage = (item.Images && item.Images.PrimaryMedium) || 
                     item.PrimaryMedium || 
                     item.Image;
    return hasImage && hasImage !== '';
  });
  const htmlStrings = validList.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('../partials/header.html');
  const headerElement = document.querySelector('#main-header');
  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate('../partials/footer.html');
  const footerElement = document.querySelector('#main-footer');
  renderWithTemplate(footerTemplate, footerElement);
}

// Cache management utilities
export function getCacheInfo() {
  try {
    const cached = localStorage.getItem('productData_1.0');
    if (!cached) return 'No cache found';
    
    const cache = JSON.parse(cached);
    let info = 'Cache Status:\n';
    
    for (const category in cache) {
      const age = Date.now() - cache[category].timestamp;
      const minutes = Math.floor(age / 60000);
      const expired = age > 30 * 60 * 1000;
      
      info += `${category}: ${cache[category].data?.length || 0} items, ${minutes}m old ${expired ? '(EXPIRED)' : '(FRESH)'}\n`;
    }
    
    return info;
  } catch (error) {
    return 'Error reading cache: ' + error.message;
  }
}

export function clearProductCache() {
  localStorage.removeItem('productData_1.0');
  return 'Product cache cleared';
}

// Alert message utility for user feedback
export function alertMessage(message, scroll = true) {
  // Create element to hold the alert
  const alert = document.createElement('div');
  // Add a class to style the alert
  alert.classList.add('alert');
  // Set the contents with message and close button
  alert.innerHTML = `
    <div class="alert-content">
      <span>${message}</span>
      <button class="alert-close" aria-label="Close alert">×</button>
    </div>
  `;

  // Add a listener to the alert to see if they clicked on the X
  alert.addEventListener('click', function(e) {
    if (e.target.classList.contains('alert-close')) {
      main.removeChild(this);
    }
  });

  // Add the alert to the top of main
  const main = document.querySelector('main');
  main.prepend(alert);
  

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function preloadAllData() {
  // This will be called from main.js to preload all categories
  import('./ExternalServices.mjs').then(module => {
    const externalServices = new module.default();
    externalServices.preloadData();
  });
}
