export const INHERIT_TTL_VALUE = "__inherit";
export const NEVER_TTL_SECONDS = -1;

export const TTL_PRESETS = [
  { label: "1日", value: 60 * 60 * 24 },
  { label: "3日", value: 60 * 60 * 24 * 3 },
  { label: "7日", value: 60 * 60 * 24 * 7 },
  { label: "14日", value: 60 * 60 * 24 * 14 },
  { label: "30日", value: 60 * 60 * 24 * 30 },
  { label: "無期限", value: NEVER_TTL_SECONDS },
] as const;

export function formatTtlSeconds(ttlSeconds: number | null | undefined, inheritLabel = "inherit") {
  if (ttlSeconds == null) return inheritLabel;
  if (ttlSeconds === NEVER_TTL_SECONDS) return "無期限";

  const preset = TTL_PRESETS.find((option) => option.value === ttlSeconds);
  if (preset) return preset.label;

  return `${ttlSeconds}s`;
}
