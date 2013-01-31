#TED Extractor

This extractor is designed to build upon the work of [opented.org](http://opented.org). We wanted to add to the existing data in order to distinguish different lots and identify prices and currencies (the existing coverage was quite low <5%).

The extractor runs on a `structdumps` collection cloned from the [opented.org mongodb](https://github.com/datasets/opented).

The result is of the form:

    {
      "_id" : ObjectId("50d8a30bc269b12a83fe69a6"),
      "doc_id" : "210180-2011",
      "title" : "Dostawa telefonów komórkowych i modemów USB WWAN.",
      "description" : "Przedmiotem zamówienia jest dostarczenie fabrycznie nowego sprzętu w następującym asortymencie i ilościach podanych tabeli poniżej. Zamówienie zostało podzielone na 6 części. Dla części Nr Nazwa sprzętu Ilość szt. 1 Aparat telefonii komórkowej AT1 6 2 Aparat telefonii komórkowej AT2 111 3 Aparat telefonii komórkowej AT3 684 4 Aparat telefonii komórkowej AT4 605 5 Aparat telefonii komórkowej AT5 4 6 Modem USB 25 2. Istotne warunki realizacji zamówienia. 2.1. Oferowany sprzęt ma być dostępny na rynku, niedopuszczalne są produkty prototypowe i dopiero tworzone pod konkretne zamówienie. 2.2. W oparciu o art. 87 ust. 1 ustawy Prawo zamówień publicznych Zamawiający zastrzega sobie prawo do wezwania Wykonawcy do przedstawienia dodatkowych wyjaśnień dotyczących złożonej oferty, w tym również do przedstawienia próbek oferowanego sprzętu, w czasie i miejscu wskazanym przez Zamawiającego. 2.3. Całość dostawy należy dostarczyć do niżej wymienionych lokalizacji w terminie 14 dni od podpisania umowy. 2.4. Sprzęt należy dostarczyć do lokalizacji: 1 Rejon Wsparcia Teleinformatycznego Sił Powietrznych – 61-330 Poznań 24 Babki, ul. Babicka 1; 2 Rejon Wsparcia Teleinformatycznego Sił Powietrznych – 85-915 Bydgoszcz, ul. Szubińska 105; 3 Rejon Wsparcia Teleinformatycznego Sił Powietrznych – 30-901 Kraków 50, Balice. 4 Rejon Wsparcia Teleinformatycznego Sił Powietrznych – 00-908 Warszawa, ul. Radiowa 2. Jednostki Wojskowej 4430, 63-100 Śrem, ul. Sikorskiego 2. Podział sprzętu na poszczególne lokalizacje zostanie określony w zawartej umowie. 2.5. Wraz z wykonaną dostawą sprzętu Wykonawca dostarczy w w/w lokalizacje elektroniczny wykaz numerów fabrycznych sprzętu i nr IMEI. 2.6. Na dostarczony sprzęt wykonawca udzieli 24 miesięcznej gwarancji. Baterie będą podlegały wymianie gwarancyjnej w przypadku utraty przez nie 50 % pierwotnej pojemności, mierzonej czasem pracy sprzętu (w trybie czuwania) po pełnym naładowaniu baterii w sprzęcie do jakiego jest przeznaczona w stosunku do czasu pracy w trybie czuwania określonego przez producenta w specyfikacji technicznej sprzętu.",
      "lots" : 6,
      "total_price" : {
        "value" : 846199,
        "currency" : "PLN",
        "excluding_vat" : true
      },
      "award_date" : "21.6.2011",
      "cpv_codes" : [
        "32250000",
        "32552410"
      ],
      "lot_detail" : [
        {
          "title" : "SECTION V: AWARD OF CONTRACT",
          "price" : {
            "value" : 8780,
            "currency" : "PLN",
            "excluding_vat" : true
          }
        },
        {
          "title" : "LOT NO: 2 - TITLE Dostawa telefonów komórkowych i modemów USB WWAN.",
          "price" : {
            "value" : 162439,
            "currency" : "PLN",
            "excluding_vat" : true
          }
        },
        {
          "title" : "LOT NO: 3 - TITLE Dostawa telefonów komórkowych i modemów USB WWAN.",
          "price" : {
            "value" : 361463,
            "currency" : "PLN",
            "excluding_vat" : true
          }
        },
        {
          "title" : "LOT NO: 4 - TITLE Dostawa telefonów komórkowych i modemów USB WWAN.",
          "price" : {
            "value" : 196747,
            "currency" : "PLN",
            "excluding_vat" : true
          }
        },
        {
          "title" : "LOT NO: 5 - TITLE Dostawa telefonów komórkowych i modemów USB WWAN.",
          "price" : {
            "value" : 6504,
            "currency" : "PLN",
            "excluding_vat" : true
          }
        },
        {
          "title" : "LOT NO: 6 - TITLE Dostawa modemów USB WWAN.",
          "price" : {
            "value" : 7113,
            "currency" : "PLN",
            "excluding_vat" : true
          }
        }
      ]
    }


## Context on the opented.org mongo 'schema'

The mongodb has several collections:
 - `dumps` which has `doc_id`s and `zhtml` (compressed html presumably from a webscrape - I can't find the scraper)
 - `structdumps` which combines two types of documents as per two of the tabs on TED:
   - { tab : "summary" } - which include the full contents of the notices separated into sections/ subsections
   - { tab : "data" } - which include the tabulated data from TED
 - `cleandata` which provides the cleaned data

The schema for the latter two collections is as follows (parsed with [variety](https://github.com/variety/variety))

### structdumps
    MongoDB shell version: 2.2.1
    connecting to: opented
    Variety: A MongoDB Schema Analyzer
    Version 1.2.2, released 04 November 2012
    Using limit of 1462082
    Using maxDepth of 99
    creating results collection: structdumpsKeys
    removing leaf arrays in results collection, and getting percentages
    { "_id" : { "key" : "_id" }, "value" : { "type" : "ObjectId" }, "totalOccurrences" : 1462082, "percentContaining" : 100 }
    { "_id" : { "key" : "doc_id" }, "value" : { "type" : "String" }, "totalOccurrences" : 1462082, "percentContaining" : 100 }
    { "_id" : { "key" : "tab" }, "value" : { "type" : "String" }, "totalOccurrences" : 1462082, "percentContaining" : 100 }
    { "_id" : { "key" : "timestamp" }, "value" : { "type" : "Date" }, "totalOccurrences" : 1462082, "percentContaining" : 100 }
    { "_id" : { "key" : "sections" }, "value" : { "type" : "Array" }, "totalOccurrences" : 744843, "percentContaining" : 50.94399630116505 }
    { "_id" : { "key" : "sections.XX.subsections" }, "value" : { "type" : "Array" }, "totalOccurrences" : 744842, "percentContaining" : 50.94392790554839 }
    { "_id" : { "key" : "sections.XX.subsections.XX.content" }, "value" : { "type" : "Array" }, "totalOccurrences" : 744842, "percentContaining" : 50.94392790554839 }
    { "_id" : { "key" : "sections.XX.subsections.XX.number" }, "value" : { "type" : "String" }, "totalOccurrences" : 744842, "percentContaining" : 50.94392790554839 }
    { "_id" : { "key" : "sections.XX.subsections.XX.title" }, "value" : { "type" : "String" }, "totalOccurrences" : 744842, "percentContaining" : 50.94392790554839 }
    { "_id" : { "key" : "sections.XX.title" }, "value" : { "type" : "String" }, "totalOccurrences" : 744842, "percentContaining" : 50.94392790554839 }
    { "_id" : { "key" : "DS" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "HD" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "PR" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "RP" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "TY" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "NC" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "ND" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "PC" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "PD" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "TI" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "TD" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "AA" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "AC" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.05600369883495 }
    { "_id" : { "key" : "CY" }, "value" : { "type" : "String" }, "totalOccurrences" : 717239, "percentContaining" : 49.056003698: 49.05600369883495 }
    { "_id" : { "key" : "TW" }, "value" : { "type" : "String" }, "totalOccurrences" : 717238, "percentContaining" : 49.05593530321829 }
    { "_id" : { "key" : "AU" }, "value" : { "type" : "String" }, "totalOccurrences" : 717236, "percentContaining" : 49.05579851198497 }
    { "_id" : { "key" : "OC" }, "value" : { "type" : "String" }, "totalOccurrences" : 479627, "percentContaining" : 32.80438443261048 }
    { "_id" : { "key" : "IA" }, "value" : { "type" : "String" }, "totalOccurrences" : 307985, "percentContaining" : 21.064823997559646 }
    { "_id" : { "key" : "RC" }, "value" : { "type" : "String" }, "totalOccurrences" : 305996, "percentContaining" : 20.928785116019487 }
    { "_id" : { "key" : "DT" }, "value" : { "type" : "String" }, "totalOccurrences" : 29764, "percentContaining" : 2.0357271343194157 }
    { "_id" : { "key" : "DD" }, "value" : { "type" : "String" }, "totalOccurrences" : 16517, "percentContaining" : 1.129690400401619 }


### cleandata
    MongoDB shell version: 2.2.1
    connecting to: opented
    Variety: A MongoDB Schema Analyzer
    Version 1.2.2, released 04 November 2012
    Using limit of 259604
    Using maxDepth of 99
    creating results collection: cleandataKeys
    removing leaf arrays in results collection, and getting percentages
    { "_id" : { "key" : "_id" }, "value" : { "type" : "ObjectId" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "auth_type" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "contract_type" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "title" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "orig_cpv_code" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "timestamp" }, "value" : { "type" : "Date" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "pub_year" }, "value" : { "type" : "Number" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "pub_date" }, "value" : { "type" : "Date" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "doc_type" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "proc_type" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "country" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "oj_ed" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "auth_name" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "pub_sn" }, "value" : { "type" : "Number" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "doc_id" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "cpv" }, "value" : { "type" : "String" }, "totalOccurrences" : 259604, "percentContaining" : 100 }
    { "_id" : { "key" : "cpv_code_class" }, "value" : { "type" : "String" }, "totalOccurrences" : 216099, "percentContaining" : 83.24178363969739 }
    { "_id" : { "key" : "cpv_text" }, "value" : { "type" : "String" }, "totalOccurrences" : 216099, "percentContaining" : 83.24178363969739 }
    { "_id" : { "key" : "cpv_code_cat" }, "value" : { "type" : "String" }, "totalOccurrences" : 216099, "percentContaining" : 83.24178363969739 }
    { "_id" : { "key" : "cpv_code_div" }, "value" : { "type" : "String" }, "totalOccurrences" : 216099, "percentContaining" : 83.24178363969739 }
    { "_id" : { "key" : "cpv_code_group" }, "value" : { "type" : "String" }, "totalOccurrences" : 216099, "percentContaining" : 83.24178363969739 }
    { "_id" : { "key" : "cpv_code" }, "value" : { "type" : "String" }, "totalOccurrences" : 216099, "percentContaining" : 83.24178363969739 }
    { "_id" : { "key" : "value_vat" }, "value" : { "type" : "Boolean" }, "totalOccurrences" : 17552, "percentContaining" : 6.761066855672486 }
    { "_id" : { "key" : "value_currency" }, "value" : { "type" : "String" }, "totalOccurrences" : 12605, "percentContaining" : 4.855472180705998 }
    { "_id" : { "key" : "value_local" }, "value" : { "type" : "Number" }, "totalOccurrences" : 12605, "percentContaining" : 4.855472180705998 }
    { "_id" : { "key" : "value" }, "value" : { "type" : "Number" }, "totalOccurrences" : 12356, "percentContaining" : 4.759556863530609 }
    { "_id" : { "key" : "value_local.floatApprox" }, "value" : { "type" : "Number" }, "totalOccurrences" : 767, "percentContaining" : 0.2954499930663626 }
    { "_id" : { "key" : "value.floatApprox" }, "value" : { "type" : "Number" }, "totalOccurrences" : 142, "percentContaining" : 0.05469869493536309 }

## Problems

The script to scraped structured data from the raw html to the `structdumps` collection has seems only to have operated on notices with `summary` or `data` tabs. This means that notices without this tab are missing. The shortfall seems to particularly affect UK notices. Further investigation has shown that the missing notices do have the contents on an `Original Language` tab (presumably then this has something to do with language translation). Unfortunately the script used to load `structdumps` and `cleandata` doesn't appear to have been made available so I'm currently considering rewriting it...

The script also seems to have missed out the first lot title for multi-lot award notices (this having been clobbered or otherwise confused with the section heading) as can be seen above.

## See Also

http://opented.org
https://github.com/datasets/opented

