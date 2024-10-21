import {
    createSlice
} from "@reduxjs/toolkit";

const debitContext = createSlice({
    name: "debitHandler",

    initialState: {
        debitDate: [],
    },
    reducers: {
        setNewDebitData(state, action) {
            state.debitDate = action.payload.value;
        },
    },
});

export const debitActions = debitContext.actions;

export default debitContext;