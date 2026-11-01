# Voca · Deutsch ↔ Spanisch

Ein Vokabeltrainer als statische Web-App – ohne Konto, Server oder externe Bibliotheken.

## Funktionen

- Excel (.xlsx) und CSV importieren; Spalten zuordnen und Überschrift auswählen.
- Zufällige Abfragen Deutsch → Spanisch, Spanisch → Deutsch oder gemischt.
- Antworten tippen, prüfen und Lösungen anzeigen.
- Alternative Lösungen durch `|` trennen.
- Akzente wahlweise streng prüfen; `ñ` bleibt immer eigenständig.
- Vokabeln lokal im Browser speichern; nach dem ersten Laden offline nutzbar.

## Auf GitHub Pages veröffentlichen

1. Ein Repository anlegen, zum Beispiel `voca`.
2. Alle Dateien dieses Ordners direkt in das Repository hochladen. `index.html` muss auf der obersten Ebene liegen.
3. Im Repository **Settings → Pages** öffnen.
4. Unter **Build and deployment → Source** die Option **Deploy from a branch** wählen.
5. Branch **main**, Ordner **/(root)** wählen und **Save** anklicken.
6. Nach der Veröffentlichung den von GitHub angezeigten Link öffnen.

Offizielle Anleitung: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Es ist kein Build-Schritt und kein Paketmanager nötig. Relative Dateipfade unterstützen auch Projektseiten unter `/voca/`.

## Als App verwenden

Die GitHub-Pages-Adresse im aktuellen Browser öffnen. Falls der Browser es unterstützt, über das Browsermenü installieren bzw. zum Home-Bildschirm hinzufügen. Offline-Nutzung setzt ein erfolgreiches erstes Laden voraus. Unterstützte Installationsfunktionen unterscheiden sich je nach Browser und Gerät.

## Dateiformat

Eine Beispiel-Datei liegt als `Voca_Beispiel.csv` bei.

```csv
Deutsch;Spanisch
Hallo;hola
Danke;gracias
Haus;casa
```

CSV muss UTF-8 verwenden. Komma, Semikolon und Tabulator werden unterstützt. Excel verwendet das erste Tabellenblatt und gespeicherte Zellwerte; passwortgeschützte Dateien werden nicht unterstützt. Unvollständige Zeilen werden ausgelassen. Maximale Dateigröße: 15 MB.

XLSX benötigt einen aktuellen Browser mit `DecompressionStream` und `deflate-raw`. Bei älteren Browsern die Tabelle als CSV speichern.

Groß-/Kleinschreibung und überzählige Leerzeichen werden ignoriert. Satzzeichen und Artikel zählen zur Antwort. „Lösung zeigen“ zählt als beantwortet, aber nicht richtig.

## Datenschutz

Importierte Tabellen werden im Browser verarbeitet und nicht hochgeladen. Die Vokabeln werden, soweit erlaubt, im lokalen Browserspeicher gespeichert. Es gibt keine Synchronisation zwischen Geräten. „Daten löschen“ entfernt die gespeicherten Vokabeln. GitHub stellt die App-Dateien bereit und verarbeitet dabei die üblichen Hosting-Anfragen.

## Lokal öffnen und prüfen

`index.html` direkt im aktuellen Browser öffnen. Service Worker und App-Installation benötigen HTTPS oder localhost. Der direkte Datei-Aufruf reicht zum Trainieren.

Prüfliste: Beispiel laden; korrekte und falsche Antwort prüfen; beide Richtungen testen; CSV und XLSX importieren; nach Neuladen lokale Speicherung prüfen; auf HTTPS nach erstem Laden Offline-Nutzung testen.

Stand der Prüfung: Paketstruktur, lokale Dateiverweise, Manifest und ZIP-Integrität geprüft. Interaktive Browser- und Gerätetests stehen noch aus.
