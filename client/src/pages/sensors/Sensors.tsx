import React, { useEffect } from "react";
import { Typography, CircularProgress, Alert } from "@mui/material";
import SensorForm from "./components/SensorForm";
import SensorList from "./components/SensorList";
import { useSensors } from "../../hooks/useSensors";

const SensorsPage: React.FC = () => {
  const {
    sensors,
    loading,
    error,
    removeSensor,
    addSensor,
    updateSensorConfig,
    toggleSensorEnabled,
    triggerSensorById,
  } = useSensors();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom color="primary">
        Manage Sensors
      </Typography>
      <SensorForm onAddSensor={addSensor} />
      <SensorList
        sensors={sensors}
        onDelete={removeSensor}
        onUpdateConfig={updateSensorConfig}
        onToggleEnabled={toggleSensorEnabled}
        onTriggerSensor={triggerSensorById}
      />
    </div>
  );
};

export default SensorsPage;
