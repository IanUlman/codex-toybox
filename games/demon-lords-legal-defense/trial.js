const $ = id => document.getElementById(id);
const scenes = {
 bell: ['The missing moon', 'The prosecutor rings a bell. “That was the moon ten minutes ago.” Your client whispers, “Technically, it still is.”',
 'A · Bell receipt', 'One lunar compression, billed to B. Stone. Customer note: “Please keep the craters. They make it jingle.”',
 [['Challenge the signature','clerk'],['Offer to return the moon','return'],['Object! The bell cannot testify','bellObj']]],
 clerk: ['A witness under seal', 'The clerk swears Brimstone signed the receipt. “I recognized his handwriting from the wanted posters.”',
 'B · Wanted poster', 'All lettering by the Royal Sign Guild. Suspects do not design their own posters after the unfortunate centaur incident.',
 [['Object! The clerk never saw him sign','proof'],['Ask your client for a handwriting sample','sample']]],
 return: ['Terms of restitution', 'The judge asks how soon the moon can resume work. Your client checks his pocket. “Is tonight a school night?”',
 'C · Warranty', 'Thirty nights of free decompression. Original packaging required. The velvet box is currently serving as counsel’s briefcase.',
 [['Produce the velvet box','restore'],['Offer the court a lifetime bell subscription','fine']]],
 bellObj: ['The bell takes the stand', '“Overruled,” says the judge. The bailiff rings the witness. Three werewolves in the gallery turn inside out.',
 'D · Court transcript', 'The stenographer has rendered every ding as “I confess.” Her dictionary also translates doorbells as guilty pleas.',
 [['Object to the translation','proof'],['Ask for one more ding','fine']]]
};
const endings = {
 proof:['Dismissed on a technicality','The judge strikes the testimony. Brimstone walks free, then asks for a receipt for his innocence. You confiscate his pen.'],
 restore:['Sentenced to moon duty','The moon expands on schedule. Brimstone gets community service polishing it every Tuesday. For the first time in centuries, the moon has a clean side.'],
 fine:['Guilty as charged','The court fines Brimstone one moon plus interest. The tides will be eleven minutes late until the debt is paid. Your fee is payable in dings.'],
 sample:['Confession in triplicate','Brimstone writes “I stole the moon” in three inks so the court can pick its favorite. The judge frames the gold one. Your client asks for royalties.']
};
const evidence = document.querySelector('details');
function render(key){
 const scene=scenes[key], end=endings[key];
 const intro=key==='intro';
 $('stage').textContent=intro?'COURT IN SESSION':end?'FINAL VERDICT':key==='bell'?'HEARING 1 / 2':'HEARING 2 / 2';
 $('heading').textContent=intro?'The Crown v. Lord Brimstone':(scene||end)[0];
 $('story').textContent=intro?'Your client stole the moon and turned it into a dinner bell. He wore a name tag. As his attorney, you have two hearings to salvage his case. Inspect the exhibits, then pick your argument.':(scene||end)[1];
 evidence.open=false;evidence.hidden=!scene;
 if(scene){document.querySelector('summary').textContent='Inspect exhibit '+scene[2];$('exhibit').textContent=scene[3]}
 const choices=scene?scene[4]:intro?[['Call court to order','bell']]:[['Try the case again','intro']];
 $('choices').replaceChildren(...choices.map(([label,next])=>{
  const button=document.createElement('button');button.textContent=label;
  button.onclick=()=>{render(next);$('heading').focus()};return button;
 }));
}
$('heading').tabIndex=-1;render('intro');
