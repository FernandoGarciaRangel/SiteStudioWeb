// O número real fica no HTML, não aqui: crawlers de IA e scrapers de preview
// de link não executam JavaScript, e sem o número no markup o site não tem
// forma de contato para eles. Este bloco virou normalizador — mantém os 6
// links em dia com a constante caso o número mude.
const WHATSAPP_NUMBER = '5521991088053';

document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
  link.href = link.href.replace(/wa\.me\/[^?]+/, `wa.me/${WHATSAPP_NUMBER}`);
});

// Custom cursor. Só roda em ponteiro fino e sem pedido de movimento reduzido —
// no celular ele nem aparece, mas o requestAnimationFrame rodava assim mesmo,
// gastando quadro a quadro de graça. O CSS devolve o ponteiro nativo nos dois
// casos em que este bloco não roda.
const cursor = document.querySelector('.cursor');
const dot = document.querySelector('.cursor-dot');
const cursorAtivo = cursor && dot
  && matchMedia('(hover: hover) and (pointer: fine)').matches
  && !matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cursorAtivo) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// Nav e FAQ são opcionais: a 404 não tem nenhum dos dois, e páginas futuras
// podem não ter também. Sem as guardas, um getElementById nulo derruba o
// resto do arquivo.

// Nav scroll
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Hamburger menu
const burger = document.getElementById('nav-burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// FAQ with dynamic height
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const inner = item.querySelector('.faq-a-inner');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = '0';
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = inner.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// Ano do rodapé
const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  observer.observe(el);
});
