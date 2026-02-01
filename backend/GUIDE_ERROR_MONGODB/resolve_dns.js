import https from 'https';

const srvDomain = '_mongodb._tcp.cluster0.1ksko0k.mongodb.net';
const url = `https://dns.google/resolve?name=${srvDomain}&type=SRV`;

console.log(`Querying ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.Answer) {
                console.log('--- SUCCESS ---');
                json.Answer.forEach(ans => {
                    // SRV record format: priority weight port target
                    const parts = ans.data.split(' ');
                    const target = parts[3];
                    console.log(`Target: ${target}`);
                });
                console.log('--- END ---');
            } else {
                console.log('No Answer found:', json);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', (err) => {
    console.error('Error querying Google DNS:', err);
});
