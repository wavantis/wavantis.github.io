const WAVANTIS_LANGUAGE_KEY = "wavantis-language";
const WAVANTIS_SUPPORTED_LANGUAGES = ["id", "en"];
const WAVANTIS_DEFAULT_LANGUAGE = "id";

function getNestedValue(source, path) {
  return path.split(".").reduce((value, key) => value && value[key], source);
}

function resolveLanguage() {
  let storedLanguage = null;
  try {
    storedLanguage = window.localStorage.getItem(WAVANTIS_LANGUAGE_KEY);
  } catch (error) {
    storedLanguage = null;
  }
  return WAVANTIS_SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : WAVANTIS_DEFAULT_LANGUAGE;
}

function localizedProjectValue(project, key, language) {
  const translated = project.translations && project.translations[language];
  if (translated && translated[key] !== undefined) return translated[key];
  const fallback = project.translations && project.translations.en;
  if (fallback && fallback[key] !== undefined) return fallback[key];
  return project[key];
}

async function loadWavantisTranslations() {
  const language = resolveLanguage();
  const response = await fetch(`/locales/${language}.json`);
  if (!response.ok) throw new Error(`Translation file could not be loaded: ${language}`);
  const translations = await response.json();
  const state = {
    language,
    translations,
    get(key) {
      return getNestedValue(translations, key) ?? key;
    },
    project(project, key) {
      return localizedProjectValue(project, key, state.language);
    },
    setLanguage(nextLanguage) {
      if (!WAVANTIS_SUPPORTED_LANGUAGES.includes(nextLanguage)) return;
      try {
        window.localStorage.setItem(WAVANTIS_LANGUAGE_KEY, nextLanguage);
      } catch (error) {
        // Continue without persistence when storage is unavailable.
      }
      window.location.reload();
    }
  };
  window.wavantisI18n = state;
  document.documentElement.lang = language;
  applyStaticTranslations(state);
  window.dispatchEvent(new CustomEvent("wavantis:language-ready", { detail: state }));
  return state;
}

function applyStaticTranslations(state) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = state.get(element.dataset.i18n);
    if (value === undefined) return;
    const decoration = element.querySelector(":scope > .heading-period");
    if (decoration) {
      element.replaceChildren(document.createTextNode(value), decoration);
    } else {
      element.textContent = value;
    }
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const [attribute, key] = element.dataset.i18nAttr.split("|");
    element.setAttribute(attribute, state.get(key));
  });
  document.querySelectorAll("[data-i18n-list]").forEach((element) => {
    const values = state.get(element.dataset.i18nList).split("|");
    const list = element.closest("ul");
    if (!list) return;
    list.replaceChildren(...values.map((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      return item;
    }));
  });
  const languageToggle = document.querySelector("[data-language-toggle]");
  if (languageToggle) {
    languageToggle.querySelectorAll("button[data-language]").forEach((button) => {
      const active = button.dataset.language === state.language;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    languageToggle.setAttribute("aria-label", state.get("accessibility.language"));
    languageToggle.querySelectorAll("button[data-language]").forEach((button) => {
      button.addEventListener("click", () => state.setLanguage(button.dataset.language));
    });
  }
  document.title = state.get("metadata.title");
  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (description) description.content = state.get("metadata.description");
  if (ogTitle) ogTitle.content = state.get("metadata.ogTitle");
  if (ogDescription) ogDescription.content = state.get("metadata.ogDescription");
}

window.wavantisLanguageReady = loadWavantisTranslations().catch((error) => {
  console.error(error);
  return null;
});
