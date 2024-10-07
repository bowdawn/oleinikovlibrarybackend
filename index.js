import express from 'express';
import dotenv from 'dotenv';
import publicBook from './routes/public/book.js';
import privateBook from './routes/private/book.js';
import publicUser from './routes/public/user.js';
import privateUser from './routes/private/user.js';
import root from './routes/public/root.js';
import auth from './middleware/validate-token.js';
import connectToDatabase from './database/mongodb.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow requests from all origins, or specify a domain like 'https://yourfrontend.com'
  methods: 'GET,POST,PUT,DELETE', // Methods allowed
  allowedHeaders: 'Content-Type,Authorization' // Allowed headers
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload({}));

// Routes
app.use('/api/user', publicUser);
app.use('/api/user', auth, privateUser);
app.use('/api/public/book', publicBook);
app.use('/api/book', auth, privateBook);
app.use('/api', root);
app.use('/', root);

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong', details: err.message });
});

async function startApp() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));
  } catch (e) {
    console.log('Error starting the server:', e);
    process.exit(1); // Exit the process with an error code
  }
}

startApp();
