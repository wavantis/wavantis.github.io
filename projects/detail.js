const root = document.querySelector("#project-detail");

function addText(parent, tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
}

function addSection(parent, title, content) {
  if (!content) return;
  const section = document.createElement("section");
  section.className = "detail-section";
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

function addLinks(parent, project) {
  const availableLinks = [
    ["GitHub", project.githubUrl],
    ["Live demo", project.demoUrl],
    ["Case study", project.caseStudyUrl],
    [project.externalLinkLabel || "View project post ↗", project.externalUrl],
    ["Demo video", project.demoVideoUrl]
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

function addScreenshots(parent, project) {
  if (!Array.isArray(project.screenshots) || !project.screenshots.length) return;
  const section = document.createElement("section");
  section.className = "detail-section";
  addText(section, "h2", "", "Screenshots");
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
  try {
    const response = await fetch(root.dataset.project);
    if (!response.ok) throw new Error("Project details could not be loaded.");
    const project = await response.json();
    document.title = `${project.title} - Risnawan Budianto | Wavantis`;

    const intro = document.createElement("header");
    intro.className = "detail-hero section-shell";
    const headingGroup = document.createElement("div");
    addText(headingGroup, "p", "detail-category", project.category);
    addText(headingGroup, "h1", "", project.title);
    const role = document.createElement("div");
    if (project.role) addText(role, "p", "detail-role", project.role);
    if (project.team) addText(role, "p", "detail-meta", `Team: ${project.team}`);
    if (project.type) addText(role, "p", "detail-meta", project.type);
    if (project.status) addText(role, "p", "detail-status", project.status);
    intro.append(headingGroup, role);
    root.append(intro);

    if (project.image) {
      const image = document.createElement("img");
      image.className = "detail-cover section-shell";
      image.src = project.image;
      image.alt = project.imageAlt || `${project.title} project media`;
      image.width = 1200;
      image.height = 720;
      root.append(image);
    }

    const content = document.createElement("div");
    content.className = "detail-content section-shell";
    const aside = document.createElement("aside");
    aside.className = "detail-aside";
    if (Array.isArray(project.technologies) && project.technologies.length) {
      addText(aside, "h2", "", "Technology");
      const tags = document.createElement("ul");
      for (const technology of project.technologies) addText(tags, "li", "", technology);
      aside.append(tags);
    }

    const prose = document.createElement("div");
    prose.className = "detail-prose";
    addSection(prose, "Overview", project.description);
    addSection(prose, "My contribution", project.contribution);
    addSection(prose, "Problem", project.problem);
    addSection(prose, "Solution", project.solution);
    addListSection(prose, "Team", project.teamComposition);
    addListSection(prose, project.featureLabel || "Features", project.features);
    addScreenshots(prose, project);
    addSection(prose, "Achievement", project.achievement);
    if (project.professional || project.isPrivate) {
      const note = document.createElement("p");
      note.className = "detail-note";
      note.textContent = "Some project details and source code cannot be publicly shared due to proprietary or confidentiality restrictions.";
      prose.append(note);
    }
    addLinks(prose, project);
    content.append(aside, prose);
    root.append(content);
  } catch (error) {
    root.replaceChildren();
    addText(root, "p", "detail-error section-shell", "Project details are not available right now.");
    console.error(error);
  }
}

if (root) renderProject();