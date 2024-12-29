import { createTheme } from "@mui/material/styles";
import { deepOrange, grey } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: deepOrange[500],
    },
    background: {
      default: grey[900],
      paper: grey[800],
    },
  },
});

export default darkTheme;
