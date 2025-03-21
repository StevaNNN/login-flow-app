import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SEASON } from "../../Types";

export interface SEASONS_STATE {
  seasons: SEASON[];
  selectedSeason: SEASON;
}

export const selectedSeasonInitialData: SEASON = {
  seasonId: "",
  seasonName: "",
  seasonParticipants: [],
  seasonGroups: [],
};

const initialState: SEASONS_STATE = {
  seasons: [],
  selectedSeason: selectedSeasonInitialData,
};

export const seasonsSlice = createSlice({
  name: "seasons",
  initialState,
  reducers: {
    setSeasons: (state, action: PayloadAction<SEASONS_STATE["seasons"]>) => {
      state.seasons = action.payload;
    },
    setSelectedSeason: (
      state,
      action: PayloadAction<SEASONS_STATE["selectedSeason"]>
    ) => {
      state.selectedSeason = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSeasons, setSelectedSeason } = seasonsSlice.actions;

export default seasonsSlice.reducer;
