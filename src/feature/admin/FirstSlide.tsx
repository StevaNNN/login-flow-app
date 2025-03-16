import { FC, useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Slide from "@mui/material/Slide";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { _GROUP_TYPE, _PARTICIPANT_TYPE, SEASON } from "../../Types";

export interface FIRST_SLIDE_PROPS {
  nextTick: 0 | 1;
  setFirstSlideData: (
    seasonName: SEASON["seasonName"],
    seasonGroup: _GROUP_TYPE[],
    seasonParticipants: SEASON["seasonParticipants"]
  ) => void;
}

const FirstSlide: FC<FIRST_SLIDE_PROPS> = ({ nextTick, setFirstSlideData }) => {
  const { users } = useSelector((state: RootState) => state.users);
  const { selectedSeason } = useSelector((state: RootState) => state.seasons);
  const { editMode } = useSelector((state: RootState) => state.appState);

  const {
    seasonName: _seasonName,
    seasonGroups: _seasonGroups,
    seasonParticipants: _seasonParticipants,
  } = selectedSeason;

  const [seasonName, setSeasonName] = useState<string>("");
  const [groups, setGroup] = useState<_GROUP_TYPE[]>([]);
  const [seasonParticipants, setSeasonParticipants] = useState<
    _PARTICIPANT_TYPE[]
  >([]);
  const [participantInputValue, setParticipantInputValue] =
    useState<string>("");
  const [seasonGroupInputValue, setSeasonGroupInputValue] =
    useState<string>("");

  useEffect(() => {
    if (editMode) {
      setSeasonName(_seasonName);
      setSeasonParticipants(_seasonParticipants);
      const initialSeasonGroups = _seasonGroups.map((sg) => sg.group);
      setGroup(initialSeasonGroups);
    }
  }, [_seasonGroups, _seasonName, _seasonParticipants, editMode]);

  useEffect(() => {
    setFirstSlideData(seasonName, groups, seasonParticipants);
  }, [groups, seasonName, seasonParticipants, setFirstSlideData]);
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

    setGroup(updatedSeasonGroups);
  };

  return (
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
          onChange={handleSeasonGroupsOnChange}
          inputValue={seasonGroupInputValue}
          onInputChange={(_event, newInputValue) =>
            setSeasonGroupInputValue(newInputValue)
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
      </Stack>
    </Slide>
  );
};

export default FirstSlide;
