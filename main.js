// JavaScript code for the website
// Loading animation

document.addEventListener('DOMContentLoaded', function() {
    // Show loading animation
    document.getElementById('load').classList.add('show');
    
    // Get the current time
    const startTime = Date.now();
    
    // Hide loading animation when page is fully loaded, but ensure it shows for at least 2 seconds
    window.addEventListener('load', function() {
        const loadTime = Date.now() - startTime;
        const minDisplayTime = 1000; // 1 seconds minimum
        const maxDisplayTime = 2000; // 2 seconds maximum
        
        // Calculate remaining time to show the loader
        const remainingTime = Math.min(
            Math.max(minDisplayTime - loadTime, 0),
            maxDisplayTime - loadTime
        );
        
        // Hide the loader after the remaining time
        setTimeout(function() {
            document.getElementById('load').classList.remove('show');
        }, remainingTime);
    });
}); 

/*Hamburger Menu*/

document.addEventListener('DOMContentLoaded', () => {
    const bar = document.getElementById('bar');
    const nav = document.getElementById('navbar');
    const close = document.getElementById('close');

    if (bar) {
        bar.addEventListener('click', () => {
            nav.classList.add('active');
        })
    }

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}
})

    /*Product Image Change*/


var mainImg = document.getElementById("MainImg");
var smallImg = document.getElementsByClassName("small-img");

for (let i = 0; i < smallImg.length; i++) {
    smallImg[i].onclick = function() {
        mainImg.src = smallImg[i].src;
    }
}

// Cart functionality


document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initCart();
    
    // Add event listeners
    addEventListeners();
    
    // Update cart icon
    updateCartIcon();
});

// Initialize cart data
function initCart() {
    // Check if cart exists in localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Get cart items from localStorage
    window.cartData = JSON.parse(localStorage.getItem('cart'));
    
    // Update cart display
    updateCartDisplay();
}

// Add event listeners to cart elements
function addEventListeners() {
    // Add to cart buttons on shop page
    const addToCartButtons = document.querySelectorAll('.cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent the product click event from firing
            
            const productElement = this.closest('.pro');
            const productName = productElement.querySelector('h5').textContent;
            const productPrice = parseFloat(productElement.querySelector('h4').textContent.replace('$', ''));
            const productImage = productElement.querySelector('img').src;
            const productBrand = productElement.querySelector('span').textContent;
            
            addToCart({
                id: Math.random().toString(36).substr(2, 9),
                name: productName,
                brand: productBrand,
                price: productPrice,
                quantity: 1,
                image: productImage,
                subtotal: productPrice
            });
            
            // Show confirmation message
            showNotification('Product added to cart!');
        });
    });
    
    // Quantity input change on cart page
    const quantityInputs = document.querySelectorAll('#cart table tbody tr td input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const row = this.closest('tr');
            const itemId = row.dataset.id;
            updateQuantity(itemId, parseInt(this.value));
        });
    });
    
    // Remove item buttons on cart page
    const removeButtons = document.querySelectorAll('#cart table tbody tr td a');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const itemId = row.dataset.id;
            removeItem(itemId);
        });
    });
    
    // Apply coupon button on cart page
    const applyCouponButton = document.querySelector('#coupon button');
    if (applyCouponButton) {
        applyCouponButton.addEventListener('click', function() {
            const couponInput = document.querySelector('#coupon input');
            const couponCode = couponInput.value.trim().toUpperCase();
            applyCoupon(couponCode);
        });
    }
    
    // Checkout button on cart page
    const checkoutButton = document.querySelector('#subtotal button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            proceedToCheckout();
        });
    }
}

// Add product to cart
function addToCart(product) {
    // Check if product already exists in cart
    const existingProductIndex = cartData.findIndex(item => 
        item.name === product.name && item.brand === product.brand);
    
    if (existingProductIndex !== -1) {
        // Update quantity if product exists
        cartData[existingProductIndex].quantity += 1;
        cartData[existingProductIndex].subtotal = 
            cartData[existingProductIndex].price * cartData[existingProductIndex].quantity;
    } else {
        // Add new product to cart
        cartData.push(product);
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartData));
    
    // Update cart display
    updateCartDisplay();
    
    // Update cart icon
    updateCartIcon();
}

// Update quantity of an item
function updateQuantity(itemId, newQuantity) {
    const itemIndex = cartData.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cartData[itemIndex].quantity = newQuantity;
        cartData[itemIndex].subtotal = cartData[itemIndex].price * newQuantity;
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cartData));
        
        // Update cart display
        updateCartDisplay();
        
        // Update cart icon
        updateCartIcon();
    }
}

// Remove item from cart
function removeItem(itemId) {
    cartData = cartData.filter(item => item.id !== itemId);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartData));
    
    // Update cart display
    updateCartDisplay();
    
    // Update cart icon
    updateCartIcon();
}

// Apply coupon code
function applyCoupon(code) {
    let discount = 0;
    let message = '';
    
    switch(code) {
        case 'SUMMER10':
            discount = 0.1; // 10% discount
            message = '10% discount applied!';
            break;
        case 'NEWCUST20':
            discount = 0.2; // 20% discount
            message = '20% discount applied!';
            break;
        case 'FREESHIP':
            discount = 0; // No discount, but free shipping
            message = 'Free shipping applied!';
            break;
        default:
            message = 'Invalid coupon code!';
            return;
    }
    
    // Calculate total with discount
    const subtotal = calculateSubtotal();
    const total = subtotal * (1 - discount);
    
    // Update total display
    const totalElement = document.querySelector('#subtotal table tr:last-child td:last-child');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Show message
    showNotification(message);
}

// Calculate subtotal
function calculateSubtotal() {
    return cartData.reduce((total, item) => total + item.subtotal, 0);
}

// Update cart display
function updateCartDisplay() {
    // If on cart page, update the cart table
    const cartTable = document.querySelector('#cart table tbody');
    if (cartTable) {
        // Clear existing rows
        cartTable.innerHTML = '';
        
        // Add rows for each cart item
        cartData.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            
            row.innerHTML = `
                <td><a href="#"><i class="fa-solid fa-trash"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" min="1" max="10"></td>
                <td>$${item.subtotal.toFixed(2)}</td>
            `;
            
            cartTable.appendChild(row);
        });
        
        // Update cart total
        const cartTotalElement = document.querySelector('.cart-total p');
        if (cartTotalElement) {
            const itemCount = cartData.reduce((total, item) => total + item.quantity, 0);
            cartTotalElement.textContent = `Your cart contains ${itemCount} items`;
        }
        
        // Update subtotal
        const subtotalElement = document.querySelector('#subtotal table tr:first-child td:last-child');
        if (subtotalElement) {
            subtotalElement.textContent = `$${calculateSubtotal().toFixed(2)}`;
        }
        
        // Update total
        const totalElement = document.querySelector('#subtotal table tr:last-child td:last-child');
        if (totalElement) {
            totalElement.textContent = `$${calculateSubtotal().toFixed(2)}`;
        }
        
        // Add event listeners to new elements
        addEventListeners();
    }
}

// Update cart icon with item count
function updateCartIcon() {
    // Calculate total items in cart
    const itemCount = cartData.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart icon in desktop navigation
    const desktopCartIcon = document.querySelector('#bag a');
    if (desktopCartIcon) {
        // Remove existing cart count if any
        const existingCount = desktopCartIcon.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Add cart count if there are items
        if (itemCount > 0) {
            const countElement = document.createElement('span');
            countElement.className = 'cart-count';
            countElement.textContent = itemCount;
            desktopCartIcon.appendChild(countElement);
        }
    }
    
    // Update cart icon in mobile navigation
    const mobileCartIcon = document.querySelector('#mobile a');
    if (mobileCartIcon) {
        // Remove existing cart count if any
        const existingCount = mobileCartIcon.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Add cart count if there are items
        if (itemCount > 0) {
            const countElement = document.createElement('span');
            countElement.className = 'cart-count';
            countElement.textContent = itemCount;
            mobileCartIcon.appendChild(countElement);
        }
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartData.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // In a real application, this would redirect to a checkout page
    showNotification('Proceeding to checkout...');
    window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
