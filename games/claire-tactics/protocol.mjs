import {stats,squares,active,legal,position} from './engine.mjs';
export const rules='Ian plays first. Alternate turns, activating exactly one living unit. Move zero or more orthogonal steps up to its allowance, without entering or passing through occupied squares. Then optionally attack one enemy in range from the final square, using Manhattan distance. Waiting is legal. Attacks always deal fixed damage immediately. Remove units at zero HP. Eliminate all enemies to win. After 80 completed turns with both sides surviving, draw.';
export function packet(s) {
  const moves=legal(s);
  const rows=Array.from({length:6},(_,i)=>(i+1)+'  '+squares.slice(i*6,i*6+6).map(at=>s.units.find(u=>u.at===at)?.id||'..').join(' '));
  return ['TACTICS AGAINST CLAIRE','You play Claire against Ian. Choose your complete turn from the legal moves below.',rules,
    '6×6 board. Columns A–F left to right, rows 1–6 top to bottom. No terrain. .. = empty.',
    'Turn '+(s.history.length+1)+' | Active: '+active(s)+' | Position: '+position(s),
    ...s.units.map(u=>{const a=stats[u.type];return u.id+' = '+[u.owner,u.type,u.at].join(' ')+' | HP '+u.hp+'/'+a.hp+' | move '+a.move+' | damage '+a.damage+' | range '+a.min+'–'+a.max;}),
    '   A  B  C  D  E  F',...rows,'LEGAL MOVES',...moves.map(m=>m.id+' | '+m.description),
    'Choose one listed move ID. Banter or explain first if you like. End with exactly one JSON object in this format, replacing the example move ID with your choice:',
    JSON.stringify({position_id:position(s),move_id:moves[0].id})].join('\n');
}
export function readReply(s,text) {
  if(active(s)!=='Claire'||s.result) throw Error('Claire has no turn pending.');
  const match=text.trim().replace(/```\s*$/,'').trimEnd().match(/\{[^{}]*\}$/);
  let obj;
  try {obj=JSON.parse(match?.[0]);} catch {throw Error('End the reply with a valid JSON move object.');}
  if(Object.keys(obj).length!==2||typeof obj.position_id!=='string'||typeof obj.move_id!=='string') throw Error('Include exactly position_id and move_id as strings.');
  if(obj.position_id!==position(s)) throw Error('This reply belongs to an earlier or different position. Copy the current position.');
  if(!legal(s).some(m=>m.id===obj.move_id)) throw Error('Unknown move ID. Choose a move listed in the current export.');
  return obj.move_id;
}
