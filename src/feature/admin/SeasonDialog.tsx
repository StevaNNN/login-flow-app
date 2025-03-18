import {
  useState,
  Fragment,
  FormEvent,
  SyntheticEvent,
  useEffect,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { _PARTICIPANT_TYPE, _GROUP_TYPE, GROUP_TYPE } from "../../Types";
import { addSeason, editSeason } from "../../api";
import { RootState } from "../../redux/store";
import {
  setDialogState,
  setEditMode,
  setSnackBar,
} from "../../redux/slices/appSlice";
import {
  selectedSeasonInitialData,
  selectSeason,
  setSeasons,
} from "../../redux/slices/seasonsSlice";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Slide from "@mui/material/Slide";

const SeasonDialog = () => {
  const dispatch = useDispatch();

  const { dialogOpened, editMode, snackBar } = useSelector(
    (state: RootState) => state.appState
  );
  const { users } = useSelector((state: RootState) => state.users);
  const { selectedSeason, seasons } = useSelector(
    (state: RootState) => state.seasons
  );

  const {
    seasonId,
    seasonName: _seasonName,
    seasonGroups: _seasonGroups,
    seasonParticipants: _seasonParticipants,
  } = selectedSeason;

  const [nextTick, setNextTick] = useState(0);
  const [participantInputValue, setParticipantInputValue] =
    useState<string>("");

  const [groupInputValue, setGroupInputValue] = useState<string>("");
  const [groups, setGroups] = useState<_GROUP_TYPE[]>([]);

  const [seasonName, setSeasonName] = useState<string>("");
  const [seasonGroups, setSeasonGroups] = useState<GROUP_TYPE[]>([]);
  const [seasonParticipants, setSeasonParticipants] = useState<
    _PARTICIPANT_TYPE[]
  >([]);

  /**
   * Prepopulating fields in edit mode
   */
  useEffect(() => {
    if (editMode) {
      setSeasonName(_seasonName);
      setSeasonGroups(_seasonGroups);
      setSeasonParticipants(_seasonParticipants);
      const initialSeasonGroups = _seasonGroups.map((sg) => sg.group);
      setGroups(initialSeasonGroups);
    }
  }, [_seasonGroups, _seasonName, _seasonParticipants, editMode]);

  /**
   * Parser for participants autocomplete field where we assign users to the season
   * @returns {label: string, id: string, selected: boolean}
   */
  const parseUsersToOptions = () => {
    return users.map((user) => {
      return {
        label: user.fullName,
        id: user._id,
        selected: false,
      };
    });
  };

  /**
   * Handler for participants autocomplete field on first slide
   * @param _event React.SyntheticEvent
   * @param newValue _PARTICIPANT_TYPE[]
   */
  const handleParticipantsOnChange = (
    _event: React.SyntheticEvent,
    newValue: _PARTICIPANT_TYPE[]
  ) => {
    const updatedSeasonParticipants = newValue.map((item) => ({
      ...item,
      selected: true,
    }));
    setSeasonParticipants(updatedSeasonParticipants);
  };

  /**
   * Handler for seasson group on change on first slide
   * @param _event React.SyntheticEvent
   * @param newValue (_GROUP_TYPE | string)[]
   */
  const handleGroupsOnChange = (
    _event: React.SyntheticEvent,
    newValue: (_GROUP_TYPE | string)[]
  ) => {
    const updatedSeasonGroups = newValue.map((item) => {
      if (typeof item === "string") {
        return { label: item, id: crypto.randomUUID(), selected: true };
      }
      return { ...item, selected: true };
    });

    setGroups(updatedSeasonGroups);
  };

  /**
   * Form submit handler for both edit and add variants
   * @param e FormEvent<HTMLFormElement>
   * @returns void
   */
  const handleSeasonSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!seasonName || !seasonGroups.length || !seasonParticipants.length) {
      return;
    }

    if (nextTick === 0) return;

    const season = {
      seasonId: seasonId || crypto.randomUUID(),
      seasonName,
      seasonParticipants,
      seasonGroups,
    };

    const indexOfEditedSeason = seasons.findIndex(
      (_season) => _season.seasonId === season.seasonId
    );

    let updatedSeasons = seasons;

    if (indexOfEditedSeason !== -1) {
      // Create a new array with the updated season at the correct index
      const seasonsCopy = [...seasons];
      seasonsCopy[indexOfEditedSeason] = season;

      updatedSeasons = seasonsCopy; // Updated array with the modified season
    }

    if (editMode) {
      dispatch(setSeasons(updatedSeasons));
      try {
        await editSeason(season);
        dispatch(setSnackBar({ message: "Season updated succesfully" }));
      } catch (err) {
        if (err instanceof Error)
          dispatch(setSnackBar({ message: err.message }));
      }
    } else {
      try {
        await addSeason(season);
        dispatch(setSeasons([...seasons, season]));
        dispatch(setSnackBar({ message: "Succesfully add new season" }));
      } catch (err) {
        if (err instanceof Error)
          dispatch(setSnackBar({ message: err.message }));
      }
    }
    setTimeout(() => {
      dispatch(setSnackBar({ message: "" }));
    }, snackBar.autoHideDuration);
    resetForm();
  };

  /**
   * Handler for each group Autocomplete field where we
   * populate each group with participants, also supports the selectedSeason data
   * @param _event
   * @param newValue
   * @param seasonGroup
   */
  const handleUsersToGroup = (
    _event: SyntheticEvent,
    newValue: _PARTICIPANT_TYPE[],
    seasonGroup: _GROUP_TYPE
  ) => {
    setSeasonGroups((prevGroups: GROUP_TYPE[]) =>
      prevGroups.map((group) =>
        group.group.id === seasonGroup.id
          ? { ...group, participants: newValue }
          : group
      )
    );
  };

  /**
   * Helper renderr for the added seasonGroups on first wizzard
   * @param seasonGroup
   * @returns
   */
  const renderGroupInputs = (seasonGroup: _GROUP_TYPE) => {
    const initialValue = seasonGroups.find(
      (group) => group.group.id === seasonGroup.id
    )?.participants;

    const pickedIds = seasonGroups
      .map((sG) =>
        sG.participants.map((sP) => {
          return sP.id;
        })
      )
      .flat();

    const nonPickedSeasonParticipants = seasonParticipants.filter(
      (sp) => !pickedIds.includes(sp.id)
    );

    return (
      <Autocomplete
        value={initialValue}
        multiple
        options={nonPickedSeasonParticipants}
        onChange={(event: SyntheticEvent, newValue: _PARTICIPANT_TYPE[]) =>
          handleUsersToGroup(event, newValue, seasonGroup)
        }
        renderInput={(params) => (
          <TextField {...params} label={`Group: ${seasonGroup.label}`} />
        )}
      />
    );
  };

  /**
   * Handles next/previous actions
   */
  const hanldeTick = () => {
    if (nextTick === 0) {
      if (seasonGroups.length < 1) {
        // Case when there are no seasonGroups yet
        const blankGroups = groups.map((group) => {
          return { group, participants: [] };
        });
        setSeasonGroups(blankGroups);
      } else if (groups.length > seasonGroups.length) {
        // Case in edit mode where we ADD new group on TICK 1 and already have prepopulated other seasonGroups
        const lenghtToAddBlack = groups.length - seasonGroups.length;
        const test = groups.slice(-lenghtToAddBlack);
        const editedBlankGroups = test.map((group) => {
          return { group, participants: [] };
        });
        setSeasonGroups((prevState) => [...prevState, ...editedBlankGroups]);
      } else if (groups.length < seasonGroups.length) {
        // Case where we try to edit seazon and delete couple groups
        const groupsIdsArray: string[] = [];
        for (let j = 0; j < groups.length; j++) {
          groupsIdsArray.push(groups[j].id);
        }
        const newSeasonGroups = seasonGroups.filter((sg) =>
          groupsIdsArray.includes(sg.group.id)
        );

        setSeasonGroups(newSeasonGroups);
      }
      setNextTick(1);
    } else if (nextTick === 1) {
      // Case to hanlde populated seasonGroups with users and to preserve that state when go back and forth
      setSeasonGroups((prevState) => [...prevState]);
      setNextTick(0);
    }
  };

  /**
   * Reseting form inputs
   */
  const resetForm = () => {
    setParticipantInputValue("");
    setGroupInputValue("");
    setGroups([]);
    setSeasonParticipants([]);
    setSeasonName("");
    setNextTick(0);
    dispatch(setDialogState(false));
    dispatch(setEditMode(false));
    dispatch(selectSeason(selectedSeasonInitialData));
  };

  /**
   * Close dialog handler
   * @param _event
   * @param reason
   */
  const handleClose = (_event: object, reason?: string) => {
    if (reason !== "backdropClick") {
      resetForm();
    }
  };

  console.log(seasonGroups, "steva");

  return (
    <Fragment>
      <Dialog
        open={dialogOpened}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            sx: {
              height: "100%",
              width: "100%",
              maxWidth: 600,
              maxHeight: 600,
            },
            onSubmit: handleSeasonSubmit,
          },
        }}
      >
        {nextTick === 0 ? (
          <DialogTitle>
            {editMode ? "Edit season" : "Create season"}
          </DialogTitle>
        ) : (
          <DialogTitle>Assign Players to each group</DialogTitle>
        )}

        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Slide
            appear={false}
            direction="right"
            in={nextTick === 0}
            mountOnEnter
            unmountOnExit
            timeout={500}
          >
            <Stack direction={"column"} gap={2}>
              <TextField
                label="Season name"
                variant="outlined"
                value={seasonName}
                onChange={(e) => {
                  setSeasonName(e.target.value);
                }}
              />
              <Autocomplete
                multiple
                freeSolo
                value={groups}
                onChange={handleGroupsOnChange}
                inputValue={groupInputValue}
                onInputChange={(_event, newInputValue) =>
                  setGroupInputValue(newInputValue)
                }
                options={groups} // You can replace this with predefined options if needed
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.label
                }
                isOptionEqualToValue={(option, value) =>
                  typeof option === "string" || typeof value === "string"
                    ? false
                    : option.id === value.id
                }
                renderInput={(params) => (
                  <TextField {...params} label="Groups" />
                )}
              />
              <Autocomplete
                value={seasonParticipants}
                multiple
                getOptionLabel={(option) => option.label || ""}
                onChange={handleParticipantsOnChange}
                inputValue={participantInputValue}
                onInputChange={(_event, newInputValue) => {
                  setParticipantInputValue(newInputValue);
                }}
                options={parseUsersToOptions()}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Participants" />
                )}
              />
            </Stack>
          </Slide>
          <Slide
            direction="right"
            in={nextTick === 1}
            appear={false}
            mountOnEnter
            unmountOnExit
            timeout={700}
          >
            <Stack direction={"column"} gap={2}>
              {seasonGroups.map((group: GROUP_TYPE) => (
                <Fragment key={group.group.id}>
                  {renderGroupInputs(group.group)}
                </Fragment>
              ))}
            </Stack>
          </Slide>
          <Box
            flex={1}
            alignItems={"end"}
            display={"flex"}
            justifyContent={nextTick === 0 ? "end" : "start"}
          ></Box>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={groups.length < 1 || seasonParticipants.length < 1}
            onClick={hanldeTick}
            variant="contained"
          >
            {nextTick === 0 ? "Next" : "Previous"}
          </Button>
          <div style={{ flex: 1 }} />
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={nextTick === 0}>
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default SeasonDialog;
