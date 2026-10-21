import JSZip from 'jszip'

const MORPH_NAMES = ['!!morph_orb_1', '!!morph_orb_2', '!!morph_accent_bar', '!!morph_card_bg']

const ensureMorphNamespace = (xml: string): string =>
  xml.includes('xmlns:p159')
    ? xml
    : xml.replace('<p:sld ', '<p:sld xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2018/8/main" ')

const applyMorphNames = (xml: string): string => {
  let morphIndex = 0
  return xml.replace(/<p:cNvPr([^>]*?)name="([^"]+)"([^>]*?)\/>/g, (full, before: string, name: string, after: string) => {
    if (morphIndex >= MORPH_NAMES.length) {
      return full
    }

    if (/title|subtitle|content placeholder/i.test(name)) {
      return full
    }

    const targetName = MORPH_NAMES[morphIndex]
    morphIndex += 1
    return `<p:cNvPr${before}name="${targetName}"${after}/>`
  })
}

const buildTimingXml = (xml: string): string => {
  const shapeIds = [...xml.matchAll(/<p:cNvPr\s+id="(\d+)"/g)]
    .map((match) => Number.parseInt(match[1], 10))
    .filter((id) => id > 1)
    .slice(0, 8)

  if (shapeIds.length === 0) {
    return ''
  }

  let currentId = 40
  const animations = shapeIds
    .map((shapeId, index) => {
      const delay = index * 250
      const fadeId = currentId
      const fadeCTnId = currentId + 1
      const floatCTnId = currentId + 3
      currentId += 4

      return `<p:par><p:cTn id="${fadeId}" fill="hold"><p:stCondLst><p:cond delay="${delay}"/></p:stCondLst><p:childTnLst><p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${fadeCTnId}" dur="500" fill="hold"/><p:tgtEl><p:spTgt spid="${shapeId}"/></p:tgtEl></p:cBhvr></p:animEffect><p:animMotion origin="layout" path="M 0 0 L 0 -0.15"><p:cBhvr additive="base"><p:cTn id="${floatCTnId}" dur="500" fill="hold"/><p:tgtEl><p:spTgt spid="${shapeId}"/></p:tgtEl></p:cBhvr><p:by x="0" y="-228600"/></p:animMotion></p:childTnLst></p:cTn></p:par>`
    })
    .join('')

  return `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${animations}</p:childTnLst></p:cTn></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`
}

const injectTransitionAndTiming = (xml: string): string => {
  const withoutTransition = xml.replace(/<p:transition[\s\S]*?<\/p:transition>/g, '')
  const withoutTiming = withoutTransition.replace(/<p:timing[\s\S]*?<\/p:timing>/g, '')
  const transition = '<p:transition spd="slow" advClick="1"><p159:morph option="byObject"/></p:transition>'
  const timing = buildTimingXml(withoutTiming)

  if (withoutTiming.includes('<p:clrMapOvr')) {
    return withoutTiming.replace('<p:clrMapOvr', `${transition}${timing}<p:clrMapOvr`)
  }

  return withoutTiming.replace('</p:sld>', `${transition}${timing}</p:sld>`)
}

export const injectCinematicAnimations = async (buffer: ArrayBuffer): Promise<ArrayBuffer> => {
  const zip = await JSZip.loadAsync(buffer)
  const slidePaths = Object.keys(zip.files).filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))

  for (const path of slidePaths) {
    const file = zip.file(path)
    if (!file) {
      continue
    }

    const xml = await file.async('string')
    const withNamespace = ensureMorphNamespace(xml)
    const withMorphNames = applyMorphNames(withNamespace)
    const withAnimation = injectTransitionAndTiming(withMorphNames)

    zip.file(path, withAnimation)
  }

  return zip.generateAsync({ type: 'arraybuffer' })
}
