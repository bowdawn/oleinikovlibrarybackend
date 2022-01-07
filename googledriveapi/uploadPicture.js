import driveService from "./auth.js"
import dotenv from "dotenv"
import stream from 'stream'
dotenv.config()
const {Readable, Duplex} = stream


function bufferToStream(buffer) {
    let tmp = new Duplex();
    tmp.push(buffer);
    tmp.push(null);
    return tmp;
}


export default async function uploadPicture(picture) {
    try{
    console.log(picture)
    let media = {
      mimeType: picture.mimetype,
      body : bufferToStream(picture.data)
    }
    let response = await driveService.files.create({
      resource: {
        "name": picture.name ,
        "parents" : [process.env.DRIVE_DIRECTORY]
      },
      media: media,
      fields: 'id'
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
  



  