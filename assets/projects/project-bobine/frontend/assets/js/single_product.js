// ------------------ GLOBAL VARIABLES ------------------
let data = [];            // Array-ul de produse preluat din backend
let productArray = [];    // Coșul de cumpărături (stocat în localStorage)
let idProduct = [];       // Lista de id-uri din coș
let isInCart = 0;         // Numărul total de articole din coș

const singleProductDOM = document.getElementById('single-products'); // Container pentru produsul single
const cartListBox = document.getElementById('kart-box');             // Containerul coșului (toggle visibility)
const cartListContent = document.getElementById('kart-box-content');   // Conținutul coșului
const productNumber = document.querySelector('.cart-item-count');      // Elementul care afișează numărul total de articole

// ------------------ SINGLE PRODUCT DISPLAY ------------------

// Extrage parametrul "id" din URL
function getProductIdFromURL() {
  const search = window.location.search; // ex: "?gallery-images-39"
  if (!search) return null;
  // Elimină semnul "?" de la început
  const cleaned = search.substring(1); // "gallery-images-39"
  const parts = cleaned.split('-');       // ["gallery", "images", "39"]
  return parts[parts.length - 1];           // "39"
}

// Fetch pentru produse
async function fetchProducts() {
  const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/products', {
    headers: { 'Authorization': 'Bearer ' }
  });
  const products = await response.json();
  return products;
}

// Afișează produsul single pe pagină
function displaySingleProduct(products) {
  const productId = getProductIdFromURL();
  if (!productId) return;
  const product = products.find(p => p.id == productId);
  if (!product) {
    singleProductDOM.innerHTML = `<p>Product not found</p>`;
    return;
  }
  // Presupunem că datele produsului se află în "product.fields" (ajustează dacă e necesar)
  
  const title = product.name;
  const img = product.image_url ? `https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/${product.image_url}` : "placeholder.jpg";
  const price = product.price;
  

  const markup = `
    <div class="section-center single-product-center">
      <img src="${img}" class="single-product-img img" alt="${title}">
      <article class="single-product-info">
        <div>
          <h2 class="single-product-title">${title}</h2>
         
          <p class="single-product-price">$${price}</p>
          <div class="single-product-colors">
            <span class="product-color" style="background-color: red;"></span>
            <span class="product-color" style="background-color: black;"></span>
          </div>
          <p class="single-product-desc">
            ${product.description}
          </p>
          <button class="addToCartBtn btn" data-id="${product.id}">
            add to cart
          </button>
        </div>
      </article>
    </div>
  `;
  singleProductDOM.innerHTML = markup;
}

// ------------------ CART FUNCTIONS ------------------

// Preia coșul din localStorage și actualizează UI-ul
function getCart() {
  const cartData = localStorage.getItem('cart');
  if (cartData) {
    productArray = JSON.parse(cartData);
  } else {
    productArray = [];
  }
  updateCartUI();
  getCartCount();
}

// Actualizează numărul total de articole din coș
function getCartCount() {
  isInCart = 0;
  idProduct = [];
  productArray.forEach(item => {
    isInCart += item.quantity;
    idProduct.push(item.id);
  });
  if (productNumber) productNumber.textContent = isInCart;
}

// Generează markup-ul coșului și actualizează containerul
function updateCartUI() {
  if (!cartListContent) return;
  const markup = productArray.map((item, index) => {
    return `<div class="addItemToCart" data-cartInd="${index}">
      <img src="${item.img}" class="single-product-img img" alt="${item.title}">
      <div>
        <h3 class="titleProduct">${item.title}</h3>
        <div class="detalii">
          <p>${item.company}</p>
          <div id="btnContainer">
            <p class="qtyItems" data-quantity="${item.quantity}">Qty: ${item.quantity}</p>
            <button class="btnSubProduct" onclick="updateCartItem(${index}, -1)">-</button>
            <button class="btnAddProduct" onclick="updateCartItem(${index}, 1)">+</button>
          </div>
        </div>
      </div>
      <div class="pPriceBox">
        <p> Price: </p>
        <p class="pPrice" data-price="${item.price}" data-quantity="${item.quantity}">${(item.price * item.quantity).toFixed(2)}$</p>
      </div>
      <button class="deleteProduct" onclick="deleteCartItem(${index})">
        <img class="delProdX" src="./assets/img/redX.png" alt="x">
      </button>
    </div>`;
  }).join('');
  cartListContent.innerHTML = markup;
  totalPrice();
}

// Adaugă produsul curent în coș
function addToCart(productId) {
  // Găsește produsul în array-ul global "data" (preluat de la backend)
  const product = data.find(p => p.id == productId);
  if (!product) return;
  // Pentru pagina de single product, presupunem că datele sunt în product.fields
  const id = product.id;
  const company = product.slag;
  const title = product.name;
  const price = product.price;
  const img = product.image_url ? `https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/${product.image_url}` : "placeholder.jpg";
  const quantity = 1;
  
  let existing = productArray.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    productArray.push({
      id,
      quantity,
      company,
      title,
      price,
      img,
    });
  }
  localStorage.setItem('cart', JSON.stringify(productArray));
  updateCartUI();
  getCartCount();
}

// Actualizează cantitatea unui produs din coș (pentru butoanele + și -)
function updateCartItem(index, change) {
  if (productArray[index]) {
    productArray[index].quantity += change;
    if (productArray[index].quantity < 1) productArray[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(productArray));
    updateCartUI();
    getCartCount();
  }
}

// Șterge un produs din coș
function deleteCartItem(index) {
  productArray.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(productArray));
  updateCartUI();
  getCartCount();
}

// Calculează totalul prețului din coș și actualizează elementul cu id "total"
function totalPrice() {
  const totalElem = document.querySelector("#total");
  if (!totalElem) return;
  let total = productArray.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalElem.textContent = `${total.toFixed(2)} $`;
}

// ------------------ EVENT HANDLERS ------------------
window.addEventListener("load", () => {
  // Încarcă coșul la load
  getCart();
  
  // Preia produsele și afișează produsul single
  fetchProducts().then((products) => {
    data = products;
    displaySingleProduct(data);
    
    // Atașează event listener la butonul "add to cart"
    const addBtn = document.querySelector(".addToCartBtn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        addToCart(addBtn.dataset.id);
      });
    }
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
  const cartListButton = document.querySelector(".toggle-cart")

cartListButton.addEventListener("click", function () {
  toggleChartList()

})
});