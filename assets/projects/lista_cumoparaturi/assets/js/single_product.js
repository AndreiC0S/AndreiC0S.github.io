 window.addEventListener("load", (event) => {
  try{

    getCart();
  }
  catch{
    
  }

});

const data = productsJsonList;
const productsDOM = document.getElementById('single-products')

const SingleProduct = (list) => {


  const productList = list.map((product) => {
    const id = product.id;
    const company = product.fields.company;
    const title = product.fields.name;
    const priceProduct = product.fields.price;
    const img = product.fields.image[0].url;
    const price = priceProduct / 100;
    const color1 = product.fields.colors[0];
    const color2 = product.fields.colors[1];

    if (window.location.href.includes(id)) {
      
      return `<div  class="section-center single-product-center">
      <img src="${img}" class="single-product-img img" alt="">
      <article class="single-product-info">
        <div>
          <h2 class="single-product-title">${title}</h2>
          <p class="single-product-company text-slanted">by ${company}</p>
          <p class="single-product-price">$${price}</p>
          <div class="single-product-colors"><span class="product-color" style="background-color: ${color1};"></span><span class="product-color" style="background-color: ${color2});"></span></div>
          <p class="single-product-desc">Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge</p>
          <button class="addToCartBtn btn" data-id="${id}" >
            add to cart
          </button>
        </div>
      </article>
    </div>`
    }
    
  })
  productsDOM.innerHTML = productList.join(" ");
};
SingleProduct(data);

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
let getBtn = document.querySelector('[data-id]')
const productNumber = document.querySelector(".cart-item-count")
const idProduct = [];
let isInCart = 0;
let productArray = [];
let indexItems = 0

 function getCart(){
    let a =   localStorage.getItem('cart')
  if (a) {
    let b = JSON.parse(a)
    productArray = b
    addItemsToCart(productArray)
    getCartCount()
  } else {
    
    productArray = []
  }
}
const getCartCount = () => {
  productArray.forEach(element => {
    isInCart = isInCart + element.quantity
    productNumber.textContent = isInCart
    idProduct.push(element.id)

  });
  
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
  getBtn.addEventListener('click', function () {
    // let productObj = document.querySelector(".single-product-center")
    
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


// -----------------------------------------------------------------------------

//----------------------------Add item to cart ---------------------------------


function addItemsToCart(productArray) {

  const productList = productArray.map((product, index) => {
    
    return `<div class="addItemToCart" >
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
    
  }

  totalPrice.textContent = `${total.toFixed(2)}  $`;
}
