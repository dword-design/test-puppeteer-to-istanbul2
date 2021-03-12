import fs from 'fs-extra'
import P from 'path'
import OutputFiles from './output-files'
import v8toIstanbul from 'v8-to-istanbul'

import PuppeteerToV8 from './puppeteer-to-v8'

const jsonPart = {}
const mergeCoverageData = (obja, objb) => {
  Object.keys(obja).forEach(key => {
    obja[key] = obja[key] || objb[key] ? 1 : 0
  })
  return obja
}

export default {
  write: async (coverageInfo, options = {}) => {
    const storagePath = options.storagePath || '.nyc_output'
    const outFilePath = P.join(storagePath, 'out.json')
    const puppeteerToConverter = OutputFiles(
      coverageInfo
    )
    const puppeteerToV8Info = PuppeteerToV8(
      puppeteerToConverter
    ).convertCoverage()
    await fs.ensureDir(storagePath)
    fs.writeFileSync(outFilePath, '')
    const fd = fs.openSync(outFilePath, 'a')
    await Promise.all(puppeteerToV8Info.map(async jsFile => {
      const script = v8toIstanbul(jsFile.url)
      await script.load()
      script.applyCoverage(jsFile.functions)
      const istanbulCoverage = script.toIstanbul()
      const keys = Object.keys(istanbulCoverage)
      if (jsonPart[keys[0]]) {
        mergeCoverageData(jsonPart[keys[0]].s, istanbulCoverage[keys[0]].s)
      } else {
        jsonPart[keys[0]] = istanbulCoverage[keys[0]]
      }
      jsonPart[keys[0]].originalUrl = jsFile.originalUrl
    }))
    fs.writeSync(fd, '{')
    Object.keys(jsonPart).forEach((url, index, keys) => {
      const data = jsonPart[url]
      const isLastIteration = index === keys.length - 1
      fs.writeSync(
        fd,
        `${JSON.stringify(url)}: ${JSON.stringify(data)}${
          isLastIteration ? '' : ','
        }`
      )
    })
    fs.writeSync(fd, '}')
    fs.closeSync(fd)
  },
}
