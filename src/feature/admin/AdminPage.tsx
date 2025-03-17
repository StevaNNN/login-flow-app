import { SyntheticEvent, useEffect } from "react";
import { deleteSeason, getSeasons, getUsers } from "../../api";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SeasonDialog from "./SeasonDialog";
import { SEASON } from "../../Types";
import SeasonCard from "../../components/SeasonCard";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../redux/slices/usersSlice";
import { RootState } from "../../redux/store";
import {
  setSeasons,
  selectSeason,
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
   * Initial data fetch and send to store
   */
  useEffect(() => {
    const initData = async () => {
      try {
        const userResponse = await getUsers();
        const seasonResponse = await getSeasons();
        dispatch(setUsers(userResponse.data));
        dispatch(setSeasons(seasonResponse.data));
      } catch (err) {
        console.error(err);
      }
    };
    initData();
  }, [dispatch]);

  /**
   * Selects the clicked season and pass data to the SeasonDialog for edits
   * @param _e
   * @param cardData
   */
  const handleSeasonCardEdit = (_e: SyntheticEvent, cardData: SEASON) => {
    dispatch(setDialogState(true));
    dispatch(setEditMode(true));
    dispatch(selectSeason(cardData));
  };

  /**
   * Deletes season clicked season
   * @param _e
   * @param cardData
   */
  const handleSeasonCardDelete = (_e: SyntheticEvent, cardData: SEASON) => {
    dispatch(setConfirmationDialogState(true));
    dispatch(selectSeason(cardData));
  };

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

  /**
   * Handler for adding match results TODO add logic
   */
  const handleAddNewScore = () => {
    console.log("Add logic for adding new score");
  };

  return (
    <>
      <Stack direction="column" spacing={4}>
        <Box gap={4} display={"flex"} justifyContent={"flex-end"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => dispatch(setDialogState(true))}
          >
            Create new season
          </Button>
          <Button variant="contained" onClick={handleAddNewScore}>
            Add new score
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
            dispatch(selectSeason(selectedSeasonInitialData));
          }}
          onOk={handleConfirm}
        />
      </Stack>
    </>
  );
};

export default AdminPage;
