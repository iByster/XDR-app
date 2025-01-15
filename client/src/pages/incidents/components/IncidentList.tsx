import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid2 as Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AlertIcon from "@mui/icons-material/ErrorOutline";
import PeopleIcon from "@mui/icons-material/People";
import AttachmentIcon from "@mui/icons-material/Attachment";
import RecommendationIcon from "@mui/icons-material/TipsAndUpdates";
import Incident from "../../../models/Incident";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface IncidentListProps {
  incidents: Incident[];
}

// Define severity icons
const severityIcons: Record<
  "critical" | "high" | "medium" | "low",
  React.ReactElement
> = {
  critical: <ReportProblemIcon style={{ color: "red" }} />,
  high: <WarningIcon style={{ color: "orange" }} />,
  medium: <InfoIcon style={{ color: "#87CEEB" }} />,
  low: <CheckCircleIcon style={{ color: "green" }} />,
};

// Define severity values and labels
const severityValues: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const severityLabels: Record<number, string> = {
  4: "critical",
  3: "high",
  2: "medium",
  1: "low",
};

// Function to calculate the median severity
const getMedianSeverity = (alerts: any[]) => {
  if (!alerts || alerts.length === 0) return "low";

  const severityScores = alerts
    .map((alert) => severityValues[alert.severity.toLowerCase()])
    .sort((a, b) => a - b);

  const middle = Math.floor(severityScores.length / 2);
  const median =
    severityScores.length % 2 === 0
      ? (severityScores[middle - 1] + severityScores[middle]) / 2
      : severityScores[middle];

  return severityLabels[Math.round(median)];
};

const IncidentList: React.FC<IncidentListProps> = ({ incidents }) => {
  const [activeTab, setActiveTab] = useState<{ [key: number]: number }>({});

  const handleTabChange = (incidentId: number, newValue: number) => {
    setActiveTab((prev) => ({
      ...prev,
      [incidentId]: newValue,
    }));
  };

  return (
    <div style={{ marginBottom: 70 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Manage Incidents
      </Typography>
      {incidents.map((incident) => {
        const medianSeverity = getMedianSeverity(incident.alerts);

        return (
          <Accordion key={incident.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${incident.id}-content`}
              id={`panel${incident.id}-header`}
            >
              <Box display="flex" alignItems="center" flexGrow={1}>
                {severityIcons[
                  medianSeverity as keyof typeof severityIcons
                ] ?? <InfoIcon style={{ color: "gray" }} />}
                &nbsp;
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                  {incident.title}
                </Typography>
                <Chip
                  icon={<AlertIcon />}
                  label={`Alerts: ${incident.alerts.length}`}
                  color="primary"
                  size="small"
                  style={{ marginRight: "8px" }}
                />
                <Chip
                  label={`Average Severity: ${medianSeverity}`}
                  color="secondary"
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Tabs
                value={activeTab[incident.id] || 0}
                onChange={(e, newValue) =>
                  handleTabChange(incident.id, newValue)
                }
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab icon={<AlertIcon />} label="Alerts" />
                <Tab icon={<PeopleIcon />} label="Actors" />
                <Tab icon={<AttachmentIcon />} label="Resources" />
                <Tab icon={<RecommendationIcon />} label="Recommendations" />
              </Tabs>
              <Divider />
              <Box mt={2}>
                {activeTab[incident.id] === 0 && (
                  <Grid container spacing={2}>
                    {incident.alerts.map((alert) => (
                      <Grid size={6} key={alert.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6">{alert.title}</Typography>
                            <Typography color="textSecondary">
                              {alert.description}
                            </Typography>
                            <Chip
                              label={`Severity: ${alert.severity}`}
                              color="warning"
                              size="small"
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
                {activeTab[incident.id] === 1 && (
                  <Grid container spacing={2}>
                    {incident.actors.map((actor) => (
                      <Grid size={6} key={actor.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6">{actor.type}</Typography>
                            <Typography color="textSecondary">
                              Attacker: {actor.data.attacker}
                            </Typography>
                            <Typography color="textSecondary">
                              Defender: {actor.data.defender}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
                {activeTab[incident.id] === 2 && (
                  <Grid container spacing={2}>
                    {incident.resources.map((resource) => (
                      <Grid size={6} key={resource.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6">
                              {resource.type}
                            </Typography>
                            <SyntaxHighlighter
                              language="json"
                              style={materialLight}
                            >
                              {JSON.stringify(resource.data, null, 2)}
                            </SyntaxHighlighter>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
                {activeTab[incident.id] === 3 && (
                  <Grid container spacing={2}>
                    {incident.recommendations.map((rec) => (
                      <Grid size={6} key={rec.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6">{rec.title}</Typography>
                            <Typography color="textSecondary">
                              {rec.description}
                            </Typography>
                            {/* <Chip
                              label={`Severity: ${rec.severity}`}
                              color="warning"
                              size="small"
                            /> */}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default IncidentList;
