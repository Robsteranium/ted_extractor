// helpers
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

getContentsForRegex = function(sections, regex) {
  var contents = [];
  sections.forEach( function(section) {
    section.subsections.forEach( function(subsection) {
      if(regex.exec(subsection.title) != null) {
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

getSubSectionsForNumber = function(sections, number) {
  var subSections = [];
  sections.forEach( function(section) {
    section.subsections.forEach( function(subsection) {
      if(subsection.number == number) {
        subSections.push(subsection);
      }
    });
  });
  return subSections;
}
getSubSectionForNumber = function(sections, number) {
  return getSubSectionsForNumber(sections, number)[0]; // ignores multiples, takes first
}

// section specific
getTitle = function(sections) {
  //Title attributed to the contract
  var theSubsection = getSubSectionForNumber(sections, "II.1.1)");
  if (theSubsection != null) {
    var title_contents = theSubsection.content
    //if (title_contents.length > 1) { throw "multiple title content" };
    if (title_contents === undefined) {
      return null;
    } else {
      return title_contents[0].replace(/\n/g," ");
    }
  } else {
    return null;
  }
}

countLots = function(sections) {
  // first lot is section with title "SECTION V: AWARD OF CONTRACT" and following lots are sections titled like LOT NO: 03 - TITLE ..."
  lot_count = 0;
  if( getSectionForTitleExact(sections, "SECTION V: AWARD OF CONTRACT").length == 1) { lot_count++; }
  lot_count += getSectionForTitleRegex(sections, /LOT NO: \d/).length;
  return lot_count;
}


// Price
// places to look
// section title matches case-insensitive regex: "Total final value of contract", "INFORMATION ON VALUE OF CONTRACT"
// content may have multiple rows
// find row starting with "Value..."
// find row with "Lowest offer XXXXXX and highest offer XXXXXXX YYY"
// if multiple, take first
// ignore all else
// look for "Excluding VAT" or "Including VAT"

// If annual or monthly value number of years

var rangeSeparators = [ /and highest offer/, /to/, /-/ ];

getPriceFromContents = function(contents) {
  contents = contents.reverse(); // reverse to ensure later prices clobber earlier ones
  var details = null;
  try {
    var value_row = contents.filter( function(row) { return /^Value/i.test(row) })[0]; // if multiple matches, take first
    var vat_row = contents.filter( function(row) { return /VAT/.test(row) })[0]; // if multiple matches, take first
    var range_row = contents.filter( function(row) { 
      return rangeSeparators.some( function(re) {
        return re.test(row);
      });
    })[0]; // if multiple matches, take first
    //if (range_row == null) {
    //  var range_row = contents.filter( function(row) { return /-/.test(row) })[0]; // if multiple matches, take first
    //}
    
    if (value_row != undefined && !/-/.test(value_row)) {
      if (value_row == vat_row) {
        var split_point = value_row.search(/cluding/i) - 3;
        value_row = value_row.slice(0, split_point);
        vat_row   = vat_row.slice(split_point, -1);
      }
      details = cleanPriceString(value_row, vat_row);
    } else if (range_row != undefined) {
      details = cleanPriceRangeString(range_row, vat_row);
    }
  }
  catch (e) {
    //console.log("Skipped Price ");
    //throw(e);
  }
  return details
}

contentsIsTooLong = function(contents) {
  return contents.filter(function(c) { return c.length > 100} ).length > 0
}

getTotalFinalPriceDetails = function(sections) {
  var price_details = null;
  var ignore_notice = false;

  contentsOfSectionsToLookIn = getContentsForRegex(sections, /total final value of contract/i).reverse(); // so first one clobbers last

  contentsOfSectionsToLookIn.forEach(function(contents) {
    if(!ignore_notice) {
      if (contentsIsTooLong(contents)) { // if any rows are too long!
        ignore_notice = true;
      } else {
        price_details = getPriceFromContents(contents); 
      }
    }
  });

  if (price_details == null && !ignore_notice) {
    contentsOfSectionsToLookIn = getContentsForRegex(sections, /information on value of contract/i);
    if (contentsOfSectionsToLookIn.length == 1) {
      contents = contentsOfSectionsToLookIn[0];
      if (!contentsIsTooLong(contents)) {
        price_details = getPriceFromContents(contents);
      }
    }
  }

  // do in analysis afterwards
  //if( price_details != undefined && price_details.value > 50000000000) {
  //  throw("very high value");
  //}

  return price_details;
}


/*oldgetTotalFinalPriceDetails = function(sections) {*/
  //var price_details = null;
  //["TOTAL FINAL VALUE OF CONTRACT(S)",
   //"Total final value of contract(s)",
   //"Total final value of contract(s):"].forEach(function(title) {
     //price_contents = getContentsForTitle(sections, title);
     //if (!price_contents.length == 0) {
       //if (price_contents.length > 1) { throw "multiple price contents" };
       //price_array  = price_contents[0];
       //price_string = price_array[0];
       //tax_string = price_array[1];
       //if (price_string) {
         //price_details = cleanPriceString(price_string, tax_string);
       //}
     //}
   //});
  //if (price_details == null) {
    //price_contents = getContentsForTitle(sections, "INFORMATION ON VALUE OF CONTRACT");
    //if (price_contents.length == 1) {
      //price_array = price_contents[0];
      //price_string = price_array.filter( function(e) { return /\d/.test(e); })[0];
      //tax_string = price_array.filter( function(e) { return /VAT/.test(e); })[0];
      //if (price_string) {
        //price_details = cleanPriceString(price_string, tax_string);
      //}
    //}
  //}
  //return price_details;
/*}*/

cleanPriceString = function(price_string, tax_string) {
  price_details = {};
  price_parts            = price_string.split(',').filter( function(e) { return e != ""});
  //value_digits           = price_parts[0].match(/\d/g);
  value_parts            = price_parts[0].match(/(\d?\d?\d )*\d\d\d/g );
  value_digits           = value_parts[0].match(/\d/g);
  if (value_digits) {
    value_string           = value_digits.join('');
    price_details.value    = parseInt(value_string, 10);
    if(price_parts.length > 1) {
     currency_portion = price_parts.slice(-1)[0].match(/[A-Z]/g)
     if (currency_portion == undefined ) {
       currency_portion = price_parts[0].slice(5,-1).match(/[A-Z]/g) // move past "value" bit
     }
     price_details.currency = currency_portion.join('').trim(); // allows skipping of range
    } else {
     price_details.currency = price_string.substr(-3,3);
    }
    price_details.excluding_vat = parseTaxString(tax_string);
  }
  return price_details;
}

cleanPriceRangeString = function(price_string, tax_string) {
  price_details = {};
  var range_pieces = []
  var i = 0;
  do {
    var rs = rangeSeparators[i];
    range_pieces = price_string.split(rs);
    i += 1;
  } while ( i <= rangeSeparators.length && range_pieces.length == 1);
  var low  = range_pieces[0].split(",")[0].match(/(\d?\d?\d )*\d\d\d/g )[0];
  var high = range_pieces[1].split(",")[0].match(/(\d?\d?\d )*\d\d\d/g )[0];

  price_details.lowest_offer = parseInt( low.match(/\d/g).join(''), 10 );
  price_details.highest_offer = parseInt( high.match(/\d/g).join(''), 10 );
  price_details.currency = range_pieces[1].substr(-3,3);
  price_details.value =  ( price_details.highest_offer +   price_details.lowest_offer) /2
  price_details.excluding_vat = parseTaxString(tax_string);
  return price_details;
}

parseTaxString = function(tax_string) {
  if (tax_string) {
    if(/Excluding VAT/i.test(tax_string)) {
      return true;
    } else if (/Including VAT/i.test(tax_string)) {
      return false;
    }
  } else {
    return null;
  }
}


getDescription = function(sections) {
  // Short description of the contract or purchase(s)
  //var subSection = getSubSectionForNumber(sections, "II.1.4)")
  var content = getContentsForRegex(sections, /description of the contract/i)[0];
  if (content != null) {
    return content.join(" ").replace(/\n/g," ");
  } else {
    return null;
  }
}

getAwardDate = function(sections) {
  //Date of contract award decision:
  var subSection = getSubSectionForNumber(sections, "V.1)")
  var result = null;
  if (subSection != undefined) {
    var content = subSection.content
    if (content != undefined) {
      if (content[0] != undefined) {
        result = content[0].replace(/\.$/,"");
      }
    }
  } else {
    result = null;
  }
  return result;
}

getCPVcodes = function(sections) {
  //Common procurement vocabulary (CPV);
  //var content = getSubSectionForNumber(sections, "II.1.5)").content;
  var content = getContentsForRegex(sections, /common procurement vocabulary/i);
  while( content.length == 1 ) {
    content = content[0];
  }
  if (typeof content === 'string') {
    var non_comma_cpvs = content.split(', ');
  } else {
    var non_comma_cpvs = content.filter( function(i) { return(i != ', ')})
  }
  var cpvs = non_comma_cpvs.map( function(i) { 
    var cleaned_cpv = "";
    if (typeof i === 'string') {
      cleaned_cpv = i.replace(".", "") 
    } else {
      cleaned_cpv = String(i).replace(".", "")
    }
    return( cleaned_cpv ) 
  });
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

// whole thing
exports.extractor = function(doc) {
  var results = {}
  try {
    if (doc && !doc.sections.length == 0) {
      results.doc_id      = doc.doc_id;
      results.title       = getTitle(doc.sections);
      results.description = getDescription(doc.sections);
      //results.lots        = countLots(doc.sections);
      results.total_price = getTotalFinalPriceDetails(doc.sections);
      results.award_date  = getAwardDate(doc.sections);
      results.cpv_codes   = getCPVcodes(doc.sections);
      //results.lot_detail  = null;
      //if (results.lots > 1) {
      //  results.lot_detail = getLotDetail(doc.sections);
      //}
    }
    return results;
  } catch (e) {
    console.log("Error processing " + doc.doc_id);
    throw(e);
  }
};

