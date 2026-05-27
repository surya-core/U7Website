"use strict";
"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getUsersList,
  updateUserRole,
  deleteUser,
  editUserRecord,
  getDbLogs,
  deletePaymentRecord,
  deleteAttendanceRecord,
} from "@/app/actions/super-admin";
import {
  Users,
  Trash2,
  Edit,
  Activity,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Role } from "@prisma/client";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: Role;
  age: number;
  gender: string;
  joiningDate: Date;
  height: number;
  weight: number;
  emergencyContact: string;
  medicalConditions: string | null;
  nextDueDate: Date | null;
};

type PaymentRecord = {
  id: string;
  userName: string;
  amount: number;
  durationMonths: number;
  paymentDate: Date;
  nextDueDate: Date;
};

type AttendanceRecord = {
  id: string;
  userName: string;
  date: Date;
  entryTime: Date;
  exitTime: Date | null;
};

export function SuperAdminConsole() {
  const [activeTab, setActiveTab] = useState<"USERS" | "PAYMENTS" | "ATTENDANCE">("USERS");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit user state
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  
  // Transition actions
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    setToast(null);
    try {
      if (activeTab === "USERS") {
        const res = await getUsersList();
        if (res.success && res.users) {
          setUsers(res.users as unknown as UserRecord[]);
        } else {
          setToast({ type: "error", message: res.message || "Failed to load users" });
        }
      } else {
        const res = await getDbLogs();
        if (res.success) {
          setPayments(res.payments as unknown as PaymentRecord[]);
          setAttendances(res.attendances as unknown as AttendanceRecord[]);
        } else {
          setToast({ type: "error", message: res.message || "Failed to load database logs" });
        }
      }
    } catch {
      setToast({ type: "error", message: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setToast(null);
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setToast({ type: "success", message: res.message });
        loadData();
      } else {
        setToast({ type: "error", message: res.message || "Failed to change role" });
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you absolutely sure you want to delete this user? All their attendance logs and payment records will be permanently removed!")) {
      return;
    }
    setToast(null);
    startTransition(async () => {
      const res = await deleteUser(userId);
      if (res.success) {
        setToast({ type: "success", message: res.message });
        loadData();
      } else {
        setToast({ type: "error", message: res.message || "Failed to delete user" });
      }
    });
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm("Delete this payment log? This will NOT alter the user's current profile height/weight, but removes the receipt details.")) {
      return;
    }
    setToast(null);
    startTransition(async () => {
      const res = await deletePaymentRecord(paymentId);
      if (res.success) {
        setToast({ type: "success", message: res.message });
        loadData();
      } else {
        setToast({ type: "error", message: res.message || "Failed to delete payment log" });
      }
    });
  };

  const handleDeleteAttendance = async (attId: string) => {
    if (!confirm("Permanently delete this check-in attendance record?")) {
      return;
    }
    setToast(null);
    startTransition(async () => {
      const res = await deleteAttendanceRecord(attId);
      if (res.success) {
        setToast({ type: "success", message: res.message });
        loadData();
      } else {
        setToast({ type: "error", message: res.message || "Failed to delete attendance log" });
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setToast(null);

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      mobileNumber: formData.get("mobileNumber") as string,
      age: formData.get("age"),
      gender: formData.get("gender") as string,
      height: formData.get("height"),
      weight: formData.get("weight"),
      emergencyContact: formData.get("emergencyContact") as string,
      medicalConditions: formData.get("medicalConditions") as string,
    };

    startTransition(async () => {
      const res = await editUserRecord(editingUser.id, updatedData);
      if (res.success) {
        setToast({ type: "success", message: res.message });
        setEditingUser(null);
        loadData();
      } else {
        setToast({ type: "error", message: res.message || "Failed to edit user profile" });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toast && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-sm animate-fadeIn ${
            toast.type === "success"
              ? "bg-emerald-950/40 border border-emerald-900/30 text-emerald-400"
              : "bg-red-950/40 border border-red-900/30 text-red-400"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-900 pb-2">
        <button
          onClick={() => setActiveTab("USERS")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "USERS" ? "bg-red-600 text-white" : "bg-zinc-950 text-zinc-400 hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" />
          Member Roles & CRUD
        </button>
        <button
          onClick={() => setActiveTab("PAYMENTS")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "PAYMENTS" ? "bg-red-600 text-white" : "bg-zinc-950 text-zinc-400 hover:text-white"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Payment Transactions
        </button>
        <button
          onClick={() => setActiveTab("ATTENDANCE")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "ATTENDANCE" ? "bg-red-600 text-white" : "bg-zinc-950 text-zinc-400 hover:text-white"
          }`}
        >
          <Activity className="h-4 w-4" />
          Attendance Records
        </button>
      </div>

      {/* View/Edit User Overlay modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="glass-card max-w-lg w-full rounded-2xl p-6 border border-zinc-850 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Modify Profile Record</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-xs text-zinc-500 hover:text-white border border-zinc-850 px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">NAME</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingUser.name}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">EMAIL</label>
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={editingUser.email}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">MOBILE</label>
                  <input
                    name="mobileNumber"
                    required
                    defaultValue={editingUser.mobileNumber}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">AGE</label>
                  <input
                    name="age"
                    type="number"
                    required
                    defaultValue={editingUser.age}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">GENDER</label>
                  <select
                    name="gender"
                    defaultValue={editingUser.gender}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">HEIGHT (cm)</label>
                  <input
                    name="height"
                    type="number"
                    step="0.1"
                    required
                    defaultValue={editingUser.height}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">WEIGHT (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    required
                    defaultValue={editingUser.weight}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">EMERGENCY CONTACT</label>
                  <input
                    name="emergencyContact"
                    required
                    defaultValue={editingUser.emergencyContact}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">MEDICAL ISSUES / INJURIES</label>
                <textarea
                  name="medicalConditions"
                  rows={2}
                  defaultValue={editingUser.medicalConditions || ""}
                  placeholder="No conditions logged"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-850 text-white font-bold rounded flex items-center justify-center gap-1.5"
              >
                {isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                Save Database Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Tables */}
      <div className="glass-card rounded-2xl border border-zinc-850 p-6 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="h-6 w-6 text-red-500 animate-spin" />
            <span className="text-zinc-500 text-sm ml-2">Connecting to db...</span>
          </div>
        ) : activeTab === "USERS" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Member</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Mobile</th>
                  <th className="py-3 px-2">Dues Expiry</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-950/20">
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[10px] text-zinc-500">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                        disabled={isPending}
                        className="bg-zinc-950 border border-zinc-900 rounded px-2 py-1 font-semibold text-zinc-300 focus:outline-none focus:border-red-600"
                      >
                        <option value="USER">User (Member)</option>
                        <option value="ADMIN">Admin (Staff)</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-2">{u.mobileNumber}</td>
                    <td className="py-3.5 px-2">
                      {u.role === "USER" ? (
                        u.nextDueDate ? (
                          <span
                            className={
                              new Date(u.nextDueDate) < new Date() ? "text-red-500 font-semibold" : "text-zinc-400"
                            }
                          >
                            {new Date(u.nextDueDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-zinc-650">No Payments</span>
                        )
                      ) : (
                        <span className="text-zinc-500 italic">Staff</span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-right space-x-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-800 transition-colors"
                        title="Edit Record"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-500 border border-zinc-900 hover:border-red-900/30 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "PAYMENTS" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase">
                  <th className="py-3 px-2">Member</th>
                  <th className="py-3 px-2">Payment Date</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Duration</th>
                  <th className="py-3 px-2 text-right">Delete Rec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-zinc-500">No payment entries found.</td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-950/20">
                      <td className="py-3 px-2 font-bold text-white">{p.userName}</td>
                      <td className="py-3 px-2">{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td className="py-3 px-2 font-semibold text-emerald-400">₹{p.amount}</td>
                      <td className="py-3 px-2">{p.durationMonths} Month(s)</td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handleDeletePayment(p.id)}
                          className="p-1.5 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-500 border border-zinc-900 hover:border-red-900/30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase">
                  <th className="py-3 px-2">Member</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Check In</th>
                  <th className="py-3 px-2">Check Out</th>
                  <th className="py-3 px-2 text-right">Delete Rec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                {attendances.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-zinc-500">No attendance logged yet.</td>
                  </tr>
                ) : (
                  attendances.map((a) => (
                    <tr key={a.id} className="hover:bg-zinc-950/20">
                      <td className="py-3 px-2 font-bold text-white">{a.userName}</td>
                      <td className="py-3 px-2">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="py-3 px-2">{new Date(a.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-3 px-2">
                        {a.exitTime ? (
                          new Date(a.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        ) : (
                          <span className="text-red-500 font-bold uppercase tracking-wider text-[9px]">Active</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handleDeleteAttendance(a.id)}
                          className="p-1.5 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-500 border border-zinc-900 hover:border-red-900/30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
