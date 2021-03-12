import puppeteer from '@dword-design/puppeteer'
import { Builder, Nuxt } from 'nuxt'
import puppeteerToIstanbul from './puppeteer-istanbul'

it('works', async () => {
  const nuxt = new Nuxt({
    build: { quiet: false },
    createRequire: 'native',
    dev: true,
  })
  await new Builder(nuxt).build()
  await nuxt.listen()
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.coverage.startJSCoverage()
  await page.goto('http://localhost:3000')
  await page.waitForSelector('.foo')
  const coverage = await page.coverage.stopJSCoverage()
  await puppeteerToIstanbul.write(coverage)
  await browser.close()
  await nuxt.close()
})
