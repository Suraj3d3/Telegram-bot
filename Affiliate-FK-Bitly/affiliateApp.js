module.exports = {
    affiliateServices : function(){

    const validation = require('./validation');
    const flipkartAPI = require('./ServiceAPIs/FK-API');
    const bitlyAPI = require('./ServiceAPIs/Bitly-API')


telegram.onText(/#affiliate/gi,(message)=>{
    let adminCommand = message.text;
    let breakedCommand = adminCommand.split(" "); 
    
     if( breakedCommand.length != 2){
        telegram.sendMessage(message.chat.id,"Invalid command.\n Expected command : #affiliate URL");
        return;
     }

      let affiliateUrl = breakedCommand[1]; 
      let urlValStatus = validation.affiliateUrlValidation(affiliateUrl)
      if(urlValStatus == false){
          telegram.sendMessage(message.chat.id,"Invalid URL");
          return;
      }
      if(urlValStatus[0] == 'flipkart'){
                let prodDetails;
                let PID = urlValStatus[1]; 

                async function waitForFkAPIResponse(){
                        prodDetails = await flipkartAPI.getProductDetails(PID);
                        // console.log(prodDetails);
                        let prodTitle = prodDetails.productBaseInfoV1.title;
                        let prodAmount = prodDetails.productBaseInfoV1.flipkartSpecialPrice.amount;
                        let aff_url = prodDetails.productBaseInfoV1.productUrl
                        let prodCategory = prodDetails.productBaseInfoV1.categoryPath;
                        //removing special characters as bitly tags does not support any special char.
                        // keeping '>' to seprate words from string to find category and sub category
                         let categ = prodCategory.replace(/[&\/\\#, +()$~%.'":*?<{}]/g, ' ')  
                        let breakedCategory = categ.split('>')

                    let bitlyResponse = await bitlyAPI.postProductDetails(prodTitle,prodAmount,aff_url,breakedCategory);
                        // console.log(bitlyResponse);
                        let short_link = bitlyResponse.link;
                        telegram.sendMessage(message.chat.id,`Short link : ${short_link}`)

                }
                waitForFkAPIResponse();

               
      }  // closing if-flipkart block 

      if(urlValStatus == 'amazon'){
            telegram.sendMessage(message.chat.id,"Amazon links are currently not supporetd. ")
      }

      if(urlValStatus == false){
          telegram.sendMessage(message.chat.id,"Invalid URL")
      }
     // telegram.sendMessage(message.chat.id,"Under maintenance")
})
    
    
    
    
    } //closing affiliate services 


} //closing module exports 

