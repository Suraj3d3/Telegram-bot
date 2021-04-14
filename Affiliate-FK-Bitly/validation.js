module.exports = {
        affiliateUrlValidation : function(aff_url){
            
            //A url must contain atleast one '.' 
            if(aff_url.indexOf('.') == -1){  
                return false;
            }

            let breakedUrl = aff_url.split('.');
            let serviceName = breakedUrl[1]; //Flipkart , Amazon


            if(serviceName.toLowerCase() == 'flipkart') {
                    //refer to docs.txt for sample URL
                    let indx1 = aff_url.indexOf("pid=");
                    let indx2 = aff_url.indexOf("&lid");
                    if(indx1==-1 || indx2 == -1)
                        return false;
                    // logic for getting Product ID from FK affiliate URL
                    let PID = aff_url.slice(indx1+4,indx2); 
                    return ['flipkart',PID]; //DO NOT CHANGE ORDER OF ARRAY IN RETURN
            }
            else
            if(serviceName.toLowerCase() == 'amazon') {
                    return 'amazon';
            }
            else{
                return false;
                // if service name does not belongs to flipkart or amazon 
            }
        }    
}




