import {start,restore,commit,active,legal,stats,squares} from './engine.mjs';
import {rules,packet,readReply} from './protocol.mjs';
const $=id=>document.getElementById(id), dialog=document.querySelector('dialog'), key='toybox.claire-tactics.v1';
let s=start(), unit, dest, target, mode;
try {const raw=localStorage.getItem(key); if(raw) s=restore(raw);} catch {$('storage').textContent='Save unavailable. Playing a fresh match.';}
function save(){try {localStorage.setItem(key,JSON.stringify({revision:s.revision,history:s.history}));} catch {$('storage').textContent='Storage unavailable. Keep this tab open to continue.';}}
const icons={Knight:'♞',Archer:'➶',Mage:'✦'};
function clear(){unit=dest=target=undefined;}
function play(id){commit(s,id);clear();save();render();}
function render(){
  const human=!s.result && active(s)==='Ian', moves=legal(s), options=moves.filter(m=>m.unit===unit);
  const choice=options.find(m=>m.at===dest && m.target===target);
  $('status').textContent='TURN '+String(Math.min(80,s.history.length+1)).padStart(2,'0')+' / 80 · '+(s.result||active(s));
  $('heading').textContent=s.result||(human?'Your orders':"Claire’s turn");
  $('preview').textContent=s.result?(s.result==='Draw'?'Both sides survived 80 turns.':(s.result==='Victory'?'Ian':'Claire')+' controls the battlefield.'):human?(choice?choice.description+'. Tap a marked square to revise.':'Tap one of Ian’s teal units to plan its turn.'):'Copy the position into a ChatGPT conversation, then import Claire’s reply.';
  $('commit').hidden=!human;$('commit').disabled=!choice;$('commit').onclick=()=>play(choice.id);
  $('transfer').hidden=human||!!s.result;
  const board=$('board');board.replaceChildren();
  function axis(t){const el=document.createElement('span');el.className='axis';el.textContent=t;board.append(el);}
  axis('');for(const col of 'ABCDEF') axis(col);
  for(const [i,at] of squares.entries()){
    if(i%6===0) axis(at[1]);
    const u=s.units.find(u=>u.at===at), cell=document.createElement('button');
    const canMove=options.some(m=>m.at===at),canAttack=u&&options.some(m=>m.at===dest&&m.target===u.id);
    cell.className='cell '+((i+Math.floor(i/6))%2?'light ':'')+(canMove&&!u?'dest ':'')+(canAttack?'target ':'')+(dest===at||(target&&target===u?.id)?'chosen':'');
    cell.setAttribute('aria-label',[at,u&&[u.owner,u.type,u.hp+' HP'].join(' '),canAttack&&'attack target',canMove&&'destination'].filter(Boolean).join(', '));
    if(u) cell.innerHTML='<span aria-hidden="true" class="piece '+u.owner.toLowerCase()+'">'+icons[u.type]+'</span><span class="hp '+u.owner.toLowerCase()+'">'+u.hp+' HP</span>';
    cell.onclick=()=>{if(!human)return;if(u?.owner==='Ian'){unit=u.id;dest=at;target=undefined;}else if(canAttack){target=target===u.id?undefined:u.id;}else if(canMove){dest=at;target=undefined;}else return;render();};
    board.append(cell);
  }
  $('units').replaceChildren(...Object.entries(stats).map(([type,a])=>{const p=document.createElement('p');p.textContent=icons[type]+' '+type+' · '+a.hp+' HP · move '+a.move+' · damage '+a.damage+' · range '+(a.min===a.max?a.min:a.min+'–'+a.max);return p;}));
  $('log').replaceChildren(...(s.log.length?s.log:['Battle begins. Ian moves first.']).map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));
}
function open(modeName,title,hint,value=''){
  mode=modeName;$('modalTitle').textContent=title;$('hint').textContent=hint;$('field').value=value;$('field').readOnly=mode==='export';$('message').textContent='';
  $('submit').textContent=mode==='export'?'Select all text':'Apply Claire’s move';dialog.showModal();$('field').focus();if(mode==='export')$('field').select();
}
$('copy').onclick=async()=>{const value=packet(s);try{await navigator.clipboard.writeText(value);$('preview').textContent='Position copied. Paste it into Claire’s conversation.';}catch{open('export','Copy position','Select and copy the full position below.',value);}};
$('import').onclick=()=>open('import','Import Claire’s move','Paste Claire’s response, including the final JSON object.');
$('submit').onclick=()=>{if(mode==='export'){$('field').focus();$('field').select();return;}try{play(readReply(s,$('field').value));dialog.close();}catch(e){$('message').textContent=e.message;}};
for(const id of ['new','restart']) $(id).onclick=()=>{if(!s.history.length||confirm('Start from the opening position and replace this match?')){s=start();clear();save();render();}};
$('rules').textContent=rules;render();
