import React, { FC, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Box, Button, FormControl, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface ProfilePictureHolderProps {
  size?: number;
}

interface PROFILE_PHOTO_UPLOAD_PROPS {
  propHandleUpload: (uploadedImage: File | null) => void;
  btnText?: string;
  tempImg?: string;
}

const ProfilePictureHolder = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size",
})<ProfilePictureHolderProps>(({ theme, size = 200 }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "50%",
  width: size,
  height: size,
  background: theme.palette.action.disabledBackground,

  "& img": {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover",
    textIndent: "-9999px",
  },
}));

const ProfilePhotoUpload: FC<PROFILE_PHOTO_UPLOAD_PROPS> = ({
  propHandleUpload,
  btnText = "Upload profile picture",
  tempImg,
}) => {
  const userData = useSelector((state: RootState) => state.player.userData);
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      propHandleUpload(file);
      setImage(file);
    }
  };

  const handleUpload = () => {
    propHandleUpload(image);
  };

  return (
    <FormControl sx={{ alignItems: "center", gap: 2 }}>
      <ProfilePictureHolder
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <img src={tempImg || userData.photo} alt={"profilePicture"} />
      </ProfilePictureHolder>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onClick={handleUpload}
      >
        {btnText}
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
      </Button>
    </FormControl>
  );
};

export default ProfilePhotoUpload;
