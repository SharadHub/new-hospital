"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Download, Maximize2, User, Calendar, FileText } from "lucide-react"

interface Report {
  id: string
  serialNumber: number
  patient: string
  department: string
  reportType: string
  date: string
  doctor: string
  uploadedAt: string
}

interface FirmViewingProps {
  report: Report | null
  onBack: () => void
}

const FirmViewing: React.FC<FirmViewingProps> = ({ report, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  if (!report) return null

  // Generate department-specific placeholder images
  const getDepartmentImages = (department: string) => {
    const baseImages = {
      "ct-scan": [
        "/ct-scan-brain-axial-view-medical-imaging.jpg",
        "/ct-scan-chest-axial-view-medical-imaging.jpg",
        "/ct-scan-abdomen-axial-view-medical-imaging.jpg",
        "/ct-scan-pelvis-axial-view-medical-imaging.jpg",
      ],
      mri: [
        "/mri-brain-t1-weighted-sagittal-view.jpg",
        "/mri-brain-t2-weighted-axial-view.jpg",
        "/mri-spine-sagittal-view-medical-imaging.jpg",
        "/mri-knee-coronal-view-medical-imaging.jpg",
      ],
      "x-ray": [
        "/chest-x-ray-pa-view-medical-radiograph.jpg",
        "/hand-x-ray-ap-view-medical-radiograph.jpg",
        "/spine-x-ray-lateral-view-medical-radiograph.jpg",
        "/pelvis-x-ray-ap-view-medical-radiograph.jpg",
      ],
      usg: [
        "/ultrasound-abdomen-grayscale-medical-imaging.jpg",
        "/ultrasound-cardiac-echo-medical-imaging.jpg",
        "/ultrasound-obstetric-fetal-medical-imaging.jpg",
        "/ultrasound-medical-imaging.jpg",
      ],
      ecg: ["/ecg-electrocardiogram-medical-chart.jpg", "/ecg-rhythm-strip-medical-chart.jpg", "/12-lead-ecg-medical-chart.jpg"],
      tmt: ["/tmt-stress-test-medical-chart.jpg", "/tmt-exercise-test-results.jpg", "/cardiac-stress-test-graph.jpg"],
      holter: ["/holter-monitor-24-hour-ecg-chart.jpg", "/holter-monitoring-results.jpg", "/continuous-cardiac-monitoring-chart.jpg"],
    }

    return baseImages[department as keyof typeof baseImages] || baseImages["x-ray"]
  }

  const images = getDepartmentImages(report.department.toLowerCase())

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)
  const handleDownload = () => {
    // In a real app, this would download the actual image
    console.log("Downloading image:", images[selectedImage])
  }

  const getDepartmentName = (dept: string) => {
    const names: { [key: string]: string } = {
      "ct-scan": "CT Scan",
      mri: "MRI",
      ecg: "ECG",
      usg: "USG",
      "x-ray": "X-Ray",
      tmt: "TMT",
      holter: "Holter",
    }
    return names[dept] || dept.toUpperCase()
  }

  return (
    <div className="firm-viewing">
      <style>{`
        .firm-viewing {
          background: #f1f5f9;
          min-height: 100vh;
          padding: 1rem;
        }

        .viewing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .back-button:hover {
          background: #2563eb;
        }

        .header-info {
          display: flex;
          flex-direction: column;
        }

        .viewing-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
        }

        .viewing-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .patient-info {
          display: flex;
          align-items: center;
          gap: 2rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Main viewing area with image viewer and controls */
        .viewing-content {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 1rem;
          height: calc(100vh - 140px);
        }

        .thumbnails-panel {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          overflow-y: auto;
        }

        .thumbnails-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 1rem 0;
        }

        .thumbnail-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .thumbnail {
          width: 100%;
          height: 80px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          object-fit: cover;
        }

        .thumbnail.active {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .thumbnail:hover {
          border-color: #93c5fd;
        }

        .main-viewer {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .viewer-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .control-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .control-button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .zoom-display {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          min-width: 60px;
          text-align: center;
        }

        .image-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        .main-image {
          max-width: 100%;
          max-height: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
          transform: scale(${zoom / 100}) rotate(${rotation}deg);
        }

        .image-info {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .viewing-content {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }

          .thumbnails-panel {
            height: 120px;
          }

          .thumbnail-list {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .thumbnail {
            min-width: 80px;
            height: 60px;
          }

          .viewer-controls {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .patient-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="viewing-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="header-info">
            <h1 className="viewing-title">{getDepartmentName(report.department)} - Firm Viewing</h1>
            <p className="viewing-subtitle">Medical Image Viewer</p>
          </div>
        </div>
        <div className="patient-info">
          <div className="info-item">
            <User size={16} />
            <span>{report.patient}</span>
          </div>
          <div className="info-item">
            <Calendar size={16} />
            <span>{new Date(report.date).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <FileText size={16} />
            <span>{report.reportType}</span>
          </div>
        </div>
      </div>

      <div className="viewing-content">
        <div className="thumbnails-panel">
          <h3 className="thumbnails-title">Images ({images.length})</h3>
          <div className="thumbnail-list">
            {images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${report.department} image ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="main-viewer">
          <div className="viewer-controls">
            <div className="control-group">
              <button className="control-button" onClick={handleZoomOut}>
                <ZoomOut size={16} />
                Zoom Out
              </button>
              <span className="zoom-display">{zoom}%</span>
              <button className="control-button" onClick={handleZoomIn}>
                <ZoomIn size={16} />
                Zoom In
              </button>
            </div>
            <div className="control-group">
              <button className="control-button" onClick={handleRotate}>
                <RotateCw size={16} />
                Rotate
              </button>
              <button className="control-button" onClick={handleDownload}>
                <Download size={16} />
                Download
              </button>
              <button className="control-button">
                <Maximize2 size={16} />
                Fullscreen
              </button>
            </div>
          </div>

          <div className="image-container">
            <img
              src={images[selectedImage] || "/placeholder.svg"}
              alt={`${report.department} image ${selectedImage + 1}`}
              className="main-image"
            />
            <div className="image-info">
              Image {selectedImage + 1} of {images.length} | {getDepartmentName(report.department)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirmViewing