import { configureStore } from "@reduxjs/toolkit";
import problemReducer from "./ProblemSlice.js";

const store = configureStore({
  reducer: {
    problems: problemReducer,
  },
});

export default store;
