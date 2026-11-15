// Simple cart for the Dessert Cafe demo website.
const CART_KEY = "dessertCafeCart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart() {
  const list = document.getElementById("cart-items");
  if (!list) return;

  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = `Rs. ${total.toFixed(2)}`;
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = "<li>Your cart is empty.</li>";
    return;
  }

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} × ${item.quantity} — Rs. ${(item.price * item.quantity).toFixed(2)}`;
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-button").forEach(button => {
    button.addEventListener("click", () => {
      const cart = getCart();
      const name = button.dataset.name;
      const price = Number(button.dataset.price);
      const existing = cart.find(item => item.name === name);

      if (existing) existing.quantity += 1;
      else cart.push({ name, price, quantity: 1 });

      saveCart(cart);
      renderCart();
      button.textContent = "Added!";
      setTimeout(() => button.textContent = "Add to Cart", 900);
    });
  });

  renderCart();

  const checkoutButton = document.getElementById("checkout-button");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (getCart().length === 0) {
        alert("Your cart is empty. Please add an item first.");
        return;
      }
      window.location.href = "contact.html";
    });
  }

  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("customer-name").value.trim();
      const phone = document.getElementById("customer-phone").value.trim();
      const message = document.getElementById("order-message").value.trim();
      const cart = getCart();
      const cartText = cart.map(item =>
        `${item.name} x ${item.quantity} (Rs. ${(item.price * item.quantity).toFixed(2)})`
      ).join("%0D%0A");
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const subject = encodeURIComponent("Dessert Cafe order request");
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nMessage: ${message}\n\nCart:\n${cart.map(item => `${item.name} x ${item.quantity}`).join("\n")}\nTotal: Rs. ${total.toFixed(2)}`
      );
      window.location.href = `mailto:hello@dessertcafe.example?subject=${subject}&body=${body}`;
      document.getElementById("form-note").textContent =
        "Your email app should open with your order request. Replace the sample email address before publishing.";
    });
  }
});
