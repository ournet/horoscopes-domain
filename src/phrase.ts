import { HoroscopePeriod, HoroscopeSign } from "./utils";

export interface Phrase {
    id: string
    text: string
    sign: HoroscopeSign
    source: string
    lang: string
    length: number
    period: HoroscopePeriod

    createdAt: string
}

export interface PhraseBuildParams {
    text: string
    lang: string
    sign: HoroscopeSign
    source: string
    period: HoroscopePeriod
    createAt?: string
}
