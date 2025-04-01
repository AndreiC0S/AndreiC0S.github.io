// order.js

// Asigură-te că acest fișier este încărcat după ce DOM-ul este complet construit
const checkout = document.getElementById('checkout')


checkout.addEventListener('click', () => {
  orderBackground.classList.remove('hidden')
    orderBackground.classList.add('orderBackground')
    cartListBox.classList.add("kart-hidden")
    // Afișează sumarul coșului la încărcare
    renderCartSummary();
  
    // Atașează event listener la formularul de plasare a comenzii
    const orderForm = document.getElementById('placeOrderForm');
    if (orderForm) {
      orderForm.addEventListener('submit', submitOrder);
    }
})

 const orderBackground = document.getElementById('orderBackground') 
 const closeModal = document.getElementById('closeOrderModal')
 
 closeModal.addEventListener('click',() => {
    orderBackground.classList.remove('orderBackground')
    orderBackground.classList.add('hidden')
 })
  function renderCartSummary() {
      const cartData = localStorage.getItem('cart');
      const cartItemsDiv = document.getElementById('cart-items');
      const cartTotalSpan = document.getElementById('cart-total');
  
    if (cartData) {
      const productArray = JSON.parse(cartData);
      let total = 0;
      // Construiește markup-ul pentru fiecare produs din coș
      const markup = productArray.map(item => {
        const subTotal = item.price * item.quantity;
        total += subTotal;
        return `
          <div class="cart-item" style="padding:10px;">
            <p><strong>${item.title}</strong></p>
            <p>Cantitate: ${item.quantity}</p>
            <p>Preț unitar: ${item.price} $</p>
            
            <hr>
          </div>
        `;
      }).join('');
      cartItemsDiv.innerHTML = markup;
      cartTotalSpan.textContent = total.toFixed(2);
    } else {
      cartItemsDiv.innerHTML = '<p>Coșul este gol</p>';
      cartTotalSpan.textContent = '0.00';
    }
  }
  
  function submitOrder(event) {
    event.preventDefault();
  
    // Preia valorile din formular
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;
    const county = document.getElementById('county').value;
    const address = document.getElementById('address').value;
    
    const total = document.getElementById('cart-total').textContent
    console.log('cartTotalSpan', total)
    
    // Construiește adresa completă
    const fullAddress = `${address}, ${city}, ${county}`;
   
    // Preia produsele din localStorage
    const cartData = localStorage.getItem('cart');
    let products = [];
    if (cartData) {
      products = JSON.parse(cartData);
      products.forEach(element => {
        console.log(parseFloat(element.price))
      });
    }
  
    // Formează payload-ul care va fi trimis la backend
    const payload = {
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        customer_address: fullAddress,
        total_price: parseFloat(total),  // un număr
        status: "pending",               // sau altceva valid: "processing", "shipped"...
        products: products.map(item => ({
          quantity: Number(item.quantity),
          name: item.title,
          product_id: item.id,
          unit_price: parseFloat(item.price)
        }))
      };
      console.log('payload',payload)
    // Trimite payload-ul la backend prin POST
    fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Dacă ai nevoie de autentificare: 'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Răspunsul de la server nu este OK');
        }
        return response.json();
      })
      .then(data => {
        alert('Comanda a fost plasată cu succes!');
        // Opțional, poți șterge coșul din localStorage după trimitere:
        localStorage.removeItem('cart');
        // Și eventual, redirecționezi utilizatorul către o pagină de confirmare:
        window.location.reload()
      })
      .catch(error => {
        console.error('Eroare la trimiterea comenzii:', error);
        alert('A apărut o eroare. Te rog să încerci din nou.');
      });
  }