import React from "react";
import { Typography } from "@mui/material";

const Home: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom color="primary">
        Welcome to the Sensor Management System
      </Typography>
      <Typography variant="body1">
        This is the home page. Navigate to the "Sensors" tab to manage sensors.
      </Typography>
    </div>
  );
};

export default Home;
