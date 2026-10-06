
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = [];

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

            const noteText = document.createElement("p");
            noteText.classList.add("note-text");
            noteText.textContent = note.text;

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

            listItem.appendChild(noteText);
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
    render();
}

function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
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

    addNote(text, noteCategory.value);

    noteInput.value = "";
    errorMessage.textContent = "";
    noteInput.focus();
});

searchInput.addEventListener("input", render);

// Temporary count function; refined in Task 4.
function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

render();