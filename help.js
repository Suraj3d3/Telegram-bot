module.exports = {
    help : function(chatID){
        let cmdList = {
            "intro":"***You can control me by sending these commands:*** \n\n\n",
            "assign": "***#assign *** : Use this command to assign task to @userID. Anything written after userID will be considered as task.\n\t *Syntax: #assign @userID I am your new task*  \n\n",
            "list" : "***#list*** : Use this command to get list of active tasks. \n\t *Syntax: #list* \n\n",
            "done" : "***#done *** : Use this command when you are done with your assigned task. Execution of this command will remove the specified task from list. There are 2 ways of using this command-- \n 1) On assignment of any task , you will receive a notification. Once done with your task, just reply #done on the same notification and that's it. Within a second , that task is going to be removed from your bin. \n 2) As an alternative way , you can remove task from your bin by giving command - #done taskID. You can get task ID by listing tasks by using #list command.\n\t *Syntax : #done OR #done taskID* \n\n",
            "reminder" : "\n\n\n***#reminder *** : Set a reminder for any upcoming event or task. You will get a notification on that date as well as one day ago.\n\t *Syntax: #reminder DD/MM Your task name* \n\n",
            "deleteReminder" : "*** #delete *** : Use this command to remove reminder using task ID. \n\t *Syntax : #delete taskID * \n\n",
            "listReminder" : "*** #reminderList *** : Use this command to get list of reminders. \n\t *Syantx : #reminderList * \n\n",
            "affiliate" : "\n\n\n*** #affiliate *** : Use this command to get short link of amazon/flipkart affiliate link. \n\t *Syntax : #affiliate Long_URL *"

        }
        let info="";
        for (const[key,value] of Object.entries(cmdList)){
            info = info + value;
        }
        telegram.sendMessage(chatID,info,{ parse_mode: 'Markdown'});
        // console.log(info);
    }
}