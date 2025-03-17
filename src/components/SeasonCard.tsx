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
      <Card raised {...restProps} style={{ minWidth: 200 }}>
        <CardHeader sx={{ p: 4, pb: 0 }} title={seasonName}></CardHeader>
        <CardContent sx={{ p: 4 }}>
          <Typography>{seasonGroups.length} groups</Typography>
          <Typography>{seasonParticipants?.length} participants</Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 4, gap: 4 }}>
          <Button variant="contained" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default SeasonCard;
