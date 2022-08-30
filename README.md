# iiRDS Validation Tool

![iiRDS Logo](https://iirds.tekom.de/fileadmin/iiRDS_specification/20190712-1.0.1-release/images/logos/iiRDS.jpg)

## Verwendete Libraries und nützliche Links

### Webanwendung

- UI: [Vue.js v2](https://vuejs.org/v2/guide/)
- Komponenten: [Vuetify](https://vuetifyjs.com/en/components/lists/)
- Icons: [Material Design Icons](https://materialdesignicons.com/)
- Plattform: [plusmeta](https://help.plusmeta.de/de/Willkommen/)

### iiRDS-Generierung

- Zip: [JSZip](https://stuk.github.io/jszip/)
- RDF/XML: [xmlbuilder-js](https://github.com/oozcitak/xmlbuilder-js)

### Backend

- Build: [Vue CLI / Webpack](https://cli.vuejs.org/)
- Linting: [ESLint](https://eslint.org/)
- Transpiling: [Babel](https://babeljs.io/)
- Fehlerreporting: [Sentry (nicht aktiviert)](https://sentry.io/_/open-source/)

## Entwicklungsumgebung

### Voraussetzungen

- `git` ist installiert (Prüfen mit `git --version`, [Download](https://git-scm.com/downloads))
- `node`/`npm` ist installiert ([Download](https://nodejs.org/en/))
- VS Code ist installiert ([Download](https://code.visualstudio.com/))
  - alternativ ist natürlich auch jeder andere Editor möglich

### Einrichtung VS Code Erweiterungen

Folgende Erweiterungen **sollten** über die Ansicht "File > Preferences > Extensions" innerhalb von VS Code installiert werden:

- _GitLens_
- _ESLint_
- _Vetur_
- _Vue i18n Ally_

Folgende Erweiterungen **können** über die Ansicht "File > Preferences > Extensions" innerhalb von VS Code installiert werden:

- _German Language Pack for Visual Studio Code_
- _Beautify_
- _vuetify-vscode_

### Git-Authentifizierung

Eine der folgenden Möglichkeiten:

- Über VS Code HTTPS
  - Immer Eingabe von Benutzername/Kennwort in VS Code
  - Keine weiteren Tools notwendig
- Über systemweites SSH
  - Keine Eingabe von Benutzerinformationen notwendig
  - Public Key muss bei GitHub unter Account hinterlegt sein
  - Auf Windowssystemen ist die Installation von PuTTY notwendig

### Allgemeine Vorbereitung

Die folgenden Tools werden global installiert. Auf Linux/macOS-System ist unter Umständen die Installtion mit Root-Rechten erforderlich (`sudo`)

- Vue Command Line Tools (Vue CLI) installieren

```sh
npm install -g @vue/cli
```

- ESLint installieren

```sh
npm install -g eslint
```

## Installation

Nach erfolgreicher Git-Authentifizierung, folgende Aktionen in VS Code ausführen:

- VS Code im gewünschten Arbeitsverezeichnis öffnen (vorzugsweise `C:\Work`)
- CTRL-SHIFT-P (Befehlspalette)
- `Git: Klonen auswählen`
  - Die Adresse des Git-Repositories eingeben (endet mit `.git`)
  - Alternativ per SSH verbinden
- CTRL-SHIFT-Ö (neues Terminal)
- Sicherstellen, dass man sich im gewünschten Arbeitsverzeichnis befindet (`C:\Work\iirds-validation-tool`)
- `npm install`

## Lokale Instanz starten

Es gibt mehrere Möglichkeiten, eine lokale Instanz in VS Code zu starten:

- über die Seitenleiste "Explorer" im Reiter "NPM-Skripts" im Eintrag `serve` das Symbol ▷ wählen.
- über das integrierte Terminal den Befehl `vue ui` eingeben. In der sich öffnenden Web-Ansicht kann über die Aufgabe "serve" der Button "App öffnen" gewählt werden.

### Außerhalb von VS Code

- im Arbeitsverezichnis (`./iirds-validation-tool`) den Befehl `npm run-script serve` ausführen.

## Pull Request testen

Es gibt mehrere Möglichkeiten, lokal einen Pull Request (PR) zu testen.
Fast immer wird der Name des Branches benötigt, der dem PR zugeordnet ist. Dieser wird in Bitbucket in der PR-Ansicht angezeigt.

### Nur VS Code (über Befehlspalette)

- Befehl "Von allen Remotes holen" ausführen
- Befehl "Auschecken an..." ausführen
- PR-Branch suchen und auswählen
- Lokale Instanz starten (s.o.)

### Kommandozeile oder andere IDE

- `git fetch` ausführen
- `git checkout {PR-Branch}` ausführen
- `npm run-script serve` ausführen
- Testen
