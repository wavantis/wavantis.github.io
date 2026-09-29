# Adding a project

1. Create a folder under `projects/` and copy `_template/index.html` into it. The folder name becomes the project slug and public route, for example `projects/new-app/`.
2. Add `project.json` with stable fields `slug`, `technologies`, `image`, `screenshots`, and `featured`. Keep user-facing content in `translations.id` and `translations.en` with `title`, `category`, `type`, `status`, `description`, `implementationNotes`, `features`, `featureLabel`, `achievement`, and `imageAlt`. Existing flat fields remain supported as a fallback for older records. Optional stable fields include `year`, `highlighted`, `professional`, `isPrivate`, `githubUrl`, `demoUrl`, `demoVideoUrl`, `caseStudyUrl`, `externalUrl`, and `externalLinkLabel`.
3. Add an approved `cover.svg` or image and put future screenshots in a `screenshots/` subfolder. List screenshot paths and meaningful alt text in `project.json`.
4. Add the folder slug to `manifest.json` to show the project on the home page. Set `featured` to `false` to keep it off the featured list.
5. Update the copied page's title, description, Open Graph text, and canonical URL. The body layout is shared through `detail.js` and `styles.css`.

Use concise project categories that accurately describe the work, such as `Portfolio Project`, `Award-Winning Project`, `Prototype / MVP`, or `Open Source`. Use `status` for a short state such as `Portfolio Project — concept`; when listing unimplemented capabilities, set `featureLabel` to `Planned scope`.

Set `highlighted` to `true` for the lead project card. Set `externalUrl` and `externalLinkLabel` for a relevant public project post; the detail page opens external links in a new tab. `demoVideoUrl` adds an optional video link.

Only publish project information and media that you are authorized to share. Professional or private projects automatically display a confidentiality note. Place actual screenshots in the project `screenshots/` folder; never use a placeholder as if it were a real screenshot.

The homepage defaults to Indonesian (`id`). The shared `i18n.js` module loads `locales/id.json` or `locales/en.json`, updates shared labels and metadata, and persists the selected value under `wavantis-language`. Project detail routes load the same locale state, so navigation keeps the selected language.