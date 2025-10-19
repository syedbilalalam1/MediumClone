import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';
import FormData from 'form-data';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// POST /api/upload - expects { file: base64Data, folder?: string }
router.post('/', async (req, res) => {
  try {
    const { file, folder = 'uploads' } = req.body;
    if (!file) return res.status(400).json({ error: 'Missing file' });
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });
    res.status(201).json({ url: result.secure_url, public_id: result.public_id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/upload/imgbb - expects base64 data
router.post('/imgbb', async (req, res) => {
  try {
    const { file, name = '' } = req.body; // file should be dataURL base64 string
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) return res.status(400).json({ error: 'Missing IMGBB_API_KEY' });
    if (!file) return res.status(400).json({ error: 'Missing file' });

    const match = /^data:(.*?);base64,(.*)$/.exec(file);
    const base64 = match ? match[2] : file;

    const form = new FormData();
    form.append('key', apiKey);
    form.append('image', base64);
    if (name) form.append('name', name);

    const r = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });
    const text = await r.text();
    console.log('ImgBB response status:', r.status);
    console.log('ImgBB response text (first 200 chars):', text.substring(0, 200));
    
    let json;
    try { 
      json = JSON.parse(text); 
    } catch (e) { 
      console.error('Failed to parse ImgBB response:', e);
      return res.status(400).json({ error: 'Invalid JSON response from ImgBB', raw: text.substring(0, 500) }); 
    }
    if (!r.ok || json.success === false) {
      return res.status(r.status || 400).json(json);
    }
    res.status(201).json({ 
      url: json?.data?.url, 
      display_url: json?.data?.display_url,
      title: json?.data?.title,
      id: json?.data?.id
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/upload/video - handles video file uploads via FormData
router.post('/video', upload.single('video'), async (req, res) => {
  try {
    console.log('🎬 Video upload request received');
    console.log('📁 File info:', {
      fieldname: req.file?.fieldname,
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size
    });
    
    if (!req.file) {
      console.error('❌ No video file provided');
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { folder = 'videos' } = req.body;
    console.log('📂 Upload folder:', folder);
    
    // Upload to Cloudinary
    console.log('☁️ Starting Cloudinary upload...');
    const result = await cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'video',
        chunk_size: 6000000, // 6MB chunks for large videos
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          return res.status(400).json({ error: error.message });
        }
        console.log('✅ Video uploaded to Cloudinary successfully:', {
          url: result.secure_url,
          public_id: result.public_id,
          duration: result.duration,
          format: result.format
        });
        res.status(201).json({ 
          url: result.secure_url, 
          public_id: result.public_id,
          duration: result.duration,
          format: result.format
        });
      }
    );

    // Pipe the file buffer to Cloudinary
    console.log('📤 Piping file buffer to Cloudinary...');
    result.end(req.file.buffer);
  } catch (error) {
    console.error('❌ Video upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;


