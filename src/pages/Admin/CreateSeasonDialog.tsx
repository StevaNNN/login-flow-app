import { useState, Fragment, FormEvent, SyntheticEvent } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Slide from "@mui/material/Slide";
import { USER, _PARTICIPANT_TYPE, _GROUP_TYPE, GROUP_TYPE } from "../../Types";
import { createSeason } from "../../api";
import { Box, Stack } from "@mui/material";

const CreateSeasonDialog = (props: {
  open: boolean;
  handleClose: () => void;
  users: USER[];
}) => {
  const { open, handleClose, users } = props;
  const [nextTick, setNextTick] = useState(0);
  const [seasonParticipants, setSeasonParticipants] = useState<
    _PARTICIPANT_TYPE[]
  >([]);
  const [participantInputValue, setParticipantInputValue] =
    useState<string>("");
  const [seasonName, setSeasonName] = useState<string>("");
  const [seasonGroupInputValue, setSeasonGroupInputValue] =
    useState<string>("");
  const [seasonGroups, setSeasonGroup] = useState<_GROUP_TYPE[]>([]);

  const [groups, setGroups] = useState<GROUP_TYPE[]>([]);

  const parseUsersToOptions = () => {
    return users
      .map((user) => {
        if (user.role !== "admin") {
          return {
            label: user.fullName,
            id: user._id,
            selected: false,
          };
        }
        return {
          label: "",
          id: "",
          selected: false,
        };
      })
      .slice(1);
  };

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

  const handleSeasonGroupsOnChange = (
    _event: React.SyntheticEvent,
    newValue: (_GROUP_TYPE | string)[]
  ) => {
    const updatedSeasonGroups = newValue.map((item) => {
      if (typeof item === "string") {
        return { label: item, id: crypto.randomUUID(), selected: true };
      }
      return { ...item, selected: true };
    });

    setSeasonGroup(updatedSeasonGroups);
  };

  const handleSeasonSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!seasonName || !groups.length || !seasonParticipants.length) {
      return;
    }

    const seasons = { seasonName, seasonParticipants, seasonGroups: groups };
    try {
      const { data } = await createSeason(seasons);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
    resetForm();
    handleClose();
  };

  const hanldeTick = () => {
    if (nextTick === 0) {
      setNextTick(1);
    } else {
      setNextTick(0);
    }
    const groups = seasonGroups.map((group) => {
      return { group, participants: [] };
    });
    setGroups(groups);
  };

  const resetForm = () => {
    setParticipantInputValue("");
    setSeasonGroupInputValue("");
    setSeasonGroup([]);
    setSeasonParticipants([]);
    setSeasonName("");
  };

  const _handleClose = () => {
    resetForm();
    handleClose();
    setNextTick(0);
  };

  const handleUsersToGroup = (
    _event: SyntheticEvent,
    newValue: _PARTICIPANT_TYPE[],
    seasonGroup: _GROUP_TYPE
  ) => {
    setGroups((prevGroups: GROUP_TYPE[]) =>
      prevGroups.map((group) =>
        group.group.id === seasonGroup.id
          ? { ...group, participants: newValue }
          : group
      )
    );
  };

  const renderGroupInputs = (seasonGroup: _GROUP_TYPE) => {
    return (
      <Autocomplete
        multiple
        options={seasonParticipants}
        onChange={(event: SyntheticEvent, newValue: _PARTICIPANT_TYPE[]) =>
          handleUsersToGroup(event, newValue, seasonGroup)
        }
        renderInput={(params) => (
          <TextField {...params} label={`Group: ${seasonGroup.label}`} />
        )}
      />
    );
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={_handleClose}
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
        <DialogTitle>
          {nextTick === 0 ? "Create season" : "Assign Players to each group"}
        </DialogTitle>
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
                value={seasonGroups}
                onChange={handleSeasonGroupsOnChange}
                inputValue={seasonGroupInputValue}
                onInputChange={(_event, newInputValue) =>
                  setSeasonGroupInputValue(newInputValue)
                }
                options={seasonGroups} // You can replace this with predefined options if needed
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
              {seasonGroups.map((group: _GROUP_TYPE) => (
                <Fragment key={group.id}>{renderGroupInputs(group)}</Fragment>
              ))}
            </Stack>
          </Slide>
          <Box
            flex={1}
            alignItems={"end"}
            display={"flex"}
            justifyContent={nextTick === 0 ? "end" : "start"}
          >
            <Button
              disabled={
                seasonGroups.length < 1 || seasonParticipants.length < 1
              }
              onClick={hanldeTick}
              variant="contained"
            >
              {nextTick === 0 ? "Next" : "Previous"}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={_handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CreateSeasonDialog;
