const API_BASE =
  import.meta.env.VITE_CONTACTS_API_BASE || "https://playground.4geeks.com/contact";

const AGENDA_SLUG =
  import.meta.env.VITE_CONTACTS_AGENDA_SLUG || "mantasha-contacts";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg =
      typeof data === "string"
        ? data
        : data?.detail?.[0]?.msg ||
          data?.detail ||
          data?.message ||
          data?.msg ||
          JSON.stringify(data);

    const err = new Error(msg || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    err.url = url;
    throw err;
  }

  return data;
}

let ensureAgendaPromise = null;

export function ensureAgenda() {
  if (ensureAgendaPromise) return ensureAgendaPromise;

  ensureAgendaPromise = (async () => {
    // Try GET first
    try {
      await request(`/agendas/${encodeURIComponent(AGENDA_SLUG)}`, { method: "GET" });
      return;
    } catch (_) {
      // create it
    }

    // Try POST create
    try {
      await request(`/agendas/${encodeURIComponent(AGENDA_SLUG)}`, { method: "POST" });
      return;
    } catch (e) {
      // already exists (some APIs return 400/409)
      if (e.status === 400 || e.status === 409) return;

      // if flaky 500, re-check with GET
      if (e.status === 500) {
        await request(`/agendas/${encodeURIComponent(AGENDA_SLUG)}`, { method: "GET" });
        return;
      }

      throw e;
    }
  })();

  return ensureAgendaPromise;
}

export async function getContacts() {
  const data = await request(`/agendas/${encodeURIComponent(AGENDA_SLUG)}/contacts`, {
    method: "GET"
  });
  return Array.isArray(data?.contacts) ? data.contacts : [];
}

export async function createContact(contact) {
  return await request(`/agendas/${encodeURIComponent(AGENDA_SLUG)}/contacts`, {
    method: "POST",
    body: JSON.stringify(contact)
  });
}

export async function updateContact(contactId, contact) {
  return await request(
    `/agendas/${encodeURIComponent(AGENDA_SLUG)}/contacts/${encodeURIComponent(contactId)}`,
    {
      method: "PUT",
      body: JSON.stringify(contact)
    }
  );
}

export async function deleteContact(contactId) {
  return await request(
    `/agendas/${encodeURIComponent(AGENDA_SLUG)}/contacts/${encodeURIComponent(contactId)}`,
    { method: "DELETE" }
  );
}
