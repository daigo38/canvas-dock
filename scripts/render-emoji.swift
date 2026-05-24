#!/usr/bin/env swift
// Render an emoji glyph using Apple Color Emoji centered visually (not just
// typographically — emoji glyphs sit asymmetrically inside their nominal box,
// so we render to transparent, find the actual pixel bounds, then composite
// onto the target canvas at true center.
//
// Usage: swift scripts/render-emoji.swift <emoji> <out.png> <px>

import Cocoa

guard CommandLine.arguments.count >= 4 else {
  FileHandle.standardError.write("usage: render-emoji <emoji> <out.png> <px>\n".data(using: .utf8)!)
  exit(2)
}

let emoji = CommandLine.arguments[1]
let outPath = CommandLine.arguments[2]
let px = Int(CommandLine.arguments[3]) ?? 1024
let bgColor = NSColor(srgbRed: 10.0 / 255, green: 10.0 / 255, blue: 10.0 / 255, alpha: 1)
let fillRatio: CGFloat = 0.72 // emoji should occupy ~72% of the canvas after centering

// --- Step 1: render the glyph to a transparent oversized scratch buffer ----
// Use 2x oversample so post-trim downscale stays crisp.
let scratchSize = px * 2
let scratch = NSImage(size: NSSize(width: scratchSize, height: scratchSize))
scratch.lockFocus()
NSColor.clear.set()
NSRect(origin: .zero, size: scratch.size).fill(using: .copy)

let glyphSize = CGFloat(scratchSize) * 0.9
let font = NSFont(name: "Apple Color Emoji", size: glyphSize)!
let attrs: [NSAttributedString.Key: Any] = [.font: font]
let str = NSAttributedString(string: emoji, attributes: attrs)
let measured = str.size()
str.draw(at: NSPoint(
  x: (CGFloat(scratchSize) - measured.width) / 2,
  y: (CGFloat(scratchSize) - measured.height) / 2
))
scratch.unlockFocus()

guard let scratchRep = scratch.tiffRepresentation.flatMap({ NSBitmapImageRep(data: $0) }) else {
  FileHandle.standardError.write("scratch rep failed\n".data(using: .utf8)!)
  exit(1)
}

// --- Step 2: scan the bitmap for the bounding box of opaque pixels ---------
let w = scratchRep.pixelsWide
let h = scratchRep.pixelsHigh
var minX = w, minY = h, maxX = -1, maxY = -1

guard let bitmapData = scratchRep.bitmapData else {
  FileHandle.standardError.write("bitmap data missing\n".data(using: .utf8)!)
  exit(1)
}
let bpr = scratchRep.bytesPerRow
let bpp = scratchRep.bitsPerPixel / 8
let alphaIndex: Int
// NSBitmapImageRep order — for RGBA8888 it's R G B A; for premultiplied it's same. Assume alpha last.
alphaIndex = bpp - 1

for y in 0..<h {
  for x in 0..<w {
    let a = bitmapData[y * bpr + x * bpp + alphaIndex]
    if a > 8 { // ignore near-transparent edges
      if x < minX { minX = x }
      if x > maxX { maxX = x }
      if y < minY { minY = y }
      if y > maxY { maxY = y }
    }
  }
}

if maxX < 0 {
  FileHandle.standardError.write("no opaque pixels found — wrong emoji or font missing glyph\n".data(using: .utf8)!)
  exit(1)
}

let trimRect = NSRect(x: minX, y: h - 1 - maxY, width: maxX - minX + 1, height: maxY - minY + 1)
let trimmed = NSImage(size: trimRect.size)
trimmed.lockFocus()
scratch.draw(at: .zero, from: trimRect, operation: .copy, fraction: 1.0)
trimmed.unlockFocus()

// --- Step 3: composite the trimmed glyph centered onto the final canvas ----
let canvas = NSImage(size: NSSize(width: px, height: px))
canvas.lockFocus()
bgColor.setFill()
NSRect(x: 0, y: 0, width: px, height: px).fill()

let targetExtent = CGFloat(px) * fillRatio
let glyphAspect = trimRect.width / trimRect.height
let drawW: CGFloat
let drawH: CGFloat
if glyphAspect >= 1 {
  drawW = targetExtent
  drawH = targetExtent / glyphAspect
} else {
  drawH = targetExtent
  drawW = targetExtent * glyphAspect
}
let drawRect = NSRect(
  x: (CGFloat(px) - drawW) / 2,
  y: (CGFloat(px) - drawH) / 2,
  width: drawW,
  height: drawH
)
trimmed.draw(in: drawRect, from: .zero, operation: .sourceOver, fraction: 1.0)
canvas.unlockFocus()

guard let tiff = canvas.tiffRepresentation,
      let rep = NSBitmapImageRep(data: tiff),
      let png = rep.representation(using: .png, properties: [:])
else {
  FileHandle.standardError.write("png encode failed\n".data(using: .utf8)!)
  exit(1)
}

try png.write(to: URL(fileURLWithPath: outPath))
print("wrote \(px)x\(px) → \(outPath) (\(png.count) bytes, trimmed from \(Int(trimRect.width))x\(Int(trimRect.height)))")
