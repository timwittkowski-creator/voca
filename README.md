# Voca · Deutsch ↔ Spanisch

Ein Vokabeltrainer als statische Web-App – ohne Konto, Server oder externe Bibliotheken.

## Lektionen & Aussprache (Entwicklung)

Dieser Zweig enthält die neue Lektionsverwaltung: Lektionen 1 bis 5 einzeln auswählen oder alle zusammen lernen, eigene Listen einer Lektion zuordnen, IPA-Lautschrift sehen und spanische Wörter per iOS-/Browser-Sprachausgabe anhören. Die Original-Lern- und Prüfungsmodi bleiben erhalten.

**Wichtig:** Die fünf Buchlektionen sind noch nicht befüllt, weil die fünf fotografierten Vokabellisten noch fehlen. Sobald die Fotos verfügbar und die Wörter geprüft sind, werden sie in `lessons-data.js` eingetragen. Eigene Listen können schon jetzt importiert und einer Lektion zugeordnet werden. Bitte keine ungeprüften Buchwörter erfinden.

**Aussprache:** IPA folgt standardmäßig europäischem Spanisch (`es-ES`). Die Lautschrift wird anhand der spanischen Schreibweise automatisch näherungsweise gebildet. Sie ist **keine** vollständig geprüfte phonetische Transkription und kann bei Eigennamen, Formulierungen und Sonderfällen fehlerhaft sein. Manuell importierte IPA-Einträge bleiben erhalten; fehlt eine IPA-Angabe, wird „Lautschrift noch nicht hinterlegt“ angezeigt. Der Lautsprecher nutzt die Sprachsynthese des Geräts; Stimme und Genauigkeit hängen von der iOS-/Browser-Konfiguration ab. Eine synthetische Stimme ist keine Audioaufnahme aus dem Buch.

**Hinweis:** Das GitHub-Repository ist öffentlich. Alle fest eingebauten Buchvokabeln sind damit öffentlich lesbar. Bitte kläre vor weiterer Veröffentlichung die Nutzungsrechte am Lehrbuchmaterial. Importierte eigene Wörter verbleiben lokal.

**CSV mit optionalen Spalten:** `Deutsch;Spanisch;Lektion;IPA`. Bei jeder neuen Tabelle kann die Lektion alternativ beim Import ausgewählt werden. Vorhandene `voca-pairs-v1`-Daten werden in das neue Format übernommen.

## Getestet auf dem Entwicklungszweig

Die fünf Datensätze wurden geladen und auf Vollständigkeit der Datenspalten kontrolliert. Alle 9 App-Skriptblöcke wurden auf JavaScript-Syntax geprüft; in einem simulierten Browser-DOM wurden der Lektionsfilter, das Vokabeltraining, alternative Antworten, Demo-Wörter und Lektionszuordnung beim Import durchgespielt. **Ein echter Test auf iPhone/Safari und die Freigabe für GitHub Pages sind noch offen.**

## Funktionen

- Vor dem Training zwischen Lernmodus und Prüfungsmodus wählen.
- Im Lernmodus Deutsch und Spanisch gemeinsam ansehen und mit Zurück/Weiter durch die Liste blättern.
- Im Prüfungsmodus die Übersetzung eingeben und kontrollieren lassen.

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
