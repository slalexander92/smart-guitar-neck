<template>
	<div class="neck" ref="neck">
		<div class="neck-wrapper">
			<div v-for="(frets, root) in activeTuning"
				:class="['string', {'is-filtered': isStringFiltered(root)}]"
				:key="root"
			>
				<span :class="['open-string', {
							'is-root': isRoot(root),
							'is-scale-tone': isScaleTone(root),
							'is-filtered': isNoteFiltered(root),
						}]">
					{{ root }}
				</span>

				<div v-for="(note, fretIndex) in frets"
					:key="note"
					:class="['fret', {
						'should-add-dot': shouldAddDot(root, fretIndex),
						'should-add-double-dot': shouldAddDoubleDot(root, fretIndex),
					}]"
				>
					<div :class="['note', {
							'is-root': isRoot(note),
							'is-scale-tone': isScaleTone(note),
							'is-filtered': isNoteFiltered(note),
						}]"
					>
						{{ note.toUpperCase() }}
					</div>
				</div>
			</div>
		</div>

		<div class="options-row">
			<div class="input-wrapper">
				<label for="key">Key:</label>

				<select v-model="activeKey" name="key">
					<option v-for="key in keyOptions"
						:value="key"
						:key="key"
					>
						{{ key.toUpperCase() }}
					</option>
				</select>
			</div>

			<div class="input-wrapper">
				<label for="scale">Scale:</label>

				<select v-model="selectedScale" name="scale">
					<option v-for="(scale, name) in scaleList"
						:value="name"
						:key="name"
					>
						{{ name }}
					</option>
				</select>
			</div>

			<div class="input-wrapper">
				<label for="string-filter">String Filter:</label>

				<select v-model="selectedStringFilter" name="string-filter">
					<option v-for="(filter, name) in stringFilterList"
						:value="name"
						:key="name"
					>
						{{ name }}
					</option>
				</select>
			</div>

			<div>
				<label for="scale">Scale Degree Filters:</label>

				<div class="radio-row">
					<div v-for="(model, index) in scaleDegreeFilters" :key="model.degree" class="radio-wrapper">
						<label :for="`degree-${model.degree}`" class="radio-label">{{ model.degree }}</label>
						<input v-model="scaleDegreeFilters[index].value" type="checkbox" :id="`degree-${model.degree}`">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, watch } from 'vue';
	import { tunings } from '../constants/tunings';
	import { utilities } from '../utilities';

	const activeKey = ref('e');
	const keyOptions = ref(utilities.CHROMATIC_SCALE.slice(0, 12));
	const selectedScale = ref('major');
	const selectedStringFilter = ref('none');

	const activeTuning = computed(() => tunings.standard);

	const activeScale = computed(() => scaleList.value[selectedScale.value]);

	const activeStringFilter = computed(() => stringFilterList[selectedStringFilter.value]);

	const scaleList = computed(() => {
		return {
			'major': utilities.buildMajorScale(activeKey.value),
			'minor': utilities.buildMinorScale(activeKey.value),
			'major pentatonic': utilities.buildMajorPentatonicScale(activeKey.value),
			'minor pentatonic': utilities.buildMinorPentatonicScale(activeKey.value),
		};
	});

	const scaleDegreeFilters = ref(setupScaleDegreeModel(activeScale.value));

	function setupScaleDegreeModel(scale) {
		const scaleDegreeMap = {
			'major': utilities.MAJOR_SCALE_DEGREES,
			'minor': utilities.MINOR_SCALE_DEGREES,
			'major pentatonic': utilities.MAJOR_PENTATONIC_SCALE_DEGREES,
			'minor pentatonic': utilities.MINOR_PENTATONIC_SCALE_DEGREES,
		};

		const activeScaleDegrees = scaleDegreeMap[selectedScale.value];

		return (scale || []).reduce((accum, val, index) => {
			accum.push({
				note: activeScale.value[index],
				degree: activeScaleDegrees[index],
				value: true,
			});

			return accum;
		}, [])
	}

	watch(activeScale, scale => {
		scaleDegreeFilters.value = setupScaleDegreeModel(scale);
	});

	const stringFilterList = { // assumes 6 string guitar
		'none': null,
		'top 3': [0, 1, 2],
		'2, 3, 4': [1, 2, 3],
		'3, 4, 5': [2, 3, 4],
		'bottom 3': [3, 4, 5],
	};

	function isRoot(note) {
		return note.toLowerCase() === activeKey.value;
	}

	function isScaleTone(note) {
		const scale = activeScale.value || [];

		return scale.includes(note.toLowerCase());
	}

	function isStringFiltered(stringRoot) {
		if (!activeStringFilter.value) return;

		const currentTuningStrings = Object.keys(activeTuning.value);
		const filteredStrings = (activeStringFilter.value || []).map(i => currentTuningStrings[i]);

		return !filteredStrings.includes(stringRoot);
	}

	const filteredNotes = computed(() => {
		return (scaleDegreeFilters.value || [])
			.filter(model => !model.value)
			.map(model => model.note);
	});

	function isNoteFiltered(note) {
		return (filteredNotes.value || []).includes(note);
	}

	function shouldAddDot(root, index) {
		return root === 'E' && [3, 5, 7, 9, 15, 17, 19].includes(index + 1);
	}

	function shouldAddDoubleDot(root, index) {
		return root === 'E' && index === 11;
	}
</script>

<style lang="scss">
	$blue: #0e31a9;
	$red: #d40606;

	.neck {
		max-width: 85%;
		margin: auto;

		* {
			font-weight: bold;
		}
	}

	.neck-wrapper {
		margin: 10px 0;
		padding: 10px 0;
		border-top: 5px solid black;
		border-bottom: 5px solid black;
	}

	.open-string {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		padding: 0 15px;
		margin-right: 10px;
		border: 1px solid transparent;

		&.is-scale-tone {
			border-radius: 100%;
			border: 1px solid $blue;
		}

		&.is-root {
			border-radius: 100%;
			border: 1px solid $red;
		}

		&.is-filtered {
			border: 1px solid transparent;
		}

		.is-filtered & {
			border: 1px solid transparent;
		}
	}

	.string {
		position: relative;
		display: flex;
		padding-bottom: 2px;

		&::after {
			content: '';
			position: absolute;
			background-color: black;
			top: 50%;
			left: 0;
			width: 100%;
			height: 1px;
			z-index: 1;
			transform: translate(40px, -50%);
		}
	}

	.fret {
		position: relative;
		display: flex;
		border-left: 2px solid gray;
		height: 100%;
		padding-left: 12px;
		padding-right: 12px;

		&.should-add-dot {
			&::before {
				content: '';
				position: absolute;
				top: 10px;
				left: 10px;
				height: 5px;
				width: 5px;
				background-color: black;
				border-radius: 100rem;
				transform: translate(15px, 40px);
			}
		}

		&.should-add-double-dot {
			&::before {
				content: '';
				position: absolute;
				top: 10px;
				left: 10px;
				height: 5px;
				width: 5px;
				background-color: black;
				border-radius: 100rem;
				transform: translate(8px, 40px);
			}

			&::after {
				content: '';
				position: absolute;
				top: 10px;
				left: 10px;
				height: 5px;
				width: 5px;
				background-color: black;
				border-radius: 100rem;
				transform: translate(20px, 40px);
			}
		}
	}

	.note {
		visibility: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 30px;
		width: 30px;
		z-index: 2;
		border-radius: 100%;
		border: 1px solid black;
		background-color: gray;
		color: white;

		&.is-scale-tone {
			visibility: visible;
			background-color: $blue;
		}

		&.is-root {
			visibility: visible;
			background-color: $red;
		}

		&.is-filtered {
			visibility: hidden;
		}

		.is-filtered & {
			visibility: hidden;
		}
	}

	.options-row {
		display: flex;
	}

	.input-wrapper {
		display: flex;
		flex-direction: column;

		&:not(:last-of-type) {
			margin-right: 12px;
		}
	}

	.radio-row {
		display: flex;
	}

	.radio-wrapper {
		display: flex;
		align-items: center;
		margin-right: 8px;
	}

	.radio-label {
		margin-right: 2px;
	}
</style>
