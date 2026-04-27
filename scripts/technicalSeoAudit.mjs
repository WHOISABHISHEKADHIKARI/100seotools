import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import puppeteer from 'puppeteer'
import { jsPDF } from 'jspdf'

import { getBaseUrl } from '../lib/site.js'

const ORIGIN = process.env.START_URL || getBaseUrl()
const MAX_PAGES = Number(process.env.MAX_PAGES || 150)
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 20000)
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 300)
const REPORTS_ROOT = path.resolve('docs','Reports')
const FOLDERS = {
  Performance: path.join(REPORTS_ROOT,'Performance'),
  Mobile: path.join(REPORTS_ROOT,'Mobile'),
  Security: path.join(REPORTS_ROOT,'Security'),
  CrawlIndex: path.join(REPORTS_ROOT,'CrawlIndex'),
  Summary: path.join(REPORTS_ROOT,'Summary')
}

function stamp(){const d=new Date();const y=String(d.getFullYear());const m=String(d.getMonth()+1).padStart(2,'0');const da=String(d.getDate()).padStart(2,'0');const h=String(d.getHours()).padStart(2,'0');const mi=String(d.getMinutes()).padStart(2,'0');const s=String(d.getSeconds()).padStart(2,'0');return `${y}${m}${da}_${h}${mi}${s}`}
function escapeCsv(v){if(v===undefined||v===null)return '';const s=String(v).replace(/\r?\n/g,' ');return /[",]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
async function fetchWithTiming(url){const c=new AbortController();const t=setTimeout(()=>c.abort(),TIMEOUT_MS);const start=performance.now();try{const res=await fetch(url,{signal:c.signal,redirect:'follow'});const ms=Math.round(performance.now()-start);const ct=res.headers.get('content-type')||'';const text=ct.includes('text/html')?await res.text():'';clearTimeout(t);return{status:res.status,ms:ms,contentType:ct,text:text,headers:Object.fromEntries(res.headers.entries())}}catch(err){clearTimeout(t);return{status:0,ms:Math.round(performance.now()-start),contentType:'',text:'',error:String(err)}}}
async function readRobots(){try{const {status,text}=await fetchWithTiming(new URL('/robots.txt',ORIGIN).toString());const rules={disallow:[],allow:[],sitemap:[]};if(status>=200&&status<400&&text){for(const line of text.split(/\r?\n/)){const l=line.trim();if(!l||l.startsWith('#'))continue;const m=l.match(/^(User-agent|Disallow|Allow|Sitemap):\s*(.*)$/i);if(m){const k=m[1].toLowerCase();const v=m[2].trim();if(k==='disallow')rules.disallow.push(v);else if(k==='allow')rules.allow.push(v);else if(k==='sitemap')rules.sitemap.push(v)}}}return{status,rules}}catch{return{status:0,rules:{disallow:[],allow:[],sitemap:[]}}}}
function blockedByRobots(pathname,robots){return robots.disallow.some((r)=>r&&pathname.startsWith(r))}
function normalize(u){try{const url=new URL(u,ORIGIN);url.hash='';if(url.pathname.length>1&&url.pathname.endsWith('/')){url.pathname=url.pathname.replace(/\/+$/,'')}return url.toString()}catch{return null}}
function isSameOrigin(u){try{return new URL(u,ORIGIN).origin===new URL(ORIGIN).origin}catch{return false}}
function extractLinks(html,base){const hrefs=new Set();const re=/href\s*=\s*"([^"]+)"|href\s*=\s*'([^']+)'|href\s*=\s*([^\s>]+)/gi;let m;while((m=re.exec(html))!==null){const raw=m[1]||m[2]||m[3];if(!raw)continue;const tr=raw.trim();if(tr.startsWith('#')||tr.startsWith('mailto:')||tr.startsWith('tel:')||tr.startsWith('javascript:'))continue;try{const u=new URL(tr,base).toString();hrefs.add(normalize(u))}catch{}}return[...hrefs].filter(Boolean)}
async function parseSitemap(){try{const {status,text}=await fetchWithTiming(new URL('/sitemap.xml',ORIGIN).toString());if(status>=200&&text){const urls=[...text.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m=>m[1].trim());return urls.filter(u=>isSameOrigin(u)).slice(0,50)}return[]}catch{return[]}}
async function runPSI(url,strategy){try{const key=process.env.PAGESPEED_API_KEY?`&key=${process.env.PAGESPEED_API_KEY}`:'';const api=`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}${key}`;const r=await fetchWithTiming(api);if(r.status===200&&r.text){const j=JSON.parse(r.text);const lr=j.lighthouseResult||{};const audits=lr.audits||{};const perf=lr.categories?.performance?.score?Math.round(lr.categories.performance.score*100):null;const lcp=audits['largest-contentful-paint']?.numericValue||null;const cls=audits['cumulative-layout-shift']?.numericValue||null;const fid=audits['max-potential-fid']?.numericValue||null;return{perf,lcp,cls,fid}}return{perf:null,lcp:null,cls:null,fid:null}}catch{return{perf:null,lcp:null,cls:null,fid:null}}}
async function runSSLLabs(host){try{const start=`https://api.ssllabs.com/api/v3/analyze?host=${host}`;await fetchWithTiming(start);for(let i=0;i<10;i++){await new Promise(r=>setTimeout(r,5000));const r=await fetchWithTiming(start);if(r.status===200&&r.text){const j=JSON.parse(r.text);if(j.status==='READY'||j.status==='ERROR'){const endpoints=j.endpoints||[];const grade=endpoints[0]?.grade||null;return{status:j.status,grade:grade}}}}return{status:'TIMEOUT',grade:null}}catch{return{status:'ERROR',grade:null}}}
async function mobileChecks(browser,url,tag,ua,vp){const page=await browser.newPage();await page.setUserAgent(ua);await page.setViewport(vp);const resp=await page.goto(url,{waitUntil:'networkidle0',timeout:TIMEOUT_MS});const status=resp?.status()||0;const hasViewport=await page.evaluate(()=>!!document.querySelector('meta[name="viewport"]'));const issues=await page.evaluate(()=>{const nodes=Array.from(document.querySelectorAll('a,button,[role="button"],input,textarea'));let small=0;let fontSmall=0;for(const n of nodes){const r=n.getBoundingClientRect();if(Math.min(r.width,r.height)<48)small++;const fs=parseFloat(getComputedStyle(n).fontSize||'0');if(fs<12)fontSmall++}return{tapTargetsTooSmall:small,fontTooSmall:fontSmall}});const shot=path.join(FOLDERS.Mobile,`Mobile_${tag}_${stamp()}.png`);await page.screenshot({path:shot,fullPage:true});await page.close();return{status,hasViewport,issues,shot}}
async function securityHeaders(url){const r=await fetchWithTiming(url);const h=r.headers||{};return{hsts:!!h['strict-transport-security'],csp:!!h['content-security-policy'],xcto:!!h['x-content-type-options'],xfo:!!h['x-frame-options'],ct:!!h['content-type'],mixedContent:/(http:\/\/)/i.test(r.text||'')}}
async function crawl(){const robots=(await readRobots()).rules;const queue=[normalize(ORIGIN)];const visited=new Set();const pages=[];while(queue.length&&pages.length<MAX_PAGES){const u=queue.shift();if(!u||visited.has(u))continue;visited.add(u);const {status,ms,contentType,text}=await fetchWithTiming(u);pages.push({url:u,status,ms,contentType});if(status>=200&&String(contentType).includes('text/html')&&!blockedByRobots(new URL(u).pathname,robots)){const links=extractLinks(text,u).filter(l=>isSameOrigin(l));for(const l of links){if(!visited.has(l))queue.push(l)} }await new Promise(r=>setTimeout(r,REQUEST_DELAY_MS))}return{robots,pages}}
function pdf(file,title,lines){const doc=new jsPDF({unit:'pt',format:'a4'});let y=40;doc.setFontSize(16);doc.text(title,40,y);y+=24;doc.setFontSize(10);for(const s of lines){doc.text(String(s),40,y);y+=14;if(y>780){doc.addPage();y=40}}const buf=doc.output('arraybuffer');return writeFile(file,Buffer.from(buf))}
async function run(){for(const p of Object.values(FOLDERS)){await mkdir(p,{recursive:true})}
const host=new URL(ORIGIN).hostname
const sitemapUrls=await parseSitemap()
const critical=[normalize(ORIGIN),...sitemapUrls.slice(0,20)].filter(Boolean)
const psiRows=[]
for(const u of critical){const mobile=await runPSI(u,'mobile');const desktop=await runPSI(u,'desktop');psiRows.push({url:u,perfMobile:mobile.perf,lcpMobile:mobile.lcp,clsMobile:mobile.cls,fidMobile:mobile.fid,perfDesktop:desktop.perf,lcpDesktop:desktop.lcp,clsDesktop:desktop.cls,fidDesktop:desktop.fid});await new Promise(r=>setTimeout(r,REQUEST_DELAY_MS))}
const perfCsvHeaders=['url','perfMobile','lcpMobile','clsMobile','fidMobile','perfDesktop','lcpDesktop','clsDesktop','fidDesktop']
const perfCsvLines=[perfCsvHeaders.join(',')]
for(const r of psiRows){perfCsvLines.push(perfCsvHeaders.map(h=>escapeCsv(r[h])).join(','))}
const st=stamp()
await writeFile(path.join(FOLDERS.Performance,`PSI_${st}.csv`),perfCsvLines.join('\n'),'utf8')
await pdf(path.join(FOLDERS.Performance,`PSI_${st}.pdf`),'PageSpeed Insights Summary',[`Origin: ${ORIGIN}`,`Pages: ${psiRows.length}`,`Target Mobile >90`])
const browser=await puppeteer.launch({headless:'new',defaultViewport:{width:390,height:844}})
const devices=[{tag:'iPhone14_390x844',ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',vp:{width:390,height:844}},{tag:'Pixel7_412x915',ua:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Mobile Safari/537.36',vp:{width:412,height:915}},{tag:'iPad_768x1024',ua:'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',vp:{width:768,height:1024}}]
const mobileRows=[]
for(const u of critical.slice(0,10)){for(const d of devices){const m=await mobileChecks(browser,u,d.tag,d.ua,d.vp);mobileRows.push({url:u,device:d.tag,status:m.status,hasViewport:m.hasViewport,tapTargetsTooSmall:m.issues.tapTargetsTooSmall,fontTooSmall:m.issues.fontTooSmall,screenshot:m.shot});await new Promise(r=>setTimeout(r,REQUEST_DELAY_MS))}}
await browser.close()
const mobileCsvHeaders=['url','device','status','hasViewport','tapTargetsTooSmall','fontTooSmall','screenshot']
const mobileCsv=[mobileCsvHeaders.join(',')]
for(const r of mobileRows){mobileCsv.push(mobileCsvHeaders.map(h=>escapeCsv(r[h])).join(','))}
await writeFile(path.join(FOLDERS.Mobile,`Mobile_${st}.csv`),mobileCsv.join('\n'),'utf8')
await pdf(path.join(FOLDERS.Mobile,`Mobile_${st}.pdf`),'Mobile Usability Summary',[`Origin: ${ORIGIN}`,`Pages tested: ${new Set(mobileRows.map(r=>r.url)).size}`,`Screenshots saved under Mobile`])
const ssl=await runSSLLabs(host)
const secRows=[]
for(const u of [normalize(ORIGIN),...sitemapUrls.slice(0,10)]){secRows.push(Object.assign({url:u},await securityHeaders(u)));await new Promise(r=>setTimeout(r,REQUEST_DELAY_MS))}
const secCsvHeaders=['url','hsts','csp','xcto','xfo','ct','mixedContent']
const secCsv=[secCsvHeaders.join(',')]
for(const r of secRows){secCsv.push(secCsvHeaders.map(h=>escapeCsv(r[h])).join(','))}
await writeFile(path.join(FOLDERS.Security,`Security_${st}.csv`),secCsv.join('\n'),'utf8')
await pdf(path.join(FOLDERS.Security,`Security_${st}.pdf`),'Security Summary',[`Origin: ${ORIGIN}`,`SSL Labs: ${ssl.status} ${ssl.grade||''}`])
const crawled=await crawl()
const broken=crawled.pages.filter(p=>p.status>=400)
const crawlCsvHeaders=['url','status','ms','contentType']
const crawlCsv=[crawlCsvHeaders.join(',')]
for(const p of crawled.pages){crawlCsv.push(crawlCsvHeaders.map(h=>escapeCsv(p[h])).join(','))}
await writeFile(path.join(FOLDERS.CrawlIndex,`Crawl_${st}.csv`),crawlCsv.join('\n'),'utf8')
const robotsSummary=[`Origin: ${ORIGIN}`,`Disallow: ${(crawled.robots.disallow||[]).join(' ')}`,`Sitemap: ${(crawled.robots.sitemap||[]).join(' ')}`,`Broken links: ${broken.length}`]
await pdf(path.join(FOLDERS.CrawlIndex,`Crawl_${st}.pdf`),'Crawlability & Indexation',robotsSummary)
const recs=[]
const avg200=Math.round(crawled.pages.filter(p=>p.status===200).reduce((a,b)=>a+b.ms,0)/Math.max(1,crawled.pages.filter(p=>p.status===200).length))
if(avg200>3000)recs.push('Reduce response times: cache, CDN, optimize server and payloads')
if(psiRows.filter(r=>r.perfMobile!==null&&r.perfMobile<90).length)recs.push('Improve mobile PSI: optimize images, inline critical CSS, defer non-critical JS, preconnect')
if(mobileRows.filter(r=>r.tapTargetsTooSmall>0).length)recs.push('Increase tap target sizes to >=48x48px and adjust spacing')
if(mobileRows.filter(r=>!r.hasViewport).length)recs.push('Add meta viewport for mobile scaling')
if(secRows.filter(r=>!r.hsts).length)recs.push('Enable HSTS with preload for HTTPS enforcement')
if(secRows.filter(r=>r.mixedContent).length)recs.push('Eliminate mixed content; serve all assets via HTTPS')
const summaryPdfLines=[`Origin: ${ORIGIN}`,`Timestamp: ${new Date().toISOString()}`,`Mobile PSI pages: ${psiRows.length}`,`Avg 200ms: ${avg200}`,`Recommendations: ${recs.length}`]
await pdf(path.join(FOLDERS.Summary,`Audit_${st}.pdf`),'Technical SEO Audit',summaryPdfLines)
const summaryCsv=['item,value']
for(const l of summaryPdfLines){summaryCsv.push(`line,${escapeCsv(l)}`)}
await writeFile(path.join(FOLDERS.Summary,`Audit_${st}.csv`),summaryCsv.join('\n'),'utf8')
}

run().catch(async(err)=>{await mkdir(FOLDERS.Summary,{recursive:true});await writeFile(path.join(FOLDERS.Summary,`AuditError_${stamp()}.csv`),`error\n${escapeCsv(String(err))}`,'utf8');process.exit(1)})

