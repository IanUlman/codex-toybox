export const stats = {
  Knight: {hp:7, move:2, damage:2, min:1, max:1},
  Archer: {hp:4, move:2, damage:2, min:2, max:3},
  Mage: {hp:4, move:1, damage:3, min:1, max:2}
};
export const squares = Array.from({length:36}, (_,i) => 'ABCDEF'[i%6] + (1+Math.floor(i/6)));
const distance = (a,b) => Math.abs(a.charCodeAt(0)-b.charCodeAt(0))+Math.abs(a[1]-b[1]);
export const active = s => s.history.length%2 ? 'Claire' : 'Ian';
export const position = s => s.revision;
const token = () => Array.from(crypto.getRandomValues(new Uint32Array(4)), n=>n.toString(16).padStart(8,'0')).join('');
export function start(revision=token()) {
  const units = ['Claire','Ian'].flatMap((owner,i)=>Object.keys(stats).map((type,j)=>({
    owner,type,id:owner[0]+type[0],at:(i?['D6','E6','C6']:['C1','B1','D1'])[j],hp:stats[type].hp
  })));
  return {revision,units,history:[],log:[],result:''};
}
export function legal(s) {
  if(s.result) return [];
  const actions=[];
  for(const u of s.units.filter(u=>u.owner===active(s))) {
    const spec=stats[u.type], reachable=new Set([u.at]);
    for(let step=0;step<spec.move;step++) {
      for(const from of [...reachable]) for(const at of squares)
        if(distance(from,at)===1 && !s.units.some(v=>v.at===at)) reachable.add(at);
    }
    for(const at of reachable) {
      const targets=s.units.filter(v=>v.owner!==u.owner && distance(at,v.at)>=spec.min && distance(at,v.at)<=spec.max);
      for(const target of [null,...targets]) {
        const route=at===u.at?'stay at '+at:u.at+' → '+at;
        const attack=target?'attack '+target.type+' at '+target.at+' ('+spec.damage+' damage)':'no attack';
        actions.push({id:[u.id,at,target?.id||'pass'].join('-'),unit:u.id,at,target:target?.id,description:u.type+' '+route+' · '+attack});
      }
    }
  }
  return actions;
}
export function commit(s,id,revision=token()) {
  const m=legal(s).find(m=>m.id===id);
  if(!m) throw Error('That move is unavailable.');
  const player=active(s), u=s.units.find(u=>u.id===m.unit);
  u.at=m.at;
  const target=s.units.find(u=>u.id===m.target);
  if(target) target.hp=Math.max(0,target.hp-stats[u.type].damage);
  s.units=s.units.filter(u=>u.hp>0);
  s.log.unshift(player+' · '+m.description+(target?.hp===0?' · defeated':''));
  s.log=s.log.slice(0,6);
  s.history.push(id);
  s.revision=revision;
  if(s.units.every(u=>u.owner===player)) s.result=player==='Ian'?'Victory':'Defeat';
  else if(s.history.length===80) s.result='Draw';
}
export function restore(raw) {
  const {revision,history}=JSON.parse(raw);
  if(!/^[a-f0-9]{32}$/.test(revision)||!Array.isArray(history)||history.length>80) throw Error('Invalid save');
  const s=start(revision);
  for(const id of history) commit(s,id,revision);
  return s;
}
