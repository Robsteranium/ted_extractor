getContentsForTitle = function(sections, title) {
  var contents = [];
  sections.forEach( function(section) {
    section.subsections.forEach( function(subsection) {
      if(subsection.title === title) {
        if(subsection.content) {
          contents.push(subsection.content);
        }
      }
    });
  });
  return contents;
}

getSectionForTitleExact = function(sections, title) {
  return sections.filter( function(section) {
    return( section.title === title );
  });
}

getSectionForTitleRegex = function(sections, regex) {
  return sections.filter( function(section) {
    return( regex.exec(section.title) != null);
  });
}


getTitle = function(sections) {
  var title_contents = getContentsForTitle(sections, "Title attributed to the contract");
  if (title_contents.length > 1) { throw "multiple title content" };
  if (title_contents[0] === undefined) {
    return null;
  } else {
    return title_contents[0][0];
  }
}

countLots = function(sections) {
  // first lot is section with title "SECTION V: AWARD OF CONTRACT" and following lots are sections titled like LOT NO: 03 - TITLE ..."
  lot_count = 0;
  if( getSectionForTitleExact(sections, "SECTION V: AWARD OF CONTRACT").length == 1) { lot_count++; }
  lot_count += getSectionForTitleRegex(sections, /LOT NO: \d/).length;
  return lot_count;
}

getTotalFinalPriceDetails = function(sections) {
  var price_details = null;
  ["TOTAL FINAL VALUE OF CONTRACT(S)",
   "Total final value of contract(s)"].forEach(function(title) {
     price_contents = getContentsForTitle(sections, title);
     if (!price_contents.length == 0) {
       if (price_contents.length > 1) { throw "multiple price contents" };
       price_array  = price_contents[0];
       price_string = price_array[0];
       tax_string = price_array[1];
       if (price_string) {
         price_details = cleanPriceString(price_string, tax_string);
       }
     }
   });
  if (price_details == null) {
    price_contents = getContentsForTitle(sections, "INFORMATION ON VALUE OF CONTRACT");
    if (price_contents.length == 1) {
      price_array = price_contents[0];
      price_string = price_array.filter( function(e) { return /\d/.test(e); })[0];
      tax_string = price_array.filter( function(e) { return /VAT/.test(e); })[0];
      if (price_string) {
        price_details = cleanPriceString(price_string, tax_string);
      }
    }
  }
  return price_details;
}

cleanPriceString = function(price_string, tax_string) {
  price_details = {};
  price_parts            = price_string.split(',');
  value_digits           = price_parts[0].match(/\d/g);
  if (value_digits) {
    value_string           = value_digits.join('');
    price_details.value    = parseInt(value_string, 10);
    if(price_parts.length > 1) {
     price_details.currency = price_parts.slice(-1)[0].match(/[A-Z]/g).join('').trim(); // allows skipping of range
    } else {
     price_details.currency = price_string.substr(-3,3);
    }
    if (tax_string) {
     if (tax_string === "Excluding VAT") {
       price_details.excluding_vat = true;
     }
    } else {
     price_details.excluding_vat = null;
    }
  }
  return price_details;
}

getDescription = function(sections) {
  var contents = getContentsForTitle(sections, "Short description of the contract or purchase(s)");
  if (contents.length > 1) { throw "multiple description content" };
  return contents[0].join(" ");
}

getAwardDate = function(sections) {
  var contents = getContentsForTitle(sections, "Date of contract award decision:");
  //if (contents.length > 1) { throw "multiple date content"; }
  if (contents.length == 0) { return null; }
  return contents[0][0];
}

getCPVcodes = function(sections) {
  var contents = getContentsForTitle(sections, "Common procurement vocabulary (CPV)");
  //if (contents.length > 1) { throw "multiple date content"; }
  if (contents.length == 0) { return null; }
  var cpvs = contents[0].filter( function(i) { return(i != ', ')});
  return cpvs;
}

getLotDetail = function(sections) {
  var lot_sections = []
  lot_sections.push( getSectionForTitleExact(sections, "SECTION V: AWARD OF CONTRACT")[0] ); // these lots have no title
  getSectionForTitleRegex(sections, /LOT NO: \d/).forEach( function(section) { lot_sections.push(section); })

  var lot_detail = []

  lot_sections.forEach( function(section) {
    lot = {};
    lot.title = section.title;
    lot.price = getTotalFinalPriceDetails([section]);
    lot_detail.push(lot);
  });
  
  return lot_detail;
}

exports.extractor = function(doc) {
  var results = {}
  try {
    if (doc && !doc.sections.length == 0) {
      results.doc_id      = doc.doc_id;
      results.title       = getTitle(doc.sections);
      results.description = getDescription(doc.sections);
      results.lots        = countLots(doc.sections);
      results.total_price = getTotalFinalPriceDetails(doc.sections);
      results.award_date  = getAwardDate(doc.sections);
      results.cpv_codes   = getCPVcodes(doc.sections);
      results.lot_detail  = null;
      if (results.lots > 1) {
        results.lot_detail = getLotDetail(doc.sections);
      }
    }
    return results;
  } catch (e) {
    console.log("Error processing " + doc.doc_id);
    throw(e);
  }
};

