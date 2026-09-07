export const EDUCATION_CARD_DELAY_MS = 1800;

export function scheduleEducationCard(onReveal: () => void): ReturnType<typeof setTimeout> {
  return setTimeout(onReveal, EDUCATION_CARD_DELAY_MS);
}
