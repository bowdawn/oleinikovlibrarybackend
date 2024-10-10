import  express  from "express";
import dotenv from "dotenv"
import publicBook from "./routes/public/book.js";
import privateBook from "./routes/private/book.js";
import publicUser from "./routes/public/user.js";
import privateUser from "./routes/private/user.js";
import root from "./routes/public/root.js";
import auth from "./middleware/validate-token.js"
import connectToDatabase from "./database/mongodb.js"
import fileUpload from 'express-fileupload';
import cors from 'cors';
// import uploadFile from "./googledriveapi/uploadFile.js"
// import  multer   from 'multer';
// import fs  from 'fs';
// import path from 'path';

const app = express();
app.use(cors({}));
 // Temporary upload directory
const PORT = process.env.PORT || 5000;

dotenv.config()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // Set limit to 50MB
}));

app.use("/api/user", publicUser)
app.use("/api/user", auth, privateUser)
app.use("/api/public/book", publicBook)
app.use("/api/book", auth, privateBook)
app.use("/api", root);
app.use("/", root);

// const upload = multer({ dest: 'uploads/' });

// // Endpoint to upload chunks
// app.post('/api/book/upload', upload.single('fileChunk'), (req, res) => {

//   const { chunkIndex, fileName } = req.body;
//   const tempPath = req.file.path;
//   const targetPath = path.join('./uploads', fileName + '.' + chunkIndex);

//   // Move and rename the chunk for easier reassembly
//   fs.rename(tempPath, targetPath, err => {
//     if (err) {
//       return res.status(500).send(err.message);
//     }
//     res.send('Chunk uploaded successfully');
//   });
// });

// // Endpoint to finalize the upload and reassemble the file
// app.post('/api/book/finalize', express.json(), async (req, res) => {
//   const { fileName, totalChunks } = req.body;

//   // Check if fileName and totalChunks are provided
//   if (!fileName || totalChunks === undefined) {
//     return res.status(400).json({ error: 'fileName and totalChunks are required' });
//   }

//   const targetPath = path.join('./uploads', fileName);
//   const fileWriteStream = fs.createWriteStream(targetPath);

//   try {
//     // Reassemble file from chunks
//     for (let i = 0; i < totalChunks; i++) {
//       const chunkPath = path.join('./uploads', `${fileName}.${i}`);

//       // Check if the chunk exists before processing
//       if (!fs.existsSync(chunkPath)) {
//         return res.status(400).json({ error: `Chunk ${i} does not exist` });
//       }

//       // Read and append each chunk to the final file
//       await new Promise((resolve, reject) => {
//         const readStream = fs.createReadStream(chunkPath);
//         readStream.pipe(fileWriteStream, { end: false });

//         readStream.on('end', () => {
//           // Delete the chunk after merging it
//           fs.unlink(chunkPath, (err) => {
//             if (err) reject(err);
//             else resolve();
//           });
//         });

//         readStream.on('error', (err) => reject(err));
//       });
//     }

//     // Finalize the file writing process
//     fileWriteStream.end();

//     fileWriteStream.on('finish', async () => {
//       console.log('File reassembled successfully:', fileName);

//       // Once the file is reassembled, upload it to Google Drive
//       try {
//         const fileData = {
//           name: fileName,
//           mimetype: 'application/pdf', // Change this based on file type
//           data: fs.readFileSync(targetPath), // Read the reassembled file
//         };

//         const driveResponse = await uploadFile(fileData); // Call the function to upload to Google Drive

//         // After uploading, delete the reassembled file from the server
//         fs.unlink(targetPath, (err) => {
//           if (err) console.error('Failed to delete reassembled file:', err);
//         });

//         // Send the Google Drive response back to the client
//         return res.status(200).json({ message: 'File uploaded to Google Drive successfully', driveData: driveResponse });
//       } catch (driveError) {
//         console.error('Error uploading file to Google Drive:', driveError);
//         return res.status(500).json({ error: 'Error uploading file to Google Drive' });
//       }
//     });

//   } catch (err) {
//     console.error('Error during file reassembly:', err);
//     return res.status(500).send(err.message);
//   }
// });



async function startApp() {
  try {
      connectToDatabase()
      app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
  } catch (e) {
      console.log(e)
  }
}

startApp()
