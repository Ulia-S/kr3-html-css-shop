// Корзина и избранное: единое хранилище для всех страниц.
const CART_KEY = 'shop:cart';
const FAV_KEY = 'shop:fav';
let cartItems = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const favorites = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));

function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cartItems)); }
function saveFavorites(){ localStorage.setItem(FAV_KEY, JSON.stringify([...favorites])); }
function getProductById(id){ return products.find(p => p.id === Number(id)); }
function isInCart(id){ return cartItems.some(item => item.id === Number(id)); }

function updateCounters(){
  const cartCounter = document.querySelector('.cart-counter');
  const favCounter = document.querySelector('.fav-counter');
  if(cartCounter) cartCounter.textContent = `Корзина: ${cartItems.reduce((sum,item)=>sum+item.qty,0)}`;
  if(favCounter) favCounter.textContent = `Избранное: ${favorites.size}`;
  syncCartButtons();
  syncFavButtons();
}
function syncCartButtons(){
  document.querySelectorAll('[data-action="add-to-cart"]').forEach(btn=>{
    const inCart = isInCart(btn.dataset.productId);
    btn.textContent = inCart ? 'В корзине' : 'В корзину';
    btn.classList.toggle('is-in-cart', inCart);
    btn.setAttribute('aria-pressed', String(inCart));
  });
}
function syncFavButtons(){
  document.querySelectorAll('[data-action="toggle-favorite"]').forEach(btn=>{
    const active = favorites.has(Number(btn.dataset.productId));
    btn.textContent = active ? '♥' : '♡';
    btn.classList.toggle('is-favorite', active);
    btn.setAttribute('aria-label', active ? 'Убрать из избранного' : 'Добавить в избранное');
    btn.setAttribute('aria-pressed', String(active));
  });
}
function addToCart(id){
  id = Number(id);
  const found = cartItems.find(item=>item.id===id);
  if(found) found.qty += 1; else cartItems.push({id,qty:1});
  saveCart(); updateCounters();
}
function removeFromCart(id){ cartItems=cartItems.filter(item=>item.id!==Number(id)); saveCart(); updateCounters(); }
function changeQty(id,delta){
  const item=cartItems.find(i=>i.id===Number(id)); if(!item)return;
  item.qty+=delta; if(item.qty<=0) removeFromCart(id); else {saveCart();updateCounters();}
}
function toggleFavorite(id){
  id=Number(id); if(favorites.has(id)) favorites.delete(id); else favorites.add(id);
  saveFavorites(); updateCounters();
  if(typeof renderFavorites==='function') renderFavorites();
}

const PROMOCODES={SALE10:10,SALE20:20};
let currentPromo='';
function calculateCartTotal(){
  const subtotal=cartItems.reduce((sum,item)=>{const p=getProductById(item.id);return sum+(p?p.price*item.qty:0);},0);
  const discount=PROMOCODES[currentPromo] ? Math.round(subtotal*PROMOCODES[currentPromo]/100) : 0;
  return {subtotal,discount,total:subtotal-discount};
}
function renderCart(){
  const container=document.querySelector('[data-cart-container]'); if(!container)return;
  container.textContent='';
  cartItems.forEach(item=>{
    const product=getProductById(item.id); if(!product)return;
    const card=document.createElement('article'); card.className='cart-product-card';
    const img=document.createElement('img'); img.className='cart-product-card__image'; img.src=product.image; img.alt=product.title;
    const info=document.createElement('div'); info.className='cart-product-card__info';
    const title=document.createElement('p'); title.className='cart-product-card__title'; title.textContent=product.title;
    const meta=document.createElement('p'); meta.className='cart-product-card__meta'; meta.textContent=`${product.price.toLocaleString('ru-RU')} руб. × ${item.qty}`;
    info.append(title,meta);
    const controls=document.createElement('div'); controls.className='cart-product-card__qty';
    [['−',()=>changeQty(product.id,-1)],['+',()=>changeQty(product.id,1)],['Удалить',()=>removeFromCart(product.id)]].forEach(([label,fn])=>{
      const b=document.createElement('button'); b.type='button'; b.className='button button--secondary'; b.textContent=label;
      b.addEventListener('click',()=>{fn();renderCart();}); controls.append(b);
    });
    card.append(img,info,controls); container.append(card);
  });
  const empty=document.querySelector('[data-cart-empty]');
  if(empty) empty.hidden=cartItems.length!==0;
  const {subtotal,discount,total}=calculateCartTotal();
  const totalEl=document.querySelector('[data-cart-total]');
  if (totalEl) {
    totalEl.textContent = `Сумма: ${subtotal.toLocaleString('ru-RU')} руб.\n` +
                          `${discount ? `Скидка: ${discount.toLocaleString('ru-RU')} руб.\n` : ''}` +
                          `Итого: ${total.toLocaleString('ru-RU')} руб.`;
  }
}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-action="add-to-cart"]');
  if(add){addToCart(add.dataset.productId);renderCart();return;}
  const fav=event.target.closest('[data-action="toggle-favorite"]');
  if(fav) toggleFavorite(fav.dataset.productId);
});
const promoBtn=document.querySelector('#promo-apply');
if(promoBtn) promoBtn.addEventListener('click',()=>{
  const input=document.querySelector('#promo-input'); const msg=document.querySelector('.promo-message');
  const code=input?input.value.trim().toUpperCase():'';
  currentPromo=PROMOCODES[code]?code:'';
  if(msg) msg.textContent=currentPromo?`Промокод применён: −${PROMOCODES[code]}%`:'Промокод не найден.';
  renderCart();
});
updateCounters(); renderCart();
