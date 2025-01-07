import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import { Toaster } from "react-hot-toast";

import darkTheme from "./theme";
import Home from "./pages/home/Home";
import SensorsPage from "./pages/sensors/Sensors";
import Navbar from "./components/Navbar";
import IncidentPage from "./pages/incidents/Incidents";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sensors" element={<SensorsPage />} />
            <Route path="/incidents" element={<IncidentPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
