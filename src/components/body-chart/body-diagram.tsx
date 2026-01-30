'use client'

import React, { useState } from 'react'
import { BodyChart, BodyRegion } from '@/types'

interface BodyDiagramProps {
  bodyCharts: BodyChart[]
  onBodyChartAdd?: (bodyChart: Partial<BodyChart>) => void
  onBodyChartRemove?: (id: string) => void
  readOnly?: boolean
}

export default function BodyDiagram({ bodyCharts, onBodyChartAdd, onBodyChartRemove, readOnly = false }: BodyDiagramProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState<boolean>(false)
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const minZoom = 0.5
  const maxZoom = 3

  // Define body regions with highly realistic human anatomy - updated for new SVG dimensions
  const bodyRegions: BodyRegion[] = [
    // Head and facial regions
    { id: 'head', name: 'Head', x: 205, y: 10, width: 90, height: 100 },
    { id: 'forehead', name: 'Forehead', x: 215, y: 10, width: 70, height: 30 },
    { id: 'left_eye', name: 'Left Eye', x: 225, y: 45, width: 20, height: 15 },
    { id: 'right_eye', name: 'Right Eye', x: 255, y: 45, width: 20, height: 15 },
    { id: 'nose', name: 'Nose', x: 240, y: 60, width: 20, height: 15 },
    { id: 'mouth', name: 'Mouth', x: 235, y: 70, width: 30, height: 12 },
    { id: 'chin', name: 'Chin', x: 235, y: 85, width: 30, height: 15 },
    { id: 'left_cheek', name: 'Left Cheek', x: 210, y: 60, width: 25, height: 20 },
    { id: 'right_cheek', name: 'Right Cheek', x: 265, y: 60, width: 25, height: 20 },

    // Neck and thyroid region
    { id: 'neck', name: 'Neck', x: 235, y: 105, width: 30, height: 35 },
    { id: 'throat', name: 'Throat', x: 240, y: 110, width: 20, height: 25 },
    { id: 'thyroid', name: 'Thyroid', x: 242, y: 115, width: 16, height: 12 },

    // Shoulder girdle
    { id: 'left_shoulder', name: 'Left Shoulder', x: 153, y: 135, width: 25, height: 25 },
    { id: 'right_shoulder', name: 'Right Shoulder', x: 322, y: 135, width: 25, height: 25 },
    { id: 'left_clavicle', name: 'Left Clavicle', x: 175, y: 135, width: 40, height: 12 },
    { id: 'right_clavicle', name: 'Right Clavicle', x: 285, y: 135, width: 40, height: 12 },

    // Chest and breast region
    { id: 'chest', name: 'Chest', x: 190, y: 145, width: 120, height: 95 },
    { id: 'sternum', name: 'Sternum', x: 240, y: 145, width: 20, height: 90 },
    { id: 'left_chest', name: 'Left Chest', x: 190, y: 145, width: 50, height: 80 },
    { id: 'right_chest', name: 'Right Chest', x: 260, y: 145, width: 50, height: 80 },
    { id: 'left_breast', name: 'Left Breast', x: 195, y: 160, width: 35, height: 40 },
    { id: 'right_breast', name: 'Right Breast', x: 270, y: 160, width: 35, height: 40 },

    // Internal organs in chest
    { id: 'heart', name: 'Heart', x: 230, y: 160, width: 40, height: 35 },
    { id: 'left_lung', name: 'Left Lung', x: 195, y: 155, width: 40, height: 50 },
    { id: 'right_lung', name: 'Right Lung', x: 265, y: 155, width: 40, height: 50 },

    // Back regions
    { id: 'upper_back', name: 'Upper Back', x: 190, y: 145, width: 120, height: 60 },
    { id: 'mid_back', name: 'Mid Back', x: 190, y: 205, width: 120, height: 50 },
    { id: 'lower_back', name: 'Lower Back', x: 190, y: 255, width: 120, height: 50 },

    // Abdominal regions
    { id: 'abdomen', name: 'Abdomen', x: 195, y: 245, width: 110, height: 95 },
    { id: 'upper_abdomen', name: 'Upper Abdomen', x: 195, y: 245, width: 110, height: 40 },
    { id: 'lower_abdomen', name: 'Lower Abdomen', x: 195, y: 285, width: 110, height: 55 },
    { id: 'epigastrium', name: 'Epigastrium', x: 220, y: 245, width: 60, height: 30 },
    { id: 'umbilicus', name: 'Umbilicus', x: 242, y: 290, width: 16, height: 16 },
    { id: 'suprapubic', name: 'Suprapubic', x: 220, y: 325, width: 60, height: 20 },

    // Abdominal quadrants
    { id: 'right_upper_quadrant', name: 'Right Upper Quadrant', x: 250, y: 245, width: 55, height: 40 },
    { id: 'left_upper_quadrant', name: 'Left Upper Quadrant', x: 195, y: 245, width: 55, height: 40 },
    { id: 'right_lower_quadrant', name: 'Right Lower Quadrant', x: 250, y: 285, width: 55, height: 55 },
    { id: 'left_lower_quadrant', name: 'Left Lower Quadrant', x: 195, y: 285, width: 55, height: 55 },

    // Internal abdominal organs
    { id: 'liver', name: 'Liver', x: 255, y: 255, width: 70, height: 65 },
    { id: 'stomach', name: 'Stomach', x: 195, y: 265, width: 45, height: 35 },
    { id: 'spleen', name: 'Spleen', x: 295, y: 265, width: 25, height: 30 },
    { id: 'pancreas', name: 'Pancreas', x: 225, y: 290, width: 50, height: 20 },
    { id: 'left_kidney', name: 'Left Kidney', x: 195, y: 275, width: 30, height: 25 },
    { id: 'right_kidney', name: 'Right Kidney', x: 285, y: 275, width: 30, height: 25 },
    { id: 'small_intestine', name: 'Small Intestine', x: 200, y: 310, width: 100, height: 40 },
    { id: 'large_intestine', name: 'Large Intestine', x: 210, y: 315, width: 80, height: 35 },

    // Pelvic region
    { id: 'pelvis', name: 'Pelvis', x: 185, y: 345, width: 130, height: 35 },
    { id: 'left_hip', name: 'Left Hip', x: 185, y: 345, width: 60, height: 35 },
    { id: 'right_hip', name: 'Right Hip', x: 255, y: 345, width: 60, height: 35 },
    { id: 'groin', name: 'Groin', x: 200, y: 370, width: 100, height: 15 },
    { id: 'bladder', name: 'Bladder', x: 230, y: 365, width: 40, height: 20 },

    // Arms - Left
    { id: 'left_upper_arm', name: 'Left Upper Arm', x: 150, y: 155, width: 30, height: 85 },
    { id: 'left_elbow', name: 'Left Elbow', x: 155, y: 245, width: 20, height: 20 },
    { id: 'left_forearm', name: 'Left Forearm', x: 150, y: 255, width: 28, height: 75 },
    { id: 'left_wrist', name: 'Left Wrist', x: 152, y: 330, width: 24, height: 12 },
    { id: 'left_hand', name: 'Left Hand', x: 146, y: 340, width: 36, height: 35 },
    { id: 'left_fingers', name: 'Left Fingers', x: 144, y: 370, width: 40, height: 25 },

    // Arms - Right
    { id: 'right_upper_arm', name: 'Right Upper Arm', x: 320, y: 155, width: 30, height: 85 },
    { id: 'right_elbow', name: 'Right Elbow', x: 325, y: 245, width: 20, height: 20 },
    { id: 'right_forearm', name: 'Right Forearm', x: 322, y: 255, width: 28, height: 75 },
    { id: 'right_wrist', name: 'Right Wrist', x: 324, y: 330, width: 24, height: 12 },
    { id: 'right_hand', name: 'Right Hand', x: 318, y: 340, width: 36, height: 35 },
    { id: 'right_fingers', name: 'Right Fingers', x: 316, y: 370, width: 40, height: 25 },

    // Legs - Left
    { id: 'left_thigh', name: 'Left Thigh', x: 195, y: 370, width: 35, height: 110 },
    { id: 'left_knee', name: 'Left Knee', x: 197, y: 480, width: 30, height: 20 },
    { id: 'left_knee_cap', name: 'Left Patella', x: 202, y: 480, width: 20, height: 10 },
    { id: 'left_calf', name: 'Left Calf', x: 197, y: 495, width: 30, height: 80 },
    { id: 'left_ankle', name: 'Left Ankle', x: 199, y: 575, width: 26, height: 15 },
    { id: 'left_foot', name: 'Left Foot', x: 192, y: 585, width: 40, height: 35 },
    { id: 'left_toes', name: 'Left Toes', x: 190, y: 615, width: 44, height: 15 },

    // Legs - Right
    { id: 'right_thigh', name: 'Right Thigh', x: 270, y: 370, width: 35, height: 110 },
    { id: 'right_knee', name: 'Right Knee', x: 272, y: 480, width: 30, height: 20 },
    { id: 'right_knee_cap', name: 'Right Patella', x: 277, y: 480, width: 20, height: 10 },
    { id: 'right_calf', name: 'Right Calf', x: 272, y: 495, width: 30, height: 80 },
    { id: 'right_ankle', name: 'Right Ankle', x: 274, y: 575, width: 26, height: 15 },
    { id: 'right_foot', name: 'Right Foot', x: 267, y: 585, width: 40, height: 35 },
    { id: 'right_toes', name: 'Right Toes', x: 265, y: 615, width: 44, height: 15 },

    // Spine and back
    { id: 'cervical_spine', name: 'Cervical Spine', x: 245, y: 90, width: 10, height: 40 },
    { id: 'thoracic_spine', name: 'Thoracic Spine', x: 245, y: 130, width: 10, height: 90 },
    { id: 'lumbar_spine', name: 'Lumbar Spine', x: 245, y: 220, width: 10, height: 60 },
    { id: 'sacrum', name: 'Sacrum', x: 245, y: 280, width: 10, height: 25 },
    { id: 'coccyx', name: 'Coccyx', x: 245, y: 305, width: 10, height: 10 },

    // External genitalia (medical context)
    { id: 'external_genitalia', name: 'External Genitalia', x: 220, y: 365, width: 60, height: 12 },
  ]

  const getSeverityColor = (severity?: string | null) => {
    switch (severity) {
      case 'SEVERE': return 'rgba(239, 68, 68, 0.6)' // red
      case 'MODERATE': return 'rgba(245, 158, 11, 0.6)' // yellow
      case 'MILD': return 'rgba(59, 130, 246, 0.6)' // blue
      default: return 'rgba(34, 197, 94, 0.6)' // green
    }
  }

  const handleRegionClick = (region: BodyRegion, event: React.MouseEvent<SVGRectElement>) => {
    if (readOnly) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setSelectedRegion(region.id)
    onBodyChartAdd?.({
      bodyRegion: region.name,
      coordinates: JSON.stringify({ x, y, regionId: region.id }),
      bodyPart: region.name,
      side: region.name.toLowerCase().includes('left') ? 'LEFT' :
        region.name.toLowerCase().includes('right') ? 'RIGHT' : 'CENTRAL'
    })
  }

  const handleRegionRemove = (bodyChart: BodyChart) => {
    onBodyChartRemove?.(bodyChart.id)
  }

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, maxZoom))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, minZoom))
  }

  const handleZoomReset = () => {
    setZoomLevel(1)
    setPan({ x: 0, y: 0 })
  }

  // Pan functions
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x
      const deltaY = e.clientY - lastPanPoint.y
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.25 : 0.25
      setZoomLevel(prev => Math.max(minZoom, Math.min(maxZoom, prev + delta)))
    }
  }

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent default for keys we handle
    if (e.ctrlKey || e.altKey || e.metaKey) {
      switch (e.key) {
        case '=':
        case '+':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
        case '_':
          e.preventDefault()
          handleZoomOut()
          break
        case '0':
          e.preventDefault()
          handleZoomReset()
          break
      }
    }
  }

  // Add keyboard event listener
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof Element &&
        (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.tagName === 'SELECT')) {
        return // Don't intercept when user is typing
      }
      handleKeyDown(e as any)
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Body Diagram</h3>
      </div>

      <div className="text-xs text-gray-500 mb-2">
        💡 Tip: Use buttons or Ctrl+scroll to zoom, Shift+drag to pan, and click regions to add findings
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex justify-center">
          <div className="overflow-auto max-h-[700px] border border-gray-200 rounded-lg bg-gradient-to-b from-blue-50 to-white relative">
            {/* Floating Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col space-y-1">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleZoomIn()
                }}
                type="button"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                disabled={zoomLevel >= maxZoom}
                title="Zoom In (Ctrl/Cmd + +)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <div className="text-xs text-center text-gray-500 font-medium py-1">
                {Math.round(zoomLevel * 100)}%
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleZoomOut()
                }}
                type="button"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                disabled={zoomLevel <= minZoom}
                title="Zoom Out (Ctrl/Cmd + -)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleZoomReset()
                }}
                type="button"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Reset Zoom (Ctrl/Cmd + 0)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <svg
              width="500"
              height="700"
              className="min-w-max cursor-move"
              style={{
                transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: 'center'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}>
              {/* Human body outline - highly realistic and anatomical */}
              <g>
                {/* Head and Facial Features */}
                <ellipse cx="250" cy="60" rx="45" ry="50" fill="#fef3c7" stroke="#374151" strokeWidth="2.5" opacity="0.3" />
                <ellipse cx="250" cy="60" rx="45" ry="50" fill="none" stroke="#374151" strokeWidth="2.5" />

                {/* Facial structure */}
                <path d="M 220 60 Q 235 55, 250 55 T 280 60" fill="none" stroke="#6b7280" strokeWidth="1" opacity="0.6" />
                <circle cx="230" cy="55" r="2" fill="#374151" opacity="0.4" /> {/* Left eye */}
                <circle cx="270" cy="55" r="2" fill="#374151" opacity="0.4" /> {/* Right eye */}
                <path d="M 245 65 Q 250 67, 255 65" fill="none" stroke="#374151" strokeWidth="1" opacity="0.4" /> {/* Nose */}
                <path d="M 240 73 Q 250 75, 260 73" fill="none" stroke="#374151" strokeWidth="1" opacity="0.4" /> {/* Mouth */}

                {/* Neck and Thyroid */}
                <rect x="235" y="105" width="30" height="35" fill="#fef3c7" stroke="#374151" strokeWidth="2" rx="8" opacity="0.3" />
                <rect x="235" y="105" width="30" height="35" fill="none" stroke="#374151" strokeWidth="2" rx="8" />
                <ellipse cx="250" cy="120" rx="8" ry="6" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" /> {/* Thyroid */}

                {/* Shoulder Girdle */}
                <path d="M 160 120 Q 160 110, 170 110 L 330 110 Q 340 110, 340 120"
                  fill="#fef3c7" stroke="#374151" strokeWidth="2.5" opacity="0.3" />
                <path d="M 160 120 Q 160 110, 170 110 L 330 110 Q 340 110, 340 120"
                  fill="none" stroke="#374151" strokeWidth="2.5" />

                {/* Clavicles */}
                <path d="M 175 120 Q 200 125, 250 125 T 325 120" fill="none" stroke="#6b7280" strokeWidth="1.5" opacity="0.6" />

                {/* Chest and Rib Cage */}
                <path d="M 190 130 Q 185 125, 190 125 L 310 125 Q 315 125, 310 130 L 310 220 Q 310 225, 305 225 L 195 225 Q 190 225, 190 220 Z"
                  fill="#fef3c7" stroke="#374151" strokeWidth="2.5" rx="15" opacity="0.3" />
                <path d="M 190 130 Q 185 125, 190 125 L 310 125 Q 315 125, 310 130 L 310 220 Q 310 225, 305 225 L 195 225 Q 190 225, 190 220 Z"
                  fill="none" stroke="#374151" strokeWidth="2.5" rx="15" />

                {/* Rib lines */}
                {Array.from({ length: 6 }, (_, i) => (
                  <g key={`rib-${i}`}>
                    <path d={`M 195 ${140 + i * 15} Q 250 ${145 + i * 15}, 305 ${140 + i * 15}`}
                      fill="none" stroke="#9ca3af" strokeWidth="1" opacity="0.4" />
                  </g>
                ))}

                {/* Sternum */}
                <line x1="250" y1="130" x2="250" y2="220" stroke="#374151" strokeWidth="2" opacity="0.6" />

                {/* Arms - Left */}
                <g>
                  {/* Shoulder */}
                  <circle cx="165" cy="135" r="12" fill="#fef3c7" stroke="#374151" strokeWidth="2" opacity="0.3" />
                  <circle cx="165" cy="135" r="12" fill="none" stroke="#374151" strokeWidth="2" />

                  {/* Upper arm */}
                  <rect x="150" y="140" width="30" height="85" fill="#fef3c7" stroke="#374151" strokeWidth="2" rx="15" opacity="0.3" />
                  <rect x="150" y="140" width="30" height="85" fill="none" stroke="#374151" strokeWidth="2" rx="15" />

                  {/* Elbow */}
                  <circle cx="165" cy="235" r="10" fill="none" stroke="#374151" strokeWidth="2" />

                  {/* Forearm */}
                  <rect x="150" y="240" width="28" height="75" fill="#fef3c7" stroke="#374151" strokeWidth="2" rx="14" opacity="0.3" />
                  <rect x="150" y="240" width="28" height="75" fill="none" stroke="#374151" strokeWidth="2" rx="14" />

                  {/* Wrist */}
                  <rect x="152" y="315" width="24" height="12" fill="none" stroke="#374151" strokeWidth="2" rx="6" />

                  {/* Hand */}
                  <ellipse cx="164" cy="340" rx="18" ry="25" fill="#fef3c7" stroke="#374151" strokeWidth="2" opacity="0.3" />
                  <ellipse cx="164" cy="340" rx="18" ry="25" fill="none" stroke="#374151" strokeWidth="2" />
                </g>

                {/* Arms - Right */}
                <g>
                  {/* Shoulder */}
                  <circle cx="335" cy="135" r="12" fill="#fef3c7" stroke="#374151" strokeWidth="2" opacity="0.3" />
                  <circle cx="335" cy="135" r="12" fill="none" stroke="#374151" strokeWidth="2" />

                  {/* Upper arm */}
                  <rect x="320" y="140" width="30" height="85" fill="#fef3c7" stroke="#374151" strokeWidth="2" rx="15" opacity="0.3" />
                  <rect x="320" y="140" width="30" height="85" fill="none" stroke="#374151" strokeWidth="2" rx="15" />

                  {/* Elbow */}
                  <circle cx="335" cy="235" r="10" fill="none" stroke="#374151" strokeWidth="2" />

                  {/* Forearm */}
                  <rect x="322" y="240" width="28" height="75" fill="#fef3c7" stroke="#374151" strokeWidth="2" rx="14" opacity="0.3" />
                  <rect x="322" y="240" width="28" height="75" fill="none" stroke="#374151" strokeWidth="2" rx="14" />

                  {/* Wrist */}
                  <rect x="324" y="315" width="24" height="12" fill="none" stroke="#374151" strokeWidth="2" rx="6" />

                  {/* Hand */}
                  <ellipse cx="336" cy="340" rx="18" ry="25" fill="#fef3c7" stroke="#374151" strokeWidth="2" opacity="0.3" />
                  <ellipse cx="336" cy="340" rx="18" ry="25" fill="none" stroke="#374151" strokeWidth="2" />
                </g>

                {/* Abdominal Cavity */}
                <path d="M 195 230 Q 190 225, 195 225 L 305 225 Q 310 225, 305 230 L 305 320 Q 305 325, 300 325 L 200 325 Q 195 325, 195 320 Z"
                  fill="#fef3c7" stroke="#374151" strokeWidth="2.5" opacity="0.3" />
                <path d="M 195 230 Q 190 225, 195 225 L 305 225 Q 310 225, 305 230 L 305 320 Q 305 325, 300 325 L 200 325 Q 195 325, 195 320 Z"
                  fill="none" stroke="#374151" strokeWidth="2.5" />

                {/* Pelvis */}
                <path d="M 185 330 Q 180 325, 185 325 L 315 325 Q 320 325, 315 330 L 315 360 Q 315 365, 310 365 L 190 365 Q 185 365, 185 360 Z"
                  fill="#fef3c7" stroke="#374151" strokeWidth="2.5" opacity="0.3" />
                <path d="M 185 330 Q 180 325, 185 325 L 315 325 Q 320 325, 315 330 L 315 360 Q 315 365, 310 365 L 190 365 Q 185 365, 185 360 Z"
                  fill="none" stroke="#374151" strokeWidth="2.5" />

                {/* Legs - Left */}
                <g>
                  {/* Upper leg */}
                  <rect x="195" y="370" width="35" height="110" fill="#fef3c7" stroke="#374151" strokeWidth="2.5" rx="17" opacity="0.3" />
                  <rect x="195" y="370" width="35" height="110" fill="none" stroke="#374151" strokeWidth="2.5" rx="17" />

                  {/* Knee */}
                  <circle cx="212" cy="485" r="15" fill="none" stroke="#374151" strokeWidth="2" />
                  <path d="M 200 485 Q 212 480, 225 485" fill="none" stroke="#374151" strokeWidth="1" opacity="0.6" /> {/* Patella */}

                  {/* Lower leg */}
                  <rect x="197" y="495" width="30" height="80" fill="#fef3c7" stroke="#374151" strokeWidth="2.5" rx="15" opacity="0.3" />
                  <rect x="197" y="495" width="30" height="80" fill="none" stroke="#374151" strokeWidth="2.5" rx="15" />

                  {/* Ankle */}
                  <rect x="199" y="575" width="26" height="15" fill="none" stroke="#374151" strokeWidth="2" rx="7" />

                  {/* Foot */}
                  <ellipse cx="212" cy="600" rx="20" ry="28" fill="#fef3c7" stroke="#374151" strokeWidth="2" opacity="0.3" />
                  <ellipse cx="212" cy="600" rx="20" ry="28" fill="none" stroke="#374151" strokeWidth="2" />
                </g>

                {/* Legs - Right */}
                <g>
                  {/* Upper leg */}
                  <rect x="270" y="370" width="35" height="110" fill="#fef3c7" stroke="#374151" strokeWidth="2.5" rx="17" opacity="0.3" />
                  <rect x="270" y="370" width="35" height="110" fill="none" stroke="#374151" strokeWidth="2.5" rx="17" />

                  {/* Knee */}
                  <circle cx="287" cy="485" r="15" fill="none" stroke="#374151" strokeWidth="2" />
                  <path d="M 275 485 Q 287 480, 300 485" fill="none" stroke="#374151" strokeWidth="1" opacity="0.6" /> {/* Patella */}

                  {/* Lower leg */}
                  <rect x="272" y="495" width="30" height="80" fill="#fef3c7" stroke="#374151" strokeWidth="2.5" rx="15" opacity="0.3" />
                  <rect x="272" y="495" width="30" height="80" fill="none" stroke="#374151" strokeWidth="2.5" rx="15" />

                  {/* Ankle */}
                  <rect x="274" y="575" width="26" height="15" fill="none" stroke="#374151" strokeWidth="2" rx="7" />

                  {/* Foot */}
                  <ellipse cx="287" cy="600" rx="20" ry="28" fill="#fef3c7" stroke="#374151" strokeWidth="2" opacity="0.3" />
                  <ellipse cx="287" cy="600" rx="20" ry="28" fill="none" stroke="#374151" strokeWidth="2" />
                </g>

                {/* Internal Organs - Detailed Anatomy */}
                <g opacity="0.8">
                  {/* Heart */}
                  <g>
                    <path d="M 250 160 Q 235 145, 220 160 Q 235 175, 250 160 Q 265 175, 280 160 Q 265 145, 250 160 Z"
                      fill="#fca5a5" stroke="#dc2626" strokeWidth="1.5" opacity="0.7" />
                    <path d="M 250 160 Q 240 150, 230 160 Q 240 170, 250 160 Q 260 170, 270 160 Q 260 150, 250 160 Z"
                      fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2" />

                    {/* Heart chambers */}
                    <ellipse cx="245" cy="155" rx="8" ry="10" fill="none" stroke="#991b1b" strokeWidth="0.8" opacity="0.6" />
                    <ellipse cx="255" cy="165" rx="8" ry="10" fill="none" stroke="#991b1b" strokeWidth="0.8" opacity="0.6" />
                  </g>

                  {/* Lungs */}
                  <g>
                    {/* Left lung */}
                    <ellipse cx="215" cy="165" rx="20" ry="45" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                    <path d="M 205 145 Q 215 140, 225 145 M 205 185 Q 215 190, 225 185"
                      fill="none" stroke="#d97706" strokeWidth="1" opacity="0.5" />

                    {/* Right lung */}
                    <ellipse cx="285" cy="165" rx="20" ry="45" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                    <path d="M 275 145 Q 285 140, 295 145 M 275 185 Q 285 190, 295 185"
                      fill="none" stroke="#d97706" strokeWidth="1" opacity="0.5" />
                  </g>

                  {/* Liver */}
                  <path d="M 255 240 Q 320 235, 325 280 Q 320 310, 280 305 Q 260 300, 255 270 Z"
                    fill="#86efac" stroke="#16a34a" strokeWidth="1.5" opacity="0.7" />

                  {/* Stomach */}
                  <path d="M 220 250 Q 200 245, 195 270 Q 200 290, 230 285 Q 240 275, 235 255 Z"
                    fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.5" opacity="0.7" />

                  {/* Kidneys */}
                  <g>
                    {/* Left kidney */}
                    <ellipse cx="210" cy="270" rx="15" ry="22" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5" opacity="0.7" />
                    <path d="M 205 270 Q 210 265, 215 270" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.6" />

                    {/* Right kidney */}
                    <ellipse cx="290" cy="270" rx="15" ry="22" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5" opacity="0.7" />
                    <path d="M 285 270 Q 290 265, 295 270" fill="none" stroke="#1e40af" strokeWidth="1" opacity="0.6" />
                  </g>

                  {/* Intestines */}
                  <g>
                    {/* Small intestine */}
                    <path d="M 195 295 Q 185 305, 195 315 Q 205 325, 195 335 Q 185 345, 195 355"
                      fill="none" stroke="#fb923c" strokeWidth="2" opacity="0.6" strokeDasharray="4,2" />
                    <path d="M 305 295 Q 315 305, 305 315 Q 295 325, 305 335 Q 315 345, 305 355"
                      fill="none" stroke="#fb923c" strokeWidth="2" opacity="0.6" strokeDasharray="4,2" />

                    {/* Large intestine */}
                    <ellipse cx="250" cy="320" rx="40" ry="20" fill="none" stroke="#ea580c" strokeWidth="1.5" opacity="0.6" strokeDasharray="6,3" />
                  </g>

                  {/* Bladder */}
                  <ellipse cx="250" cy="360" rx="20" ry="15" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" opacity="0.6" />

                  {/* Spleen */}
                  <ellipse cx="305" cy="260" rx="12" ry="18" fill="#fca5a5" stroke="#dc2626" strokeWidth="1.5" opacity="0.6" />

                  {/* Pancreas */}
                  <path d="M 230 280 Q 250 275, 270 280 Q 265 290, 250 288 Q 235 290, 230 280 Z"
                    fill="#fdba74" stroke="#c2410c" strokeWidth="1.5" opacity="0.6" />
                </g>
              </g>

              {/* Body regions */}
              {bodyRegions.map((region) => {
                const bodyChartsInRegion = bodyCharts.filter(
                  bc => bc.bodyRegion === region.name || bc.coordinates?.includes(region.id)
                )
                const isHovered = hoveredRegion === region.id
                const isSelected = selectedRegion === region.id

                return (
                  <g key={region.id}>
                    <rect
                      x={region.x}
                      y={region.y}
                      width={region.width}
                      height={region.height}
                      fill={bodyChartsInRegion.length > 0 ? getSeverityColor(bodyChartsInRegion[0]?.severity) : 'transparent'}
                      stroke={isHovered || isSelected ? '#3b82f6' : 'transparent'}
                      strokeWidth="2"
                      rx="4"
                      cursor={readOnly ? "default" : "pointer"}
                      opacity={isHovered ? 0.8 : 0.6}
                      onMouseEnter={() => setHoveredRegion(region.id)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={(e) => handleRegionClick(region, e)}
                    />

                    {/* Tooltip */}
                    {isHovered && (
                      <g>
                        <rect
                          x={region.x + region.width / 2 - 40}
                          y={region.y - 25}
                          width="80"
                          height="20"
                          fill="white"
                          stroke="#374151"
                          strokeWidth="1"
                          rx="4"
                          opacity="0.95"
                        />
                        <text
                          x={region.x + region.width / 2}
                          y={region.y - 10}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-900"
                        >
                          {region.name}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        <div className="w-full space-y-4">
          <h4 className="font-medium mb-3">Findings ({bodyCharts.length})</h4>

          {bodyCharts.length === 0 ? (
            <p className="text-sm text-gray-500">Click on body regions to add findings</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 lg:max-h-96 overflow-y-auto pr-2">
              {bodyCharts.map((bodyChart) => (
                <div
                  key={bodyChart.id}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-medium text-sm text-gray-900">{bodyChart.bodyRegion}</div>
                    {!readOnly && (
                      <button
                        onClick={() => handleRegionRemove(bodyChart)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Severity indicator */}
                  <div className="mb-3">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getSeverityColor(bodyChart.severity) }}
                      />
                      <span className="text-xs text-gray-600">Severity: {bodyChart.severity || 'MILD'}</span>
                    </div>
                  </div>

                  {!readOnly && (
                    <div className="space-y-2">
                      {/* Findings Input */}
                      <div>
                        <label className="text-xs font-medium text-gray-700">Findings</label>
                        <input
                          type="text"
                          placeholder="Enter findings..."
                          value={bodyChart.findings || ''}
                          onChange={(e) => {
                            // Create a custom event to update the body chart
                            const updateEvent = new CustomEvent('updateBodyChart', {
                              detail: { id: bodyChart.id, findings: e.target.value }
                            });
                            document.dispatchEvent(updateEvent);
                          }}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Severity Select */}
                      <div>
                        <label className="text-xs font-medium text-gray-700">Severity</label>
                        <select
                          value={bodyChart.severity || 'MILD'}
                          onChange={(e) => {
                            const updateEvent = new CustomEvent('updateBodyChart', {
                              detail: { id: bodyChart.id, severity: e.target.value }
                            });
                            document.dispatchEvent(updateEvent);
                          }}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="MILD">Mild</option>
                          <option value="MODERATE">Moderate</option>
                          <option value="SEVERE">Severe</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs font-medium text-gray-700">Description</label>
                        <textarea
                          placeholder="Detailed description..."
                          value={bodyChart.description || ''}
                          onChange={(e) => {
                            const updateEvent = new CustomEvent('updateBodyChart', {
                              detail: { id: bodyChart.id, description: e.target.value }
                            });
                            document.dispatchEvent(updateEvent);
                          }}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  {/* Read-only display */}
                  {readOnly && (
                    <div className="space-y-1">
                      {bodyChart.findings && (
                        <div>
                          <span className="text-xs font-medium text-gray-700">Findings:</span>
                          <p className="text-xs text-gray-900">{bodyChart.findings}</p>
                        </div>
                      )}
                      {bodyChart.description && (
                        <div>
                          <span className="text-xs font-medium text-gray-700">Description:</span>
                          <p className="text-xs text-gray-900">{bodyChart.description}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 pt-4 border-t">
            <h5 className="text-sm font-medium mb-2">Severity</h5>
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.6)' }}></div>
                <span className="ml-2 text-xs">Normal/Mild</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
                <span className="ml-2 text-xs">Mild</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.6)' }}></div>
                <span className="ml-2 text-xs">Moderate</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }}></div>
                <span className="ml-2 text-xs">Severe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}