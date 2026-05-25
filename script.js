// ─── MOBILE MENU TOGGLE ───────────────────────────────────────────────────────
const menuIcon = document.querySelector('.menu-icon');
const navMenu = document.querySelector('nav ul');

menuIcon.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// Fix issue 7: smooth scroll + close menu on nav link click
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    navMenu.classList.remove('open');
  });
});

// ─── SMOOTH SCROLL: "Explore Products" button ─────────────────────────────────
const exploreBtn = document.querySelector('.button-one');
if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
  });
}

// ─── CART SYSTEM ──────────────────────────────────────────────────────────────
let cart = [];

function updateCartCount() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.style.display = cart.length === 0 ? 'none' : 'flex';
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartCount();
  showToast(`🛒 "${name}" added to cart!`);
}

// ─── WISHLIST SYSTEM ──────────────────────────────────────────────────────────
let wishlist = new Set();

function toggleWishlist(btn, name) {
  if (wishlist.has(name)) {
    wishlist.delete(name);
    btn.classList.remove('wishlisted');
    btn.title = 'Add to Wishlist';
    showToast(`💔 "${name}" removed from wishlist`);
  } else {
    wishlist.add(name);
    btn.classList.add('wishlisted');
    btn.title = 'Remove from Wishlist';
    showToast(`❤️ "${name}" added to wishlist!`);
  }
}

// ─── INJECT BUTTONS INTO EVERY PRODUCT CARD ───────────────────────────────────
document.querySelectorAll('.product').forEach(product => {
  const name = product.querySelector('h4')?.textContent.trim();
  const priceEl = product.querySelector('p');
  const priceText = priceEl?.textContent.trim();

  // Get the last price number (discounted or regular)
  const prices = priceText?.match(/\$[\d.]+/g);
  const price = prices ? prices[prices.length - 1] : '$0.00';

  // Add to Cart button
  const cartBtn = document.createElement('button');
  cartBtn.className = 'btn-cart';
  cartBtn.textContent = 'Add to Cart';
  cartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(name, price);
    cartBtn.textContent = '✓ Added!';
    cartBtn.style.backgroundColor = '#2ecc71';
    setTimeout(() => {
      cartBtn.textContent = 'Add to Cart';
      cartBtn.style.backgroundColor = '';
    }, 1500);
  });

  // Wishlist heart button
  const wishBtn = document.createElement('button');
  wishBtn.className = 'btn-wish';
  wishBtn.innerHTML = '♡';
  wishBtn.title = 'Add to Wishlist';
  wishBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWishlist(wishBtn, name);
    wishBtn.innerHTML = wishlist.has(name) ? '♥' : '♡';
  });

  const btnGroup = document.createElement('div');
  btnGroup.className = 'product-btns';
  btnGroup.appendChild(cartBtn);
  btnGroup.appendChild(wishBtn);
  product.appendChild(btnGroup);
});

// ─── CART ICON IN NAVBAR ──────────────────────────────────────────────────────
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('🛒 Your cart is empty!');
      return;
    }
    const items = cart.map(i => `• ${i.name} x${i.qty} — ${i.price}`).join('\n');
    const total = cart.reduce((sum, i) => {
      return sum + parseFloat(i.price.replace('$', '')) * i.qty;
    }, 0);
    alert(`🛒 Your Cart:\n\n${items}\n\nTotal: $${total.toFixed(2)}`);
  });
}

// ─── OFFER BUTTON MODAL ───────────────────────────────────────────────────────
const offerBtn = document.getElementById('offer-button');
if (offerBtn) {
  offerBtn.addEventListener('click', () => {
    // Create modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <button class="modal-close">✕</button>
        <h2>🎉 Exclusive Offer!</h2>
        <p>Use code <strong>LUXE20</strong> at checkout to get <strong>20% off</strong> on Smart Band 2!</p>
        <p style="margin-top:10px;color:#777;font-size:14px;">Offer valid for 24 hours only.</p>
        <button class="modal-copy-btn">Copy Code: LUXE20</button>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('.modal-copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText('LUXE20').then(() => {
        showToast('✅ Code LUXE20 copied!');
        overlay.remove();
      });
    });
  });
}

// ─── SCROLL REVEAL ANIMATION ──────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product, .category-card, .review').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ─── TOAST ELEMENT (injected once) ───────────────────────────────────────────
const toast = document.createElement('div');
toast.id = 'toast';
document.body.appendChild(toast);

// ─── NAVBAR SCROLL SHADOW ─────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 30) {
    nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    nav.style.background = 'rgba(255,255,255,0.85)';
  } else {
    nav.style.boxShadow = 'none';
    nav.style.background = 'transparent';
  }
});

// ─── SEARCH PRODUCTS ──────────────────────────────────────────────────────────
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-icon');

function runSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (query !== '') {
    document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
  }
  document.querySelectorAll('.product').forEach(product => {
    const name = product.querySelector('h4')?.textContent.toLowerCase() || '';
    if (query === '') {
      product.style.display = '';
    } else if (name.includes(query)) {
      product.style.display = '';
    } else {
      product.style.display = 'none';
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runSearch();
  });
  searchIcon.addEventListener('click', runSearch);
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      document.querySelectorAll('.product').forEach(p => p.style.display = '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ─── BACK TO TOP ──────────────────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}