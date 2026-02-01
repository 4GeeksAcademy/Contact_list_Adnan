import React from "react";

export default function ConfirmModal({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="kc-modal-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="kc-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="kc-modal__title">{title}</h3>
        <p className="kc-modal__message">{message}</p>

        <div className="kc-modal__actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
