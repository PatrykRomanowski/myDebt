import {
    configureStore
} from "@reduxjs/toolkit";

import testContext from "./test";
import debitContext from "./debit";

const store = configureStore({
    reducer: {
        testContext: testContext.reducer,
        debitContext: debitContext.reducer,
    },
});

export default store