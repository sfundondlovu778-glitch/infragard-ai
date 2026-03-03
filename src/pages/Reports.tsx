import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reportTemplates, equipment, recentAlerts } from "@/data/mockData";
import {
  FileText, Download, Calendar, Sparkles, Clock, Loader2, X, Printer,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const REPORT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`;

const typeColors: Record<string, string> = {
  Health: "bg-success/15 text-success",
  Predictive: "bg-primary/15 text-primary",
  Alerts: "bg-destructive/15 text-destructive",
  Energy: "bg-warning/15 text-warning",
  Compliance: "bg-purple-500/15 text-purple-400",
  Financial: "bg-cyan-500/15 text-cyan-400",
};

const Reports = () => {
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReportName, setActiveReportName] = useState<string>("");
  const reportRef = useRef<HTMLDivElement>(null);

  const streamReport = useCallback(async (reportType: string) => {
    setIsGenerating(true);
    setGeneratedReport("");
    setActiveReportName(reportType);

    try {
      const resp = await fetch(REPORT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          reportType,
          equipmentData: equipment.map((e) => ({
            name: e.name, type: e.type, status: e.status,
            healthScore: e.healthScore, faultProbability: e.faultProbability, rul: e.rul,
          })),
          alertData: recentAlerts.slice(0, 6).map((a) => ({
            severity: a.severity, message: a.message,
            equipmentName: a.equipmentName, timestamp: a.timestamp,
          })),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        if (resp.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (resp.status === 402) {
          toast.error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
        } else {
          toast.error(err.error || "Failed to generate report");
        }
        setIsGenerating(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              content += delta;
              setGeneratedReport(content);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Report generation failed:", e);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleExportPDF = useCallback(() => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to export PDF.");
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>${activeReportName} — InfraGuard AI</title>
      <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a2e; line-height: 1.6; }
        h1 { color: #1E3A8A; border-bottom: 2px solid #1E3A8A; padding-bottom: 8px; }
        h2 { color: #1E3A8A; margin-top: 24px; }
        h3 { color: #334155; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
        th { background: #f1f5f9; font-weight: 600; }
        ul, ol { padding-left: 24px; }
        strong { color: #0f172a; }
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header p { color: #64748b; font-size: 13px; }
        @media print { body { margin: 20px; } }
      </style></head><body>
        <div class="header">
          <h1>InfraGuard AI</h1>
          <p>${activeReportName} • Generated ${new Date().toLocaleDateString()}</p>
        </div>
        ${reportRef.current.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }, [activeReportName]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Generated Report View */}
      {(generatedReport || isGenerating) && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {activeReportName}
                {isGenerating && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    Generating...
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {!isGenerating && generatedReport && (
                  <>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={handleExportPDF}>
                      <Printer className="h-3 w-3" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => {
                      navigator.clipboard.writeText(generatedReport);
                      toast.success("Report copied to clipboard");
                    }}>
                      <Download className="h-3 w-3" />
                      Copy
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setGeneratedReport(""); setActiveReportName(""); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={reportRef}
              className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-p:text-sm prose-li:text-sm prose-td:text-xs prose-th:text-xs"
            >
              <ReactMarkdown>{generatedReport}</ReactMarkdown>
            </div>
            {isGenerating && !generatedReport && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                <span className="text-sm">AI is analyzing equipment data and generating report...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] gap-1.5"
                    disabled={isGenerating}
                    onClick={() => streamReport(report.name)}
                  >
                    {isGenerating && activeReportName === report.name ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    Generate
                  </Button>
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
