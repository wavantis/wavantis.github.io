const projectGrid = document.querySelector("#project-grid");

function appendText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function createProjectCard(project, index, i18n) {
  const projectText = (key) => i18n.project(project, key);
  const article = document.createElement("article");
  article.className = project.highlighted ? "project-card project-card-highlighted" : "project-card";

  const link = document.createElement("a");
  link.className = "project-card-link";
  link.href = `projects/${encodeURIComponent(project.slug)}/`;
  link.setAttribute("aria-label", `${i18n.get("projects.details")}: ${projectText("title")}`);

  const imageWrap = document.createElement("div");
  imageWrap.className = "project-image-wrap";
  const image = document.createElement("img");
  image.src = `projects/${encodeURIComponent(project.slug)}/${project.image}`;
  image.alt = projectText("imageAlt") || `${projectText("title")} ${i18n.get("detail.placeholder")}`;
  image.loading = "lazy";
  image.width = 1200;
  image.height = 720;
  imageWrap.append(image);
  link.append(imageWrap);

  const body = document.createElement("div");
  body.className = "project-card-body";
  const kicker = document.createElement("div");
  kicker.className = "project-kicker";
  appendText(kicker, "span", "project-order", String(index + 1).padStart(2, "0"));
  appendText(kicker, "span", "", projectText("category"));
  if (projectText("type")) appendText(kicker, "span", "project-type", projectText("type"));
  if (project.year) appendText(kicker, "span", "", project.year);
  if (projectText("status")) appendText(kicker, "span", "project-status-label", projectText("status"));
  if (project.professional || project.isPrivate) appendText(kicker, "span", "project-private", i18n.get("projects.professional"));
  body.append(kicker);

  appendText(body, "h3", "project-title", projectText("title"));
  appendText(body, "p", "project-description", projectText("description"));
  if (projectText("achievement")) appendText(body, "p", "project-achievement", `🏆 ${projectText("achievement")}`);

  const technologies = projectText("technologies") || project.technologies;
  if (Array.isArray(technologies) && technologies.length) {
    const tags = document.createElement("ul");
    tags.className = "project-tags";
    for (const technology of technologies) appendText(tags, "li", "", technology);
    body.append(tags);
  }

  const footer = document.createElement("div");
  footer.className = "project-card-foot";
  appendText(footer, "span", "", i18n.get("projects.details"));
  appendText(footer, "span", "", "\u2197");
  body.append(footer);
  link.append(body);
  article.append(link);
  return article;
}

async function renderProjects() {
  const i18n = await window.wavantisLanguageReady;
  const translate = (key) => i18n?.get(key) || key;
  try {
    const manifestResponse = await fetch("projects/manifest.json");
    if (!manifestResponse.ok) throw new Error("Project list could not be loaded.");
    const manifest = await manifestResponse.json();
    const projects = await Promise.all(manifest.projects.map(async (slug) => {
      const response = await fetch(`projects/${encodeURIComponent(slug)}/project.json`);
      if (!response.ok) throw new Error(`Project data could not be loaded: ${slug}`);
      return response.json();
    }));

    projectGrid.replaceChildren();
    const featuredProjects = projects.filter((item) => item.featured !== false);
    for (const [index, project] of featuredProjects.entries()) {
      projectGrid.append(createProjectCard(project, index, i18n));
    }
    if (!projectGrid.children.length) {
      appendText(projectGrid, "p", "project-status", translate("projects.empty"));
    }
  } catch (error) {
    projectGrid.replaceChildren();
    appendText(projectGrid, "p", "project-status", translate("projects.error"));
    console.error(error);
  } finally {
    projectGrid.setAttribute("aria-busy", "false");
  }
}

if (projectGrid) renderProjects();