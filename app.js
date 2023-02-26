

const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
require('dotenv').config();


const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});



app.post("/",function(req,res){
    const fn=req.body.fname
    const ln=req.body.lname
    const em=req.body.email

    const data={
        members:[{
            email_address:em,
            status:"subscribed",
            merge_fields:{
                FNAME:fn,
                LNAME:ln
            }
        }
            
        ]
    };

    const jsonData=JSON.stringify(data);
    const options={
        method:"POST",
        auth:"ankit1:"+process.env.APIKEY
    }

    const url="https://us8.api.mailchimp.com/3.0/lists/"+process.env.AUDIENCE_KEY;
    const request=https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running");
})
