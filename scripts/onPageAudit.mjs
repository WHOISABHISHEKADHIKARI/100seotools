import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { jsPDF } from 'jspdf'

const ORIGIN = process.env.START_URL || 'https://www.100seotools.com/'
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 20000)
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 300)
const MAX_TOOLS = Number(process.env.MAX_TOOLS || 10)
const REPORTS_ROOT = path.resolve('docs','Reports')
const FOLDERS = { OnPage: path.join(REPORTS_ROOT,'OnPage'), Summary: path.join(REPORTS_ROOT,'Summary') }

function stamp(){const d=new Date();const y=String(d.getFullYear());const m=String(d.getMonth()+1).padStart(2,'0');const da=String(d.getDate()).padStart(2,'0');const h=String(d.getHours()).padStart(2,'0');const mi=String(d.getMinutes()).padStart(2,'0');const s=String(d.getSeconds()).padStart(2,'0');return `${y}${m}${da}_${h}${mi}${s}`}
function escapeCsv(v){if(v===undefined||v===null)return '';const s=String(v).replace(/\r?\n/g,' ');return /[",]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
async function fetchWithTiming(url){const c=new AbortController();const t=setTimeout(()=>c.abort(),TIMEOUT_MS);const start=performance.now();try{const res=await fetch(url,{signal:c.signal,redirect:'follow'});const ms=Math.round(performance.now()-start);const ct=res.headers.get('content-type')||'';const text=ct.includes('text/html')?await res.text():'';clearTimeout(t);return{status:res.status,ms:ms,contentType:ct,text:text,headers:Object.fromEntries(res.headers.entries())}}catch(err){clearTimeout(t);return{status:0,ms:Math.round(performance.now()-start),contentType:'',text:'',error:String(err)}}}
function textOnly(html){return html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ')}
function wordCount(html){return textOnly(html).split(/\s+/).filter(Boolean).length}
function getTitle(html){const m=html.match(/<title>([\s\S]*?)<\/title>/i);return m?m[1].trim():''}
function getMeta(html,name){const re=new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`,'i');const m=html.match(re);return m?m[1].trim():''}
function getCanonical(html){const m=html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);return m?m[1].trim():''}
function h1s(html){return Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m=>m[1].replace(/<[^>]+>/g,'').trim())}
function images(html){return Array.from(html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)).map(m=>({src:m[1]}))}
function imagesMissingAlt(html){const withAlt=Array.from(html.matchAll(/<img\b[^>]*alt=["'][^"']+["'][^>]*>/gi)).length;const all=Array.from(html.matchAll(/<img\b[^>]*>/gi)).length;return Math.max(0,all-withAlt)}
function anchors(html){return Array.from(html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)).map(m=>({href:m[1],text:m[2].replace(/<[^>]+>/g,' ').trim()}))}
function hasViewport(html){return /<meta\s+name=["']viewport["']/i.test(html)}
function isToolUrl(u){try{return new URL(u).pathname.startsWith('/tools/')}catch{return false}}
function slugFromUrl(u){try{return new URL(u).pathname.split('/').filter(Boolean).pop()||''}catch{return ''}}
function nameFromSlug(slug){return slug.split('-').map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(' ')}
function titleFollowsFormat(title){return /\s-\sFree\s.+\sTool\s\|\s100\sSEO\sTools$/i.test(title) && title.length<=60}
function metaFollowsTemplate(desc){return /^Free\s.+\sto\s.+\.[\s\S]*No\ssignup\srequired\.?$/i.test(desc) && desc.length<=160}
async function parseSitemap(){try{const {status,text}=await fetchWithTiming(new URL('/sitemap.xml',ORIGIN).toString());if(status>=200&&text){const urls=[...text.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m=>m[1].trim());return urls.filter(u=>u.startsWith(ORIGIN))}return[]}catch{return[]}}
function pdf(file,title,lines){const doc=new jsPDF({unit:'pt',format:'a4'});let y=40;doc.setFontSize(16);doc.text(title,40,y);y+=24;doc.setFontSize(10);for(const s of lines){doc.text(String(s),40,y);y+=14;if(y>780){doc.addPage();y=40}}const buf=doc.output('arraybuffer');return writeFile(file,Buffer.from(buf))}
async function run(){for(const p of Object.values(FOLDERS)){await mkdir(p,{recursive:true})}
const st=stamp()
const homepage=ORIGIN
const hp=await fetchWithTiming(homepage)
const hpTitle=getTitle(hp.text)
const hpDesc=getMeta(hp.text,'description')
const hpH1=h1s(hp.text)
const hpWordCount=wordCount(hp.text)
const hpImgMissing=imagesMissingAlt(hp.text)
const hpViewport=hasViewport(hp.text)
const homepageRow={url:homepage,title:hpTitle,titleOk:hpTitle.length>0&&hpTitle.length<=60,metaDescription:hpDesc,metaOk:hpDesc.length>0&&hpDesc.length<=160,h1Count:hpH1.length,h1Ok:hpH1.length===1,wordCount:hpWordCount,contentOk:hpWordCount>=300,imagesMissingAlt:hpImgMissing,viewportOk:hpViewport,status:hp.status,ms:hp.ms}
const urls=await parseSitemap()
const toolUrls=urls.filter(isToolUrl).slice(0,MAX_TOOLS)
const toolRows=[]
const rewriteRows=[]
for(const u of toolUrls){const r=await fetchWithTiming(u);const t=getTitle(r.text);const d=getMeta(r.text,'description');const h=h1s(r.text);const wc=wordCount(r.text);const imgs=images(r.text);const imgsMissing=imagesMissingAlt(r.text);const slug=slugFromUrl(u);const toolName=nameFromSlug(slug);const titleOk=titleFollowsFormat(t);const metaOk=metaFollowsTemplate(d);const h1Ok=h.length===1 && h[0].toLowerCase()===toolName.toLowerCase();const usagePresent=/how\s+to\s+use|steps|usage/i.test(r.text);const benefitsPresent=/benefits|features/i.test(r.text);const relatedPresent=/related\s+tools/i.test(r.text);const anchs=anchors(r.text);const internalToolLinks=anchs.filter(a=>a.href.startsWith('/tools/')||a.href.startsWith(ORIGIN+'tools/')).filter(a=>!a.href.includes(slug)).length;const descriptiveAnchors=anchs.filter(a=>(a.href.startsWith('/tools/')||a.href.startsWith(ORIGIN+'tools/')) && a.text && a.text.length>=3 && !/click\s+here|learn\s+more/i.test(a.text)).length;toolRows.push({url:u,title:t,titleOk,metaDescription:d,metaOk,h1:h[0]||'',h1Ok,wordCount:wc,contentOk:wc>=300,usagePresent,benefitsPresent,relatedPresent,imageCount:imgs.length,imagesMissingAlt:imgsMissing,internalLinksToTools:internalToolLinks,descriptiveAnchorRatio:internalToolLinks?Number((descriptiveAnchors/internalToolLinks).toFixed(2)):1,status:r.status,ms:r.ms});const proposedTitle=`${toolName} - Free ${toolName} Tool | 100 SEO Tools`;const proposedMeta=`Free ${toolName} to optimize your workflow. Fast, reliable. No signup required.`;rewriteRows.push({url:u,currentTitle:t,proposedTitle, currentMeta:d, proposedMeta});await new Promise(r=>setTimeout(r,REQUEST_DELAY_MS))}
const onPageHeaders=['url','title','titleOk','metaDescription','metaOk','h1','h1Ok','wordCount','contentOk','usagePresent','benefitsPresent','relatedPresent','imageCount','imagesMissingAlt','internalLinksToTools','descriptiveAnchorRatio','status','ms']
const csv=[onPageHeaders.join(',')]
csv.push(['homepage',homepageRow.title,homepageRow.titleOk,homepageRow.metaDescription,homepageRow.metaOk,hpH1[0]||'',homepageRow.h1Ok,homepageRow.wordCount,homepageRow.contentOk,'','','',images(hp.text).length,homepageRow.imagesMissingAlt,'','',homepageRow.status,homepageRow.ms].map(escapeCsv).join(','))
for(const row of toolRows){csv.push(onPageHeaders.map(h=>escapeCsv(row[h])).join(','))}
await writeFile(path.join(FOLDERS.OnPage,`OnPage_${st}.csv`),csv.join('\n'),'utf8')
const rewriteHeaders=['url','currentTitle','proposedTitle','currentMeta','proposedMeta']
const rewriteCsv=[rewriteHeaders.join(',')]
rewriteCsv.push([homepage,homepageRow.title,homepageRow.title.length>60?homepageRow.title.slice(0,60):homepageRow.title,homepageRow.metaDescription,homepageRow.metaDescription.length>160?homepageRow.metaDescription.slice(0,160):homepageRow.metaDescription].map(escapeCsv).join(','))
for(const row of rewriteRows){rewriteCsv.push(rewriteHeaders.map(h=>escapeCsv(row[h])).join(','))}
await writeFile(path.join(FOLDERS.OnPage,`Rewrites_${st}.csv`),rewriteCsv.join('\n'),'utf8')
const summaryLines=[`Origin: ${ORIGIN}`,`Homepage title ok: ${homepageRow.titleOk}`,`Homepage meta ok: ${homepageRow.metaOk}`,`Homepage H1 ok: ${homepageRow.h1Ok}`,`Homepage content ok: ${homepageRow.contentOk}`,`Tools audited: ${toolRows.length}`,`Tools with title format ok: ${toolRows.filter(r=>r.titleOk).length}`,`Tools with meta template ok: ${toolRows.filter(r=>r.metaOk).length}`,`Tools H1 ok: ${toolRows.filter(r=>r.h1Ok).length}`,`Tools >=300 words: ${toolRows.filter(r=>r.contentOk).length}`,`Tools internal links >=3: ${toolRows.filter(r=>r.internalLinksToTools>=3).length}`]
await pdf(path.join(FOLDERS.OnPage,`OnPage_${st}.pdf`),'On-Page SEO Audit',summaryLines)
await pdf(path.join(FOLDERS.Summary,`OnPagePlan_${st}.pdf`),'On-Page Implementation Plan',[
  'Rewrite titles to required format',
  'Rewrite meta to template with benefits and no signup note',
  'Expand content to 300-500 words including usage, benefits, related tools',
  'Ensure all images have descriptive alt text',
  'Add 3-5 related tool links with descriptive anchor text',
  'Verify breadcrumbs and footer links for hierarchy'
])
}

run().catch(async(err)=>{await mkdir(FOLDERS.OnPage,{recursive:true});await writeFile(path.join(FOLDERS.OnPage,`OnPageError_${stamp()}.csv`),`error\n${escapeCsv(String(err))}`,'utf8');process.exit(1)})

