// Meal prep ordering functionality

document.addEventListener('DOMContentLoaded', function() {
    const defaultFallbackImage = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            if (img.dataset.fallbackApplied === '1') return;
            img.dataset.fallbackApplied = '1';
            img.src = img.dataset.fallback || defaultFallbackImage;
        });
    });

    // Quantity steppers for mobile friendliness (+ / -)
    document.querySelectorAll('.meal-actions').forEach(actions => {
        const input = actions.querySelector('input.meal-quantity');
        if (!input) return;

        if (actions.querySelector('.qty-stepper')) return;

        const stepper = document.createElement('div');
        stepper.className = 'qty-stepper';

        const dec = document.createElement('button');
        dec.type = 'button';
        dec.className = 'qty-btn';
        dec.setAttribute('aria-label', 'Decrease quantity');
        dec.textContent = '−';

        const inc = document.createElement('button');
        inc.type = 'button';
        inc.className = 'qty-btn';
        inc.setAttribute('aria-label', 'Increase quantity');
        inc.textContent = '+';

        // Move input into stepper
        const originalParent = input.parentElement;
        stepper.appendChild(dec);
        stepper.appendChild(input);
        stepper.appendChild(inc);

        if (originalParent) {
            originalParent.insertBefore(stepper, originalParent.firstChild);
        } else {
            actions.insertBefore(stepper, actions.firstChild);
        }

        const clamp = (n) => {
            const min = input.min === '' ? 0 : parseInt(input.min, 10);
            const max = input.max === '' ? Number.POSITIVE_INFINITY : parseInt(input.max, 10);
            if (Number.isNaN(n)) n = 0;
            if (n < min) return min;
            if (n > max) return max;
            return n;
        };

        const setValue = (n) => {
            input.value = String(clamp(n));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        };

        dec.addEventListener('click', () => {
            const current = parseInt(input.value, 10) || 0;
            setValue(current - 1);
        });

        inc.addEventListener('click', () => {
            const current = parseInt(input.value, 10) || 0;
            setValue(current + 1);
        });
    });

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    const menuSelection = document.getElementById('menu-selection');
    const cartSummary = document.getElementById('cart-summary');
    const miniCart = document.getElementById('mini-cart');
    const miniCartItems = document.getElementById('mini-cart-items');
    const miniCartTotal = document.getElementById('mini-cart-total');
    const miniCartOpen = document.getElementById('mini-cart-open');
    let cart = [];

    if (menuSelection) {
        menuSelection.style.display = 'block';
    }
    if (cartSummary) {
        cartSummary.style.display = 'block';
    }

    initializeCart();

    if (miniCartOpen && cartSummary) {
        miniCartOpen.addEventListener('click', () => {
            cartSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Meal filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const mealItems = document.querySelectorAll('.meal-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter meals
            mealItems.forEach(item => {
                if (filter === 'all' || item.dataset.category.includes(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mealItem = this.closest('.meal-item');
            const mealName = (mealItem.dataset.name || mealItem.querySelector('h3')?.textContent || '').trim();
            const quantityInput = mealItem.querySelector('.meal-quantity');
            const quantity = parseInt(quantityInput.value) || 0;
            
            if (quantity > 0) {
                addToCart(mealName, quantity, mealItem);
                quantityInput.value = 0;
                this.textContent = 'Added!';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 1000);
            } else {
                alert('Please select a quantity');
            }
        });
    });

    // Quantity input validation
    const quantityInputs = document.querySelectorAll('.meal-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const raw = parseInt(this.value, 10);
            const value = Number.isNaN(raw) ? 0 : raw;
            const min = this.min === '' ? 0 : parseInt(this.min, 10);
            const max = this.max === '' ? Number.POSITIVE_INFINITY : parseInt(this.max, 10);

            if (value < min) this.value = String(min);
            else if (value > max) this.value = String(max);
            else this.value = String(value);
        });
    });

    // Checkout functionality
    const checkoutButton = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutBackdrop = document.getElementById('checkout-backdrop');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutCancel = document.getElementById('checkout-cancel');
    const checkoutConfirm = document.getElementById('checkout-confirm');
    const customerNameInput = document.getElementById('customer-name');
    const waPreview = document.getElementById('wa-preview');

    const waBaseUrl = 'https://wa.me/message/DOSBEK2MOQYUF1';

    function getFulfillment() {
        const selected = document.querySelector('input[name="fulfillment"]:checked');
        return selected ? selected.value : 'pickup';
    }

    function buildWhatsappMessage() {
        const name = (customerNameInput?.value || '').trim();
        const fulfillment = getFulfillment();
        const lines = [];

        lines.push('Hi P&O Clean Food, I would like to order:');
        lines.push('');
        lines.push('Name: ' + (name || '-'));
        lines.push('Pickup oder Delivery: ' + fulfillment);
        lines.push('');
        lines.push('Produkte:');

        cart.forEach(item => {
            lines.push('- ' + item.quantity + 'x ' + item.name);
        });

        lines.push('');
        lines.push('Total: ' + formatMoney(calculateTotal(), getCartCurrency()));

        return lines.join('\n');
    }

    function openCheckoutModal() {
        if (!checkoutModal) return;
        checkoutModal.style.display = 'flex';
        if (customerNameInput) {
            customerNameInput.focus();
        }
        if (waPreview) {
            waPreview.textContent = buildWhatsappMessage();
        }
    }

    function closeCheckoutModal() {
        if (!checkoutModal) return;
        checkoutModal.style.display = 'none';
    }

    function refreshPreview() {
        if (!waPreview) return;
        waPreview.textContent = buildWhatsappMessage();
    }

    if (customerNameInput) {
        customerNameInput.addEventListener('input', refreshPreview);
    }
    document.querySelectorAll('input[name="fulfillment"]').forEach(el => {
        el.addEventListener('change', refreshPreview);
    });

    if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckoutModal);
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckoutModal);
    if (checkoutCancel) checkoutCancel.addEventListener('click', closeCheckoutModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCheckoutModal();
    });

    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add some meals first.');
                return;
            }

            openCheckoutModal();
        });
    }

    if (checkoutConfirm) {
        checkoutConfirm.addEventListener('click', () => {
            if (cart.length === 0) {
                closeCheckoutModal();
                return;
            }

            const name = (customerNameInput?.value || '').trim();
            if (!name) {
                alert('Please enter your name');
                return;
            }

            const msg = buildWhatsappMessage();
            const url = waBaseUrl + '?text=' + encodeURIComponent(msg);
            window.open(url, '_blank');
            closeCheckoutModal();
        });
    }

    function initializeCart() {
        cart = [];
        updateCartDisplay();
    }

    function addToCart(mealName, quantity, mealItem) {
        const existingItem = cart.find(item => item.name === mealName);

        const mealImage = mealItem.querySelector('img')?.src || '';
        const currency = mealItem.dataset.currency || 'THB';
        const price = parseFloat(mealItem.dataset.price || '0') || 0;
        const macros = {
            kcal: parseFloat(mealItem.dataset.kcal || '0') || 0,
            protein: parseFloat(mealItem.dataset.protein || '0') || 0,
            carbs: parseFloat(mealItem.dataset.carbs || '0') || 0,
            fat: parseFloat(mealItem.dataset.fat || '0') || 0
        };

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                name: mealName,
                quantity,
                price,
                currency,
                image: mealImage,
                macros
            });
        }

        updateCartDisplay();
    }

    function getCartCurrency() {
        return cart[0]?.currency || 'THB';
    }

    function formatMoney(amount, currency) {
        if (currency === 'THB') {
            return '฿' + Math.round(amount).toLocaleString('en-US');
        }
        return currency + ' ' + amount.toFixed(2);
    }

    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (!cartItemsContainer || !cartTotalElement) return;
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartTotalElement.textContent = formatMoney(0, 'THB');
            updateMiniCart();
            return;
        }

        const currency = getCartCurrency();

        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <div>
                        <h4 style="margin: 0;">${item.name}</h4>
                        <p style="margin: 0; color: #666;">${formatMoney(item.price, item.currency)} each</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span>Qty: ${item.quantity}</span>
                    <span style="font-weight: bold; color: var(--primary);">${formatMoney(item.price * item.quantity, item.currency)}</span>
                    <button class="btn btn-sm" style="background: var(--primary); color: white;" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotalElement.textContent = formatMoney(calculateTotal(), currency);
        updateMiniCart();
    }

    function updateMiniCart() {
        if (!miniCart || !miniCartItems || !miniCartTotal) return;

        if (cart.length === 0) {
            miniCart.style.display = 'none';
            return;
        }

        miniCart.style.display = 'block';
        miniCartItems.innerHTML = cart
            .map(item => `<span class="mini-cart__pill">${item.quantity}x ${item.name}</span>`)
            .join('');

        miniCartTotal.textContent = formatMoney(calculateTotal(), getCartCurrency());
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Make removeFromCart available globally
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartDisplay();
    };

    // Smooth scroll for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
