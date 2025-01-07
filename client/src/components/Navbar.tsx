import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sensor Management
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/sensors">
            Sensors
          </Button>
          <Button color="inherit" component={Link} to="/incidents">
            Incidents
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
