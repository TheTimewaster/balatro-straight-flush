import { type InjectionKey, type Ref } from 'vue'

export const IS_USING_FOUR_FINGERS = Symbol('isUsingFourFingers') as InjectionKey<Ref<boolean>>
export const IS_USING_SHORTCUT = Symbol('isUsingShortcut') as InjectionKey<Ref<boolean>>
export const IS_USING_SMEARED_JOKER = Symbol('isUsingSmearedJoker') as InjectionKey<Ref<boolean>>
