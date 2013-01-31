var nodeunit = require('nodeunit'),
    mongodb  = require('mongodb'),
    extractor = require('./extractor').extractor;

var expected_results = [
  { doc_id : "213515-2011",
    title : "Procedura aperta per la fornitura di n. 2 angiografi cardiologici fissi per l'UO di cardiologia del Presidio Ferrarotto.",
    description: "Procedura aperta per la fornitura di n. 2 angiografi cardiologici fissi per l'UO di Cardiologia del Presidio Ferrarotto.",
    lots : 1,
    total_price : { value : 1200000, currency : "EUR", excluding_vat : true },
    award_date : "27.6.2011",
    cpv_codes : [ "33111700" ],
    lot_detail : null
  },
  { doc_id : "177769-2011",
    title : "Eu-weite Ausschreibung Nr. 537 / Essensversorgung diverser Schulen.",
    description : "Dienstleistungskonzession / Bewirtschaftung der Schulkantinen zur Essensversorgung der drei Schulen.",
    lots : 1,
    total_price : null,
    award_date : null,
    cpv_codes : [ "55524000" ],
    lot_detail : null
  },
  { doc_id : "152163-2011",
    title : "\"Suministro de energía eléctrica a los puertos y dependencias del Ente Público Portos de Galicia\".",
    description : "Suministración de energía eléctrica en media tensión y en baja tensión para potencias superiores a 10 kW,a los diferentes puntos de consumo emplazados en los puertos y dependencias del Ente Público Portos deGalicia. Respecto a las características de las suministraciones, ver Pliego de Prescripciones Técnicas Particulares.",
    lots : 1,
    total_price : { value : 1736373, currency : "EUR", excluding_vat : true },
    award_date : null,
    cpv_codes : [ "09310000" ],
    lot_detail : null
  },
  { doc_id : "10001-2010",
    title : "Procedura aperta n. 110/2009.",
    description : "Fornitura di periodici italiani e stranieri per le Biblioteche Civiche Torinesi per il biennio 2010/2011.",
    lots : 3,
    total_price : { value : 450000, currency : "EUR", excluding_vat : null },
    award_date : "16.12.2009", // ought really pick up multiple per lot
    cpv_codes : [ "22200000" ],
    //lot_detail : [ { title : "Periodici italiani", price : { value : 275000, currency : "EUR", excluding_vat : null } },
    // first lots losses it's title!
    lot_detail : [ { title : "SECTION V: AWARD OF CONTRACT", price : { value : 275000, currency : "EUR", excluding_vat : null } },
                   { title : "LOT NO: 02 - TITLE Periodici stranieri.", price : { value : 132000, currency : "EUR", excluding_vat : null } },
                   { title : "LOT NO: 03 - TITLE Periodici italiani e stranieri per la Biblioteca Musicale \"A. della Corte\".", price : { value : 43000, currency : "EUR", excluding_vat : null } }  ]
  },
  { doc_id : "100442-2010",
    title : "Dostawa krzeseł.",
    description : "Sukcesywna dostawa krzeseł w maksymalnych ilościach określonych w załączniku nr 1 do umowy (załącznik nr. 1 do SIWZ) spełniające parametry oraz warunki techniczno-użytkowe określone w załączniku nr 5 do SIWZ.",
    lots : 1,
    total_price : { value : 72020, currency : "PLN", excluding_vat : true },
    award_date : "31.3.2010",
    cpv_codes : [ "39112000" ],
    lot_detail : null
  },
  { doc_id: "210189-2011",
    title: 'Kauf von 2 Stück 26 t Lkw-Fahrgestellen mit Kanalreinigungsaufbauten, aufgeteilt in 2 Lose.',
    description: 'Los1: 2 Fahrgestelle Radformel 6 x 2/4 mit hydraulisch gelenkter Vor- und Nachlaufachse, geeignet zum Anbau der Kanalreinigungsaufbauten aus Los 2. Los 2: 2 Stück Hochdruckspül- und Saugaufbauten mit Wasserrückgewinnung, geeignet zum Aufbau auf die Fahrgestelle aus Los 1.',
    lots: 2,
    total_price: null,
    award_date: '4.4.2011',
    cpv_codes: [ '34139100', '34144410' ],
    //lot_detail : [ { title : "Los 1 (Fahrgestelle)", price : { value : 220256, currency : "EUR", excluding_vat : true } },
    lot_detail : [ { title : "SECTION V: AWARD OF CONTRACT", price : { value : 220256, currency : "EUR", excluding_vat : true } },
                   { title : "LOT NO: 2 - TITLE Los 2 (Kanalreinigungsaufbauten).", price : { value : 492590, currency : "EUR", excluding_vat : true } } ]
  },
  { doc_id: '21021-2011',
    title: null,
    description: 'Mandat d\'études préalables pour l\'aménagement du quartier centre gare de la ville de Melun.',
    lots: 1,
    total_price: { value : 179000, currency : "EUR",  excluding_vat : null },
    award_date: '16.12.2010',
    cpv_codes: [ '71000000', '71541000' ],
    lot_detail : null
  },
  { doc_id: '210188-2011',
    title: 'Fourniture et livraison d\'une potence de levage et d\'un portique de levage roulant ainsi que leurs équipements annexes pour la manutention de bateaux et d\'embarcations sur la Base de loisirs de la Communauté de communes située à Malafretaz (01340), FRANCE.',
    description: 'Fourniture et livraison d\'une potence de levage et d\'un portique de levage roulant ainsi que leurs équipements annexes pour la manutention de bateaux et d\'embarcations sur la Base de Loisirs de la Communauté de communes située à Malafretaz (01340), FRANCE.',
    lots: 1,
    total_price: { value : 7456, currency : "EUR", excluding_vat : true },
    award_date: '14.6.2011',
    cpv_codes: [ '42410000' ],
    lot_detail : null
  },
  { doc_id: '13989-2011',
    title:  'Purchase and maintenance of finishing equipment.',
    description: 'Purchase and maintenance of a vertical suction collator, a collator with sheet feeder and equipment for Watkiss Powersquare 200.',
    lots: 2,
    total_price: { value: 222113, currency : 'EUR', excluding_vat : true },
    award_date: '25.11.2010',
    cpv_codes: [ '42991000' ],
    lot_detail : [ { title : "ection V: Award of contract", price : { value : 116168, currency : "EUR", excluding_vat : true } },
                   { title : "V.1)", price : { value : 105945, currency : "EUR", excluding_vat : true } } ]
  },
  { doc_id: '302975-2009',
    title: '9037c - mission pluriannuelle globale de communication dans le cadre du projet de rénovation urbaine.',
    description: 'Marché unique. Projets de rénovation urbaine des quartiers Neuhof, Meinau-Canardière, Cronenbourg et Hautepierre.',
    total_price: { value: ((250000+40000)/2), currency: 'EUR', excluding_vat: true, highest_offer : 250000, lowest_offer: 40000 },
    award_date: '15.10.2009',
    cpv_codes: [ '32584000' ] },
  { doc_id: '199874-2009',
    title: 'Réalisation de prestations de fourniture, de pose et d\'entretien de mobiliers urbains sur le territoire de la commune de Sucy-en-Brie.',
    description: 'Le présent marché a pour objet la réalisation de prestations de fourniture, de pose et d\'entretien de mobiliers urbains sur le territoire de la commune de Sucy-en-Brie. Le matériel proposé par le prestataire sera du matériel entièrement remis à neuf par le titulaire du marché (hors panneaux électroniques).',
    total_price: null,
    award_date: '13.7.2009',
    cpv_codes: [ '45233293', '50000000' ] },
  { doc_id: '36771-2011',
    title: 'Wynajem sali, zorganizowanie przerw kawowych z produktów dostarczonych przez zamawiającego dla 20 osób "Szkoły dla rodziców i wychowawców" w Lipnie.',
    description: 'Zajęcia będą odbywały się w godz: 16.00-19.30 w dniach 15, 26, 29 września, 6, 13, 20, 27 października, 3, 10, 17 listopada 2010 r. — wszystkie zajęcia w zakresie kursu mają się odbyć w jednym obiekcie, — sala na 20-25 osób, — wyposażenie (meble): stoły, miękkie krzesła dla 25 osób z możliwością przestawienia stołów i krzeseł, — wyposażenie sprzęt: mobilny sprzęt do projekcji, rzutnik multimedialny – wskazany, ekran, grafoskop – konieczne zapewnienie obsługi sprzętu, — zabezpieczenie sali pozwalające na pozostawienie sprzętu znacznej wartości np. komputerów, pomocy dydaktycznych, — miejsce na przerwę kawową, możliwość dostępu do naczyń Wykonawcy (nie plastikowe), przygotowanie poczęstunku z produktów dostarczonych przez Zamawiającego dla 15 osób, — możliwość zaparkowania w pobliżu miejsca szkolenia, — dostosowanie architektoniczne budynku do osób niepełnosprawnych, — wszystkie zajęcia w zakresie kursu mają się odbyć w jednym obiekcie sala na 20-25 osób, — wyposażenie (meble): stoły, miękkie krzesła dla 25 osób z możliwością przestawienia stołów i krzeseł, — wyposażenie sprzęt: mobilny sprzęt do projekcji, rzutnik multimedialny - wskazany, ekran, grafoskop – konieczne zapewnienie obsługi sprzętu, — zabezpieczenie sali pozwalające na pozostawienie sprzętu znacznej wartości np. komputerów, pomocy dydaktycznych, — miejsce na przerwę kawową, możliwość dostępu do naczyń Wykonawcy (nie plastikowe), przygotowanie poczęstunku z produktów dostarczonych przez Zamawiającego dla 15 osób, — możliwość zaparkowania w pobliżu miejsca szkolenia, — dostosowanie architektoniczne budynku do osób niepełnosprawnych.',
    total_price: { value: 1600, currency: 'PLN', excluding_vat : false },
    award_date: '24.8.2010',
    cpv_codes: [ '55300000' ] },
  { doc_id: '96102-2009',
    title: 'UK-Openshaw, Manchester,: Provision and Monitoring of Temporary Alarms.',
    description: 'Installation, monitoring, and subsequent removal of temporary alarms for vulneravble witnesses. Surveillance and security systems and devices.',
    total_price: null, // complete pricing structure -- what a nightmare!
    award_date: '20.1.2009',
    cpv_codes: [ '35120000' ] },
  { doc_id: '70751-2009',
    title: 'Appalto misto per l\'affidamento del servizio di sorveglianza, monitoraggio strutturale e lavori per controlli geodetici informatizzati mirati al risanamento delle opere d\'arte stradali a livello di attenzione statica in carico al Dipartimento XII.',
    description: '', // hmm - not the best...
    total_price: null, // also awful
    award_date: '18.2.2009',
    cpv_codes: [ '71700000' ] },
  { doc_id: '254761-2008',
    title: 'Hitelkeret nyújtási szerződés : Beruházási célú projektfinanszírozási hitelkeret biztosítása a Mecsek - Dráva hulladékgazdálkodási Projekt - KEOP 1.1.1. projekttel összefüggésben.',
    description: '6.400.000.000,- (hatmilliárd négyszázmillió) forint, vagy ennek megfelelő deviza összegű projektfinanszírozási hitelkeret biztosítása, hitelszerződés keretében, a Mecsek - Dráva Hulladékgazdálkodási Projekt - KEOP 1.1.1. projekttel összefüggésben, amely összeg teljes egészében a projekt keretében megvalósuló beruházás részleges és átmeneti ÁFA finanszírozására kerül felhasználásra. 6.400.000.000,- (hatmilliárd négyszázmillió) forint, vagy ennek megfelelő deviza összegű projektfinanszírozási hitelkeret biztosítása, hitelszerződés keretében, a Mecsek - Dráva Hulladékgazdálkodási Projekt - KEOP 1.1.1. projekttel összefüggésben, amely összeg teljes egészében a projekt keretében megvalósuló beruházás részleges és átmeneti ÁFA finanszírozására kerül felhasználására az alábbiakban meghatározott feltételekkel: — Futamidő: a szerződéskötéstől számított 23 év, — Rendelkezésre tartási idő: a szerződés megkötésétől számított 3 év, — Türelmi idő: a beruházás befejezését követő 1 évig (csak kamattörlesztés), — Tőketörlesztés: a türelmi időt követően 3 havonta történő ütemezésben, a kölcsönösen megállapított és elfogadott cash-flow terv alapján, annuitásos tőketörlesztéssel, — Tőketörlesztési időszak: a türelmi időszak lejárta után indul a futamidő végéig, — Feltöltési időszak: Legkésőbb a tőketörlesztési időszak megkezdéséig (a szerződéskötéstől számított 3. év vége), — Előtörlesztés: az ajánlatkérő előzetes értesítése alapján bármikor, Az ajánlatkérő az ÁFA finanszírozásból eredő kötelezettségét a hitelfelvételi időszakban visszatöltheti, — Kamatperiódus: naptári évenként 3 havonta, — Bármikor és akárhányszor HUF-ra, EUR-ra, USD-ra és CHF-re átváltható. A hitel összegének a lehívása a szerződés megkötését követő 3 éven belül több részletben a projekt megvalósulásának ütemében történik. A szerződés alatt a finanszírozó hitelintézettel kötött szerződés értendő. A hitel lehívása: hitel lehívása részletekben történik, az eszközök, eszközcsoportok készültségi fokának megfelelően.',
    total_price: 
     { lowest_offer: 9200391750,
       highest_offer: 9200391750,
       currency: 'HUF',
       value: 9200391750,
       excluding_vat: true },
    award_date: '24.9.2008',
    cpv_codes: [ '66113000' ] },
  { doc_id: '387057-2010',
    title: 'Mailing service.',
    description: 'The IPTS is drawing up a report called Scoreboard, an analysis of companies investing most in R+D. During the period 2010–2013, the IPTS wishes to send out several mailings concerning this report, which it is planned to publish once a year. There will therefore be a total of 4 mailings. Each annual mailing will include 1 300 copies of Scoreboard and up to 2 000 letters.',
    total_price: { value: 80495, currency: 'EUR', excluding_vat: true }, // tricky use of commas
    award_date: '18.10.2010',
    cpv_codes: [ '64111000', '64112000' ] },
  { // ARGH! subsection numbering is wrong as II.1.4 is missing!
    doc_id: '50188-2011',
    title: 'T099 relocation manager.',
    description: 'The European Central Bank (ECB) is constructing its new headquarters on the site of the former wholesale market hall in Frankfurt-on-Main, Germany. The successful contractor will be tasked with planning the relocation into the new premises on the new site, contracting out to tender the transport services, as well as the entire relocation management, and monitoring the return of the keys to the buildings currently occupied within the agreed deadline. Further general information on the project is available in the tender forum (see section I.1 for the Internet address).',
    total_price: null,
    award_date: null,
    cpv_codes: [ '79613000', '98392000', '72313000', '79418000' ] },
  { // completely different format...
    doc_id: '40612-2011',
    title: null,
    description: null,
    total_price: null,
    award_date: null,
    cpv_codes: [] },
  { doc_id: '58810-2009',
    title: 'Supply of 2 lots of chairs: 200 Fritz Hansen series 7 chairs or equivalent and 54 Van Severen Vitra 03 chairs or equivalent.',
    description: 'Supply of 2 lots of chairs:  a) for the executive rooms and executive restaurant at the Court of Justice (lot 1); b) for the library and other rooms (lot 2).',
    total_price: { value: 143074, currency: 'EUR', excluding_vat: true }, // €570ea - nice chairs!
    award_date: '11.9.2008',
    cpv_codes: [ '39112100' ] },
  { doc_id: '42780-2011',
    title: 'Reservation of places in private crèches for staff at the European Parliament in Brussels.',
    description: 'The European Parliament has decided to issue an invitation to tender in order to hire places in private, officially approved crèches in Brussels, which can be accessed easily from the European Parliament\'s buildings, for children aged between 3 and 36 months (lot 1) and children from 3 to 4 years old in nursery facilities (lot 2). ',
    total_price: null,
    award_date: null,
    cpv_codes: [ '85312110', '85312110', '85312110' ] },
  { doc_id: '175168-2010',
    title: 'Bristol Flood Risk and Drainage Investigations and Design Framework.',
    description: 'Description: The Framework will encompass skilled consultants that are able to deliver hydrology and hydrogeology studies relating to tidal/fluvial/pluvial/ground water/water course and urban drainage (including sewerage) to analyse the implications to the surrounding areas and improve flood risk management and drainage. Hydraulic models (1D/2D) will be an integral part for the delivery of the studies and will provide the basis for design of proposed improvements. Also sustainable drainage systems (SUDS) play a vital role in the protection of properties and include the potential for improvements of water quality. Civil, Mechanical and Electrical design capabilities and related services will also be required. It is anticipated that the additional items will also be undertaken through the framework: — Environmental Impact Assessment and related works, — Heath and Safety review and management of safety in projects, — Data Management, — Quality Assurance checks and preparation of Flood Risk Assessments / Flood Consequence Assessments, — Surface Water Management Plans, — Sustainable Urban Drainage and associated Water quality, — Integrated Urban Drainage studies, — Real Time Modelling, — Gathering Historic Flood Data, — Policy / Process development, — Training, — Public engagement, — Implementation plans and strategy, — Surveying and investigations.',
    total_price: 
     { lowest_offer:  50000000,
       highest_offer: 62000000,
       currency: 'GBP',
       value: 56000000,
       excluding_vat: true },
    award_date: '16.4.2010',
    cpv_codes: [ '45246400', '45246410' ] },
  { doc_id: '163472-2010',
    title: 'UK-London: development of phase 1 national efficiency data framework.',
    description: 'Better information about trends and drivers of energy consumption and carbon emissions on the demand side including households and other relatively small emitters in the non-domestic sector- is critical to the cost effective implementation of policies and targets set out in the UK Low Carbon Transition Plan. Data management services.',
    total_price: 
      { value: 173000,
        currency: 'GBP',
        excluding_vat: true },
    award_date: '18.5.2010',
    cpv_codes: [ '72322000' ] },
  { doc_id: '299925-2008',
    title: 'UK-Bristol: planned maintenance and ad hoc activities for drains.',
    description: 'Planned cleaning, maintenance and ad-hoc services for site drainage systems. Sewer cleaning services. Sewer survey services.',
    total_price: { value: 225000, lowest_offer: 150000, highest_offer: 300000, currency: 'GBP', excluding_vat: true },
    award_date: '7.11.2008',
    cpv_codes: [ '90470000', '90491000' ] },
  { doc_id: '106122-2010',
    title: 'UK-Coleraine: topographical services.',
    description: 'A6 Northern Transport Corridor, Londonderry to Dungiven - Geodetic Survey spanning a corridor length of 30 km and width of approximately 1 km.',
    total_price: 
     { lowest_offer:  300000,
       highest_offer: 500000,
       currency: 'GBP',
       value: 400000,
       excluding_vat: true },
    award_date: '3.3.2010',
    cpv_codes: [ '71351810' ] },
  { doc_id: '19559-2011',
    title: ' ',
    description: 'NSHousing has awarded the contract to a supplier who is providing all the required software, implementation and on-going support services to establish an enterprise works management system which includes automated scheduling, mobile working and SMS texting and which will be fully integrated with NS Housing\'s existing business systems.',
    total_price: 
     { lowest_offer: 171700,
       highest_offer: 581290,
       currency: 'GBP',
       value: 376495,
       excluding_vat: true },
    award_date: '12.1.2011',
    cpv_codes: [ '48000000', '72260000', '72250000', '72600000' ] },
  { doc_id: '134713-2011',
    title: 'Contract for the provision of homeless criminal justice and anti-social behaviour services.',
    description: 'A service to provide an assessment, advice and referral service for both high risk rough sleepers who have a range of forensic histories and for individuals who may or may not be sleeping rough, but who are engaged in anti-social behaviour such as begging or street drinking. The service shall include assessment, advice, referrals and casework.',
    total_price: { value: 750000, currency: 'GBP', excluding_vat: true },
    award_date: '24.2.2011',
    cpv_codes: [ '85000000', '85312000' ] },
  { doc_id: '221485-2006',
  title: 'Investeerimislaen.',
  description: 'Investeerimislaen.',
  total_price: { value: 528717441, currency: 'EEK', excluding_vat: true }, // actual value debatable
  award_date: '8.6.2006',
  cpv_codes: [ '66100000' ] }
];

expected_results.forEach(function(document, index) {
  exports['testExtractorOn_doc_' + document.doc_id] = function(test) {
    mongodb.Db.connect("mongodb://localhost:27017/opented", function(err, db) {
      db.collection("structdumps", function(err, collection) {
        collection.findOne({ tab: { $ne : "data" }, doc_id : document.doc_id }, function(err, item) {
          if (item === null ) { console.log(err); }

          var extracted = extractor(item);

          // ignore these for now
          delete document.lots;
          delete document.lot_detail;

          test.deepEqual(extracted, document);

          db.close();
          test.done();
        });
      });
    });
  };
});


// interesting other doc_ids
// 210183-2011 - 3 lots but no detail
// 210185-2011 - 4 lots but no prices
//
// 209996-2011 - price range!
// 
// currentlanguage:
// 114097-2011 - blank?!
// 13989-2011
//
// 88113-2010 - urgh!
// 88115-2010
