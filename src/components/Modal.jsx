import React, { useEffect } from "react";
import styles from "./Modal.module.css";

function Modal({ open, onClose, children }) {
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // Modal nicht schließen bei Klick ins Fenster
        role="dialog"
        aria-modal="true"
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
