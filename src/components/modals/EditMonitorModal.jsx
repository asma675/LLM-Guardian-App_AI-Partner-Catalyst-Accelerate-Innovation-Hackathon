import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function EditMonitorModal({ monitor, open, onClose }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    threshold: 0,
    threshold_unit: "",
    comparison: "greater_than",
    severity_on_trigger: "high",
    cooldown_minutes: 15,
    enabled: true
  });

  useEffect(() => {
    if (monitor) {
      setFormData({
        name: monitor.name || "",
        threshold: monitor.threshold || 0,
        threshold_unit: monitor.threshold_unit || "",
        comparison: monitor.comparison || "greater_than",
        severity_on_trigger: monitor.severity_on_trigger || "high",
        cooldown_minutes: monitor.cooldown_minutes || 15,
        enabled: monitor.enabled !== false
      });
    }
  }, [monitor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monitor) return;

    setIsSubmitting(true);
    await base44.entities.Monitor.update(monitor.id, formData);
    queryClient.invalidateQueries({ queryKey: ["monitors"] });
    toast.success("Monitor updated");
    setIsSubmitting(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!monitor) return;
    
    setIsDeleting(true);
    await base44.entities.Monitor.delete(monitor.id);
    queryClient.invalidateQueries({ queryKey: ["monitors"] });
    toast.success("Monitor deleted");
    setIsDeleting(false);
    onClose();
  };

  if (!monitor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Monitor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
            <div>
              <Label>Status</Label>
              <p className="text-sm text-slate-400">Enable or disable this monitor</p>
            </div>
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800 border-slate-700 mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Comparison</Label>
              <Select
                value={formData.comparison}
                onValueChange={(v) => setFormData({ ...formData, comparison: v })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="anomaly">Anomaly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Threshold</Label>
              <Input
                type="number"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) })}
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>

            <div>
              <Label>Unit</Label>
              <Input
                value={formData.threshold_unit}
                onChange={(e) => setFormData({ ...formData, threshold_unit: e.target.value })}
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Alert Severity</Label>
              <Select
                value={formData.severity_on_trigger}
                onValueChange={(v) => setFormData({ ...formData, severity_on_trigger: v })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cooldown (minutes)</Label>
              <Input
                type="number"
                value={formData.cooldown_minutes}
                onChange={(e) => setFormData({ ...formData, cooldown_minutes: parseInt(e.target.value) })}
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700">
            <p className="text-sm text-slate-500">
              Triggered {monitor.trigger_count || 0} times
              {monitor.last_triggered && ` • Last: ${new Date(monitor.last_triggered).toLocaleString()}`}
            </p>
          </div>

          <DialogFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </Button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-slate-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}