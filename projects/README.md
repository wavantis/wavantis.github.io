# Adding a project

1. Create a folder under `projects/` and copy `_template/index.html` into it. The folder name becomes the project slug and public route, for example `projects/new-app/`.
2. Add `project.json` with the fields used by the project pages: `slug`, `title`, `category`, `role`, `description`, `technologies`, `image`, `imageAlt`, `screenshots`, `featured`, `professional`, and `isPrivate`. Optional fields include `year`, `team`, `contribution`, `problem`, `solution`, `features`, `achievement`, `githubUrl`, `demoUrl`, and `caseStudyUrl`. Omit fields that are not known.
3. Add an approved `cover.svg` or image and put future screenshots in a `screenshots/` subfolder. List screenshot paths and meaningful alt text in `project.json`.
4. Add the folder slug to `manifest.json` to show the project on the home page. Set `featured` to `false` to keep it off the featured list.
5. Update the copied page's title, description, Open Graph text, and canonical URL. The body layout is shared through `detail.js` and `styles.css`.

Only publish project information and media that you are authorized to share. Professional or private projects automatically display a confidentiality note.