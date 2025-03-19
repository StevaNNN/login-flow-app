import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { updateUserData, uploadPicture } from "../../api";
import {
  setUserData,
  setUserEmail,
  setUserFullName,
  setUserName,
} from "../../redux/slices/playerSlice";

import { setSnackBar } from "../../redux/slices/appSlice";

const PlayerPage = () => {
  // const { seasons } = useSelector((state: RootState) => state.seasons);
  // const userId = userData?._id;
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.player);
  const { snackBar } = useSelector((state: RootState) => state.appState);
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

    try {
      const req = await updateUserData(userData);
      dispatch(setSnackBar({ message: req.data.message }));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setSnackBar({ message: err.message }));
      }
    }
    setTimeout(() => {
      dispatch(setSnackBar({ message: "" }));
    }, snackBar.autoHideDuration);
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
              onChange={(e) => dispatch(setUserFullName(e.target.value))}
              label="Full name"
              placeholder="Full Name"
              value={userData.fullName}
            />
          </FormControl>
          <FormControl>
            <TextField
              type="text"
              id="userName"
              onChange={(e) => dispatch(setUserName(e.target.value))}
              label="User name"
              placeholder="User name"
              value={userData.userName}
            />
          </FormControl>
          <FormControl>
            <TextField
              type="email"
              onChange={(e) => dispatch(setUserEmail(e.target.value))}
              label="Email"
              id="email"
              placeholder="Email"
              value={userData.email}
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
