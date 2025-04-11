import {
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  FormEvent,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectedSeasonInitialData,
  setSelectedSeason,
} from "../redux/slices/seasonsSlice";
import { RootState } from "../redux/store";

import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { Box, Divider } from "@mui/material";
import { MATCH_TYPE } from "../Types";

interface ADD_MATCH_SCORE_DIALOG_PROPS extends DialogProps {
  title: string;
  newResultSubmit: (e: FormEvent<HTMLFormElement>, data: MATCH_TYPE) => void;
  handleClose?: () => void;
}

const AddMatchScoreDialog: FC<ADD_MATCH_SCORE_DIALOG_PROPS> = ({
  title,
  open,
  newResultSubmit,
  handleClose,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const { seasons, selectedSeason } = useSelector(
    (state: RootState) => state.seasons
  );

  const [seasonInputValue, setSeasonInputValue] = useState<string>("");
  const [pickedSeason, setPickedSeason] = useState<{
    label: string;
    id?: string;
    selected: boolean;
  }>({
    label: selectedSeason?.seasonName,
    id: selectedSeason?.seasonId, // Ensure id is always a string
    selected: true,
  });
  const [groupInputValue, setGroupInputValue] = useState<string>("");
  const [pickedGroup, setPickedGroup] = useState<{
    label: string;
    id?: string;
    selected: boolean;
  }>({
    label: "",
    id: "", // Ensure id is always a string
    selected: false,
  });

  const [player1, setPlayer1] = useState<{
    label: string;
    id: string;
    selected: boolean;
  }>({
    label: "",
    id: "", // Default value for id
    selected: false,
  });
  const [player1InputValue, setplayer1InputValue] = useState<string>("");
  const player1Set1Ref = useRef<HTMLInputElement>(null);
  const player1Set1TiebreakRef = useRef<HTMLInputElement>(null);
  const player1Set2Ref = useRef<HTMLInputElement>(null);
  const player1Set2TiebreakRef = useRef<HTMLInputElement>(null);
  const player1Set3Ref = useRef<HTMLInputElement>(null);

  const [player2, setPlayer2] = useState<{
    label: string;
    id: string;
    selected: boolean;
  }>({
    label: "",
    id: "", // Default value for id
    selected: false,
  });
  const [player2InputValue, setplayer2InputValue] = useState<string>("");
  const player2Set1Ref = useRef<HTMLInputElement>(null);
  const player2Set1TiebreakRef = useRef<HTMLInputElement>(null);
  const player2Set2Ref = useRef<HTMLInputElement>(null);
  const player2Set2TiebreakRef = useRef<HTMLInputElement>(null);
  const player2Set3Ref = useRef<HTMLInputElement>(null);

  /**
   * Prepopulating fields with selected season
   */
  useEffect(() => {
    setPickedSeason({
      label: selectedSeason?.seasonName,
      id: selectedSeason?.seasonId,
      selected: true,
    });
  }, [selectedSeason]);

  /**
   * Parsing seasons to array for autocomplete field
   */
  const parsedSeasonsToOptions = useMemo(() => {
    return seasons?.map((season) => {
      return {
        label: season.seasonName,
        id: season.seasonId,
        selected: false,
      };
    });
  }, [seasons]);

  /**
   * Parsing selected season groups to array for autocomplete field
   */
  const parsedSelectedSeasonGroupsToOptions = useMemo(() => {
    return selectedSeason?.seasonGroups?.map((sG) => {
      return {
        label: sG.group.label,
        id: sG.group.id,
        selected: false,
      };
    });
  }, [selectedSeason]);

  /**
   * Parsing selected season groups particiapnts to array for autocomplete field
   */
  const parsedSelectedSeasonGroupParticipantsToOptions = useMemo(() => {
    return selectedSeason?.seasonGroups
      ?.filter((sG) => sG.group.id === pickedGroup.id)
      ?.flatMap((sG) => {
        return sG.participants.map((p) => {
          return {
            label: p.label,
            id: p.id,
            selected: false,
          };
        });
      })
      ?.filter((s) => ![player1.id, player2.id].includes(s.id));
  }, [pickedGroup, selectedSeason, player1, player2]);

  /**
   * Handler for seasons autocomplete field change
   * @param _event React.SyntheticEvent
   * @param newValue AUTOCOMPLETE_ABSTRACT_TYPE
   */
  const handleSeasonOnChange = useCallback(
    (
      _event: SyntheticEvent,
      newValue: { label: string; id?: string; selected: boolean } | null
    ) => {
      const newSelectedSeason = seasons.filter(
        (s) => s.seasonId === newValue?.id
      )[0];

      dispatch(setSelectedSeason({ ...newSelectedSeason }));
      if (newValue) {
        setPickedSeason(newValue);
        resetForm();
      }
    },
    [dispatch, seasons]
  );

  /**
   * Form reset
   */
  const resetForm = () => {
    setPickedGroup({ label: "", id: "", selected: false });
    setPlayer1({ label: "", id: "", selected: false });
    setPlayer2({ label: "", id: "", selected: false });
    const arrayOfInputEls = [
      player1Set1Ref.current,
      player1Set1TiebreakRef.current,
      player1Set2Ref.current,
      player1Set2TiebreakRef.current,
      player1Set3Ref.current,
      player2Set1Ref.current,
      player2Set1TiebreakRef.current,
      player2Set2Ref.current,
      player2Set2TiebreakRef.current,
      player2Set3Ref.current,
    ];

    arrayOfInputEls.forEach((input) => {
      if (input) {
        input.value = "";
      }
    });
  };

  /**
   * Handler for seasons autocomplete field change
   * @param _event React.SyntheticEvent
   * @param newValue AUTOCOMPLETE_ABSTRACT_TYPE
   */
  const handleGroupOnChange = useCallback(
    (
      _event: SyntheticEvent<Element, Event>,
      newValue: { label: string; id?: string; selected: boolean } | null
    ) => {
      if (newValue) {
        setPickedGroup({
          label: newValue.label,
          id: newValue.id ?? "", // Ensure id is always a string
          selected: newValue.selected,
        });
      }
    },
    []
  );

  /**
   * Handler for selecting player 1
   * @param _event React.SyntheticEvent
   * @param newValue AUTOCOMPLETE_ABSTRACT_TYPE
   */
  const handlePlayer1Change = useCallback(
    (
      _event: SyntheticEvent<Element, Event>,
      newValue: {
        label: string | undefined;
        id: string;
        selected: boolean;
      } | null
    ) => {
      if (newValue) {
        setPlayer1({
          label: newValue.label || "", // Ensure label is always a string
          id: newValue.id, // id is guaranteed to be a string
          selected: newValue.selected,
        });
      } else {
        setPlayer1({
          label: "", // Ensure label is always a string
          id: "", // id is guaranteed to be a string
          selected: false,
        });
      }
    },
    []
  );

  /**
   * Handler for selecting player 2
   * @param _event React.SyntheticEvent
   * @param newValue AUTOCOMPLETE_ABSTRACT_TYPE
   */
  const handlePlayer2Change = useCallback(
    (
      _event: SyntheticEvent,
      newValue: {
        label: string | undefined;
        id: string;
        selected: boolean;
      } | null
    ) => {
      if (newValue) {
        setPlayer2({
          label: newValue.label || "", // Ensure label is always a string
          id: newValue.id, // id is guaranteed to be a string
          selected: newValue.selected,
        });
      } else {
        setPlayer2({
          label: "", // Ensure label is always a string
          id: "", // id is guaranteed to be a string
          selected: false,
        });
      }
    },
    []
  );

  /**
   * Clearing selected season on handle and fire callback prop
   */
  const localHandleClose = useCallback(() => {
    dispatch(setSelectedSeason(selectedSeasonInitialData));
    resetForm();
    if (handleClose) handleClose();
  }, [dispatch, handleClose]);

  /**
   * Handle onAddresults callback prop
   */
  const localNewResultSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const dataToSend: MATCH_TYPE = {
        seasonName: selectedSeason?.seasonName,
        seasonGroup: pickedGroup,
        player1: player1,
        player1set1: player1Set1Ref.current?.value,
        player1tiebreak1: player1Set1TiebreakRef.current?.value,
        player1set2: player1Set2Ref.current?.value,
        player1tiebreak2: player1Set2TiebreakRef.current?.value,
        player1set3: player1Set3Ref.current?.value,
        player2: player2,
        player2set1: player2Set1Ref.current?.value,
        player2tiebreak1: player2Set1TiebreakRef.current?.value,
        player2set2: player2Set2Ref.current?.value,
        player2tiebreak2: player2Set2TiebreakRef.current?.value,
        player2set3: player2Set3Ref.current?.value,
      };
      if (newResultSubmit) newResultSubmit(e, dataToSend);
      resetForm();
      localHandleClose();
    },
    [
      localHandleClose,
      newResultSubmit,
      pickedGroup,
      player1,
      player2,
      selectedSeason?.seasonName,
    ]
  );

  return (
    <Dialog
      open={open}
      {...restProps}
      slotProps={{
        paper: {
          component: "form",
          sx: {
            height: "100%",
            width: "100%",
            maxWidth: 650,
            maxHeight: 650,
          },
          onSubmit: localNewResultSubmit,
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormControl>
          <Autocomplete
            value={pickedSeason}
            onChange={handleSeasonOnChange}
            inputValue={seasonInputValue}
            onInputChange={(_event, newInputValue) => {
              setSeasonInputValue(newInputValue);
            }}
            options={parsedSeasonsToOptions}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => <TextField {...params} label="Season" />}
          />
        </FormControl>
        <Divider />
        <FormControl>
          <Autocomplete
            value={pickedGroup}
            onChange={handleGroupOnChange}
            inputValue={groupInputValue}
            onInputChange={(_event, newInputValue) => {
              setGroupInputValue(newInputValue);
            }}
            options={parsedSelectedSeasonGroupsToOptions}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => <TextField {...params} label="Group" />}
          />
        </FormControl>
        <Divider />
        <FormControl sx={{ gap: 2, flexWrap: "wrap" }}>
          <Autocomplete
            sx={{ flex: 1 }}
            value={player1}
            onChange={handlePlayer1Change}
            inputValue={player1InputValue}
            onInputChange={(_event, newInputValue) => {
              setplayer1InputValue(newInputValue);
            }}
            options={parsedSelectedSeasonGroupParticipantsToOptions}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => <TextField {...params} label="Player 1" />}
          />
          <Box gap={2} display={"flex"}>
            <TextField
              inputRef={player1Set1Ref}
              sx={{ width: 70 }}
              label="Set 1"
            />
            <TextField
              inputRef={player1Set1TiebreakRef}
              sx={{ width: 90 }}
              label="Tiebreak 2"
            />
            <TextField
              inputRef={player1Set2Ref}
              sx={{ width: 70 }}
              label="Set 2"
            />
            <TextField
              inputRef={player1Set2TiebreakRef}
              sx={{ width: 90 }}
              label="Tiebreak 2"
            />
            <TextField
              inputRef={player1Set3Ref}
              sx={{ width: 70 }}
              label="Set 3"
            />
          </Box>
        </FormControl>
        <Divider />
        <FormControl sx={{ gap: 2, flexWrap: "wrap" }}>
          <Autocomplete
            sx={{ flex: 1 }}
            value={player2}
            onChange={handlePlayer2Change}
            inputValue={player2InputValue}
            onInputChange={(_event, newInputValue) => {
              setplayer2InputValue(newInputValue);
            }}
            options={parsedSelectedSeasonGroupParticipantsToOptions}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => <TextField {...params} label="Player 2" />}
          />
          <Box gap={2} display={"flex"}>
            <TextField
              inputRef={player2Set1Ref}
              sx={{ width: 70 }}
              label="Set 1"
            />
            <TextField
              inputRef={player2Set1TiebreakRef}
              sx={{ width: 90 }}
              label="Tiebreak 2"
            />
            <TextField
              inputRef={player2Set2Ref}
              sx={{ width: 70 }}
              label="Set 2"
            />
            <TextField
              inputRef={player2Set2TiebreakRef}
              sx={{ width: 90 }}
              label="Tiebreak 2"
            />
            <TextField
              inputRef={player2Set3Ref}
              sx={{ width: 70 }}
              label="Set 3"
            />
          </Box>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={localHandleClose}>Close</Button>
        <Button variant="contained" type="submit">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(AddMatchScoreDialog);
