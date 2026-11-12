// Отображение избранных товаров.
function renderFavorites(){
  const container=document.querySelector('[data-fav-container]'); if(!container)return;
  const empty=document.querySelector('[data-fav-empty]');
  const items=products.filter(p=>favorites.has(p.id));
  if(empty)empty.hidden=items.length>0;
  container.textContent='';
  items.forEach(product=>{
    const card=document.createElement('article'); card.className='product-card bmw-card';
    const fav=document.createElement('button'); fav.type='button'; fav.className='fav-btn is-favorite'; fav.dataset.action='toggle-favorite'; fav.dataset.productId=product.id; fav.textContent='♥'; fav.setAttribute('aria-label','Убрать из избранного');
    const media=document.createElement('a'); media.className='bmw-card__media'; media.href=`product${product.id}.html`;
    const img=document.createElement('img'); img.className='product-card__image bmw-card__image'; img.src=product.image; img.alt=product.title; img.width=640; img.height=480; img.loading='lazy'; media.append(img);
    const body=document.createElement('div'); body.className='bmw-card__body';
    const title=document.createElement('h3'); title.className='product-card__title bmw-card__title'; title.textContent=product.title;
    const desc=document.createElement('p'); desc.className='product-card__description'; desc.textContent=product.description;
    const price=document.createElement('p'); price.className='product-card__price'; price.textContent=`${product.price.toLocaleString('ru-RU')} руб.`;
    const cart=document.createElement('button'); cart.type='button'; cart.className='button button--primary product-card__button'; cart.dataset.action='add-to-cart'; cart.dataset.productId=product.id; cart.textContent='В корзину'; cart.disabled=!product.isAvailable;
    body.append(title,desc,price,cart); card.append(fav,media,body); container.append(card);
  });
  syncCartButtons(); syncFavButtons();
}
renderFavorites();
