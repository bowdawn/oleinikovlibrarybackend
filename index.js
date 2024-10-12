import express from "express";
import dotenv from "dotenv";
import publicBook from "./routes/public/book.js";
import privateBook from "./routes/private/book.js";
import publicUser from "./routes/public/user.js";
import privateUser from "./routes/private/user.js";
import root from "./routes/public/root.js";
import auth from "./middleware/validate-token.js";
import connectToDatabase from "./database/mongodb.js";
import cors from 'cors';
import uploadFile from "./googledriveapi/uploadFile.js";
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const chunksStorage = {};
const upload = multer({ storage: multer.memoryStorage() });
app.use(upload.single('fileChunk'));
app.use("/api/user", publicUser);
app.use("/api/user", auth, privateUser);
app.use("/api/public/book", publicBook);
app.use("/api/book", auth, privateBook);
app.use("/api", root);
app.use("/", root);
app.post('/api/book/upload', (req, res) => {
  console.log('Received upload request'); 
  if (!req.file) {
    console.error('No file received');
    return res.status(400).json({ error: 'No file received' });
  }
  const { chunkIndex, fileName } = req.body;
  console.log(`Chunk Index: ${chunkIndex}, File Name: ${fileName}`);
  if (!chunksStorage[fileName]) {
    chunksStorage[fileName] = [];
    console.log(`Initialized storage for file: ${fileName}`);
  }
  chunksStorage[fileName][chunkIndex] = req.file.buffer;
  console.log(`Chunk ${chunkIndex} for ${fileName} uploaded successfully.`);
  res.send('Chunk uploaded successfully');
});
app.post('/api/book/finalize', express.json(), async (req, res) => {
  console.log('Received finalize request');
  const { fileName, fileType, totalChunks } = req.body;
  if (!fileName || totalChunks === undefined) {
    console.error('fileName and totalChunks are required');
    return res.status(400).json({ error: 'fileName and totalChunks are required' });
  }
  if (!chunksStorage[fileName] || chunksStorage[fileName].length < totalChunks) {
    console.error('Not all chunks have been uploaded');
    return res.status(400).json({ error: 'Not all chunks have been uploaded' });
  }
  const fileBuffer = Buffer.concat(chunksStorage[fileName]);
  console.log(`Reassembling file: ${fileName}`); // Debugging statement
  try {
    const fileData = {
      name: fileName,
      mimetype: fileType,
      data: fileBuffer,
    };
    const driveResponse = await uploadFile(fileData);
    delete chunksStorage[fileName];
    return res.status(200).json({ message: 'File uploaded to Google Drive successfully', driveData: driveResponse });
  } catch (driveError) {
    console.error('Error uploading file to Google Drive:', driveError);
    return res.status(500).json({ error: 'Error uploading file to Google Drive' });
  }
});
async function startApp() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
  } catch (e) {
    console.error('Error starting the server:', e);
  }
}
startApp();
