import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
function StickyNote({
  id,
  content,
  onDelete,
  onEdit,
  onPin,
  isPinned,
  onMove,
  isNew,
}) {
  const [isEditing, setEditing] = useState(isNew);
  const [noteText, setNoteText] = useState(content.text);
  const noteRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const textareaRef = useRef(null);
  const startDrag = (e) => {
    if (!isPinned) {
      startPos.current = {
        x: e.clientX - noteRef.current.offsetLeft,
        y: e.clientY - noteRef.current.offsetTop,
      };
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
    }
  };

  const onDrag = (e) => {
    const newX = e.clientX - startPos.current.x;
    const newY = e.clientY - startPos.current.y;
    onMove(id, newX, newY);
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(0, 0); // Set cursor at the beginning
    }
  }, [isEditing]);
  useEffect(() => {
    if (isNew) {
      setEditing(true);
    }
  }, [isNew]);
  const handleEdit = () => {
    if (!isPinned) {
      setEditing(true);
    }
  };

  const handleDoubleClick = () => {
    if (!isPinned) {
      setEditing(true);
    }
  };

  const handleBlur = () => {
    setEditing(false);
    if (noteText.trim() === "") {
      onDelete(id);
    } else {
      onEdit(id, noteText);
    }
  };

  const handleChange = (e) => {
    setNoteText(e.target.value);
  };

  return (
    <div
      ref={noteRef}
      className="sticky-note"
      style={{
        position: "absolute",
        left: `${content.x}px`,
        top: `${content.y}px`,
      }}
      onMouseDown={startDrag}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          value={noteText}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div>{noteText}</div>
      )}
      <button onClick={() => onDelete(id)}>X</button>
      <button onClick={() => onPin(id)}>{isPinned ? "Unpin" : "Pin"}</button>
      {!isEditing && <button onClick={handleEdit}>Edit</button>}
    </div>
  );
}
export default StickyNote;
