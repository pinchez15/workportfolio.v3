import { adventurer, notionists, bigEars } from "@dicebear/collection"
import type { Style } from "@dicebear/core"

export type AvatarStyle = "adventurer" | "notionists" | "bigEars"

export interface CategoryConfig {
  key: string
  label: string
  type: "variant" | "color" | "toggle"
  variants?: string[]
  colors?: string[]
  probabilityKey?: string
}

export interface StyleConfig {
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style: Style<any>
  categories: CategoryConfig[]
}

// Expanded skin tone palette for inclusivity
const SKIN_TONES = [
  "fde2c8", "f8d9c0", "f2d3b1", "edb98a", "d5a77b",
  "c68642", "ae5d29", "9e5622", "763900", "5c3317",
]

const ADVENTURER_HAIR_COLORS = [
  "2c1b18", "4a312c", "6a4e42", "85461e", "ac6511",
  "cb6820", "d6b370", "e8e1e1", "b55239", "ab2a18",
  "c93305", "e03c00", "592454", "28394f",
]

const BIG_EARS_HAIR_COLORS = [
  "2c1b18", "4a312c", "6a4e42", "85461e", "ac6511",
  "d6b370", "e8e1e1", "ecdcbf", "b55239", "c93305",
]

export const STYLE_CONFIGS: Record<AvatarStyle, StyleConfig> = {
  adventurer: {
    label: "Adventurer",
    style: adventurer,
    categories: [
      {
        key: "skinColor",
        label: "Skin Tone",
        type: "color",
        colors: SKIN_TONES,
      },
      {
        key: "hair",
        label: "Hair",
        type: "variant",
        variants: [
          "short01", "short02", "short03", "short04", "short05",
          "short06", "short07", "short08", "short09", "short10",
          "short11", "short12", "short13", "short14", "short15", "short16",
          "long01", "long02", "long03", "long04", "long05",
          "long06", "long07", "long08", "long09", "long10",
          "long11", "long12", "long13", "long14", "long15",
          "long16", "long17", "long18", "long19", "long20",
          "long21", "long22", "long23", "long24", "long25", "long26",
        ],
      },
      {
        key: "hairColor",
        label: "Hair Color",
        type: "color",
        colors: ADVENTURER_HAIR_COLORS,
      },
      {
        key: "eyes",
        label: "Eyes",
        type: "variant",
        variants: Array.from({ length: 26 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "eyebrows",
        label: "Eyebrows",
        type: "variant",
        variants: Array.from({ length: 15 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "mouth",
        label: "Mouth",
        type: "variant",
        variants: Array.from({ length: 30 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "glasses",
        label: "Glasses",
        type: "toggle",
        variants: ["variant01", "variant02", "variant03", "variant04", "variant05"],
        probabilityKey: "glassesProbability",
      },
    ],
  },
  notionists: {
    label: "Notionists",
    style: notionists,
    categories: [
      {
        key: "hair",
        label: "Hair",
        type: "variant",
        variants: [
          ...Array.from({ length: 63 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
          "hat",
        ],
      },
      {
        key: "eyes",
        label: "Eyes",
        type: "variant",
        variants: Array.from({ length: 5 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "brows",
        label: "Eyebrows",
        type: "variant",
        variants: Array.from({ length: 13 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "lips",
        label: "Mouth",
        type: "variant",
        variants: Array.from({ length: 30 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "nose",
        label: "Nose",
        type: "variant",
        variants: Array.from({ length: 20 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "body",
        label: "Body",
        type: "variant",
        variants: Array.from({ length: 25 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "glasses",
        label: "Glasses",
        type: "toggle",
        variants: Array.from({ length: 11 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
        probabilityKey: "glassesProbability",
      },
      {
        key: "beard",
        label: "Beard",
        type: "toggle",
        variants: Array.from({ length: 12 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
        probabilityKey: "beardProbability",
      },
    ],
  },
  bigEars: {
    label: "Big Ears",
    style: bigEars,
    categories: [
      {
        key: "skinColor",
        label: "Skin Tone",
        type: "color",
        colors: SKIN_TONES,
      },
      {
        key: "hair",
        label: "Hair",
        type: "variant",
        variants: [
          ...Array.from({ length: 20 }, (_, i) => `short${String(i + 1).padStart(2, "0")}`),
          ...Array.from({ length: 20 }, (_, i) => `long${String(i + 1).padStart(2, "0")}`),
        ],
      },
      {
        key: "hairColor",
        label: "Hair Color",
        type: "color",
        colors: BIG_EARS_HAIR_COLORS,
      },
      {
        key: "face",
        label: "Face Shape",
        type: "variant",
        variants: Array.from({ length: 10 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "eyes",
        label: "Eyes",
        type: "variant",
        variants: Array.from({ length: 32 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
      {
        key: "mouth",
        label: "Mouth",
        type: "variant",
        variants: Array.from({ length: 40 }, (_, i) => {
          const group = String(Math.floor(i / 8) + 1).padStart(2, "0")
          const idx = String((i % 8) + 1).padStart(2, "0")
          return `variant${group}${idx}`
        }),
      },
      {
        key: "nose",
        label: "Nose",
        type: "variant",
        variants: Array.from({ length: 12 }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`),
      },
    ],
  },
}

export function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

export async function svgToPng(svgString: string, size: number = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, size, size)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve(blob)
          else reject(new Error("Failed to create PNG blob"))
        },
        "image/png"
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load SVG"))
    }

    img.src = url
  })
}
