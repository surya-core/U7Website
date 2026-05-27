import React from "react";
import { SuperAdminConsole } from "@/components/SuperAdminConsole";

export default function SuperAdminPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">Super Admin Console</h1>
        <p className="text-sm text-zinc-400">Database administration, role promotion controls, and full CRUD access logs.</p>
      </div>

      <SuperAdminConsole />
    </div>
  );
}
