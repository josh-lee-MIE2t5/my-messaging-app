import { Box, SvgIconTypeMap, Typography, useMediaQuery } from "@mui/material";
import styles from "../styles/NavigationControlBtn.module.css";
import Link from "next/link";

interface Props {
  text: string;
  atUrl: Boolean;
  url: string;
  icon: JSX.Element;
  isAtleastMediumScreen: boolean;
}

function NavigationControlBtn({
  text,
  atUrl,
  icon,
  url,
  isAtleastMediumScreen,
}: Props) {
  return (
    <Box className={styles.NavigationBtnNotAtUrl}>
      <Link
        className={styles.iconAndTextWrapper}
        style={{ justifyContent: isAtleastMediumScreen ? "left" : "center" }}
        href={url}
      >
        {icon}
        {isAtleastMediumScreen && (
          <Typography className={styles.NavigationBtnText}>{text}</Typography>
        )}
      </Link>
    </Box>
  );
}

export default NavigationControlBtn;
