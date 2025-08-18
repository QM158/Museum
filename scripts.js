(function(){
  const modal      = document.getElementById('modal');
  const modalBody  = document.getElementById('modal-body');
  const closeBtn   = modal.querySelector('.close-modal');
  let lastTrigger  = null;

  function openFrom(selector, trigger){
    const src = document.querySelector(selector);
    if (!src) { console.warn('Missing modal content:', selector); return; }
    modalBody.innerHTML = src.innerHTML;
    modal.style.display = 'block';
    lastTrigger = trigger || null;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.style.display = 'none';
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  document.addEventListener('click', (e)=>{
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger){
      e.preventDefault();
      openFrom(trigger.getAttribute('data-modal-target'), trigger);
      return;
    }
    if (e.target === modal || e.target.closest('.close-modal')) closeModal();
  });

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
  });
  
})();

