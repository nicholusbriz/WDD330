import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const productId = getParam("product");
  const dataSource = new ProductData("tents");
  const productPage = new ProductDetails(productId, dataSource);

  await productPage.init();
});
