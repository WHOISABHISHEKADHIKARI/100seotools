import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { jsPDF } from 'jspdf'

const ORIGIN = process.env.START_URL || 'https://www.100seotools.com/'
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 20000)
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 250)
const SAMPLE_RATIO = Number(process.env.SAMPLE_RATIO || 0.1)
const REPORTS_ROOT = path.resolve('docs','Reports')
const FOLDER = path.join(REPORTS_ROOT,'Schema')

function stamp(){const d=new Date();const y=String(d.getFullYear());const m=String(d.getMonth()+1).padStart(2,'0');const da=String(d.getDate()).padStart(2,'0');const h=String(d.getHours()).padStart(2,'0');const mi=String(d.getMinutes()).padStart(2,'0');const s=String(d.getSeconds()).padStart(2,'0');return `${y}${m}${da}_${h}${mi}${s}`}
function esc(v){if(v===undefined||v===null)return '';const s=String(v).replace(/\r?\n/g,' ');return /[",]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
async function fetchWithTiming(url){const c=new AbortController();const t=setTimeout(()=>c.abort(),TIMEOUT_MS);const start=performance.now();try{const res=await fetch(url,{signal:c.signal,redirect:'follow'});const ms=Math.round(performance.now()-start);const ct=res.headers.get('content-type')||'';const text=ct.includes('text/html')?await res.text():'';clearTimeout(t);return{status:res.status,ms,contentType:ct,text}}catch(err){clearTimeout(t);return{status:0,ms:Math.round(performance.now()-start),contentType:'',text:'',error:String(err)}}}
function extractJsonLd(html){const blocks=[];const re=/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;let m;while((m=re.exec(html))!==null){const raw=m[1].trim();blocks.push(raw)}return blocks}
function safeParse(jsonText){try{return JSON.parse(jsonText)}catch{return null}}
function flattenSchemas(obj){const out=[];function walk(x){if(!x)return; if(Array.isArray(x)){for(const i of x)walk(i)} else if(typeof x==='object'){if(x['@type']) out.push(x); for(const k of Object.keys(x)){walk(x[k])}}}
walk(obj);return out}
function typeOf(x){return String(x['@type']||'').toLowerCase()}
function hasBreadcrumbValid(b){const items=Array.isArray(b.itemListElement)?b.itemListElement:[];if(!items.length)return false;for(let i=0;i<items.length;i++){const li=items[i];if(Number(li.position)!==i+1)return false;if(!li.item || !li.name)return false}return true}
function hasFAQMin(f){const ents=Array.isArray(f.mainEntity)?f.mainEntity:[];return ents.length>=3 && ents.every(e=>e['@type']==='Question' && e.acceptedAnswer && e.acceptedAnswer['@type']==='Answer' && e.acceptedAnswer.text)}
function websiteHasSearchAction(w){const pa=w.potentialAction;if(!pa || pa['@type']!=='SearchAction')return false;const target=pa.target;const tpl=target && (target.urlTemplate||target['@type']==='EntryPoint' && target.urlTemplate);return !!(tpl && /\{search_term_string\}/.test(String(tpl)))}
function orgChecklist(o){const name=!!o.name;const logo=!!(o.logo && (o.logo.url||typeof o.logo==='string'));const sameAs=Array.isArray(o.sameAs)?o.sameAs.filter(Boolean).length>=3:false;const contact=!!(o.contactPoint||o.telephone||o.email);const address=!!(o.address && (o.address.streetAddress||o.address['@type']));return {name,logo,sameAs,contact,address}}
function softwareChecklist(s){const name=!!s.name;const cat=!!(s.applicationCategory||s.applicationSubCategory);const price=!!(s.offers && (s.offers.price==='0' || s.offers.price===0));const os=/web|browser/i.test(String(s.operatingSystem||''));const rating=!!s.aggregateRating;return {name,cat,price,os,rating}}
function howtoChecklist(h){const steps=Array.isArray(h.step)?h.step.length>=3:false;const toolRef=Array.isArray(h.tool)?h.tool.length>=1:false;const supply=Array.isArray(h.supply)?h.supply.length>=1:false;const time=typeof h.totalTime==='string' && /^PT\d+M$/i.test(h.totalTime);return {steps,toolRef,supply,time}}
async function run(){await mkdir(FOLDER,{recursive:true})
const sitemap=await fetchWithTiming(new URL('/sitemap.xml',ORIGIN).toString())
const urls = sitemap.status>=200 ? [...sitemap.text.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m=>m[1].trim()) : [ORIGIN]
const homepage=ORIGIN
const sampleCount=Math.max(1,Math.floor(urls.length*SAMPLE_RATIO))
const sampleUrls=[homepage,...urls.slice(0,sampleCount)]
const typesCsv=['url,types']
const checklistCsv=['url,type,check,result']
const validationCsv=['url,type,valid,errors,warnings,score']
const errors=[]
let faqTotal=0
let qualitySum=0
for(const u of sampleUrls){const r=await fetchWithTiming(u);const jsonlds=extractJsonLd(r.text);let types=[];let pageScore=0;for(const raw of jsonlds){const parsed=safeParse(raw);if(!parsed){errors.push({url:u,error:'JSON-LD parse error'});continue}const schemas=flattenSchemas(parsed);for(const s of schemas){const t=typeOf(s);types.push(s['@type']);let valid=true;let warn=0;let score=0; if(t==='breadcrumblist'){valid=hasBreadcrumbValid(s);score=valid?15:5; validationCsv.push([u,'BreadcrumbList',valid?'pass':'fail','',warn,score].map(esc).join(','))}
 else if(t==='faqpage'){valid=hasFAQMin(s);faqTotal += Array.isArray(s.mainEntity)?s.mainEntity.length:0;score=valid?15:5; validationCsv.push([u,'FAQPage',valid?'pass':'fail','',warn,score].map(esc).join(','))}
 else if(t==='softwareapplication'){const ck=softwareChecklist(s);const ok = ck.name && ck.cat && ck.price && ck.os;score = ok?20:10; validationCsv.push([u,'SoftwareApplication', ok?'pass':'fail','', warn, score].map(esc).join(',')); for(const k of Object.keys(ck)){checklistCsv.push([u,'SoftwareApplication',k, ck[k]?'pass':'fail'].map(esc).join(','))}}
 else if(t==='howto'){const ck=howtoChecklist(s);const ok= ck.steps && ck.toolRef && ck.supply && ck.time;score=ok?15:5; validationCsv.push([u,'HowTo', ok?'pass':'fail','', warn, score].map(esc).join(',')); for(const k of Object.keys(ck)){checklistCsv.push([u,'HowTo',k, ck[k]?'pass':'fail'].map(esc).join(','))}}
 else if(t==='website'){const ok=websiteHasSearchAction(s);score=ok?10:5; validationCsv.push([u,'WebSite', ok?'pass':'fail','', warn, score].map(esc).join(',')); checklistCsv.push([u,'WebSite','searchAction', ok?'pass':'fail'].map(esc).join(',')); if(s.publisher && s.publisher['@type']==='Organization'){const ck=orgChecklist(s.publisher); for(const k of Object.keys(ck)){checklistCsv.push([u,'Organization',k, ck[k]?'pass':'fail'].map(esc).join(','))}}}
 else if(t==='organization'){const ck=orgChecklist(s); const ok = ck.name && ck.logo && ck.sameAs && ck.contact && ck.address; score = ok?20:10; validationCsv.push([u,'Organization', ok?'pass':'fail','', warn, score].map(esc).join(',')); for(const k of Object.keys(ck)){checklistCsv.push([u,'Organization',k, ck[k]?'pass':'fail'].map(esc).join(','))}}
 else {validationCsv.push([u,s['@type'],'pass','',0,5].map(esc).join(','))}
 pageScore += score}
 }
 typesCsv.push([esc(u), esc(types.join('|'))].join(','))
 qualitySum += pageScore
 await new Promise(res=>setTimeout(res,REQUEST_DELAY_MS))}
const qualityScore=Math.min(100, Math.round((qualitySum / (sampleUrls.length*85))*100))
const summaryPdfLines=[`Origin: ${ORIGIN}`,`Sample pages: ${sampleUrls.length}`,`Schema types captured: see CSV`,`FAQ count sitewide (sample): ${faqTotal}`,`Implementation quality score: ${qualityScore}`]
function pdf(file,title,lines){const doc=new jsPDF({unit:'pt',format:'a4'});let y=40;doc.setFontSize(16);doc.text(title,40,y);y+=24;doc.setFontSize(10);for(const s of lines){doc.text(String(s),40,y);y+=14;if(y>780){doc.addPage();y=40}}const buf=doc.output('arraybuffer');return writeFile(file,Buffer.from(buf))}
const st=stamp()
await writeFile(path.join(FOLDER,`SchemaTypes_${st}.csv`),typesCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`SchemaValidation_${st}.csv`),validationCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Checklist_${st}.csv`),checklistCsv.join('\n'),'utf8')
await pdf(path.join(FOLDER,`SchemaSummary_${st}.pdf`),'Schema Audit Summary',summaryPdfLines)
const rr=['url']; for(const u of sampleUrls){rr.push(esc(u))}
await writeFile(path.join(FOLDER,`RichResultsSample_${st}.csv`),rr.join('\n'),'utf8')
if(errors.length){const errCsv=['url,error']; for(const e of errors){errCsv.push([esc(e.url),esc(e.error)].join(','))} await writeFile(path.join(FOLDER,`SchemaErrors_${st}.csv`),errCsv.join('\n'),'utf8')}
}

run().catch(async(err)=>{await mkdir(FOLDER,{recursive:true});await writeFile(path.join(FOLDER,`SchemaAuditError_${stamp()}.csv`),`error\n${esc(String(err))}`,'utf8');process.exit(1)})
