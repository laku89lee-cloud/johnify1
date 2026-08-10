/* ============================================================
   JOHNIFY — JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Theme Toggle with localStorage persistence ---------- */
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var themeIcon = document.getElementById('themeIcon');
  var root = document.documentElement;

  var sunSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  var moonSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  // 1) Check storage first (user's explicit choice)
  // 2) Fall back to system preference
  // 3) Default to light
  // Uses indirect access so it works in restricted sandboxes too
  var _ls;
  try { _ls = window['localStorage']; } catch(e) {}
  var currentTheme = 'light';
  try {
    var savedTheme = _ls ? _ls.getItem('johnify-theme') : null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      currentTheme = savedTheme;
    } else {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDark ? 'dark' : 'light';
    }
  } catch (e) {
    currentTheme = 'light';
  }

  // Apply immediately to prevent flash
  root.setAttribute('data-theme', currentTheme);

  function updateThemeIcon() {
    if (!themeToggle) return;
    var newIcon = currentTheme === 'dark' ? moonSVG : sunSVG;
    themeToggle.innerHTML = newIcon;
    themeIcon = document.getElementById('themeIcon');
    themeToggle.setAttribute('aria-label', 'Passa a modalità ' + (currentTheme === 'dark' ? 'chiara' : 'scura'));
  }

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      // Persist across page navigations
      try { if (_ls) _ls.setItem('johnify-theme', currentTheme); } catch (e) {}
      updateThemeIcon();
    });
  }

  /* ---------- Mobile Menu ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Header scroll shadow ---------- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- FAQ Accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          var otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* ---------- Contact Form ---------- */
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (formSuccess) {
        formSuccess.classList.add('show');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      contactForm.reset();
      setTimeout(function () {
        if (formSuccess) formSuccess.classList.remove('show');
      }, 8000);
    });
  }

  /* ---------- Chat Widget ---------- */
  var chatToggle = document.getElementById('chatToggle');
  var chatWindow = document.getElementById('chatWindow');
  var chatClose = document.getElementById('chatClose');
  var chatSend = document.getElementById('chatSend');
  var chatInput = document.getElementById('chatInput');
  var chatMessages = document.getElementById('chatMessages');
  var notificationDot = document.querySelector('.notification-dot');

  var chatOpen = false;

  function toggleChat(open) {
    chatOpen = open !== undefined ? open : !chatOpen;
    if (chatWindow) {
      chatWindow.classList.toggle('open', chatOpen);
    }
    if (chatOpen) {
      if (notificationDot) notificationDot.style.display = 'none';
      if (chatInput) setTimeout(function () { chatInput.focus(); }, 300);
    }
  }

  if (chatToggle) {
    chatToggle.addEventListener('click', function () {
      toggleChat();
    });
  }

  if (chatClose) {
    chatClose.addEventListener('click', function () {
      toggleChat(false);
    });
  }

  function addMessage(text, isUser) {
    if (!chatMessages) return;
    var msg = document.createElement('div');
    msg.className = 'chat-msg ' + (isUser ? 'chat-msg-user' : 'chat-msg-bot');
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    if (!chatMessages) return;
    var typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    var typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  /* Demo responses — simulates John's behavior */
  var responses = [
    {
      keywords: ['prezzo', 'prezzi', 'costo', 'costa', 'quanto'],
      reply: 'I nostri prezzi sono semplici: il sito web costa €499 (una tantum), il chatbot John costa €149/mese, e la manutenzione €49/mese. Puoi vedere tutti i dettagli nella pagina Prezzi. Vuoi che ti aiuti a scegliere il pacchetto giusto?'
    },
    {
      keywords: ['sito', 'web', 'website'],
      reply: 'Creiamo siti web professionali in 24 ore! Design moderno, ottimizzati SEO, responsive su mobile. Costa €499 una tantum. Vuoi iniziare?'
    },
    {
      keywords: ['john', 'chatbot', 'bot', 'assistente'],
      reply: 'John è il nostro chatbot AI! Viene addestrato sui dati del tuo business, risponde ai clienti 24/7, e gestisce le prenotazioni sul tuo Google Calendar. Costa €149/mese — meno di un decimo di uno stipendio. Vuoi saperne di più?'
    },
    {
      keywords: ['appuntamento', 'prenotare', 'prenotazione', 'calendario', 'calendar'],
      reply: 'John può prenotare, spostare e cancellare appuntamenti direttamente sul tuo Google Calendar — tutto automatico, 24/7. I clienti non devono più aspettare che tu risponda al telefono. Vuoi vedere come funziona?'
    },
    {
      keywords: ['contatto', 'contattare', 'parlare', 'chiamare', 'email', 'telefono'],
      reply: 'Puoi contattarci compilando il modulo nella pagina Contatti, oppure scrivendo a info.johnify@gmail.com. Ti rispondiamo entro 2 ore durante l\'orario di lavoro!'
    },
    {
      keywords: ['24', 'ore', 'veloce', 'velocità', 'tempo'],
      reply: 'Il tuo sito può essere online in 24 ore dalla conferma! E John viene addestrato e installato nello stesso lasso di tempo. Velocità è il nostro motto.'
    },
    {
      keywords: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey'],
      reply: 'Ciao! Sono John, l\'assistente virtuale di Johnify. Posso aiutarti con informazioni sui nostri servizi: siti web in 24 ore, chatbot AI, e gestione appuntamenti. Cosa ti interessa?'
    },
    {
      keywords: ['grazie', 'ok', 'perfetto', 'bene'],
      reply: 'Di nulla! Sono qui 24/7 per aiutarti. Se hai altre domande, scrivimi pure. E ricorda: puoi sempre contattare il team Johnify tramite la pagina Contatti.'
    },
    {
      keywords: ['dipendente', 'stipendio', 'risparmio', 'confronto'],
      reply: 'Ecco i numeri: un dipendente costa €1.500-2.500/mese + contributi + ferie + malattie. John costa €149/mese, tutto incluso, e lavora 24/7. Risparmi €25.000+ all\'anno. È un no-brainer.'
    },
    {
      keywords: ['manutenzione', 'aggiornamento', 'supporto'],
      reply: 'La manutenzione mensile costa €49/mese e include: aggiornamenti di sicurezza, backup, piccole modifiche ai contenuti, e aggiornamenti del chatbot John. Tutto incluso!'
    }
  ];

  function getResponse(message) {
    var lower = message.toLowerCase();
    for (var i = 0; i < responses.length; i++) {
      var keywords = responses[i].keywords;
      for (var j = 0; j < keywords.length; j++) {
        if (lower.indexOf(keywords[j]) !== -1) {
          return responses[i].reply;
        }
      }
    }
    return 'Ottima domanda! Per darti una risposta precisa, ti consiglio di contattare il team Johnify tramite la pagina Contatti o scrivendo a info.johnify@gmail.com. Ti rispondono entro 2 ore!';
  }

  function sendMessage() {
    if (!chatInput || !chatInput.value.trim()) return;
    var text = chatInput.value.trim();
    addMessage(text, true);
    chatInput.value = '';

    showTyping();
    setTimeout(function () {
      removeTyping();
      addMessage(getResponse(text), false);
    }, 800 + Math.random() * 600);
  }

  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  /* ---------- Scroll Reveal Animations ---------- */
  if ('IntersectionObserver' in window) {
    var revealElements = document.querySelectorAll('.feature-card, .service-card, .pricing-card, .testimonial-card, .step, .faq-item');
    revealElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Auto-open chat after 5 seconds (once) ---------- */
  var hasAutoOpened = false;
  setTimeout(function () {
    if (!chatOpen && !hasAutoOpened && notificationDot) {
      hasAutoOpened = true;
      if (notificationDot) notificationDot.style.animation = 'pulse 2s infinite';
    }
  }, 3000);

})();
