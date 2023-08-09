import ReactFCProps from "@/types/ReactFCProps.types";
import { List, ListItem, Typography } from "@mui/material";
import styles from "../styles/SideNav.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

function SideNav({ children }: ReactFCProps) {
  const authContext = useContext(AuthContext);
  return (
    <>
      {authContext?.user && (
        <section className={styles.wrapper}>
          <div className={styles.nav}>
            <span>LOGO</span>
            <List className={styles.navBtnList} component="nav">
              <ListItem className={styles.navBtn} button>
                <Typography>Profile</Typography>
              </ListItem>
              <ListItem className={styles.navBtn} button>
                <Typography>Your Friends</Typography>
              </ListItem>
              <ListItem className={styles.navBtn} button>
                <Typography>Switch Mode</Typography>
              </ListItem>
              <ListItem className={styles.navBtn} button>
                <Typography>Report Issue</Typography>
              </ListItem>
              <ListItem className={styles.navBtn} button>
                <Typography>Sign out</Typography>
              </ListItem>
            </List>
          </div>
          {children}
        </section>
      )}
    </>
  );
}

export default SideNav;
