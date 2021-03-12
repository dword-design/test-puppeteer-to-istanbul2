import clone from 'clone'
import micromatch from 'micromatch'
import P from 'path'

const parsePath = path => {
  let newPath = path
  const webpackPrefix = 'webpack-internal:///./'
  if (path.startsWith(webpackPrefix)) {
    newPath = newPath.substr(webpackPrefix.length)
  } else {
    return undefined
  }
  const paramsIndex = newPath.indexOf('?')
  if (paramsIndex !== -1) {
    newPath = newPath.substr(0, paramsIndex)
  }
  if (micromatch.isMatch(newPath, '.nuxt/**')) {
    return undefined
  }
  return P.resolve(newPath)
}

export default coverageInfo => {
  coverageInfo = clone(coverageInfo)
  for (let i = 0; i < coverageInfo.length; i += 1) {
    const path = parsePath(coverageInfo[i].url)
    coverageInfo[i].originalUrl = coverageInfo[i].url
    coverageInfo[i].url = path
  }
  coverageInfo = coverageInfo.filter(info => info.url !== undefined)
  return coverageInfo
}
