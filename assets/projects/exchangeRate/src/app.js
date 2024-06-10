window.onload = getData;

const from = document.getElementById('from');
const to = document.getElementById('to');
const valueOne = document.getElementById('valueOne');
const resultElement = document.getElementById('result');
const swapButton = document.getElementById('swapButton');
let dataC = {};
let valueTwo = 0;

[from, to, valueOne].forEach(elem => elem.addEventListener('input', handleInput));

swapButton.addEventListener('click', (e) => {
    e.preventDefault
    const fromValue = from.value;
    from.value = to.value;
    to.value = fromValue;

    handleInput(); // Update conversion immediately after swap
});

async function handleInput() {
    const url = `https://v6.exchangerate-api.com/v6/18d2545ac4b2419c3d361433/latest/${from.value}`;
    try {
        await processData(url);
        convertValue();
        displayExchangeValue();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function processData(url) {
    const response = await fetch(url);
    const data = await response.json();
    dataC = data.conversion_rates;
}

async function getData() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/18d2545ac4b2419c3d361433/latest/EUR`);
        const data = await response.json();
        populateSelectElements(data.conversion_rates);
    } catch (error) {
        console.error('Error fetching initial data:', error);
    }
}

function convertValue() {
    valueTwo = dataC[to.value] || 0;
}

function displayExchangeValue() {
    const exchangeValue = Number(valueOne.value) * valueTwo;
    resultElement.textContent = `${exchangeValue.toFixed(2)} ${to.value}`;
}

function populateSelectElements(rates) {
    const optionsHtml = Object.keys(rates)
        .map(key => `<option value="${key}">${key}</option>`)
        .join('');
    from.innerHTML = optionsHtml;
    to.innerHTML = optionsHtml;
}
