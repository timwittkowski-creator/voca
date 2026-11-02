/* Book vocabulary from user-provided photographs, pages 215–224.
 * Lessons 1–5; introductory "Bienvenidos" included under Lesson 1.
 * Pronunciation in broad IPA is automatically approximated from Spanish
 * spelling; playback uses the device's Spanish voice (es-ES).
 * Keep individual transcription sources in vocabulary/lesson-N.js.
 */
(function () {
  'use strict';
  const raw = window.VOCA_BOOK_PARTS || {};
  const descriptions = [
    ['1','Viaje al español (mit Bienvenidos)'],
    ['2','Primeros contactos'],
    ['3','Me gusta mi gente'],
    ['4','Mirador'],
    ['5','Comer con gusto']
  ];
  function phoneticWord(token) {
    if (/\d/.test(token)) return '';
    let w = token.toLocaleLowerCase('es-ES').replace(/[^a-záéíóúüñ]/g,'');
    if (!w) return '';
    const special = { méxico:'ˈmexiko', mexicano:'mexiˈkano', oaxaca:'waˈxaka' };
    if (special[w]) return special[w];
    w = w.replace(/ch/g,'Č').replace(/rr/g,'Ř').replace(/ll/g,'Ł')
      .replace(/qu(?=[eiéí])/g,'k')
      .replace(/gü(?=[eiéí])/g,'Ğw')
      .replace(/gu(?=[eiéí])/g,'Ğ')
      .replace(/h/g,'');
    const isV = c => !!c && 'aeiouáéíóúü'.includes(c);
    const isStrong = c => !!c && 'aeoáéó'.includes(c);
    const accent = c => !!c && 'áéíóú'.includes(c);
    const accentedWeak = c => c==='í'||c==='ú';
    const nuclei = [];
    for (let i=0;i<w.length;i++) {
      if (!isV(w[i])) continue;
      const start=i;let hasAccent=accent(w[i]);
      while (isV(w[i+1]) && !accentedWeak(w[i]) &&
          !accentedWeak(w[i+1]) && !(isStrong(w[i])&&isStrong(w[i+1]))) {
        i++; hasAccent=hasAccent||accent(w[i]);
      }
      nuclei.push({start,end:i+1,accent:hasAccent});
    }
    if (!nuclei.length) return '';
    let stressed=nuclei.findIndex(n=>n.accent);
    if (stressed<0) stressed=Math.max(0,nuclei.length-(/[aeiouáéíóúsn]$/.test(w)?2:1));
    let onset=0;
    if (stressed>0) {
      const prev=nuclei[stressed-1],current=nuclei[stressed],gap=w.slice(prev.end,current.start);
      const onsetClusters=['pl','pr','bl','br','tr','dr','kl','kr','gl','gr','fl','fr'];
      onset=gap.length===0?current.start:
        gap.length>=2&&onsetClusters.includes(gap.slice(-2))?current.start-2:current.start-1;
      if (onset<prev.end) onset=current.start;
    }
    const unstressed=new Set(['el','la','los','las','lo','un','una','unos','unas','de','del','al','en','con','por','para','a','y','o','u','que','se','me','te','le','les','su','sus','mi','mis','tu','tus','es']);
    const mark=unstressed.has(w)?-1:onset;
    let out='';
    const vmap={á:'a',é:'e',í:'i',ó:'o',ú:'u',ü:'u'};
    for (let i=0;i<w.length;i++) {
      if(i===mark)out+='ˈ';
      const c=w[i],next=w[i+1]||'',previous=w[i-1]||'';
      if(c==='Č'){out+='tʃ';continue}
      if(c==='Ř'){out+='r';continue}
      if(c==='Ł'){out+='ʝ';continue}
      if(c==='Ğ'){out+='ɡ';continue}
      if(c==='ñ'){out+='ɲ';continue}
      if(c==='z'){out+='θ';continue}
      if(c==='c'){out+=/[eéií]/.test(next)?'θ':'k';continue}
      if(c==='g'){out+=/[eéií]/.test(next)?'x':'ɡ';continue}
      if(c==='j'){out+='x';continue}
      if(c==='v'){out+='b';continue}
      if(c==='q'||c==='k'){out+='k';continue}
      if(c==='x'){out+='ks';continue}
      if(c==='r'){out+=(i===0||'nls'.includes(previous))?'r':'ɾ';continue}
      if(c==='y'){out+=i===w.length-1?'i':'ʝ';continue}
      if((c==='i'||c==='u') && (isV(previous)||isV(next)) &&
          !accentedWeak(c) && (isStrong(previous)||isStrong(next))) {
        out+=c==='i'?'j':'w';continue;
      }
      out+=vmap[c]||c;
    }
    return out;
  }
  function broadIPA(spanish) {
    // IPA is a learning aid; proper names, phrasing and edge cases need checking.
    const plain=spanish.replace(/\([^)]*\)/g,'').split('|')[0]
      .replace(/\/[-a-záéíóúüñ]+/g,'')
      .replace(/\.\.\./g,'')
      .replace(/[«»"?!¡¿(),.;:@%]/g,' ');
    return plain.split(/\s+/).filter(Boolean).map(phoneticWord).filter(Boolean).join(' ').slice(0,180);
  }
  window.VOCA_LESSONS=descriptions.map(([id,name])=>{
    const items=(raw[id]||'').split('\n');
    const seen=new Set(),words=[];
    for(const entry of items){
      const sep=entry.indexOf('\t');
      if(sep<=0)continue;
      const es=entry.slice(0,sep).trim(),de=entry.slice(sep+1).trim();
      if(!es||!de)continue;
      const key=es.toLocaleLowerCase('es-ES')+'\u0000'+de.toLocaleLowerCase('de-DE');
      if(seen.has(key))continue;
      seen.add(key);
      words.push({es,de,ipa:broadIPA(es)});
    }
    return {id,name,words};
  });
})();
