import { FC, SyntheticEvent } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { SEASON } from "../../Types";
import Button from "@mui/material/Button";

interface SeasonCardProps extends SEASON {
  onClick: (event: SyntheticEvent) => void;
}

const SeasonCard: FC<SeasonCardProps> = ({
  seasonName,
  seasonGroups,
  seasonParticipants,
  onClick,
  ...restProps
}) => {
  return (
    <>
      <Card raised {...restProps}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {seasonName}
          </Typography>
          <Typography>{seasonGroups.length} groups</Typography>
          <Typography>{seasonParticipants?.length} participants</Typography>
          <Button onClick={onClick}>Edit</Button>
        </CardContent>
      </Card>
    </>
  );
};

export default SeasonCard;
