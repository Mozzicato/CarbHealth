
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
});

const GEMINI_KEY = env.GEMINI_API_KEY;

async function test() {
    console.log('Listing Models...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`;

    const r = await fetch(url);
    const text = await r.text();
    fs.writeFileSync('gemini_models.json', text);
    console.log('Done.');
}
test();
