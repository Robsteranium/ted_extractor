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
  }
];

expected_results.forEach(function(document, index) {
  exports['testExtractorOn_doc_' + document.doc_id] = function(test) {
    mongodb.Db.connect("mongodb://localhost:27017/opented", function(err, db) {
      db.collection("structdumps", function(err, collection) {
        collection.findOne({ tab: "summary", doc_id : document.doc_id }, function(err, item) {
          if (item === null ) { console.log(err); }
          var extracted = extractor(item);
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
