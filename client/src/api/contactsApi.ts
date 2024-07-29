import { Contact } from "../types";

export const getContacts = async () => {
  const resp = await fetch("http://localhost:3000/contacts");
  const respJson = await resp.json();
  if (respJson.error) {
    throw respJson.error;
  }
  return respJson.contacts as Contact[];
};

export const getContactById = async (uuid: string) => {
  const contacts = await getContacts();
  const contact = contacts.find((item) => {
    return item.login.uuid === uuid;
  });
  if (!contact) {
    throw new Error('Contact Not Found');
  }
  return contact;
};

export const createContact = async (contact: Partial<Contact>) => {
  const resp = await fetch("http://localhost:3000/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  const contactResp = await resp.json();
  if (contactResp.error) {
    throw contactResp.error;
  }
  return contactResp.contact as Contact;
};

export const deleteContact = async (contactId: string) => {
  const resp = await fetch(`http://localhost:3000/contacts/${contactId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const contactResp = await resp.json();
  if (contactResp.error) {
    throw contactResp.error;
  }
  return contactResp as Contact;
};
