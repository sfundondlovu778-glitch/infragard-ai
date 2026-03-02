import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell,
} from "recharts";
import { failurePredictions, CHART_COLORS, equipment } from "@/data/mockData";
import { TrendingUp, TrendingDown, Minus, Brain, Target, Zap } from "lucide-react";

const modelMetrics = [
  { label: "Precision", value: 94.2, icon: Target },
  { label: "Recall", value: 91.8, icon: Zap },
  { label: "F1-Score", value: 93.0, icon: Brain },
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

const Analytics = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {modelMetrics.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-heading font-bold">{value}%</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failure Probability Chart */}
        <Card>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Probability"]}
                  />
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

        {/* RUL Estimation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Remaining Useful Life (RUL)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failurePredictions.sort((a, b) => a.rul - b.rul)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="equipment" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" label={{ value: "Days", angle: -90, position: "insideLeft", style: { fontSize: 10 } }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                    formatter={(value: number) => [`${value} days`, "RUL"]}
                  />
                  <Bar dataKey="rul" radius={[4, 4, 0, 0]} barSize={28}>
                    {failurePredictions.sort((a, b) => a.rul - b.rul).map((entry, i) => (
                      <Cell key={i} fill={entry.rul < 60 ? CHART_COLORS.danger : entry.rul < 150 ? CHART_COLORS.warning : CHART_COLORS.success} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failure Prediction Details Table */}
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
    </div>
  );
};

export default Analytics;
