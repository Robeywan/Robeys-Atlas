// Decorative card identities, independent of research facts or cultural attribution.
import fs from 'node:fs';
import path from 'node:path';
export function buildDirectoryDesigns(profiles,cwd){
  const papers=['#f7f0e3','#edf2e8','#f3eae4','#eaf0f2','#f2eaf1','#f3efd9','#e8f0ec','#f5ece7'];
  const accents=['#684c2f','#355b43','#754439','#365568','#654561','#68602f','#2d5b53','#744d3b'];
  const families=['arc','orbit','fold','ribbon','wash','sweep'];
  const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.codePointAt(0),16777619);return h>>>0;};
  const visualAssets=fs.existsSync(path.join(cwd,'data/profile-visual-assets.json'))?JSON.parse(fs.readFileSync(path.join(cwd,'data/profile-visual-assets.json'),'utf8')).images:[];
  const designs=profiles.map(p=>{
    const seed=hash(p.slug),theme=seed%papers.length;
    const d={slug:p.slug,originalId:p.originalId||null,kind:'abstract-decoration',paper:papers[theme],accent:accents[theme],hue:seed%360,angle:(seed>>>3)%160-80,x:25+(seed>>>9)%55,y:15+(seed>>>16)%65,spread:22+(seed>>>22)%25,composition:families[(seed>>>5)%families.length],signature:seed.toString(16),initial:[...p.name][0]};
    if(p.originalId===16){d.kind='photograph';d.image='assets/home-apache-storage-basket-met.webp';d.credit='Basket · The Met';d.source='https://www.metmuseum.org/art/collection/search/751527';d.rights='CC0 / Public Domain';d.rightsUrl='https://creativecommons.org/publicdomain/zero/1.0/';d.scope='Apache storage basket, ca.1890. Maker unrecorded; specific Apache nation not identified. Existing Apache card treatment retained.';}
    if(p.originalId===244){d.kind='photograph';d.image='assets/lyle-harvey-weaving-2022.webp';d.credit='Lyle J. Harvey weaving · NPS / L. Cisneros';d.source='https://commons.wikimedia.org/wiki/File:Lyle_Harvey_shows_visitors_weaving_techniques_on_a_loom_(52288481775).jpg';d.rights='CC BY 2.0';d.rightsUrl='https://creativecommons.org/licenses/by/2.0/';d.scope='Diné/Navajo artist in a public weaving demonstration, August15,2022. Proportional web resize; the card uses CSS cropping. Identifies this artist, not every Diné person.';}
    const image=visualAssets.find(x=>x.profileSlugs.includes(p.slug));
    if(image&&p.originalId!==16&&p.originalId!==244){Object.assign(d,{kind:'photograph',image:image.cardAsset||image.asset,credit:image.credit,source:image.sourceUrl,rights:image.rightsLabel,rightsUrl:image.rightsUrl,scope:image.scope});}
    return d;
  });
  const catalogue={updatedAt:'2026-10-24',scope:'Initial directory cards only. Each entry has a stable decorative composition and palette. Abstract artwork is interface decoration, not a traditional design, map, historical reconstruction or evidence of cultural identity. Authentic photographs are individually identified and credited. Selected developed and adequate-introduction profiles have coordinated visual treatments tracked separately.',designs};
  fs.writeFileSync(path.join(cwd,'data/directory-card-designs.json'),JSON.stringify(catalogue,null,2)+'\n');
  return {catalogue,bySlug:new Map(designs.map(d=>[d.slug,d]))};
}
