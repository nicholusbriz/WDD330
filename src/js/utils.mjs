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

export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = true) {
  if (clear) {
    parentElement.innerHTML = '';
  }

  const validList = list.filter(item => item.Image && item.Image.trim() !== "");
  const htmlStrings = validList.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {

  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#main-header");
  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#main-footer");
  renderWithTemplate(footerTemplate, footerElement);
}
