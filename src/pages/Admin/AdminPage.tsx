import { useEffect, useState } from "react";
import { getUsers } from "../../api";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CreateSeasonDialog from "./CreateSeasonDialog";
import { USER } from "../../Types";

const AdminPage = () => {
  const [users, setUsers] = useState<USER[]>([]);
  const [seasonDialogOpened, setSeasonDialogOpened] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleSeasonDialogOpen = () => setSeasonDialogOpened(true);
  const handleSeasonDialogClose = () => setSeasonDialogOpened(false);

  return (
    <>
      <Stack direction="column" spacing={2} height={"calc(100vh - 88px)"} p={4}>
        <Button variant="outlined" onClick={handleSeasonDialogOpen}>
          Create new season
        </Button>
        <CreateSeasonDialog
          open={seasonDialogOpened}
          handleClose={handleSeasonDialogClose}
          users={users}
        />
      </Stack>
    </>
  );
};

export default AdminPage;
