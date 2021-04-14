module.exports ={
  
    addTask : function(taskTitle,agentID,messageID){
        var fs = require('fs');
        var obj;
        fs.readFile('storage.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        newObj = {
            "taskTitle":taskTitle,
            "agentID":agentID,
            "messageID":messageID
        }

        obj.storage.push(newObj);
        fs.writeFile ("storage.json", JSON.stringify(obj), function(err) {
        if (err) throw err;
        });
      });

    }, 

    removeTask : function(reply_message_id,chatID)
    {     
        var fs = require('fs');
        var obj;
        fs.readFile('storage.json', 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);

            let index = obj.storage.findIndex((element)=>{
                return (element.messageID==reply_message_id)
            })

            if(index === -1 ) {
                telegram.sendMessage(chatID,"Record not found.");
                return;
            }
            
            obj.storage.splice(index,1);
            console.log(index);

            fs.writeFile ("storage.json", JSON.stringify(obj), function(err) {
                if (err) throw err;
                console.log('task removed from list');
                telegram.sendMessage(chatID,"Task has been removed from list.\n\n Enter #list to see list of remaining tasks.")
            });
        })
    },

    listTask : function(messageID,chatID)
    {
        var fs = require('fs');
        var obj;
        fs.readFile('storage.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        if(obj.storage.length===0)
        {
            telegram.sendMessage(chatID,"List is empty.");
            return;
        } 


         let agentList = [];
         obj.storage.forEach((element)=>{agentList.push(element.agentID)});
         console.log(agentList)

         agentList = [... new Set(agentList)]; //creating array with only distinct values of agentID
         console.log(agentList)
         console.log(obj.storage)

         let taskList="\n";
         agentList.forEach((agentID)=>{ 
            taskList = taskList + "\n\n ***#######  "+agentID+"  ######## *** \n\n";
            obj.storage.forEach( (data) => {
                if(data.agentID==agentID)
                {
                    taskList=taskList + `*Task :* ${data.taskTitle} \n *Task ID :* ${data.messageID} \n\n`
                }
            });
        });
        telegram.sendMessage(chatID,taskList,{ parse_mode: 'Markdown'});        
       
    });
  } // listTask method closed
}

  