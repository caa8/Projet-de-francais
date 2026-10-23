// Trois thèmes : sombre, clair et rose. Le choix est mémorisé.
const themeToggle = document.querySelector("#themeToggle");
const root = document.documentElement;
const themes = {
  dark: { label: "☀️ <span>Mode clair</span>", aria: "Activer le mode clair", color: "#0b1220" },
  light: { label: "🌸 <span>Mode rose</span>", aria: "Activer le mode rose", color: "#f5f8fc" },
  pink: { label: "🌙 <span>Mode sombre</span>", aria: "Activer le mode sombre", color: "#fff0f6" }
};
function applyTheme(theme) {
  if (!themes[theme]) theme = "dark";
  root.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.innerHTML = themes[theme].label;
    themeToggle.setAttribute("aria-label", themes[theme].aria);
    themeToggle.setAttribute("aria-pressed", String(theme !== "dark"));
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themes[theme].color);
}
let savedTheme = null;
try { savedTheme = localStorage.getItem("lunettes-theme"); } catch (error) {}
applyTheme(savedTheme || "dark");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const order = ["dark", "light", "pink"];
    const nextTheme = order[(order.indexOf(root.dataset.theme) + 1) % order.length];
    applyTheme(nextTheme);
    try { localStorage.setItem("lunettes-theme", nextTheme); } catch (error) {}
  });
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    menuButton.textContent = isOpen ? "×" : "☰";
  });
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Ouvrir le menu");
      menuButton.textContent = "☰";
    });
  });
}

// Gentle reveal animation as sections enter the viewport.
document.documentElement.classList.add("reveal-ready");
const revealTargets = document.querySelectorAll("main section, .feature-card, .use-item, .team-card, .balance-card");
revealTargets.forEach((element) => element.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}

// Soft pointer glow inside interactive cards.
document.querySelectorAll(".feature-card, .team-card, .balance-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

// Highlight the current topic in the left navigation.
const topicLinks = document.querySelectorAll(".sidebar-topic");
const topicSections = [...topicLinks].map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window && topicSections.length) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        topicLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-30% 0px -55% 0px" });
  topicSections.forEach((section) => activeObserver.observe(section));
}
