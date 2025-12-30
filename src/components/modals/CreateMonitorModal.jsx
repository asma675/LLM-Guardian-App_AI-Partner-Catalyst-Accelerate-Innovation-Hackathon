import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const MONITOR_PRESETS = {
  latency: {
    name: "Latency P95 Threshold",
    threshold: 2000,
    threshold_unit: "ms",
    comparison: "greater_than"
  },
  hallucination: {
    name: "Hallucination Score Alert",
    threshold: 60,
    threshold_unit: "%",
    comparison: "greater_than"
  },
  token_usage: {
    name: "Token Usage Spike",
    threshold: 50000,
    threshold_unit: "tokens",
    comparison: "greater_than"
  },
  pii_detection: {
    name: "PII Detection Alert",
    threshold: 1,
    threshold_unit: "incidents",
    comparison: "greater_than"
  },
  error_rate: {
    name: "Error Rate Threshold",
    threshold: 5,
    threshold_unit: "%",
    comparison: "greater_than"
  },
  cost: {
    name: "Cost Anomaly",
    threshold: 10,
    threshold_unit: "$",
    comparison: "greater_than"
  },
  prompt_drift: {
    name: "Prompt Drift Detection",
    threshold: 30,
    threshold_unit: "%",
    comparison: "greater_than"
  }
};

export default function CreateMonitorModal({ open, onClose }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "latency",
    threshold: 2000,
    threshold_unit: "ms",
    comparison: "greater_than",
    severity_on_trigger: "high",
    cooldown_minutes: 15,
    enabled: true
  });

  const handleTypeChange = (type) => {
    const preset = MONITOR_PRESETS[type];
    setFormData({
      ...formData,
      type,
      ...preset
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    
    await base44.entities.Monitor.create({
      ...formData,
      trigger_count: 0
    });

    queryClient.invalidateQueries({ queryKey: ["monitors"] });
    toast.success("Monitor created");
    setIsSubmitting(false);
    setFormData({
      name: "",
      type: "latency",
      threshold: 2000,
      threshold_unit: "ms",
      comparison: "greater_than",
      severity_on_trigger: "high",
      cooldown_minutes: 15,
      enabled: true
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Create Detection Rule</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Monitor Type</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="latency">Latency</SelectItem>
                <SelectItem value="hallucination">Hallucination Score</SelectItem>
                <SelectItem value="token_usage">Token Usage</SelectItem>
                <SelectItem value="pii_detection">PII Detection</SelectItem>
                <SelectItem value="error_rate">Error Rate</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="prompt_drift">Prompt Drift</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={MONITOR_PRESETS[formData.type]?.name}
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

          <DialogFooter>
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
              Create Monitor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}