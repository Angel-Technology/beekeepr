const JOINED_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatJoinedDate = (iso?: string | null): string | undefined => {
  if (!iso) {
    return undefined;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return JOINED_DATE_FORMATTER.format(date);
};
