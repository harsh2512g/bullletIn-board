import React, { useState } from "react";
import StickyNote from "./StickyNote";
import "./styles.css";
function BulletinBoard() {
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: "",
      x: 100,
      y: 100,
      isPinned: false,
      isNew: true, // flag to indicate a new note
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (id, newText) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  const pinNote = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  const moveNote = (id, newX, newY) => {
    const movingNote = notes.find((note) => note.id === id);
    if (movingNote.isPinned) {
      return; // Do not move if the note is pinned
    }

    for (let note of notes) {
      if (note.isPinned) {
        // Check if the moving note overlaps with this pinned note
        if (isOverlapping(newX, newY, note)) {
          return; // Do not update position if overlapping
        }
      }
    }

    // Update position if no overlap
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, x: newX, y: newY } : note
      )
    );
  };

  const isOverlapping = (newX, newY, otherNote) => {
    // Define the size of each note (assuming all notes have the same size)
    const NOTE_WIDTH = 200;
    const NOTE_HEIGHT = 200;

    return (
      newX < otherNote.x + NOTE_WIDTH &&
      newX + NOTE_WIDTH > otherNote.x &&
      newY < otherNote.y + NOTE_HEIGHT &&
      newY + NOTE_HEIGHT > otherNote.y
    );
  };

  return (
    <div>
      <button onClick={addNote}>+</button>
      <div className="bulletin-board">
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            content={note}
            onDelete={deleteNote}
            onEdit={(id, text) => {
              editNote(id, text);
              // After first edit, set isNew to false
              setNotes(
                notes.map((n) => (n.id === id ? { ...n, isNew: false } : n))
              );
            }}
            onPin={pinNote}
            isPinned={note.isPinned}
            onMove={moveNote}
            isNew={note.isNew}
          />
        ))}
      </div>
    </div>
  );
}

export default BulletinBoard;
