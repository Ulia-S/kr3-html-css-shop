// Поиск, фильтр, сортировка и пагинация каталога.
const productsContainer=document.querySelector('[data-products-container]');
const searchInput=document.querySelector('#catalog-search');
const categoryFilter=document.querySelector('#category-filter');
const sortSelect=document.querySelector('#sort-select');
const catalogCount=document.querySelector('.catalog-count');
const paginationEl=document.querySelector('[data-pagination]');
const catalogState={query:'',category:'all',sort:'default',page:1,perPage:6};

function createProductCard(product){
  const card=document.createElement('article'); card.className='product-card bmw-card';
  const fav=document.createElement('button'); fav.type='button'; fav.className='fav-btn'; fav.dataset.action='toggle-favorite'; fav.dataset.productId=product.id; fav.textContent='♡';
  fav.setAttribute('aria-label','Добавить в избранное');
  const media=document.createElement('a'); media.className='bmw-card__media'; media.href=`product${product.id}.html`;
  const img=document.createElement('img'); img.className='product-card__image bmw-card__image'; img.src=product.image; img.alt=product.title; img.width=640; img.height=480; img.loading='lazy'; media.append(img);
  const body=document.createElement('div'); body.className='bmw-card__body';
  const kicker=document.createElement('p'); kicker.className='bmw-card__kicker'; kicker.textContent=product.category==='day'?'День':product.category==='night'?'Ночь':product.category==='storm'?'Гроза':'Зима';
  const title=document.createElement('h3'); title.className='product-card__title bmw-card__title'; title.textContent=product.title;
  const desc=document.createElement('p'); desc.className='product-card__description'; desc.textContent=product.description;
  const price=document.createElement('p'); price.className='product-card__price'; price.textContent=`Цена: ${product.price.toLocaleString('ru-RU')} руб.`;
  const actions=document.createElement('div'); actions.className='product-card__actions';
  const cart=document.createElement('button'); cart.type='button'; cart.className='button button--primary product-card__button'; cart.dataset.action='add-to-cart'; cart.dataset.productId=product.id; cart.textContent='В корзину'; cart.disabled=!product.isAvailable;
  actions.append(cart); body.append(kicker,title,desc,price,actions); card.append(fav,media,body); return card;
}
function updateCatalog(){
  if(!productsContainer)return;
  let list=products.filter(p=>p.title.toLowerCase().includes(catalogState.query.toLowerCase()));
  if(catalogState.category!=='all') list=list.filter(p=>p.category===catalogState.category);
  if(catalogState.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(catalogState.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(catalogState.sort==='title-asc') list.sort((a,b)=>a.title.localeCompare(b.title,'ru'));
  if(catalogState.sort==='title-desc') list.sort((a,b)=>b.title.localeCompare(a.title,'ru'));
  const pages=Math.max(1,Math.ceil(list.length/catalogState.perPage)); catalogState.page=Math.min(catalogState.page,pages);
  const visible=list.slice((catalogState.page-1)*catalogState.perPage,catalogState.page*catalogState.perPage);
  productsContainer.textContent=''; visible.forEach(p=>productsContainer.append(createProductCard(p)));
  if(catalogCount) catalogCount.textContent=`Найдено товаров: ${list.length}`;
  const empty=document.querySelector('.catalog-empty'); if(empty) empty.hidden=list.length>0;
  if(paginationEl){
    paginationEl.textContent='';
    for(let i=1;i<=pages;i++){const b=document.createElement('button');b.type='button';b.className='button button--secondary';b.textContent=i;if(i===catalogState.page)b.classList.add('is-active');b.addEventListener('click',()=>{catalogState.page=i;updateCatalog();});paginationEl.append(b);}
  }
  syncCartButtons(); syncFavButtons();
}
if(searchInput)searchInput.addEventListener('input',()=>{catalogState.query=searchInput.value.trim();catalogState.page=1;updateCatalog();});
if(categoryFilter)categoryFilter.addEventListener('change',()=>{catalogState.category=categoryFilter.value;catalogState.page=1;updateCatalog();});
if(sortSelect)sortSelect.addEventListener('change',()=>{catalogState.sort=sortSelect.value;catalogState.page=1;updateCatalog();});
updateCatalog();
