import { IS_USING_FOUR_FINGERS, IS_USING_SHORTCUT, IS_USING_SMEARED_JOKER } from '@/symbols'
import { ref, type Plugin } from 'vue'

const JokerStatePlugin: Plugin = {
  install(app) {
    const isUsingFourFingers = ref(false)
    const isUsingShortcut = ref(false)
    const isUsingSmearedJoker = ref(false)

    app.provide(IS_USING_FOUR_FINGERS, isUsingFourFingers)
    app.provide(IS_USING_SHORTCUT, isUsingShortcut)
    app.provide(IS_USING_SMEARED_JOKER, isUsingSmearedJoker)
  },
}

export default JokerStatePlugin
