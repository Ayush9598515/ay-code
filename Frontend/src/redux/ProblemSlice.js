import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Correct base URL for problem APIs (auth server)
const BASE_URL = "http://localhost:2000/api";

// ✅ Thunk to fetch problems
export const fetchProblems = createAsyncThunk("problems/fetchProblems", async () => {
  const res = await axios.get(`${BASE_URL}/problems`);
  return res.data;
});

// ✅ Thunk to add problem to backend
export const addProblemToBackend = createAsyncThunk("problems/addProblemToBackend", async (problemData) => {
  const res = await axios.post(`${BASE_URL}/problems`, problemData);
  return res.data;
});

const problemSlice = createSlice({
  name: "problems",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Optional: only for local use
    addProblem: (state, action) => {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // ✅ Add new problem after POST
      .addCase(addProblemToBackend.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

// ✅ Export reducer and actions
export default problemSlice.reducer;
export const { addProblem } = problemSlice.actions;
