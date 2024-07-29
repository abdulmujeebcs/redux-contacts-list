import { Link } from "react-router-dom";
import { FormEventHandler, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createContactThunk, deleteContactThunk, getContactsThunk, selectContactsList } from "../store/contactsSlice";

const ContactsPage = () => {
  const contacts = useAppSelector(selectContactsList);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(getContactsThunk());
  }, []);


  const createContactHandler: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    const target = ev.target as HTMLFormElement;
    const formData = new FormData(target);
    const first = formData.get('first')?.toString();
    const last = formData.get('last')?.toString();
    const email = formData.get('email')?.toString();
    if (!email || !first || !last) {
      throw new Error('First name, last name, and email are required');
    }

    dispatch(createContactThunk({
      name: {
        first,
        last
      },
      email
    }))
    .unwrap().then((contact) => {
      target.reset();
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <form onSubmit={createContactHandler} className="flex flex-col gap-4 items-center">
        <h2 className="text-center text-lg">Add new contact</h2>
        <label htmlFor="firstName" className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">First name</span>
          </div>
          <input
            name="first"
            id="firstName"
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
        </label>

        <label htmlFor="lastName" className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Last name</span>
          </div>
          <input
            name="last"
            id="lastName"
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
        </label>

        <label htmlFor="email" className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            name="email"
            id="email"
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <button className="btn btn-primary btn-outline max-w-xs">
          Submit{" "}
        </button>
      </form>

      <section className="md:col-span-2">
        <h1 className="text-center text-lg">Contacts List</h1>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                return (
                  <tr key={contact.login.uuid}>
                    <td>
                      <Link to={`/contacts/${contact.login.uuid}`}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`avatar ${contact.picture ? "" : "placeholder"}`}
                          >
                            {contact.picture ? (
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={contact.picture.thumbnail}
                                  alt="Avatar Tailwind CSS Component"
                                />
                              </div>
                            ) : (
                              <div className="bg-neutral text-neutral-content rounded-full w-12">
                                <span className="uppercase">
                                  {contact.name.first[0]}
                                  {contact.name.last[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">
                              {contact.name.first} {contact.name.last}
                            </div>
                            <div className="text-sm opacity-50">
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <th>
                      <button onClick={async () => {
                        const result = confirm('Confirm deletion of this contact.');
                        if (!result) {
                          return;
                        }
                        await dispatch(deleteContactThunk(contact.login.uuid));
                      }} className="btn btn-outline btn-error btn-xs">
                        delete
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ContactsPage;
