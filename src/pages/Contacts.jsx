import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useContacts from "../hooks/useContacts.jsx";
import ContactCard from "../components/ContactCard.jsx";

export default function Contacts() {
  const { contacts, loading, error, loadContacts } = useContacts();

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  return (
    <>
      <div className="contacts-header">
        <h1 className="page-title" style={{ margin: 0 }}>Contacts</h1>

        <Link to="/contacts/new" className="btn btn-primary">
          Add new
        </Link>
      </div>

      {loading ? <p>Loading contacts…</p> : null}

      {error ? (
        <div className="form-card" style={{ borderColor: "rgba(239,68,68,0.35)" }}>
          <strong style={{ color: "#b91c1c" }}>Error:</strong> {error}
        </div>
      ) : null}

      {!loading && !error && contacts.length === 0 ? (
        <p style={{ color: "rgba(15,23,42,0.68)" }}>
          No contacts yet. Click <strong>“Add new”</strong>.
        </p>
      ) : null}

      <section className="card-list">
        {contacts.map((c) => (
          <ContactCard key={c.id} contact={c} />
        ))}
      </section>
    </>
  );
}
