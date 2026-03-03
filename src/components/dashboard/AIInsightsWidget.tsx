import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, Lightbulb, Info, Sparkles } from "lucide-react";
import { aiInsights } from "@/data/mockData";

const typeConfig = {
  critical: { icon: AlertTriangle, bg: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive", label: "Critical" },
  warning: { icon: AlertTriangle, bg: "bg-warning/10", border: "border-warning/30", text: "text-warning", label: "Warning" },
  optimization: { icon: Lightbulb, bg: "bg-success/10", border: "border-success/30", text: "text-success", label: "Optimization" },
  info: { icon: Info, bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", label: "Insight" },
};

const item = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function AIInsightsWidget() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            <Brain className="h-2.5 w-2.5 inline mr-1" />
            GPT-4o + ML v1.5
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {aiInsights.map((insight, i) => {
            const config = typeConfig[insight.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={insight.id}
                variants={item}
                initial="hidden"
                animate="show"
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border ${config.bg} ${config.border}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.text}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">{insight.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>{insight.equipment}</span>
                        <span>Confidence: {insight.confidence}%</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
