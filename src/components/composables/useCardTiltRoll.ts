import { useMouseInElement } from '@vueuse/core'
import { ref, unref, watchEffect, type ShallowRef } from 'vue'

type UseCardTiltOptions = {
  tiltRollModifier?: number
}

export default (
  cardContainer: Readonly<ShallowRef<HTMLElement | null>>,
  { tiltRollModifier = 10 }: UseCardTiltOptions = {
    tiltRollModifier: 10,
  },
) => {
  const {
    isOutside,

    elementX: x,
    elementY: y,
    elementWidth: width,
    elementHeight: height,
  } = useMouseInElement(cardContainer as unknown as HTMLAnchorElement, {
    handleOutside: false,
    window,
  })
  const tilt = ref(0)
  const roll = ref(0)

  // create tilting effect
  watchEffect(() => {
    if (isOutside.value) {
      tilt.value = 0
      roll.value = 0
      return
    }
    const cardContainerRaw = unref(cardContainer)

    if (cardContainerRaw == null || x.value == null || y.value == null) return

    const tiltValue = (x.value - width.value / 2) / width.value
    const rollValue = -(y.value - height.value / 2) / height.value

    tilt.value = tiltValue * tiltRollModifier
    roll.value = rollValue * tiltRollModifier
  })

  return {
    tilt,
    roll,
  }
}
