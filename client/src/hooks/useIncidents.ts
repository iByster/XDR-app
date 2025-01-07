import { useState, useEffect, useCallback } from "react";
import { getAllIncidents } from "../services/incidentService";
import Incident from "../models/Incident";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllIncidents();
      setIncidents(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch incidents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    loading,
    error,
    fetchIncidents,
  };
};
