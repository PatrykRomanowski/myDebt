import {
    createSlice
} from "@reduxjs/toolkit";

const testContext = createSlice({
    name: "testHandler",

    initialState: {
        testNmber: 1
    },
    reducers: {
        setNewData(state) {
            state.testNmber = testNmber + 1;
        }
    }


})
export const testActions = testContext.actions;

export default testContext;