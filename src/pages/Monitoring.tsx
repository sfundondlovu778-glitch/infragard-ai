import { useState, useMemo } from "react";
import { Search, Activity, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  equipment, generateSensorTimeSeries, getStatusBg, getStatusColor,
  CHART_COLORS, type Equipment,
} from "@/data/mockData";

const sensorChartColors = [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger];

const Monitoring = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment>(equipment[0]);
  const [search, setSearch] = useState("");

  const filtered = equipment.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const sensorData = useMemo(() => {
    return selectedEquipment.sensors.map((sensor) => ({
      ...sensor,
      timeSeries: generateSensorTimeSeries(sensor.value, sensor.value * 0.15),
    }));
  }, [selectedEquipment.id]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Equipment List Panel */}
      <div className="w-72 border-r border-border flex flex-col bg-card/50 flex-shrink-0 hidden md:flex">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((eq) => (
            <button
              key={eq.id}
              onClick={() => setSelectedEquipment(eq)}
              className={`w-full text-left p-3 border-b border-border/50 hover:bg-accent transition-colors ${
                selectedEquipment.id === eq.id ? "bg-accent border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  eq.status === "healthy" ? "bg-success" :
                  eq.status === "warning" ? "bg-warning" :
                  eq.status === "critical" ? "bg-destructive" :
                  "bg-muted-foreground"
                }`} />
                <span className="text-sm font-medium truncate">{eq.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 ml-4">{eq.location}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Equipment Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-bold">{selectedEquipment.name}</h2>
            <p className="text-sm text-muted-foreground">{selectedEquipment.type} • {selectedEquipment.location}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-heading font-bold font-mono">{selectedEquipment.healthScore}%</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Health</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-heading font-bold font-mono">{selectedEquipment.rul}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">RUL (days)</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBg(selectedEquipment.status)}`}>
              {selectedEquipment.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Live Sensor Readings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Live Sensor Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedEquipment.sensors.map((sensor) => (
                <div key={sensor.name} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{sensor.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStatusBg(sensor.status)}`}>
                      {sensor.status}
                    </span>
                  </div>
                  <p className="text-xl font-heading font-bold font-mono">
                    {sensor.value}
                    <span className="text-xs font-normal text-muted-foreground ml-1">{sensor.unit}</span>
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>0</span>
                      <span>Threshold: {sensor.threshold}{sensor.unit}</span>
                    </div>
                    <Progress
                      value={Math.min((sensor.value / sensor.threshold) * 100, 100)}
                      className="h-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sensor Time Series Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sensorData.map((sensor, idx) => (
            <Card key={sensor.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-heading flex items-center justify-between">
                  <span>{sensor.name} — 24h Trend</span>
                  <span className="font-mono text-muted-foreground">
                    {sensor.value} {sensor.unit}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensor.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10 }}
                        stroke="hsl(var(--muted-foreground))"
                        interval={5}
                      />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                          fontSize: "11px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={sensorChartColors[idx % sensorChartColors.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
