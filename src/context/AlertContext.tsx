import ReactFCProps from "@/types/ReactFCProps.types";
import { createContext, useEffect } from "react";
import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export interface AlertContextType {
  error: Error | null;
  msg: string | null;
  type: "error" | "warning" | "info" | "success";
  setError: Function;
  setMsg: Function;
  setType: Function;
}

export const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: ReactFCProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [type, setType] = useState<"error" | "warning" | "info" | "success">(
    "success"
  );

  useEffect(() => {
    if (error && msg) {
      setOpen(true);
    }
  }, [error, msg, type]);
  return (
    <AlertContext.Provider
      value={{ error, setError, msg, setMsg, type, setType }}
    >
      <Collapse in={open}>
        <Alert
          severity={type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
                setError(null);
                setMsg(null);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {msg}
        </Alert>
      </Collapse>
      {children}
    </AlertContext.Provider>
  );
}
