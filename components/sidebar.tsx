"use client"

import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ImageData } from "./image-explorer"
import { useState } from "react"

type SidebarProps = {
  images: ImageData[]
  selectedImage: ImageData
  onSelectImage: (image: ImageData) => void
  isOpen: boolean
  onToggle: () => void
}

const CATEGORY_COLORS = {
  earth: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  mars: "bg-red-500/20 text-red-400 border-red-500/30",
  moon: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  galaxy: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  nebula: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

export function Sidebar({ images, selectedImage, onSelectImage, isOpen, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredImages = images.filter(
    (img) =>
      img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-border bg-card transition-all duration-300",
          isOpen ? "w-80" : "w-0",
        )}
      >
        {isOpen && (
          <>
            <div className="border-b border-border p-4">
              <h1 className="mb-4 text-2xl font-bold text-foreground">NASA Explorer</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4">
                {filteredImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => onSelectImage(image)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-all hover:border-primary/50",
                      selectedImage.id === image.id ? "border-primary bg-primary/10" : "border-border bg-card",
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground leading-tight">{image.name}</h3>
                      <Badge variant="outline" className={cn("text-xs", CATEGORY_COLORS[image.category])}>
                        {image.category}
                      </Badge>
                    </div>
                    <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{image.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{image.resolution}</span>
                      <span>{new Date(image.date).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </aside>

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute left-0 top-1/2 z-10 h-12 w-6 -translate-y-1/2 rounded-l-none rounded-r-md border border-l-0 border-border bg-card hover:bg-accent"
        style={{ left: isOpen ? "320px" : "0" }}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </>
  )
}
