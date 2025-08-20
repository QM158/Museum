
// Constants
const TAX_RATE = 0.102;
const MEMBER_DISCOUNT_RATE = 0.15;
const SHIPPING_RATE = 25.00;
const VOLUME_DISCOUNT_TIERS = [
  { threshold: 200, rate: 0.15 },
  { threshold: 100, rate: 0.10 },
  { threshold: 50, rate: 0.05 },
  { threshold: 0, rate: 0.00 }
];

// Cart State

const CART_KEY = 'museumCartV1';

// This function reads the Cart information and write it to JSON  
function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Utility
function formatCurrency(amount) {
  const rounded = Math.round(amount * 100) / 100;
  const formatted = rounded < 0 ? `(${Math.abs(rounded).toFixed(2)})` : `$${rounded.toFixed(2)}`;
  return formatted.padStart(10, ' ');
}

// Add to Cart
function addToCart(shopItem) {
  const itemMap = {
    item001: { name: "Starbone Totem", unitPrice: 24.99, image: "/images/souvenirs/starbone-totem-replica.png" },
    item002: { name: "Coral Queen Incense", unitPrice: 14.50, image: "/images/souvenirs/sand-oracle-tablet.png" },
    item003: { name: "Sky Loom Textile", unitPrice: 39.00, image: "/images/souvenirs/clay-oil-lamp.png" },
    item004: { name: "Sand Oracle Tablet", unitPrice: 29.75, image: "/images/souvenirs/ancestral-mask.png" }
  };

  var cart = readCart();
  const existing = cart.find(item => item.id === shopItem.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: shopItem.id, qty: 1, ...itemMap[shopItem.id] });
  }
  writeCart(cart);

  render();
}

// Render Cart
function render() {
  let isMember = document.getElementById('memberCheckbox').checked;

  let itemTotal = 0;
  let discount = 0;
  let volumeRate = 0;

  // Compute item total
  var cart = readCart();
  cart.forEach(item => {
    itemTotal += item.unitPrice * item.qty;
  });

  // Determine volume discount
  for (const tier of VOLUME_DISCOUNT_TIERS) {
    if (itemTotal >= tier.threshold) {
      volumeRate = tier.rate;
      break;
    }
  }

  // Apply discount
  if (isMember) {
    discount = itemTotal * MEMBER_DISCOUNT_RATE;
  } else {
    discount = itemTotal * volumeRate;
  }

  const taxable = itemTotal - discount + SHIPPING_RATE;
  const taxAmount = taxable * TAX_RATE;
  const invoiceTotal = taxable + taxAmount;

  // Inject HTML
  const container = document.getElementById("cartContainer");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  let html = `<table class="table"><thead><tr><th>Item</th><th>Qty</th><th>Amount</th><th></th></tr></thead><tbody>`;
  cart.forEach(item => {
    const lineTotal = item.unitPrice * item.qty;
    html += `
      <tr>
        <td><img src="./${item.image}" width="50"> ${item.name}</td>
        <td>${item.qty}</td>
        <td class="text-end">${formatCurrency(lineTotal)}</td>
        <td><button onclick="removeItem('${item.id}')" class="btn btn-sm btn-danger">Remove</button></td>
      </tr>
    `;
  });
  html += `</tbody></table>`;

  html += `
    <div class="summary">
      <p>Item Subtotal: <span class="float-end">${formatCurrency(itemTotal)}</span></p>
      <p>${isMember ? "Member Discount" : "Volume Discount"}: <span class="float-end">${formatCurrency(-discount)}</span></p>
      <p>Shipping: <span class="float-end">${formatCurrency(SHIPPING_RATE)}</span></p>
      <p>Taxable Subtotal: <span class="float-end">${formatCurrency(taxable)}</span></p>
      <p>Tax (${(TAX_RATE * 100).toFixed(1)}%): <span class="float-end">${formatCurrency(taxAmount)}</span></p>
      <hr>
      <p><strong>Invoice Total:</strong> <span class="float-end">${formatCurrency(invoiceTotal)}</span></p>
    </div>
    <div class="mt-3">
      <button onclick="clearCart()" class="btn btn-warning">Clear Cart</button>
      <button onclick="closeCart()" class="btn btn-secondary">Keep Shopping</button>
    </div>
  `;

  container.innerHTML = html;
}

// Remove Item
function removeItem(id) {
  var cart = readCart()
  cart = cart.filter(item => item.id !== id);
  writeCart(cart)
  render();
}

// Clear Cart
function clearCart() {
  writeCart([]);
  render();
}
