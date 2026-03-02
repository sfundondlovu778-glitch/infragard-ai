import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  maintenanceTasks, getPriorityBg, type MaintenanceTask,
} from "@/data/mockData";
import {
  Calendar, Clock, User, CheckCircle2, CircleDot, Circle, Filter,
} from "lucide-react";

type StatusFilter = "all" | "scheduled" | "in-progress" | "completed";

const statusConfig = {
  "scheduled": { icon: Circle, label: "Scheduled", className: "text-primary" },
  "in-progress": { icon: CircleDot, label: "In Progress", className: "text-warning" },
  "completed": { icon: CheckCircle2, label: "Completed", className: "text-success" },
};

const Maintenance = () => {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = maintenanceTasks.filter((t) =>
    filter === "all" ? true : t.status === filter
  );

  const counts = {
    all: maintenanceTasks.length,
    scheduled: maintenanceTasks.filter((t) => t.status === "scheduled").length,
    "in-progress": maintenanceTasks.filter((t) => t.status === "in-progress").length,
    completed: maintenanceTasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "scheduled", "in-progress", "completed"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            className="text-xs capitalize"
            onClick={() => setFilter(status)}
          >
            {status === "all" ? "All Tasks" : status.replace("-", " ")}
            <span className="ml-1.5 opacity-70">({counts[status]})</span>
          </Button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((task) => {
          const config = statusConfig[task.status];
          const StatusIcon = config.icon;
          return (
            <Card key={task.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <StatusIcon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.className}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold">{task.title}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${getPriorityBg(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.dueDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignee}
                      </span>
                      <span className="font-medium text-foreground/70">{task.equipmentName}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No tasks matching this filter</p>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
