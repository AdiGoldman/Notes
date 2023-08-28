const addBox = document.querySelector('.add-box') as HTMLElement;
const popupBox = document.querySelector('.popup-box') as HTMLElement;
const popupTitle = popupBox.querySelector('header p') as HTMLElement;
const closeIcon = document.querySelector('header i') as HTMLElement;
const titleEl = document.querySelector('input') as HTMLInputElement;
const descEl = document.querySelector('textarea') as HTMLTextAreaElement;
const addBtn = document.querySelector('button') as HTMLButtonElement;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Note {
    title: string;
    description: string;
    date: string;
    backgroundImage: string;
}

const notes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');
let isUpdate = false;
let updateId: number;

let selectedBackground = "default";

document.getElementById('note-background')!.addEventListener('change', (e) => {
    selectedBackground = (e.target as HTMLSelectElement).value;
});

function showNotes(notesToShow: Note[] = notes): void {
    document.querySelectorAll('.note').forEach(note => note.remove());
    notesToShow.forEach((note, index) => {
        let bgClass = note.backgroundImage ? `bg-${note.backgroundImage.replace('.jpg', '')}` : 'bg-default';
        let liEl = `<li class="note ${bgClass}">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onClick="updateNote(${index}, '${note.title}', '${note.description}')"  class="uil uil-edit"></i>
                                <i onClick="deleteNote(${index})" class="uil uil-trash"></i>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML('afterend', liEl);
    });
}

showNotes();

function deleteNote(noteId: number): void {
    let confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;
    notes.splice(noteId, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId: number, title: string, desc: string): void {
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleEl.value = title;
    descEl.value = desc;
    addBtn.innerText = 'Edit Note';
    popupTitle.innerText = 'Edit Note';
}

addBox.addEventListener('click', () => {
    titleEl.focus();
    popupBox.classList.add('show');
});

closeIcon.addEventListener('click', () => {
    isUpdate = false;
    titleEl.value = '';
    descEl.value = '';
    addBtn.innerText = 'Add Note';
    popupTitle.innerText = 'Add a new Note';
    popupBox.classList.remove('show');
});

addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let noteTitle = titleEl.value;
    let noteDesc = descEl.value;
    if (noteTitle || noteDesc) {
        let dateEl = new Date();
        let month = months[dateEl.getMonth()];
        let day = dateEl.getDate();
        let year = dateEl.getFullYear();

        let noteInfo: Note = {
            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day} ${year}`,
            backgroundImage: selectedBackground
        };
        if (!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }

        localStorage.setItem('notes', JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }
});

const searchInput = document.getElementById('search-input') as HTMLInputElement;
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    filterAndShowNotes(searchTerm);
});

function filterAndShowNotes(searchTerm: string): void {
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.description.toLowerCase().includes(searchTerm) ||
        note.date.toLowerCase().includes(searchTerm)
    );

    showNotes(filteredNotes);
}

const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;

sortSelect.addEventListener('change', () => {
    const selectedValue = sortSelect.value;

    if (selectedValue === 'alphabetical') {
        sortNotesAlphabetically();
    } else if (selectedValue === 'date') {
        sortNotesByDate();
    } else {
        showNotes();
    }
});

function sortNotesAlphabetically(): void {
    const sortedNotes: Note[] = [...notes].sort((a, b) => b.title.localeCompare(a.title));
    showNotes(sortedNotes);
}

function sortNotesByDate(): void {
    const sortedNotes = [...notes].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });
    showNotes(sortedNotes);
}