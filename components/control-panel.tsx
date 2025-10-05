"use client"

import { ZoomIn, ZoomOut, Maximize2, Tag, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"

type ControlPanelProps = {
  zoom: number
  onZoomChange: (zoom: number) => void
  markers: Array<{ x: number; y: number; label: string }>
  onRemoveMarker: (index: number) => void
  onClearMarkers: () => void
}

export function ControlPanel({ zoom, onZoomChange, markers, onRemoveMarker, onClearMarkers }: ControlPanelProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.5, 10))
  }

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.5, 0.5))
  }

  const handleReset = () => {
    onZoomChange(1)
  }

  return (
    <>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-border bg-card/95 backdrop-blur-sm p-3 shadow-xl">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.5}>
          <ZoomOut className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3 px-2">
          <Slider
            value={[zoom]}
            onValueChange={([value]) => onZoomChange(value)}
            min={0.5}
            max={10}
            step={0.1}
            className="w-40"
          />
          <span className="min-w-[4rem] text-sm font-semibold text-foreground tabular-nums">
            {(zoom * 100).toFixed(0)}%
          </span>
        </div>

        <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 10}>
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button variant="ghost" size="icon" onClick={handleReset} title="Reset zoom">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {markers.length > 0 && (
        <div className="absolute right-6 top-24 w-72 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 border-b border-border p-3">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Markers</h3>
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {markers.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 -mr-1"
              onClick={onClearMarkers}
              title="Clear all markers"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <ScrollArea className="max-h-80">
            <div className="space-y-1 p-2">
              {markers.map((marker, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md bg-secondary/50 p-2.5 text-sm hover:bg-secondary/70 transition-colors group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-foreground truncate">{marker.label}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => onRemoveMarker(index)}
                    title="Remove marker"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="absolute left-6 top-24 rounded-lg border border-border bg-card/95 backdrop-blur-sm p-4 shadow-xl">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Controls</h3>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="text-primary">•</span>
            <span>Click and drag to pan</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">•</span>
            <span>Mouse wheel to zoom</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">•</span>
            <span>Use slider for precise zoom</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary">•</span>
            <span>Double-click to add marker</span>
          </li>
        </ul>
      </div>
    </>
  )
}
