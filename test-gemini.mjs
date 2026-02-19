
import fs from 'fs';
import path from 'path';
import handler from './api/insights.js';

// 1. Load environment variables from .env
try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const val = valueParts.join('=').trim().replace(/^["']|["']$/g, ''); // remove quotes
                process.env[key.trim()] = val;
            }
        });
        console.log('✅ Loaded .env file');
    } else {
        console.warn('⚠️ .env file not found');
    }
} catch (e) {
    console.error('Error loading .env:', e);
}

// 2. Mock Request and Response
const req = {
    method: 'POST',
    body: {
        foodLog: [
            { food: { name: 'Coca-Cola', carbs: 39, sugar: 39 }, quantity: 1 },
            { food: { name: 'White Rice', carbs: 45, sugar: 0 }, quantity: 1 }
        ]
    }
};

const res = {
    status: (code) => {
        return {
            json: (data) => {
                console.log(`\nResponse Status: ${code}`);
                console.log('Response Body:', JSON.stringify(data, null, 2));
                return data;
            }
        };
    }
};

// 3. Run the handler
console.log('🚀 Testing Gemini API integration...');
handler(req, res).catch(err => {
    console.error('Handler error:', err);
});
