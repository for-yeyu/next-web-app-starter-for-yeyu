const timeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'medium',
})

export function formatTime(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '--'
  }

  return timeFormatter.format(value)
}
