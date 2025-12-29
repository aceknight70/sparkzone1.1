import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'video/quicktime'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload single file
router.post('/single', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type = 'general', folder = 'spark-zone' } = req.body;
    
    // Determine resource type
    let resourceType = 'image';
    if (req.file.mimetype.startsWith('video/')) {
      resourceType = 'video';
    } else if (req.file.mimetype.startsWith('audio/')) {
      resourceType = 'raw';
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType as any,
        folder: `${folder}/${type}`,
        public_id: `${Date.now()}-${req.user!.id}`,
        transformation: resourceType === 'image' ? [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
          { fetch_format: 'auto' }
        ] : undefined
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Upload failed' });
        }

        logger.info(`File uploaded by ${req.user!.username}: ${result!.public_id}`);
        res.json({
          message: 'File uploaded successfully',
          url: result!.secure_url,
          publicId: result!.public_id,
          resourceType: result!.resource_type,
          format: result!.format,
          width: result!.width,
          height: result!.height,
          bytes: result!.bytes
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { type = 'general', folder = 'spark-zone' } = req.body;
    const files = req.files as Express.Multer.File[];
    
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        let resourceType = 'image';
        if (file.mimetype.startsWith('video/')) {
          resourceType = 'video';
        } else if (file.mimetype.startsWith('audio/')) {
          resourceType = 'raw';
        }

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType as any,
            folder: `${folder}/${type}`,
            public_id: `${Date.now()}-${req.user!.id}-${Math.random().toString(36).substr(2, 9)}`,
            transformation: resourceType === 'image' ? [
              { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
              { fetch_format: 'auto' }
            ] : undefined
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result!.secure_url,
                publicId: result!.public_id,
                resourceType: result!.resource_type,
                format: result!.format,
                width: result!.width,
                height: result!.height,
                bytes: result!.bytes
              });
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    
    logger.info(`${files.length} files uploaded by ${req.user!.username}`);
    res.json({
      message: 'Files uploaded successfully',
      files: results
    });
  } catch (error) {
    logger.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Delete file
router.delete('/:publicId', async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;
    const { resourceType = 'image' } = req.body;
    
    // Decode the public ID (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);
    
    const result = await cloudinary.uploader.destroy(decodedPublicId, {
      resource_type: resourceType
    });

    if (result.result === 'ok') {
      logger.info(`File deleted by ${req.user!.username}: ${decodedPublicId}`);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Get upload signature for client-side uploads
router.post('/signature', (req: Request, res: Response) => {
  try {
    const { folder = 'spark-zone', resourceType = 'image' } = req.body;
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: `${folder}/user-${req.user!.id}`,
        resource_type: resourceType
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: `${folder}/user-${req.user!.id}`
    });
  } catch (error) {
    logger.error('Signature generation error:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
});

export default router;