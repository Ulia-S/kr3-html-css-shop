// Открытие модалки (index.html, product.html)
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');

if (orderDialog && orderButtons.length) {
  orderButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('selected-product');
      if (input) input.value = btn.dataset.product || '';
      orderDialog.showModal();
    });
  });
}

// Закрытие модалки
const closeBtn = document.getElementById('close-order-dialog');
if (closeBtn && orderDialog) {
  closeBtn.addEventListener('click', () => orderDialog.close());
}

// Форма (index.html, product.html, order.html)
const form = document.getElementById('order-form');
const success = document.getElementById('success-message');

if (form && success) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = Array.from(form.elements);

    fields.forEach((f) => f.willValidate && f.removeAttribute('aria-invalid'));

    if (!form.checkValidity()) {
      fields.forEach((f) => {
        if (f.willValidate && !f.checkValidity()) f.setAttribute('aria-invalid', 'true');
      });
      form.reportValidity();
      return;
    }

    success.hidden = false;
    form.reset();
    if (orderDialog) orderDialog.close();
  });
}

// Кнопка Наверх
document.querySelector('.to-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});