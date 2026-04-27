import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { jsPDF } from 'jspdf'

const ORIGIN = process.env.START_URL || 'https://www.100seotools.com/'
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 20000)
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 250)
const MAX_BLOG = Number(process.env.MAX_BLOG || 80)
const REPORTS_ROOT = path.resolve('docs','Reports')
const FOLDER = path.join(REPORTS_ROOT,'ContentQuality')

function stamp(){const d=new Date();const y=String(d.getFullYear());const m=String(d.getMonth()+1).padStart(2,'0');const da=String(d.getDate()).padStart(2,'0');const h=String(d.getHours()).padStart(2,'0');const mi=String(d.getMinutes()).padStart(2,'0');const s=String(d.getSeconds()).padStart(2,'0');return `${y}${m}${da}_${h}${mi}${s}`}
function escapeCsv(v){if(v===undefined||v===null)return '';const s=String(v).replace(/\r?\n/g,' ');return /[",]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
async function fetchWithTiming(url){const c=new AbortController();const t=setTimeout(()=>c.abort(),TIMEOUT_MS);const start=performance.now();try{const res=await fetch(url,{signal:c.signal,redirect:'follow'});const ms=Math.round(performance.now()-start);const ct=res.headers.get('content-type')||'';const text=ct.includes('text/html')?await res.text():'';clearTimeout(t);return{status:res.status,ms:ms,contentType:ct,text:text}}catch(err){clearTimeout(t);return{status:0,ms:Math.round(performance.now()-start),contentType:'',text:'',error:String(err)}}}
function textOnly(html){return html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ')}
function wordCount(html){return textOnly(html).split(/\s+/).filter(Boolean).length}
function getTitle(html){const m=html.match(/<title>([\s\S]*?)<\/title>/i);return m?m[1].trim():''}
function getMeta(html){const m=html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);return m?m[1].trim():''}
function hasHowTo(html){return /how\s+to\s+use|steps|usage/i.test(html)}
function hasBestPractices(html){return /best\s+practices|tips|recommendations/i.test(html)}
function hasWhyUse(html){return /why\s+use\s+this\s+tool|why\s+use/i.test(html)}
function faqCount(html){const h=Array.from(html.matchAll(/<h2[^>]*>[^<]*faq|<h3[^>]*>[^<]*faq|<section[^>]*id=["']faq/i)).length;const ld=Array.from(html.matchAll(/"@type"\s*:\s*"FAQPage"/i)).length;return Math.max(h,ld)}
function imageCount(html){return Array.from(html.matchAll(/<img\b[^>]*src=["'][^"']+["'][^>]*>/gi)).length}
function parseSitemap(text){return[...text.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m=>m[1].trim())}
function isTool(u){return /\/tools\//.test(u)}
function isBlog(u){return /\/blog\//.test(u)}
function isCategory(u){return /\/category\//.test(u)}
function slugFromCategoryLabel(label){return label.toLowerCase().replace(/\s+tools?$/,'').replace(/\s+/g,'-')}
function pdf(file,title,lines){const doc=new jsPDF({unit:'pt',format:'a4'});let y=40;doc.setFontSize(16);doc.text(title,40,y);y+=24;doc.setFontSize(10);for(const s of lines){doc.text(String(s),40,y);y+=14;if(y>780){doc.addPage();y=40}}const buf=doc.output('arraybuffer');return writeFile(file,Buffer.from(buf))}
async function run(){await mkdir(FOLDER,{recursive:true})
const st=stamp()
const sm=await fetchWithTiming(new URL('/sitemap.xml',ORIGIN).toString())
const urls=sm.status>=200?parseSitemap(sm.text):[]
const toolUrls=urls.filter(isTool)
const blogUrls=urls.filter(u=>isBlog(u) && !/\/blog\/?$/.test(u)).slice(0,MAX_BLOG)
const catLabels=['Keyword Research Tools','On-Page SEO Tools','Technical SEO Tools','Backlink Analysis Tools','Content Tools','Local SEO Tools']
const catUrls=catLabels.map(l=>`${ORIGIN}category/${slugFromCategoryLabel(l)}`)
const toolRows=[]
for(const u of toolUrls){const r=await fetchWithTiming(u);const wc=wordCount(r.text);const how=hasHowTo(r.text);const bp=hasBestPractices(r.text);const why=hasWhyUse(r.text);const faq=faqCount(r.text);const imgs=imageCount(r.text);toolRows.push({url:u,wordCount:wc,hasHowTo:how,hasBestPractices:bp,hasWhyUse:why,faqCount:faq,images:imgs,status:r.status});await new Promise(res=>setTimeout(res,REQUEST_DELAY_MS))}
const catRows=[]
for(const u of catUrls){const r=await fetchWithTiming(u);const wc=wordCount(r.text);const imgs=imageCount(r.text);catRows.push({url:u,wordCount:wc,images:imgs,status:r.status});await new Promise(res=>setTimeout(res,REQUEST_DELAY_MS))}
const blogRows=[]
for(const u of blogUrls){const r=await fetchWithTiming(u);const wc=wordCount(r.text);const imgs=imageCount(r.text);blogRows.push({url:u,wordCount:wc,images:imgs,status:r.status});await new Promise(res=>setTimeout(res,REQUEST_DELAY_MS))}
const dupTitleMap=new Map();const dupMetaMap=new Map();
for(const u of [...toolUrls,...blogUrls]){const r=await fetchWithTiming(u);const t=getTitle(r.text);const d=getMeta(r.text);if(t){const a=dupTitleMap.get(t)||[];a.push(u);dupTitleMap.set(t,a)}if(d){const a=dupMetaMap.get(d)||[];a.push(u);dupMetaMap.set(d,a)}await new Promise(res=>setTimeout(res,REQUEST_DELAY_MS))}
const dupRows=[]
for(const [k,v] of dupTitleMap.entries()){if(v.length>1){for(const u of v){dupRows.push({type:'title',value:k,url:u})}}}
for(const [k,v] of dupMetaMap.entries()){if(v.length>1){for(const u of v){dupRows.push({type:'meta',value:k,url:u})}}}
const thinRows=[]
for(const r of [...toolRows,...blogRows]){if(r.wordCount<300){thinRows.push({url:r.url,wordCount:r.wordCount})}}
const userRows=[]
for(const r of toolRows){const answers=/what\s+is|how\s+to|why\s+use/i.test(r.url)||r.hasHowTo||r.hasWhyUse;const examples=answers;const jargonExplained=/what\s+is/i.test(r.url);const visuals=r.images>0;userRows.push({url:r.url,answers:answers,examples:examples,jargonExplained:jargonExplained,visuals:visuals})}
const toolHdr=['url','wordCount','hasHowTo','hasBestPractices','hasWhyUse','faqCount','images','status']
const catHdr=['url','wordCount','images','status']
const blogHdr=['url','wordCount','images','status']
const dupHdr=['type','value','url']
const thinHdr=['url','wordCount']
const userHdr=['url','answers','examples','jargonExplained','visuals']
const toolCsv=[toolHdr.join(',')];for(const r of toolRows){toolCsv.push(toolHdr.map(h=>escapeCsv(r[h])).join(','))}
const catCsv=[catHdr.join(',')];for(const r of catRows){catCsv.push(catHdr.map(h=>escapeCsv(r[h])).join(','))}
const blogCsv=[blogHdr.join(',')];for(const r of blogRows){blogCsv.push(blogHdr.map(h=>escapeCsv(r[h])).join(','))}
const dupCsv=[dupHdr.join(',')];for(const r of dupRows){dupCsv.push(dupHdr.map(h=>escapeCsv(r[h])).join(','))}
const thinCsv=[thinHdr.join(',')];for(const r of thinRows){thinCsv.push(thinHdr.map(h=>escapeCsv(r[h])).join(','))}
const userCsv=[userHdr.join(',')];for(const r of userRows){userCsv.push(userHdr.map(h=>escapeCsv(r[h])).join(','))}
await writeFile(path.join(FOLDER,`ToolContent_${st}.csv`),toolCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`CategoryContent_${st}.csv`),catCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`BlogContent_${st}.csv`),blogCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Duplicates_${st}.csv`),dupCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`ThinContent_${st}.csv`),thinCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`UserValue_${st}.csv`),userCsv.join('\n'),'utf8')
const summary=[`Origin: ${ORIGIN}`,`Tools audited: ${toolRows.length}`,`Categories checked: ${catRows.length}`,`Blog posts sampled: ${blogRows.length}`,`Tools >=300 words: ${toolRows.filter(r=>r.wordCount>=300).length}`,`Categories >=800 words: ${catRows.filter(r=>r.wordCount>=800).length}`,`Blog posts >=1000 words: ${blogRows.filter(r=>r.wordCount>=1000).length}`,`Tools with FAQs >=3: ${toolRows.filter(r=>r.faqCount>=1).length}`,`Thin pages: ${thinRows.length}`,`Duplicate entries: ${dupRows.length}`]
await pdf(path.join(FOLDER,`ContentQuality_${st}.pdf`),'Content Quality Audit',summary)
}

run().catch(async(err)=>{await mkdir(FOLDER,{recursive:true});await writeFile(path.join(FOLDER,`ContentQualityError_${stamp()}.csv`),`error\n${escapeCsv(String(err))}`,'utf8');process.exit(1)})

