import driveService from "./auth.js"
import dotenv from "dotenv"

dotenv.config()


export default async function deleteFile(fileId) {
    try {

        await driveService.files.delete({
            fileId: fileId
        }).then( () => console.log("File Deleted id"))
        
       
    }
    catch (e) {
        console.log(e)
    }
}
