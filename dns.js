var rootTld = 'test.com'; // change to your targets root tld

var wordlistUrl = 'https://raw.githubusercontent.com/rbsec/dnscan/master/subdomains.txt';
var providerArray = ['https://dns.google.com/resolve','https://doh-jp.blahdns.com/dns-query','https://doh-de.blahdns.com/dns-query','https://dns.dns-over-https.com/dns-query','https://doh.securedns.eu/dns-query','https://doh.dns.sb/dns-query','https://doh.li/dns-query'];

async function pullWordlist(path) {
  let response = await fetch(path);
  let data = await response.text();
  return data.split("\n");
}

async function start(wordlist) {
  wordlist.forEach((word) => {
    requestDns(`${word}.${rootTld}`);
  });
}

async function requestDns(domain) {
  let provider = providerArray[Math.floor(Math.random()*providerArray.length)];
  let response = await fetch(`${provider}?name=${domain}&type=A&cd=true`);
  let record = await response.json();
  checkResponse(record);
}

function checkResponse(record) {
  if (record.Status === 0) {
    console.log(`Found ${record.Answer[0].name} at ${record.Answer[0].data}`);
  }
}

pullWordlist(wordlistUrl)
  .then(wordlist => start(wordlist));
