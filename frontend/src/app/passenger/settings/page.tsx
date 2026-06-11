"use client";

import { useState, useEffect } from "react";
import { Bell, Shield, Eye, Save } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PassengerSettingsPage() {
  const showToast = useUiStore((state) => state.toast);
  
  // Local states for settings (persisted in localStorage for convenience)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [mapStyle, setMapStyle] = useState("streets");
  const [autoShareLocation, setAutoShareLocation] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load from localStorage if present
    const storedEmail = localStorage.getItem("passenger_settings_emailAlerts");
    const storedPush = localStorage.getItem("passenger_settings_pushAlerts");
    const storedSms = localStorage.getItem("passenger_settings_smsAlerts");
    const storedContact = localStorage.getItem("passenger_settings_emergencyContact");
    const storedMap = localStorage.getItem("passenger_settings_mapStyle");
    const storedShare = localStorage.getItem("passenger_settings_autoShare");

    if (storedEmail !== null) setEmailAlerts(storedEmail === "true");
    if (storedPush !== null) setPushAlerts(storedPush === "true");
    if (storedSms !== null) setSmsAlerts(storedSms === "true");
    if (storedContact !== null) setEmergencyContact(storedContact);
    if (storedMap !== null) setMapStyle(storedMap);
    if (storedShare !== null) setAutoShareLocation(storedShare === "true");
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      localStorage.setItem("passenger_settings_emailAlerts", String(emailAlerts));
      localStorage.setItem("passenger_settings_pushAlerts", String(pushAlerts));
      localStorage.setItem("passenger_settings_smsAlerts", String(smsAlerts));
      localStorage.setItem("passenger_settings_emergencyContact", emergencyContact);
      localStorage.setItem("passenger_settings_mapStyle", mapStyle);
      localStorage.setItem("passenger_settings_autoShare", String(autoShareLocation));

      showToast({
        title: "Settings Saved",
        description: "Your passenger preferences have been updated successfully.",
        type: "success",
      });
      setSaving(false);
    }, 800);
  };

  return (
    <DashboardShell role="PASSENGER">
      <div className="max-w-3xl space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Account Settings</h1>
          <p className="text-zinc-500">Configure your application settings, safety features, and preferences.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-650 rounded-xl">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Select how and when you want to be notified about ride updates.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <Label htmlFor="push-alerts" className="font-semibold text-zinc-800">Push Notifications</Label>
                  <p className="text-xs text-zinc-500">Real-time status updates on ride requests, arrival, and completion.</p>
                </div>
                <input
                  id="push-alerts"
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <Label htmlFor="email-alerts" className="font-semibold text-zinc-800">Email Notifications</Label>
                  <p className="text-xs text-zinc-500">Receipts, billing details, and trip invoices sent to your email.</p>
                </div>
                <input
                  id="email-alerts"
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="sms-alerts" className="font-semibold text-zinc-800">SMS / Text Alerts</Label>
                  <p className="text-xs text-zinc-500">Emergency backup status notifications sent to your phone number.</p>
                </div>
                <input
                  id="sms-alerts"
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Safety & Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-650 rounded-xl">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Safety & Emergency</CardTitle>
                  <CardDescription>Manage your emergency contacts and security details.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-contact" className="font-semibold text-zinc-800">Emergency Contact Number</Label>
                <Input
                  id="emergency-contact"
                  type="tel"
                  placeholder="+91 99999 88888"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="max-w-md"
                />
                <p className="text-xs text-zinc-400">
                  This contact will be notified automatically if you trigger the SOS button during a ride.
                </p>
              </div>

              <div className="flex items-center justify-between py-2 border-t mt-4">
                <div>
                  <Label htmlFor="auto-share" className="font-semibold text-zinc-800">Auto-Share Location</Label>
                  <p className="text-xs text-zinc-500">Share your active ride location dynamically with your university security desk.</p>
                </div>
                <input
                  id="auto-share"
                  type="checkbox"
                  checked={autoShareLocation}
                  onChange={(e) => setAutoShareLocation(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Display & Map Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-650 rounded-xl">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Map & Display Settings</CardTitle>
                  <CardDescription>Customize the look and feel of the ride tracking dashboard.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="map-style" className="font-semibold text-zinc-800">Default Map Type</Label>
                <select
                  id="map-style"
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value)}
                  className="flex h-10 w-full max-w-md rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="streets">Standard Streets (OpenStreetMap)</option>
                  <option value="satellite">Satellite View</option>
                  <option value="dark">Dark Theme Map</option>
                  <option value="topo">Topographic Map</option>
                </select>
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
