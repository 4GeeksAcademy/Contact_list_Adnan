import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmModal from "./ConfirmModal.jsx";
import useContacts from "../hooks/useContacts.jsx";

function avatarUrl(contact) {
  const seedStr = contact.email || contact.name || String(contact.id);
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  const img = (hash % 70) + 1;
  return `https://i.pravatar.cc/150?img=${img}`;
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20h9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M8 6V4h8v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 6l-1 14H6L5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v6M14 11v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ContactCard({ contact }) {
  const { removeContact, saving } = useContacts();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const imgSrc = useMemo(() => avatarUrl(contact), [contact]);

  const handleDelete = async () => {
    const ok = await removeContact(contact.id);
    if (ok) setConfirmOpen(false);
  };

  return (
    <article className="contact-card">
      <img className="avatar" src={imgSrc} alt={`${contact.name} avatar`} />

      <div>
        <h4 className="contact-name">{contact.name}</h4>
        <div className="contact-meta">
          {contact.email ? <div>{contact.email}</div> : null}
          {contact.phone ? <div>Phone: {contact.phone}</div> : null}
          {contact.address ? <div>Address: {contact.address}</div> : null}
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/contacts/${contact.id}/edit`} className="icon-btn" aria-label="Edit" title="Edit">
          <EditIcon />
        </Link>

        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label="Delete"
          title="Delete"
          onClick={() => setConfirmOpen(true)}
          disabled={saving}
        >
          <TrashIcon />
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete contact?"
        message={`This will permanently delete "${contact.name}".`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </article>
  );
}
