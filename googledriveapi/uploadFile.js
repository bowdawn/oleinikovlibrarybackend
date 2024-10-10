import driveService from "./auth.js"
import dotenv from "dotenv"
import stream from 'stream'
dotenv.config()
const { Duplex} = stream
function bufferToStream(buffer) {
    let tmp = new Duplex();
    tmp.push(buffer);
    tmp.push(null);
    return tmp;
}


export default async function uploadFile(file) { 
  try {
      console.log(file);
      let media = {
          mimeType: file.mimetype,
          body: bufferToStream(file.data)
      };
      let response = await driveService.files.create({
          resource: {
              "name": file.name,
              "parents": [process.env.DRIVE_DIRECTORY]
          },
          media: media,
          fields: 'id'
      });

      console.log(response);

      if (response.status === 200) {
          console.log("File Created, id:", response.data.id);
          return response.data; // Return only the data object with the file ID
      } else {
          throw new Error(`Unexpected response status: ${response.status}`);
      }
  } catch (e) {
      console.error("Error while uploading file:", e); 
      throw new Error("File upload failed: " + e.message); // Rethrow the error for the service to catch
  }
}
  



  