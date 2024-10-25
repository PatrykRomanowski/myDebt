import { configureStore } from "@reduxjs/toolkit";

import testContext from "./test";
import debitContext from "./debit";
import functionHandlerContext from "./hendlerFunction";

const store = configureStore({
  reducer: {
    testContext: testContext.reducer,
    debitContext: debitContext.reducer,
    functionHandlerContext: functionHandlerContext.reducer,
  },
});

export default store;
