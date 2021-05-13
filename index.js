const wbm = require('wbm');
const reader = require('xlsx');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const axios = require('axios');
const cors = require('cors');
app.use(cors());



app.get('/',cors(), (req, res) => {
  res.send('Hello World!')
})

app.post('/info',cors(),function(req,res){
  var user_name = req.body;
  var password = req.body;
  console.log("User name = "+user_name+", password is "+password);
  res.end("yes");
});



function getDataFromExcel(){
    // Reading our test file
    let data = [];
    const file = reader.readFile('./test.xlsx');

    const sheets = file.SheetNames;

    const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[0]]);
    temp.forEach((res) => {
        data.push(convertToFullPhoneNo(res));
    });
    return data;
}

function convertToFullPhoneNo(Phone){
    let obj = Phone;
    obj.Phone = obj.Phone;
    return obj.Phone;
}

function getTodayDate(){
 var today = new Date();
 var dd = today.getDate();

 var mm = today.getMonth()+1;
 var yyyy = today.getFullYear();
 if(dd<10)
 {
  dd='0'+dd;
 }

 if(mm<10)
 {
  mm='0'+mm;
 }
 today = dd+'-'+mm+'-'+yyyy;
 return today;

}

async function sendWhatsAppmessage(msg,param_chat_id){
try {
  let res = await axios.post('https://api.chat-api.com/instance268112/sendMessage?token=rnfgjsow3z5f0ynq',{ "chatId":param_chat_id,
  "body":msg});
      //console.log(res);
  } catch (error) {
      console.error(error)
}

}
    const getData = async () => {
        try {
          var param_district_id=512;
          var param_date=getTodayDate();
          var param_chat_id = "917030404333-1620677398@g.us";

          var arrary_chatId_dId = [
            /*          {
                      "dId":"392",
                      "chatId": "917798404333-1620737067@g.us",
                      "name": "U18THANE VACCINATION SLOT"
                      },

                      {
                        "dId":"664",
                        "chatId": "917798404333-1620752267@g.us",
                        "name": "U18KANPUR NAGAR SLOT"
                        },


                      {
                      "dId":"363",
                      "chatId": "917798404333-1620736986@g.us",
                      "name": "U18PUNE VACCINATION SLOTS"
                      },
*/
                      {
                        "dId":"154",
                        "chatId": "917798404333-1620751662@g.us",
                        "name": "U18AHMEDABAD VACCINE SLOT",
                      },

                      {
                        "dId":"670",
                        "chatId": "917798404333-1620752572@g.us",
                        "name": "U18LUCKNOW SLOT"
                      },


                      {
                      "dId":"265",
                      "chatId": "917798404333-1620751524@g.us",
                      "name": "U18Bangalore Urban Slot"
                      },

                      {
                      "dId":"141",
                      "chatId": "917798404333-1620751834@g.us",
                      "name": "U18CENTRAL DELHI SLOT"
                      },

                      {
                      "dId":"312",
                      "chatId": "917798404333-1620751945@g.us",
                      "name": "U18BHOPAL VACCINE SLOT"
                      },

                      {
                      "dId":"9",
                      "chatId": "917798404333-1620753079@g.us",
                      "name": "U18PATNA VACCINE SLOT"
                      },

                      {
                      "dId":"199",
                      "chatId": "917798404333-1620753213@g.us",
                      "name": "U18FARchatIdABAD SLOT"
                      }

                      ];
                       arrary_chatId_dId.forEach(function(district_data) {
                        var param_chat_id = district_data.chatId;
                        var param_district_id = district_data.dId;
                        getSessionData(param_district_id,param_chat_id,param_date);
                    });
        }catch (error) {
          console.error(" [ERROR] "+param_district_id+"======Failed"+"\n"+error);
      }
    }

    var getSessionData = async (param_district_id,param_chat_id,param_date)=>{
      var res;
      var msg_center;
      var msg_session;
      var msg_whatsapp="";
      var log_datetime = new Date();
      try {
        res = await axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+param_district_id+'&'+'date='+param_date,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"

            }
        });
        for(var i=0;i<res.data.centers.length;i++){
            var raw_center=res.data.centers[i];
            msg_center="name:"+raw_center.name+"\naddress:"+raw_center.address+"\nblock_name:"+raw_center.block_name+"\npincode:"+raw_center.pincode+"\nfee_type:"+raw_center.fee_type+"\ndistrict_name:"+raw_center.district_name+"\nstate_name:"+raw_center.state_name+"\n";
            msg_session="";
            for(var j=0;j<raw_center.sessions.length;j++){
                var raw_session = raw_center.sessions[j];
                var age_limit=raw_session.min_age_limit;
                var available_capacity=raw_session.available_capacity;
                if(age_limit<45 && available_capacity>0){
                    msg_session += "\n\nmin_age_limit:"+age_limit+"\nvaccine:"+raw_session.vaccine+"\navailable_capacity:"+raw_session.available_capacity+"\ndate:"+raw_session.date;
                }
            }
            if(msg_session!=""){
                msg_whatsapp+=msg_center+"\n********"+msg_session+"\n#######################\n";
            }
        }

            if(msg_whatsapp!=""){
              sendWhatsAppmessage(msg_whatsapp,param_chat_id);
              console.log(log_datetime+" [INFO] "+param_district_id+"======processed==SLOTS Found==Message Send");
            }
            else{
              console.log(log_datetime+" [INFO] "+param_district_id+"======processed==SLOTS Not Found==Message Not Send");
            }

        } catch (error) {
            console.error(log_datetime+" [ERROR] "+param_district_id+"======Failed"+"\n"+error);

        }
    }
    setInterval(function(){
      getData();
      console.log("*****SLEEPING FOR SECS**************");
}, 20000);
