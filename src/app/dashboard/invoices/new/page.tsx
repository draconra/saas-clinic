'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface InvoiceFormData {
  patientId: string
  amount: string
  description: string
  dueDate: string
}

export default function NewInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<any[]>([])

  const [formData, setFormData] = useState<InvoiceFormData>({
    patientId: searchParams.get('patientId') || '',
    amount: '',
    description: '',
    dueDate: '',
  })

  useEffect(() => {
    // Fetch patients
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients')
        if (response.ok) {
          const data = await response.json()
          setPatients(data.patients || [])
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
      }
    }

    fetchPatients()
  }, [])

  // Set default due date to 30 days from now
  useEffect(() => {
    if (!formData.dueDate) {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 30)
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }))
    }
  }, [formData.dueDate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}${month}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const invoiceData = {
        ...formData,
        invoiceNumber: generateInvoiceNumber(),
        amount: parseFloat(formData.amount),
      }

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create invoice')
      }

      const data = await response.json()
      router.push(`/dashboard/billing`)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/dashboard/billing" className="text-blue-600 hover:text-blue-800 mr-3">
            ← Back to Billing
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
        <p className="mt-2 text-gray-600">Generate a new invoice for a patient</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Invoice Details</h3>
              <p className="mt-1 text-sm text-gray-500">Information about this invoice</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                    Patient *
                  </label>
                  <select
                    id="patientId"
                    name="patientId"
                    required
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - {patient.email || patient.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    required
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe the services or products being billed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Preview</h3>
              <p className="mt-1 text-sm text-gray-500">Invoice will look like this</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">INVOICE</h4>
                    <p className="text-sm text-gray-600">#{generateInvoiceNumber()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Due Date:</p>
                    <p className="font-medium">
                      {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-gray-600">Bill To:</p>
                  <p className="font-medium">
                    {patients.find(p => p.id === formData.patientId)?.firstName}{' '}
                    {patients.find(p => p.id === formData.patientId)?.lastName || 'Patient not selected'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Description</span>
                    <span>Amount</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>{formData.description || 'Services rendered'}</span>
                    <span>${formData.amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg">
                    <span>Total</span>
                    <span>${formData.amount || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/billing"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}