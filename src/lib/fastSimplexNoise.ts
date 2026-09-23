/**
 * Fast Simplex Noise (2D) — based on Stefan Gustavson / Peter Eastman.
 * Public domain; attribution appreciated.
 */

type FastSimplexNoiseOptions = {
  amplitude?: number
  frequency?: number
  octaves?: number
  persistence?: number
  min?: number
  max?: number
  random?: () => number
}

const G2 = (3 - Math.sqrt(3)) / 6
const GRADIENTS_3D: ReadonlyArray<readonly [number, number, number]> = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, -1],
  [0, 1, -1],
  [0, -1, -1],
]

function dot2D(g: readonly [number, number, number], x: number, y: number): number {
  return g[0] * x + g[1] * y
}

export class FastSimplexNoise {
  amplitude: number
  frequency: number
  octaves: number
  persistence: number
  private perm: Uint8Array
  private permMod12: Uint8Array
  private scale: ((value: number) => number) | null

  constructor(options: FastSimplexNoiseOptions = {}) {
    this.amplitude = options.amplitude ?? 1
    this.frequency = options.frequency ?? 1
    this.octaves = options.octaves ?? 1
    this.persistence = options.persistence ?? 0.5
    const random = options.random ?? Math.random

    this.scale = null
    if (typeof options.min === 'number' && typeof options.max === 'number') {
      const min = options.min
      const max = options.max
      const range = max - min
      this.scale = (value) => min + ((value + 1) / 2) * range
    }

    const source = new Uint8Array(256)
    for (let i = 0; i < 256; i++) source[i] = i
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((i + 1) * random())
      const tmp = source[i]
      source[i] = source[j]
      source[j] = tmp
    }

    this.perm = new Uint8Array(512)
    this.permMod12 = new Uint8Array(512)
    for (let i = 0; i < 512; i++) {
      this.perm[i] = source[i & 255]
      this.permMod12[i] = this.perm[i] % 12
    }
  }

  get2DNoise(x: number, y: number): number {
    let amp = this.amplitude
    let freq = this.frequency
    let maxAmp = 0
    let value = 0

    for (let i = 0; i < this.octaves; i++) {
      value += this.getRaw2DNoise(x * freq, y * freq) * amp
      maxAmp += amp
      amp *= this.persistence
      freq *= 2
    }

    const normalized = value / maxAmp
    return this.scale ? this.scale(normalized) : normalized
  }

  private getRaw2DNoise(x: number, y: number): number {
    const s = 0.5 * (x + y) * (Math.sqrt(3) - 1)
    const i = Math.floor(x + s)
    const j = Math.floor(y + s)
    const t = (i + j) * G2
    const x0 = x - (i - t)
    const y0 = y - (j - t)

    const i1 = x0 > y0 ? 1 : 0
    const j1 = x0 > y0 ? 0 : 1

    const x1 = x0 - i1 + G2
    const y1 = y0 - j1 + G2
    const x2 = x0 - 1 + 2 * G2
    const y2 = y0 - 1 + 2 * G2

    const ii = i & 255
    const jj = j & 255
    const gi0 = this.permMod12[ii + this.perm[jj]]
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]]
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]]

    let n0 = 0
    let t0 = 0.5 - x0 * x0 - y0 * y0
    if (t0 >= 0) {
      t0 *= t0
      n0 = t0 * t0 * dot2D(GRADIENTS_3D[gi0], x0, y0)
    }

    let n1 = 0
    let t1 = 0.5 - x1 * x1 - y1 * y1
    if (t1 >= 0) {
      t1 *= t1
      n1 = t1 * t1 * dot2D(GRADIENTS_3D[gi1], x1, y1)
    }

    let n2 = 0
    let t2 = 0.5 - x2 * x2 - y2 * y2
    if (t2 >= 0) {
      t2 *= t2
      n2 = t2 * t2 * dot2D(GRADIENTS_3D[gi2], x2, y2)
    }

    return 70.14805770653952 * (n0 + n1 + n2)
  }
}
