export const initialStore = () => ({
  contacts: [],
  contactsLoading: false,
  contactsSaving: false,
  contactsError: null
});

export const storeReducer = (store, action) => {
  switch (action.type) {
    case "contacts/loading":
      return { ...store, contactsLoading: true, contactsError: null };

    case "contacts/saving":
      return { ...store, contactsSaving: true, contactsError: null };

    case "contacts/loaded":
      return {
        ...store,
        contactsLoading: false,
        contactsSaving: false,
        contactsError: null,
        contacts: Array.isArray(action.payload) ? action.payload : []
      };

    case "contacts/added":
      return {
        ...store,
        contactsSaving: false,
        contactsError: null,
        contacts: [action.payload, ...store.contacts]
      };

    case "contacts/updated": {
      const updated = action.payload;
      return {
        ...store,
        contactsSaving: false,
        contactsError: null,
        contacts: store.contacts.map((c) =>
          String(c.id) === String(updated.id) ? updated : c
        )
      };
    }

    case "contacts/deleted":
      return {
        ...store,
        contactsSaving: false,
        contactsError: null,
        contacts: store.contacts.filter((c) => String(c.id) !== String(action.payload))
      };

    case "contacts/error":
      return {
        ...store,
        contactsLoading: false,
        contactsSaving: false,
        contactsError: action.payload || "Unknown error"
      };

    default:
      return store;
  }
};
