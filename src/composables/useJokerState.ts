import { IS_USING_FOUR_FINGERS, IS_USING_SHORTCUT, IS_USING_SMEARED_JOKER } from '@/symbols'
import { inject, ref } from 'vue'

export default () => {
  const isUsingFourFingers = inject(IS_USING_FOUR_FINGERS, ref(false))
  const isUsingShortcut = inject(IS_USING_SHORTCUT, ref(false))
  const isUsingSmearedJoker = inject(IS_USING_SMEARED_JOKER, ref(false))

  return {
    isUsingFourFingers,
    isUsingShortcut,
    isUsingSmearedJoker,
  }
}
