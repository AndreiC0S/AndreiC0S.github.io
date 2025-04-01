// ------------------ GLOBAL VARIABLES ------------------
let data = []; // Array-ul de produse preluat din backend
let productArray; // Coșul de cumpărături
let idProduct = [];
let isInCart = 0;
let indexItems = 0;

const productsDOM = document.getElementById('products-container');
const range = document.getElementById('range'); // Input pentru setarea prețului maxim
const priceValue = document.querySelector('.price-value');
const AllProductz = document.getElementsByClassName('product');
const search_bar = document.getElementById('searchbar');
const formular = document.querySelector(".input-form");
const cartListBox = document.getElementById('kart-box');
const productNumber = document.querySelector(".cart-item-count");

// ------------------ INITIALIZATION ------------------
window.addEventListener("load", () => {
  // Încarcă coșul din localStorage
  getCart();
  
  // Preia produsele și afișează-le
  fetchProducts().then((res) => {
    data = res; // Salvează datele global
    displayProducts(data);
    attachCartButtons(); // Atașează evenimentele "Add to Cart" după ce produsele sunt inserate
  });
  
  // Preia categoriile și afișează-le ca checkbox-uri în containerul cu clasa "companies"
  fetchCategories().then(() => {
    attachCategoryFilter();
  });
  
  // Evenimente pentru filtrarea combinată:
  // Căutare
  search_bar.addEventListener("input", (e) => {
    e.preventDefault();
    applyAllFilters();
  });
  
  // Filtrare după preț
  range.addEventListener("input", (e) => {
    e.preventDefault();
    // (Opțional: actualizează afișajul prețului maxim, dacă ai un element dedicat)
    applyAllFilters();
  });
  

 
  const cartListBox = document.getElementById('kart-box')

const toggleChartList = () => {
  if (cartListBox.classList.contains('kart-hidden')) {
    cartListBox.classList.remove("kart-hidden")
    cartListBox.classList.add('kart-box')
  } else {
    cartListBox.classList.add("kart-hidden")
  }
}
  // Toggle pentru coșul de cumpărături
  const cartListButton = document.querySelector(".toggle-cart");
  if (cartListButton && cartListBox) {
    cartListButton.addEventListener("click", () => {
      toggleChartList()
    });
  }
});

// ------------------ FETCH FUNCTIONS ------------------
async function fetchProducts() {
  const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/products', {
    headers: { 'Authorization': 'Bearer ' }
  });
  const products = await response.json();

  return products;
}

async function fetchCategories() {
  const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/categories', {
    headers: { 'Authorization': 'Bearer ' }
  });
  const categories = await response.json();
  displayCategories(categories);
}

// ------------------ DISPLAY FUNCTIONS ------------------
const displayProducts = (list) => {
  const productList = list.map((product, index) => {
    const id = product.id;
    const company = product.slug;
    const title = product.name;
    const priceProduct = product.price;
    const img = product.image_url ? `https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/${product.image_url}` : "placeholder.jpg";
    
    return `<article class="product price" data-id="${id}">
      <div class="product-container">
        <img src="${img}" class="product-img img" alt="${title}">
        <div class="product-icons">
          <a href="product.html?${company}-${id}" class="product-icon">
            <i class="fas fa-search"></i>
          </a>
          <button class="product-cart-btn product-icon" data-id="${id}" data-ind="${index}">
            <i class="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
      <footer>
        <p class="product-name">${title}</p>
        <h5>${company}</h5>
        <h4 class="product-price">${priceProduct} Ron</h4>
      </footer>
    </article>`;
  }).join('');
  productsDOM.innerHTML = productList;
};

function displayCategories(categories) {
  // Folosim containerul din <article class="companies">
  const companiesContainer = document.querySelector('.companies');
  if (!companiesContainer) return;
  
  let html = `<button class="company-btn" onclick="resetCat()" id="all">Reset Filters</button>`;
  categories.forEach(category => {
    html += `
      <label class="company-btn">
        <input type="checkbox" class="category-checkbox" value="${category.id}">
        ${category.name}
      </label>
    `;
  });
  companiesContainer.innerHTML = html;
}

// ------------------ COMBINED FILTER FUNCTION ------------------
function resetCat(){
  search_bar.value = "";
  range.value = "";
  document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
  applyAllFilters();
}
function applyAllFilters() {
  let filtered = [...data]; // Începem cu toate produsele
  
  // Filtrare după nume (search bar)
  const searchTerm = search_bar.value.trim().toLowerCase();
  if (searchTerm !== "") {
    filtered = filtered.filter(product => product.name.toLowerCase().includes(searchTerm));
  }
  
  // Filtrare după preț (input number "range")
  const maxPrice = Number(range.value);
  if (range.value !== "" && maxPrice > 0) {
    filtered = filtered.filter(product => Number(product.price) <= maxPrice);
  }
  
  // Filtrare după categorii (checkbox-uri)
  const selectedCategoryIds = Array.from(document.querySelectorAll('.category-checkbox:checked'))
    .map(cb => Number(cb.value));
  if (selectedCategoryIds.length > 0) {
    filtered = filtered.filter(product => {
      if (product.categories && Array.isArray(product.categories)) {
        const productCatIds = product.categories.map(cat => cat.id);
        return selectedCategoryIds.some(id => productCatIds.includes(id));
      }
      return false;
    });
  }
  
  displayProducts(filtered);
  attachCartButtons(); // Reatașează butoanele de "Add to Cart" pentru produsele afișate
}

// Atașează evenimente pentru checkbox-uri de categorii
function attachCategoryFilter() {
  document.querySelectorAll('.category-checkbox').forEach(cb => {
    cb.addEventListener('change', applyAllFilters);
  });
}

// ------------------ CART FUNCTIONS ------------------

function getCart() {
  let a = localStorage.getItem('cart');
  if (a) {
    productArray = JSON.parse(a);
  } else {
    productArray = [];
  }
  addItemsToCart(productArray);
  getCartCount();
  totalPrice();
}

function getCartCount() {
  isInCart = 0;
  idProduct = []; // Resetează lista de id-uri
  productArray.forEach(element => {
    isInCart += element.quantity;
    idProduct.push(element.id);
  });
  productNumber.textContent = isInCart;
  if(Number(productNumber.textContent) > 0 ){
    console.log('este')
     checkout.classList.remove('hidden')
     checkout.classList.add('checkout')
  }
}

function attachCartButtons() {
  const buttons = document.querySelectorAll(".product-cart-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      addToCart(id);
    });
  });
}

function addToCart(productId) {
  let productObj = data.find(product => product.id == productId);
  if (!productObj) return;
  const id = productObj.id;
  const company = productObj.slug;
  const title = productObj.name;
  const price = productObj.price;
  const img = productObj.image_url ? `https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/${productObj.image_url}` : "placeholder.jpg";
  
  let existing = productArray.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    productArray.push({
      id,
      quantity: 1,
      company,
      title,
      price,
      img,
    });
  }
  localStorage.setItem('cart', JSON.stringify(productArray));
  addItemsToCart(productArray);
  getCartCount();
  totalPrice();
}

function addItemsToCart(productArray) {
  const productList = productArray.map((product, index) => {
    return `<div class="addItemToCart" data-cartInd="${index}">
      <img src="${product.img}" class="single-product-img img" alt="${product.title}">
      <div>
        <h3 class="titleProduct">${product.title}</h3>
        <div class="detalii">
          <p>${product.company}</p>
          <div id="btnContainer">
            <p class="qtyItems" data-quantity="${product.quantity}">Qty: ${product.quantity}</p>
            <button class="btnSubProduct" onclick="AddSubItem(${index}, -1)">-</button>
            <button class="btnAddProduct" onclick="AddSubItem(${index}, 1)">+</button>
          </div>
        </div>
      </div>
      <div class="pPriceBox">
        <p> Price: </p>
        <p class="pPrice" data-price="${product.price}" data-quantity="${product.quantity}">${(product.price * product.quantity).toFixed(2)}$</p>
      </div>
      <button class="deleteProduct" onclick="deleteProd(${index})"><img class="delProdX" src="./assets/img/redX.png" alt="x"></button>
    </div>`;
  }).join('');
  document.querySelector('#kart-box-content').innerHTML = productList;
}

function deleteProd(index) {
  try {
    productArray.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(productArray));
    addItemsToCart(productArray);
    getCartCount();
    totalPrice();
  } catch (error) {
    console.error(error);
  }
}

function AddSubItem(index, quantity) {
  try {
    productArray[index].quantity += quantity;
    if (productArray[index].quantity < 1) {
      productArray[index].quantity = 1;
    }
    localStorage.setItem('cart', JSON.stringify(productArray));
    addItemsToCart(productArray);
    getCartCount();
    totalPrice();
  } catch (error) {
    console.error(error);
  }
}

function totalPrice() {
  const totalElem = document.querySelector("#total");
  
  let total = productArray.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalElem.textContent = `${total.toFixed(2)} $`;
}

// Expune funcțiile pentru evenimente inline (pentru butoanele din coș)
window.AddSubItem = AddSubItem;
window.deleteProd = deleteProd;



