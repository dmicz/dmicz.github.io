(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------------------------------------------------------------- theme */

  var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.dataset.theme || (systemPrefersDark.matches ? "dark" : "light");
  }

  function renderToggle() {
    var button = document.querySelector(".theme-toggle");
    if (!button) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    button.textContent = "[" + next + "]";
    button.setAttribute("aria-label", "Switch to " + next + " theme");
    button.hidden = false;
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* private mode — the choice just won't persist */
    }
    renderToggle();
  }

  function toggleTheme() {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  }

  systemPrefersDark.addEventListener("change", function () {
    if (!root.dataset.theme) renderToggle();
  });

  /* ------------------------------------------------------------ shortcuts */

  var shortcutsPanel;
  var awaitingSecondKey = false;
  var secondKeyTimer;

  function setShortcuts(show) {
    if (!shortcutsPanel) return;
    shortcutsPanel.hidden = !show;
  }

  var goTo = {
    h: "/",
    e: "/essays/",
    a: "/about/"
  };

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      el.isContentEditable
    );
  }

  document.addEventListener("keydown", function (event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTypingTarget(event.target)) return;

    if (event.key === "?") {
      event.preventDefault();
      setShortcuts(shortcutsPanel && shortcutsPanel.hidden);
      return;
    }

    if (event.key === "Escape") {
      setShortcuts(false);
      return;
    }

    if (event.key === "t") {
      toggleTheme();
      return;
    }

    if (awaitingSecondKey) {
      awaitingSecondKey = false;
      clearTimeout(secondKeyTimer);

      var path = goTo[event.key];
      if (path && path !== window.location.pathname) {
        window.location.href = path;
      }
      return;
    }

    if (event.key === "g") {
      awaitingSecondKey = true;
      secondKeyTimer = setTimeout(function () {
        awaitingSecondKey = false;
      }, 1000);
    }
  });

  /* ------------------------------------------------------ heading anchors */

  function addHeadingAnchors() {
    var headings = document.querySelectorAll(
      ".post-content :is(h2, h3, h4, h5, h6)[id]"
    );

    headings.forEach(function (heading) {
      var anchor = document.createElement("a");
      anchor.className = "heading-anchor";
      anchor.href = "#" + heading.id;
      anchor.textContent = "#";
      anchor.setAttribute("aria-label", "Permalink to this section");
      heading.appendChild(anchor);
    });
  }

  /* ------------------------------------------------------------------ init */

  document.addEventListener("DOMContentLoaded", function () {
    shortcutsPanel = document.getElementById("shortcuts");
    var button = document.querySelector(".theme-toggle");
    if (button) button.addEventListener("click", toggleTheme);
    renderToggle();
    addHeadingAnchors();
  });
})();
