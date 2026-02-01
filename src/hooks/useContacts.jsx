import { useCallback } from "react";
import useGlobalReducer from "./useGlobalReducer.jsx";
import * as api from "../services/contactsApi.js";

export default function useContacts() {
  const { store, dispatch } = useGlobalReducer();

  const loadContacts = useCallback(async () => {
    dispatch({ type: "contacts/loading" });
    try {
      await api.ensureAgenda();
      const contacts = await api.getContacts();
      dispatch({ type: "contacts/loaded", payload: contacts });
      return contacts;
    } catch (e) {
      dispatch({ type: "contacts/error", payload: e?.message || "Failed to load contacts" });
      return [];
    }
  }, [dispatch]);

  const addContact = useCallback(
    async (contact) => {
      dispatch({ type: "contacts/saving" });
      try {
        const created = await api.createContact(contact);
        dispatch({ type: "contacts/added", payload: created });
        return created;
      } catch (e) {
        dispatch({ type: "contacts/error", payload: e?.message || "Failed to create contact" });
        return null;
      }
    },
    [dispatch]
  );

  const editContact = useCallback(
    async (id, contact) => {
      dispatch({ type: "contacts/saving" });
      try {
        const updated = await api.updateContact(id, contact);
        dispatch({ type: "contacts/updated", payload: updated });
        return updated;
      } catch (e) {
        dispatch({ type: "contacts/error", payload: e?.message || "Failed to update contact" });
        return null;
      }
    },
    [dispatch]
  );

  const removeContact = useCallback(
    async (id) => {
      dispatch({ type: "contacts/saving" });

      const safeId = String(id);
      if (!safeId || safeId === "undefined" || safeId === "null") {
        dispatch({ type: "contacts/error", payload: "Delete failed: missing contact id" });
        return false;
      }

      try {
        await api.ensureAgenda();
        await api.deleteContact(safeId);
        dispatch({ type: "contacts/deleted", payload: safeId });
        return true;
      } catch (e) {
        dispatch({ type: "contacts/error", payload: e?.message || "Failed to delete contact" });
        return false;
      }
    },
    [dispatch]
  );

  return {
    contacts: store.contacts,
    loading: store.contactsLoading,
    saving: store.contactsSaving,
    error: store.contactsError,
    loadContacts,
    addContact,
    editContact,
    removeContact
  };
}
