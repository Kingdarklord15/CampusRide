"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Shield, CreditCard, Car, Check, AlertCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { driverService } from "@/services/driver.service";
import { vehicleService } from "@/services/vehicle.service";
import { useUiStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DriverProfilePage() {
  const { user } = useAuthStore();
  const showToast = useUiStore((state) => state.toast);

  // Fetch driver profile
  const { data: profile, isLoading: loadingProfile, refetch: refetchProfile } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: driverService.me,
  });

  // Fetch vehicle details
  const { data: vehicle, isLoading: loadingVehicle, refetch: refetchVehicle } = useQuery({
    queryKey: ["driverVehicle", profile?.id],
    queryFn: vehicleService.getMine,
    enabled: !!profile?.id,
  });

  // Profile Form state
  const [licenseNumber, setLicenseNumber] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Vehicle Form state
  const [regNumber, setRegNumber] = useState("");
  const [vType, setVType] = useState<"E_RICKSHAW" | "CART" | "SHUTTLE">("E_RICKSHAW");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [savingVehicle, setSavingVehicle] = useState(false);

  useEffect(() => {
    if (profile) {
      setLicenseNumber(profile.licenseNumber || "");
    }
  }, [profile]);

  useEffect(() => {
    if (vehicle) {
      setRegNumber(vehicle.registrationNumber || "");
      setVType(vehicle.vehicleType);
      setModel(vehicle.model || "");
      setColor(vehicle.color || "");
      setCapacity(vehicle.capacity);
    }
  }, [vehicle]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNumber) return;

    setSavingProfile(true);
    try {
      if (!profile) {
        // Create Driver Profile
        await driverService.create({ licenseNumber });
        showToast({ title: "Profile Activated", description: "Driver profile created successfully.", type: "success" });
      } else {
        // Update Driver Profile
        await driverService.updateProfile({ licenseNumber });
        showToast({ title: "Profile Updated", description: "Driver profile updated successfully.", type: "success" });
      }
      refetchProfile();
    } catch (err: any) {
      showToast({ title: "Failed", description: err.message, type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleVehicleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber || !capacity) return;

    setSavingVehicle(true);
    try {
      if (!vehicle) {
        // Add Vehicle
        await vehicleService.add({
          registrationNumber: regNumber,
          vehicleType: vType,
          model,
          color,
          capacity: Number(capacity),
          isActive: true
        });
        showToast({ title: "Vehicle Registered", description: "Your vehicle has been registered.", type: "success" });
      } else {
        // Update Vehicle
        await vehicleService.update({
          registrationNumber: regNumber,
          vehicleType: vType,
          model,
          color,
          capacity: Number(capacity)
        });
        showToast({ title: "Vehicle Updated", description: "Vehicle specifications saved successfully.", type: "success" });
      }
      refetchVehicle();
    } catch (err: any) {
      showToast({ title: "Failed", description: err.message, type: "error" });
    } finally {
      setSavingVehicle(false);
    }
  };

  return (
    <DashboardShell role="DRIVER">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        {/* Driver Profile */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900">Driver Profile</h2>
            <p className="text-zinc-500">Provide your official licensing information.</p>
          </div>

          <div className="p-6 border rounded-2xl bg-white space-y-6">
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="license">Commercial Driving License Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="license"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="pl-10 font-mono"
                    placeholder="DL-1420260012345"
                    required
                    disabled={savingProfile}
                  />
                </div>
              </div>

              {profile?.verifiedAt ? (
                <div className="p-3 border border-emerald-200 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <p>Your driver profile is fully verified and active.</p>
                </div>
              ) : (
                <div className="p-3 border border-yellow-250 rounded-xl bg-yellow-50 text-yellow-905 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0" />
                  <p>Verification pending. Our administrators are auditing your commercial license files.</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving Profile..." : profile ? "Update License" : "Activate Driver Profile"}
              </Button>
            </form>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900">Vehicle Specifications</h2>
            <p className="text-zinc-500">Register or modify your vehicle details.</p>
          </div>

          <div className="p-6 border rounded-2xl bg-white">
            {!profile ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                ⚠️ Activate your driver profile first before registering vehicle logs.
              </div>
            ) : (
              <form onSubmit={handleVehicleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="reg-num">Registration Plate</Label>
                    <Input
                      id="reg-num"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="DL 1RT 9876"
                      className="font-mono"
                      required
                      disabled={savingVehicle}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="v-type">Vehicle Type</Label>
                    <select
                      id="v-type"
                      value={vType}
                      onChange={(e) => setVType(e.target.value as any)}
                      className="w-full p-2 border rounded-lg bg-white text-sm"
                      disabled={savingVehicle}
                    >
                      <option value="E_RICKSHAW">E-Rickshaw</option>
                      <option value="CART">Golf Cart</option>
                      <option value="SHUTTLE">Campus Shuttle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="model">Vehicle Model</Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Mayuri Pro / ClubCar"
                      disabled={savingVehicle}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="color">Vehicle Color</Label>
                    <Input
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Green / White"
                      disabled={savingVehicle}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="capacity">Capacity (Seats)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min={1}
                    max={30}
                    required
                    disabled={savingVehicle}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={savingVehicle}
                >
                  {savingVehicle ? "Registering..." : vehicle ? "Save Specifications" : "Register Vehicle"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
