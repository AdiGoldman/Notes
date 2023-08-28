var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var addBox = document.querySelector('.add-box');
var popupBox = document.querySelector('.popup-box');
var popupTitle = popupBox.querySelector('header p');
var closeIcon = document.querySelector('header i');
var titleEl = document.querySelector('input');
var descEl = document.querySelector('textarea');
var addBtn = document.querySelector('button');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var notes = JSON.parse(localStorage.getItem('notes') || '[]');
var isUpdate = false;
var updateId;
var selectedBackground = "default";
document.getElementById('note-background').addEventListener('change', function (e) {
    selectedBackground = e.target.value;
});
function showNotes(notesToShow) {
    if (notesToShow === void 0) { notesToShow = notes; }
    document.querySelectorAll('.note').forEach(function (note) { return note.remove(); });
    notesToShow.forEach(function (note, index) {
        var bgClass = note.backgroundImage ? "bg-".concat(note.backgroundImage.replace('.jpg', '')) : 'bg-default';
        var liEl = "<li class=\"note ".concat(bgClass, "\">\n                        <div class=\"details\">\n                            <p>").concat(note.title, "</p>\n                            <span>").concat(note.description, "</span>\n                        </div>\n                        <div class=\"bottom-content\">\n                            <span>").concat(note.date, "</span>\n                            <div class=\"settings\">\n                                <i onClick=\"updateNote(").concat(index, ", '").concat(note.title, "', '").concat(note.description, "')\"  class=\"uil uil-edit\"></i>\n                                <i onClick=\"deleteNote(").concat(index, ")\" class=\"uil uil-trash\"></i>\n                            </div>\n                        </div>\n                    </li>");
        addBox.insertAdjacentHTML('afterend', liEl);
    });
}
showNotes();
function deleteNote(noteId) {
    var confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete)
        return;
    notes.splice(noteId, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    showNotes();
}
function updateNote(noteId, title, desc) {
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleEl.value = title;
    descEl.value = desc;
    addBtn.innerText = 'Edit Note';
    popupTitle.innerText = 'Edit Note';
}
addBox.addEventListener('click', function () {
    titleEl.focus();
    popupBox.classList.add('show');
});
closeIcon.addEventListener('click', function () {
    isUpdate = false;
    titleEl.value = '';
    descEl.value = '';
    addBtn.innerText = 'Add Note';
    popupTitle.innerText = 'Add a new Note';
    popupBox.classList.remove('show');
});
addBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var noteTitle = titleEl.value;
    var noteDesc = descEl.value;
    if (noteTitle || noteDesc) {
        var dateEl = new Date();
        var month = months[dateEl.getMonth()];
        var day = dateEl.getDate();
        var year = dateEl.getFullYear();
        var noteInfo = {
            title: noteTitle,
            description: noteDesc,
            date: "".concat(month, " ").concat(day, " ").concat(year),
            backgroundImage: selectedBackground
        };
        if (!isUpdate) {
            notes.push(noteInfo);
        }
        else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }
});
var searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', function () {
    var searchTerm = searchInput.value.toLowerCase();
    filterAndShowNotes(searchTerm);
});
function filterAndShowNotes(searchTerm) {
    var filteredNotes = notes.filter(function (note) {
        return note.title.toLowerCase().includes(searchTerm) ||
            note.description.toLowerCase().includes(searchTerm) ||
            note.date.toLowerCase().includes(searchTerm);
    });
    showNotes(filteredNotes);
}
var sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', function () {
    var selectedValue = sortSelect.value;
    if (selectedValue === 'alphabetical') {
        sortNotesAlphabetically();
    }
    else if (selectedValue === 'date') {
        sortNotesByDate();
    }
    else {
        showNotes();
    }
});
function sortNotesAlphabetically() {
    var sortedNotes = __spreadArray([], notes, true).sort(function (a, b) { return b.title.localeCompare(a.title); });
    showNotes(sortedNotes);
}
function sortNotesByDate() {
    var sortedNotes = __spreadArray([], notes, true).sort(function (a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });
    showNotes(sortedNotes);
}
