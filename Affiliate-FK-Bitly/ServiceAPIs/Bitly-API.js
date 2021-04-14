module.exports = {

    //method to post product details in bitly and get short link for the affiliate link
    postProductDetails : function(title,price,aff_url,category){

        const https = require('https')
       
        let priceRange;
        if(price>0&&price<=1000) priceRange="0-1000"
        if(price>1000&&price<=2000) priceRange="1000-2000"
        if(price>2000&&price<=3000) priceRange="2000-3000"
        if(price>3000&&price<=4000) priceRange="3000-4000"
        if(price>4000&&price<=5000) priceRange="4000-5000"
        if(price>5000&&price<=10000) priceRange="5000-10000"
        if(price>10000&&price<=15000) priceRange="10000-15000"
        if(price>15000&&price<=20000) priceRange="15000-20000"
        if(price>20000) priceRange="more than 20000"

        // let prodPrice = price+""; //converting price to string as supported tage type in bitly is string 

        let temp = [priceRange];
        let tags = [...temp,...category];
        console.log(temp)
        console.log(category)
        console.log(tags)
        //setting up data to send on bitly
        const data = JSON.stringify({
            "long_url": aff_url,
            "domain": "bit.ly", 
            "title":title,
            "tags": tags
        })

        //required options 
        const options = {
            hostname: 'api-ssl.bitly.com',
            port: 443,
            path: '/v4/bitlinks',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.Bitly_TOKEN
            }
          }

          let rawData='';
         return new Promise((resolve,reject)=>{
              
                //creating response
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
                    reject(error);
                })
                
                req.write(data)
                req.end()
         })


    } //postProductDetails method closing 

} //module closing 