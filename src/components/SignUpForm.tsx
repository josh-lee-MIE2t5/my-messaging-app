import { useState } from "react";
import Link from "next/link";
import useSignIn from "@/hooks/useSignIn";
import useSignUp from "@/hooks/useSignUp";
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
import styles from "../styles/SignUpForm.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function SignUpForm() {
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
    username: string;
  }
  const [formDetails, setFormDetails] = useState<formDetailsInterface>({
    email: "",
    password: "",
    username: "",
  });
  const { signInWithGoogle } = useSignIn();
  const signUp = useSignUp();
  return (
    <div className={styles.container}>
      <FormControl className={styles.form}>
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
        <Box>
          <Divider variant="middle" className={styles.orLineBreak}>
            <Typography>OR</Typography>
          </Divider>
        </Box>
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
        <TextField
          className={styles.textfield}
          id="username"
          label="Username"
          name="username"
          variant="outlined"
          value={formDetails.username}
          onChange={(e) => {
            onChange(e, setFormDetails);
          }}
        />
        <FormControl className={styles.textfield}>
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
          className={styles.signUpWithEmail}
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            signUp(
              formDetails.email,
              formDetails.password,
              formDetails.username
            );
          }}
        >
          Sign Up
        </Button>
      </FormControl>
      <div className={styles.noAccount}>
        <Typography>
          Already have an account? <Link href="/">Login</Link>
        </Typography>
      </div>
    </div>
  );
}

export default SignUpForm;
