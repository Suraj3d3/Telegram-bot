const https = require('https')
let productID= 'ACCFKYE2ARGG67WC';

const options = {
  hostname: 'affiliate-api.flipkart.net',
  port: 443,
  path: `/affiliate/1.0/product.json?id=${productID}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Fk-Affiliate-Id': '<put_affiliate_id_here>',
    'Fk-Affiliate-Token' : '<put_token_here>'
  }
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()