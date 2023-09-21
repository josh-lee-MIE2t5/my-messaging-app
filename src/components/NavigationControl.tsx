import styles from "../styles/NavigationControl.module.css";
import { useRouter } from "next/router";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import GroupIcon from "@mui/icons-material/Group";
import NavigationControlBtn from "./NavigationControlBtn";
import { useMediaQuery, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useContext } from "react";
import { FindChatRoomPopUpContext } from "@/context/FindChatRoomPopUpContext";

function NavigationControl() {
  //Hooks
  const findChatRoomPopUpContext = useContext(FindChatRoomPopUpContext);
  const { asPath } = useRouter();
  const isAtleastMediumScreen = useMediaQuery("(min-width:900px)");

  //dynamic style based on the hook above that is used to check the screen size
  const iconStyles = { marginLeft: isAtleastMediumScreen ? "0.75em" : "0" };

  const NavButtonsDetails = [
    {
      text: "Friends",
      url: "/friends",
      icon: <GroupIcon fontSize="large" style={iconStyles} />,
    },
    {
      text: "Profile",
      url: `/profiles/${"myAccountid"}`,
      icon: <AccountBoxIcon fontSize="large" style={iconStyles} />,
    },
    {
      text: "Settings",
      url: "/settings",
      icon: <SettingsIcon fontSize="large" style={iconStyles} />,
    },
  ];

  return (
    <section className={styles.NavigationControlHolder}>
      <div className={styles.NavigationChatroomFinderWrapper}>
        <button
          onClick={(e) => {
            if (findChatRoomPopUpContext) findChatRoomPopUpContext.toggle();
          }}
          className={styles.NavigationChatroomFinderBtn}
        >
          {isAtleastMediumScreen ? (
            <Typography className={styles.NavigationChatroomFinderText}>
              Find or start a conversation
            </Typography>
          ) : (
            <SearchIcon className={styles.NavigationChatroomFinderIcon} />
          )}
        </button>
      </div>
      <div className={styles.NavigationBtnsContainer}>
        {NavButtonsDetails.map(({ text, url, icon }) => (
          <NavigationControlBtn
            key={text}
            text={text}
            url={url}
            atUrl={url === asPath}
            icon={icon}
            isAtleastMediumScreen={isAtleastMediumScreen}
          />
        ))}
      </div>
    </section>
  );
}

export default NavigationControl;
