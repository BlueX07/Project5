"use client"

import { Menu, Info, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ImageData } from "./image-explorer"

type TopBarProps = {
  selectedImage: ImageData
  onToggleSidebar: () => void
}

export function TopBar({ selectedImage, onToggleSidebar }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{selectedImage.name}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedImage.resolution} • {selectedImage.date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
