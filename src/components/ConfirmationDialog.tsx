import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export interface ConfirmationDialogRawProps extends DialogProps {
  onOk: () => void;
  title: string;
  message?: string;
}

const ConfirmationDialog = (props: ConfirmationDialogRawProps) => {
  const { onClose, onOk, title, message } = props;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      {...props}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{message}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={onOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
