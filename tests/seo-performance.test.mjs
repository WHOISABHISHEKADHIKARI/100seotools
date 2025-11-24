import puppeteer from 'puppeteer'

const candidates = [
  process.env.TEST_URL,
  'http://127.0.0.1:3000/',
  'http://localhost:3000/',
  'http://127.0.0.1:4000/',
  'http://localhost:4000/',
  'https://www.100seotools.com/'
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
  await page.waitForFunction(() => document.readyState === 'complete').catch(()=>{})
  await page.waitForSelector('h1', { timeout: 15000 }).catch(()=>{})
  const title = await page.evaluate(() => document.title || '')
  const hasMetaDesc = await page.evaluate(() => !!document.querySelector('meta[name="description"]'))
  const hasCanonical = await page.evaluate(() => !!document.querySelector('link[rel="canonical"]'))
  const hasH1 = await page.evaluate(() => !!document.querySelector('h1'))
  const internalLinks = await page.evaluate(() => Array.from(document.querySelectorAll('a[href^="/"]')).length)
  if (!title || !hasMetaDesc || !hasCanonical || !hasH1) {
    console.log('Missing core SEO elements')
    process.exitCode = 1
  } else {
    console.log(`Title: ${title}`)
    console.log(`Internal links: ${internalLinks}`)
    console.log('SEO performance checks passed')
  }
  await browser.close()
})()
