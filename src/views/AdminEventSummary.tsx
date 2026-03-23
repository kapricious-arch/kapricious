"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, ChevronLeft, LogOut, Wallet } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

const formatCurrency = (value: number) =>
  `INR ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const AdminEventSummary = () => {
  const router = useRouter();

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
      const { data, error } = await supabase.from("events").select("id, title, departments(code, name)").order("title");
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

  const summaryRows = useMemo(() => {
    if (!events) return [];

    const grouped = new Map<
      string,
      {
        eventId: string;
        eventName: string;
        departmentCode: string;
        registrationCount: number;
        verifiedCount: number;
        totalAmount: number;
      }
    >();

    events.forEach((event) => {
      grouped.set(event.id, {
        eventId: event.id,
        eventName: event.title,
        departmentCode: (event.departments as { code?: string } | null)?.code || "-",
        registrationCount: 0,
        verifiedCount: 0,
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
      current.totalAmount += Number(registration.amount_paid || 0);
    });

    return Array.from(grouped.values())
      .filter((row) => row.registrationCount > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount || b.registrationCount - a.registrationCount || a.eventName.localeCompare(b.eventName));
  }, [events, registrations]);

  const totals = useMemo(() => {
    return summaryRows.reduce(
      (acc, row) => {
        acc.events += 1;
        acc.registrations += row.registrationCount;
        acc.amount += row.totalAmount;
        return acc;
      },
      { events: 0, registrations: 0, amount: 0 },
    );
  }, [summaryRows]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
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
              Registrations and total collected amount grouped by event.
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

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Events With Registrations</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{totals.events}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Registrations</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{totals.registrations}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Amount</p>
            <p className="mt-1 text-2xl font-bold text-green-500">{formatCurrency(totals.amount)}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Per Event Collection</h2>
          </div>

          {summaryRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Event</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Registrations</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Verified Payments</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row) => (
                    <tr key={row.eventId} className="border-t border-border/30 hover:bg-muted/10">
                      <td className="px-4 py-3 font-medium text-foreground">{row.eventName}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{row.departmentCode}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{row.registrationCount}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{row.verifiedCount}</td>
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
            <div className="px-6 py-12 text-center text-muted-foreground">No registrations found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventSummary;
