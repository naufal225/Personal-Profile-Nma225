import { getTechIcon } from '../../utils/techIcons'

export default function IconDisplay({ icon, name, size = 18 }) {
  if (!icon) {
    return getTechIcon(name, size)
  }

  const trimmed = icon.trim()

  // SVG markup
  if (trimmed.startsWith('<svg')) {
    return (
      <div
        className="text-foreground [&_svg]:w-full [&_svg]:h-full"
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    )
  }

  // Image URL (http, https, or /storage/)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return (
      <img
        src={trimmed}
        alt={name}
        style={{ width: size, height: size }}
        className="object-contain"
      />
    )
  }

  // Text/emoji fallback
  return (
    <span style={{ fontSize: `${size}px`, lineHeight: 1 }} className="flex items-center justify-center">
      {trimmed}
    </span>
  )
}
