import { Alert, CircularProgress } from "@mui/material";
import React from "react";
import { useIncidents } from "../../hooks/useIncidents";
import IncidentList from "./components/IncidentList";

const IncidentPage: React.FC = () => {
  const { incidents, loading, error } = useIncidents();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return <IncidentList incidents={incidents} />;
};

export default IncidentPage;
