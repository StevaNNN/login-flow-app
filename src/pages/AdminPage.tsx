import { FormEvent, useEffect, useState } from "react";
import { createSeason, getUsers } from "../api";
import { GROUP_TYPE, PARTICIPANT_TYPE, USER } from "../Types";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Stack, Typography } from "@mui/material";

const AdminPage = () => {
  const [users, setUsers] = useState<USER[]>([]);

  const [seasonParticipants, setSeasonParticipants] = useState<
    PARTICIPANT_TYPE[]
  >([]);
  const [participantInputValue, setParticipantInputValue] =
    useState<string>("");
  const [seasonName, setSeasonName] = useState<string>("");
  const [seasonGroupInputValue, setSeasonGroupInputValue] =
    useState<string>("");
  const [seasonGroups, setSeasonGroup] = useState<GROUP_TYPE[]>([]);

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
    newValue: PARTICIPANT_TYPE[]
  ) => {
    const updatedSeasonParticipants = newValue.map((item) => ({
      ...item,
      selected: true,
    }));
    setSeasonParticipants(updatedSeasonParticipants);
  };

  const handleSeasonGroupsOnChange = (
    _event: React.SyntheticEvent,
    newValue: (GROUP_TYPE | string)[]
  ) => {
    const updatedSeasonGroups = newValue.map((item) => {
      if (typeof item === "string") {
        return { label: item, id: crypto.randomUUID(), selected: true }; // New items marked as selected
      }
      return { ...item, selected: true }; // Mark existing objects as selected
    });

    setSeasonGroup(updatedSeasonGroups);
  };

  const handleSeasonSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!seasonName || !seasonGroups.length || !seasonParticipants.length) {
      return;
    }

    const seasons = { seasonName, seasonParticipants, seasonGroups };
    try {
      const { data } = await createSeason(seasons);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Stack direction="column" spacing={2}>
        <form onSubmit={handleSeasonSubmit}>
          <Typography sx={{ fontWeight: "bold" }}>Create new season</Typography>
          <Stack
            direction="column"
            spacing={4}
            border={1}
            p={4}
            borderRadius={4}
          >
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
              renderInput={(params) => <TextField {...params} label="Groups" />}
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
            <Button variant="contained" type="submit">
              Create season
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default AdminPage;
