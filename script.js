
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

const STORAGE_KEY = "quicknotes-notes";

function loadNotes() {
    try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);

        if (savedNotes === null) {
            return [];
        }

        const parsedNotes = JSON.parse(savedNotes);

        if (!Array.isArray(parsedNotes)) {
            return [];
        }

        return parsedNotes.filter((note) =>
            note &&
            typeof note.id === "number" &&
            typeof note.text === "string" &&
            ["personal", "work", "study"].includes(note.category) &&
            typeof note.createdAt === "string"
        );
    } catch (error) {
        console.error("Could not load saved notes:", error);
        return [];
    }
}

let notes = loadNotes();

function saveNotes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
        console.error("Could not save notes:", error);
        errorMessage.textContent =
            "Your notes could not be saved in this browser.";
    }
}

function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function render() {
    notesList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter((note) =>
        note.text.toLowerCase().includes(searchTerm)
    );

    if (filteredNotes.length === 0 && searchTerm !== "") {
        const message = document.createElement("li");
        message.classList.add("empty-message");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
    } else {
        filteredNotes.forEach((note) => {
            const listItem = document.createElement("li");
            listItem.classList.add(
                "note-card",
                `category-${note.category}`
            );

            const text = document.createElement("p");
            text.classList.add("note-text");
            text.textContent = note.text;

            const categoryLabel = document.createElement("span");
            categoryLabel.classList.add(
                "category-label",
                `category-${note.category}`
            );

            categoryLabel.textContent =
                note.category.charAt(0).toUpperCase() +
                note.category.slice(1);

            const date = document.createElement("small");
            date.classList.add("note-date");
            date.textContent = `Created: ${note.createdAt}`;

            const meta = document.createElement("div");
            meta.classList.add("note-meta");

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.classList.add("delete-btn");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {
                deleteNote(note.id);
            });

            meta.appendChild(categoryLabel);
            meta.appendChild(deleteButton);

            listItem.appendChild(text);
            listItem.appendChild(meta);
            listItem.appendChild(date);

            notesList.appendChild(listItem);
        });
    }

    updateCount();
}

function addNote(text, category) {
    const note = {
        id: Date.now() + Math.random(),
        text: text.trim(),
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);
    saveNotes();
    render();
}

function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
    saveNotes();
    render();
}

noteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    if (!["personal", "work", "study"].includes(noteCategory.value)) {
        errorMessage.textContent = "Please select a valid category.";
        return;
    }

    addNote(text, noteCategory.value);

    noteInput.value = "";
    errorMessage.textContent = "";
    noteInput.focus();
});

searchInput.addEventListener("input", render);

render();