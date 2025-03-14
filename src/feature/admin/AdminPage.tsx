import { SyntheticEvent, useEffect, useState } from "react";
import { getSeasons, getUsers } from "../../api";
import _ from "lodash";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CreateSeasonDialog from "./CreateSeasonDialog";
import { SEASON, USER } from "../../Types";
import SeasonCard from "../../components/Season/SeasonCard";

const AdminPage = () => {
  const [users, setUsers] = useState<USER[]>([]);
  const [seasons, setSeasons] = useState<SEASON[]>([]);
  const [seasonDialogOpened, setSeasonDialogOpened] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<SEASON>({
    seasonName: "",
    seasonParticipants: [],
    seasonGroups: [],
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const userResponse = await getUsers();
        const seasonResponse = await getSeasons();
        const sortedUsers = _.sortBy(userResponse.data, "fullName");
        setUsers(sortedUsers);
        setSeasons(seasonResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    initData();
  }, []);

  const handleSeasonCardClick = (_e: SyntheticEvent, cardData: SEASON) => {
    setSeasonDialogOpened(true);
    setSelectedSeason(cardData);
  };
  const handleSeasonDialogOpen = () => setSeasonDialogOpened(true);
  const handleSeasonDialogClose = (_event?: object, reason?: string) => {
    if (reason === "backdropClick") return;
    setSeasonDialogOpened(false);
  };

  return (
    <>
      <Stack direction="column" spacing={2} height={"calc(100vh - 88px)"} p={4}>
        <Button variant="outlined" onClick={handleSeasonDialogOpen}>
          Create new season
        </Button>
        <Stack direction={"row"} gap={2}>
          {seasons.map((season) => {
            return (
              <SeasonCard
                key={season._id}
                seasonName={season.seasonName}
                seasonGroups={season.seasonGroups}
                seasonParticipants={season.seasonParticipants}
                onClick={(e) => handleSeasonCardClick(e, season)}
              />
            );
          })}
        </Stack>
        <CreateSeasonDialog
          open={seasonDialogOpened}
          handleClose={handleSeasonDialogClose}
          users={users}
          initialData={selectedSeason}
        />
      </Stack>
    </>
  );
};

export default AdminPage;
