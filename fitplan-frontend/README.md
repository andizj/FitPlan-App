# FitPlan - Fitness-Trainingsplaner

FitPlan ist eine React-basierte Webanwendung zur Erstellung und Verwaltung von personalisierten Fitness-Trainingsplänen.

## Funktionen

- Benutzerregistrierung und -anmeldung
- Personalisierte Trainingspläne erstellen
- Übungsbibliothek mit detaillierten Beschreibungen
- Fortschrittsverfolgung
- Benachrichtigungssystem
- Responsive Design für mobile und Desktop-Geräte

## Voraussetzungen

- Node.js (Version 14 oder höher)
- npm (wird mit Node.js installiert)
- Git (optional)

## Installation

1. **Repository klonen oder ZIP-Datei entpacken**
   ```bash
   git clone [Repository-URL]
   # oder
   # ZIP-Datei entpacken
   ```

2. **In das Projektverzeichnis wechseln**
   ```bash
   cd fitplan-frontend
   ```

3. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

4. **Firebase-Konfiguration**
   - Öffnen Sie die Datei `src/firebase.js`
   - Ersetzen Sie die Firebase-Konfiguration mit Ihren eigenen Anmeldedaten:
   ```javascript
   const firebaseConfig = {
     apiKey: "Ihre-API-Key",
     authDomain: "Ihre-Auth-Domain",
     projectId: "Ihre-Project-ID",
     storageBucket: "Ihr-Storage-Bucket",
     messagingSenderId: "Ihre-Messaging-Sender-ID",
     appId: "Ihre-App-ID"
   };
   ```

5. **Anwendung starten**
   ```bash
   npm start
   ```
   Die Anwendung wird im Browser unter `http://localhost:3000` geöffnet.

## Projektstruktur

```
fitplan-frontend/
├── public/              # Statische Dateien
├── src/                 # Quellcode
│   ├── components/      # React-Komponenten
│   ├── firebase.js      # Firebase-Konfiguration
│   ├── App.js           # Hauptkomponente
│   └── index.js         # Einstiegspunkt
├── package.json         # Abhängigkeiten und Skripte
└── README.md            # Projektdokumentation
```

## Bekannte Probleme und Lösungen

### Port 3000 bereits belegt
Wenn der Port 3000 bereits verwendet wird, werden Sie gefragt, ob die Anwendung auf einem anderen Port gestartet werden soll. Wählen Sie "Y" für Ja.

### ESLint-Warnungen
Die aktuellen ESLint-Warnungen beeinträchtigen die Funktionalität nicht. Sie können ignoriert oder behoben werden.

## Firebase-Einrichtung

1. Erstellen Sie ein neues Projekt in der [Firebase Console](https://console.firebase.google.com/)
2. Aktivieren Sie Authentication und wählen Sie Email/Password und Google als Anmeldemethoden
3. Erstellen Sie eine Firestore-Datenbank
4. Kopieren Sie die Firebase-Konfiguration in die `firebase.js`-Datei

## Unterstützung

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository oder kontaktieren Sie den Entwickler.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
