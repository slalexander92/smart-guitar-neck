export const CHROMATIC_SCALE = ['e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#'];

const MAJOR_FORMULA = [2, 2, 1, 2, 2, 2, 1];
const MINOR_FORMULA = [2, 1, 2, 2, 1, 2, 2];

export const MAJOR_SCALE_DEGREES = ['1', '2', '3', '4', '5', '6', '7'];
export const MINOR_SCALE_DEGREES = ['1', '2', '♭3', '4', '5', '♭6', '♭7'];
export const MAJOR_PENTATONIC_SCALE_DEGREES = ['1', '2', '3', '5', '6'];
export const MINOR_PENTATONIC_SCALE_DEGREES = ['1', '♭3', '4', '5', '♭7'];
export const MIXOLYDIAN_SCALE_DEGREES = ['1', '2', '3', '4', '5', '6', '♭7'];

export function buildMajorScale(root) {
	const scale = [];
	let scaleIndex = CHROMATIC_SCALE.indexOf(root.toLowerCase());
	let formulaIndex = 0;

	while (formulaIndex < MAJOR_FORMULA.length) {
		const currentInterval = MAJOR_FORMULA[formulaIndex];
		scale.push(CHROMATIC_SCALE[scaleIndex]);

		scaleIndex += currentInterval;
		formulaIndex++;
	}

	return scale;
}

export function buildMinorScale(root) {
	const formattedRoot = root.toLowerCase();
	const scale = [];
	let scaleIndex = CHROMATIC_SCALE.indexOf(formattedRoot);
	let formulaIndex = 0;

	while (formulaIndex < MINOR_FORMULA.length) {
		const currentInterval = MINOR_FORMULA[formulaIndex];
		scale.push(CHROMATIC_SCALE[scaleIndex]);

		scaleIndex += currentInterval;
		formulaIndex++;
	}

	return scale;
}

export function buildMajorPentatonicScale(root) {
	const scale = buildMajorScale(root).slice();
	scale.splice(6, 1); // remove 7th scale degree
	scale.splice(3, 1); // remove 4th scale degree

	return scale;
}

export function buildMinorPentatonicScale(root) {
	const scale = buildMinorScale(root).slice();
	scale.splice(5, 1); // remove 6th scale degree
	scale.splice(1, 1); // remove 2nd scale degree

	return scale;
}

export function buildMixolydianScale(root) {
	const scale = buildMajorScale(root).slice();
	const seventhScaleDegreeNote = scale[6];
	const flattedSeventh = getFlattedNote(seventhScaleDegreeNote);
	scale.push(flattedSeventh); // add flatted seventh
	scale.splice(6, 1); // remove natural seven

	return scale;
}

function getFlattedNote(note) {
	const indexOfNote = CHROMATIC_SCALE.indexOf(note);

	if (indexOfNote === 0) return CHROMATIC_SCALE[CHROMATIC_SCALE.length - 1];

	return CHROMATIC_SCALE[indexOfNote - 1];
}
