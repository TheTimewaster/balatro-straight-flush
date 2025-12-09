import type { PlayingHand } from '@/types'
import { useUrlSearchParams } from '@vueuse/core'
import { onMounted, ref, watch, type MaybeRef, type Ref } from 'vue'

export default (playingHand: Ref<PlayingHand>) => {
  const isUsingFourFingers = ref(false)
  const isUsingShortcut = ref(false)
  const isUsingSmearedJoker = ref(false)

  const params = useUrlSearchParams('hash')
  watch(isUsingFourFingers, (newVal) => {
    params['four-fingers'] = newVal ? '1' : '0'
  })
  watch(isUsingShortcut, (newVal) => {
    params['shortcut'] = newVal ? '1' : '0'
  })
  watch(isUsingSmearedJoker, (newVal) => {
    params['smeared-joker'] = newVal ? '1' : '0'
  })
  watch(playingHand, (newHand) => {
    const handParam = newHand.map(([suit, rank]) => `${suit}-${rank}`).join(',')
    params['hand'] = handParam
  })

  onMounted(() => {
    const handParam = params['hand'] as string | undefined
    if (handParam) {
      const cards = handParam.split(',').map((pair) => {
        const [suitStr, rankStr] = pair.split('-')
        return [Number(suitStr), Number(rankStr)] as [number, number]
      })

      playingHand.value = cards
    } else {
      playingHand.value = []
    }

    isUsingFourFingers.value = params['four-fingers'] === '1'
    isUsingShortcut.value = params['shortcut'] === '1'
    isUsingSmearedJoker.value = params['smeared-joker'] === '1'
  })

  return {
    isUsingFourFingers,
    isUsingShortcut,
    isUsingSmearedJoker,
  }
}
