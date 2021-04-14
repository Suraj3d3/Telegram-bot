const https = require('https')

const data = JSON.stringify({
    "long_url": "https://jamshedpurguru.in/2021/03/speedgun-in-nh33-chain-snatching-in-kadma-name-plate-in-private-vehicle-will-be-illegal-jharkhand-players-govt-job-jamshedpur-daily-news-update/", 
    "domain": "bit.ly", 
    "title": "Testing with NodeJs ", 
    "tags": [ "JG", "Node call"]
})

const options = {
  hostname: 'api-ssl.bitly.com',
  port: 443,
  path: '/v4/bitlinks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <put_key_here>'
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

req.write(data)
req.end()


