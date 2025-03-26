import React from "react";
import { Alert, IconButton, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AlertMessage = ({ severity, message, show, onClose }) => {
  return (
    <Collapse in={show}>
      <Alert
        severity={severity}
        action={
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <strong>{message}</strong>
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;
