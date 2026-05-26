export function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export function formatYear(year) {
  if (!year) return 'Present'
  return String(year)
}
