// Point the browser-tab icon at a given image URL (e.g. the hero photo).
// Falls back to the static /favicon.svg in index.html when url is empty.
export function setFavicon(url) {
  if (!url) return
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.removeAttribute('type') // was image/svg+xml; let the browser infer jpg/png
  link.href = url
}
