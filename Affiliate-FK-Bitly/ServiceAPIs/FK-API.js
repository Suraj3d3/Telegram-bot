

module.exports = {
    getProductDetails : function(pid){

         const https = require('https');
         const options = {
            hostname: 'affiliate-api.flipkart.net',
            port: 443,
            path: `/affiliate/1.0/product.json?id=${pid}`,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Fk-Affiliate-Id': process.env.Fk_AFFILIATE_ID,
              'Fk-Affiliate-Token' : process.env.Fk_AFFILIATE_TOKEN
            }
          }

          let rawData='';
          return new Promise((resolve,reject)=>{

                      const req = https.request(options, res => {
                        console.log(`statusCode: ${res.statusCode}`)
                       
                        res.on('data', d => {
                          // process.stdout.write(d)
                          rawData = rawData + d;
                        })

                       res.on('end',()=>{
                         let parsedData = JSON.parse(rawData)
                         resolve(parsedData)
                       })
                      })
                      
                      req.on('error', error => {
                        console.error(error)
                        reject(error)
                      })
                      
                      req.end()

          }) //closing promise block

          
    }  //getProductDetails closing 
}