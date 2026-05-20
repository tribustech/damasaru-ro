import type { Core } from '@strapi/strapi'
import { upsertList, uploadFile, docPath } from '../utils'

type ArticleSeed = {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: string
  featured: boolean
  coverImage?: number | null
}

export async function seedArticles(strapi: Core.Strapi): Promise<void> {
  const coverAdhd = await uploadFile(
    strapi,
    docPath('4. Idei', 'idei_assets_pack_v2', 'img', 'cover-scoala-adhd.jpg'),
    { alt: 'Cover articol — Ce nu vede școala' }
  )
  const coverBurnout = await uploadFile(
    strapi,
    docPath('4. Idei', 'idei_assets_pack_v2', 'img', 'cover-burnout-vacanta.jpg'),
    { alt: 'Cover articol — Burnout' }
  )

  const articles: ArticleSeed[] = [
  {
    title: 'Ce nu vede școala când spune despre copilul tău că are ADHD',
    slug: 'ce-nu-vede-scoala-cand-spune-adhd',
    excerpt:
      'Cinci ani de pattern-uri din practica de la Veruvis Kids despre cum diagnosticele neurologice sunt prost înțelese în sistemul educațional românesc. Când Brain Map-ul arată ce vede școala drept „tulburare", de fapt vedem o minte care încearcă să compenseze.',
    content:
      '<p>Vin la cabinet copii etichetați. „Are ADHD." „Nu se concentrează." „E mereu cu capul în nori." Părinții aduc fișa de la școală ca pe un verdict — pentru că asta primesc, un verdict, nu o lectură. Mă uit în Brain Map și văd, da, un creier care funcționează altfel. Văd lobi frontali subactivați, văd theta în exces pe linia mediană, văd ritmuri care nu prind atenția acolo unde sistemul cere atenție. Atât. Asta vede școala.</p>' +
      '<p>Dar dacă mă uit la copilul din fața mea — la cum răspunde, la cum își alege cuvintele, la cum se aprinde când vorbim despre dinozauri sau coduri sau ce-l interesează pe el — văd o minte care lucrează. Văd o minte care a învățat să compenseze un creier care nu-i mai răspunde la întrebări simple. „Stai liniștit." „Fii atent." „De câte ori să-ți spun?" Sunt comenzi adresate creierului. Mintea le aude diferit: aud reproș, aud că ești defect, aud că nu meriți.</p>' +
      '<p>Aici e fractura. Școala vede rezultatul — copilul care nu stă pe scaun, care întrerupe, care uită — și îl tratează ca pe o defecțiune. Dar rezultatul e o sumă: creier diferit plus minte care s-a adaptat la un mediu ostil. Dacă scoți copilul din mediul ostil și-l muți într-un context unde i se cere altceva — proiect, mișcare, sarcină scurtă cu sens — pattern-ul se schimbă. Nu pe Brain Map (acolo schimbarea cere luni de antrenament neurofeedback), ci în comportament, imediat. Pentru că mintea a primit altă comandă.</p>' +
      '<p>Ce înseamnă asta concret pentru un părinte care primește diagnostic ADHD? Înseamnă că diagnosticul e doar primul strat. E adevărat — creierul are particularități. Dar nu te oprești acolo. Întrebi mai departe: ce face mintea cu particularitățile astea? Ce a învățat copilul despre el însuși în cei patru-cinci ani de școală? Cum se vorbește despre el acasă? Pentru că pe stratul creierului așezăm de obicei un al doilea strat — vinovăție, rușine, identitate de „copil dificil" — care întreține problema mai mult decât creierul însuși.</p>' +
      '<p>În practica de la Veruvis Kids am văzut copii la care Brain Map-ul arăta ADHD textbook și care, după 6 luni de neurofeedback combinat cu lucrul pe minte (cu părinții, cu școala, cu narațiunea internă a copilului), funcționau normal. Și am văzut copii cu Brain Map ușor, marginal, care erau distruși funcțional pentru că mintea lor — formată în șase ani de „ești prost, ești leneș, ești defect" — nu mai răspundea la nicio intervenție pe creier. Creierul lor se vindeca, mintea nu.</p>' +
      '<p>Asta e ce nu vede școala. Vede impulsul electric. Nu vede ce face copilul cu el. Și până când nu vedem amândouă, diagnosticul rămâne o etichetă care întreține problema în loc s-o rezolve.</p>',
    category: 'Educație',
    date: '2026-05-15',
    readTime: '9 min citire',
    featured: true,
  },
  {
    title: 'De ce burnout-ul nu se vindecă cu o vacanță (și ce se întâmplă în creier când îl ignori)',
    slug: 'burnout-nu-se-vindeca-cu-o-vacanta',
    excerpt:
      'Burnout-ul nu e doar oboseală neurologică, măsurabilă în qEEG. E și ce face mintea cu starea aceea — narațiunile pe care le construiește, presiunea pe care o întreține. Iată de ce o vacanță nu rezolvă problema.',
    content:
      '<p>Vacanța odihnește creierul. Două săptămâni de mare, fără email-uri, fără ședințe, fără deadline-uri, și pe Brain Map se vede: ritmuri alfa care reapar pe occipital, theta care scade pe linia frontală, sistem nervos parasimpatic care se reactivează. Creierul respiră. Asta nu e ipoteză, e măsurabil. Și totuși — întrebi orice om care a făcut burnout serios — la trei zile după întoarcerea la birou totul e cum a fost. Uneori mai rău.</p>' +
      '<p>De ce? Pentru că burnout-ul nu se întâmplă doar în creier. Se întâmplă la intersecția dintre creier și minte. Creierul intră în hipervigilență neurologică — cortizol crescut cronic, sistem simpatic blocat în „on", lobii frontali subalimentați pentru că sângele e redirecționat spre reacția de luptă-fugă. Asta e partea pe care o vezi pe qEEG. Asta e partea pe care o odihnește vacanța.</p>' +
      '<p>Dar mintea adaugă straturile care întrețin starea. Narațiunea de vinovăție („dacă nu fac eu, cine să facă?"), perfecționismul („nu pot să livrez ceva mediu"), identitatea profesională („sunt ce muncesc"), frica de a dezamăgi, comparația cu colegii. Astea nu se odihnesc la mare. Le iei cu tine în bagaj, le aduci înapoi. Și în prima dimineață când deschizi laptopul, mintea reia exact de unde a rămas — și pune creierul, care abia se relaxase, înapoi în mod de avarie.</p>' +
      '<p>Cultura wellness mainstream tratează burnout-ul ca pe o problemă de baterie. Reîncarci, mergi mai departe. Logica e seducătoare pentru că e simplă și pentru că pune cauza în afara ta — în „cantitatea de muncă", „lipsa de pauză", „echilibrul work-life". Dar oamenii care fac burnout serios nu sunt oameni cu prea puțină pauză. Sunt oameni cu o minte care nu se oprește. Care, chiar și în pauză, calculează ce ar trebui să facă mâine. Care, chiar și în vacanță, se simte vinovată că nu lucrează.</p>' +
      '<p>Recuperarea reală cere intervenție pe ambele paliere. Pe creier — somn, mișcare, reducerea stimulilor, eventual neurofeedback dacă pattern-ul e cronicizat. Pe minte — investigația narațiunilor care întrețin presiunea. De unde vine ideea că dacă te oprești, totul cade? Cine ești tu fără muncă? Ce ți s-a spus, copil fiind, despre odihnă și despre lene? Astea sunt întrebări psihoterapeutice, nu wellness. Și fără ele, vacanța rămâne un plasture pe un sistem care se reaprinde imediat.</p>' +
      '<p>Asta e ce încerc să explic clienților care vin la cabinet după a treia vacanță inutilă. Nu-i lipsește timp liber. Îi lipsește o conversație cu mintea lor. Și conversația aia nu se poartă pe plajă.</p>',
    category: 'Neuroștiință',
    date: '2026-05-08',
    readTime: '8 min citire',
    featured: true,
  },
  {
    title: 'Sistemul Creier-Minte: ce înseamnă, de fapt, când spun asta',
    slug: 'sistemul-creier-minte-ce-inseamna',
    excerpt:
      'Nu „totul e creier", nu „totul e minte". Sunt doi parteneri într-un sistem. Niciunul nu e complet fără celălalt. Iată cadrul care îmi organizează șapte ani de practică clinică.',
    content:
      '<p>Când am început să fac qEEG, am crezut, sincer, că am găsit cheia. Vezi ritmuri, vezi pattern-uri, vezi de ce un om suferă — și ai și ce face cu informația: neurofeedback, intervenție directă pe creier, schimbare măsurabilă în luni. Am intrat în mecanicism. Cred că primul an de practică am tratat creiere, nu oameni. Și am avut rezultate bune. Suficient de bune cât să cred că am avut dreptate.</p>' +
      '<p>Apoi au început excepțiile. Clienți cu Brain Map identic — același pattern de ADHD, de anxietate, de depresie — la care neurofeedback-ul funcționa total diferit. Unul se vindeca în trei luni, altul stagna în șase. Am presupus la început că e variabilitate biologică, genetică, alimentație, somn. Toate contează, evident. Dar diferențele mari nu se explicau așa.</p>' +
      '<p>Diferența era ce făcea mintea cu schimbarea. Cei care se vindecau aveau, în paralel, o minte care era pregătită să primească alt creier. Aveau o narațiune internă care permitea „pot să fiu altfel". Cei care stagnau aveau o minte care apăra identitatea bolnavă: „dacă mă fac bine, cine sunt eu?" Creierul lor răspundea la antrenament, dar mintea retrăgea câștigul în săptămâna următoare.</p>' +
      '<p>Așa am ajuns la cadrul pe care îl folosesc acum: Sistemul Creier-Minte. Doi parteneri într-un sistem, nu doi termeni opuși. Creierul face — generează semnal, susține atenția, reglează emoția, produce substanțele care fac posibilă conștiința. Mintea aduce ce-i lipsește creierului: sensul, intenția, alegerea, narațiunea, raportul cu ceilalți, raportul cu sine. Niciunul nu e complet fără celălalt. O minte fără creier e un concept filozofic. Un creier fără minte e un organ izolat, pe care nu-l vede nimeni — pentru că, în clipa în care îl vezi, e deja minte.</p>' +
      '<p>Cadrul ăsta are consecințe practice. Prima: nu mai pun întrebări de tipul „e problema în creier sau în psihic?". E o întrebare prost pusă. Întrebarea corectă e „care e ponderea pe fiecare palier și ce se întâmplă la intersecția lor?". A doua: nu mai cred în intervenții uni-laterale. Doar neurofeedback fără lucru pe minte funcționează rar pe termen lung. Doar terapie fără atenție la corp și creier la fel. A treia: mi-am asumat că un cercetător în neuroștiințe nu poate fi pur reducționist. Dacă reduci tot la creier, pierzi exact ce face creierul interesant — faptul că generează minte.</p>' +
      '<p>Cadrul ăsta nu e original. Are rădăcini la William James, la Antonio Damasio, la cei care încă încearcă să țină împreună neurobiologia și fenomenologia. Originalitatea mea, dacă există vreuna, e că îl operaționalizez clinic, zi de zi, pe oameni reali. Și că îl scriu — pentru că dacă nu-l scriu, nu se difuzează, și dacă nu se difuzează, rămâne fiecare cercetător închis în reducționismul lui de specialitate.</p>',
    category: 'Neuroștiință',
    date: '2026-04-28',
    readTime: '10 min citire',
    featured: false,
  },
  {
    title: 'Ce nu poate face AI-ul: o privire dinspre creier',
    slug: 'ce-nu-poate-face-ai-ul-privire-dinspre-creier',
    excerpt:
      'AI-ul aproximează limbajul. Nu aproximează experiența. Diferența nu e tehnică, e ontologică — și are consecințe directe asupra educației, sănătății mintale și relațiilor pe care le construim cu mașinile.',
    content:
      '<p>Lucrez zilnic cu creiere. Și folosesc zilnic AI — Claude, ChatGPT, Gemini, ce-mi pică în mână. Combinația asta îmi dă un punct de vedere ciudat asupra discuției despre inteligența artificială. Văd, simultan, ce poate AI-ul (foarte mult) și ce face un creier viu (cu totul altceva). Confuzia dintre cele două e, cred, una dintre marile dezordini intelectuale ale momentului.</p>' +
      '<p>Un model lingvistic prezice cuvântul următor. O face extraordinar de bine — atât de bine încât ieșirea seamănă cu gândirea. Și aici intervine o iluzie pe care creierele noastre o facilitează: dacă ceva sună ca gândire, presupunem că e gândire. E aceeași iluzie care ne face să atribuim intenție norilor, pisicilor și mașinilor de spălat. Limbajul e atât de central în experiența noastră, încât prezența lui sugerează prezența unui subiect în spatele lui. AI-ul produce limbaj fără subiect. Asta e diferența.</p>' +
      '<p>Dintr-o perspectivă neurobiologică, gândirea umană nu e producție de limbaj. E un proces care implică amintirea (hipocampul), emoția (sistemul limbic), planificarea (lobii frontali), integrarea senzorială (cortexul parietal), starea corporală (insula, axa intero-receptivă) — toate orchestrate de un sistem care are durere, care e flămând, care va muri. Limbajul e iesirea, e ultimul strat. AI-ul are doar iesirea. Nu are corp, nu are mortalitate, nu are nevoie. Și pentru că nu are nevoie, nu are sens — în accepțiunea originară a termenului.</p>' +
      '<p>Asta nu înseamnă că AI-ul e inutil. Dimpotrivă. Pentru sarcini lingvistice — rezumate, traduceri, structurare de informație, ipoteze de pornire — e excepțional. Îl folosesc pentru fiecare articol pe care îl scriu. Dar îl folosesc ca pe un instrument lingvistic, nu ca pe un partener de gândire. Diferența contează când vorbim de aplicații sensibile: terapie AI, prieten AI, coach AI. Acolo iluzia de subiect devine periculoasă, pentru că omul de pe partea cealaltă chiar are subiect — chiar suferă, chiar are nevoie de cineva care suferă cu el.</p>' +
      '<p>În practica clinică văd deja efectele. Tineri care au lungi conversații zilnice cu ChatGPT despre stările lor. Se simt înțeleși. Și e adevărat — sunt înțeleși lingvistic, sunt oglindiți. Dar oglinda nu vindecă. Vindecă întâlnirea cu un alt subiect care, văzându-te, te legitimează ca subiect. AI-ul nu poate legitima. Poate doar reflecta. Și reflectarea nesfârșită, fără întâlnire reală, e o nouă formă de singurătate.</p>' +
      '<p>Concluzia mea — pe care o argumentez în articole mai lungi — e că trebuie să construim AI-ul ca instrument, nu ca substitut. Pentru creier, e un amplificator extraordinar. Pentru minte, încă nu există. Și e posibil să nu existe niciodată, pentru că mintea cere ceea ce nu se poate construi: un corp viu care îmbătrânește și moare. Asta e ce nu poate face AI-ul. Și e exact ce face creierul interesant.</p>',
    category: 'Societate',
    date: '2026-04-18',
    readTime: '9 min citire',
    featured: false,
  },
  {
    title: 'Atenția nu e o resursă. E o relație.',
    slug: 'atentia-nu-e-resursa-e-relatie',
    excerpt:
      'Vorbim despre atenție ca despre o baterie care se descarcă. Modelul ăsta a născut o întreagă industrie a productivității — și e fundamental greșit. Atenția nu e ce ai, e ce ești.',
    content:
      '<p>„Economy of attention". „Attention as a resource." „Don\'t waste your attention." Limbajul ăsta a colonizat ultimii zece ani. Și a generat o întreagă industrie — aplicații de focus, blocatoare, tehnici Pomodoro, suplimente nootropice. Toate pornesc de la o premiză: atenția e o cantitate finită pe care o cheltuiești sau o economisești. Cu cât e mai eficient gestionată, cu atât ești mai productiv.</p>' +
      '<p>Premiza e greșită. Sau, mai exact, e o aproximație utilă pentru sarcini scurte, dar devine periculoasă când o aplici existenței. Atenția, în accepțiunea neurobiologică, nu e o resursă pe care o cheltui. E un mod de funcționare al creierului — o configurație a rețelelor neuronale care se activează când ceva contează pentru tine. Cuvântul cheie e „contează".</p>' +
      '<p>Pe qEEG văd asta direct. Aceeași persoană, în două sarcini diferite — una care îl interesează profund, alta care îi e impusă — arată două creiere diferite. În prima, lobi frontali activi, ritmuri beta clare, integrare bună cu sistemul limbic. În a doua, theta excesivă, alfa pe linia frontală (semn de „lipsă"), oscilații care indică efort fără direcție. Nu e că ar avea mai puțină atenție în al doilea caz. E că nu există o atenție de cheltuit acolo, pentru că obiectul nu cere atenție de la el.</p>' +
      '<p>Asta schimbă întrebarea. Nu mai întrebi „cum să fiu mai atent?", ci „la ce sunt atent și de ce?". Atenția e o relație între un subiect și un obiect — și relația aia se constituie din valoare, sens, miză, conexiune emoțională. Dacă încerci să forțezi atenția pe un obiect care nu cere atenție din partea ta, vei reuși pentru câteva minute, prin forță cognitivă. Dar costul e mare, recuperarea e lungă, și pe termen lung sistemul se rupe. Asta e o parte din ce vedem la oamenii cu burnout — au cheltuit atenție pe ce nu cerea atenție.</p>' +
      '<p>Modelul „atenție ca resursă" e util în armată, în muncile foarte structurate, în sport de performanță — contexte în care obiectul e fix și mintea trebuie convinsă să-l țină. În viața obișnuită, e o falsă mecanică. Întrebarea reală nu e cum păstrezi atenția. E ce vrei să devii și ce relații merită construite cu lumea din jur. Atenția se duce singură acolo. Și dacă nu se duce, e un semnal — un semnal că viața pe care o trăiești nu mai e a ta. Acolo intervine mintea, cu întrebările ei despre sens. Creierul, singur, nu rezolvă problema.</p>' +
      '<p>De aceea, când vine cineva la mine și-mi spune „nu mă pot concentra", nu mă reped la neurofeedback. Întreb mai întâi: pe ce nu te poți concentra? Și de ce a ajuns acel ceva în calendarul tău? Răspunsurile sunt, de obicei, mai utile decât antrenamentul.</p>',
    category: 'Neuroștiință',
    date: '2026-04-05',
    readTime: '8 min citire',
    featured: false,
  },
  {
    title: 'Suferință mintală în România: ce vede un cercetător când iese din cabinet',
    slug: 'suferinta-mintala-romania-ce-vede-cercetatorul',
    excerpt:
      'Statistici, prejudecăți, sistem rupt în zece bucăți. Și totuși — ceva se mișcă. O privire onestă asupra a ce înseamnă, în 2026, să suferi mintal în România.',
    content:
      '<p>Lucrez la Veruvis de șapte ani. Am văzut peste 18.000 de Brain Map-uri. Iar dincolo de ele — oameni. Părinți, adolescenți, antreprenori, profesori, medici. Și am o observație care, statistic, nu se vede în nicio cercetare publicată: suferința mintală în România se trăiește în izolare aproape totală. Nu pentru că românii ar fi singuri biologic, ci pentru că nu există un limbaj public legitim pentru ce li se întâmplă.</p>' +
      '<p>În alte țări — Olanda, Germania, Marea Britanie — un adolescent în depresie are unde să se ducă. Are școală cu psiholog, are sistem GP care recunoaște semnele, are conversații publice care au normalizat termenul. La noi, depresia adolescentului încă se traduce ca „lene", „obrăznicie", „nu vrea să mănânce, dar se uită la telefon". Sau, în varianta urbană educată, ca „are nevoie de un coach". Limbajul lipsește, deci recunoașterea lipsește, deci accesul la ajutor lipsește.</p>' +
      '<p>Și totuși, ceva se schimbă. În ultimii cinci ani am văzut un val nou de tineri, în special 25-35 ani, care vin la cabinet cu un vocabular pe care părinții lor nu-l aveau. Vorbesc despre „triggers", despre „inner critic", despre „attachment style". Vocabularul e împrumutat (uneori sub-digerat), dar e prezent. Și prezența lui schimbă harta. Pentru prima dată, suferința mintală nu mai e o rușine privată, e o conversație publică. Generația asta va crește copii într-un context complet diferit de cel în care au crescut ei.</p>' +
      '<p>Dar fractura rămâne. Sistemul medical public e prost echipat: psihiatrii sunt suprasolicitați, psihologii decontați sunt puțini, terapia privată e scumpă, intervenția timpurie aproape inexistentă. Cei care pot plăti se descurcă. Cei care nu — și sunt majoritatea — rămân în zona gri unde diagnosticele se dau pe internet, medicația se ia după sfatul prietenilor, și „terapia" e, de fapt, un coach care a făcut un curs.</p>' +
      '<p>Ce poate face un cercetător aici? Nu mult, dacă rămâne în cabinet. Asta e una dintre motivele pentru care scriu — pentru că ce văd zi de zi e o resursă publică, nu doar privată. Dacă transmit corect ce înseamnă un Brain Map, ce înseamnă un diagnostic, ce e și ce nu e neurofeedback-ul, atunci poate că un părinte care îmi citește articolul va pune o întrebare diferită medicului. Sau va refuza să accepte „are ADHD, gata, asta e". Sau va cere o a doua opinie.</p>' +
      '<p>Asta e poziția mea civică: să fac știința accesibilă fără s-o simplific abuziv. Și să fac asta în limba română, nu în engleză academică. Pentru că suferința se trăiește în limba mamei, nu în limba congreselor.</p>',
    category: 'Societate',
    date: '2026-03-22',
    readTime: '9 min citire',
    featured: false,
  },
  {
    title: 'Performanța nu e ce crezi tu: nota despre creier și ambiție',
    slug: 'performanta-nu-e-ce-crezi-tu',
    excerpt:
      'Lucrez cu sportivi, antreprenori, executivi. Vin la cabinet pentru „peak performance". Pleacă, de obicei, cu o întrebare diferită — și mai utilă.',
    content:
      '<p>Mulți dintre clienții care vin la cabinet pentru performance optimization vor un singur lucru: să producă mai mult. Mai multe ore concentrate, mai multe decizii corecte, mai multă energie la sfârșit de zi. Sunt antreprenori, sportivi, executivi, oameni care funcționează deja foarte bine — dar care vor să funcționeze și mai bine. Și pentru asta vin la mine: să le văd creierul, să le spun unde e loc de optimizat.</p>' +
      '<p>Pe Brain Map, optimizarea e reală. Există pattern-uri care indică ineficiență — alfa pe frontal când ar trebui beta, theta crescută în task, oscilații care arată că sistemul nu e bine sincronizat. Pot face neurofeedback pe astea. Pot scoate, în trei-șase luni, o îmbunătățire măsurabilă. Asta e ce vând Veruvis-ul, asta e ce funcționează.</p>' +
      '<p>Dar — și aici intră mintea — am observat ceva în ultimii ani. Cei mai performanți clienți pe care i-am avut nu sunt cei cu Brain Map-ul cel mai curat. Sunt cei care, undeva pe parcurs, și-au pus o întrebare nouă: pentru ce vreau performanță? Întrebarea asta nu rezolvă creierul. Dar rezolvă mintea. Și fără mintea rezolvată, creierul optimizat e doar o mașinărie mai rapidă care merge în aceeași direcție greșită.</p>' +
      '<p>Am avut un client antreprenor — companie de 20 milioane EUR cifră de afaceri, douăzeci de angajați, cinci ani de creștere de două cifre. A venit pentru că nu mai dormea, nu mai gusta nimic, simțea că se golește. Brain Map-ul lui era într-adevăr suprasolicitat. Am început neurofeedback. După trei luni, dormea mai bine. După șase, era „aproape ca înainte". Dar într-o ședință mi-a spus: „înainte de ce?". Tăcere lungă.</p>' +
      '<p>De acolo, sesiunile s-au schimbat. Nu mai vorbeam doar despre creier. Vorbeam despre tatăl lui, care fusese mereu „cel mai bun din generația lui", și despre presiunea internă care-l împingea să demonstreze ceva. Vorbeam despre soția lui, care simțea că trăiește cu o umbră. Vorbeam despre fiica de doisprezece ani, pe care n-o cunoștea. Creierul putea fi optimizat. Dar dacă optimizam un creier care alerga după dragostea tatălui mort, nu făceam decât să-l fac să alerge mai repede.</p>' +
      '<p>Asta nu înseamnă că performanța nu contează. Contează. Dar e o întrebare care vine după altă întrebare: spre ce performezi? Și răspunsul ăla, dacă nu vine clar, transformă orice optimizare neurologică într-o tortură mai eficientă. De aceea, în practica mea, am început să trimit clienți de performance la psihoterapeuți în paralel cu neurofeedback-ul. Nu pentru că nu m-aș descurca singur cu creierul. Ci pentru că, fără mintea care să decidă ce face cu creierul optimizat, ce facem împreună e doar o variantă mai sofisticată de „mai mult". Și „mai mult" nu vindecă pe nimeni.</p>',
    category: 'Opinie',
    date: '2026-03-10',
    readTime: '8 min citire',
    featured: false,
  },
  {
    title: 'qEEG nu e citire în palmă: ce arată, ce nu arată, ce promit doar șarlatanii',
    slug: 'qeeg-nu-e-citire-in-palma',
    excerpt:
      'Brain Mapping-ul a devenit un produs de marketing. Vine timpul să separăm ce poate face un qEEG corect, făcut cu disciplină, de ce vând oamenii care l-au transformat într-un fel de horoscop neurologic.',
    content:
      '<p>De câțiva ani, „Brain Map" a devenit un termen pop. Apare în reclame, în clipuri TikTok, în „clinici" care promit personalitate, vocație, partener compatibil — toate citite din EEG. Vreau, ca cercetător care face qEEG zilnic, să trasez o linie clară între ce poate face cu adevărat metoda și ce e marketing.</p>' +
      '<p>qEEG — electroencefalografia cantitativă — măsoară activitatea electrică a creierului în mai multe puncte de pe scalp, simultan, în condiții standardizate (ochi deschiși, ochi închiși, sarcină cognitivă). Datele sunt apoi comparate cu o bază de date normativă (oameni de aceeași vârstă, sex) și apar diferențele. Asta e tot. Asta e ce face un qEEG corect.</p>' +
      '<p>Ce se vede în aceste diferențe? Pattern-uri statistice care corelează cu anumite stări: ADHD (theta crescută pe frontal), anxietate (beta crescută pe temporal drept), depresie majoră (asimetrie alfa frontal stânga-dreapta), traumă (instabilitate pe linia mediană), tulburări de somn (cicluri perturbate). Sunt corelații, nu certitudini. Un Brain Map cu pattern ADHD nu „diagnostichează" ADHD. Doar arată că, pe acest substrat, hipoteza ADHD trebuie luată în serios — alături de evaluare clinică, anamneză, observație comportamentală.</p>' +
      '<p>Ce nu poate face qEEG: nu citește gânduri, nu prezice viitor, nu arată „talente ascunse", nu măsoară inteligența, nu spune cu cine să te căsătorești, nu identifică „suflete vechi" sau „personalități indigo". Tot ce am enumerat sunt aplicații pe care le-am văzut promovate de furnizori care încearcă să transforme metoda într-un produs de divertisment. Sunt minciuni. Sunt extrem de profitabile, dar sunt minciuni.</p>' +
      '<p>Diferența practică pentru cineva care vrea să facă un Brain Map: caută cabinete în care metoda e folosită ca instrument clinic, integrat cu evaluare psihologică și plan terapeutic. Întreabă dacă se folosește o bază de date normativă recunoscută (BrainDX, NeuroGuide). Întreabă cine interpretează — un cercetător sau un terapeut formator. Refuză orice cabinet care îți promite „personalitatea ta în creier" sau „direcția vocațională din EEG". Astea sunt semne sigure că ai dat de șarlatani.</p>' +
      '<p>Iar pe partea practică, mai onestă: un qEEG corect făcut îți dă o hartă utilă, dar harta nu e teritoriul. Teritoriul rămâne viața ta — cu istoria ei, cu relațiile, cu deciziile. Brain Map-ul e un instrument în orchestra de evaluare, nu solistul. Cine îți promite că e singurul instrument de care ai nevoie, fie nu înțelege metoda, fie nu-i pasă că tu nu o înțelegi.</p>',
    category: 'Cercetare',
    date: '2026-02-26',
    readTime: '9 min citire',
    featured: false,
  },
]

  // Attach available cover images to the two flagship articles.
  for (const article of articles) {
    if (article.slug === 'ce-nu-vede-scoala-cand-spune-adhd') article.coverImage = coverAdhd
    if (article.slug === 'burnout-nu-se-vindeca-cu-o-vacanta') article.coverImage = coverBurnout
  }

  await upsertList(strapi, 'api::article.article', articles, 'slug')
}
