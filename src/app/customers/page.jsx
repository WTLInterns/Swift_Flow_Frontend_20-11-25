'use client'

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

export default function CustomersPage() {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [customers, setCustomers] = useState([
    { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', address: '123 Main St, New York, NY', status: 'Active', date: 'Oct 20, 2025' },
    { id: 'CUST-002', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 234-5678', address: '456 Oak Ave, Los Angeles, CA', status: 'Active', date: 'Oct 18, 2025' },
    { id: 'CUST-003', name: 'Acme Corp', email: 'contact@acme.com', phone: '+1 (555) 345-6789', address: '789 Business Blvd, Chicago, IL', status: 'Inactive', date: 'Oct 15, 2025' },
  ]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  });

  useEffect(() => {
    const close = () => setMenuOpen(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const saveCustomer = () => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', options);

    if (editingId) {
      setCustomers(prev => prev.map(c => 
        c.id === editingId ? { ...form, id: editingId, date: c.date } : c
      ));
    } else {
      const newCustomer = {
        id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
        ...form,
        date: dateStr,
      };
      setCustomers(prev => [newCustomer, ...prev]);
    }

    setShowModal(false);
    setEditingId(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'Active'
    });
  };
  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status
    });
    setEditingId(customer.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-black">Customer Management</h1>
            <p className="text-sm text-black/70">View, manage, and add new customers.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            <span>＋</span> Add Customer
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-black bg-gray-50">
                  <th className="py-3 px-4 font-medium">Customer ID</th>
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Phone</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Date Added</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, i) => (
                  <tr key={customer.id} className={i % 2 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 text-indigo-600">{customer.id}</td>
                    <td className="py-3 px-4 text-black">{customer.name}</td>
                    <td className="py-3 px-4 text-black">{customer.email}</td>
                    <td className="py-3 px-4 text-black">{customer.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${customer.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-black">{customer.date}</td>
                    <td className="py-3 px-4 text-black relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="px-2 py-1 rounded hover:bg-gray-100"
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(prev => prev === customer.id ? null : customer.id); }}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen === customer.id}
                      >
                        ⋯
                      </button>
                      {menuOpen === customer.id && (
                        <div className="absolute right-2 mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-md z-10" role="menu">
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={() => { handleEdit(customer); setMenuOpen(null); }}
                          >Edit</button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                            onClick={() => { handleDelete(customer.id); setMenuOpen(null); }}
                          >Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => { setShowModal(false); setEditingId(null); setForm({ name: '', email: '', phone: '', address: '', status: 'Active' }); }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-black">{editingId ? 'Edit Customer' : 'Add New Customer'}</h3>
                    <p className="text-sm text-black/70">Enter the customer details below.</p>
                  </div>
                  <button 
                    onClick={() => { setShowModal(false); setEditingId(null); setForm({ name: '', email: '', phone: '', address: '', status: 'Active' }); }} 
                    className="text-black hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Email <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Phone Number</label>
                      <input 
                        type="tel" 
                        value={form.phone}
                        onChange={(e) => setForm({...form, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-black">Status</label>
                      <select 
                        value={form.status}
                        onChange={(e) => setForm({...form, status: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black bg-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">Address</label>
                    <textarea 
                      value={form.address}
                      onChange={(e) => setForm({...form, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                      rows="3"
                      placeholder="123 Main St, City, State, ZIP"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                  <button 
                    onClick={() => { setShowModal(false); setEditingId(null); setForm({ name: '', email: '', phone: '', address: '', status: 'Active' }); }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveCustomer}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={!form.name || !form.email}
                  >
                    {editingId ? 'Update Customer' : 'Save Customer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
