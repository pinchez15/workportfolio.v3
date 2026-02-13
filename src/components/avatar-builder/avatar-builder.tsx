"use client"

import { useState, useMemo, useCallback } from "react"
import { createAvatar } from "@dicebear/core"
import { Shuffle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  STYLE_CONFIGS,
  generateRandomSeed,
  type AvatarStyle,
  type CategoryConfig,
} from "./avatar-utils"

interface AvatarBuilderProps {
  onSvgChange: (svg: string) => void
}

export function AvatarBuilder({ onSvgChange }: AvatarBuilderProps) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>("adventurer")
  const [seed, setSeed] = useState(() => generateRandomSeed())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [overrides, setOverrides] = useState<Record<string, any>>({})

  const config = STYLE_CONFIGS[selectedStyle]

  const svgString = useMemo(() => {
    const opts = { seed, ...overrides }
    const avatar = createAvatar(config.style, opts)
    const svg = avatar.toString()
    onSvgChange(svg)
    return svg
  }, [config.style, seed, overrides, onSvgChange])

  // Generate preview thumbnails for style selector
  const stylePreviews = useMemo(() => {
    const previewSeed = "style-preview"
    return (Object.keys(STYLE_CONFIGS) as AvatarStyle[]).map((key) => ({
      key,
      label: STYLE_CONFIGS[key].label,
      svg: createAvatar(STYLE_CONFIGS[key].style, { seed: previewSeed }).toString(),
    }))
  }, [])

  const handleStyleChange = useCallback((style: AvatarStyle) => {
    setSelectedStyle(style)
    setOverrides({})
  }, [])

  const handleRandomize = useCallback(() => {
    setSeed(generateRandomSeed())
    setOverrides({})
  }, [])

  const updateOverride = useCallback((key: string, value: unknown) => {
    setOverrides((prev) => ({ ...prev, [key]: value }))
  }, [])

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      {/* Preview */}
      <div className="flex flex-col items-center gap-3 sm:w-[200px] flex-shrink-0">
        <div
          className="w-[160px] h-[160px] rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200"
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleRandomize}
          className="text-xs bg-transparent"
        >
          <Shuffle className="w-3.5 h-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>

      {/* Controls */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Style selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Style</label>
          <div className="flex gap-2">
            {stylePreviews.map((sp) => (
              <button
                key={sp.key}
                onClick={() => handleStyleChange(sp.key)}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                  selectedStyle === sp.key
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-full overflow-hidden bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: sp.svg }}
                />
                <span className="text-xs mt-1 font-medium text-gray-700">
                  {sp.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Customizer categories */}
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
          {config.categories.map((cat) => (
            <CategoryControl
              key={`${selectedStyle}-${cat.key}`}
              category={cat}
              value={overrides[cat.key]}
              probabilityValue={cat.probabilityKey ? overrides[cat.probabilityKey] : undefined}
              onChange={(val) => updateOverride(cat.key, val)}
              onProbabilityChange={
                cat.probabilityKey
                  ? (val) => updateOverride(cat.probabilityKey!, val)
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface CategoryControlProps {
  category: CategoryConfig
  value: unknown
  probabilityValue?: number
  onChange: (value: unknown) => void
  onProbabilityChange?: (value: number) => void
}

function CategoryControl({
  category,
  value,
  probabilityValue,
  onChange,
  onProbabilityChange,
}: CategoryControlProps) {
  if (category.type === "color") {
    return <ColorSelector category={category} value={value as string[] | undefined} onChange={onChange} />
  }

  if (category.type === "toggle") {
    const isOn = probabilityValue === undefined ? undefined : probabilityValue > 0
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">{category.label}</label>
          <button
            onClick={() => {
              if (onProbabilityChange) {
                onProbabilityChange(isOn ? 0 : 100)
              }
            }}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              isOn === false ? "bg-gray-300" : "bg-blue-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                isOn === false ? "" : "translate-x-4"
              }`}
            />
          </button>
        </div>
      </div>
    )
  }

  // Variant selector with left/right arrows
  return <VariantSelector category={category} value={value as string[] | undefined} onChange={onChange} />
}

function ColorSelector({
  category,
  value,
  onChange,
}: {
  category: CategoryConfig
  value: string[] | undefined
  onChange: (value: string[]) => void
}) {
  const colors = category.colors || []
  const selectedColor = value?.[0]

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {category.label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange([color])}
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              selectedColor === color
                ? "border-blue-600 scale-110"
                : "border-gray-200 hover:border-gray-400"
            }`}
            style={{ backgroundColor: `#${color}` }}
            title={`#${color}`}
          />
        ))}
      </div>
    </div>
  )
}

function VariantSelector({
  category,
  value,
  onChange,
}: {
  category: CategoryConfig
  value: string[] | undefined
  onChange: (value: string[]) => void
}) {
  const variants = category.variants || []
  const selectedVariant = value?.[0]
  const currentIndex = selectedVariant ? variants.indexOf(selectedVariant) : -1

  const goTo = (index: number) => {
    const wrapped = ((index % variants.length) + variants.length) % variants.length
    onChange([variants[wrapped]])
  }

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {category.label}
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => goTo(currentIndex - 1)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-500 min-w-[60px] text-center">
          {currentIndex >= 0 ? currentIndex + 1 : "Auto"} / {variants.length}
        </span>
        <button
          onClick={() => goTo(currentIndex + 1)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
