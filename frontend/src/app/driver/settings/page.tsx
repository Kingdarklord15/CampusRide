"use client";

import { useState, useEffect } from "react";
import { Bell, Shield, Car, Save } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function DriverSettingsPage() {
  const showToast = useUiStore((state) => state.toast);

  // Driver-specific configurations
  const [autoAccept, setAutoAccept] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [speedWarning, setSpeedWarning] = useState("30");
  const [payoutEmails, setPayoutEmails] = useState(true);
  const [lowBatteryWarning, setLowBatteryWarning] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load from localStorage if present
    const storedAuto = localStorage.getItem("driver_settings_autoAccept");
    const storedSound = localStorage.getItem("driver_settings_soundAlerts");
    const storedSpeed = localStorage.getItem("driver_settings_speedWarning");
    const storedPayout = localStorage.getItem("driver_settings_payoutEmails");
    const storedBattery = localStorage.getItem("driver_settings_lowBattery");

    if (storedAuto !== null) setAutoAccept(storedAuto === "true");
    if (storedSound !== null) setSoundAlerts(storedSound === "true");
    if (storedSpeed !== null) setSpeedWarning(storedSpeed);
    if (storedPayout !== null) setPayoutEmails(storedPayout === "true");
    if (storedBattery !== null) setLowBatteryWarning(storedBattery === "true");
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      localStorage.setItem("driver_settings_autoAccept", String(autoAccept));
      localStorage.setItem("driver_settings_soundAlerts", String(soundAlerts));
      localStorage.setItem("driver_settings_speedWarning", speedWarning);
      localStorage.setItem("driver_settings_payoutEmails", String(payoutEmails));
      localStorage.setItem("driver_settings_lowBattery", String(lowBatteryWarning));

      showToast({
        title: "Settings Saved",
        description: "Your driver preferences have been successfully updated.",
        type: "success",
      });
      setSaving(false);
    }, 800);
  };

  return (
    <DashboardShell role="DRIVER">
      <div className="max-w-3xl space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Driver Settings</h1>
          <p className="text-zinc-500">Customize your dispatch rules, notifications, and vehicle alerts.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Dispatch Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-650 rounded-xl">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Dispatch Preferences</CardTitle>
                  <CardDescription>Configure how you receive and manage incoming passenger requests.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <Label htmlFor="auto-accept" className="font-semibold text-zinc-800">Auto-Accept Rides</Label>
                  <p className="text-xs text-zinc-500">Automatically accept matched passenger requests within your radius.</p>
                </div>
                <input
                  id="auto-accept"
                  type="checkbox"
                  checked={autoAccept}
                  onChange={(e) => setAutoAccept(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="sound-alerts" className="font-semibold text-zinc-800">Sound Notifications</Label>
                  <p className="text-xs text-zinc-500">Play an audio ping for incoming requests even when the app is in the background.</p>
                </div>
                <input
                  id="sound-alerts"
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Warnings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-650 rounded-xl">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Safety & Vehicle Limits</CardTitle>
                  <CardDescription>Setup threshold notifications for safe vehicle handling.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="speed-warning" className="font-semibold text-zinc-800">Speed Limit Warning (km/h)</Label>
                <select
                  id="speed-warning"
                  value={speedWarning}
                  onChange={(e) => setSpeedWarning(e.target.value)}
                  className="flex h-10 w-full max-w-md rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="20">20 km/h (Strict Zone)</option>
                  <option value="30">30 km/h (Standard Campus Limit)</option>
                  <option value="40">40 km/h (Main Perimeter)</option>
                  <option value="50">50 km/h (Express Route)</option>
                </select>
                <p className="text-xs text-zinc-400">
                  Sends an alert if your vehicle's speed telemetry exceeds this value.
                </p>
              </div>

              <div className="flex items-center justify-between py-2 border-t mt-4">
                <div>
                  <Label htmlFor="battery-warning" className="font-semibold text-zinc-800">Low Battery / Fuel Warnings</Label>
                  <p className="text-xs text-zinc-500">Warn me when vehicle power levels drop below 20%.</p>
                </div>
                <input
                  id="battery-warning"
                  type="checkbox"
                  checked={lowBatteryWarning}
                  onChange={(e) => setLowBatteryWarning(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-650 rounded-xl">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Earnings & Reports</CardTitle>
                  <CardDescription>Select which reports you'd like to receive via email.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="payout-emails" className="font-semibold text-zinc-800">Weekly Earnings Summary</Label>
                  <p className="text-xs text-zinc-500">Detailed payout breakdown and hours-worked sheet.</p>
                </div>
                <input
                  id="payout-emails"
                  type="checkbox"
                  checked={payoutEmails}
                  onChange={(e) => setPayoutEmails(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
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
              {saving ? "Saving Changes..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
