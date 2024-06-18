let productsDOM = document.getElementById('products-container')
let productsDOM2 = document.getElementById('products-container2')
let testArr = []
let testArr2 = []


const fetchProducts = function () {
    try {
        const data = productsJsonList;

        return data;
    }
    catch (error) {
        productsDOM.innerHTML = '<p class="error"> there was an error</p>';
    }
};
const data = fetchProducts();
const getProdsByIndex = function (list) {
    list.map((product, index) => {

        const priceProduct = product.fields.price;

        if (index % 2) {
            testArr.push(
                {
                    id: product.id,
                    company: product.fields.company,
                    title: product.fields.name,

                    img: product.fields.image[0].url,
                    price: priceProduct / 100,

                }
            )
        } else {
            testArr2.push(
                {
                    id: product.id,
                    company: product.fields.company,
                    title: product.fields.name,

                    img: product.fields.image[0].url,
                    price: priceProduct / 100
                }
            )
        }
    })
}
getProdsByIndex(data)


const displayProducts1 = (list) => {
    
    const productList = list.map((product, index) => {
        console.log(product)
        const id = product.id;
        const company = product.company;
        const title = product.title;
        const img = product.img;
        const price = product.price;

        return `<article class="product " >
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
      <div class=product-footer>
        <p class="product-name">${title}</p>
        <h5>${company}</h5>
        <h4 class="product-price">${price} $</h4>
      </div>
    </article>
      `;

    })
        .join('');
    productsDOM.innerHTML = productList;

};

displayProducts1(testArr);

const displayProducts2 = (list) => {
   
    const productList2 = list.map((product, index) => {
      const id = product.id;
      const company = product.company;
      const title = product.title;
      const img = product.img;
      const price = product.price;

        return `<article class="product  " >
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
      <div class=product-footer>
        <p class="product-name">${title}</p>
        <h5>${company}</h5>
        <h4 class="product-price">${price} $</h4>
      </div>
    </article>
      `;

    })
        .join('');
    productsDOM2.innerHTML = productList2;

};
displayProducts2(testArr2);



document.getElementById('nextProds').addEventListener('click', function() {
  let container1 = document.getElementById('wraperProd'); 
  let container = document.getElementById('products-container'); 
  let firstElementWidth = container.children[0].offsetWidth; 
  console.log(firstElementWidth)

  let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let remAdd = 4; 
  let remToPix = remAdd * rem;

  container1.scrollLeft += (firstElementWidth + remToPix); 
});

document.getElementById('prevProds').addEventListener('click', function() {
  let container = document.getElementById('wraperProd'); 
  let firstElementWidth = container.children[0].offsetWidth; 

  let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let remAdd = 1; 
  let remToPix = remAdd * rem;

  container.scrollLeft += -(firstElementWidth + remToPix); 
});