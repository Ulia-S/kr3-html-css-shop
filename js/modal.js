// Открытие и закрытие модального окна обратной связи/заказа.
const orderDialog=document.getElementById('order-dialog');
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-action="order"], [data-product]');
  if(!trigger||!orderDialog)return;
  const selected=document.getElementById('selected-product');
  if(selected)selected.value=trigger.dataset.product||'';
  orderDialog.showModal();
});
const closeOrderBtn=document.getElementById('close-order-dialog');
if(closeOrderBtn&&orderDialog)closeOrderBtn.addEventListener('click',()=>orderDialog.close());
if(orderDialog)orderDialog.addEventListener('click',event=>{
  if(event.target===orderDialog)orderDialog.close();
});
