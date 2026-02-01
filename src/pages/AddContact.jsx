import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useContacts from "../hooks/useContacts.jsx";

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function AddContact() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editingId = useMemo(() => (id ? String(id) : null), [id]);

  const { contacts, loading, saving, error, loadContacts, addContact, editContact } = useContacts();
  const [form, setForm] = useState(emptyForm);

  // If user lands directly on edit URL, load contacts
  useEffect(() => {
    if (editingId && contacts.length === 0 && !loading) loadContacts();
  }, [editingId, contacts.length, loading, loadContacts]);

  // Populate form when editing
  useEffect(() => {
    if (!editingId) return;
    const match = contacts.find((c) => String(c.id) === editingId);
    if (match) {
      setForm({
        name: match.name || "",
        email: match.email || "",
        phone: match.phone || "",
        address: match.address || ""
      });
    }
  }, [editingId, contacts]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim()
    };

    if (!payload.name) return;

    if (editingId) {
      const updated = await editContact(editingId, payload);
      if (!updated) return;
    } else {
      const created = await addContact(payload);
      if (!created) return;
    }

    navigate("/contacts");
  };

  return (
    <>
      <h1 className="page-title">{editingId ? "Edit Contact" : "Add Contact"}</h1>

      {error ? (
        <div className="form-card" style={{ borderColor: "rgba(239,68,68,0.35)" }}>
          <strong style={{ color: "#b91c1c" }}>Error:</strong> {error}
        </div>
      ) : null}

      <form className="form-card" onSubmit={onSubmit}>
        <label className="field">
          Name *
          <input className="input" name="name" value={form.name} onChange={onChange} required />
        </label>

        <label className="field">
          Email
          <input className="input" name="email" type="email" value={form.email} onChange={onChange} />
        </label>

        <label className="field">
          Phone
          <input className="input" name="phone" value={form.phone} onChange={onChange} />
        </label>

        <label className="field">
          Address
          <input className="input" name="address" value={form.address} onChange={onChange} />
        </label>

        <div className="form-actions">
          <Link to="/contacts" className="btn">
            Cancel
          </Link>

          <button type="submit" className="btn btn-primary" disabled={saving || !form.name.trim()}>
            {saving ? "Saving…" : editingId ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </>
  );
}
