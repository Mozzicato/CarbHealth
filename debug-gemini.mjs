
import fs from 'fs';
import path from 'path';

// Load .env
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
    console.log('Testing Gemini...');
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;

    const body = {
        contents: [{ parts: [{ text: "Hello" }] }]
    };

    const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const status = r.status;
    const text = await r.text();

    const result = { status, text, url: url.replace(GEMINI_KEY, 'REDACTED') };
    console.log(result);
    fs.writeFileSync('gemini_raw_test.json', JSON.stringify(result, null, 2));
}

test();
