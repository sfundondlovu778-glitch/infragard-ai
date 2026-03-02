export type EquipmentStatus = "healthy" | "warning" | "critical" | "offline";

export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: EquipmentStatus;
  healthScore: number;
  faultProbability: number;
  rul: number;
  lastMaintenance: string;
  nextMaintenance: string;
  sensors: SensorReading[];
}

export interface SensorReading {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: EquipmentStatus;
}

export interface AlertItem {
  id: string;
  equipmentId: string;
  equipmentName: string;
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  equipmentName: string;
  priority: "high" | "medium" | "low";
  status: "scheduled" | "in-progress" | "completed";
  assignee: string;
  dueDate: string;
  description: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  lastGenerated: string;
}

export const CHART_COLORS = {
  primary: "#3B6EF6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

export const equipment: Equipment[] = [
  {
    id: "eq-001", name: "Motor A1 - Cooling System", type: "Industrial Motor",
    location: "Building A, Floor 2", status: "healthy", healthScore: 94,
    faultProbability: 0.03, rul: 342, lastMaintenance: "2026-02-15", nextMaintenance: "2026-04-15",
    sensors: [
      { name: "Temperature", value: 72, unit: "°C", threshold: 95, status: "healthy" },
      { name: "Vibration", value: 2.4, unit: "mm/s", threshold: 5.0, status: "healthy" },
      { name: "Current", value: 48, unit: "A", threshold: 60, status: "healthy" },
      { name: "RPM", value: 1780, unit: "rpm", threshold: 1800, status: "healthy" },
    ],
  },
  {
    id: "eq-002", name: "Transformer T3 - Main Distribution", type: "Power Transformer",
    location: "Substation C", status: "warning", healthScore: 71,
    faultProbability: 0.18, rul: 156, lastMaintenance: "2026-01-20", nextMaintenance: "2026-03-20",
    sensors: [
      { name: "Oil Temperature", value: 88, unit: "°C", threshold: 95, status: "warning" },
      { name: "Load", value: 82, unit: "%", threshold: 90, status: "warning" },
      { name: "Voltage", value: 11.2, unit: "kV", threshold: 12.0, status: "healthy" },
      { name: "Oil Level", value: 85, unit: "%", threshold: 70, status: "healthy" },
    ],
  },
  {
    id: "eq-003", name: "Pump P7 - Water Treatment", type: "Centrifugal Pump",
    location: "Water Plant, Section 3", status: "critical", healthScore: 42,
    faultProbability: 0.67, rul: 28, lastMaintenance: "2025-12-10", nextMaintenance: "2026-03-05",
    sensors: [
      { name: "Vibration", value: 7.8, unit: "mm/s", threshold: 5.0, status: "critical" },
      { name: "Pressure", value: 3.2, unit: "bar", threshold: 5.0, status: "warning" },
      { name: "Flow Rate", value: 120, unit: "L/min", threshold: 200, status: "critical" },
      { name: "Temperature", value: 65, unit: "°C", threshold: 80, status: "healthy" },
    ],
  },
  {
    id: "eq-004", name: "Generator G2 - Backup Power", type: "Diesel Generator",
    location: "Building B, Ground Floor", status: "healthy", healthScore: 88,
    faultProbability: 0.05, rul: 280, lastMaintenance: "2026-02-01", nextMaintenance: "2026-05-01",
    sensors: [
      { name: "Fuel Level", value: 78, unit: "%", threshold: 20, status: "healthy" },
      { name: "Temperature", value: 55, unit: "°C", threshold: 90, status: "healthy" },
      { name: "Output Voltage", value: 415, unit: "V", threshold: 400, status: "healthy" },
      { name: "Frequency", value: 50.1, unit: "Hz", threshold: 50.5, status: "healthy" },
    ],
  },
  {
    id: "eq-005", name: "Compressor C5 - HVAC System", type: "Screw Compressor",
    location: "Rooftop, Unit 3", status: "warning", healthScore: 65,
    faultProbability: 0.22, rul: 112, lastMaintenance: "2026-01-05", nextMaintenance: "2026-03-10",
    sensors: [
      { name: "Discharge Pressure", value: 12.5, unit: "bar", threshold: 14.0, status: "warning" },
      { name: "Suction Pressure", value: 4.2, unit: "bar", threshold: 3.0, status: "healthy" },
      { name: "Oil Temperature", value: 78, unit: "°C", threshold: 85, status: "warning" },
      { name: "Current", value: 35, unit: "A", threshold: 40, status: "healthy" },
    ],
  },
  {
    id: "eq-006", name: "Motor M12 - Conveyor Belt", type: "Industrial Motor",
    location: "Warehouse, Line 4", status: "healthy", healthScore: 91,
    faultProbability: 0.04, rul: 305, lastMaintenance: "2026-02-20", nextMaintenance: "2026-05-20",
    sensors: [
      { name: "Temperature", value: 58, unit: "°C", threshold: 85, status: "healthy" },
      { name: "Vibration", value: 1.8, unit: "mm/s", threshold: 4.5, status: "healthy" },
      { name: "Speed", value: 1.2, unit: "m/s", threshold: 1.5, status: "healthy" },
      { name: "Current", value: 22, unit: "A", threshold: 30, status: "healthy" },
    ],
  },
  {
    id: "eq-007", name: "Transformer T8 - Substation B", type: "Power Transformer",
    location: "Substation B", status: "offline", healthScore: 0,
    faultProbability: 0, rul: 0, lastMaintenance: "2026-02-28", nextMaintenance: "2026-03-15",
    sensors: [
      { name: "Oil Temperature", value: 0, unit: "°C", threshold: 95, status: "offline" },
      { name: "Load", value: 0, unit: "%", threshold: 90, status: "offline" },
      { name: "Voltage", value: 0, unit: "kV", threshold: 12.0, status: "offline" },
      { name: "Oil Level", value: 92, unit: "%", threshold: 70, status: "offline" },
    ],
  },
  {
    id: "eq-008", name: "Pump P3 - Fire Suppression", type: "Centrifugal Pump",
    location: "Building A, Basement", status: "healthy", healthScore: 96,
    faultProbability: 0.01, rul: 410, lastMaintenance: "2026-02-10", nextMaintenance: "2026-06-10",
    sensors: [
      { name: "Pressure", value: 8.5, unit: "bar", threshold: 6.0, status: "healthy" },
      { name: "Flow Rate", value: 350, unit: "L/min", threshold: 200, status: "healthy" },
      { name: "Temperature", value: 28, unit: "°C", threshold: 60, status: "healthy" },
      { name: "Battery", value: 98, unit: "%", threshold: 20, status: "healthy" },
    ],
  },
];

export const recentAlerts: AlertItem[] = [
  { id: "al-001", equipmentId: "eq-003", equipmentName: "Pump P7", severity: "critical", message: "Vibration levels exceeded critical threshold - immediate inspection required", timestamp: "2026-03-02T14:23:00", acknowledged: false },
  { id: "al-002", equipmentId: "eq-003", equipmentName: "Pump P7", severity: "critical", message: "Flow rate dropped below minimum operating level", timestamp: "2026-03-02T14:18:00", acknowledged: false },
  { id: "al-003", equipmentId: "eq-002", equipmentName: "Transformer T3", severity: "warning", message: "Oil temperature approaching upper threshold", timestamp: "2026-03-02T13:45:00", acknowledged: true },
  { id: "al-004", equipmentId: "eq-005", equipmentName: "Compressor C5", severity: "warning", message: "Discharge pressure trending above normal range", timestamp: "2026-03-02T12:30:00", acknowledged: false },
  { id: "al-005", equipmentId: "eq-002", equipmentName: "Transformer T3", severity: "warning", message: "Load percentage nearing capacity limit", timestamp: "2026-03-02T11:15:00", acknowledged: true },
  { id: "al-006", equipmentId: "eq-005", equipmentName: "Compressor C5", severity: "info", message: "Scheduled maintenance reminder - due in 8 days", timestamp: "2026-03-02T10:00:00", acknowledged: false },
  { id: "al-007", equipmentId: "eq-007", equipmentName: "Transformer T8", severity: "info", message: "Equipment taken offline for scheduled maintenance", timestamp: "2026-03-02T08:00:00", acknowledged: true },
  { id: "al-008", equipmentId: "eq-001", equipmentName: "Motor A1", severity: "info", message: "Sensor calibration completed successfully", timestamp: "2026-03-01T16:30:00", acknowledged: true },
  { id: "al-009", equipmentId: "eq-004", equipmentName: "Generator G2", severity: "warning", message: "Fuel level below 80% - refueling recommended", timestamp: "2026-03-01T14:00:00", acknowledged: false },
  { id: "al-010", equipmentId: "eq-006", equipmentName: "Motor M12", severity: "info", message: "Performance optimization applied - efficiency improved 2.3%", timestamp: "2026-03-01T09:00:00", acknowledged: true },
];

export const maintenanceTasks: MaintenanceTask[] = [
  { id: "mt-001", title: "Emergency bearing replacement", equipmentName: "Pump P7", priority: "high", status: "in-progress", assignee: "John Martinez", dueDate: "2026-03-03", description: "Replace worn bearings causing excessive vibration" },
  { id: "mt-002", title: "Oil sampling and analysis", equipmentName: "Transformer T3", priority: "medium", status: "scheduled", assignee: "Sarah Chen", dueDate: "2026-03-05", description: "Collect oil samples for dissolved gas analysis" },
  { id: "mt-003", title: "Compressor belt inspection", equipmentName: "Compressor C5", priority: "medium", status: "scheduled", assignee: "Mike Johnson", dueDate: "2026-03-08", description: "Inspect and replace drive belts if worn" },
  { id: "mt-004", title: "Annual winding test", equipmentName: "Transformer T8", priority: "high", status: "in-progress", assignee: "Sarah Chen", dueDate: "2026-03-04", description: "Perform insulation resistance and winding resistance tests" },
  { id: "mt-005", title: "Lubrication service", equipmentName: "Motor A1", priority: "low", status: "scheduled", assignee: "Mike Johnson", dueDate: "2026-03-15", description: "Routine bearing lubrication and alignment check" },
  { id: "mt-006", title: "Fuel system maintenance", equipmentName: "Generator G2", priority: "medium", status: "scheduled", assignee: "John Martinez", dueDate: "2026-03-12", description: "Filter replacement and fuel quality check" },
  { id: "mt-007", title: "Pressure calibration", equipmentName: "Pump P3", priority: "low", status: "completed", assignee: "Sarah Chen", dueDate: "2026-02-28", description: "Calibrate pressure sensors and relief valves" },
  { id: "mt-008", title: "Conveyor alignment", equipmentName: "Motor M12", priority: "low", status: "completed", assignee: "Mike Johnson", dueDate: "2026-02-25", description: "Check and adjust belt tracking and tension" },
];

export const reportTemplates: ReportTemplate[] = [
  { id: "rt-001", name: "Equipment Health Summary", description: "Overview of all equipment health scores, trends, and anomalies", type: "Health", lastGenerated: "2026-03-01" },
  { id: "rt-002", name: "Predictive Maintenance Report", description: "AI-generated maintenance recommendations based on failure predictions", type: "Predictive", lastGenerated: "2026-02-28" },
  { id: "rt-003", name: "Alert Analysis Report", description: "Summary of alerts, response times, and resolution metrics", type: "Alerts", lastGenerated: "2026-02-27" },
  { id: "rt-004", name: "Energy Consumption Report", description: "Power usage analytics across all monitored equipment", type: "Energy", lastGenerated: "2026-02-25" },
  { id: "rt-005", name: "Compliance & Safety Audit", description: "Regulatory compliance status and safety metric tracking", type: "Compliance", lastGenerated: "2026-02-20" },
  { id: "rt-006", name: "Cost-Benefit Analysis", description: "Financial impact of predictive vs. reactive maintenance", type: "Financial", lastGenerated: "2026-02-15" },
];

export const kpis = [
  { title: "Total Equipment", value: "48", change: "+2", trend: "up" as const, icon: "monitor" },
  { title: "Active Alerts", value: "7", change: "-3", trend: "down" as const, icon: "alert" },
  { title: "Avg Health Score", value: "87.3%", change: "+1.2%", trend: "up" as const, icon: "heart" },
  { title: "Maintenance Due", value: "12", change: "+4", trend: "up" as const, icon: "wrench" },
];

export const trendData = [
  { day: "Mon", health: 85.2, alerts: 4, efficiency: 91 },
  { day: "Tue", health: 86.8, alerts: 3, efficiency: 92 },
  { day: "Wed", health: 84.5, alerts: 6, efficiency: 89 },
  { day: "Thu", health: 87.1, alerts: 5, efficiency: 90 },
  { day: "Fri", health: 88.9, alerts: 3, efficiency: 93 },
  { day: "Sat", health: 87.3, alerts: 7, efficiency: 91 },
  { day: "Sun", health: 87.3, alerts: 7, efficiency: 92 },
];

export const generateSensorTimeSeries = (baseValue: number, variance: number, points = 24) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    value: Number((baseValue + (Math.random() - 0.5) * variance).toFixed(1)),
  }));
};

export const failurePredictions = [
  { equipment: "Pump P7", probability: 67, rul: 28, trend: "increasing" },
  { equipment: "Compressor C5", probability: 22, rul: 112, trend: "stable" },
  { equipment: "Transformer T3", probability: 18, rul: 156, trend: "increasing" },
  { equipment: "Generator G2", probability: 5, rul: 280, trend: "decreasing" },
  { equipment: "Motor A1", probability: 3, rul: 342, trend: "stable" },
  { equipment: "Motor M12", probability: 4, rul: 305, trend: "stable" },
  { equipment: "Pump P3", probability: 1, rul: 410, trend: "decreasing" },
];

// Utility functions
export const getStatusColor = (status: EquipmentStatus | string) => {
  switch (status) {
    case "healthy": return "text-success";
    case "warning": return "text-warning";
    case "critical": return "text-destructive";
    case "offline": return "text-muted-foreground";
    default: return "text-foreground";
  }
};

export const getStatusBg = (status: EquipmentStatus | string) => {
  switch (status) {
    case "healthy": return "bg-success/15 text-success";
    case "warning": return "bg-warning/15 text-warning";
    case "critical": return "bg-destructive/15 text-destructive";
    case "offline": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export const getSeverityBg = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-destructive/15 text-destructive";
    case "warning": return "bg-warning/15 text-warning";
    case "info": return "bg-primary/15 text-primary";
    default: return "bg-muted text-muted-foreground";
  }
};

export const getPriorityBg = (priority: string) => {
  switch (priority) {
    case "high": return "bg-destructive/15 text-destructive";
    case "medium": return "bg-warning/15 text-warning";
    case "low": return "bg-success/15 text-success";
    default: return "bg-muted text-muted-foreground";
  }
};
