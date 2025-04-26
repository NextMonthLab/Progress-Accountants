import React from 'react';
import { Route } from "wouter";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import EntrepreneurSupport from "@/pages/admin/EntrepreneurSupport";

/**
 * Emergency routes that directly render admin pages with no layouts or guards
 * These are intended as a last resort when protected routes are failing
 */
export function EmergencyRoutes() {
  return (
    <>
      {/* Direct access emergency routes */}
      <Route path="/emergency-dashboard">
        <AdminDashboardPage />
      </Route>

      <Route path="/emergency-entrepreneur">
        <EntrepreneurSupport />
      </Route>
    </>
  );
}