import { FC, Fragment, SyntheticEvent } from "react";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { _GROUP_TYPE, _PARTICIPANT_TYPE, GROUP_TYPE } from "../../Types";

export interface SECOND_SLIDE_PROPS {
  nextTick: 0 | 1;
  seasonParticipants: _PARTICIPANT_TYPE[];
  groups: GROUP_TYPE[];
  setGroups: any;
}
const SecondSlide: FC<SECOND_SLIDE_PROPS> = ({
  nextTick,
  seasonParticipants,
  groups,
  setGroups,
}) => {
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
    setGroups((prevGroups: GROUP_TYPE[]) =>
      prevGroups.map((group) =>
        group.group.id === seasonGroup.id
          ? { ...group, participants: newValue }
          : group
      )
    );
  };
  /**
   * Helper renderr for the added groups on first wizzard
   * @param seasonGroup
   * @returns
   */
  const renderGroupInputs = (seasonGroup: _GROUP_TYPE) => {
    const initialValue = groups.find(
      (group) => group.group.id === seasonGroup.id
    )?.participants;

    return (
      <Autocomplete
        value={initialValue}
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
    <Slide
      direction="right"
      in={nextTick === 1}
      appear={false}
      mountOnEnter
      unmountOnExit
      timeout={700}
    >
      <Stack direction={"column"} gap={2}>
        {groups.map((group: GROUP_TYPE) => (
          <Fragment key={group.group.id}>
            {renderGroupInputs(group.group)}
          </Fragment>
        ))}
      </Stack>
    </Slide>
  );
};

export default SecondSlide;
