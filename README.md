# Flashcard Generator App

A simple web app built with React to create, manage, and study flashcards. All flashcards are saved directly in the browser using Redux and LocalStorage.

---

## Simple Architecture

```
+--------------------------------------------------------+
|                     React UI Pages                     |
|  (Create Flashcard  |  My Flashcards  |  Deck Details) |
+--------------------------------------------------------+
                           |
                           | Dispatch actions
                           v
+--------------------------------------------------------+
|                  Redux Store & Slice                   |
|               (add, delete, update, search)            |
+--------------------------------------------------------+
                           |
                           | Auto-sync subscriber
                           v
+--------------------------------------------------------+
|                  Browser LocalStorage                  |
|                 (Saves data permanently)               |
+--------------------------------------------------------+
```

---

## What It Does (Features)

1. **Create Flashcards**:
   - Add group name, description, and an optional cover image.
   - Add multiple terms with definitions and optional images.
   - Form validation using Formik and Yup so you don't submit empty cards.

2. **My Flashcards (Library)**:
   - View all your saved decks in a clean grid.
   - Search bar to filter decks by title, description, or term words.
   - Delete decks with a confirmation popup.

3. **Study Deck (Carousel & Details)**:
   - Click any deck or "Study Deck" to open it.
   - Left sidebar to select any term directly.
   - Flashcard viewer in the center with Previous (`<`) and Next (`>`) buttons.
   - Keyboard navigation using Left (`←`) and Right (`→`) arrow keys.
   - Share modal to copy the link or share via WhatsApp, Twitter, LinkedIn, and Email.
   - Print or save all cards as PDF with clean print view (`Ctrl+P` / Print button).

---

## Tech Stack

- **Frontend**: React + Vite
- **Routing**: React Router DOM (v7)
- **State Management**: Redux Toolkit & React-Redux
- **Storage**: Browser LocalStorage
- **Forms & Validation**: Formik + Yup
- **Styling**: Tailwind CSS
- **Icons**: React Icons

---

## Project Structure

```
src/
├── components/       # Layout and Navbar components
├── pages/            # CreateFlashcard, MyFlashcards, FlashcardDetails
├── redux/            # store.js, flashcardSlice.js, localStorage.js
├── App.jsx           # Routes setup
├── main.jsx          # App root with Redux Provider
└── index.css         # Tailwind and custom styling
```

---

## How to Run the Project

1. Clone the repo and navigate into the folder:
   ```bash
   cd redux-thunk-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open the browser at the local link shown in terminal (usually `http://localhost:5173`).
