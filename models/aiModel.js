const axios = require('axios');

async function generateWebPageCode(prompt) {
    const url = 'https://chat-gpt26.p.rapidapi.com/';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'd95138bcccmsh5d35a3a49ecb578p17c5b4jsn72168f34851e',
            'x-rapidapi-host': 'chat-gpt26.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        }
    };

    try {
        const response = await axios(url, options);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = { generateWebPageCode };
