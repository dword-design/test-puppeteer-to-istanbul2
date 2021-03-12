// Takes in a Puppeteer range object with start and end properties and
// converts it to a V8 range with startOffset, endOffset, and count properties
const convertRange = range => ({
  count: 1,
  endOffset: range.end,
  startOffset: range.start,
})
class PuppeteerToV8 {
  constructor(coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  convertCoverage() {
    // Iterate through coverage info and create IDs
    return this.coverageInfo.map((coverageItem, index) => {
      //console.log(coverageItem)
      return ({
        functions: [
          {
            isBlockCoverage: true,
            ranges: coverageItem.ranges.map(convertRange),
          },
        ],
        originalUrl: coverageItem.originalUrl,
        scriptId: index,
        url: coverageItem.url,//url: `file://${coverageItem.url}`,
      })
    })
  }
}

export default coverageInfo => new PuppeteerToV8(coverageInfo)
