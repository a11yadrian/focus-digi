module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://a11yadrian.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    res.status(200).json({ message: 'CORS is working' });
  };
  