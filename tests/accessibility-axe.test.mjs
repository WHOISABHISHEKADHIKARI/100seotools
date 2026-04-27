import puppeteer from 'puppeteer'
import axeCore from 'axe-core'

const URL = process.env.TEST_URL || 'http://localhost:3000/'

;(async () => {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.addScriptTag({ content: axeCore.source })
  const results = await page.evaluate(async () => await window.axe.run(document, { runOnly: ['wcag2aa'] }))
  const serious = (results.violations || []).filter((v) => v.impact === 'serious' || v.impact === 'critical')
  console.log(`Accessibility violations: ${results.violations.length}`)
  if (serious.length) {
    console.log('Serious/Critical issues:')
    serious.slice(0, 10).forEach((v) => console.log(`- ${v.id}: ${v.description}`))
  }
  await browser.close()
  if (serious.length) process.exitCode = 1
  else console.log('Accessibility tests passed')
})()