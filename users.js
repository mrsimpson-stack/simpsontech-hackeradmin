// Simple in-memory "database" - replace with real DB in production
let userData = {
  visitors: [],
  blockedIPs: []
};

module.exports = (req, res) => {
  // Verify admin token
  if (!req.headers.cookie?.includes('adminToken=verified')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(userData);
  }

  if (req.method === 'POST') {
    const { action, ip } = req.body;
    
    if (action === 'block' && !userData.blockedIPs.includes(ip)) {
      userData.blockedIPs.push(ip);
    } else if (action === 'unblock') {
      userData.blockedIPs = userData.blockedIPs.filter(x => x !== ip);
    }
    
    return res.status(200).json(userData);
  }

  res.status(405).end();
};