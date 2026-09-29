# Wavantis

Software Development Studio focused on practical mobile, web, backend, and integrated software projects. The website presents selected work without representing an invented team or company scale.

## Local preview

Serve this folder with any static HTTP server, then open its local URL. For example, with Python installed, run `python -m http.server 8000` from the repository root and open `http://localhost:8000`.

## Projects

The default language is Bahasa Indonesia. Use the `ID / EN` switcher to change language; the choice is stored in localStorage under `wavantis-language`.

Project cards are listed in `projects/manifest.json`; each project has its content and media in its own folder. Project text can be translated through the `translations.id` and `translations.en` objects. See [`projects/README.md`](projects/README.md) for the project data fields, locale behavior, route template, and steps to add a project.
