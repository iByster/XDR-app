import { useState, useEffect, useCallback } from "react";
import {
  createSensor,
  deleteSensor,
  getAllSensors,
  triggerSensor,
  updateSensor,
} from "../services/sensorService";
import Sensor from "../models/Sensor";

export const useSensors = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSensors();
      setSensors(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sensors.");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeSensor = async (id: number) => {
    try {
      await deleteSensor(id);
      setSensors((prevSensors) =>
        prevSensors.filter((sensor) => sensor.id !== id)
      );
      setError(null);
    } catch (err) {
      setError("Failed to delete sensor.");
    }
  };

  const toggleSensorEnabled = async (sensor: Sensor) => {
    try {
      const updatedSensor = await updateSensor(sensor.id, {
        enabled: !sensor.enabled,
      });
      setSensors((prevSensors) =>
        prevSensors.map((s) =>
          s.id === sensor.id ? { ...s, enabled: updatedSensor.enabled } : s
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to toggle sensor.");
    }
  };

  const updateSensorConfig = async (sensorId: number, newConfig: any) => {
    try {
      const updatedSensor = await updateSensor(sensorId, { config: newConfig });
      setSensors((prevSensors) =>
        prevSensors.map((s) =>
          s.id === sensorId ? { ...s, config: updatedSensor.config } : s
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to update sensor configuration.");
      throw err; // Re-throw to handle in the component
    }
  };

  const addSensor = async (sensorData: Omit<Sensor, "id">) => {
    try {
      setLoading(true);
      const newSensor = await createSensor(sensorData);
      setSensors((prevSensors) => [...prevSensors, newSensor]);
      setError(null);
    } catch (err) {
      setError("Failed to add sensor.");
    } finally {
      setLoading(false);
    }
  };

  // New triggerSensor method
  const triggerSensorById = async (sensorId: number) => {
    try {
      await triggerSensor(sensorId); // Call the trigger function from the service
      setError(null);
    } catch (err) {
      setError("Failed to trigger sensor.");
    }
  };

  useEffect(() => {
    fetchSensors();
  }, [fetchSensors]);

  return {
    sensors,
    loading,
    error,
    fetchSensors,
    removeSensor,
    toggleSensorEnabled,
    addSensor,
    updateSensorConfig,
    triggerSensorById,
  };
};
