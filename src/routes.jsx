import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import { Demo } from "./pages/Demo.jsx";
import { Home } from "./pages/Home.jsx";
import { Layout } from "./pages/Layout.jsx";
import { Single } from "./pages/Single.jsx";

import Contacts from "./pages/Contacts.jsx";
import AddContact from "./pages/AddContact.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Make Contacts the main page for this project */}
      <Route index element={<Contacts />} />

      {/* Contacts CRUD */}
      <Route path="contacts" element={<Contacts />} />
      <Route path="contacts/new" element={<AddContact />} />
      <Route path="contacts/:id/edit" element={<AddContact />} />

      {/* Keep template routes if you want */}
      <Route path="home" element={<Home />} />
      <Route path="demo" element={<Demo />} />
      <Route path="single/:theid" element={<Single />} />
    </Route>
  )
);
