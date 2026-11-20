(function () {
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  function closeNav() {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-lock");
  }
  burger.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-lock", open);
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  var themeBtn = document.getElementById("theme");
  function paintTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var dark = theme === "dark";
    themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
    themeBtn.textContent = dark ? "Светлая" : "Тёмная";
    themeBtn.setAttribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему");
  }
  var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  paintTheme(current);
  themeBtn.addEventListener("click", function () {
    current = current === "dark" ? "light" : "dark";
    paintTheme(current);
    try { localStorage.setItem("tasker-theme", current); } catch (error) {}
  });

  document.documentElement.classList.add("js");
  var nodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16 });
    nodes.forEach(function (node) { io.observe(node); });
  } else {
    nodes.forEach(function (node) { node.classList.add("is-visible"); });
  }

  document.querySelectorAll("[data-accordion] .acc-item > button").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.parentElement;
      var box = item.parentElement;
      var open = item.classList.contains("is-open");
      box.querySelectorAll(".acc-item").forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  var prices = { start: 490, team: 1490, biz: 3990 };
  function money(value) {
    return new Intl.NumberFormat("ru-RU").format(value);
  }
  function renderPrices(yearly) {
    Object.keys(prices).forEach(function (key) {
      var month = yearly ? Math.round(prices[key] * 0.8) : prices[key];
      var year = Math.round(prices[key] * 12 * 0.8);
      document.querySelector('[data-price="' + key + '"]').textContent = money(month);
      document.querySelector('[data-note="' + key + '"]').textContent = yearly ? money(year) + " ₽ в год" : "оплата помесячно";
    });
  }
  document.querySelectorAll("[data-bill]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-bill]").forEach(function (other) {
        var on = other === button;
        other.classList.toggle("is-on", on);
        other.setAttribute("aria-pressed", on ? "true" : "false");
      });
      renderPrices(button.getAttribute("data-bill") === "year");
    });
  });

  var form = document.getElementById("trial-form");
  var email = document.getElementById("email");
  email.addEventListener("input", function () {
    document.getElementById("email-error").textContent = "";
    email.removeAttribute("aria-invalid");
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      document.getElementById("email-error").textContent = "Нужна почта вида name@studio.ru.";
      email.setAttribute("aria-invalid", "true");
      return;
    }
    document.getElementById("trial-fields").hidden = true;
    var success = document.getElementById("trial-success");
    success.hidden = false;
    success.textContent = "Готово. На " + value + " ничего не отправлено: это макет лендинга, пробный доступ не создаётся.";
    success.focus();
  });
})();
