import React, { FormEvent, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import LayoutHeader from "./LayoutHeader";
import { addMatch } from "../api";
import AddMatchScoreDialog from "./AddMatchScoreDialog";
import { setSnackBar } from "../redux/slices/appSlice";
import { MATCH_TYPE } from "../Types";

import { Button, Container } from "@mui/material";

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newScoreDialogOpened, setNewScoreDialogOpened] = useState(false);

  useEffect(() => {
    navigate("/matchesTable");
  }, [navigate]);

  /**
   * Handler for adding match result
   */
  const handleNewResultSubmit = async (
    e: FormEvent<HTMLFormElement>,
    data: MATCH_TYPE
  ) => {
    const req = await addMatch(data);
    dispatch(setSnackBar({ message: req.data.message }));
    e.preventDefault();
  };

  /**
   * Handler for adding match results TODO add logic
   */
  const handleAddNewScore = () => {
    setNewScoreDialogOpened(true);
  };

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column" }}
      maxWidth={false}
      disableGutters
    >
      <LayoutHeader />
      <Container
        component={"main"}
        sx={{ flexGrow: 1, py: 3, marginTop: "72px", position: "relative" }}
      >
        <Container disableGutters sx={{ position: "sticky", top: 0 }}>
          <Button variant="contained" onClick={handleAddNewScore}>
            Add new score
          </Button>
        </Container>
        <Outlet />
        <AddMatchScoreDialog
          title={"Add new result"}
          handleClose={() => setNewScoreDialogOpened(false)}
          open={newScoreDialogOpened}
          newResultSubmit={handleNewResultSubmit}
        />
      </Container>
    </Container>
  );
};

export default Layout;
