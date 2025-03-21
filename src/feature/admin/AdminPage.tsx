import { SyntheticEvent } from "react";
import { deleteSeason } from "../../api";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SeasonDialog from "./SeasonDialog";
import { SEASON } from "../../Types";
import SeasonCard from "../../components/SeasonCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  setSeasons,
  setSelectedSeason,
  selectedSeasonInitialData,
} from "../../redux/slices/seasonsSlice";
import {
  setEditMode,
  setDialogState,
  setConfirmationDialogState,
} from "../../redux/slices/appSlice";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const AdminPage = () => {
  const dispatch = useDispatch();
  const { seasons, selectedSeason } = useSelector(
    (state: RootState) => state.seasons
  );
  const { confirmDialogOpened } = useSelector(
    (state: RootState) => state.appState
  );

  /**
   * Selects the clicked season and pass data to the SeasonDialog for edits
   * @param _e
   * @param cardData
   */
  const handleSeasonCardEdit = (_e: SyntheticEvent, cardData: SEASON) => {
    dispatch(setDialogState(true));
    dispatch(setEditMode(true));
    dispatch(setSelectedSeason(cardData));
  };

  /**
   * Deletes season clicked season
   * @param _e
   * @param cardData
   */
  const handleSeasonCardDelete = (_e: SyntheticEvent, cardData: SEASON) => {
    dispatch(setConfirmationDialogState(true));
    dispatch(setSelectedSeason(cardData));
  };

  /**
   * Handle confirm action on dialog when deleting season
   */
  const handleConfirm = async () => {
    const tempSeasons = seasons.filter(
      (season) => season.seasonId !== selectedSeason.seasonId
    );
    dispatch(setSeasons(tempSeasons));
    try {
      await deleteSeason(selectedSeason.seasonId || "");
      dispatch(setConfirmationDialogState(false));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Stack direction="column" spacing={4}>
        <Box gap={4} display={"flex"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => dispatch(setDialogState(true))}
          >
            Create new season
          </Button>
        </Box>
        <Stack direction={"row"} gap={2} flexWrap="wrap">
          {seasons.map((season) => {
            return (
              <SeasonCard
                key={season.seasonId}
                seasonName={season.seasonName}
                seasonGroups={season.seasonGroups}
                seasonParticipants={season.seasonParticipants}
                onEdit={(e) => handleSeasonCardEdit(e, season)}
                onDelete={(e) => handleSeasonCardDelete(e, season)}
              />
            );
          })}
        </Stack>
        <SeasonDialog />
        <ConfirmationDialog
          open={confirmDialogOpened}
          title={"Please confirm"}
          message="Are you sure you want to delete?"
          onClose={() => {
            dispatch(setConfirmationDialogState(false));
            dispatch(setSelectedSeason(selectedSeasonInitialData));
          }}
          onOk={handleConfirm}
        />
      </Stack>
    </>
  );
};

export default AdminPage;
