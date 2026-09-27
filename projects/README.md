# Adding a project

1. Create a folder under `projects/` and copy `_template/index.html` into it. The folder name becomes the project slug and public route, for example `projects/new-app/`.
2. Add `project.json` with `slug`, `title`, `category`, `description`, `technologies`, `image`, `imageAlt`, `screenshots`, and `featured`. Optional fields include `type`, `year`, `role`, `team`, `teamComposition`, `status`, `contribution`, `problem`, `solution`, `features`, `featureLabel`, `achievement`, `highlighted`, `professional`, `isPrivate`, `githubUrl`, `demoUrl`, `demoVideoUrl`, `caseStudyUrl`, `externalUrl`, and `externalLinkLabel`. Omit fields that are not known or implemented.
3. Add an approved `cover.svg` or image and put future screenshots in a `screenshots/` subfolder. List screenshot paths and meaningful alt text in `project.json`.
4. Add the folder slug to `manifest.json` to show the project on the home page. Set `featured` to `false` to keep it off the featured list.
5. Update the copied page's title, description, Open Graph text, and canonical URL. The body layout is shared through `detail.js` and `styles.css`.

Use one of these values for `type`: `Professional Experience`, `Personal Project`, `Freelance Project`, `Award-Winning Project`, `Prototype / MVP`, or `Open Source`. Use `status` for a short state such as `Planned prototype`; when listing unimplemented capabilities, set `featureLabel` to `Planned scope`.

Set `highlighted` to `true` for the lead project card. Set `externalUrl` and `externalLinkLabel` for a relevant public project post; the detail page opens external links in a new tab. `demoVideoUrl` adds an optional video link.

Only publish project information and media that you are authorized to share. Professional or private projects automatically display a confidentiality note. Place actual screenshots in the project `screenshots/` folder; never use a placeholder as if it were a real screenshot.