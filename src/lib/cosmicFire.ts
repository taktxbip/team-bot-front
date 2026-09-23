/**
 * Cosmic / fire particle canvas effect.
 * Adapted from https://codepen.io/mousman/pen/RWPZmM (Moussa Dembélé).
 */

import { FastSimplexNoise } from '@/lib/fastSimplexNoise'

class Particle {
  x: number
  y: number
  ax = 1
  ay = 0.5
  vx = 0
  vy = 0.5
  red = 0xff
  green = 0xff
  blue = 0xff

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export type CosmicFireOptions = {
  particleCount?: number
  flux?: number
  particlesColor?: number
  colorTransform?: number
  /** Solid RGB background under the fire (defaults to black). */
  backgroundRgb?: { r: number; g: number; b: number }
}

export class CosmicFire {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private width: number
  private height: number

  private redGrid: number[][] = []
  private greenGrid: number[][] = []
  private blueGrid: number[][] = []

  private compteur = 10
  private particleNumber: number
  private flux: number
  private particles: Particle[] = []

  private particlesColor: number
  private particleRedColor: number
  private particleGreenColor: number
  private particleBlueColor: number

  private colorTransform: number
  private colorTransformRedColor: number
  private colorTransformGreenColor: number
  private colorTransformBlueColor: number
  private backgroundR: number
  private backgroundG: number
  private backgroundB: number

  private xForce = 0.0008
  private yForce = 0.0012
  private ax = 0.9
  private ay = 0.86
  private vx = 0.8
  private vy = 0.85

  private gridVIndex = 0
  private imageData: ImageData
  private displayData: ImageData

  private rafId = 0
  private simplexTimeoutId = 0
  private running = false

  constructor(
    width: number,
    height: number,
    canvas: HTMLCanvasElement,
    options: CosmicFireOptions = {},
  ) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('2D canvas context unavailable')

    this.canvas = canvas
    this.context = ctx
    this.width = Math.max(4, Math.floor(width))
    this.height = Math.max(4, Math.floor(height))
    this.particleNumber = options.particleCount ?? 20000
    this.flux = options.flux ?? 100
    this.particlesColor = options.particlesColor ?? 0xfdfddd
    this.colorTransform = options.colorTransform ?? 0xeeb929

    this.particleRedColor = (this.particlesColor & 0xff0000) >> 16
    this.particleGreenColor = (this.particlesColor & 0x00ff00) >> 8
    this.particleBlueColor = this.particlesColor & 0x0000ff

    this.colorTransformRedColor = ((this.colorTransform & 0xff0000) >> 16) / 255
    this.colorTransformGreenColor = ((this.colorTransform & 0x00ff00) >> 8) / 255
    this.colorTransformBlueColor = (this.colorTransform & 0x0000ff) / 255

    this.backgroundR = options.backgroundRgb?.r ?? 0
    this.backgroundG = options.backgroundRgb?.g ?? 0
    this.backgroundB = options.backgroundRgb?.b ?? 0

    this.canvas.width = this.width
    this.canvas.height = this.height
    this.imageData = this.context.createImageData(this.width, this.height)
    this.displayData = this.context.createImageData(this.width, this.height)

    const pixels = this.imageData.data
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = 0
      pixels[i + 1] = 0
      pixels[i + 2] = 0
      pixels[i + 3] = 0xff
    }
    this.blitToCanvas()
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.reset()
    this.generateGreenSimplex()
    this.generateRedSimplex()
    this.generateBlueGrid()
    this.simplexTimeoutId = window.setTimeout(() => this.simplexLoop(), 1500)
    this.rafId = window.requestAnimationFrame(() => this.onFrame())
  }

  stop(): void {
    this.running = false
    window.cancelAnimationFrame(this.rafId)
    window.clearTimeout(this.simplexTimeoutId)
    this.rafId = 0
    this.simplexTimeoutId = 0
  }

  private onFrame(): void {
    if (!this.running) return

    const pixelsData = this.imageData.data
    const nbPixels = pixelsData.length
    const nb = this.compteur
    const width = this.width
    const height = this.height
    const gridVIndex = this.gridVIndex | 0
    const particleRedColor = this.particleRedColor
    const particleGreenColor = this.particleGreenColor
    const particleBlueColor = this.particleBlueColor
    const colorTransformRedColor = this.colorTransformRedColor
    const colorTransformGreenColor = this.colorTransformGreenColor
    const colorTransformBlueColor = this.colorTransformBlueColor

    for (let i = 0; i < nb; i++) {
      const p = this.particles[i]
      if (!p) continue

      let px = p.x | 0
      let py = p.y | 0
      px = Math.max(0, Math.min(width - 1, px))
      py = Math.max(0, Math.min(height - 1, py))

      const blue = this.blueGrid[px]?.[py] ?? 0
      const red = this.redGrid[px]?.[py] ?? 0
      const greenY = Math.min((this.height * 2 || 1) - 1, py + gridVIndex)
      const green = this.greenGrid[px]?.[greenY] ?? 0

      p.ax += red * this.xForce
      p.ay += green * this.yForce

      const gradient = 2 - 2 * blue + 0.5
      p.x += (p.vx += p.ax * gradient)
      p.y += (p.vy += p.ay * gradient)

      if (p.x > width || p.x < 0 || p.y >= height || p.y < 0) {
        this.respawnParticle(p, particleRedColor, particleGreenColor, particleBlueColor)
      }

      px = Math.max(0, Math.min(width - 1, p.x | 0))
      py = Math.max(0, Math.min(height - 1, p.y | 0))
      const heat = 0.7 + (this.blueGrid[px]?.[py] ?? 0)
      const pixelIndex = (py * width + px) * 4

      p.red = pixelsData[pixelIndex] = Math.min(p.red * heat, 0xff)
      p.green = pixelsData[pixelIndex + 1] = Math.min(p.green * heat, 0xff)
      p.blue = pixelsData[pixelIndex + 2] = Math.min(p.blue * heat, 0xff)
      p.red += 5

      if (p.red < 20) {
        p.vx = p.ax = Math.random() * 2 - 1
        p.vy = p.ay = Math.random() * 2 - 1
        p.x = Math.random() * width
        p.y = height / 2 + Math.random() * (height / 7) - height / 6
        p.red = (particleRedColor & 0xcc) + Math.random() * 0x33
        p.green = (particleGreenColor & 0xcc) + Math.random() * 0x33
        p.blue = (particleBlueColor & 0xcc) + Math.random() * 0x33
      }

      p.ax *= this.ax
      p.ay *= this.ay
      p.vx *= this.vx
      p.vy *= this.vy
    }

    if (this.compteur < this.particleNumber) {
      const theFlux = Math.min(this.flux, this.particleNumber - this.compteur)
      const limit = this.compteur + theFlux
      for (let j = this.compteur; j < limit; j++) {
        const particle = new Particle(
          Math.random() * width,
          height / 2 + Math.random() * (height / 6) - height / 6,
        )
        particle.red = (this.particlesColor & 0xaa) + Math.random() * 0x55
        particle.green = (this.particlesColor & 0xaa) + Math.random() * 0x55
        particle.blue = (this.particlesColor & 0xaa) + Math.random() * 0x55
        this.particles[j] = particle
      }
      this.compteur += theFlux
    }

    for (let i = 0; i < nbPixels; i += 4) {
      const ip2 = i - 4 > 0 ? i - 4 : i + 4
      const ip3 = i + 4 + width * 4 < nbPixels ? i + 4 + width * 4 : i - 4 - width * 4
      const ip4 = i - width * 4 > 0 ? i - width * 4 : i + width * 4
      const ip5 = i - width * 8 > 0 ? i - width * 8 : i + width * 8

      for (let j = 0; j < 3; j++) {
        const mean =
          (pixelsData[i + j] + pixelsData[ip2 + j] + pixelsData[ip3 + j] + pixelsData[ip4 + j]) >>>
          2
        pixelsData[i + j] = (pixelsData[i + j] >> 6) + mean
        pixelsData[ip2 + j] = mean
        pixelsData[ip3 + j] = mean
        pixelsData[ip4 + j] = mean
        pixelsData[ip5 + j] = (pixelsData[ip5 + j] >> 6) + mean
      }

      pixelsData[i] *= colorTransformRedColor
      pixelsData[i + 1] *= colorTransformGreenColor
      pixelsData[i + 2] *= colorTransformBlueColor
    }

    this.blitToCanvas()

    this.gridVIndex += 2
    if (this.gridVIndex > height) this.gridVIndex = 0

    this.rafId = window.requestAnimationFrame(() => this.onFrame())
  }

  /** Composite black-based fire simulation over the configured background color. */
  private blitToCanvas(): void {
    const src = this.imageData.data
    const dst = this.displayData.data
    const bgR = this.backgroundR
    const bgG = this.backgroundG
    const bgB = this.backgroundB

    for (let i = 0; i < src.length; i += 4) {
      const r = src[i]
      const g = src[i + 1]
      const b = src[i + 2]
      const intensity = Math.max(r, g, b) / 255
      dst[i] = Math.round(bgR * (1 - intensity) + r * intensity)
      dst[i + 1] = Math.round(bgG * (1 - intensity) + g * intensity)
      dst[i + 2] = Math.round(bgB * (1 - intensity) + b * intensity)
      dst[i + 3] = 0xff
    }

    this.context.putImageData(this.displayData, 0, 0)
  }

  private respawnParticle(
    p: Particle,
    particleRedColor: number,
    particleGreenColor: number,
    particleBlueColor: number,
  ): void {
    p.vx = p.ax = Math.random() - 0.2
    p.vy = p.ay = Math.random() * 2 - 1
    p.x = Math.random() * this.width
    if (p.y >= this.height || p.y < 0) {
      p.y = this.height / 2 + Math.random() * (this.height / 6) - this.height / 6
    }
    p.red = (particleRedColor & 0xaa) + Math.random() * 0x55
    p.green = (particleGreenColor & 0xaa) + Math.random() * 0x55
    p.blue = (particleBlueColor & 0xaa) + Math.random() * 0x55
  }

  private reset(): void {
    const gridW = this.width * 2
    const gridH = this.height * 2
    this.greenGrid = new Array(gridW)
    this.redGrid = new Array(gridW)
    this.blueGrid = new Array(gridW)

    for (let x = 0; x < gridW; x++) {
      this.greenGrid[x] = new Array(gridH).fill(0)
      this.redGrid[x] = new Array(gridH).fill(0)
      this.blueGrid[x] = new Array(gridH).fill(0)
    }

    this.particles = []
    for (let i = 0; i < this.flux; i++) {
      const particle = new Particle(
        Math.random() * this.width,
        this.height / 2 + Math.random() * (this.height / 6) - this.height / 6,
      )
      particle.red = (this.particlesColor & 0xaa) + Math.random() * 0x55
      particle.green = (this.particlesColor & 0xaa) + Math.random() * 0x55
      particle.blue = (this.particlesColor & 0xaa) + Math.random() * 0x55
      this.particles[i] = particle
    }
    this.compteur = this.flux
  }

  private simplexLoop(): void {
    if (!this.running) return
    this.generateRedSimplex()
    const delay = (1 + Math.random() / 2 + Math.random()) * 1000
    this.simplexTimeoutId = window.setTimeout(() => this.simplexLoop(), delay)
  }

  private generateRedSimplex(): void {
    const noiseGen = new FastSimplexNoise({
      frequency: 0.02,
      max: 0xff,
      min: 0,
      octaves: 12,
    })

    for (let x = 0; x < this.width; x += 4) {
      for (let y = 0; y < this.height; y += 4) {
        const noise = noiseGen.get2DNoise(x, y) - 128
        this.fillBlock(this.redGrid, x, y, noise)
      }
    }
  }

  private generateGreenSimplex(): void {
    const noiseGen = new FastSimplexNoise({
      frequency: 0.008,
      max: 0xff,
      min: 0,
      octaves: 12,
    })

    for (let x = 0; x < this.width; x += 4) {
      for (let y = 0; y < this.height * 2; y += 4) {
        const noise = noiseGen.get2DNoise(x, y) - 180
        this.fillBlock(this.greenGrid, x, y, noise)
      }
    }
  }

  private generateBlueGrid(): void {
    for (let x = 0; x < this.width; x += 4) {
      for (let y = 0; y < this.height; y += 4) {
        const gradient = y / this.height
        this.fillBlock(this.blueGrid, x, y, gradient)
      }
    }
  }

  private fillBlock(grid: number[][], x: number, y: number, value: number): void {
    for (let dx = 0; dx < 4; dx++) {
      const col = grid[x + dx]
      if (!col) continue
      for (let dy = 0; dy < 4; dy++) {
        if (y + dy < col.length) col[y + dy] = value
      }
    }
  }
}
