const LOGS_ENDPOINT = 'https://9wjpdquiq1.execute-api.eu-north-1.amazonaws.com/logs';
const ALERTS_ENDPOINT = 'https://9wjpdquiq1.execute-api.eu-north-1.amazonaws.com/alerts';

const logsTableBody = document.querySelector('#logs-table tbody');
const alertsTableBody = document.querySelector('#alerts-table tbody');
let latestAlertTimestamps = new Set();

// Sound alert
const alertSound = new Audio('high_alert.mp3');

window.addEventListener('DOMContentLoaded', () => {
  fetchLogs();
  fetchAlerts();
  setupSearch();
  setupExport();
  setupDateFilter();
  setInterval(fetchAlerts, 10000); // Real-time check every 10s
});

async function fetchLogs() {
  try {
    const res = await fetch(LOGS_ENDPOINT);
    const data = await res.json();
    populateLogsTable(data);
  } catch (err) {
    console.error('Error fetching logs:', err);
  }
}

async function fetchAlerts() {
  try {
    const res = await fetch(ALERTS_ENDPOINT);
    const data = await res.json();
    const newHighs = data.filter(alert => alert.severity === 'HIGH' && !latestAlertTimestamps.has(alert.timestamp));
    newHighs.forEach(alert => {
      alertSound.play();
      latestAlertTimestamps.add(alert.timestamp);
    });
    populateAlertsTable(data);
    addAlertFilterControls(data);
  } catch (err) {
    console.error('Error fetching alerts:', err);
  }
}

function populateLogsTable(logs) {
  logsTableBody.innerHTML = '';
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(log => {
    const row = document.createElement('tr');
    row.classList.add('fade-in');
    row.innerHTML = `
      <td>${log.ip}</td>
      <td>${log.comment || '-'}</td>
      <td>${log.username}</td>
      <td>${log.id}</td>
      <td>${log.reason}</td>
      <td>${log.timestamp}</td>
    `;
    logsTableBody.appendChild(row);
  });
}

function populateAlertsTable(alerts) {
  alertsTableBody.innerHTML = '';
  alerts.forEach(alert => {
    const row = document.createElement('tr');
    row.classList.add('fade-in');
    row.innerHTML = `
      <td>${alert.ip}</td>
      <td>${alert.comment || '-'}</td>
      <td>${alert.reason}</td>
      <td><span class="badge ${alert.severity.toLowerCase()}">${alert.severity}</span></td>
      <td>${alert.timestamp}</td>
    `;
    alertsTableBody.appendChild(row);
  });
}

function addAlertFilterControls(alerts) {
  if (document.querySelector('.controls')) return;

  const section = document.querySelector('section.panel:nth-of-type(2)');
  const controls = document.createElement('div');
  controls.className = 'controls';

  const label = document.createElement('label');
  label.textContent = 'Filter by Severity:';

  const select = document.createElement('select');
  ['ALL', 'HIGH', 'MEDIUM', 'LOW'].forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const filtered = select.value === 'ALL' ? alerts : alerts.filter(a => a.severity === select.value);
    populateAlertsTable(filtered);
  });

  controls.appendChild(label);
  controls.appendChild(select);
  section.insertBefore(controls, section.querySelector('.table-wrapper'));
}

function setupSearch() {
  const searchInput = document.createElement('input');
  searchInput.placeholder = '🔎 Search by IP or Username';
  searchInput.style.marginBottom = '10px';
  document.querySelector('section.panel').prepend(searchInput);

  searchInput.addEventListener('input', () => {
    const val = searchInput.value.toLowerCase();
    Array.from(logsTableBody.children).forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
  });
}

function setupExport() {
  const button = document.createElement('button');
  button.textContent = '📥 Export CSV';
  button.style.marginLeft = '10px';
  document.querySelector('section.panel').prepend(button);

  button.addEventListener('click', () => {
    const rows = [['IP', 'Comment', 'Username', 'ID', 'Reason', 'Timestamp']];
    Array.from(logsTableBody.children).forEach(row => {
      rows.push(Array.from(row.children).map(cell => cell.textContent));
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.csv';
    a.click();
  });
}

function setupDateFilter() {
  const from = document.createElement('input');
  const to = document.createElement('input');
  from.type = 'date';
  to.type = 'date';
  from.style.marginRight = '10px';

  const filterBtn = document.createElement('button');
  filterBtn.textContent = '📅 Filter Logs';

  const panel = document.querySelector('section.panel');
  const controlGroup = document.createElement('div');
  controlGroup.className = 'controls';
  controlGroup.append('Date From:', from, 'To:', to, filterBtn);
  panel.prepend(controlGroup);

  filterBtn.addEventListener('click', async () => {
    const res = await fetch(LOGS_ENDPOINT);
    const data = await res.json();
    const f = from.value, t = to.value;
    const filtered = data.filter(d => {
      const ts = d.timestamp.split('T')[0];
      return (!f || ts >= f) && (!t || ts <= t);
    });
    populateLogsTable(filtered);
  });
}

// CSS animation class
const style = document.createElement('style');
style.textContent = `
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);
