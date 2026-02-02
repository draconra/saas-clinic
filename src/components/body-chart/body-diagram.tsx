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
              {/* Human body outline - highly realistic and anatomical with natural skin tone */}
              <g>
                {/* Define gradient for realistic skin tone */}
                <defs>
                  <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ffd4a3', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#ffcb9a', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#f0b989', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="muscleTone" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ffc999', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#e0a777', stopOpacity: 0.3 }} />
                  </linearGradient>
                  <radialGradient id="jointGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{ stopColor: '#f0b989', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#d9a374', stopOpacity: 1 }} />
                  </radialGradient>
                </defs>

                {/* Head - More realistic oval shape with proper proportions */}
                <ellipse cx="250" cy="55" rx="42" ry="48" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                {/* Hair */}
                <path d="M 208 30 Q 208 15, 220 10 Q 235 5, 250 5 Q 265 5, 280 10 Q 292 15, 292 30 L 290 45 Q 285 25, 275 20 Q 265 15, 250 15 Q 235 15, 225 20 Q 215 25, 210 45 Z"
                  fill="#4a3428" stroke="#3a2418" strokeWidth="1" opacity="0.9" />

                {/* More detailed facial features */}
                <g>
                  {/* Eyebrows */}
                  <path d="M 225 45 Q 230 43, 235 45" fill="none" stroke="#3a2418" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 265 45 Q 270 43, 275 45" fill="none" stroke="#3a2418" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Eyes - more realistic */}
                  <ellipse cx="232" cy="52" rx="6" ry="4" fill="white" stroke="#3a2418" strokeWidth="0.8" />
                  <circle cx="232" cy="52" r="2.5" fill="#4a3428" />
                  <circle cx="233" cy="51" r="0.8" fill="white" opacity="0.8" />

                  <ellipse cx="268" cy="52" rx="6" ry="4" fill="white" stroke="#3a2418" strokeWidth="0.8" />
                  <circle cx="268" cy="52" r="2.5" fill="#4a3428" />
                  <circle cx="269" cy="51" r="0.8" fill="white" opacity="0.8" />

                  {/* Nose - more defined */}
                  <path d="M 250 52 L 250 68" fill="none" stroke="#b8856a" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M 245 67 Q 250 70, 255 67" fill="none" stroke="#b8856a" strokeWidth="1.2" />
                  <ellipse cx="247" cy="68" rx="2" ry="2.5" fill="none" stroke="#b8856a" strokeWidth="0.8" />
                  <ellipse cx="253" cy="68" rx="2" ry="2.5" fill="none" stroke="#b8856a" strokeWidth="0.8" />

                  {/* Lips - more realistic */}
                  <path d="M 240 78 Q 250 80, 260 78" fill="none" stroke="#c9736c" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 240 78 Q 250 76, 260 78" fill="none" stroke="#a85850" strokeWidth="1.2" strokeLinecap="round" />

                  {/* Ears */}
                  <path d="M 208 50 Q 205 55, 208 65 Q 210 60, 208 50 Z" fill="url(#skinTone)" stroke="#b8856a" strokeWidth="1" />
                  <path d="M 292 50 Q 295 55, 292 65 Q 290 60, 292 50 Z" fill="url(#skinTone)" stroke="#b8856a" strokeWidth="1" />
                </g>

                {/* Neck - more natural transition */}
                <path d="M 235 98 Q 235 100, 237 103 L 237 125 L 263 125 L 263 103 Q 265 100, 265 98"
                  fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.2" />
                <line x1="250" y1="98" x2="250" y2="125" stroke="#b8856a" strokeWidth="0.5" opacity="0.4" />

                {/* Shoulders and clavicles - more anatomical */}
                <g>
                  {/* Left clavicle */}
                  <path d="M 190 135 Q 210 130, 237 132" fill="none" stroke="#b8856a" strokeWidth="1.5" opacity="0.6" />
                  {/* Right clavicle */}
                  <path d="M 263 132 Q 290 130, 310 135" fill="none" stroke="#b8856a" strokeWidth="1.5" opacity="0.6" />

                  {/* Shoulder muscles */}
                  <ellipse cx="172" cy="140" rx="18" ry="15" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <ellipse cx="328" cy="140" rx="18" ry="15" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 170 135 Q 175 140, 170 145" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.5" />
                  <path d="M 330 135 Q 325 140, 330 145" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.5" />
                </g>

                {/* Torso - realistic proportions with muscle definition */}
                <g>
                  {/* Main torso shape */}
                  <path d="M 190 135 Q 188 140, 190 145 L 192 225 Q 193 230, 200 235 L 200 320 Q 200 325, 205 330 L 220 365 L 280 365 Q 295 360, 300 355 L 300 320 L 308 235 Q 310 230, 308 225 L 310 145 Q 312 140, 310 135 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />

                  {/* Pectoral muscles */}
                  <path d="M 210 145 Q 225 155, 240 150 Q 245 148, 250 148" fill="none" stroke="#b8856a" strokeWidth="1.2" opacity="0.4" />
                  <path d="M 290 145 Q 275 155, 260 150 Q 255 148, 250 148" fill="none" stroke="#b8856a" strokeWidth="1.2" opacity="0.4" />

                  {/* Abdominal muscles - six pack */}
                  <g opacity="0.25">
                    <rect x="235" y="240" width="15" height="20" rx="3" fill="none" stroke="#b8856a" strokeWidth="1" />
                    <rect x="250" y="240" width="15" height="20" rx="3" fill="none" stroke="#b8856a" strokeWidth="1" />
                    <rect x="235" y="265" width="15" height="20" rx="3" fill="none" stroke="#b8856a" strokeWidth="1" />
                    <rect x="250" y="265" width="15" height="20" rx="3" fill="none" stroke="#b8856a" strokeWidth="1" />
                    <rect x="235" y="290" width="15" height="20" rx="3" fill="none" stroke="#b8856a" strokeWidth="1" />
                    <rect x="250" y="290" width="15" height="20" rx="3" fill="none" stroke="#b8856a" strokeWidth="1" />
                  </g>

                  {/* Centerline */}
                  <line x1="250" y1="135" x2="250" y2="320" stroke="#b8856a" strokeWidth="1" opacity="0.3" />

                  {/* Ribs subtle indication */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <path key={`rib-${i}`}
                      d={`M 210 ${150 + i * 15} Q 250 ${155 + i * 15}, 290 ${150 + i * 15}`}
                      fill="none" stroke="#c9a582" strokeWidth="0.5" opacity="0.25" />
                  ))}

                  {/* Navel */}
                  <circle cx="250" cy="295" r="3.5" fill="none" stroke="#b8856a" strokeWidth="1.2" />
                  <circle cx="250" cy="295" r="1.5" fill="#a87d60" opacity="0.5" />
                </g>

                {/* Arms - Left (more realistic proportions) */}
                <g>
                  {/* Upper arm with bicep */}
                  <path d="M 172 155 Q 168 158, 167 165 L 165 228 Q 165 235, 168 238"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 154 155 Q 150 158, 149 165 L 147 228 Q 147 235, 150 238"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 154 155 L 172 155 L 168 238 L 150 238 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                  {/* Bicep definition */}
                  <ellipse cx="161" cy="190" rx="8" ry="15" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.3" />

                  {/* Elbow joint */}
                  <circle cx="161" cy="238" r="8" fill="url(#jointGradient)" stroke="#8b5a3c" strokeWidth="1.2" />

                  {/* Forearm */}
                  <path d="M 168 245 Q 166 248, 165 255 L 158 323 Q 157 328, 160 330"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 150 245 Q 148 248, 147 255 L 154 323 Q 153 328, 150 330"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 150 245 L 168 245 L 160 330 L 150 330 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                  {/* Wrist */}
                  <ellipse cx="155" cy="335" rx="10" ry="6" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.2" />

                  {/* Hand - more detailed */}
                  <path d="M 150 340 Q 145 345, 145 355 L 150 370 Q 152 375, 157 375 L 167 370 Q 170 365, 168 360 L 165 345 Q 163 340, 160 340 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.2" />

                  {/* Fingers */}
                  <g>
                    <rect x="145" y="372" width="4" height="12" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <rect x="151" y="370" width="4" height="15" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <rect x="157" y="369" width="4" height="14" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <rect x="163" y="371" width="4" height="12" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <rect x="169" y="373" width="3.5" height="9" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                  </g>
                </g>

                {/* Arms - Right (more realistic proportions) */}
                <g>
                  {/* Upper arm with bicep */}
                  <path d="M 328 155 Q 332 158, 333 165 L 335 228 Q 335 235, 332 238"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 346 155 Q 350 158, 351 165 L 353 228 Q 353 235, 350 238"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 328 155 L 346 155 L 350 238 L 332 238 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                  {/* Bicep definition */}
                  <ellipse cx="339" cy="190" rx="8" ry="15" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.3" />

                  {/* Elbow joint */}
                  <circle cx="339" cy="238" r="8" fill="url(#jointGradient)" stroke="#8b5a3c" strokeWidth="1.2" />

                  {/* Forearm */}
                  <path d="M 332 245 Q 334 248, 335 255 L 342 323 Q 343 328, 340 330"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 350 245 Q 352 248, 353 255 L 346 323 Q 347 328, 350 330"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <path d="M 332 245 L 350 245 L 350 330 L 340 330 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                  {/* Wrist */}
                  <ellipse cx="345" cy="335" rx="10" ry="6" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.2" />

                  {/* Hand - more detailed */}
                  <path d="M 350 340 Q 355 345, 355 355 L 350 370 Q 348 375, 343 375 L 333 370 Q 330 365, 332 360 L 335 345 Q 337 340, 340 340 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.2" />

                  {/* Fingers */}
                  <g>
                    <rect x="351" y="372" width="4" height="12" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <rect x="345" y="370" width="4" height="15" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <rect x="339" y="369" width="4" height="14" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <rect x="333" y="371" width="4" height="12" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <rect x="327.5" y="373" width="3.5" height="9" rx="2" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                  </g>
                </g>

                {/* Pelvis and hips - more anatomical */}
                <path d="M 220 365 Q 215 368, 215 375 L 215 385 Q 215 388, 218 390 L 230 390 L 270 390 L 282 390 Q 285 388, 285 385 L 285 375 Q 285 368, 280 365 Z"
                  fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />

                {/* Legs - Left (more realistic with muscle definition) */}
                <g>
                  {/* Thigh */}
                  <path d="M 218 390 Q 215 395, 215 405 L 210 475 Q 210 480, 213 483"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />
                  <path d="M 230 390 Q 233 395, 233 405 L 228 475 Q 228 480, 225 483"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />
                  <path d="M 218 390 L 230 390 L 225 483 L 213 483 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />

                  {/* Quadriceps definition */}
                  <path d="M 220 420 Q 225 425, 220 430" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.3" />
                  <ellipse cx="219" cy="440" rx="6" ry="20" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.25" />

                  {/* Knee */}
                  <circle cx="219" cy="488" r="10" fill="url(#jointGradient)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <ellipse cx="219" cy="485" rx="8" ry="5" fill="none" stroke="#b8856a" strokeWidth="1" opacity="0.5" />

                  {/* Calf */}
                  <path d="M 213 495 Q 210 500, 210 510 L 208 570 Q 208 575, 210 578"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />
                  <path d="M 225 495 Q 228 500, 228 510 L 226 570 Q 226 575, 224 578"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />
                  <path d="M 213 495 L 225 495 L 224 578 L 210 578 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />

                  {/* Calf muscle */}
                  <ellipse cx="217" cy="530" rx="7" ry="18" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.3" />

                  {/* Ankle */}
                  <ellipse cx="217" cy="583" rx="9" ry="6" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                  {/* Foot - more realistic */}
                  <path d="M 210 588 Q 205 590, 205 595 L 208 610 Q 210 615, 215 615 L 228 610 Q 230 605, 228 600 L 225 590 Q 223 588, 220 588 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                  {/* Toes */}
                  <g>
                    <ellipse cx="210" cy="616" rx="3" ry="4" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <ellipse cx="215" cy="617" rx="3" ry="5" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <ellipse cx="220" cy="616.5" rx="3" ry="4.5" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <ellipse cx="225" cy="616" rx="2.5" ry="4" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <ellipse cx="229" cy="615" rx="2" ry="3.5" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                  </g>
                </g>

                {/* Legs - Right (more realistic with muscle definition) */}
                <g>
                  {/* Thigh */}
                  <path d="M 270 390 Q 267 395, 267 405 L 272 475 Q 272 480, 275 483"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />
                  <path d="M 282 390 Q 285 395, 285 405 L 290 475 Q 290 480, 287 483"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />
                  <path d="M 270 390 L 282 390 L 287 483 L 275 483 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />

                  {/* Quadriceps definition */}
                  <path d="M 280 420 Q 275 425, 280 430" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.3" />
                  <ellipse cx="281" cy="440" rx="6" ry="20" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.25" />

                  {/* Knee */}
                  <circle cx="281" cy="488" r="10" fill="url(#jointGradient)" stroke="#8b5a3c" strokeWidth="1.5" />
                  <ellipse cx="281" cy="485" rx="8" ry="5" fill="none" stroke="#b8856a" strokeWidth="1" opacity="0.5" />

                  {/* Calf */}
                  <path d="M 275 495 Q 272 500, 272 510 L 274 570 Q 274 575, 276 578"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />
                  <path d="M 287 495 Q 290 500, 290 510 L 292 570 Q 292 575, 290 578"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />
                  <path d="M 275 495 L 287 495 L 290 578 L 276 578 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.8" />

                  {/* Calf muscle */}
                  <ellipse cx="283" cy="530" rx="7" ry="18" fill="none" stroke="#b8856a" strokeWidth="0.8" opacity="0.3" />

                  {/* Ankle */}
                  <ellipse cx="283" cy="583" rx="9" ry="6" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                  {/* Foot - more realistic */}
                  <path d="M 280 588 Q 275 590, 275 595 L 272 610 Q 270 615, 275 615 L 290 610 Q 295 605, 292 600 L 290 590 Q 288 588, 285 588 Z"
                    fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="1.5" />

                  {/* Toes */}
                  <g>
                    <ellipse cx="271" cy="615" rx="2" ry="3.5" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <ellipse cx="275" cy="616" rx="2.5" ry="4" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <ellipse cx="280" cy="616.5" rx="3" ry="4.5" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <ellipse cx="285" cy="617" rx="3" ry="5" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                    <ellipse cx="290" cy="616" rx="3" ry="4" fill="url(#skinTone)" stroke="#8b5a3c" strokeWidth="0.8" />
                  </g>
                </g>

                {/* Internal Organs - Detailed Anatomy */}
                <g opacity="0.7">
                  {/* Heart - more realistic shape */}
                  <g>
                    <path d="M 250 165 Q 238 152, 228 160 Q 225 165, 228 172 Q 235 182, 250 195 Q 265 182, 272 172 Q 275 165, 272 160 Q 262 152, 250 165 Z"
                      fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" opacity="0.8" />
                    <path d="M 245 165 Q 245 172, 250 178 Q 255 172, 255 165" fill="none" stroke="#b91c1c" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.6" />
                    <ellipse cx="242" cy="167" rx="5" ry="7" fill="none" stroke="#991b1b" strokeWidth="0.8" opacity="0.5" />
                    <ellipse cx="258" cy="167" rx="5" ry="7" fill="none" stroke="#991b1b" strokeWidth="0.8" opacity="0.5" />
                  </g>

                  {/* Lungs - anatomically correct */}
                  <g>
                    {/* Left lung */}
                    <path d="M 200 155 Q 195 160, 197 175 L 200 200 Q 202 210, 210 212 Q 220 213, 225 205 L 228 170 Q 228 158, 220 153 Q 210 150, 200 155 Z"
                      fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
                    {[0, 1, 2].map((i) => (
                      <path key={`l-lobe-${i}`} d={`M ${205 + i * 7} ${160 + i * 15} Q ${210 + i * 6} ${165 + i * 15}, ${205 + i * 7} ${170 + i * 15}`}
                        fill="none" stroke="#d97706" strokeWidth="0.8" opacity="0.5" />
                    ))}

                    {/* Right lung */}
                    <path d="M 300 155 Q 305 160, 303 175 L 300 200 Q 298 210, 290 212 Q 280 213, 275 205 L 272 170 Q 272 158, 280 153 Q 290 150, 300 155 Z"
                      fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
                    {[0, 1, 2].map((i) => (
                      <path key={`r-lobe-${i}`} d={`M ${295 - i * 7} ${160 + i * 15} Q ${290 - i * 6} ${165 + i * 15}, ${295 - i * 7} ${170 + i * 15}`}
                        fill="none" stroke="#d97706" strokeWidth="0.8" opacity="0.5" />
                    ))}
                  </g>

                  {/* Liver */}
                  <path d="M 260 250 Q 280 248, 300 255 Q 310 260, 312 275 Q 310 295, 295 302 Q 275 305, 265 295 Q 258 285, 260 270 Z"
                    fill="#10b981" stroke="#059669" strokeWidth="1.5" opacity="0.75" />
                  <path d="M 270 260 Q 280 258, 290 262" fill="none" stroke="#047857" strokeWidth="1" opacity="0.5" />

                  {/* Stomach */}
                  <path d="M 210 255 Q 198 258, 195 270 Q 193 285, 202 295 Q 215 300, 228 292 Q 235 282, 230 268 Q 225 258, 210 255 Z"
                    fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" opacity="0.75" />

                  {/* Kidneys */}
                  <g>
                    <path d="M 205 275 Q 195 278, 195 288 Q 197 298, 207 300 Q 217 298, 218 288 Q 218 278, 210 275 Z"
                      fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.5" opacity="0.75" />
                    <ellipse cx="207" cy="288" rx="4" ry="6" fill="none" stroke="#2563eb" strokeWidth="0.8" opacity="0.5" />

                    <path d="M 295 275 Q 305 278, 305 288 Q 303 298, 293 300 Q 283 298, 282 288 Q 282 278, 290 275 Z"
                      fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.5" opacity="0.75" />
                    <ellipse cx="293" cy="288" rx="4" ry="6" fill="none" stroke="#2563eb" strokeWidth="0.8" opacity="0.5" />
                  </g>

                  {/* Intestines - more realistic coils */}
                  <g>
                    <path d="M 210 310 Q 200 315, 205 325 Q 210 335, 220 335 Q 230 330, 235 320 Q 238 310, 230 305"
                      fill="none" stroke="#fb923c" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />
                    <path d="M 230 305 Q 240 310, 245 320 Q 248 330, 240 340 Q 230 345, 220 340"
                      fill="none" stroke="#fb923c" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />
                    <path d="M 290 310 Q 300 315, 295 325 Q 290 335, 280 335 Q 270 330, 265 320 Q 262 310, 270 305"
                      fill="none" stroke="#fb923c" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />

                    <ellipse cx="250" cy="325" rx="35" ry="18" fill="none" stroke="#ea580c" strokeWidth="2" opacity="0.6" />
                  </g>

                  {/* Bladder */}
                  <path d="M 235 355 Q 230 358, 230 365 Q 232 372, 240 374 Q 260 374, 268 372 Q 270 365, 270 358 Q 268 355, 265 355 Z"
                    fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />

                  {/* Spleen */}
                  <ellipse cx="308" cy="268" rx="10" ry="16" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" opacity="0.7" />

                  {/* Pancreas */}
                  <path d="M 235 285 Q 250 282, 265 285 Q 270 288, 268 293 Q 260 296, 250 295 Q 240 296, 232 293 Q 230 288, 235 285 Z"
                    fill="#fb923c" stroke="#ea580c" strokeWidth="1.5" opacity="0.7" />
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