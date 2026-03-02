import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reportTemplates } from "@/data/mockData";
import { FileText, Download, Calendar, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";

const typeColors: Record<string, string> = {
  Health: "bg-success/15 text-success",
  Predictive: "bg-primary/15 text-primary",
  Alerts: "bg-destructive/15 text-destructive",
  Energy: "bg-warning/15 text-warning",
  Compliance: "bg-purple-500/15 text-purple-400",
  Financial: "bg-cyan-500/15 text-cyan-400",
};

const Reports = () => {
  const handleGenerate = (name: string) => {
    toast.success(`Generating "${name}"...`, {
      description: "AI-powered report will be ready in moments.",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate AI Report
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Report
        </Button>
      </div>

      {/* Report Templates */}
      <div>
        <h2 className="text-sm font-heading font-semibold mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((report) => (
            <Card key={report.id} className="hover:border-primary/30 transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColors[report.type] || "bg-muted text-muted-foreground"}`}>
                    {report.type}
                  </span>
                </div>
                <h3 className="text-sm font-semibold mb-1">{report.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    Last: {report.lastGenerated}
                  </span>
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toast.info("Downloading latest report...")}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px]"
                      onClick={() => handleGenerate(report.name)}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
