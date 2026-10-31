(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  function closeMenu() { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '메뉴 열기'); }
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    mobileMenu.hidden = expanded;
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? '메뉴 열기' : '메뉴 닫기');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const tabs = [...document.querySelectorAll('[data-feature]')];
  function activateTab(index, focus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(index));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); activateTab(next, true); }
    });
  });

  const dialog = document.getElementById('login-dialog');
  document.querySelectorAll('[data-login]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });

  const backTop = document.querySelector('.back-top');
  function updateBackTop() { backTop.hidden = window.scrollY < 700; }
  window.addEventListener('scroll', updateBackTop, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  updateBackTop();

  document.getElementById('email-copy').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try { await navigator.clipboard.writeText('support@linklehouse.com'); status.textContent = '이메일 주소를 복사했습니다.'; }
    catch { status.textContent = '이메일 주소: support@linklehouse.com'; }
  });

  const demoButton = document.getElementById('demo-run');
  const demoPanel = document.getElementById('hero-demo-panel');
  const originalPanel = demoPanel.innerHTML;
  const stages = [...document.querySelectorAll('[data-stage]')];
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  let finished = false;
  const stage = index => stages.forEach((node, i) => node.classList.toggle('active', i <= index));
  demoButton.addEventListener('click', async () => {
    if (finished) { demoPanel.innerHTML = originalPanel; stage(0); demoButton.querySelector('span').textContent = '등록 준비 미리보기'; finished = false; return; }
    demoButton.disabled = true;
    demoButton.classList.add('running');
    demoPanel.setAttribute('aria-busy', 'true');
    stage(1);
    demoButton.querySelector('span').textContent = 'AI 상품명과 자료를 준비하는 과정';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await wait(reduced ? 0 : 1000);
    demoPanel.innerHTML = '<div class="demo-success"><span class="success-circle"><svg class="icon"><use href="#i-spark"/></svg></span><h3>사진과 상품 정보로 등록 준비</h3><p>상품명 · 카테고리 · 옵션 · 상세페이지를 준비하고<br>연결한 마켓으로 다음 단계를 이어갑니다.</p><div class="demo-mini-markets"><span>쿠팡</span><span>롯데ON</span><span>11번가</span></div></div>';
    await wait(reduced ? 0 : 1400);
    stage(2);
    demoPanel.innerHTML = '<div class="demo-success"><span class="success-circle"><svg class="icon"><use href="#i-check"/></svg></span><h3>등록 결과까지 한눈에</h3><p>완료한 상품과 확인이 필요한 상품을 살펴보고<br>주문·발주 관리로 이어갑니다.</p><div class="demo-mini-markets"><span>등록 결과 확인</span><span>보류 사유 확인</span></div></div>';
    demoPanel.removeAttribute('aria-busy');
    demoButton.querySelector('span').textContent = '처음부터 다시 보기';
    demoButton.classList.remove('running');
    demoButton.disabled = false;
    finished = true;
  });
})();
