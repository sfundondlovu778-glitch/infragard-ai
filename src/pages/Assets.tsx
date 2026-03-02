import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { equipment, getStatusBg } from "@/data/mockData";
import { Search, Plus, Download } from "lucide-react";

const Assets = () => {
  const [search, setSearch] = useState("");

  const filtered = equipment.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-3.5 w-3.5" /> Add Asset
          </Button>
        </div>
      </div>

      {/* Assets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset ID</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Health</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((eq) => (
                  <tr key={eq.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{eq.id}</td>
                    <td className="py-3 px-4 font-medium">{eq.name}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{eq.type}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{eq.location}</td>
                    <td className="py-3 px-4 font-mono font-semibold">{eq.healthScore}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBg(eq.status)}`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{eq.lastMaintenance}</td>
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

export default Assets;
