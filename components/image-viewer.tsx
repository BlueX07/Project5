"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import type { ImageData } from "./image-explorer"
import { MapPin } from "lucide-react"

type ImageViewerProps = {
  image: ImageData
  zoom: number
  markers: Array<{ x: number; y: number; label: string }>
  onAddMarker: (marker: { x: number; y: number; label: string }) => void
  onZoomChange: (zoom: number) => void
}

export function ImageViewer({ image, zoom, markers, onAddMarker, onZoomChange }: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showMarkerDialog, setShowMarkerDialog] = useState(false)
  const [pendingMarker, setPendingMarker] = useState<{ x: number; y: number } | null>(null)
  const [markerLabel, setMarkerLabel] = useState("")

  useEffect(() => {
    setPan({ x: 0, y: 0 })
  }, [image.id])

  useEffect(() => {
    if (containerRef.current && imageRef.current) {
      const container = containerRef.current.getBoundingClientRect()
      const centerX = container.width / 2
      const centerY = container.height / 2

      setPan({
        x: centerX - centerX * zoom,
        y: centerY - centerY * zoom,
      })
    }
  }, [zoom])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !showMarkerDialog) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()

    const delta = e.deltaY * -0.001
    const newZoom = Math.min(Math.max(zoom + delta, 0.5), 10)

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const scale = newZoom / zoom

      setPan({
        x: mouseX - (mouseX - pan.x) * scale,
        y: mouseY - (mouseY - pan.y) * scale,
      })
    }

    onZoomChange(newZoom)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !imageRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const imageRect = imageRef.current.getBoundingClientRect()

    const x = (e.clientX - imageRect.left) / imageRect.width
    const y = (e.clientY - imageRect.top) / imageRect.height

    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      setPendingMarker({ x, y })
      setShowMarkerDialog(true)
    }
  }

  const handleAddMarker = () => {
    if (pendingMarker && markerLabel.trim()) {
      onAddMarker({ ...pendingMarker, label: markerLabel.trim() })
      setPendingMarker(null)
      setShowMarkerDialog(false)
      setMarkerLabel("")
    }
  }

  const handleCancelMarker = () => {
    setPendingMarker(null)
    setShowMarkerDialog(false)
    setMarkerLabel("")
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-background"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <img
          ref={imageRef}
          src={image.imageUrl || "/placeholder.svg"}
          alt={image.name}
          className="h-full w-full object-contain"
          draggable={false}
          style={{ userSelect: "none" }}
        />

        {markers.map((marker, index) => (
          <div
            key={index}
            className="absolute pointer-events-none"
            style={{
              left: `${marker.x * 100}%`,
              top: `${marker.y * 100}%`,
              transform: `translate(-50%, -100%) scale(${1 / zoom})`,
              transformOrigin: "center bottom",
            }}
          >
            <div className="flex flex-col items-center pointer-events-auto">
              <MapPin className="h-6 w-6 fill-accent text-accent drop-shadow-lg" />
              <span className="mt-1 rounded bg-accent/90 px-2 py-1 text-xs font-medium text-accent-foreground shadow-lg whitespace-nowrap">
                {marker.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showMarkerDialog && pendingMarker && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="rounded-lg border border-border bg-card p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="mb-2 text-lg font-semibold text-foreground">Add Marker</h3>
            <p className="mb-4 text-sm text-muted-foreground">Enter a label for this location</p>
            <input
              type="text"
              value={markerLabel}
              onChange={(e) => setMarkerLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddMarker()
                if (e.key === "Escape") handleCancelMarker()
              }}
              placeholder="e.g., Crater, Galaxy Core, Mountain..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddMarker}
                disabled={!markerLabel.trim()}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Marker
              </button>
              <button
                onClick={handleCancelMarker}
                className="flex-1 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
