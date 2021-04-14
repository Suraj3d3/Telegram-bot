

let date = new Date();
let day = date.getDate();
if(day<10) { day = "0"+day}

let month = date.getMonth()+1;  //adding +1 because month count starts from 0
if(month<10) { month = "0"+ month}

let currentDate = `${day}/${month}`;


let tomorrow = new Date(new Date()); //assigning tomorrow with today's date
tomorrow.setDate(tomorrow.getDate()+1); 
//increasing day by 1 :- It will work on the last day of month as well due to 
//functionality of Date()
let d = tomorrow.getDate();
if(d<10) { d = "0"+d}

let m = tomorrow.getMonth()+1;
if(m<10) { m = "0"+ m}

let nextDate = `${d}/${m}`;

module.exports={
    dailyReminder :  function (){
                var fs = require('fs');
                var obj;
                fs.readFile('Reminder/reminderStorage.json', 'utf8', function (err, data) {
                    if (err) throw err;
                    obj = JSON.parse(data);
            
                    if(obj.records.length == 0) 
                    {
                        console.log("List is empty..");
                        return;
                    }
                    let currentDayReminder = "****Gentle Reminder For Today's tasks **** \n\n" ;
                      
                    obj.records.forEach(element => {
                        if(currentDate == element.reminder_date)
                        {
                            currentDayReminder = currentDayReminder + ` ***Task*** : ${element.taskTitle}\n ***Task ID*** : ${element.messageID} \n\n`;     
                        }
                        
                     });

                     //change 1350565717 to grpID to send notification on grp
                    telegram.sendMessage(1350565717,currentDayReminder,{ parse_mode: 'Markdown'});
                });
            },  //closing for dailyReminder

            previousDayReminder :  function (){
                var fs = require('fs');
                var obj;
                fs.readFile('Reminder/reminderStorage.json', 'utf8', function (err, data) {
                    if (err) throw err;
                    obj = JSON.parse(data);
            
                    if(obj.records.length == 0) 
                    {
                        console.log("List is empty..");
                        return;
                    }
                    let upcomingReminder = "**** Gentle Reminder For Tomorrow’s tasks **** \n\n" ;
                    
                   
                    obj.records.forEach(element => {
                      
                        if(nextDate == element.reminder_date)
                        {
                          upcomingReminder = upcomingReminder+ ` ***Task*** : ${element.taskTitle}\n ***Task ID*** : ${element.messageID} \n\n `;     
                        }
                     });

                    telegram.sendMessage(1350565717,upcomingReminder,{ parse_mode: 'Markdown'});
                });
            },  //closing for previousDayReminder

           
            deleteReminder : function(taskID,chatID)
            {     
                var fs = require('fs');
                var obj;
                fs.readFile('Reminder/reminderStorage.json', 'utf8', function (err, data) {
                    // if (err) throw err;
                    if(err){
                        telegram.sendMessage(chatID,"Error occurred while reading file. Please contact admin.")
                        return;
                    }
                    obj = JSON.parse(data);
        
                    let index = obj.records.findIndex((element)=>{
                        return (element.messageID==taskID)
                    })
        
                    if(index === -1 ) {
                        telegram.sendMessage(chatID,"Record not found.");
                        return;
                    }
                    
                    obj.records.splice(index,1);
                    console.log(index);
        
                    fs.writeFile ("Reminder/reminderStorage.json", JSON.stringify(obj), function(err) {
                        // if (err) throw err;
                        if(err){
                            telegram.sendMessage(chatID,"Error occurred while deleting reminder. Please try again or contact admin.")
                        }
                        console.log('task removed from list');
                        telegram.sendMessage(chatID,"Reminder has been removed.")
                    });
                   
                })
            },  //closing delReminder
            
            setReminder : function(taskTitle,reminder_date,messageID){
                var fs = require('fs');
                var obj;
                fs.readFile('Reminder/reminderStorage.json', 'utf8', function (err, data) {
                    if (err) throw err;
                    obj = JSON.parse(data);
                    newObj = {
                        "taskTitle":taskTitle,
                        "reminder_date":reminder_date,
                        "messageID":messageID
                    }
                    obj.records.push(newObj);
                    fs.writeFile ("Reminder/reminderStorage.json", JSON.stringify(obj), function(err) {
                        if (err) throw err;
                    });
                  });
            }, //closing for setReminder

            reminderList : function(chatID)
            {
                var fs = require('fs');
                var obj;
                fs.readFile('Reminder/reminderStorage.json', 'utf8', function (err, data) {
                // if (err) throw err;
                if(err){
                    telegram.sendMessage(chatID,"Error occurred while reading file! Please try again.");
                    return 0;
                }
                obj = JSON.parse(data);
                if(obj.records.length===0)
                {
                    telegram.sendMessage(chatID,"List is empty.");
                    return;
                } 
             
                 let taskList="\n ";

                    obj.records.forEach( (data) => {    
                            taskList = taskList + `*Task :* ${data.taskTitle} \n *Task ID :* ${data.messageID} \n *Date : ${data.reminder_date}* \n\n`;    
                    });
                
                 telegram.sendMessage(chatID,taskList,{ parse_mode: 'Markdown'});        
               
            });
          } // reminderList method closed
}
   
  
