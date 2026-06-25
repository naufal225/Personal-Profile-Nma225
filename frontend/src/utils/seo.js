// Lightweight, dependency-free document <head> manager for the single public
// route. Mirrors the setFavicon util: create-or-update tags by selector.

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function applySeo({ title, description, image, url } = {}) {
  if (title) document.title = title

  upsertMeta('name', 'description', description)

  // Open Graph
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:image', image)
  upsertMeta('property', 'og:url', url || (typeof window !== 'undefined' ? window.location.href : undefined))

  // Twitter
  upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', image)
}
