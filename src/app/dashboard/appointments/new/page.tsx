'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface AppointmentFormData {
  title: string
  description: string
  startTime: string
  endTime: string
  type: string
  notes: string
  patientId: string
  doctorId: string
}

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])

  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: '',
    notes: '',
    patientId: searchParams.get('patientId') || '',
    doctorId: '',
  })

  useEffect(() => {
    // Fetch patients and doctors
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/doctors'),
        ])

        if (patientsRes.ok) {
          const patientsData = await patientsRes.json()
          setPatients(patientsData.patients || [])
        }

        if (doctorsRes.ok) {
          const doctorsData = await doctorsRes.json()
          setDoctors(doctorsData.doctors || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-set end time if start time is changed
    if (name === 'startTime' && value) {
      const startDate = new Date(value)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // Add 1 hour
      setFormData(prev => ({
        ...prev,
        endTime: endDate.toISOString().slice(0, 16)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create appointment')
      }

      const data = await response.json()
      router.push(`/dashboard/appointments`)
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
          <Link href="/dashboard/appointments" className="text-blue-600 hover:text-blue-800 mr-3">
            ← Back to Appointments
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule Appointment</h1>
        <p className="mt-2 text-gray-600">Book a new appointment for a patient</p>
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">Appointment Details</h3>
              <p className="mt-1 text-sm text-gray-500">Basic information about the appointment</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Annual Checkup, Follow-up Visit"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    name="endTime"
                    required
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

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
                  <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                    Doctor *
                  </label>
                  <select
                    id="doctorId"
                    name="doctorId"
                    required
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Appointment Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="CONSULTATION">Consultation</option>
                    <option value="FOLLOW_UP">Follow-up</option>
                    <option value="EMERGENCY">Emergency</option>
                    <option value="SURGERY">Surgery</option>
                    <option value="LAB_TEST">Lab Test</option>
                    <option value="IMAGING">Imaging</option>
                    <option value="VACCINATION">Vaccination</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Any additional notes or special instructions"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/appointments"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
          </button>
        </div>
      </form>
    </div>
  )
}