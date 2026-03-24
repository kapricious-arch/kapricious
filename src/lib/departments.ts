export const normalizeDepartmentCode = (value: string | null | undefined) => {
  const normalized = (value || "").trim().toUpperCase();
  if (normalized === "RAE") return "RA";
  if (normalized === "SF") return "SFE";
  return normalized;
};

export const formatDepartmentOptionLabel = (
  name: string | null | undefined,
  code: string | null | undefined,
) => {
  const normalizedCode = normalizeDepartmentCode(code);
  return name ? `${name} (${normalizedCode})` : normalizedCode;
};
