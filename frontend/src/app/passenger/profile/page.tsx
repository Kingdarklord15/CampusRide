"use client";

import { useState, useEffect } from "react";
import { User, BookOpen, MapPin, Phone, Mail, ShieldAlert } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PassengerProfilePage() {
  const { user, setUser } = useAuthStore();
  const showToast = useUiStore((state) => state.toast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [defaultPickup, setDefaultPickup] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast({ title: "Validation Error", description: "Name and email are required", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const updated = await userService.updateProfile({ name, email, phone });
      setUser(updated);
      showToast({ title: "Profile Updated", description: "Your profile details have been saved.", type: "success" });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update profile";
      showToast({ title: "Update Failed", description: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell role="PASSENGER">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Your Profile</h1>
          <p className="text-zinc-500">Manage your credentials, university ID, and default hotspot preferences.</p>
        </div>

        <div className="p-6 border rounded-2xl bg-white shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-6">
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-extrabold text-indigo-600 text-2xl">
                {name?.[0] || "P"}
              </div>
              <div>
                <p className="font-bold text-lg text-zinc-900">{name}</p>
                <p className="text-xs text-zinc-500 font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md inline-block">
                  Verified Passenger
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="John Doe"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="student@university.edu"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    placeholder="+91 98765 43210"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="univ-id">University Student ID</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="univ-id"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className="pl-10"
                    placeholder="2026CSE0981"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 border-t pt-4">
              <Label htmlFor="pickup">Default Campus Pickup Spot</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="pickup"
                  value={defaultPickup}
                  onChange={(e) => setDefaultPickup(e.target.value)}
                  className="pl-10"
                  placeholder="Central Library / Hostel Gate"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
