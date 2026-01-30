'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { User, Calendar, Heart, Stethoscope, Activity, AlertCircle } from 'lucide-react'
import BodyDiagram from '@/components/body-chart/body-diagram'
import { BodyChart, ExaminationFormData } from '@/types'

export default function NewMedicalRecordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<any[]>([])

  const [bodyCharts, setBodyCharts] = useState<BodyChart[]>([])

  const [formData, setFormData] = useState<ExaminationFormData>({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    familyHistory: '',
    socialHistory: '',
    reviewOfSystems: '',
    vitalSigns: '',
    physicalExam: '',
    diagnosis: '',
    assessment: '',
    plan: '',
    treatment: '',
    prescription: '',
    followUpDate: '',
    notes: '',
    bodyCharts: []
  })

  useEffect(() => {
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

  useEffect(() => {
    // Set patient ID from URL params if provided
    const patientId = searchParams.get('patientId')
    if (patientId) {
      setFormData(prev => ({
        ...prev,
        // We'll need to update this when we have the patient data
      }))
    }
  }, [searchParams])

  useEffect(() => {
    // Handle body chart updates from the inline inputs
    const handleUpdateBodyChart = (event: any) => {
      const { id, ...updates } = event.detail
      updateBodyChart(id, updates)
    }

    document.addEventListener('updateBodyChart', handleUpdateBodyChart)
    return () => {
      document.removeEventListener('updateBodyChart', handleUpdateBodyChart)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBodyChartAdd = (bodyChartData: Partial<BodyChart>) => {
    const newBodyChart: BodyChart = {
      id: Date.now().toString(),
      medicalRecordId: '', // Will be set when saving
      bodyRegion: bodyChartData.bodyRegion || '',
      findings: '',
      severity: 'MILD',
      description: bodyChartData.description,
      coordinates: bodyChartData.coordinates,
      bodyPart: bodyChartData.bodyPart,
      side: bodyChartData.side,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setBodyCharts(prev => [...prev, newBodyChart])
  }

  const handleBodyChartRemove = (id: string) => {
    setBodyCharts(prev => prev.filter(bc => bc.id !== id))
  }

  const updateBodyChart = (id: string, updates: Partial<BodyChart>) => {
    setBodyCharts(prev => prev.map(bc =>
      bc.id === id ? { ...bc, ...updates } : bc
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const submissionData = {
        ...formData,
        bodyCharts,
        patientId: searchParams.get('patientId') || formData.patientId
      }

      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create medical record')
      }

      router.push('/dashboard/medical-records')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container-elegant py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/dashboard/medical-records" className="btn btn-ghost">
            ← Back to Medical Records
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div>
            <h1 className="heading-1">New Medical Examination</h1>
            <p className="text-lead">Record comprehensive patient examination findings with interactive body charts</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <div className="status-dot status-online" />
            <span>Auto-saved draft</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Selection */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="card-title">Patient Information</h3>
                <p className="card-description">Select the patient for this examination</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="form-label">
              Patient <span className="text-red-500">*</span>
            </div>
            <select
              id="patientId"
              name="patientId"
              required
              value={searchParams.get('patientId') || ''}
              onChange={handleInputChange}
              className="select"
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} - {patient.email || patient.phone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chief Complaint and History */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="card-title">Chief Complaint & History</h3>
                <p className="card-description">Patient's primary concerns and medical background</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="chiefComplaint" className="form-label">
                Chief Complaint <span className="text-red-500">*</span>
              </label>
              <textarea
                id="chiefComplaint"
                name="chiefComplaint"
                rows={2}
                required
                value={formData.chiefComplaint}
                onChange={handleInputChange}
                className="textarea"
                placeholder="Primary reason for visit..."
              />
            </div>

            <div>
              <label htmlFor="historyOfPresentIllness" className="form-label">
                History of Present Illness
              </label>
              <textarea
                id="historyOfPresentIllness"
                name="historyOfPresentIllness"
                rows={3}
                value={formData.historyOfPresentIllness}
                onChange={handleInputChange}
                className="textarea"
                placeholder="Detailed history of current complaint..."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="pastMedicalHistory" className="form-label">
                  Past Medical History
                </label>
                <textarea
                  id="pastMedicalHistory"
                  name="pastMedicalHistory"
                  rows={3}
                  value={formData.pastMedicalHistory}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Previous medical conditions..."
                />
              </div>

              <div>
                <label htmlFor="familyHistory" className="form-label">
                  Family History
                </label>
                <textarea
                  id="familyHistory"
                  name="familyHistory"
                  rows={3}
                  value={formData.familyHistory}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Family medical history..."
                />
              </div>

              <div>
                <label htmlFor="socialHistory" className="form-label">
                  Social History
                </label>
                <textarea
                  id="socialHistory"
                  name="socialHistory"
                  rows={3}
                  value={formData.socialHistory}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Lifestyle, habits, social factors..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="reviewOfSystems" className="form-label">
                Review of Systems
              </label>
              <textarea
                id="reviewOfSystems"
                name="reviewOfSystems"
                rows={4}
                value={formData.reviewOfSystems}
                onChange={handleInputChange}
                className="textarea"
                placeholder="Systematic review of body systems..."
              />
            </div>
          </div>
        </div>
        </div>

        {/* Physical Examination */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="card-title">Physical Examination</h3>
                <p className="card-description">Clinical findings and interactive body chart analysis</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="vitalSigns" className="form-label">
                    Vital Signs
                  </label>
                  <textarea
                    id="vitalSigns"
                    name="vitalSigns"
                    rows={4}
                    value={formData.vitalSigns}
                    onChange={handleInputChange}
                    className="textarea"
                    placeholder="BP, HR, RR, Temperature, Weight, Height, etc."
                  />
                </div>

                <div>
                  <label htmlFor="physicalExam" className="form-label">
                    Physical Examination Findings
                  </label>
                  <textarea
                    id="physicalExam"
                    name="physicalExam"
                    rows={4}
                    value={formData.physicalExam}
                    onChange={handleInputChange}
                    className="textarea"
                    placeholder="General appearance, HEENT, cardiovascular, respiratory, etc."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="form-label mb-0">
                    Interactive Body Chart
                  </label>
                  {bodyCharts.length > 0 && (
                    <span className="badge badge-medical text-xs">
                      {bodyCharts.length} {bodyCharts.length === 1 ? 'finding' : 'findings'}
                    </span>
                  )}
                </div>

                <div className="card border-2 border-dashed border-slate-300 bg-slate-50/50">
                  <div className="card-content p-4">
                    <BodyDiagram
                      bodyCharts={bodyCharts}
                      onBodyChartAdd={handleBodyChartAdd}
                      onBodyChartRemove={handleBodyChartRemove}
                    />
                  </div>
                </div>

                {/* Body Charts List */}
                {bodyCharts.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-cyan-600" />
                      Clinical Findings Details
                    </h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {bodyCharts.map((bodyChart, index) => (
                        <div key={bodyChart.id} className="card bg-gradient-to-r from-cyan-50 to-blue-50/30 border-cyan-200/60">
                          <div className="card-content p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                              <input
                                type="text"
                                placeholder="Findings"
                                value={bodyChart.findings || ''}
                                onChange={(e) => updateBodyChart(bodyChart.id, { findings: e.target.value })}
                                className="input text-sm"
                              />
                              <select
                                value={bodyChart.severity || 'MILD'}
                                onChange={(e) => updateBodyChart(bodyChart.id, { severity: e.target.value as any })}
                                className="select text-sm"
                              >
                                <option value="MILD">Mild</option>
                                <option value="MODERATE">Moderate</option>
                                <option value="SEVERE">Severe</option>
                              </select>
                            </div>
                            <textarea
                              placeholder="Detailed description..."
                              value={bodyChart.description || ''}
                              onChange={(e) => updateBodyChart(bodyChart.id, { description: e.target.value })}
                              className="textarea text-sm w-full resize-none"
                              rows={2}
                            />
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-cyan-200/40">
                              <span className="text-xs text-slate-500">
                                Region: {bodyChart.bodyRegion || 'Not specified'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleBodyChartRemove(bodyChart.id)}
                                className="btn btn-ghost text-xs text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Assessment and Plan */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="card-title">Assessment & Plan</h3>
                <p className="card-description">Clinical diagnosis, treatment planning, and follow-up care</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="diagnosis" className="form-label">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  rows={3}
                  required
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Primary and secondary diagnoses..."
                />
              </div>

              <div>
                <label htmlFor="assessment" className="form-label">
                  Clinical Assessment
                </label>
                <textarea
                  id="assessment"
                  name="assessment"
                  rows={3}
                  value={formData.assessment}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Clinical assessment and reasoning..."
                />
              </div>

              <div>
                <label htmlFor="plan" className="form-label">
                  Treatment Plan
                </label>
                <textarea
                  id="plan"
                  name="plan"
                  rows={3}
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Treatment approach and follow-up plan..."
                />
              </div>

              <div>
                <label htmlFor="prescription" className="form-label">
                  Prescription
                </label>
                <textarea
                  id="prescription"
                  name="prescription"
                  rows={3}
                  value={formData.prescription}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Medications and dosages..."
                />
              </div>

              <div>
                <label htmlFor="followUpDate" className="form-label">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  id="followUpDate"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="notes" className="form-label">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="textarea"
                  placeholder="Any additional notes or observations..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <Link
            href="/dashboard/medical-records"
            className="btn btn-outline"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-medical"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner h-4 w-4 mr-2" />
                Saving Medical Record...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Save Medical Record
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}