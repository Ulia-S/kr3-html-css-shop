// Общие элементы интерфейса: тема, кнопка наверх и слайдер.
const topLink=document.querySelector('.to-top');
if(topLink)topLink.addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});
const themeBtn=document.querySelector('[data-toggle-theme]');
const THEME_KEY='shop:theme';
function applyTheme(theme){document.documentElement.classList.toggle('theme-dark',theme==='dark');}
applyTheme(localStorage.getItem(THEME_KEY)||'light');
if(themeBtn)themeBtn.addEventListener('click',()=>{
  const next=document.documentElement.classList.contains('theme-dark')?'light':'dark';
  applyTheme(next);localStorage.setItem(THEME_KEY,next);
});
const track=document.querySelector('[data-slider-track]');
const prev=document.querySelector('[data-slider-prev]');
const next=document.querySelector('[data-slider-next]');
if(track&&prev&&next){
  // На главной карточки превращаются в горизонтальную ленту.
  track.classList.add('is-slider-track');
  const step=()=>{const card=track.querySelector('.product-card');return card?card.getBoundingClientRect().width+24:320;};
  prev.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
  next.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
  const update=()=>{
    const max=track.scrollWidth-track.clientWidth;
    prev.disabled=track.scrollLeft<=2;
    next.disabled=track.scrollLeft>=max-2;
  };
  track.addEventListener('scroll',update);
  window.addEventListener('resize',update);
  update();
}
