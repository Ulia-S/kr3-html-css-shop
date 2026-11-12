// Клиентская проверка формы заявки (демонстрационная отправка).
document.querySelectorAll('.order-form').forEach(form=>{
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const name=form.querySelector('#order-name');
    const email=form.querySelector('#order-email');
    const phone=form.querySelector('#order-phone');
    const agreement=form.querySelector('#order-agreement');
    let valid=true;
    [name,email,phone].forEach(input=>{if(input){input.setCustomValidity('');if(!input.checkValidity()){input.reportValidity();valid=false;}}});
    if(name&&name.value.trim().length<2){name.setCustomValidity('Введите имя не короче 2 символов.');name.reportValidity();valid=false;}
    if(agreement&&!agreement.checked){agreement.setCustomValidity('Необходимо согласие на обработку данных.');agreement.reportValidity();valid=false;}
    if(!valid)return;
    const msg=form.querySelector('.form-message');
    if(msg)msg.textContent='Заявка успешно отправлена (демонстрационный режим).';
    form.reset();
    const dialog=form.closest('dialog'); if(dialog)dialog.close();
    const success=document.getElementById('success-message'); if(success){success.hidden=false;}
  });
});
