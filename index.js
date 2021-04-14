require('dotenv').config();

var TelegramBot = require('node-telegram-bot-api');
var cron = require('node-cron');

const allTask = require('./dataOperations');
const Reminder = require('./Reminder/reminder');
const validation = require('./validation');
const help = require('./help');

//importing affiliate related service
const affiliateTbot = require('./Affiliate-FK-Bitly/affiliateApp');

const botToken = process.env.TOKEN;
global.telegram = new TelegramBot(botToken, { polling: true });

affiliateTbot.affiliateServices(); //calling affiliate services

//members chat ID 
// we can only send message to any user by their chat ID , not by telegram username ,
// we are receiving username from client side whom we need to send notification
// i.e we are storing chat ID on a veriable which has same name as user's telegram username 
// now we can use that username variable in sendMessage(username_variable,"your message")
// so in reality , we will be using chatID to send message but it will look as we're using username.

var jsrGuruGrpID = "-1001247115720";

//members telegram username & chatID
var suraj3d3 = "1350565717"; //  1350565717 is the chatID of user suraj3d3
var SKSINGH2371998 = "897275707";
var utmrjk = "566960186";
var vishwavijaymahato = "1044844424";
var GoutamRajak = "1080785934";
var Jay_kreatives = "";
var PoojaTiwary= "";

// for handling text messages
telegram.on("text", (message) => {

    let adminCommand = message.text;
    let breakedCommand = adminCommand.split(" "); 
    let command = breakedCommand[0];
   
    if(command.toLowerCase() === "#assign") // condition for admin command starting with #assign
    {
        let validationStatus = validation.taskAssignValidation(breakedCommand.length); 
        if(validationStatus===false){
            telegram.sendMessage(message.chat.id,"Incomplete command! ***Missing username or task.***",{ parse_mode: 'Markdown'});
            return;
        }
        let agentID = breakedCommand[1].slice(1); // remove '@' from 2nd word (eg - @suraj3d3)  
        let length_of_first_2_strings = command.length + agentID.length + 2; 
        // +2 is for 2 blank space (i.e. after assigne and username)
        // rest of the words after username will be stored as task title
    
        let taskTitle = adminCommand.slice(length_of_first_2_strings); // get remaining text after first 2 words (i.e. #assign # username)
       

        let chatID = eval(agentID); 
        // In variable agentID we are getting username of agent (eg - suraj3d3)
        // note :- we can send message only using chat ID 
        // there is a golbal variable declared on top , which has same name as username(i.e. suraj3d3) and that vaiable stores chatID of that user (i.e var suraj3d3 = "1350565717")
        // If we will directly write let chatID = agentID then it will be evaluated as chatID = "suraj3d3"
        // hence we are using eval() method to treat agentID as variable/command , not by it's value
        // so after using let chatID = eval(agentID)  , it will evaluated as chatID = "1350565717";

        let sentMessageStatus = telegram.sendMessage(chatID,"_New task assigned_ . \n ***Task : "+taskTitle +"*** \n\n  Enter #list to get list of tasks. \n Once done , please reply with #done on this message to remove this task from list. \n You can also remove task by using command - #done taskID (eg- #done 456)",{ parse_mode: 'Markdown'});
       
       //sendMessage() method return a promise as returned value , so in order to 
       // extract data from that promise , we are using a callback method
        sentMessageStatus.then((temp)=>{
            //storing temp.message_id in JSON file , this value will be used to identify exact task object
            allTask.addTask(taskTitle,agentID,temp.message_id); // adding task in JSON file (method is available in dataOperations.js)
        })
        telegram.sendMessage(message.chat.id,`Task assigned to ${agentID}.`)

    }

    if(command.toLowerCase()==="#list")
    {
        // console.log("working list")
        allTask.listTask(message.message_id,message.chat.id);
    }

     // #done  -- method 1
     //remove task opeartion directly using taskID ( use #list command --> find task ID --> use command-  #done 456)
    if(command.toLowerCase() === "#done" && breakedCommand.length>1)  
    {
        let taskID=breakedCommand[1];
        allTask.removeTask(taskID,message.chat.id); 
    }

    // #done -- method 2
    if(message.reply_to_message)
    {
        //remove task opeartion based on reply from user
        if(message.text.toLowerCase()==='#done')
        {
          let reply_message_id =  message.reply_to_message.message_id;
          allTask.removeTask(reply_message_id,message.chat.id); 
        //as we have linked message_id task in JSON object , so when user will reply
        // to that assigned task message , we will extract message id of that task message 
        // with the help of message object and pass that to removeTask() method and that
        // method will search for the task object having same message ID. and in case of match it wll detele that object. 
        }
    }

    if(command.toLowerCase() === "#help")
    {
       help.help(message.chat.id);
    }

    if(command.toLowerCase()==="#reminder")
    {
        let reminder_date = breakedCommand[1]; //(DD/MM)
        
        let dateValidation = validation.dateValidate(reminder_date); //validating date
        if(dateValidation === false)
        {
            telegram.sendMessage(message.chat.id,"Invalid date or format. Please use *** DD/MM *** format",{ parse_mode: 'Markdown'});
            return 0;
        }
        if(dateValidation === -1)
        {
            telegram.sendMessage(message.chat.id,"***Can't set reminder for past date.*** Please try again with a valid date.",{ parse_mode: 'Markdown'});
            return 0;
        }

        let length_of_first_2_strings = command.length + reminder_date.length + 2; 
        let taskTitle = adminCommand.slice(length_of_first_2_strings); // get remaining text after first 2 words (i.e. #assign & date)
       
        let sentMessageStatus = telegram.sendMessage(message.chat.id,"Reminder set. You will get a notification on "+reminder_date);
       
        sentMessageStatus.then((temp)=>{
            //storing temp.message_id in JSON file , this value will be used to identify exact task object
            Reminder.setReminder(taskTitle,reminder_date,temp.message_id); // adding task in JSON file (method is available in Reminder/reminder.js)
        })          
    } //closing reminder block

    if(command.toLowerCase()==="#delete")
    {
        if(breakedCommand.length!=2) {
            telegram.sendMessage(message.chat.id,"Invalid command. Please use #help command to see command details.");
            return 0;
        }
        let taskID  = breakedCommand[1];
        Reminder.deleteReminder(taskID,message.chat.id);
    }

    if(command.toLowerCase()=="#reminderlist"){
        if(breakedCommand.length!=1){
            telegram.sendMessage(message.chat.id,"Invalid command. Please use #help command to see command details.");
            return 0;
        }
        Reminder.reminderList(message.chat.id);
    }


}); // telegram.on method ending here



//reminder to send notification for pending tasks.
//At 0 seconds, 0 minutes every 2nd hour'

try {

    cron.schedule('0 0 */4 * * *',()=>{
        //*3 refers as the reminder will execute on every 3rd hour.
        var fs = require('fs');
        var obj;
        fs.readFile('storage.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        if(obj.storage.length!==0)
         {
             obj.storage.forEach(element => {
                let chatID = eval(element.agentID);
                console.log("node corn running..")
                telegram.sendMessage(chatID,`Gentle Reminder!\n Pending task found in your bin.\n\n Task ::${element.taskTitle} `);
            });

         }
        });
    });

    //run cron at daily 9 AM 
    //            sec min hr
    //             |   |  |
    cron.schedule('30 30 08 * * *',()=>{
        Reminder.dailyReminder();
    })

    //            sec min hr
    //             |   |  |
    cron.schedule('30 30 20 * * *',()=>{
        Reminder.previousDayReminder();
    })

} catch (error) {
    console.log(error);
}





