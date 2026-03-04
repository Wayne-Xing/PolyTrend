(function () {
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function formatNow() {
    var now = new Date();
    return [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate())
    ].join('-') + ' ' + [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(':');
  }

  function updateClock() {
    var text = formatNow();
    document.querySelectorAll('[data-clock]').forEach(function (el) {
      el.textContent = text;
    });
  }

  function getStoredLang() {
    try {
      return localStorage.getItem('polytrend_lang') === 'en' ? 'en' : 'zh';
    } catch (err) {
      return 'zh';
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem('polytrend_lang', lang);
    } catch (err) {
      // Ignore storage errors in file preview mode.
    }
  }

  function applyLanguage(lang) {
    var nextLang = lang === 'en' ? 'en' : 'zh';
    document.documentElement.lang = nextLang === 'en' ? 'en' : 'zh-CN';
    document.body.dataset.lang = nextLang;
    setStoredLang(nextLang);

    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.dataset.lang = nextLang;
      btn.textContent = nextLang === 'en' ? 'English | 简中' : '简体中文 | EN';
    });

    document.querySelectorAll('[data-i18n-zh][data-i18n-en]').forEach(function (el) {
      var text = nextLang === 'en' ? el.getAttribute('data-i18n-en') : el.getAttribute('data-i18n-zh');
      if (text !== null) {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-title-zh][data-title-en]').forEach(function (titleEl) {
      var title = nextLang === 'en'
        ? titleEl.getAttribute('data-title-en')
        : titleEl.getAttribute('data-title-zh');
      if (title) {
        titleEl.textContent = title;
      }
    });

    if (document.body.dataset.docTitleZh && document.body.dataset.docTitleEn) {
      document.title = nextLang === 'en' ? document.body.dataset.docTitleEn : document.body.dataset.docTitleZh;
    }

    try {
      document.dispatchEvent(new CustomEvent('polytrend:languagechange', {
        detail: { lang: nextLang }
      }));
    } catch (err) {
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('polytrend:languagechange', false, false, { lang: nextLang });
      document.dispatchEvent(evt);
    }
  }

  function bindLangSwitch() {
    applyLanguage(getStoredLang());

    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nextLang = btn.dataset.lang === 'en' ? 'zh' : 'en';
        applyLanguage(nextLang);
      });
    });
  }

  function markActiveTab() {
    var active = document.body.dataset.tab;
    if (!active) return;
    document.querySelectorAll('[data-tab-key]').forEach(function (item) {
      if (item.getAttribute('data-tab-key') === active) {
        item.classList.add('active');
      }
    });
  }

  function bindTabNavigation() {
    var tabRoutes = {
      trending: 'trending.html',
      breaking: 'breaking.html',
      latest: 'latest.html',
      whales: 'whales.html',
      profile: 'profile.html'
    };

    document.querySelectorAll('[data-tab-key]').forEach(function (item) {
      item.addEventListener('click', function () {
        var key = item.getAttribute('data-tab-key');
        var target = tabRoutes[key];
        if (!target) return;
        if (window.location.pathname.endsWith('/' + target) || window.location.pathname.endsWith('\\' + target)) {
          return;
        }
        window.location.href = './' + target;
      });
    });
  }

  updateClock();
  bindLangSwitch();
  markActiveTab();
  bindTabNavigation();
  setInterval(updateClock, 1000);
})();
