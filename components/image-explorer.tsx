"use client"

import { useState } from "react"
import { ImageViewer } from "./image-viewer"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { ControlPanel } from "./control-panel"

export type ImageData = {
  id: string
  name: string
  description: string
  category: "earth" | "mars" | "moon" | "galaxy" | "nebula"
  resolution: string
  date: string
  imageUrl: string
}

const SAMPLE_IMAGES: ImageData[] = [
  {
    id: "1",
    name: "Andromeda Galaxy",
    description: "2.5 gigapixel image of the Andromeda galaxy captured by Hubble Space Telescope",
    category: "galaxy",
    resolution: "2.5 GP",
    date: "2015-01-05",
    imageUrl: "/andromeda-galaxy-detailed-hubble-space-telescope.jpg",
  },
  {
    id: "2",
    name: "Mars Surface - Valles Marineris",
    description: "High-resolution map of Mars showing the Valles Marineris canyon system",
    category: "mars",
    resolution: "1.8 GP",
    date: "2024-03-15",
    imageUrl: "/mars-surface-valles-marineris-canyon-detailed.jpg",
  },
  {
    id: "3",
    name: "Earth - North America",
    description: "Composite satellite image of North America from multiple NASA satellites",
    category: "earth",
    resolution: "3.2 GP",
    date: "2024-09-20",
    imageUrl: "/earth-north-america-satellite-view-detailed.jpg",
  },
  {
    id: "4",
    name: "Lunar South Pole",
    description: "Detailed map of the lunar south pole from Lunar Reconnaissance Orbiter",
    category: "moon",
    resolution: "1.5 GP",
    date: "2023-11-10",
    imageUrl: "/moon-south-pole-craters-detailed-surface.jpg",
  },
  {
    id: "5",
    name: "Carina Nebula",
    description: "Ultra-high resolution image of the Carina Nebula star-forming region",
    category: "nebula",
    resolution: "4.1 GP",
    date: "2022-07-12",
    imageUrl: "/carina-nebula-colorful-stars-cosmic-clouds.jpg",
  },
  {
    id: "6",
    name: "Mars - Olympus Mons",
    description: "The largest volcano in the solar system captured in stunning detail",
    category: "mars",
    resolution: "2.2 GP",
    date: "2024-01-08",
    imageUrl: "/mars-olympus-mons-volcano-aerial-view.jpg",
  },
]

export function ImageExplorer() {
  const [selectedImage, setSelectedImage] = useState<ImageData>(SAMPLE_IMAGES[0])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [markers, setMarkers] = useState<Array<{ x: number; y: number; label: string }>>([])

  const handleSelectImage = (image: ImageData) => {
    setSelectedImage(image)
    setMarkers([])
    setZoom(1)
  }

  return (
    <div className="flex h-full w-full bg-background">
      <Sidebar
        images={SAMPLE_IMAGES}
        selectedImage={selectedImage}
        onSelectImage={handleSelectImage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 flex-col">
        <TopBar selectedImage={selectedImage} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="relative flex-1">
          <ImageViewer
            image={selectedImage}
            zoom={zoom}
            markers={markers}
            onAddMarker={(marker) => setMarkers([...markers, marker])}
            onZoomChange={setZoom}
          />

          <ControlPanel
            zoom={zoom}
            onZoomChange={setZoom}
            markers={markers}
            onRemoveMarker={(index) => setMarkers(markers.filter((_, i) => i !== index))}
            onClearMarkers={() => setMarkers([])}
          />
        </div>
      </div>
    </div>
  )
}
