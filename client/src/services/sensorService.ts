import axios from "axios";
import toast from "react-hot-toast";
import Sensor from "../models/Sensor";

const SENSORS_ENDPOINT = "/sensors";
const SENSORS_API_URL = process.env.REACT_APP_API_URL + SENSORS_ENDPOINT;

export const getSensorTypes = async () => {
  try {
    const response = await axios.get(`${SENSORS_API_URL}/types`);
    return response.data;
  } catch (error) {
    toast.error("Failed to load sensor types");
  }
};

// Get all sensors
export const getAllSensors = async () => {
  try {
    const response = await axios.get(SENSORS_API_URL);
    return response.data;
  } catch (error) {
    toast.error("Failed to load sensors");
  }
};

// Create a new sensor
export const createSensor = async (sensorData: Omit<Sensor, "id">) => {
  try {
    const response = await axios.post(SENSORS_API_URL, sensorData);
    toast.success("Sensor created successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to create sensor");
  }
};

// Update sensor (only `enabled` and `config`)
export const updateSensor = async (
  id: number,
  updatedData: Partial<Sensor>
) => {
  try {
    const response = await axios.put(`${SENSORS_API_URL}/${id}`, updatedData);
    toast.success("Sensor updated successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to update sensor");
  }
};

// Delete a sensor
export const deleteSensor = async (id: number) => {
  try {
    const response = await axios.delete(`${SENSORS_API_URL}/${id}`);
    toast.success("Sensor deleted successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to delete sensor");
  }
};

// Add triggerSensor method
export const triggerSensor = async (id: number) => {
  try {
    const response = await axios.post(`${SENSORS_API_URL}/${id}/trigger`);
    toast.success("Sensor triggered successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to trigger sensor");
  }
};
