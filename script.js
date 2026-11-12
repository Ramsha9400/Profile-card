/* ============================================================
   PROFILE CARD  ·  by @stackanddstyle
   Plain JavaScript, no libraries.
   ============================================================ */

// 1. Grab the elements we need
const profile = document.getElementById("profile");
const toggle = document.getElementById("toggle");
const socialLinks = Array.from(
  document.querySelectorAll(".profile__social")
);

// The saved state lives in localStorage under this name
const STORAGE_KEY = "profile-card-open";

// 2. Small helper: is the card open right now?
function isOpen() {
  return profile.dataset.open === "true";
}

// 3. Remember the state (storage can be blocked, so use try/catch)
function saveState(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch (error) {
    // Storage is not available, so we simply skip saving
  }
}

function loadState() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch (error) {
    return false;
  }
}

// 4. Open or close the card
//    CSS does the animation, we only change data-open and ARIA text
function setOpen(open, remember = true) {
  profile.dataset.open = String(open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute(
    "aria-label",
    open ? "Close social links" : "Open social links"
  );

  if (remember) {
    saveState(open);
  }
}

// 5. Click on the menu button
toggle.addEventListener("click", function () {
  setOpen(!isOpen());
});

// 6. Keyboard shortcuts
document.addEventListener("keydown", function (event) {
  // Leave browser shortcuts (Ctrl+P, Cmd+R ...) alone
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const key = event.key.toLowerCase();

  // P toggles the card
  if (key === "p") {
    setOpen(!isOpen());
    return;
  }

  // Esc closes the card and gives focus back to the menu button
  if (key === "escape" && isOpen()) {
    setOpen(false);
    toggle.focus();
    return;
  }

  // Arrow keys walk through the icons while the card is open
  if (isOpen() && key.startsWith("arrow")) {
    event.preventDefault();

    const current = socialLinks.indexOf(document.activeElement);
    const forward = key === "arrowright" || key === "arrowdown";
    let next = forward ? current + 1 : current - 1;

    // Wrap around at both ends
    if (next >= socialLinks.length) {
      next = 0;
    }
    if (next < 0) {
      next = socialLinks.length - 1;
    }

    socialLinks[next].focus();
  }
});

// 7. These links are only a demo, so stop them jumping to the top
socialLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
  });
});

// 8. Start: restore the saved state without playing the animation
setOpen(loadState(), false);

// Remove the "no animation" guard after the first paint
requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    document.documentElement.classList.remove("is-loading");
  });
});
