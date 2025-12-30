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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateIncidentModal({ open, onClose }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium",
    type: "latency",
    affected_model: "",
    sample_prompt: "",
    sample_output: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    
    // Generate AI suggested fix
    let suggested_fix = "";
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an LLM reliability expert. An incident has been reported:
        
Type: ${formData.type}
Title: ${formData.title}
Description: ${formData.description}
${formData.sample_prompt ? `Sample Prompt: ${formData.sample_prompt}` : ''}
${formData.sample_output ? `Sample Output: ${formData.sample_output}` : ''}

Provide a brief, actionable suggested fix (2-3 sentences max).`,
      });
      suggested_fix = response;
    } catch (err) {
      console.log("Could not generate AI fix");
    }

    await base44.entities.Incident.create({
      ...formData,
      status: "open",
      suggested_fix
    });

    queryClient.invalidateQueries({ queryKey: ["incidents"] });
    toast.success("Incident created");
    setIsSubmitting(false);
    setFormData({
      title: "",
      description: "",
      severity: "medium",
      type: "latency",
      affected_model: "",
      sample_prompt: "",
      sample_output: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Create Manual Incident</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the incident"
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="latency">Latency Spike</SelectItem>
                  <SelectItem value="hallucination">Hallucination</SelectItem>
                  <SelectItem value="token_spike">Token Spike</SelectItem>
                  <SelectItem value="pii_detected">PII Detected</SelectItem>
                  <SelectItem value="error_rate">Error Rate</SelectItem>
                  <SelectItem value="prompt_drift">Prompt Drift</SelectItem>
                  <SelectItem value="cost_anomaly">Cost Anomaly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(v) => setFormData({ ...formData, severity: v })}
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

            <div className="col-span-2">
              <Label>Affected Model</Label>
              <Input
                value={formData.affected_model}
                onChange={(e) => setFormData({ ...formData, affected_model: e.target.value })}
                placeholder="e.g., gpt-4, gemini-pro"
                className="bg-slate-800 border-slate-700 mt-1"
              />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of what happened..."
                className="bg-slate-800 border-slate-700 mt-1 h-24"
              />
            </div>

            <div className="col-span-2">
              <Label>Sample Prompt (optional)</Label>
              <Textarea
                value={formData.sample_prompt}
                onChange={(e) => setFormData({ ...formData, sample_prompt: e.target.value })}
                placeholder="The prompt that caused the issue..."
                className="bg-slate-800 border-slate-700 mt-1 h-20 font-mono text-sm"
              />
            </div>

            <div className="col-span-2">
              <Label>Sample Output (optional)</Label>
              <Textarea
                value={formData.sample_output}
                onChange={(e) => setFormData({ ...formData, sample_output: e.target.value })}
                placeholder="The problematic output..."
                className="bg-slate-800 border-slate-700 mt-1 h-20 font-mono text-sm"
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
              Create Incident
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}