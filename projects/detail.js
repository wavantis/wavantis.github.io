const root = document.querySelector("#project-detail");

function addText(parent, tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
}

function addSection(parent, title, content, extraClass = "") {
  if (!content) return;
  const section = document.createElement("section");
  section.className = extraClass ? `detail-section ${extraClass}` : "detail-section";
  addText(section, "h2", "", title);
  addText(section, "p", "", content);
  parent.append(section);
}

function addListSection(parent, title, items) {
  if (!Array.isArray(items) || !items.length) return;
  const section = document.createElement("section");
  section.className = "detail-section";
  addText(section, "h2", "", title);
  const list = document.createElement("ul");
  for (const item of items) addText(list, "li", "", item);
  section.append(list);
  parent.append(section);
}

function addLinks(parent, project, i18n) {
  const projectText = (key) => i18n.project(project, key);
  const availableLinks = [
    ["GitHub", project.githubUrl],
    ["Live demo", project.demoUrl],
    ["Case study", project.caseStudyUrl],
    [projectText("externalLinkLabel") || i18n.get("detail.projectPost"), project.externalUrl],
    [i18n.get("detail.demoVideo"), project.demoVideoUrl]
  ].filter(([, url]) => typeof url === "string" && url.trim());
  if (!availableLinks.length) return;

  const links = document.createElement("div");
  links.className = "detail-links";
  for (const [label, url] of availableLinks) {
    const link = document.createElement("a");
    link.href = url;
    link.textContent = label;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    links.append(link);
  }
  parent.append(links);
}

function addScreenshots(parent, project, i18n) {
  if (!Array.isArray(project.screenshots) || !project.screenshots.length) return;
  const section = document.createElement("section");
  section.className = "detail-section";
  addText(section, "h2", "", i18n.get("detail.screenshots"));
  const gallery = document.createElement("div");
  gallery.className = "detail-gallery";
  for (const screenshot of project.screenshots) {
    const item = typeof screenshot === "string" ? { src: screenshot } : screenshot;
    if (!item || !item.src) continue;
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt || `${project.title} project screenshot`;
    image.loading = "lazy";
    gallery.append(image);
  }
  if (gallery.children.length) {
    section.append(gallery);
    parent.append(section);
  }
}

async function renderProject() {
  const i18n = await window.wavantisLanguageReady;
  const translate = (key) => i18n?.get(key) || key;
  try {
    const response = await fetch(root.dataset.project);
    if (!response.ok) throw new Error("Project details could not be loaded.");
    const project = await response.json();
    const projectText = (key) => i18n.project(project, key);
    document.title = `${projectText("title")} — Wavantis`;
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (description) description.content = projectText("description") || translate("metadata.description");
    if (ogTitle) ogTitle.content = document.title;
    if (ogDescription) ogDescription.content = projectText("description") || translate("metadata.description");

    const intro = document.createElement("header");
    intro.className = "detail-hero section-shell";
    const headingGroup = document.createElement("div");
    addText(headingGroup, "p", "detail-category", projectText("category"));
    addText(headingGroup, "h1", "", projectText("title"));
    const role = document.createElement("div");
    if (projectText("type")) addText(role, "p", "detail-meta", projectText("type"));
    if (projectText("status")) addText(role, "p", "detail-status", projectText("status"));
    intro.append(headingGroup, role);
    root.append(intro);

    if (project.image) {
      const image = document.createElement("img");
      image.className = "detail-cover section-shell";
      image.src = project.image;
      image.alt = projectText("imageAlt") || `${projectText("title")} ${translate("detail.placeholder")}`;
      image.width = 1200;
      image.height = 720;
      root.append(image);
    }

    const content = document.createElement("div");
    content.className = "detail-content section-shell";
    const aside = document.createElement("aside");
    aside.className = "detail-aside";
    if (Array.isArray(project.technologies) && project.technologies.length) {
      addText(aside, "h2", "", translate("detail.technology"));
      const tags = document.createElement("ul");
      for (const technology of project.technologies) addText(tags, "li", "", technology);
      aside.append(tags);
    }

    const prose = document.createElement("div");
    prose.className = "detail-prose";
    addSection(prose, translate("detail.overview"), projectText("description"));
    addSection(prose, translate("detail.notes"), projectText("implementationNotes"));
    addSection(prose, translate("detail.problem"), projectText("problem"));
    addSection(prose, translate("detail.solution"), projectText("solution"));
    addListSection(prose, projectText("featureLabel") || translate("detail.features"), projectText("features"));
    addScreenshots(prose, project, i18n);
    addSection(prose, translate("detail.achievement"), projectText("achievement"), "detail-award");
    if (project.professional || project.isPrivate) {
      const note = document.createElement("p");
      note.className = "detail-note";
      note.textContent = translate("detail.confidential");
      prose.append(note);
    }
    addLinks(prose, project, i18n);
    content.append(aside, prose);
    root.append(content);
  } catch (error) {
    root.replaceChildren();
    addText(root, "p", "detail-error section-shell", translate("detail.error"));
    console.error(error);
  }
}

if (root) renderProject();