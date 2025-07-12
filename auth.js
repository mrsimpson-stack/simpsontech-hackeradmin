const users = [
  { username: 'admin', password: 'yourSecurePassword' }
];

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      res.setHeader('Set-Cookie', `adminToken=verified; HttpOnly; Path=/admin; Max-Age=3600`);
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ success: false });
  }
  res.status(405).end();
};