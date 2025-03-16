import { FC, SyntheticEvent } from "react";
import Typography from "@mui/material/Typography";
import Card, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { SEASON } from "../Types";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";

interface SeasonCardProps extends SEASON, CardProps {
  onEdit: (event: SyntheticEvent) => void;
  onDelete: (event: SyntheticEvent) => void;
}

const SeasonCard: FC<SeasonCardProps> = ({
  seasonName,
  seasonGroups,
  seasonParticipants,
  onEdit,
  onDelete,
  ...restProps
}) => {
  return (
    <>
      <Card raised {...restProps} style={{ minWidth: 200, borderRadius: 16 }}>
        <CardHeader title={seasonName}></CardHeader>
        <CardContent>
          <Typography>{seasonGroups.length} groups</Typography>
          <Typography>{seasonParticipants?.length} participants</Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button size="small" variant="contained" onClick={onEdit}>
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={onDelete}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default SeasonCard;
