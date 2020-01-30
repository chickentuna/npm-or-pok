const pokemon = require('pokemon')
const fs = require('fs')
const japanese = require('japanese')
const pinyin = require('chinese-to-pinyin')
const hangulRomanization = require('hangul-romanization')
const cyrillicToTranslit = require('cyrillic-to-translit-js')
const removeAccents = require('remove-accents')

const npmNames:string[] = fs.readFileSync('./npmNames.txt').toString().split('\n')
const langs:string[] = ['de', 'en', 'fr', 'ja', 'ko', 'ru', 'zh-Hant']
const both:string[] = []

for (const lang of langs) {
  both.concat(pokemon.all(lang)
    .filter(pok =>
      npmNames.includes(normalize(pok, lang))
    )
  )
}

function normalize (name, lang) {
  let pokeName = name
  if (lang === 'ja') {
    pokeName = japanese.romanize(pokeName)
  } else if (lang === 'zh-Hant') {
    pokeName = pinyin(pokeName, { removeSpace: true, removeTone: true })
  } else if (lang === 'ru') {
    pokeName = cyrillicToTranslit().transform(pokeName)
  } else if (lang === 'ko') {
    pokeName = hangulRomanization.convert(pokeName)
  }

  return removeAccents(pokeName.replace(/ |-/g, '')).toLowerCase()
}

// TODO: both for all languages
export function getPokemon ():string {
  let pokeName:string
  while (pokeName == null || both.includes(pokeName) || pokeName.length > 10) {
    const lang:string = langs[Math.floor(Math.random() * langs.length)]
    pokeName = pokemon.random(lang)
    if (lang === 'ja') {
      pokeName = japanese.romanize(pokeName)
    } else if (lang === 'zh-Hant') {
      pokeName = pinyin(pokeName, { removeSpace: true, removeTone: true })
    } else if (lang === 'ru') {
      pokeName = cyrillicToTranslit().transform(pokeName)
    } else if (lang === 'ko') {
      pokeName = hangulRomanization.convert(pokeName)
    }

    pokeName = removeAccents(pokeName.replace(/ |-/g, '')).toLowerCase()
  }
  return pokeName
}

export function getNpm ():string {
  let npmName
  while (npmName == null || both.includes(npmName)) {
    npmName = npmNames[Math.floor(Math.random() * npmNames.length)]
  }
  return npmName
}
