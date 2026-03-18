import fs from 'fs';
import Papa from 'papaparse';

async function test() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/153OocA25gmPaynCxCjJQKVZa2abVJ44lsDZv25U0ul8/gviz/tq?tqx=out:csv&sheet=Journal");
  const text = await res.text();
  
  const results = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim()
  });

  results.data.forEach((row, idx) => {
    const title = row.Title || row.name || row['Post Title'];
    const slug = row.Slug || row.slug || row.id;
    console.log(`Row ${idx+1}: Title='${title}' slug='${slug}' Image='${row.Featured_Image}' Date='${row.Date}'`);
  });
}

test();
