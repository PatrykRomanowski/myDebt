import { createSlice } from "@reduxjs/toolkit";

const functionHandlerContext = createSlice({
  name: "functionhandler",

  initialState: {
    siteToogle: false,
  },
  reducers: {
    toogleSite(state) {
      state.siteToogle = !state.siteToogle;
    },
  },
});

export const functionhandlerActions = functionHandlerContext.actions;

export default functionHandlerContext;
