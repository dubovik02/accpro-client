// скрипт формирования sitemap.xml

const filePath = 'c:/temp/sitemap.xml';

const siteUrl = 'https://debit-credit.tech';

const mainTagOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const mainTagClose = '</urlset>';

const urlOpen = '<url>';
const urlClose = '</url>';

const changeTag = '<changefreq>monthly</changefreq>';
const priorityTag = '<priority>0.8</priority>';

let fileText = mainTagOpen + '\n';

cursor = db.sbdocs.find({share:true});
cursor.forEach((elem) => {
  fileText += urlOpen + '\n';
  fileText += `<loc>${siteUrl}/?id=${elem._id}</loc>` + '\n';
  fileText += changeTag + '\n';
  fileText += priorityTag + '\n';
  fileText += urlClose + '\n';
});

fileText += mainTagClose;

fs.writeFile(filePath, fileText, (err) => {
  if(err) throw err;
  console.log('Data has been replaced!');
});
