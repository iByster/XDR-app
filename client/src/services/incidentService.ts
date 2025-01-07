import axios from "axios";
import toast from "react-hot-toast";
import Incident from "../models/Incident";

const INCIDENTS_API_URL = process.env.REACT_APP_API_URL + "/incidents";

export const getAllIncidents = async (): Promise<Incident[]> => {
  try {
    const response = await axios.get(INCIDENTS_API_URL);
    const incidentsData = response.data;
    return incidentsData.map((incident: any) => new Incident(incident));
  } catch (error) {
    toast.error("Failed to load incidents");
    return [];
  }
};
