import type React from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from './components/ui/Badge'
import { Button } from './components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card'
import { Input } from './components/ui/Input'
import { cn } from './lib/utils'

type PurchaseOrder = {
  id: string
  vendor: string
  category: string
  amount: number
  status: 'Approved' | 'Pending' | 'Rejected' | 'In review'
  createdAt: string
}

type Vendor = {
  name: string
  spend: number
  orders: number
  onTime: number
}

const spendSeries = [
  { month: 'Aug', spend: 82_000 },
  { month: 'Sep', spend: 91_000 },
  { month: 'Oct', spend: 87_500 },
  { month: 'Nov', spend: 103_000 },
  { month: 'Dec', spend: 98_200 },
  { month: 'Jan', spend: 112_400 },
]

const recentOrders: PurchaseOrder[] = [
  {
    id: 'PO-10492',
    vendor: 'Northwind Office Supply',
    category: 'Office',
    amount: 4_820,
    status: 'Approved',
    createdAt: 'Today, 09:12',
  },
  {
    id: 'PO-10491',
    vendor: 'Contoso Cloud',
    category: 'Software',
    amount: 18_400,
    status: 'In review',
    createdAt: 'Yesterday, 16:40',
  },
  {
    id: 'PO-10490',
    vendor: 'Blue Skies Logistics',
    category: 'Shipping',
    amount: 6_220,
    status: 'Pending',
    createdAt: 'Yesterday, 10:05',
  },
  {
    id: 'PO-10489',
    vendor: 'Fabrikam Industrial',
    category: 'Hardware',
    amount: 32_900,
    status: 'Approved',
    createdAt: 'Jan 1, 13:18',
  },
  {
    id: 'PO-10488',
    vendor: 'Tailspin Marketing',
    category: 'Services',
    amount: 9_700,
    status: 'Rejected',
    createdAt: 'Dec 30, 11:02',
  },
]

const topVendors: Vendor[] = [
  { name: 'Contoso Cloud', spend: 184_000, orders: 26, onTime: 96 },
  { name: 'Fabrikam Industrial', spend: 142_300, orders: 14, onTime: 91 },
  { name: 'Northwind Office Supply', spend: 88_900, orders: 49, onTime: 98 },
  { name: 'Blue Skies Logistics', spend: 62_250, orders: 11, onTime: 89 },
]

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function StatusBadge({ status }: { status: PurchaseOrder['status'] }) {
  const tone =
    status === 'Approved'
      ? 'green'
      : status === 'Pending'
        ? 'amber'
        : status === 'Rejected'
          ? 'red'
          : 'blue'
  return <Badge tone={tone}>{status}</Badge>
}

function KpiCard({
  title,
  value,
  delta,
  deltaTone,
  icon,
}: {
  title: string
  value: string
  delta: string
  deltaTone: 'up' | 'down'
  icon: React.ReactNode
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">{title}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {value}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium',
                  deltaTone === 'up'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700',
                )}
              >
                {deltaTone === 'up' ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {delta}
              </span>
              <span>vs last month</span>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-900/5 p-3 text-slate-800">
            {icon}
          </div>
        </div>
      </CardContent>
      <div className="h-1 w-full bg-gradient-to-r from-blue-500/70 via-indigo-500/70 to-purple-500/70" />
    </Card>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900">
      <div className="mx-auto flex max-w-[1440px] gap-6 p-4 md:p-6">
        <aside className="hidden w-[270px] flex-none flex-col gap-5 md:flex">
          <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Purchasing</div>
                <div className="text-xs text-slate-500">Dashboard</div>
              </div>
            </div>
          </div>

          <nav className="rounded-2xl bg-white p-2 ring-1 ring-slate-200/80 shadow-sm">
            <SidebarItem icon={<LayoutDashboard className="h-4 w-4" />} active>
              Overview
            </SidebarItem>
            <SidebarItem icon={<FileText className="h-4 w-4" />}>
              Purchase Orders
            </SidebarItem>
            <SidebarItem icon={<Users className="h-4 w-4" />}>Vendors</SidebarItem>
            <SidebarItem icon={<ShieldCheck className="h-4 w-4" />}>
              Approvals
            </SidebarItem>
            <SidebarItem icon={<BarChart3 className="h-4 w-4" />}>
              Analytics
            </SidebarItem>
            <SidebarItem icon={<CreditCard className="h-4 w-4" />}>
              Payments
            </SidebarItem>
            <div className="my-2 h-px bg-slate-100" />
            <SidebarItem icon={<Settings className="h-4 w-4" />}>Settings</SidebarItem>
            <SidebarItem icon={<LifeBuoy className="h-4 w-4" />}>Support</SidebarItem>
          </nav>

          <Card>
            <CardHeader>
              <CardTitle>Monthly budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold">$250k</div>
                  <div className="mt-1 text-xs text-slate-500">Allocated</div>
                </div>
                <Badge tone="amber">72% used</Badge>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[72%] rounded-full bg-slate-900" />
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Keep approvals tight to stay within budget.
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-500">Overview</div>
              <div className="truncate text-2xl font-semibold tracking-tight">
                Purchasing dashboard
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search orders, vendors..." className="pl-9" />
              </div>
              <Button variant="secondary">
                <Calendar className="h-4 w-4" />
                This month
              </Button>
              <Button>
                <ClipboardList className="h-4 w-4" />
                New PO
              </Button>
              <Button variant="ghost" className="hidden sm:inline-flex">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total spend"
              value={formatCurrency(112_400)}
              delta="+8.2%"
              deltaTone="up"
              icon={<CreditCard className="h-5 w-5" />}
            />
            <KpiCard
              title="Open purchase orders"
              value="37"
              delta="-4.1%"
              deltaTone="down"
              icon={<FileText className="h-5 w-5" />}
            />
            <KpiCard
              title="Pending approvals"
              value="9"
              delta="+2"
              deltaTone="up"
              icon={<BadgeCheck className="h-5 w-5" />}
            />
            <KpiCard
              title="On-time delivery"
              value="94%"
              delta="+1.6%"
              deltaTone="up"
              icon={<Truck className="h-5 w-5" />}
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Spend trend</CardTitle>
                  <div className="mt-1 text-xs text-slate-500">
                    Total spend over the last 6 months
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  View report <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendSeries} margin={{ left: 6, right: 14 }}>
                    <defs>
                      <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.32} />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 8" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                      width={44}
                    />
                    <Tooltip
                      cursor={{ stroke: '#94a3b8', strokeDasharray: '4 6' }}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid rgba(226,232,240,1)',
                        boxShadow:
                          '0 10px 20px -12px rgba(15,23,42,0.25)',
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), 'Spend']}
                    />
                    <Area
                      type="monotone"
                      dataKey="spend"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="url(#spendFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Top vendors</CardTitle>
                  <div className="mt-1 text-xs text-slate-500">
                    Highest spend this month
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topVendors.map((v) => (
                    <div
                      key={v.name}
                      className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-500" />
                          <div className="truncate text-sm font-medium">{v.name}</div>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {v.orders} orders • {v.onTime}% on-time
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatCurrency(v.spend)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Recent purchase orders</CardTitle>
                  <div className="mt-1 text-xs text-slate-500">
                    Latest activity across teams
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  View all <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-left text-xs text-slate-500">
                        <th className="px-3 py-2 font-medium">PO</th>
                        <th className="px-3 py-2 font-medium">Vendor</th>
                        <th className="px-3 py-2 font-medium">Category</th>
                        <th className="px-3 py-2 font-medium">Amount</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((po) => (
                        <tr key={po.id} className="text-sm">
                          <td className="px-3 py-3 font-medium">
                            <span className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
                              {po.id}
                            </span>
                          </td>
                          <td className="px-3 py-3">{po.vendor}</td>
                          <td className="px-3 py-3 text-slate-600">{po.category}</td>
                          <td className="px-3 py-3 font-medium">
                            {formatCurrency(po.amount)}
                          </td>
                          <td className="px-3 py-3">
                            <StatusBadge status={po.status} />
                          </td>
                          <td className="px-3 py-3 text-slate-500">{po.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ActivityRow
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Approval requested"
                    detail="PO-10491 • Contoso Cloud • $18.4k"
                    time="2h"
                  />
                  <ActivityRow
                    icon={<BadgeCheck className="h-4 w-4" />}
                    title="PO approved"
                    detail="PO-10492 • Northwind Office Supply"
                    time="5h"
                  />
                  <ActivityRow
                    icon={<Truck className="h-4 w-4" />}
                    title="Shipment updated"
                    detail="Blue Skies Logistics • Tracking received"
                    time="1d"
                  />
                  <ActivityRow
                    icon={<Activity className="h-4 w-4" />}
                    title="Spend anomaly flagged"
                    detail="Services category trending above baseline"
                    time="2d"
                  />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-white p-2 ring-1 ring-slate-200">
                      <BarChart3 className="h-4 w-4 text-slate-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium">Quick insight</div>
                      <div className="mt-1 text-xs text-slate-500">
                        Software spend is up <span className="font-medium">+12%</span>{' '}
                        due to renewals.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}

function SidebarItem({
  icon,
  active,
  children,
}: {
  icon: React.ReactNode
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition',
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-700 hover:bg-slate-50',
      )}
    >
      <span className={cn(active ? 'text-white' : 'text-slate-500')}>{icon}</span>
      <span className="flex-1">{children}</span>
    </button>
  )
}

function ActivityRow({
  icon,
  title,
  detail,
  time,
}: {
  icon: React.ReactNode
  title: string
  detail: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
      <div className="mt-0.5 rounded-lg bg-slate-900/5 p-2 text-slate-800">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate text-sm font-medium">{title}</div>
          <div className="text-xs text-slate-400">{time}</div>
        </div>
        <div className="mt-1 truncate text-xs text-slate-500">{detail}</div>
      </div>
    </div>
  )
}
