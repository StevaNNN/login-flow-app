import { SyntheticEvent, useEffect } from "react";
import { deleteSeason, getSeasons, getUsers } from "../../api";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SeasonDialog from "./SeasonDialog";
import { SEASON } from "../../Types";
import SeasonCard from "../../components/SeasonCard";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../redux/slices/usersSlice";
import { RootState } from "../../redux/store";
import { setSeasons, selectSeason } from "../../redux/slices/seasonsSlice";
import { setEditMode, setDialogState } from "../../redux/slices/appSlice";

const AdminPage = () => {
  const dispatch = useDispatch();
  const { seasons } = useSelector((state: RootState) => state.seasons);

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
  const handleSeasonCarDelete = async (
    _e: SyntheticEvent,
    cardData: SEASON
  ) => {
    const tempSeasons = seasons.filter(
      (season) => season.seasonId !== cardData.seasonId
    );
    dispatch(setSeasons(tempSeasons));
    try {
      await deleteSeason(cardData.seasonId || "");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Stack direction="column" spacing={2} height={"calc(100vh - 88px)"} p={4}>
        <Button
          variant="outlined"
          onClick={() => dispatch(setDialogState(true))}
        >
          Create new season
        </Button>
        <Stack direction={"row"} gap={2} flexWrap="wrap">
          {seasons.length > 1 &&
            seasons.map((season) => {
              return (
                <SeasonCard
                  key={season.seasonId}
                  seasonName={season.seasonName}
                  seasonGroups={season.seasonGroups}
                  seasonParticipants={season.seasonParticipants}
                  onEdit={(e) => handleSeasonCardEdit(e, season)}
                  onDelete={(e) => handleSeasonCarDelete(e, season)}
                />
              );
            })}
        </Stack>
        <SeasonDialog />
      </Stack>
    </>
  );
};

export default AdminPage;
