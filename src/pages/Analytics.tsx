import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area,
  ComposedChart, ReferenceLine, ScatterChart, Scatter, ZAxis,
} from "recharts";
import {
  failurePredictions, CHART_COLORS, anomalyDetectionData,
  featureImportance, modelTrainingHistory, predictionAccuracyHistory,
} from "@/data/mockData";
import {
  Brain, Target, Zap, TrendingUp, TrendingDown, Minus,
  Activity, ShieldCheck, Cpu, BarChart3, AlertTriangle, CheckCircle2,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const modelMetrics = [
  { label: "Precision", value: 94.2, icon: Target, delta: "+1.8%", positive: true },
  { label: "Recall", value: 91.8, icon: Zap, delta: "+2.4%", positive: true },
  { label: "F1-Score", value: 93.0, icon: Brain, delta: "+2.1%", positive: true },
  { label: "Model Status", value: "Active", icon: Cpu, delta: "v1.5", positive: true, isStatus: true },
];

const trendIcon = (trend: string) => {
  if (trend === "increasing") return <TrendingUp className="h-3 w-3 text-destructive" />;
  if (trend === "decreasing") return <TrendingDown className="h-3 w-3 text-success" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const getRiskColor = (prob: number) => {
  if (prob >= 50) return CHART_COLORS.danger;
  if (prob >= 15) return CHART_COLORS.warning;
  return CHART_COLORS.success;
};

const getCategoryColor = (cat: string) => {
  const map: Record<string, string> = {
    Mechanical: CHART_COLORS.danger,
    Thermal: CHART_COLORS.warning,
    Electrical: CHART_COLORS.primary,
    Usage: CHART_COLORS.purple,
    Environmental: CHART_COLORS.cyan,
    Operational: CHART_COLORS.success,
  };
  return map[cat] || CHART_COLORS.primary;
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "6px",
  fontSize: "11px",
};

const Analytics = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Model Performance KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelMetrics.map(({ label, value, icon: Icon, delta, positive, isStatus }) => (
          <motion.div key={label} variants={item}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-heading font-bold mt-1">
                      {isStatus ? value : `${value}%`}
                    </p>
                    <p className={`text-xs mt-1 ${positive ? "text-success" : "text-destructive"}`}>
                      {delta} {isStatus ? "latest" : "vs last month"}
                    </p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="predictions" className="text-xs">Predictions</TabsTrigger>
          <TabsTrigger value="anomalies" className="text-xs">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="features" className="text-xs">Feature Analysis</TabsTrigger>
          <TabsTrigger value="training" className="text-xs">Model Training</TabsTrigger>
        </TabsList>

        {/* Tab 1: Predictions */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Failure Probability */}
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-heading">Failure Probability by Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={failurePredictions} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis dataKey="equipment" type="category" width={110} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, "Probability"]} />
                        <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={16}>
                          {failurePredictions.map((entry, i) => (
                            <Cell key={i} fill={getRiskColor(entry.probability)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* RUL with Confidence */}
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-heading">Remaining Useful Life (RUL) with Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={[...failurePredictions].sort((a, b) => a.rul - b.rul)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="equipment" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" angle={-30} textAnchor="end" height={60} />
                        <YAxis yAxisId="rul" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: "Days", angle: -90, position: "insideLeft", style: { fontSize: 10 } }} />
                        <YAxis yAxisId="conf" orientation="right" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} label={{ value: "Confidence %", angle: 90, position: "insideRight", style: { fontSize: 10 } }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar yAxisId="rul" dataKey="rul" name="RUL (days)" radius={[4, 4, 0, 0]} barSize={28}>
                          {[...failurePredictions].sort((a, b) => a.rul - b.rul).map((entry, i) => (
                            <Cell key={i} fill={entry.rul < 60 ? CHART_COLORS.danger : entry.rul < 150 ? CHART_COLORS.warning : CHART_COLORS.success} />
                          ))}
                        </Bar>
                        <Line yAxisId="conf" type="monotone" dataKey="confidence" name="Confidence %" stroke={CHART_COLORS.purple} strokeWidth={2} dot={{ fill: CHART_COLORS.purple, r: 4 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Prediction Accuracy History */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                Prediction Accuracy — Predicted vs Actual Failures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictionAccuracyHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="predicted" name="Predicted" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="actual" name="Actual" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Prediction Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading">Detailed Prediction Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Equipment</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Fault Probability</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">RUL (days)</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Confidence</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Trend</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failurePredictions.map((pred) => (
                      <tr key={pred.equipment} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3 font-medium">{pred.equipment}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Progress value={pred.probability} className="h-1.5 w-20" />
                            <span className="font-mono text-xs">{pred.probability}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">{pred.rul}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-xs">{pred.confidence}%</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            {trendIcon(pred.trend)}
                            <span className="text-xs capitalize">{pred.trend}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            pred.probability >= 50 ? "bg-destructive/15 text-destructive" :
                            pred.probability >= 15 ? "bg-warning/15 text-warning" :
                            "bg-success/15 text-success"
                          }`}>
                            {pred.probability >= 50 ? "HIGH" : pred.probability >= 15 ? "MEDIUM" : "LOW"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Anomaly Detection */}
        <TabsContent value="anomalies" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Real-Time Anomaly Detection — Vibration Sensor (Pump P7)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={anomalyDetectionData}>
                    <defs>
                      <linearGradient id="normalBand" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.08} />
                        <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" interval={4} />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[20, 120]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="upperBound" name="Upper Bound" stroke="none" fill="url(#normalBand)" />
                    <ReferenceLine y={75} stroke={CHART_COLORS.danger} strokeDasharray="5 5" label={{ value: "Threshold", position: "right", fill: CHART_COLORS.danger, fontSize: 10 }} />
                    <ReferenceLine y={35} stroke={CHART_COLORS.warning} strokeDasharray="5 5" label={{ value: "Lower Bound", position: "right", fill: CHART_COLORS.warning, fontSize: 10 }} />
                    <Line type="monotone" dataKey="value" name="Sensor Value" stroke={CHART_COLORS.primary} strokeWidth={1.5} dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.isAnomaly) {
                        return <circle cx={cx} cy={cy} r={5} fill={CHART_COLORS.danger} stroke="#fff" strokeWidth={2} />;
                      }
                      return null;
                    }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span>Anomaly Detected (5 points)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-destructive" style={{ borderTop: "2px dashed" }} />
                  <span>Threshold Boundary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-6 rounded bg-primary/10" />
                  <span>Normal Operating Range</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Anomalies Detected (24h)", value: "5", icon: AlertTriangle, color: "text-destructive" },
              { label: "Detection Accuracy", value: "96.2%", icon: CheckCircle2, color: "text-success" },
              { label: "Avg Response Time", value: "2.3 min", icon: Activity, color: "text-primary" },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xl font-heading font-bold">{value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Feature Analysis */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Feature Importance — Failure Prediction Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureImportance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" domain={[0, 0.35]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <YAxis dataKey="feature" type="category" width={120} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Importance"]} />
                      <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={18}>
                        {featureImportance.map((entry, i) => (
                          <Cell key={i} fill={getCategoryColor(entry.category)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading">Feature Categories Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {featureImportance.map((f) => (
                    <div key={f.feature}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(f.category) }} />
                          <span className="text-sm font-medium">{f.feature}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{f.category}</span>
                          <span className="text-sm font-mono font-bold">{(f.importance * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <Progress value={f.importance * 100 / 0.28 * 100 / 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Model Training */}
        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  Model Accuracy Over Versions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={modelTrainingHistory}>
                      <defs>
                        <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="epoch" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke={CHART_COLORS.success} fill="url(#accGrad)" strokeWidth={2} dot={{ fill: CHART_COLORS.success, r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading">Training Loss Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={modelTrainingHistory}>
                      <defs>
                        <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="epoch" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 0.5]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="loss" name="Loss" stroke={CHART_COLORS.primary} fill="url(#lossGrad)" strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Version Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-heading">Model Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Version</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Accuracy</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Loss</th>
                      <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelTrainingHistory.map((m, i) => (
                      <tr key={m.epoch} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium">{m.epoch}</td>
                        <td className="py-3 px-3 text-muted-foreground">{m.date}</td>
                        <td className="py-3 px-3 font-mono font-bold">{m.accuracy}%</td>
                        <td className="py-3 px-3 font-mono">{m.loss}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            i === modelTrainingHistory.length - 1 ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                          }`}>
                            {i === modelTrainingHistory.length - 1 ? "ACTIVE" : "ARCHIVED"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
