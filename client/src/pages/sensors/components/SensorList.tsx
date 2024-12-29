import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import SensorItem from "./SensorItem";
import Sensor from "../../../models/Sensor";

interface SensorListProps {
  sensors: Sensor[];
  onDelete: (id: number) => void;
  onToggleEnabled: (sensor: Sensor) => void;
  onUpdateConfig: (sensorId: number, newConfig: any) => Promise<void>;
  onTriggerSensor: (sensorId: number) => Promise<void>;
}

const SensorList: React.FC<SensorListProps> = ({
  sensors,
  onDelete,
  onToggleEnabled,
  onUpdateConfig,
  onTriggerSensor,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Config</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sensors.map((sensor) => (
            <SensorItem
              key={sensor.id}
              sensor={sensor}
              onDelete={onDelete}
              onToggleEnabled={onToggleEnabled}
              onUpdateConfig={onUpdateConfig}
              onTrigger={onTriggerSensor}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SensorList;
