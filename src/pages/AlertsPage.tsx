import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  recentAlerts, getSeverityBg, type AlertItem,
} from "@/data/mockData";
import { Search, CheckCircle, Clock, AlertTriangle, Info, XCircle } from "lucide-react";

type SeverityFilter = "all" | "critical" | "warning" | "info";

const severityIcon = (severity: string) => {
  switch (severity) {
    case "critical": return <XCircle className="h-4 w-4 text-destructive" />;
    case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
    case "info": return <Info className="h-4 w-4 text-primary" />;
    default: return null;
  }
};

const AlertsPage = () => {
  const [filter, setFilter] = useState<SeverityFilter>("all");
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState(recentAlerts);

  const filtered = alerts.filter((a) => {
    if (filter !== "all" && a.severity !== filter) return false;
    if (search && !a.message.toLowerCase().includes(search.toLowerCase()) && !a.equipmentName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Severity Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["all", "critical", "warning", "info"] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setFilter(sev)}
            className={`p-3 rounded-lg border transition-all text-left ${
              filter === sev ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border bg-card hover:bg-accent"
            }`}
          >
            <p className="text-xs text-muted-foreground capitalize">{sev === "all" ? "All Alerts" : sev}</p>
            <p className="text-xl font-heading font-bold mt-1">{counts[sev]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search alerts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <Card key={alert.id} className={`transition-all ${!alert.acknowledged ? "border-l-2 border-l-primary" : "opacity-75"}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">{severityIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${getSeverityBg(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{alert.equipmentName}</span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    {alert.acknowledged && (
                      <span className="text-[10px] text-success flex items-center gap-1">
                        <CheckCircle className="h-2.5 w-2.5" />
                        Acknowledged
                      </span>
                    )}
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 text-xs h-7"
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
