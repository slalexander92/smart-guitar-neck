<template>
	<div :class="[$style.switch, { [$style.switchOn]: isOn, [$style.disabled]: isDisabled }]"
		:aria-pressed="isOn ? 'true' : 'false'"
		id="toggleSwitch"
		role="button"
		tabindex="0"
		aria-labelledby="toggleSwitch"
		@click="!isDisabled && $emit('toggle')"
		@keydown.space="!isDisabled && $emit('toggle')"
		@keydown.enter="!isDisabled && $emit('toggle')"
	>
		<div :class="isOn ? $style.innerDotOn : $style.innerDot" />
	</div>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';

  defineEmits(['toggle']);

  defineProps({
    isOn: {
      type: Boolean,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" module>
	$switch-size: 16px;
	$dot-margin: 3px;
	$dot-size: $switch-size - (2 * $dot-margin);

	.switch {
		position: relative;
		width: 32px;
		height: $switch-size;
		border-radius: $switch-size;
		background: #c8c8c8;
		cursor: pointer;
		user-select: none;
	}

	.switch:focus {
		outline: 2px solid #000;
		outline-offset: 2px;
	}

	.switchOn {
		background: green;
	}

	.disabled {
		background: #e1e1e1;
		cursor: not-allowed;
	}

	.innerDot,
	.innerDotOn {
		position: absolute;
		top: $dot-margin;
		height: $dot-size;
		width:$dot-size;
		border-radius: 50%;
		background: #fff;
	}

	.innerDot {
		left: $dot-margin;
	}

	.innerDotOn {
		right: $dot-margin;
	}
</style>
