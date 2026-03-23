"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, ChevronLeft, Filter, Layers3, LogOut, Wallet } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

const formatCurrency = (value: number) =>
  `INR ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

type SortMode = "amount_desc" | "registrations_desc" | "verified_desc" | "event_asc";

const AdminEventSummary = () => {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [sortMode, setSortMode] = useState<SortMode>("amount_desc");

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin");
        return;
      }

      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (!roles?.some((role) => role.role === "admin")) {
        await supabase.auth.signOut();
        router.push("/admin");
      }
    };

    check();
  }, [router]);

  const { data: events } = useQuery({
    queryKey: ["admin-summary-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, departments(code, name)")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: registrations } = useQuery({
    queryKey: ["admin-summary-registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("event_id, amount_paid, payment_status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const eventRows = useMemo(() => {
    if (!events) return [];

    const grouped = new Map<
      string,
      {
        eventId: string;
        eventName: string;
        departmentCode: string;
        departmentName: string;
        registrationCount: number;
        verifiedCount: number;
        pendingCount: number;
        totalAmount: number;
      }
    >();

    events.forEach((event) => {
      const department = event.departments as { code?: string; name?: string } | null;
      grouped.set(event.id, {
        eventId: event.id,
        eventName: event.title,
        departmentCode: department?.code || "-",
        departmentName: department?.name || "Unknown",
        registrationCount: 0,
        verifiedCount: 0,
        pendingCount: 0,
        totalAmount: 0,
      });
    });

    (registrations || []).forEach((registration) => {
      const current = grouped.get(registration.event_id);
      if (!current) return;

      current.registrationCount += 1;
      if (registration.payment_status === "verified") {
        current.verifiedCount += 1;
      }
      if (registration.payment_status === "pending") {
        current.pendingCount += 1;
      }
      current.totalAmount += Number(registration.amount_paid || 0);
    });

    return Array.from(grouped.values()).filter((row) => row.registrationCount > 0);
  }, [events, registrations]);

  const departmentOptions = useMemo(() => {
    return [
      { code: "ALL", name: "All Departments" },
      ...Array.from(
        new Map(
          eventRows.map((row) => [
            row.departmentCode,
            { code: row.departmentCode, name: row.departmentName },
          ]),
        ).values(),
      ).sort((a, b) => a.code.localeCompare(b.code)),
    ];
  }, [eventRows]);

  const departmentRows = useMemo(() => {
    const grouped = new Map<
      string,
      {
        departmentCode: string;
        departmentName: string;
        eventCount: number;
        registrationCount: number;
        verifiedCount: number;
        pendingCount: number;
        totalAmount: number;
      }
    >();

    eventRows.forEach((row) => {
      const current = grouped.get(row.departmentCode) || {
        departmentCode: row.departmentCode,
        departmentName: row.departmentName,
        eventCount: 0,
        registrationCount: 0,
        verifiedCount: 0,
        pendingCount: 0,
        totalAmount: 0,
      };

      current.eventCount += 1;
      current.registrationCount += row.registrationCount;
      current.verifiedCount += row.verifiedCount;
      current.pendingCount += row.pendingCount;
      current.totalAmount += row.totalAmount;

      grouped.set(row.departmentCode, current);
    });

    return Array.from(grouped.values()).sort(
      (a, b) =>
        b.totalAmount - a.totalAmount ||
        b.registrationCount - a.registrationCount ||
        a.departmentCode.localeCompare(b.departmentCode),
    );
  }, [eventRows]);

  const filteredEventRows = useMemo(() => {
    const scopedRows =
      selectedDepartment === "ALL"
        ? eventRows
        : eventRows.filter((row) => row.departmentCode === selectedDepartment);

    return [...scopedRows].sort((a, b) => {
      if (sortMode === "registrations_desc") {
        return b.registrationCount - a.registrationCount || b.totalAmount - a.totalAmount || a.eventName.localeCompare(b.eventName);
      }
      if (sortMode === "verified_desc") {
        return b.verifiedCount - a.verifiedCount || b.totalAmount - a.totalAmount || a.eventName.localeCompare(b.eventName);
      }
      if (sortMode === "event_asc") {
        return a.eventName.localeCompare(b.eventName);
      }
      return b.totalAmount - a.totalAmount || b.registrationCount - a.registrationCount || a.eventName.localeCompare(b.eventName);
    });
  }, [eventRows, selectedDepartment, sortMode]);

  const overallTotals = useMemo(() => {
    return eventRows.reduce(
      (acc, row) => {
        acc.events += 1;
        acc.registrations += row.registrationCount;
        acc.verified += row.verifiedCount;
        acc.pending += row.pendingCount;
        acc.amount += row.totalAmount;
        return acc;
      },
      { events: 0, registrations: 0, verified: 0, pending: 0, amount: 0 },
    );
  }, [eventRows]);

  const filteredTotals = useMemo(() => {
    return filteredEventRows.reduce(
      (acc, row) => {
        acc.events += 1;
        acc.registrations += row.registrationCount;
        acc.verified += row.verifiedCount;
        acc.pending += row.pendingCount;
        acc.amount += row.totalAmount;
        return acc;
      },
      { events: 0, registrations: 0, verified: 0, pending: 0, amount: 0 },
    );
  }, [filteredEventRows]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="mb-3">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Event <span className="text-primary">Summary</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Overall totals, department-wise breakdown, and per-event collection in one place.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-5">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Events With Registrations</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{overallTotals.events}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Registrations</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{overallTotals.registrations}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Verified Payments</p>
            <p className="mt-1 text-2xl font-bold text-green-500">{overallTotals.verified}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Pending Payments</p>
            <p className="mt-1 text-2xl font-bold text-amber-500">{overallTotals.pending}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Amount</p>
            <p className="mt-1 text-2xl font-bold text-green-500">{formatCurrency(overallTotals.amount)}</p>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Department View</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Filter the event summary by department and change the event sorting as needed.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Filter className="h-3.5 w-3.5" />
                  Department
                </span>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                >
                  {departmentOptions.map((department) => (
                    <option key={department.code} value={department.code}>
                      {department.code === "ALL" ? department.name : `${department.code} - ${department.name}`}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Sort Events By
                </span>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                >
                  <option value="amount_desc">Highest Amount</option>
                  <option value="registrations_desc">Most Registrations</option>
                  <option value="verified_desc">Most Verified Payments</option>
                  <option value="event_asc">Event Name</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-5">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Selected Events</p>
              <p className="mt-1 text-xl font-bold text-foreground">{filteredTotals.events}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Selected Registrations</p>
              <p className="mt-1 text-xl font-bold text-foreground">{filteredTotals.registrations}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Selected Verified</p>
              <p className="mt-1 text-xl font-bold text-green-500">{filteredTotals.verified}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Selected Pending</p>
              <p className="mt-1 text-xl font-bold text-amber-500">{filteredTotals.pending}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Selected Amount</p>
              <p className="mt-1 text-xl font-bold text-green-500">{formatCurrency(filteredTotals.amount)}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <Layers3 className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Department Summary</h2>
          </div>

          {departmentRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Events</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Registrations</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Verified</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentRows.map((row) => (
                    <tr key={row.departmentCode} className="border-t border-border/30 hover:bg-muted/10">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{row.departmentCode}</div>
                        <div className="text-xs text-muted-foreground">{row.departmentName}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">{row.eventCount}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{row.registrationCount}</td>
                      <td className="px-4 py-3 text-xs text-green-500">{row.verifiedCount}</td>
                      <td className="px-4 py-3 text-xs text-amber-500">{row.pendingCount}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          <Wallet className="h-3.5 w-3.5" />
                          {formatCurrency(row.totalAmount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-muted-foreground">No department data found yet.</div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Per Event Collection</h2>
          </div>

          {filteredEventRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Event</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Registrations</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Verified Payments</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Pending Payments</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEventRows.map((row) => (
                    <tr key={row.eventId} className="border-t border-border/30 hover:bg-muted/10">
                      <td className="px-4 py-3 font-medium text-foreground">{row.eventName}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-foreground">{row.departmentCode}</div>
                        <div className="text-xs text-muted-foreground">{row.departmentName}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">{row.registrationCount}</td>
                      <td className="px-4 py-3 text-xs text-green-500">{row.verifiedCount}</td>
                      <td className="px-4 py-3 text-xs text-amber-500">{row.pendingCount}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          <Wallet className="h-3.5 w-3.5" />
                          {formatCurrency(row.totalAmount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-muted-foreground">No registrations found for the selected department.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventSummary;
