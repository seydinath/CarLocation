const fcfaFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0
});

export function formatFcfa(value) {
  return `${fcfaFormatter.format(Math.round(value))} F CFA`;
}

export function formatFcfaPlus(value) {
  return `+${formatFcfa(value)}`;
}
