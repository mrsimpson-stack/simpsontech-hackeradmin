const userData = require('./users.js').userData;

module.exports = (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Check if IP is blocked
  if (userData.blockedIPs.includes(ip)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Log visit
  userData.visitors.push({
    ip,
    userAgent: req.headers['user-agent'],
    time: new Date().toISOString(),
    path: req.url
  });

  res.status(200).json({ status: 'OK' });
};