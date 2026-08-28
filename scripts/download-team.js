const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '..', 'public', 'assets', 'team');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const members = [
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/SagarSingh.jpg', file: 'SagarSingh.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Abhay.jpg', file: 'Abhay.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Yogesh.jpg', file: 'Yogesh.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Saklesh.jpg', file: 'Saklesh.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Anantha.jpg', file: 'Anantha.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Shreya%20P%20V.jpg', file: 'ShreyaPV.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Aadya.jpeg', file: 'Aadya.jpeg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/SagarNM.jpg', file: 'SagarNM.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Pranav.jpg', file: 'Pranav.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Aashish.jpg', file: 'Aashish.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Rahul.jpeg', file: 'Rahul.jpeg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Shresht.JPG', file: 'Shresht.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Priyanka.jpeg', file: 'Priyanka.jpeg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/PrerikaP.jpeg', file: 'PrerikaP.jpeg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Nikitha.jpeg', file: 'Nikitha.jpeg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Suma.jpg', file: 'Suma.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/SanjanaS.jpg', file: 'SanjanaS.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Panchami.jpg', file: 'Panchami.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Rachit.jpeg', file: 'Rachit.jpeg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Mansoor.jpg', file: 'Mansoor.jpg' },
  { url: 'https://raw.githubusercontent.com/nisbweb/nisbweb.github.io/master/assets/cores25-26/Amol.jpg', file: 'Amol.jpg' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting download of ${members.length} team images...`);
  for (const m of members) {
    const target = path.join(dir, m.file);
    try {
      await download(m.url, target);
      console.log(`✓ Cached: ${m.file} (${(fs.statSync(target).size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`✗ Error downloading ${m.file}:`, e.message);
    }
  }
  console.log('All team images cached successfully!');
}

run();
