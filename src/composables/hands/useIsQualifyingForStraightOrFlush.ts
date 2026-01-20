import type { PlayingHand } from '@/types'
import { computed, unref, type MaybeRefOrGetter } from 'vue'
import useJokerState from '../useJokerState'

export default (playingHand: MaybeRefOrGetter<PlayingHand>) => {
  const { isUsingFourFingers } = useJokerState()

  const isQualifyingForEvaluation = computed(() => {
    const playingHandRaw = unref(playingHand)

    if (isUsingFourFingers.value) {
      return playingHandRaw.length >= 4
    }

    return playingHandRaw.length === 5
  })

  return isQualifyingForEvaluation
}
