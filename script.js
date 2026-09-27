const projectGrid = document.querySelector("#project-grid");

function appendText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function createProjectCard(project) {
  const article = document.createElement("article");
  article.className = "project-card";

  const link = document.createElement("a");
  link.className = "project-card-link";
  link.href = `projects/${encodeURIComponent(project.slug)}/`;
  link.setAttribute("aria-label", `View ${project.title} project details`);

  const imageWrap = document.createElement("div");
  imageWrap.className = "project-image-wrap";
  const image = document.createElement("img");
  image.src = `projects/${encodeURIComponent(project.slug)}/${project.image}`;
  image.alt = project.imageAlt || `${project.title} project media placeholder`;
  image.loading = "lazy";
  image.width = 1200;
  image.height = 720;
  imageWrap.append(image);
  link.append(imageWrap);

  const body = document.createElement("div");
  body.className = "project-card-body";
  const kicker = document.createElement("div");
  kicker.className = "project-kicker";
  appendText(kicker, "span", "", project.category);
  if (project.year) appendText(kicker, "span", "", project.year);
  if (project.professional || project.isPrivate) appendText(kicker, "span", "project-private", "Professional work");
  body.append(kicker);

  appendText(body, "h3", "project-title", project.title);
  appendText(body, "p", "project-description", project.description);

  if (Array.isArray(project.technologies) && project.technologies.length) {
    const tags = document.createElement("ul");
    tags.className = "project-tags";
    for (const technology of project.technologies) appendText(tags, "li", "", technology);
    body.append(tags);
  }

  const footer = document.createElement("div");
  footer.className = "project-card-foot";
  appendText(footer, "span", "", "Project details");
  appendText(footer, "span", "", "\u2197");
  body.append(footer);
  link.append(body);
  article.append(link);
  return article;
}

async function renderProjects() {
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
    for (const project of projects.filter((item) => item.featured !== false)) {
      projectGrid.append(createProjectCard(project));
    }
    if (!projectGrid.children.length) {
      appendText(projectGrid, "p", "project-status", "No featured projects are available yet.");
    }
  } catch (error) {
    projectGrid.replaceChildren();
    appendText(projectGrid, "p", "project-status", "Selected projects could not be loaded. Please try again later.");
    console.error(error);
  } finally {
    projectGrid.setAttribute("aria-busy", "false");
  }
}

if (projectGrid) renderProjects();