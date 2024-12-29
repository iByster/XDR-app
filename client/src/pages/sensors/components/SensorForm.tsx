import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { getSensorTypes } from "../../../services/sensorService";

interface SensorFormProps {
  onAddSensor: (sensorData: any) => Promise<void>;
}

const SensorForm: React.FC<SensorFormProps> = ({ onAddSensor }) => {
  const [sensorTypes, setSensorTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [config, setConfig] = useState("");
  const [configError, setConfigError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSensorTypes = async () => {
      const types = await getSensorTypes();
      setSensorTypes(types);
    };
    fetchSensorTypes();
  }, []);

  const isValidJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidJson(config)) {
      setConfigError("Invalid JSON format");
      return;
    }

    setConfigError(null);
    setIsSubmitting(true);

    try {
      await onAddSensor({
        sensorType: selectedType,
        config: JSON.parse(config),
        enabled: true,
      });

      setSelectedType("");
      setConfig("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mb: 5, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5" gutterBottom color="primary">
        Create New Sensor
      </Typography>

      <TextField
        select
        label="Sensor Type"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        fullWidth
        required
        disabled={isSubmitting}
      >
        {sensorTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Config (JSON)"
        multiline
        rows={4}
        value={config}
        onChange={(e) => {
          const value = e.target.value;
          setConfig(value);
          if (value && !isValidJson(value)) {
            setConfigError("Invalid JSON format");
          } else {
            setConfigError(null);
          }
        }}
        required
        fullWidth
        error={!!configError}
        helperText={configError}
        disabled={isSubmitting}
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        disabled={isSubmitting || !!configError || !selectedType || !config}
      >
        {isSubmitting ? "Creating..." : "Create Sensor"}
      </Button>
    </Box>
  );
};

export default SensorForm;
