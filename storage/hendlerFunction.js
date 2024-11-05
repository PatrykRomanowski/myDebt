import { createSlice } from "@reduxjs/toolkit";

const functionHandlerContext = createSlice({
  name: "functionhandler",

  initialState: {
    siteToogle: false,
    refreshData: false,
  },
  reducers: {
    toogleSite(state) {
      state.siteToogle = !state.siteToogle;
    },
    refreshData(state) {
      state.refreshData = !state.refreshData;
    },
  },
});

export const functionhandlerActions = functionHandlerContext.actions;

export default functionHandlerContext;
