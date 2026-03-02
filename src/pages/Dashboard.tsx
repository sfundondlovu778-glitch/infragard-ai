import { motion } from "framer-motion";
import {
  Monitor, AlertTriangle, Heart, Wrench, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, BarChart, Bar,
} from "recharts";
import {
  equipment, recentAlerts, kpis, trendData,
  CHART_COLORS, getStatusBg, getSeverityBg,
} from "@/data/mockData";

const kpiIcons = {
  monitor: Monitor,
  alert: AlertTriangle,
  heart: Heart,
  wrench: Wrench,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const healthGaugeData = [{ name: "Health", value: 87.3, fill: CHART_COLORS.success }];

const statusCounts = {
  healthy: equipment.filter((e) => e.status === "healthy").length,
  warning: equipment.filter((e) => e.status === "warning").length,
  critical: equipment.filter((e) => e.status === "critical").length,
  offline: equipment.filter((e) => e.status === "offline").length,
};

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* KPI Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi) => {
          const Icon = kpiIcons[kpi.icon as keyof typeof kpiIcons];
          const isPositive = kpi.trend === "up" && kpi.icon !== "alert";
          const isNegativeGood = kpi.trend === "down" && kpi.icon === "alert";
          const trendPositive = isPositive || isNegativeGood;

          return (
            <motion.div key={kpi.title} variants={item}>
              <Card className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {kpi.title}
                      </p>
                      <p className="text-2xl font-heading font-bold mt-1">{kpi.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {trendPositive ? (
                          <ArrowUpRight className="h-3 w-3 text-success" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-destructive" />
                        )}
                        <span className={`text-xs font-medium ${trendPositive ? "text-success" : "text-destructive"}`}>
                          {kpi.change}
                        </span>
                        <span className="text-xs text-muted-foreground">vs last week</span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Middle Row: Health Gauge + Equipment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Gauge */}
        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading">System Health Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-0">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%" innerRadius="70%" outerRadius="90%"
                    barSize={12} data={healthGaugeData}
                    startAngle={225} endAngle={-45}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={6}
                      background={{ fill: "hsl(var(--muted))" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-heading font-bold">87.3</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              {/* Status Summary */}
              <div className="grid grid-cols-4 gap-2 w-full mt-4">
                {(
                  [
                    ["Healthy", statusCounts.healthy, "bg-success"],
                    ["Warning", statusCounts.warning, "bg-warning"],
                    ["Critical", statusCounts.critical, "bg-destructive"],
                    ["Offline", statusCounts.offline, "bg-muted-foreground"],
                  ] as const
                ).map(([label, count, color]) => (
                  <div key={label} className="text-center">
                    <div className={`h-1.5 rounded-full ${color} mb-1.5 mx-auto w-8`} />
                    <p className="text-lg font-heading font-bold">{count}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Equipment Status Grid */}
        <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading">Equipment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {equipment.slice(0, 6).map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-border transition-colors"
                  >
                    <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                      eq.status === "healthy" ? "bg-success" :
                      eq.status === "warning" ? "bg-warning animate-pulse-glow" :
                      eq.status === "critical" ? "bg-destructive animate-pulse-glow" :
                      "bg-muted-foreground"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{eq.name}</p>
                      <p className="text-xs text-muted-foreground">{eq.location}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-heading font-bold font-mono">{eq.healthScore}%</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStatusBg(eq.status)}`}>
                        {eq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row: Trend Chart + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <motion.div variants={item} initial="hidden" animate="show">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading">Weekly Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.success} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone" dataKey="health" name="Health Score"
                      stroke={CHART_COLORS.primary} fill="url(#healthGradient)" strokeWidth={2}
                    />
                    <Area
                      type="monotone" dataKey="efficiency" name="Efficiency"
                      stroke={CHART_COLORS.success} fill="url(#efficiencyGradient)" strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div variants={item} initial="hidden" animate="show">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-heading">Recent Alerts</CardTitle>
                <span className="text-xs text-muted-foreground">Last 24 hours</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {recentAlerts.slice(0, 6).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <span className={`mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${getSeverityBg(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-muted-foreground font-medium">{alert.equipmentName}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
