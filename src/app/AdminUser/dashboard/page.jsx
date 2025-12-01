'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rows, setRows] = useState([
    { id: 'SF1005', customer: 'Tyrell Corporation', products: 'Voight-Kampff machine empathy sensors', date: 'Nov 20, 2025', status: 'Inquiry', dept: 'Design' },
    { id: 'SF1006', customer: 'Acme Corp', products: 'Custom brackets', date: 'Nov 18, 2025', status: 'Design', dept: 'Design' },
    { id: 'SF1007', customer: 'Wayne Tech', products: 'Titanium shafts', date: 'Nov 17, 2025', status: 'Machining', dept: 'Machining' },
  ]);
  const [form, setForm] = useState({ customer: '', products: '', custom: '', units: '', material: '', dept: '' });

  const createOrder = () => {
    const nextNum = Math.max(
      1000,
      ...rows.map(r => Number(String(r.id).replace(/\D/g, '')))
    ) + 1;
    const id = `SF${nextNum}`;
    const productText = form.custom?.trim() ? form.custom.trim() : (form.products || '—');
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', options);
    const newRow = {
      id,
      customer: form.customer || 'Unknown Customer',
      products: productText,
      date: dateStr,
      status: 'Inquiry',
      dept: form.dept || 'Design',
    };
    setRows(prev => [newRow, ...prev]);
    setShowCreateModal(false);
    setForm({ customer: '', products: '', custom: '', units: '', material: '', dept: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-md border border-gray-200 hover:bg-gray-50">
                <span className="sr-only">Toggle</span>✦
              </button>
              <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
            </div>

            {/* <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>
              <div className="h-8 w-8 rounded-full bg-gray-800" />
            </div> */}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-black">Orders by Status</h2>
                <span className="text-xs text-black">Last 30 days</span>
              </div>
              <p className="text-sm text-black mb-4">
                A breakdown of all orders by their current status.
              </p>
              <BarChart />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-black">Active Orders by Department</h2>
                <span className="text-xs text-black">Last 30 days</span>
              </div>
              <p className="text-sm text-black mb-4">
                Distribution of active orders across departments.
              </p>
              <DonutChart />
              <div className="flex gap-6 justify-center mt-4 text-xs text-black">
                <LegendDot color="bg-orange-500" label="Design" />
                <LegendDot color="bg-blue-500" label="Machining" />
                <LegendDot color="bg-yellow-400" label="Inspection" />
              </div>
            </div>
          </div>

          {/* Orders table section */}
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-black">All Orders</h2>
              <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md">
                <span>＋</span> Create Order
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by Order ID or Customer..."
                  className="w-full border border-gray-200 rounded-md px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-md px-2 py-2 text-sm text-black"
              >
                <option value="All">All</option>
                <option value="Inquiry">Inquiry</option>
                <option value="Design">Design</option>
                <option value="Production">Production</option>
                <option value="Machining">Machining</option>
                <option value="Inspection">Inspection</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <OrdersTable rows={rows} statusFilter={statusFilter} />
          </div>
        </div>
      </main>
      
      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">Create New Order</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-black">×</button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">Customer</label>
                  <select value={form.customer} onChange={(e)=>setForm(f=>({...f, customer:e.target.value}))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black">
                    <option value="">Select Customer...</option>
                    <option value="Tyrell Corporation">Tyrell Corporation</option>
                    <option value="Acme Corp">Acme Corp</option>
                    <option value="Wayne Tech">Wayne Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-black">Products</label>
                  <select value={form.products} onChange={(e)=>setForm(f=>({...f, products:e.target.value}))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black">
                    <option value="">Select Products...</option>
                    <option value="Custom brackets">Custom brackets</option>
                    <option value="Titanium shafts">Titanium shafts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-black">Or Enter Custom Product Details</label>
                  <textarea value={form.custom} onChange={(e)=>setForm(f=>({...f, custom:e.target.value}))} placeholder="For custom, one-off products, describe them here..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[90px] text-black" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-black">Units</label>
                    <input value={form.units} onChange={(e)=>setForm(f=>({...f, units:e.target.value}))} type="number" placeholder="e.g. 500" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-black">Material</label>
                    <input value={form.material} onChange={(e)=>setForm(f=>({...f, material:e.target.value}))} type="text" placeholder="e.g. Stainless Steel 316" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-black">Assign to Department</label>
                  <select value={form.dept} onChange={(e)=>setForm(f=>({...f, dept:e.target.value}))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black">
                    <option value="">Select initial department...</option>
                    <option value="Design">Design</option>
                    <option value="Production">Production</option>
                    <option value="Machining">Machining</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-md border border-gray-300 text-black">Cancel</button>
                <button onClick={createOrder} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">Create Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ label, active = false }) {
  return (
    <div
      className={`px-3 py-2 rounded-md cursor-pointer ${
        active ? 'bg-gray-100 text-black font-medium' : 'text-black hover:bg-gray-50'
      }`}
    >
      {label}
    </div>
  );
}

function SidebarGroup({ label, items = [] }) {
  return (
    <div>
      <div className="px-3 py-2 text-black">{label}</div>

      <div className="ml-2 pl-1 border-l border-gray-200 space-y-1">
        {items.map((i) => (
          <SidebarItem key={i} label={i} />
        ))}
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-black">{label}</span>
    </div>
  );
}

function BarChart() {
  // simple bar visualization using SVG
  const bars = [
    { label: 'Inquiry', value: 4, color: 'fill-orange-400' },
    { label: 'Design', value: 4, color: 'fill-blue-500' },
    { label: 'Machining', value: 4, color: 'fill-yellow-400' },
    { label: 'Inspection', value: 4, color: 'fill-emerald-500' },
    { label: 'Completed', value: 0.5, color: 'fill-gray-200' },
  ];

  const max = Math.max(...bars.map((b) => b.value)) || 1;

  return (
    <div className="h-64">
      <svg viewBox="0 0 500 220" className="w-full h-full">
        {/* axes */}
        <line x1="40" y1="10" x2="40" y2="200" stroke="#e5e7eb" strokeWidth="2" />
        <line x1="40" y1="200" x2="480" y2="200" stroke="#e5e7eb" strokeWidth="2" />
        {bars.map((b, idx) => {
          const bw = 70;
          const gap = 15;
          const x = 50 + idx * (bw + gap);
          const h = (b.value / max) * 160;
          const y = 200 - h;
          return (
            <g key={b.label}>
              <rect x={x} y={y} width={bw} height={h} className={b.color} rx="6" />
              <text x={x + bw / 2} y="215" textAnchor="middle" className="fill-black" fontSize="10">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DonutChart() {
  // simple donut visualization using SVG
  const segments = [
    { label: 'Design', value: 45, color: '#f97316' }, // orange-500
    { label: 'Machining', value: 35, color: '#3b82f6' }, // blue-500
    { label: 'Inspection', value: 20, color: '#facc15' }, // yellow-400
  ];
  const total = segments.reduce((a, b) => a + b.value, 0);
  const radius = 70;
  const cx = 130;
  const cy = 100;
  let startAngle = -90;

  const arcs = segments.map((s) => {
    const angle = (s.value / total) * 360;
    const endAngle = startAngle + angle;
    const largeArc = angle > 180 ? 1 : 0;

    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);

    const d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArc, 0, end.x, end.y,
      'L', cx, cy,
      'Z',
    ].join(' ');

    startAngle = endAngle;
    return { d, color: s.color };
  });

  return (
    <div className="h-64 flex items-center justify-center">
      <svg viewBox="0 0 260 200" className="w-full h-full max-w-md">
        {arcs.map((a, i) => (
          <path key={i} d={a.d} fill={a.color} opacity="0.9" />
        ))}
        <circle cx={cx} cy={cy} r={40} fill="white" />
      </svg>
    </div>
  );
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function OrdersTable({ rows = [], statusFilter = 'All' }) {
  const visible = statusFilter === 'All' ? rows : rows.filter(r => r.status === statusFilter);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-black">
            <th className="py-2 px-3">Order ID</th>
            <th className="py-2 px-3">Customer</th>
            <th className="py-2 px-3">Product(s)</th>
            <th className="py-2 px-3">Date Created</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r, i) => (
            <tr key={r.id} className={i % 2 ? 'bg-gray-50' : ''}>
              <td className="py-2 px-3 font-medium text-indigo-600">
                <Link href={`/AdminUser/orders/${r.id}`} className="underline">{r.id}</Link>
              </td>
              <td className="py-2 px-3 text-black">{r.customer}</td>
              <td className="py-2 px-3 text-black">{r.products}</td>
              <td className="py-2 px-3 text-black">{r.date}</td>
              <td className="py-2 px-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                  {r.status}
                </span>
              </td>
              <td className="py-2 px-3">
                <Link 
                  href={`/AdminUser/orders/${r.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Details→
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}