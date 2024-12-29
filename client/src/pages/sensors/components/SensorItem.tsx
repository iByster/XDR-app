import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  IconButton,
  Switch,
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  PlayArrow,
} from "@mui/icons-material";
import Sensor from "../../../models/Sensor";

interface SensorItemProps {
  sensor: Sensor;
  onDelete: (id: number) => void;
  onToggleEnabled: (sensor: Sensor) => void;
  onUpdateConfig: (sensorId: number, newConfig: any) => Promise<void>;
  onTrigger: (id: number) => Promise<void>;
}

const SensorItem: React.FC<SensorItemProps> = ({
  sensor,
  onDelete,
  onToggleEnabled,
  onUpdateConfig,
  onTrigger,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [configText, setConfigText] = useState("");
  const [configError, setConfigError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setConfigText(JSON.stringify(sensor.config, null, 2));
    setIsEditing(false);
    setConfigError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setConfigError(null);
  };

  const validateJson = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateJson(configText)) {
      setConfigError("Invalid JSON format");
      return;
    }

    try {
      await onUpdateConfig(sensor.id, JSON.parse(configText));
      handleCloseModal();
    } catch (error) {
      setConfigError("Failed to update config");
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{sensor.id}</TableCell>
        <TableCell>{sensor.sensorType}</TableCell>
        <TableCell>
          <IconButton onClick={handleOpenModal} color="primary" size="small">
            <ViewIcon />
          </IconButton>
        </TableCell>
        <TableCell>
          <Switch
            checked={sensor.enabled}
            onChange={() => onToggleEnabled(sensor)}
            color="primary"
          />
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={() => onTrigger(sensor.id)} color="primary">
            <PlayArrow />
          </IconButton>
          <IconButton
            onClick={() => onDelete(sensor.id)}
            color="error"
            aria-label="delete"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="config-modal-title"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Sensor Configuration
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={isEditing}
                onChange={(e) => setIsEditing(e.target.checked)}
                color="primary"
              />
            }
            label="Enable editing"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={12}
            value={configText}
            onChange={(e) => {
              setConfigText(e.target.value);
              setConfigError(null);
            }}
            error={!!configError}
            helperText={configError}
            disabled={!isEditing}
            sx={{
              mb: 2,
              "& .MuiInputBase-input": {
                fontFamily: "monospace",
                fontSize: "0.9rem",
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
            {isEditing && (
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                disabled={!!configError}
              >
                Save Changes
              </Button>
            )}
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default SensorItem;
