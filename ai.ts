import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet } from '../services/redis';

const router = Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Generate character
router.post('/generate/character', async (req: Request, res: Response) => {
  try {
    const { prompt, style = 'fantasy', ageRating = 'Everyone' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check cache first
    const cacheKey = `ai_character:${Buffer.from(prompt + style + ageRating).toString('base64')}`;
    const cachedResult = await cacheGet(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const characterPrompt = `
Generate a detailed character for a role-playing platform based on this prompt: "${prompt}"

Style: ${style}
Age Rating: ${ageRating}

Please provide the response in the following JSON format:
{
  "name": "Character Name",
  "description": "Brief character description (max 200 words)",
  "personality": "Character personality traits (max 100 words)",
  "backstory": "Character backstory (max 300 words)",
  "appearance": "Physical appearance description (max 150 words)",
  "tags": ["tag1", "tag2", "tag3"],
  "warnings": []
}

Make sure the content is appropriate for the ${ageRating} age rating.
Be creative but keep descriptions concise and engaging.
Include relevant tags that describe the character's traits, role, or theme.
`;

    const result = await model.generateContent(characterPrompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let characterData;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.substring(jsonStart, jsonEnd);
      characterData = JSON.parse(jsonStr);
    } catch (parseError) {
      logger.warn('Failed to parse AI response as JSON:', parseError);
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    // Cache the result
    await cacheSet(cacheKey, { character: characterData }, 3600);

    logger.info(`Character generated for user ${req.user!.username}`);
    res.json({ character: characterData });
  } catch (error) {
    logger.error('Generate character error:', error);
    res.status(500).json({ error: 'Failed to generate character' });
  }
});

// Generate world
router.post('/generate/world', async (req: Request, res: Response) => {
  try {
    const { prompt, genre = 'fantasy', scope = 'region', ageRating = 'Everyone' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cacheKey = `ai_world:${Buffer.from(prompt + genre + scope + ageRating).toString('base64')}`;
    const cachedResult = await cacheGet(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const worldPrompt = `
Create a detailed world/setting for a role-playing platform based on this prompt: "${prompt}"

Genre: ${genre}
Scope: ${scope}
Age Rating: ${ageRating}

Please provide the response in the following JSON format:
{
  "name": "World Name",
  "description": "Brief world description (max 200 words)",
  "lore": "World history and mythology (max 500 words)",
  "rules": "World rules, physics, magic systems, etc. (max 300 words)",
  "locations": ["Location 1", "Location 2", "Location 3"],
  "cultures": ["Culture 1", "Culture 2"],
  "tags": ["tag1", "tag2", "tag3"],
  "warnings": []
}

Make sure the content is appropriate for the ${ageRating} age rating.
Focus on creating an immersive and consistent world that players can roleplay in.
`;

    const result = await model.generateContent(worldPrompt);
    const response = await result.response;
    const text = response.text();

    let worldData;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.substring(jsonStart, jsonEnd);
      worldData = JSON.parse(jsonStr);
    } catch (parseError) {
      logger.warn('Failed to parse AI world response as JSON:', parseError);
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    await cacheSet(cacheKey, { world: worldData }, 3600);

    logger.info(`World generated for user ${req.user!.username}`);
    res.json({ world: worldData });
  } catch (error) {
    logger.error('Generate world error:', error);
    res.status(500).json({ error: 'Failed to generate world' });
  }
});

// Generate story
router.post('/generate/story', async (req: Request, res: Response) => {
  try {
    const { prompt, genre = 'fantasy', length = 'short', ageRating = 'Everyone', characters = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cacheKey = `ai_story:${Buffer.from(prompt + genre + length + ageRating + characters.join(',')).toString('base64')}`;
    const cachedResult = await cacheGet(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const characterInfo = characters.length > 0 ? 
      `\nCharacters to include: ${characters.join(', ')}` : '';

    const storyPrompt = `
Write a ${length} story for a role-playing platform based on this prompt: "${prompt}"

Genre: ${genre}
Length: ${length}
Age Rating: ${ageRating}${characterInfo}

Please provide the response in the following JSON format:
{
  "title": "Story Title",
  "description": "Brief story description/summary (max 200 words)",
  "content": "Full story content",
  "genre": "${genre}",
  "tags": ["tag1", "tag2", "tag3"],
  "warnings": []
}

Make sure the content is appropriate for the ${ageRating} age rating.
Create an engaging story that could inspire roleplay or collaborative storytelling.
The story should be ${length === 'short' ? '500-1000' : length === 'medium' ? '1000-2000' : '2000-5000'} words approximately.
`;

    const result = await model.generateContent(storyPrompt);
    const response = await result.response;
    const text = response.text();

    let storyData;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.substring(jsonStart, jsonEnd);
      storyData = JSON.parse(jsonStr);
    } catch (parseError) {
      logger.warn('Failed to parse AI story response as JSON:', parseError);
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    await cacheSet(cacheKey, { story: storyData }, 3600);

    logger.info(`Story generated for user ${req.user!.username}`);
    res.json({ story: storyData });
  } catch (error) {
    logger.error('Generate story error:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

// Generate meme
router.post('/generate/meme', async (req: Request, res: Response) => {
  try {
    const { topic, style = 'funny', context = '' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const cacheKey = `ai_meme:${Buffer.from(topic + style + context).toString('base64')}`;
    const cachedResult = await cacheGet(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const memePrompt = `
Generate meme text ideas for the topic: "${topic}"

Style: ${style}
Context: ${context}

Please provide the response in the following JSON format:
{
  "suggestions": [
    {
      "topText": "Top text for meme",
      "bottomText": "Bottom text for meme",
      "description": "Brief explanation of the meme concept"
    }
  ]
}

Generate 3-5 different meme text suggestions.
Keep the text appropriate and funny.
Make sure the memes are relatable to the role-playing community.
`;

    const result = await model.generateContent(memePrompt);
    const response = await result.response;
    const text = response.text();

    let memeData;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.substring(jsonStart, jsonEnd);
      memeData = JSON.parse(jsonStr);
    } catch (parseError) {
      logger.warn('Failed to parse AI meme response as JSON:', parseError);
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    await cacheSet(cacheKey, memeData, 3600);

    logger.info(`Meme suggestions generated for user ${req.user!.username}`);
    res.json(memeData);
  } catch (error) {
    logger.error('Generate meme error:', error);
    res.status(500).json({ error: 'Failed to generate meme suggestions' });
  }
});

// Continue story/collaborative writing
router.post('/continue/story', async (req: Request, res: Response) => {
  try {
    const { currentContent, direction = 'continue', characters = [], world = null } = req.body;

    if (!currentContent) {
      return res.status(400).json({ error: 'Current story content is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const worldInfo = world ? `World setting: ${world}` : '';
    const characterInfo = characters.length > 0 ? 
      `Characters involved: ${characters.join(', ')}` : '';

    const continuePrompt = `
Continue this story in an engaging way:

"${currentContent.slice(-1000)}" // Last 1000 characters for context

Direction: ${direction} (continue naturally, add conflict, add resolution, etc.)
${worldInfo}
${characterInfo}

Please provide the response in the following JSON format:
{
  "continuation": "The story continuation (200-500 words)",
  "suggestions": ["Alternative direction 1", "Alternative direction 2", "Alternative direction 3"]
}

Write in a style that matches the existing story.
Keep the continuation engaging and leave room for further collaboration.
Provide 3 alternative directions the story could take next.
`;

    const result = await model.generateContent(continuePrompt);
    const response = await result.response;
    const text = response.text();

    let continuationData;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonStr = text.substring(jsonStart, jsonEnd);
      continuationData = JSON.parse(jsonStr);
    } catch (parseError) {
      logger.warn('Failed to parse AI continuation response as JSON:', parseError);
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    logger.info(`Story continuation generated for user ${req.user!.username}`);
    res.json(continuationData);
  } catch (error) {
    logger.error('Continue story error:', error);
    res.status(500).json({ error: 'Failed to continue story' });
  }
});

export default router;