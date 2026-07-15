import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonDe from './locales/de/common.json'
import itemsDe from './locales/de/items.json'
import mechanicsDe from './locales/de/mechanics.json'
import validationDe from './locales/de/validation.json'

import commonEn from './locales/en/common.json'
import itemsEn from './locales/en/items.json'
import mechanicsEn from './locales/en/mechanics.json'
import validationEn from './locales/en/validation.json'

void i18n.use(initReactI18next).init({
  resources: {
    de: { common: commonDe, items: itemsDe, mechanics: mechanicsDe, validation: validationDe },
    en: { common: commonEn, items: itemsEn, mechanics: mechanicsEn, validation: validationEn }
  },
  lng: 'de',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false }
})

export default i18n
