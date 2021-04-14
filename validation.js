module.exports = {

    //validating date input in #reminder command  
    dateValidate : function(reminder_date){

        if(reminder_date.length!==5 || (reminder_date.charAt(2)!= '/' ) ){ 
            return false;
        }

        //reminder date
        let day = reminder_date.substr(0,2);
        let month = reminder_date.substr(3,2);  
       
        let userDate = `${month}/${day}`; //formatting reminder date on MM/DD format
        
        //current date
        let dateObj = new Date();
        let currentDay = dateObj.getDate();
        if(currentDay<10) { currentDay = "0"+currentDay}
        let currentMonth = dateObj.getMonth()+1;  //adding +1 because month count starts from 0
      
        let currentDate = `${currentMonth}/${currentDay}`;  //formatting current date on MM/DD format
        
        //although day is in strign format but JS will convert string to number form while comparing
        if( (day<1 || day>31) || (month<1 || month>12 )  ){
            return false;
        }
    
       
    },

    taskAssignValidation: function(commandLength){
        if(commandLength<3)
        {
            return false;
        }
    },

    taskListValidation : function(){
        
    },

    taskDoneValidation : function(){

    },

    helpValidation : function(){
        
    }

}