'use client'

import { useState } from 'react'

export default function EstimatesPage() {
  const [items, setItems] = useState([
    { id: 1, itemDetails: '', quantity: 1, rate: 0, discount: 0, amount: 0 }
  ])
  const [formData, setFormData] = useState({
    estimateDate: '',
    expiryDate: '',
    projectName: '',
    subject: '',
    reverseCharge: false,
    shippingCharges: 0
  })

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1
    setItems([...items, { id: newId, itemDetails: '', quantity: 1, rate: 0, discount: 0, amount: 0 }])
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        // Calculate amount when quantity, rate, or discount changes
        if (field === 'quantity' || field === 'rate' || field === 'discount') {
          const subtotal = updatedItem.quantity * updatedItem.rate
          const discountAmount = subtotal * (updatedItem.discount / 100)
          updatedItem.amount = subtotal - discountAmount
        }
        return updatedItem
      }
      return item
    }))
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const calculateSubtotal = () => {
    const itemsTotal = items.reduce((sum, item) => sum + item.amount, 0)
    const shipping = formData.shippingCharges || 0
    return itemsTotal + shipping
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const cgst = subtotal * 0.09 // 9% CGST
    const sgst = subtotal * 0.09 // 9% SGST
    return subtotal + cgst + sgst
  }

  return (
    <main className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">New Estimate</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Create and send an estimate to your customer.</p>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
              <button className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 text-xs sm:text-sm">
                Cancel
              </button>
              <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm">
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Estimate Date</label>
            <input
              type="date"
              value={formData.estimateDate}
              onChange={(e) => setFormData({...formData, estimateDate: e.target.value})}
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Project Name</label>
            <select
              value={formData.projectName}
              onChange={(e) => setFormData({...formData, projectName: e.target.value})}
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm"
            >
              <option value="">Select Project</option>
              <option value="project1">Project 1</option>
              <option value="project2">Project 2</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Enter subject"
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.reverseCharge}
              onChange={(e) => setFormData({...formData, reverseCharge: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700">This transaction is applicable for reverse charge</span>
          </label>
        </div>

        {/* Items Table */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Item Table</h2>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Item Details</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Quantity</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Rate</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Discount (%)</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="text"
                        value={item.itemDetails}
                        onChange={(e) => updateItem(item.id, 'itemDetails', e.target.value)}
                        placeholder="Type item details..."
                        className="w-full px-2 sm:px-3 py-2 border border-gray-200 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-200 rounded text-black text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-200 rounded text-black text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-200 rounded text-black text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
                        min="0"
                        max="100"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center">
                      <span className="text-black font-medium text-xs sm:text-sm">₹{item.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-300 rounded-lg p-3">
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Item Details</label>
                    <input
                      type="text"
                      value={item.itemDetails}
                      onChange={(e) => updateItem(item.id, 'itemDetails', e.target.value)}
                      placeholder="Type item details..."
                      className="w-full px-2 py-1 border border-gray-200 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-black text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rate</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-black text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Discount %</label>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-black text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-700">Amount: <span className="font-medium">₹{item.amount.toFixed(2)}</span></span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={addItem}
            className="mt-3 sm:mt-4 flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Row
          </button>
        </div>

        {/* Summary */}
        <div className="border-t pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Shipping Charges</label>
              <input
                type="number"
                value={formData.shippingCharges}
                onChange={(e) => setFormData({...formData, shippingCharges: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                min="0"
              />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Sub Total:</span>
                <span className="text-black font-medium">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">CGST (9%):</span>
                <span className="text-black font-medium">₹{(calculateSubtotal() * 0.09).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">SGST (9%):</span>
                <span className="text-black font-medium">₹{(calculateSubtotal() * 0.09).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 sm:pt-3 flex justify-between text-sm sm:text-lg font-semibold">
                <span className="text-black">Total:</span>
                <span className="text-black">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-start gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
          <button className="w-full sm:w-auto px-4 sm:px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
            Cancel
          </button>
          <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs sm:text-sm">
            Save as Draft
          </button>
          <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm">
            Save and Send
          </button>
        </div>
      </div>
    </main>
  );
}
