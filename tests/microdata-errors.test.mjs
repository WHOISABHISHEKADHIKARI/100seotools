import puppeteer from 'puppeteer'

const candidates = [
  process.env.TEST_URL,
  'http://127.0.0.1:3000/',
  'http://localhost:3000/',
  'http://127.0.0.1:4000/',
  'http://localhost:4000/',
  'https://www.100seotools.com/',
  'https://www.100seotools.com/blog',
  'https://www.100seotools.com/tools'
].filter(Boolean)

async function tryGoto(page, urls) {
  for (const u of urls) {
    try {
      await page.goto(u, { waitUntil: 'networkidle0', timeout: 15000 })
      return u
    } catch (e) {
      console.log(`Connection attempt failed: ${u}`)
    }
  }
  throw new Error('No reachable URL candidates')
}

;(async () => {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  const usedUrl = await tryGoto(page, candidates)
  console.log(`Testing URL: ${usedUrl}`)
  await page.waitForSelector('body', { timeout: 15000 }).catch(() => {})
  await new Promise((r) => setTimeout(r, 1500))
  const microdataAttrs = await page.$$eval('[itemscope],[itemtype],[itemprop]', (els) => els.length)
  const ldScripts = await page.$$eval('script[type="application/ld+json"]', (els) => els.length)
  console.log(`Microdata attributes found: ${microdataAttrs}`)
  console.log(`JSON-LD scripts found: ${ldScripts}`)
  if (microdataAttrs > 0) {
    console.log('Microdata present; prefer JSON-LD to avoid conflicts')
    process.exitCode = 1
  } else {
    console.log('No microdata conflicts detected')
  }
  await browser.close()
})()
