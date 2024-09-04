import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app=express();
const port=3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
let pre="Your joke goes here...";
app.get("/",(req,res)=>{
    res.render("index.ejs",{joke:pre});
});

app.post("/submit",async (req,res)=>{
    console.log(req.body);
    var url=`https://v2.jokeapi.dev/joke/${req.body.category}`;
    let queryParams = [];

    if(req.body.lang!='en'){
        queryParams.push(`lang=${req.body.lang}`);
    }

    if('flags' in req.body){
        let flagsString="";
        if(Array.isArray(req.body.flags)){
            var flagArr=req.body.flags;
            for(var i=0; i<flagArr.length; i++){
                flagsString+=flagArr[i];
                if(i!=flagArr.length-1){
                    flagsString+=",";
                }
            }
        }else{
            flagsString=`${req.body.flags}`;
        }
        queryParams.push(`blacklistFlags=${flagsString}`);
    }

    if (Array.isArray(req.body.type)) {
        let typeArr = req.body.type;
        queryParams.push(`type=${typeArr[Math.floor(Math.random() * typeArr.length)]}`);
    } else {
        queryParams.push(`type=${req.body.type}`);
    }

    if(req.body.keyword!=''){
        queryParams.push(`contains=${req.body.keyword}`);
    }
    url+=`?${queryParams.join("&")}`;
    const response=await axios.get(url);
    console.log(response.data);
    if(response.data.error){
        res.render("index.ejs",{joke:response.data.message});
    }else{
        if('joke' in response.data){
            res.render("index.ejs",{joke:response.data.joke});
        }else{
            res.render("index.ejs",{setup:response.data.setup,delivery:response.data.delivery});
        }
    }
   
});

app.listen(port,(req,res)=>{
    console.log("Server is Listening...");
});