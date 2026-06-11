"use client";

import { useState } from "react";
import { Search, UserCheck, UserX, ShieldAlert, ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useUsers } from "@/hooks/use-queries";
import { userService } from "@/services/user.service";
import { useUiStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersPage() {
  const { data: users, isLoading, refetch } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const showToast = useUiStore((state) => state.toast);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await userService.updateById(userId, { isActive: !currentStatus });
      showToast({
        title: "Status Updated",
        description: `User account has been ${!currentStatus ? "activated" : "deactivated"}.`,
        type: "success",
      });
      refetch();
    } catch (err: any) {
      showToast({ title: "Failed to Update", description: err.message, type: "error" });
    }
  };

  // Filter users based on search & role
  const filteredUsers = users?.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  }) || [];

  return (
    <DashboardShell role="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">User Management</h1>
          <p className="text-zinc-500">View and toggle account activations for campus members.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border rounded-2xl shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {["ALL", "PASSENGER", "DRIVER", "ADMIN"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  roleFilter === role
                    ? "bg-indigo-650 text-white border-indigo-600"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200"
                }`}
              >
                {role.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto border border-zinc-100 rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-550 border-b">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/50">
                    <td className="p-4 font-bold text-zinc-900">{u.name}</td>
                    <td className="p-4 text-zinc-500">{u.email}</td>
                    <td className="p-4 text-zinc-500">{u.phone || "—"}</td>
                    <td className="p-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        u.role === "ADMIN" ? "bg-purple-100 text-purple-750" : u.role === "DRIVER" ? "bg-amber-100 text-amber-800" : "bg-indigo-150 text-indigo-800"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== "ADMIN" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          className={u.isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"}
                        >
                          {u.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-1" /> Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-xs text-zinc-400 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-zinc-50/50">
            <ShieldAlert className="h-10 w-10 text-zinc-400 mb-3" />
            <p className="font-semibold text-zinc-700">No users found</p>
            <p className="text-sm text-zinc-500">Try modifying your search query.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
