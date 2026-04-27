import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { jsPDF } from 'jspdf'
import { tools as allTools } from '../tools/index.js'

const REPORTS_ROOT = path.resolve('docs','Reports')
const FOLDER = path.join(REPORTS_ROOT,'Keywords')
const QUERIES_CSV = path.join(REPORTS_ROOT,'Queries.csv')
const PAGES_CSV = path.join(REPORTS_ROOT,'Pages.csv')
const ORIGIN = process.env.START_URL || 'https://www.100seotools.com/'

function stamp(){const d=new Date();const y=String(d.getFullYear());const m=String(d.getMonth()+1).padStart(2,'0');const da=String(d.getDate()).padStart(2,'0');const h=String(d.getHours()).padStart(2,'0');const mi=String(d.getMinutes()).padStart(2,'0');const s=String(d.getSeconds()).padStart(2,'0');return `${y}${m}${da}_${h}${mi}${s}`}
function esc(v){if(v===undefined||v===null)return '';const s=String(v).replace(/\r?\n/g,' ');return /[",]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
function parseCsv(text){const lines=text.trim().split(/\r?\n/);const header=lines.shift().split(',');const rows=[];for(const line of lines){const cols=[];let cur='';let inQ=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){if(line[i+1]==='"'){cur+='"';i++;}else{inQ=!inQ}}else if(ch===','&&!inQ){cols.push(cur);cur='';}else{cur+=ch}}cols.push(cur);const o={};for(let i=0;i<header.length;i++){o[header[i]]=cols[i]||''}rows.push(o)}return{header,rows}}
function toNum(s){const n=parseFloat(String(s).replace(/[^0-9\.\-]/g,''));return isNaN(n)?null:n}
function normalizeQuery(q){return String(q||'').toLowerCase().trim()}
function kwRowsFromQueries(queries){return queries.map(r=>({query:normalizeQuery(r['Top queries']||r['Query']||r['query']||''),clicks:toNum(r.Clicks),impressions:toNum(r.Impressions),ctr:toNum(r.CTR),position:toNum(r.Position)})).filter(r=>r.query)}
function slugToName(slug){return slug.split('-').map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(' ')}
function genVariations(name){const base=name.toLowerCase();return [`${base} free`,`${base} online`,`${base} no signup`,`${base} tool`,`${base} generator`,`free ${base}`]}
function filterKw(rows,term){const t=normalizeQuery(term);return rows.find(r=>r.query===t)||rows.find(r=>r.query.includes(t))||null}
function pdf(file,title,lines){const doc=new jsPDF({unit:'pt',format:'a4'});let y=40;doc.setFontSize(16);doc.text(title,40,y);y+=24;doc.setFontSize(10);for(const s of lines){doc.text(String(s),40,y);y+=14;if(y>780){doc.addPage();y=40}}const buf=doc.output('arraybuffer');return writeFile(file,Buffer.from(buf))}
async function run(){await mkdir(FOLDER,{recursive:true})
const st=stamp()
let queriesText='';let pagesText=''
try{queriesText=await readFile(QUERIES_CSV,'utf8')}catch{}
try{pagesText=await readFile(PAGES_CSV,'utf8')}catch{}
const queries=queriesText?kwRowsFromQueries(parseCsv(queriesText).rows):[]
const pages=parseCsv(pagesText||'url,Clicks,Impressions,CTR,Position\n').rows
const primaryTerms=["free seo tools","seo tools online","website seo checker","keyword density checker","100 seo tools"]
const primaryRows=[]
for(const term of primaryTerms){const hit=filterKw(queries,term)||{query:term,clicks:null,impressions:null,ctr:null,position:null};primaryRows.push({keyword:term,position:hit.position,ctr:hit.ctr,clicks:hit.clicks,impressions:hit.impressions,volume:null,difficulty:null,notes:''})}
const majorTools=allTools.slice(0,40)
const toolRows=[]
for(const t of majorTools.slice(0,20)){const name=t.name||slugToName(t.slug);const vars=genVariations(name);for(const v of vars){const hit=filterKw(queries,v)||{query:v,clicks:null,impressions:null,ctr:null,position:null};toolRows.push({tool:name,keyword:v,position:hit.position,ctr:hit.ctr,clicks:hit.clicks,impressions:hit.impressions,volume:null,difficulty:null})}}
const competitors=[{brand:'SmallSEOTools'},{brand:'SEOReviewTools'},{brand:'BigSEOTool'}]
const compRows=competitors.map(c=>({competitor:c.brand,topKeywordsCount:null,featuredSnippets:null,lowDiffKeywords:null,notes:'Provide SEMrush/Ahrefs exports to populate'}))
const longTail=queries.filter(r=>r.query.split(' ').length>=3 && (r.position===null || r.position>20) && (r.impressions||0)>100).slice(0,80).map(r=>({keyword:r.query,position:r.position,impressions:r.impressions,ctr:r.ctr,volume:null,difficulty:null}))
const questionsHow=queries.filter(r=>/^how\s+to\s+/i.test(r.query)).slice(0,30).map(r=>({keyword:r.query,position:r.position,impressions:r.impressions}))
const questionsWhat=queries.filter(r=>/^what\s+is\s+/i.test(r.query)).slice(0,25).map(r=>({keyword:r.query,position:r.position,impressions:r.impressions}))
const alternatives=["alternative to smallseotools","better than seoreviewtools","smallseotools alternative","seoreviewtools alternative"].map(k=>{const hit=filterKw(queries,k)||{query:k,position:null,impressions:null,ctr:null};return{keyword:k,position:hit.position,impressions:hit.impressions}})
const bulkPhrases=[]
for(const t of majorTools.slice(0,10)){const name=t.name||slugToName(t.slug);for(const variant of ['bulk','batch','mass']){bulkPhrases.push(`${name.toLowerCase()} ${variant}`)}}
const bulkRows=bulkPhrases.map(k=>{const hit=filterKw(queries,k)||{query:k,position:null,impressions:null,ctr:null};return{keyword:k,position:hit.position,impressions:hit.impressions}})
const intentRows=[]
for(const p of pages){const url=p['Top pages']||p['url']||'';if(!url)continue;const isBlog=/\/blog\//.test(url);const isTool=/\/tools\//.test(url);const intent=isBlog?'informational':(isTool?'transactional':'other');intentRows.push({url,intent})}
const primaryHdr=['keyword','position','ctr','clicks','impressions','volume','difficulty','notes']
const toolHdr=['tool','keyword','position','ctr','clicks','impressions','volume','difficulty']
const compHdr=['competitor','topKeywordsCount','featuredSnippets','lowDiffKeywords','notes']
const oppHdr=['keyword','position','impressions','ctr','volume','difficulty']
const intentHdr=['url','intent']
const primaryCsv=[primaryHdr.join(',')]
for(const r of primaryRows){primaryCsv.push(primaryHdr.map(h=>esc(r[h])).join(','))}
const toolCsv=[toolHdr.join(',')]
for(const r of toolRows){toolCsv.push(toolHdr.map(h=>esc(r[h])).join(','))}
const compCsv=[compHdr.join(',')]
for(const r of compRows){compCsv.push(compHdr.map(h=>esc(r[h])).join(','))}
const oppCsv=[oppHdr.join(',')]
for(const r of longTail){oppCsv.push(oppHdr.map(h=>esc(r[h])).join(','))}
const qHowCsv=['keyword,position,impressions']
for(const r of questionsHow){qHowCsv.push([esc(r.keyword),esc(r.position),esc(r.impressions)].join(','))}
const qWhatCsv=['keyword,position,impressions']
for(const r of questionsWhat){qWhatCsv.push([esc(r.keyword),esc(r.position),esc(r.impressions)].join(','))}
const bulkCsv=['keyword,position,impressions']
for(const r of bulkRows){bulkCsv.push([esc(r.keyword),esc(r.position),esc(r.impressions)].join(','))}
const intentCsv=[intentHdr.join(',')]
for(const r of intentRows){intentCsv.push(intentHdr.map(h=>esc(r[h])).join(','))}
await writeFile(path.join(FOLDER,`Primary_${st}.csv`),primaryCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Tools_${st}.csv`),toolCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Competitors_${st}.csv`),compCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Opportunities_${st}.csv`),oppCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Questions_HowTo_${st}.csv`),qHowCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Questions_WhatIs_${st}.csv`),qWhatCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Bulk_${st}.csv`),bulkCsv.join('\n'),'utf8')
await writeFile(path.join(FOLDER,`Intent_${st}.csv`),intentCsv.join('\n'),'utf8')
await pdf(path.join(FOLDER,`KeywordsSummary_${st}.pdf`),'Keyword Targeting Summary',[`Origin: ${ORIGIN}`,`Primary terms: ${primaryRows.length}`,`Tool keywords: ${toolRows.length}`,`Long-tail candidates: ${longTail.length}`,`How-to: ${questionsHow.length}`,`What-is: ${questionsWhat.length}`,`Bulk variants: ${bulkRows.length}`])
const qw=longTail.slice(0,20).map(r=>`Quick win: ${r.keyword} at pos ${r.position||'n/a'} with ${r.impressions||0} impressions`)
await pdf(path.join(FOLDER,`QuickWins_${st}.pdf`),'Quick Wins and Recommendations',qw.length?qw:["No quick wins found; require SEMrush/Ahrefs enrichment for volumes/difficulty"])
}

run().catch(async(err)=>{await mkdir(FOLDER,{recursive:true});await writeFile(path.join(FOLDER,`KeywordAuditError_${stamp()}.csv`),`error\n${esc(String(err))}`,'utf8');process.exit(1)})

