import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Incident from "../../../models/Incident";
import { Info } from "@mui/icons-material";

interface IncidentListProps {
  incidents: Incident[];
}

const severityIcons: Record<
  "critical" | "high" | "medium" | "low",
  React.ReactElement
> = {
  critical: <ReportProblemIcon style={{ color: "red" }} />,
  high: <WarningIcon style={{ color: "orange" }} />,
  medium: <InfoIcon style={{ color: "#87CEEB" }} />,
  low: <CheckCircleIcon style={{ color: "green" }} />,
};

const IncidentList: React.FC<IncidentListProps> = ({ incidents }) => {
  return (
    <div>
      <Typography variant="h4" gutterBottom color="primary">
        Manage Incidents
      </Typography>
      {incidents.map((incident) => (
        <Accordion key={incident.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${incident.id}-content`}
            id={`panel${incident.id}-header`}
          >
            <Box display="flex" alignItems="center">
              {severityIcons[
                incident.severity.toLowerCase() as keyof typeof severityIcons
              ] ?? <Info style={{ color: "gray" }} />}
              &nbsp;
              <Typography variant="h6">
                {incident.title} - Severity: {incident.severity}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box mb={2}>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Description:</strong> {incident.description}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Recommendations:</strong>
              </Typography>
              {incident.recommendations.length > 0 ? (
                incident.recommendations.map((rec) => (
                  <Box key={rec.id} pl={2} mb={1}>
                    <Typography variant="body1" color="textPrimary">
                      • <strong>{rec.title}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {rec.description}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No recommendations available.
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default IncidentList;
