let cartBag = document.querySelector('.cart-icon');
let cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const totalPrice = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');

cartBag.addEventListener('click', () => {
    cartTab.classList.toggle('cart-tab-active');
});

closeBtn.addEventListener('click', () => {
    cartTab.classList.toggle('cart-tab-active');
});

let productList = [];
let cartArr = [];
let totalMoney = 0;
let totalQuantity = 0;

const showCards = () => {
    cardList.innerHTML = '';

    productList.forEach(product => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card', 'text-center');

        orderCard.innerHTML = `
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <h4 class="price">₹${product.price}</h4>
            <button class="btn cart-btn smooth">Add To Cart</button>
        `;

        cardList.appendChild(orderCard);
        const cartBtn = orderCard.querySelector('.cart-btn');

        cartBtn.addEventListener('click', () => {
            if (totalQuantity >= 10) {
                alert("Sweet overload! You can only have 10 ice creams in your cart.");
                return;
            }
            
            if (isExist(product.name)) {
                const existingItem = cartArr.find(item => item.name === product.name);
                existingItem.value++;
                existingItem.quantityValue.textContent = existingItem.value;
                totalMoney += product.price;
                totalQuantity++;
                totalPrice.textContent = `₹${totalMoney}`;
                cartValue.textContent = totalQuantity;
            } else {
                let value = 1;
                
                const itemCard = document.createElement('div');
                itemCard.classList.add('item');

                itemCard.innerHTML = `
                    <div class="item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div>
                        <h4>${product.name}</h4>
                        <h5 class="item-total">₹${product.price}</h5>
                    </div>
                    <div class="flex quantity">
                        <button href="#" class="quantity-btn quantity1 smooth">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <h4 class="quantity-value">${value}</h4>
                        <button href="#" class="quantity-btn quantity2 smooth">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                `;

                cartList.appendChild(itemCard);
                totalMoney += value * product.price;
                totalPrice.textContent = `₹${totalMoney}`;
                totalQuantity += value;
                cartValue.textContent = totalQuantity;

                const minusBtn = itemCard.querySelector('.quantity1');
                const plusBtn = itemCard.querySelector('.quantity2');
                const quantityValue = itemCard.querySelector('.quantity-value');

                minusBtn.addEventListener('click', () => {
                    const existingItem = cartArr.find(item => item.name === product.name);
                    if (existingItem && existingItem.value > 1) {
                        existingItem.value--;
                        quantityValue.textContent = existingItem.value;
                        totalMoney -= product.price;
                        totalQuantity--;
                        totalPrice.textContent = `₹${totalMoney}`;
                        cartValue.textContent = totalQuantity;
                    } else if (existingItem && existingItem.value === 1) {
                        cartList.removeChild(itemCard);
                        totalMoney -= product.price;
                        totalQuantity--;
                        totalPrice.textContent = `₹${totalMoney}`;
                        cartValue.textContent = totalQuantity;
                        cartArr = cartArr.filter(item => item.name !== product.name);
                    }
                });
                

                plusBtn.addEventListener('click', () => {
                    if (value < 10) {
                        value++;
                        quantityValue.textContent = value;
                        totalMoney += product.price;
                        totalQuantity++;
                        totalPrice.textContent = `₹${totalMoney}`;
                        cartValue.textContent = totalQuantity;
                    } else {
                        alert("Sweet overload! You can only have 10 ice creams in your cart.");
                    }
                });

                cartArr.push({ name: product.name, value, quantityValue });
            }
        });
    });
};

function isExist(name) {
    return cartArr.some(item => item.name === name);
}



const initApp = () => {
    fetch('product.json').then(response => response.json()).then(data => {
        productList = data;
        showCards();
    });
};

initApp();
