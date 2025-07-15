import type React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as LucideIcons from "lucide-react"
import { LucideProps } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIcon(iconName: string) {
  const icons = Object.entries(LucideIcons)
    .filter(([, value]) => typeof value === "function") // keep only components
    .reduce<Record<string, React.ComponentType<LucideProps>>>((acc, [key, value]) => {
      acc[key] = value as React.ComponentType<LucideProps>
      return acc
    }, {})

  return icons[iconName] || LucideIcons.Circle
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  isCircle = false
): Promise<Blob> {
  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", (error) => reject(error))
      image.setAttribute("crossOrigin", "anonymous")
      image.src = url
    })
  }

  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  if (isCircle && ctx) {
    ctx.beginPath()
    ctx.arc(
      pixelCrop.width / 2,
      pixelCrop.height / 2,
      pixelCrop.width / 2,
      0,
      2 * Math.PI
    )
    ctx.closePath()
    ctx.clip()
  }

  ctx?.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Failed to create blob from canvas"))
    }, "image/png")
  })
}
