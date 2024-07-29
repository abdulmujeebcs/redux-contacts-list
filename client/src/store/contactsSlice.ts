import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Contact } from "../types";
import { createContact, deleteContact, getContactById, getContacts } from "../api/contactsApi";
import { RootState } from "./store";

interface ContactsInterface {
    items: Contact[],
    openedContact: Contact | null,
    apiCallInProgress: boolean
}

const initialState: ContactsInterface = {
    items: [],
    openedContact: null,
    apiCallInProgress: false
}

export const getContactsThunk = createAsyncThunk('contacts/getContacts', async () => {
    return await getContacts();
})

export const createContactThunk = createAsyncThunk('contacts/createContact', async (contact: Partial<Contact>) => {
    const newContact = await createContact(contact);
    return newContact;
})

export const deleteContactThunk = createAsyncThunk('contacts/deleteContact', async (contactId: string) => {
    const deletedContact = await deleteContact(contactId);
    return deletedContact;
})

export const openContactThunk = createAsyncThunk('contacts/detail', async (contactId: string) => {
    const contact = await getContactById(contactId);
    return contact;
})

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;

const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {},
    // when we used thunk dispatches
    extraReducers: (builder) => {
        builder
            .addCase(getContactsThunk.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(createContactThunk.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteContactThunk.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => {
                    return item.login.uuid !== action.payload.login.uuid;
                });
            })
            .addCase(openContactThunk.fulfilled, (state, action) => {
                state.openedContact = action.payload;
            })
            .addMatcher(
                (action): action is PendingAction => action.type.endsWith('/pending'),
                (state) => {
                    state.apiCallInProgress = true;
                }
            )
            .addMatcher(
                (action): action is RejectedAction => action.type.endsWith('/rejected'),
                (state) => {
                    state.apiCallInProgress = false;
                }
            )
            .addMatcher(
                (action): action is FulfilledAction => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.apiCallInProgress = false;
                }
            )
    }
});

export const selectApiCallInProgress = (state: RootState) => {
    return state.contacts.apiCallInProgress;
}


export const selectContactsList = (state: RootState) => {
    return state.contacts.items;
}

export const selectOpenContact = (state: RootState) => {
    return state.contacts.openedContact;
}

const contactsReducer = contactsSlice.reducer;
export default contactsReducer