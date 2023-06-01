const MAP = {
  'a#': 'b♭',
  'c#': 'd♭',
  'd#': 'e♭',
  'f#': 'g♭',
  'g#': 'a♭',
};

const FLAT_MAP = Object.entries(MAP).reduce((accum, [key, value]) => {
  accum[value] = key;

  return accum;
}, {});

export function convertToFlats(note) {
  return MAP[note] || note;
}

export function convertToSharps(note) {
  return FLAT_MAP[note] || note;
}
