export default function scrollToEventList(behavior: ScrollBehavior = 'smooth') {
  if (typeof document === 'undefined') {
    return;
  }

  requestAnimationFrame(() => {
    document.getElementById('event-list')?.scrollIntoView({ behavior, block: 'start' });
  });
}
