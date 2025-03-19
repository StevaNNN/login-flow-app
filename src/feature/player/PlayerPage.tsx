import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { updateUserData, uploadPicture } from "../../api";
import { setUserData } from "../../redux/slices/playerSlice";

import { setSnackBar } from "../../redux/slices/appSlice";

const PlayerPage = () => {
  // const { seasons } = useSelector((state: RootState) => state.seasons);
  // const { seasons: playerSeasons } = useSelector((state: RootState) => state.player);
  // const userId = userData?._id;

  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.player);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // const getUserSeasons = useCallback(() => {
  //   const userSeasons: typeof seasons = [];
  //   seasons.forEach((season) => {
  //     season.seasonGroups.forEach((seasonGroup) => {
  //       seasonGroup.participants.forEach((seasonParticipant) => {
  //         if (seasonParticipant.id === userId) {
  //           userSeasons.push(season);
  //         }
  //       });
  //     });
  //   });
  //   return userSeasons;
  // }, [userId, seasons]);

  /**
   * Initial data fetch and send to store
   */
  // useEffect(() => {
  //   const initData = async () => {
  //     try {
  //       const seasonResponse = await getSeasons();
  //       dispatch(setSeasons(seasonResponse.data));
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   initData();
  //   dispatch(setSeasonsUserPlayed(getUserSeasons()));
  // }, []);

  /**
   * Handle update form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const _userData = { ...userData };
    if (fullNameRef.current || userNameRef.current || emailRef.current) {
      _userData.fullName = fullNameRef.current?.value;
      _userData.userName = userNameRef.current?.value;
      _userData.email = emailRef.current?.value;
    }
    try {
      const req = await updateUserData({ ...userData, ..._userData });
      dispatch(setUserData(_userData));
      dispatch(setSnackBar({ message: req.data.message }));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setSnackBar({ message: err.message }));
      }
    }
  };

  /**
   * Updates profile picture
   */
  const updateProfilePicture = async (uploadedImage: File | null) => {
    if (!uploadedImage) return;

    const formData = new FormData();
    formData.append("image", uploadedImage);

    try {
      const response = await uploadPicture(formData);
      dispatch(setUserData({ ...userData, photo: response.data.imageUrl }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <Stack
        spacing={4}
        direction="column"
        maxWidth={600}
        margin="auto"
        height={"calc(100vh - 72px - 24px - 24px)"} // header - padding-top - padding-bottom
        justifyContent="center"
        p={2}
      >
        <Typography
          color="primary"
          fontWeight="bold"
          align="center"
          variant={"h4"}
        >
          Player info
        </Typography>
        <Stack
          onSubmit={handleSubmit}
          component={"form"}
          spacing={3}
          direction="column"
        >
          <ProfilePhotoUpload propHandleUpload={updateProfilePicture} />
          <FormControl>
            <TextField
              type="text"
              id="fullName"
              label="Full name"
              placeholder="Full Name"
              defaultValue={userData.fullName}
              inputRef={fullNameRef}
            />
          </FormControl>
          <FormControl>
            <TextField
              type="text"
              id="userName"
              label="User name"
              placeholder="User name"
              defaultValue={userData.userName}
              inputRef={userNameRef}
            />
          </FormControl>
          <FormControl>
            <TextField
              type="email"
              label="Email"
              id="email"
              placeholder="Email"
              defaultValue={userData.email}
              inputRef={emailRef}
            />
          </FormControl>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button size="large" variant="contained" type="submit">
              Update
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default PlayerPage;
