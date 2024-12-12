import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';

const client = new TextToSpeechClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const languageCode = searchParams.get('languageCode') || 'en-IN';
    const voiceType = searchParams.get('voiceType') || 'en-IN-Wavenet-D';

    if (!text) {
      return new Response(
        JSON.stringify({ message: 'Text is required.' }),
        { status: 400 }
      );
    }

    const request = {
      input: { text },
      voice: { languageCode, name: voiceType },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);

    // Save the audio content to a file
    const fileName = `news-${Date.now()}.mp3`;
    const filePath = path.join(process.cwd(), 'public', fileName);
    fs.writeFileSync(filePath, response.audioContent, 'binary');

    return new Response(JSON.stringify({ audioUrl: `/${fileName}` }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to synthesize speech.', error: error.message }),
      { status: 500 }
    );
  }
}
