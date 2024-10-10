import driveService from "./auth.js"
import dotenv from "dotenv"
import stream from 'stream'
dotenv.config()
const { Duplex } = stream
function bufferToStream(buffer) {
    let tmp = new Duplex();
    tmp.push(buffer);
    tmp.push(null);
    return tmp;
}


export default async function uploadFile(file) {
    try {
        // Create a unique name by appending a timestamp before the file extension
        const timestamp = new Date().toISOString().replace(/[:.-]/g, ""); // Remove special characters
        const fileNameParts = file.name.split('.'); // Split the file name by '.'

        // Handle files without extensions
        const extension = fileNameParts.length > 1 ? fileNameParts.pop() : '';
        const baseName = fileNameParts.join('.'); // Rejoin in case the file name had multiple dots

        const uniqueFileName = extension
            ? `${baseName}_${timestamp}.${extension}`
            : `${baseName}_${timestamp}`;
        let media = {
            mimeType: file.mimetype,
            body: bufferToStream(file.data)
        };
        let response = await driveService.files.create({
            resource: {
                "name": uniqueFileName,
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




