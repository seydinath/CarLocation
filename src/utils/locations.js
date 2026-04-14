export const bookingLocations = [
  { value: 'almadies', label: 'Dakar - Almadies' },
  { value: 'point-e', label: 'Dakar - Point E' },
  { value: 'sacre-coeur', label: 'Dakar - Sacré-Coeur' }
];

export const getLocationLabel = (location) => {
  return bookingLocations.find((entry) => entry.value === location)?.label || location || '';
};