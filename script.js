// Login functionality
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const [username, password] = e.target.elements;
  
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });
  
  if (response.ok) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadData();
  } else {
    alert('Login failed');
  }
});

// Load and display data
async function loadData() {
  const response = await fetch('/api/users');
  if (!response.ok) return;
  
  const data = await response.json();
  
  // Update stats
  document.getElementById('totalVisitors').textContent = data.visitors.length;
  document.getElementById('blockedCount').textContent = data.blockedIPs.length;
  
  // Populate visitors table
  const visitorsBody = document.querySelector('#visitorsTable tbody');
  visitorsBody.innerHTML = data.visitors.slice(-20).reverse().map(visitor => `
    <tr>
      <td>${visitor.ip}</td>
      <td>${new Date(visitor.time).toLocaleString()}</td>
      <td>${visitor.userAgent}</td>
    </tr>
  `).join('');
  
  // Populate blocked IPs table
  const blockedBody = document.querySelector('#blockedTable tbody');
  blockedBody.innerHTML = data.blockedIPs.map(ip => `
    <tr>
      <td>${ip}</td>
      <td><button class="unblock-ip" data-ip="${ip}">Unblock</button></td>
    </tr>
  `).join('');
}

// Block/unblock functionality
document.getElementById('blockBtn').addEventListener('click', async () => {
  const ip = document.getElementById('ipInput').value.trim();
  if (!ip) return;
  
  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'block', ip })
  });
  
  loadData();
});

document.getElementById('unblockBtn').addEventListener('click', async () => {
  const ip = document.getElementById('ipInput').value.trim();
  if (!ip) return;
  
  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'unblock', ip })
  });
  
  loadData();
});

// Delegate unblock buttons
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('unblock-ip')) {
    const ip = e.target.dataset.ip;
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unblock', ip })
    });
    loadData();
  }
});

// Auto-load if already authenticated
if (document.cookie.includes('adminToken=verified')) {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  loadData();
}