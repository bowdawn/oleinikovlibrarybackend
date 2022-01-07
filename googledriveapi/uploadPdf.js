import driveService from "./auth.js"
import dotenv from "dotenv"
import stream from 'stream'
import fs from "fs"
dotenv.config()
const { Duplex} = stream


function bufferToStream(buffer) {
    let tmp = new Duplex();
    tmp.push(buffer);
    tmp.push(null);
    return tmp;
}


export default async function uploadPdf(pdf) {
    try{
    let response = await driveService.files.create({
      requestBody: {
        parents : [process.env.DRIVE_DIRECTORY],
        
      
      },
      
      media: {
        mimeType: pdf.mimetype,
        body : bufferToStream(pdf.data)
      },
    
    })
   
    switch(response.status){
      case(200):
        console.log("File Created id:" , response.data.id)
        return response 
       
    }}
    catch(e) {
        console.log(e)
    }
  }
  



  