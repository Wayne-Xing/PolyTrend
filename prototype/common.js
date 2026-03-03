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

  function bindLangSwitch() {
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var zh = btn.dataset.lang !== 'en';
        if (zh) {
          btn.dataset.lang = 'en';
          btn.textContent = 'English | 简中';
        } else {
          btn.dataset.lang = 'zh';
          btn.textContent = '简体中文 | EN';
        }
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

  updateClock();
  bindLangSwitch();
  markActiveTab();
  setInterval(updateClock, 1000);
})();
