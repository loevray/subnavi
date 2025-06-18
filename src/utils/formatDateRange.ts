import formatUtcToKst from './formatUtcToKst';

export default function formatDateRange(
  startDateTime: string,
  endDateTime: string
) {
  const startDate = formatUtcToKst(startDateTime);
  const endDate = formatUtcToKst(endDateTime);

  return {
    start: `${startDate.year}.${startDate.month}.${startDate.day}`,
    end: `${endDate.year}.${endDate.month}.${endDate.day}`,
  } as const;
}
