import { useState } from "react";
import Link from "next/link";
import useSignIn from "@/hooks/useSignIn";
import useOnChange from "@/hooks/useOnChange";
import {
  InputLabel,
  FormControl,
  TextField,
  Button,
  Divider,
  Typography,
  Grid,
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import styles from "../styles/Login.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onChange = useOnChange();

  interface formDetailsInterface {
    email: string;
    password: string;
  }
  const [formDetails, setFormDetails] = useState<formDetailsInterface>({
    email: "",
    password: "",
  });
  const { signInUserEmail, signInWithGoogle } = useSignIn();
  return (
    <div className={styles.container}>
      <FormControl className={styles.form}>
        <TextField
          className={styles.textfield}
          id="email"
          label="Email"
          name="email"
          variant="outlined"
          value={formDetails.email}
          onChange={(e) => {
            onChange(e, setFormDetails);
          }}
        />
        <FormControl>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            name="password"
            onChange={(e) => {
              onChange(e, setFormDetails);
            }}
            value={formDetails.password}
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button
          className={styles.textfield}
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            signInUserEmail(formDetails.email, formDetails.password);
          }}
        >
          Login
        </Button>

        <Box>
          <Divider variant="middle" className={styles.orLineBreak}>
            <Typography>OR</Typography>
          </Divider>
        </Box>
        <Grid
          onClick={(e) => {
            signInWithGoogle();
          }}
          style={{ width: "20rem", marginTop: "0.5em", cursor: "pointer" }}
          container
        >
          <Grid style={{ textAlign: "end" }} xs={4} item>
            <GoogleIcon />
          </Grid>
          <Grid xs={6} item>
            <Typography style={{ marginLeft: "0.5em" }}>
              Login with Google
            </Typography>
          </Grid>
        </Grid>
      </FormControl>
      <div className={styles.noAccount}>
        <Typography>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </Typography>
      </div>
    </div>
  );
}

export default Login;
