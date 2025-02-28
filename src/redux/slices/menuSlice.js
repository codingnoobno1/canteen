"use client";

import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  menuData: {
    Monday: { Breakfast: "", Lunch: "", Snacks: "", Dinner: "" },
    Tuesday: { Breakfast: "", Lunch: "", Snacks: "", Dinner: "" },
    Wednesday: { Breakfast: "", Lunch: "", Snacks: "", Dinner: "" },
    Thursday: { Breakfast: "", Lunch: "", Snacks: "", Dinner: "" },
    Friday: { Breakfast: "", Lunch: "", Snacks: "", Dinner: "" },
    Saturday: { Breakfast: "", Lunch: "", Snacks: "", Dinner: "" },
    Sunday: { Breakfast: "", Lunch: "", Snacks: "", Dinner: "" },
  },
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    updateMenu: (state, action) => {
      const { day, time, value } = action.payload;
      if (state.menuData[day]) {
        state.menuData[day][time] = value;
      }
    },
  },
});

export const { updateMenu } = menuSlice.actions;

const persistConfig = { key: "menu", storage };
export const persistedMenuReducer = persistReducer(persistConfig, menuSlice.reducer);
