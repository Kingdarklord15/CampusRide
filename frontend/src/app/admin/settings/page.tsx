"use client";

import { useState, useEffect } from "react";
import { Shield, Save, DollarSign, Activity } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  const showToast = useUiStore((state) => state.toast);

  // Platform admin settings
  const [baseFare, setBaseFare] = useState("20.00");
  const [perKmRate, setPerKmRate] = useState("10.00");
  const [surgeMultiplier, setSurgeMultiplier] = useState("1.0");
  const [allowDriverRegistration, setAllowDriverRegistration] = useState(true);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load from localStorage if present
    const storedBase = localStorage.getItem("admin_settings_baseFare");
    const storedPerKm = localStorage.getItem("admin_settings_perKmRate");
    const storedSurge = localStorage.getItem("admin_settings_surge");
    const storedReg = localStorage.getItem("admin_settings_allowReg");
    const storedDispatch = localStorage.getItem("admin_settings_autoDispatch");
    const storedTimeout = localStorage.getItem("admin_settings_timeout");

    if (storedBase !== null) setBaseFare(storedBase);
    if (storedPerKm !== null) setPerKmRate(storedPerKm);
    if (storedSurge !== null) setSurgeMultiplier(storedSurge);
    if (storedReg !== null) setAllowDriverRegistration(storedReg === "true");
    if (storedDispatch !== null) setAutoDispatch(storedDispatch === "true");
    if (storedTimeout !== null) setSessionTimeout(storedTimeout);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      localStorage.setItem("admin_settings_baseFare", baseFare);
      localStorage.setItem("admin_settings_perKmRate", perKmRate);
      localStorage.setItem("admin_settings_surge", surgeMultiplier);
      localStorage.setItem("admin_settings_allowReg", String(allowDriverRegistration));
      localStorage.setItem("admin_settings_autoDispatch", String(autoDispatch));
      localStorage.setItem("admin_settings_timeout", sessionTimeout);

      showToast({
        title: "Configuration Saved",
        description: "Global CampusRide platform settings have been updated successfully.",
        type: "success",
      });
      setSaving(false);
    }, 800);
  };

  return (
    <DashboardShell role="ADMIN">
      <div className="max-w-3xl space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">System Settings</h1>
          <p className="text-zinc-500">Manage global ride rates, driver onboarding rules, and platform configuration parameters.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Fare Structure */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-650 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Global Fare Pricing</CardTitle>
                  <CardDescription>Adjust base costs and dynamic distance rates for the entire campus fleet.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="base-fare">Base Fare (₹)</Label>
                  <Input
                    id="base-fare"
                    type="number"
                    step="0.5"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="per-km">Rate per KM (₹)</Label>
                  <Input
                    id="per-km"
                    type="number"
                    step="0.5"
                    value={perKmRate}
                    onChange={(e) => setPerKmRate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="surge">Surge Multiplier</Label>
                  <Input
                    id="surge"
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="3.0"
                    value={surgeMultiplier}
                    onChange={(e) => setSurgeMultiplier(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-400">
                Formula: Final Fare = Base Fare + (Rate per KM × Distance in KM) × Surge Multiplier.
              </p>
            </CardContent>
          </Card>

          {/* Platform controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-650 rounded-xl">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>System & Registry Control</CardTitle>
                  <CardDescription>Enable or restrict key system actions and driver registrations.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <Label htmlFor="allow-reg" className="font-semibold text-zinc-800">New Driver Registration</Label>
                  <p className="text-xs text-zinc-500">Allow drivers to apply for registration through the onboarding portal.</p>
                </div>
                <input
                  id="allow-reg"
                  type="checkbox"
                  checked={allowDriverRegistration}
                  onChange={(e) => setAllowDriverRegistration(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="auto-dispatch" className="font-semibold text-zinc-800">Automatic Dispatching</Label>
                  <p className="text-xs text-zinc-500">Enable automatic background driver matching algorithms for requested rides.</p>
                </div>
                <input
                  id="auto-dispatch"
                  type="checkbox"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-650 rounded-xl">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Admin Security Policies</CardTitle>
                  <CardDescription>Configure console verification and token lifecycle options.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout" className="font-semibold text-zinc-850">Session Idle Timeout (minutes)</Label>
                <select
                  id="session-timeout"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="flex h-10 w-full max-w-md rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
                <p className="text-xs text-zinc-400">
                  Force logs admin out if inactive in the admin dashboard for this length of time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px] gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
