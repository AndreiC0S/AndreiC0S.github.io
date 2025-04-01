window.addEventListener("load", (event) => {
  getCart();

});
let data = fetchProducts()

let productsDOM = document.getElementById('products-container')
const range = document.getElementById('range');
const priceValue = document.querySelector('.price-value')
let companyQuery = "product";
const AllProductz = document.getElementsByClassName('product');

//Gaseste produsele
async function fetchProducts() {
  // Preluăm produsele (care includ proprietăți "categories" și "image_url")
  const response = await fetch('http://localhost:3002/api/products', {
    headers: { 'Authorization': 'Bearer ' }
  });
  const products = await response.json();

  // Preluăm categoriile disponibile pentru formular
  const catResponse = await fetch('http://localhost:3002/api/categories', {
    headers: { 'Authorization': 'Bearer ' }
  });
  const availableCategories = await catResponse.json();
  displayProducts(products)
  return products

}

const toggleClasses = (product) => {
  console.log(product)
  const productzPrice = product.querySelector(".product-price").textContent.split(" ")[0];
  
  if(range.value === 0 || range.value < 0 ){
    range.value = ''
  }
  if( range.value === ""|| range.value == " " || range.value === '0' ){
    data.then((res) => {
      displayProducts(res)
    });
  } else if (!(Number(productzPrice) >= Number(range.value) + 1)) {
    product.classList.remove("hidden");
    return;
  }
  product.classList.add("hidden");
  
}


const displayProducts = (list) => {
  const productList = list.map((product, index) => {
    const id = product.id;
    const company = product.slug;
    const title = product.name;
    const priceProduct = product.price;
    const img = `http://localhost:3002/api/${product.image_url}`;




    return `<article class="product price" >
    <div class="product-container">
    <img src="${img}" class="product-img img" alt="${title}">
    
      <div class="product-icons">
        <a href="product.html?id=${id}" class="product-icon" >
          <i class="fas fa-search"></i>
        </a>
        <button class="product-cart-btn product-icon" data-id="${id}" data-ind="${index}" >
          <i class="fas fa-shopping-cart"></i>
        </button>
      </div>
    </div>
    <footer>
      <p class="product-name">${title}</p>
      <h5>${company}</h5>
      <h4 class="product-price">${priceProduct} Ron</h4>
    </footer>
  </article>
    `;

  })
    .join('');
  productsDOM.innerHTML = productList;
};




// -----------------------------------------------------------------------------

// Filters

// By Company

document.getElementById("all").onclick = function () {
  window.location.reload()
};

function sortCompany(companyName) {
  companyQuery = companyName;
  // console.log(companyQuery)
  const CompanySort = document.getElementsByClassName('product');
  // if(companyQuery === 'all'){
  //   console.log('all')
  // }
  for (let productz of CompanySort) {
    const NameCompany = productz.children[1].children[1].textContent;
    if (NameCompany === companyQuery) {
      productz.classList.remove("hiddenCompany");
      productz.classList.remove("show");

    } else {
      productz.classList.remove("show");
      productz.classList.add("hiddenCompany");
    }
  }

}

// -----------------------------------------------------------------------------

// Filter by price (input range)

function Test() {
  for (let prod of AllProductz) {
    
    toggleClasses(prod);
  }
}


// -----------------------------------------------------------------------------


// detalii price 

// pValue(0);

// function pValue(nr) {
//   if (nr === 0) {
//     console.log('zero');
//     data.then((res) => {
//       // Creează un array de prețuri
//       let bigPrice = res.map(e => Number(e.price));
//       // Sortează numeric
//       bigPrice.sort((a, b) => b - a);
//       console.log(bigPrice); // Vezi array-ul sortat
//       range.max = bigPrice[0] + 1
//       // Actualizează textContent o singură dată, cu cel mai mic preț
//       priceValue.textContent = `Value: ${bigPrice[0]} Ron`;
//     });
//   } else {
//     priceValue.textContent = `Value: ${nr} Ron`;
//   }
// }

range.addEventListener("input", function (e) {
  e.preventDefault()
  console.log('e',range.value)
  Test()
});

// -----------------------------------------------------------------------------



//---------------------------Search Bar----------------------------------------- 

const search_bar = document.getElementById('searchbar');
const formular = document.querySelector(".input-form");

function search_bar_resut(search) {

  const searchProd = document.getElementsByClassName('price');


  for (let products of searchProd) {
    const productTitle = products.children[1].children[0].textContent;
    // console.log(typeof productTitle)
    if (productTitle.includes(search)) {
      products.classList.remove("hiddenSearch");
      products.classList.add("show");

    } else {
      products.classList.add("hiddenSearch");
      products.classList.remove("show");
    }

  }
}

search_bar.addEventListener("input", (e) => {
  e.preventDefault();

  const searchTerm = search_bar.value.trim();
  if (searchTerm !== "") {
    search_bar_resut(searchTerm.toLowerCase());
    return;
  };
  data.then((res) => {
    displayProducts(res)
  });


});

//------------------------------------------------------------------------------



//----------------------------CART BOX VISIBILITY-------------------------------


const cartListBox = document.getElementById('kart-box')

const toggleChartList = () => {
  if (cartListBox.classList.contains('kart-hidden')) {
    cartListBox.classList.remove("kart-hidden")
    cartListBox.classList.add('kart-box')
  } else {
    cartListBox.classList.add("kart-hidden")
  }
}
const cartListButton = document.querySelector(".toggle-cart")

cartListButton.addEventListener("click", function () {
  toggleChartList()

})


//------------------------------------------------------------------------------


//-------------------------------ADD TO CART BUTTON-----------------------------


const kartProducts = document.querySelector('#kart-box-content');
let getAllBtn = document.querySelectorAll('[data-id]')
const productNumber = document.querySelector(".cart-item-count")
const idProduct = [];
let isInCart = 0;
let productArray;
let indexItems = 0

const getCart = () => {
  let a = localStorage.getItem('cart')
  if (a) {
    let b = JSON.parse(a)
    productArray = b
    addItemsToCart(productArray)
    getCartCount()
  } else {
    // console.log('empty')
    productArray = []
  }
}
const getCartCount = () => {
  productArray.forEach(element => {
    isInCart = isInCart + element.quantity
    productNumber.textContent = isInCart
    idProduct.push(element.id)

  });
  // console.log('idProduct', idProduct)
}
function isInCartADD() {
  isInCart++

  productNumber.textContent = isInCart
  localStorage.setItem('cart', JSON.stringify(productArray));
}
function isInCartSub() {
  isInCart--
  if (isInCart < 1) {
    isInCart = 1;
  }
  productNumber.textContent = isInCart
  localStorage.setItem('cart', JSON.stringify(productArray));

}
console.log(getAllBtn)
getAllBtn.forEach(element => {
  element.addEventListener('click', function () {

    let productObj = data.find((product) => product.id == this.dataset.id)


    const id = productObj.id;
    const company = productObj.fields.company;
    const title = productObj.fields.name;
    const price = productObj.fields.price / 100;
    const img = productObj.fields.image[0].url;
    const quantity = 1;


    if (!idProduct.includes(id)) {
      productArray.push({
        id,
        quantity,
        company,
        title,
        price,
        img,
      })
      // console.log(this.dataset.index)
      localStorage.setItem('cart', JSON.stringify(productArray));
      this.dataset.index = indexItems
      indexItems++
    }
    else {
      productArray.forEach((elem, index) => {
        if (elem.id === id) {
          productArray[index].quantity++;
        }
      });
      localStorage.setItem('cart', JSON.stringify(productArray));
    }

    idProduct.push(this.dataset.id)
    productNumber.textContent = isInCart

    isInCartADD();
    addItemsToCart(productArray);
    totalPrice();

  })
});

// -----------------------------------------------------------------------------

//----------------------------Add item to cart ---------------------------------


function addItemsToCart(productArray) {

  const productList = productArray.map((product, index) => {
    let a = product;

    return `<div class="addItemToCart" data-cartInd="${index}">
    <img src="${product.img}"
     class="single-product-img img" alt="">
    <div>
      <h3 class="titleProduct">${product.title}</h3>
    
      <div class="detalii" >
       <p>${product.company}</p>
        <div id="btnContainer">
          <p class = 'qtyItems' data-quantity="${product.quantity}">Qty: ${product.quantity} </p>
          <button class="btnSubProduct" onclick="AddSubItem(${index}, -1,)">-</button>
          <button class="btnAddProduct" onclick="AddSubItem(${index}, 1, )">+</button>
        </div>
      </div>
    </div>
    <div class="pPriceBox">
      <p > Price:  </p>
      <p class='pPrice' data-price="${product.price}" data-quantity="${product.quantity}">${(product.price * product.quantity).toFixed(2)}$</p>
    </div>
    <button class="deleteProduct" onclick="deleteProd(productArray, ${index},idProduct)"><img class="delProdX" src="./assets/img/redX.png" alt="x"></button>
  </div>`
  })
  kartProducts.innerHTML = productList.join('');
}
//------------------------------------------------------------------------------



function deleteId(array, id) {
  for (i = 0; i < array.length; i++) {
    if (array[i] == id) {

      array.splice(i, 1);
      break;

    }
  }

}



//--------------------------Add/Substract Items from cart ----------------------

function deleteProd(productArray, index, idProduct) {
  try {
    isInCart = isInCart - productArray[index].quantity;
    let id = productArray[index].id;
    productArray.splice(index, 1);

    deleteId(idProduct, id)
    kartProducts.innerHTML = addItemsToCart(productArray).join('');

  } catch { }
  totalPrice()
  productNumber.textContent = isInCart
  localStorage.setItem('cart', JSON.stringify(productArray));


}

const addItemToCart = document.querySelectorAll('addItemToCart');
function AddSubItem(index, quantity) {
  try {
    // console.log(index, quantity)
    productArray[index].quantity += quantity;

    if (productArray[index].quantity < 1) {
      productArray[index].quantity = 1
      return
    }

    kartProducts.innerHTML = addItemsToCart(productArray)
      .join("");


  } catch {
    console.log(' ')
  }
  if (quantity > -1) {
    isInCartADD();
  } else {
    isInCartSub()
  }

  totalPrice()
}

//------------------------------------------------------------------------------



// -----------------------------TOTAL PRICE--------------------------------------



function totalPrice() {

  const totalPrice = document.querySelector("#total");
  let total = 0;
  const cartArr = [];
  kartProducts.querySelectorAll(".pPrice").forEach((product) => {
    const { price, quantity } = product.dataset;
    cartArr.push({
      price,
      quantity,
    })
  });

  for (let i = 0; i < cartArr.length; i++) {
    total += Number(cartArr[i].price) * Number(cartArr[i].quantity);
    // console.log(total)
  }

  totalPrice.textContent = `${total.toFixed(2)}  $`;
}

//---------------------------------------------------------------------------