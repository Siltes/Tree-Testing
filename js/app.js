'use strict';

// ===== UTILS =====

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// ===== DATA LAYER =====

const DB = {
  KEY: 'tree-testing-v1',

  load() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
    catch { return []; }
  },

  save(campaigns) {
    localStorage.setItem(this.KEY, JSON.stringify(campaigns));
  },

  getCampaigns() { return this.load(); },

  getCampaign(id) { return this.load().find(c => c.id === id) || null; },

  saveCampaign(campaign) {
    const all = this.load();
    const idx = all.findIndex(c => c.id === campaign.id);
    if (idx >= 0) all[idx] = campaign; else all.push(campaign);
    this.save(all);
  },

  deleteCampaign(id) { this.save(this.load().filter(c => c.id !== id)); }
};

// ===== TREE UTILS =====

function parseCSV(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const root = { nodes: [] };
  const nodeIndex = {};

  lines.forEach(line => {
    // Support comma or ">" as separator
    const sep = line.includes('>') ? '>' : ',';
    const parts = line.split(sep).map(p => p.trim()).filter(Boolean);
    if (!parts.length) return;

    let currentChildren = root.nodes;
    let pathKey = '';

    parts.forEach(part => {
      pathKey = pathKey ? pathKey + '\x00' + part : part;
      if (!nodeIndex[pathKey]) {
        const node = { id: 'n_' + generateId(), label: part, children: [] };
        nodeIndex[pathKey] = node;
        currentChildren.push(node);
      }
      currentChildren = nodeIndex[pathKey].children;
    });
  });

  return root;
}

function parseMD(text) {
  const lines = text.split('\n');
  const root = { nodes: [] };
  const stack = [{ level: -1, children: root.nodes }];

  lines.forEach(line => {
    const match = line.match(/^(\s*)[*\-+]\s+(.+)$/);
    if (!match) return;

    const indent = match[1].length;
    const label = match[2].trim();
    // Normalise: treat every 2 spaces as one level (also handles 4-space indent)
    const level = Math.floor(indent / 2);

    while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();

    const node = { id: 'n_' + generateId(), label, children: [] };
    stack[stack.length - 1].children.push(node);
    stack.push({ level, children: node.children });
  });

  return root;
}

function flattenTree(nodes, result = []) {
  (nodes || []).forEach(node => {
    result.push(node);
    if (node.children && node.children.length) flattenTree(node.children, result);
  });
  return result;
}

function findNodeById(nodes, id) {
  for (const node of (nodes || [])) {
    if (node.id === id) return node;
    const found = findNodeById(node.children, id);
    if (found) return found;
  }
  return null;
}

// ===== ROUTER =====

const App = {
  state: { view: 'home', campaignId: null, tab: 'tree' },

  navigate(view, params = {}) {
    this.state = { view, tab: 'tree', ...params };
    this.render();
    window.scrollTo(0, 0);
  },

  render() {
    const main = document.getElementById('main-content');
    const bc = document.getElementById('header-breadcrumb');

    if (this.state.view === 'home') {
      bc.innerHTML = '';
      main.innerHTML = renderHome();
    } else if (this.state.view === 'campaign') {
      const campaign = DB.getCampaign(this.state.campaignId);
      if (!campaign) { this.navigate('home'); return; }
      bc.innerHTML = `/ <a href="#" onclick="App.navigate('home');return false;">Campaigns</a> &rsaquo; <span>${escapeHtml(campaign.name)}</span>`;
      main.innerHTML = renderCampaignPage(campaign, this.state.tab);
    }
  }
};

// ===== HOME VIEW =====

function renderHome() {
  const campaigns = DB.getCampaigns();
  return `
    <div class="page-header">
      <h2>Campaigns</h2>
      <button class="btn btn-primary" onclick="showNewCampaignModal()">+ New Campaign</button>
    </div>
    ${campaigns.length === 0
      ? `<div class="empty-state">
          <div class="empty-icon">🌳</div>
          <h3>No campaigns yet</h3>
          <p>Create your first tree testing campaign to get started.</p>
          <button class="btn btn-primary btn-lg" onclick="showNewCampaignModal()">Create Campaign</button>
        </div>`
      : `<div class="campaigns-grid">${campaigns.map(renderCampaignCard).join('')}</div>`}
  `;
}

function renderCampaignCard(c) {
  const taskCount = (c.tasks || []).length;
  const resultCount = (c.results || []).length;
  const hasTree = (c.tree && c.tree.nodes && c.tree.nodes.length > 0);

  return `
    <div class="campaign-card">
      <div class="campaign-card-header">
        <h3>${escapeHtml(c.name)}</h3>
        <span class="campaign-date">${formatDate(c.createdAt)}</span>
      </div>
      ${c.description ? `<p class="campaign-desc">${escapeHtml(c.description)}</p>` : ''}
      <div class="campaign-meta">
        <span class="meta-badge ${hasTree ? '' : 'meta-warn'}">${hasTree ? '✓ Tree set' : '⚠ No tree'}</span>
        <span class="meta-badge">${taskCount} task${taskCount !== 1 ? 's' : ''}</span>
        ${resultCount > 0 ? `<span class="meta-badge">${resultCount} result${resultCount !== 1 ? 's' : ''}</span>` : ''}
      </div>
      <div class="campaign-card-actions">
        <button class="btn btn-primary btn-sm" onclick="App.navigate('campaign',{campaignId:'${c.id}',tab:'tree'})">Open</button>
        ${hasTree && taskCount > 0
          ? `<button class="btn btn-secondary btn-sm" onclick="exportCampaign('${c.id}')">⬇ Export</button>`
          : ''}
        <button class="btn btn-danger btn-sm" onclick="deleteCampaign('${c.id}')">Delete</button>
      </div>
    </div>`;
}

// ===== CAMPAIGN PAGE =====

function renderCampaignPage(campaign, activeTab) {
  const tabs = [
    { key: 'tree', label: 'Tree' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'export', label: 'Export' },
    { key: 'results', label: `Results ${(campaign.results || []).length > 0 ? '(' + campaign.results.length + ')' : ''}` }
  ];

  return `
    <div class="campaign-page">
      <div class="campaign-page-header">
        <div>
          <h2>${escapeHtml(campaign.name)}</h2>
          ${campaign.description ? `<p class="text-muted">${escapeHtml(campaign.description)}</p>` : ''}
          ${campaign.ownerEmail ? `<p class="text-muted small">Results to: ${escapeHtml(campaign.ownerEmail)}</p>` : ''}
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showEditCampaignModal('${campaign.id}')">Edit Info</button>
      </div>

      <div class="tabs">
        ${tabs.map(t => `
          <button class="tab-btn ${t.key === activeTab ? 'active' : ''}"
            onclick="App.navigate('campaign',{campaignId:'${campaign.id}',tab:'${t.key}'})">${t.label}</button>
        `).join('')}
      </div>

      <div class="tab-content">
        ${activeTab === 'tree'    ? renderTreeTab(campaign)    : ''}
        ${activeTab === 'tasks'   ? renderTasksTab(campaign)   : ''}
        ${activeTab === 'export'  ? renderExportTab(campaign)  : ''}
        ${activeTab === 'results' ? renderResultsTab(campaign) : ''}
      </div>
    </div>`;
}

// ===== TREE TAB =====

function renderTreeTab(campaign) {
  const hasTree = campaign.tree && campaign.tree.nodes && campaign.tree.nodes.length > 0;
  const count = hasTree ? flattenTree(campaign.tree.nodes).length : 0;

  return `
    <div>
      <div class="section-header">
        <h3>Tree Structure${hasTree ? ` <span class="text-muted small">(${count} nodes)</span>` : ''}</h3>
        <div class="btn-group">
          <button class="btn btn-secondary btn-sm" onclick="showCSVImportModal('${campaign.id}')">Import CSV</button>
          <button class="btn btn-secondary btn-sm" onclick="showMDImportModal('${campaign.id}')">Import Markdown</button>
        </div>
      </div>
      ${hasTree
        ? `<div class="card tree-preview">${renderAdminTree(campaign.tree.nodes, 0)}</div>`
        : `<div class="empty-state small">
            <p>No tree defined yet. Import a CSV or Markdown list to create your navigation tree.</p>
            <div class="btn-group" style="justify-content:center">
              <button class="btn btn-primary" onclick="showCSVImportModal('${campaign.id}')">Import CSV</button>
              <button class="btn btn-primary" onclick="showMDImportModal('${campaign.id}')">Import Markdown</button>
            </div>
          </div>`}
    </div>`;
}

function renderAdminTree(nodes, depth) {
  if (!nodes || !nodes.length) return '';
  return `<ul class="tree-list" style="padding-left:${depth > 0 ? '1.5rem' : '0'}">
    ${nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const nodeId = `tree-node-${node.id}`;
      const childId = `tree-children-${node.id}`;
      return `<li class="tree-item">
        <div class="tree-node" onclick="${hasChildren ? `toggleTreeNode('${nodeId}','${childId}')` : ''}">
          <span class="tree-node-icon">${hasChildren ? '📁' : '📄'}</span>
          <span class="tree-node-label">${escapeHtml(node.label)}</span>
          ${hasChildren ? `<span class="tree-toggle" id="${nodeId}">▶</span>` : ''}
        </div>
        ${hasChildren
          ? `<div class="tree-children" id="${childId}">${renderAdminTree(node.children, depth + 1)}</div>`
          : ''}
      </li>`;
    }).join('')}
  </ul>`;
}

function toggleTreeNode(toggleId, childrenId) {
  const toggle = document.getElementById(toggleId);
  const children = document.getElementById(childrenId);
  if (!toggle || !children) return;
  const open = children.classList.toggle('open');
  toggle.classList.toggle('open', open);
}

// ===== TASKS TAB =====

function renderTasksTab(campaign) {
  const hasTree = campaign.tree && campaign.tree.nodes && campaign.tree.nodes.length > 0;
  const tasks = campaign.tasks || [];

  return `
    <div>
      <div class="section-header">
        <h3>Tasks</h3>
        ${hasTree
          ? `<button class="btn btn-primary btn-sm" onclick="showAddTaskModal('${campaign.id}')">+ Add Task</button>`
          : ''}
      </div>
      ${!hasTree
        ? `<div class="alert alert-warn">Define the tree structure first before adding tasks.</div>`
        : tasks.length === 0
          ? `<div class="empty-state small">
              <p>No tasks yet. Tasks define what participants will be asked to find in the tree.</p>
              <button class="btn btn-primary" onclick="showAddTaskModal('${campaign.id}')">Add First Task</button>
            </div>`
          : `<div class="tasks-list">${tasks.map((t, i) => renderTaskItem(campaign, t, i)).join('')}</div>`}
    </div>`;
}

function renderTaskItem(campaign, task, index) {
  const correctNodes = (task.correctNodeIds || []).map(id => {
    const n = findNodeById(campaign.tree.nodes, id);
    return n ? n.label : '(deleted node)';
  });

  return `
    <div class="task-card card">
      <div class="task-header">
        <span class="task-number">Task ${index + 1}</span>
        <div class="task-actions">
          <button class="btn btn-secondary btn-sm" onclick="showEditTaskModal('${campaign.id}','${task.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask('${campaign.id}','${task.id}')">Delete</button>
        </div>
      </div>
      <p class="task-question">${escapeHtml(task.question)}</p>
      <div class="task-answers">
        <span class="answer-label">Expected answer${correctNodes.length !== 1 ? 's' : ''}:</span>
        ${correctNodes.length > 0
          ? correctNodes.map(n => `<span class="answer-tag">${escapeHtml(n)}</span>`).join('')
          : '<span class="text-muted">None set</span>'}
      </div>
    </div>`;
}

// ===== EXPORT TAB =====

function renderExportTab(campaign) {
  const hasTree = campaign.tree && campaign.tree.nodes && campaign.tree.nodes.length > 0;
  const hasTasks = campaign.tasks && campaign.tasks.length > 0;
  const canExport = hasTree && hasTasks;

  return `
    <div>
      <h3 style="margin-bottom:.75rem">Export Participant File</h3>
      <p class="text-muted" style="margin-bottom:1rem">
        Generate a self-contained HTML file you can send to participants. Each participant
        completes the test locally and emails you their results JSON.
      </p>

      <div class="card export-checklist">
        <h4>Pre-export checklist</h4>
        <ul>
          <li class="${hasTree ? 'check-ok' : 'check-fail'}">${hasTree ? '✓' : '✗'} Tree structure defined</li>
          <li class="${hasTasks ? 'check-ok' : 'check-fail'}">${hasTasks ? '✓' : '✗'} At least one task added (${(campaign.tasks || []).length})</li>
          <li class="${campaign.ownerEmail ? 'check-ok' : 'check-warn'}">${campaign.ownerEmail ? '✓' : '⚠'} Owner email: ${campaign.ownerEmail ? escapeHtml(campaign.ownerEmail) : '<em>not set — participants won\'t get a mailto link</em>'}</li>
        </ul>
      </div>

      ${canExport
        ? `<div class="export-actions">
            <button class="btn btn-primary btn-lg" onclick="exportCampaign('${campaign.id}')">⬇ Export Participant File</button>
          </div>
          <div class="card export-instructions" style="margin-top:1rem">
            <h4>How it works</h4>
            <ol>
              <li>Click <strong>Export</strong> — a standalone <code>.html</code> file is downloaded.</li>
              <li>Send that file to your participants (email, Slack, etc.).</li>
              <li>Participants open it in any browser — no server needed.</li>
              <li>After completing all tasks they download a <code>.json</code> results file and are prompted to email it to you.</li>
              <li>Import the JSON files here in the <strong>Results</strong> tab to see aggregated analysis.</li>
            </ol>
          </div>`
        : `<div class="alert alert-warn">Complete the checklist above before exporting.</div>`}
    </div>`;
}

// ===== RESULTS TAB =====

function renderResultsTab(campaign) {
  const results = campaign.results || [];

  return `
    <div>
      <div class="section-header">
        <h3>Results</h3>
        <label class="btn btn-secondary btn-sm" style="cursor:pointer">
          ⬆ Import Results
          <input type="file" accept=".json" multiple style="display:none"
                 onchange="importResults('${campaign.id}', this.files)">
        </label>
      </div>
      ${results.length === 0
        ? `<div class="empty-state small">
            <p>No results yet. Export the participant file, collect responses, then import the JSON files here.</p>
          </div>`
        : renderResultsData(campaign, results)}
    </div>`;
}

function renderResultsData(campaign, results) {
  const tasks = campaign.tasks || [];

  const taskStats = tasks.map(task => {
    const responses = results.flatMap(r => (r.tasks || []).filter(t => t.taskId === task.id));
    const correct = responses.filter(t => t.isCorrect).length;
    const times = responses.filter(t => t.timeSpentMs != null).map(t => t.timeSpentMs);
    const avgTime = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000) : null;
    return { task, responses, correct, avgTime };
  });

  return `
    <div class="results-summary">
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-value">${results.length}</div>
          <div class="stat-label">Participants</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${tasks.length}</div>
          <div class="stat-label">Tasks</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${taskStats.length > 0
            ? Math.round(taskStats.reduce((s, ts) => s + (ts.responses.length > 0 ? ts.correct / ts.responses.length * 100 : 0), 0) / taskStats.length) + '%'
            : '—'}</div>
          <div class="stat-label">Avg Success</div>
        </div>
      </div>

      <h4 style="margin-bottom:.75rem">Per-Task Breakdown</h4>
      <div class="tasks-results">
        ${taskStats.map((ts, i) => `
          <div class="task-result-card card">
            <div class="task-result-header">
              <strong>Task ${i + 1}:</strong> ${escapeHtml(ts.task.question)}
            </div>
            <div class="task-result-stats">
              <span class="stat-inline">${ts.responses.length} response${ts.responses.length !== 1 ? 's' : ''}</span>
              <span class="stat-inline success">${ts.responses.length > 0 ? Math.round(ts.correct / ts.responses.length * 100) : 0}% correct</span>
              ${ts.avgTime != null ? `<span class="stat-inline">avg ${ts.avgTime}s</span>` : ''}
            </div>
            ${ts.responses.length > 0 ? `
              <div class="scroll-x">
                <table class="results-table">
                  <thead>
                    <tr>
                      <th>Participant</th>
                      <th>Selected</th>
                      <th>Path taken</th>
                      <th>✓?</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ts.responses.map(tr => {
                      const participant = results.find(r => (r.tasks || []).includes(tr));
                      return `<tr>
                        <td>${escapeHtml((participant || {}).participantName || '?')}</td>
                        <td>${escapeHtml(tr.selectedNodeLabel || '—')}</td>
                        <td class="path-cell">${(tr.selectedPath || []).join(' › ')}</td>
                        <td class="${tr.isCorrect ? 'correct' : 'incorrect'}">${tr.isCorrect ? '✓' : '✗'}</td>
                        <td>${tr.timeSpentMs != null ? Math.round(tr.timeSpentMs / 1000) + 's' : '—'}</td>
                      </tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>`;
}

// ===== MODALS =====

function showModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) hideModal();
  });
});

// --- Campaign modals ---

function showNewCampaignModal() {
  showModal(`
    <h3>New Campaign</h3>
    <form onsubmit="createCampaign(event)">
      <div class="form-group">
        <label>Campaign name <span style="color:#dc2626">*</span></label>
        <input type="text" name="name" class="form-input" required placeholder="e.g. Website Navigation Test" autofocus>
      </div>
      <div class="form-group">
        <label>Description <span class="text-muted">(optional)</span></label>
        <textarea name="description" class="form-input" rows="2" placeholder="Brief description for your own reference"></textarea>
      </div>
      <div class="form-group">
        <label>Your email <span class="text-muted">(participants will be asked to send results here)</span></label>
        <input type="email" name="ownerEmail" class="form-input" placeholder="you@example.com">
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="hideModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Campaign</button>
      </div>
    </form>`);
}

function showEditCampaignModal(campaignId) {
  const c = DB.getCampaign(campaignId);
  if (!c) return;
  showModal(`
    <h3>Edit Campaign Info</h3>
    <form onsubmit="updateCampaign(event,'${campaignId}')">
      <div class="form-group">
        <label>Campaign name <span style="color:#dc2626">*</span></label>
        <input type="text" name="name" class="form-input" required value="${escapeHtml(c.name)}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description" class="form-input" rows="2">${escapeHtml(c.description || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Your email</label>
        <input type="email" name="ownerEmail" class="form-input" value="${escapeHtml(c.ownerEmail || '')}">
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="hideModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>`);
}

// --- Tree import modals ---

function showCSVImportModal(campaignId) {
  showModal(`
    <h3>Import Tree from CSV</h3>
    <p class="text-muted small" style="margin-bottom:.5rem">
      Each row is a path from root to leaf. Use comma <code>,</code> or <code>&gt;</code> as separator.
    </p>
    <div class="code-example">Home &gt; Products &gt; Electronics<br>Home &gt; Products &gt; Clothing<br>Home &gt; About Us</div>
    <div class="form-group">
      <label>Upload a CSV / TXT file</label>
      <input type="file" accept=".csv,.txt" class="form-input" onchange="loadFileIntoTextarea(this,'csv-text',updateCSVPreview)">
    </div>
    <div class="form-group">
      <label>Or paste content</label>
      <textarea id="csv-text" class="form-input monospace" rows="7"
        placeholder="Home,Products,Electronics&#10;Home,Products,Clothing&#10;Home,About Us"
        oninput="updateCSVPreview()"></textarea>
    </div>
    <div id="csv-preview" style="margin-top:.5rem"></div>
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" onclick="importCSV('${campaignId}')">Import Tree</button>
    </div>`);
}

function showMDImportModal(campaignId) {
  showModal(`
    <h3>Import Tree from Markdown</h3>
    <p class="text-muted small" style="margin-bottom:.5rem">
      Nested Markdown list — indent with 2 or 4 spaces per level.
    </p>
    <div class="code-example">- Home<br>&nbsp;&nbsp;- Products<br>&nbsp;&nbsp;&nbsp;&nbsp;- Electronics<br>&nbsp;&nbsp;&nbsp;&nbsp;- Clothing<br>&nbsp;&nbsp;- About Us</div>
    <div class="form-group">
      <label>Upload a Markdown / TXT file</label>
      <input type="file" accept=".md,.txt" class="form-input" onchange="loadFileIntoTextarea(this,'md-text',updateMDPreview)">
    </div>
    <div class="form-group">
      <label>Or paste content</label>
      <textarea id="md-text" class="form-input monospace" rows="9"
        placeholder="- Home&#10;  - Products&#10;    - Electronics"
        oninput="updateMDPreview()"></textarea>
    </div>
    <div id="md-preview" style="margin-top:.5rem"></div>
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" onclick="importMD('${campaignId}')">Import Tree</button>
    </div>`);
}

// --- Task modals ---

function showAddTaskModal(campaignId) {
  const campaign = DB.getCampaign(campaignId);
  if (!campaign) return;
  showModal(`
    <h3>Add Task</h3>
    <div class="form-group">
      <label>Question <span style="color:#dc2626">*</span></label>
      <textarea id="task-question" class="form-input" rows="3"
        placeholder="e.g. Where would you find information about product returns?" autofocus></textarea>
    </div>
    <div class="form-group">
      <label>Expected correct answer(s) <span class="text-muted">(check all that apply)</span></label>
      <div class="tree-selector card">${renderTreeSelector(campaign.tree.nodes, [])}</div>
    </div>
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" onclick="addTask('${campaignId}')">Add Task</button>
    </div>`);
}

function showEditTaskModal(campaignId, taskId) {
  const campaign = DB.getCampaign(campaignId);
  if (!campaign) return;
  const task = (campaign.tasks || []).find(t => t.id === taskId);
  if (!task) return;
  showModal(`
    <h3>Edit Task</h3>
    <div class="form-group">
      <label>Question <span style="color:#dc2626">*</span></label>
      <textarea id="task-question" class="form-input" rows="3">${escapeHtml(task.question)}</textarea>
    </div>
    <div class="form-group">
      <label>Expected correct answer(s)</label>
      <div class="tree-selector card">${renderTreeSelector(campaign.tree.nodes, task.correctNodeIds || [])}</div>
    </div>
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="hideModal()">Cancel</button>
      <button class="btn btn-primary" onclick="updateTask('${campaignId}','${taskId}')">Save Task</button>
    </div>`);
}

function renderTreeSelector(nodes, selectedIds, depth) {
  depth = depth || 0;
  if (!nodes || !nodes.length) return '';
  return `<ul class="tree-selector-list" style="padding-left:${depth > 0 ? '1.25rem' : '0'}">
    ${nodes.map(node => `
      <li>
        <label class="tree-selector-item">
          <input type="checkbox" name="correct-nodes" value="${node.id}"
            ${(selectedIds || []).includes(node.id) ? 'checked' : ''}>
          <span>${escapeHtml(node.label)}</span>
        </label>
        ${node.children && node.children.length ? renderTreeSelector(node.children, selectedIds, depth + 1) : ''}
      </li>`).join('')}
  </ul>`;
}

// ===== ACTIONS =====

function createCampaign(e) {
  e.preventDefault();
  const f = e.target;
  const campaign = {
    id: generateId(),
    name: f.name.value.trim(),
    description: f.description.value.trim(),
    ownerEmail: f.ownerEmail.value.trim(),
    createdAt: new Date().toISOString(),
    tree: { nodes: [] },
    tasks: [],
    results: []
  };
  DB.saveCampaign(campaign);
  hideModal();
  App.navigate('campaign', { campaignId: campaign.id, tab: 'tree' });
}

function updateCampaign(e, campaignId) {
  e.preventDefault();
  const f = e.target;
  const c = DB.getCampaign(campaignId);
  c.name = f.name.value.trim();
  c.description = f.description.value.trim();
  c.ownerEmail = f.ownerEmail.value.trim();
  DB.saveCampaign(c);
  hideModal();
  App.navigate('campaign', { campaignId, tab: App.state.tab });
}

function deleteCampaign(id) {
  if (!confirm('Delete this campaign? This cannot be undone.')) return;
  DB.deleteCampaign(id);
  App.navigate('home');
}

function loadFileIntoTextarea(input, textareaId, previewFn) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById(textareaId).value = e.target.result;
    previewFn();
  };
  reader.readAsText(file);
}

function updateCSVPreview() {
  const text = document.getElementById('csv-text').value;
  const el = document.getElementById('csv-preview');
  if (!text.trim()) { el.innerHTML = ''; return; }
  try {
    const tree = parseCSV(text);
    const count = flattenTree(tree.nodes).length;
    el.innerHTML = `<p class="text-muted small" style="margin-bottom:.35rem">${count} node${count !== 1 ? 's' : ''} parsed</p>
      <div class="card" style="padding:.75rem;max-height:200px;overflow-y:auto">${renderAdminTree(tree.nodes, 0)}</div>`;
  } catch { el.innerHTML = '<p class="text-danger small">Error parsing CSV.</p>'; }
}

function updateMDPreview() {
  const text = document.getElementById('md-text').value;
  const el = document.getElementById('md-preview');
  if (!text.trim()) { el.innerHTML = ''; return; }
  try {
    const tree = parseMD(text);
    const count = flattenTree(tree.nodes).length;
    el.innerHTML = `<p class="text-muted small" style="margin-bottom:.35rem">${count} node${count !== 1 ? 's' : ''} parsed</p>
      <div class="card" style="padding:.75rem;max-height:200px;overflow-y:auto">${renderAdminTree(tree.nodes, 0)}</div>`;
  } catch { el.innerHTML = '<p class="text-danger small">Error parsing Markdown.</p>'; }
}

function importCSV(campaignId) {
  const text = document.getElementById('csv-text').value;
  if (!text.trim()) { alert('Please enter or upload CSV content.'); return; }
  const tree = parseCSV(text);
  if (!tree.nodes.length) { alert('No nodes could be parsed. Please check the format.'); return; }
  const c = DB.getCampaign(campaignId);
  c.tree = tree;
  // Clear tasks whose correct nodes no longer exist
  pruneTaskAnswers(c);
  DB.saveCampaign(c);
  hideModal();
  App.navigate('campaign', { campaignId, tab: 'tree' });
}

function importMD(campaignId) {
  const text = document.getElementById('md-text').value;
  if (!text.trim()) { alert('Please enter or upload Markdown content.'); return; }
  const tree = parseMD(text);
  if (!tree.nodes.length) { alert('No nodes could be parsed. Please check the format.'); return; }
  const c = DB.getCampaign(campaignId);
  c.tree = tree;
  pruneTaskAnswers(c);
  DB.saveCampaign(c);
  hideModal();
  App.navigate('campaign', { campaignId, tab: 'tree' });
}

function pruneTaskAnswers(campaign) {
  const allIds = new Set(flattenTree(campaign.tree.nodes).map(n => n.id));
  (campaign.tasks || []).forEach(t => {
    t.correctNodeIds = (t.correctNodeIds || []).filter(id => allIds.has(id));
  });
}

function addTask(campaignId) {
  const question = document.getElementById('task-question').value.trim();
  if (!question) { alert('Please enter a question.'); return; }
  const correctNodeIds = Array.from(
    document.querySelectorAll('input[name="correct-nodes"]:checked')
  ).map(cb => cb.value);

  const c = DB.getCampaign(campaignId);
  c.tasks.push({ id: generateId(), question, correctNodeIds });
  DB.saveCampaign(c);
  hideModal();
  App.navigate('campaign', { campaignId, tab: 'tasks' });
}

function updateTask(campaignId, taskId) {
  const question = document.getElementById('task-question').value.trim();
  if (!question) { alert('Please enter a question.'); return; }
  const correctNodeIds = Array.from(
    document.querySelectorAll('input[name="correct-nodes"]:checked')
  ).map(cb => cb.value);

  const c = DB.getCampaign(campaignId);
  const idx = c.tasks.findIndex(t => t.id === taskId);
  if (idx >= 0) c.tasks[idx] = { ...c.tasks[idx], question, correctNodeIds };
  DB.saveCampaign(c);
  hideModal();
  App.navigate('campaign', { campaignId, tab: 'tasks' });
}

function deleteTask(campaignId, taskId) {
  if (!confirm('Delete this task?')) return;
  const c = DB.getCampaign(campaignId);
  c.tasks = c.tasks.filter(t => t.id !== taskId);
  DB.saveCampaign(c);
  App.navigate('campaign', { campaignId, tab: 'tasks' });
}

function importResults(campaignId, files) {
  if (!files || !files.length) return;
  const c = DB.getCampaign(campaignId);
  if (!c.results) c.results = [];

  let done = 0;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const result = JSON.parse(e.target.result);
        const dup = c.results.some(r => r.participantName === result.participantName && r.timestamp === result.timestamp);
        if (!dup) c.results.push(result);
      } catch { /* skip malformed */ }
      if (++done === files.length) {
        DB.saveCampaign(c);
        App.navigate('campaign', { campaignId, tab: 'results' });
      }
    };
    reader.readAsText(file);
  });
}

function exportCampaign(campaignId) {
  const c = DB.getCampaign(campaignId);
  if (!c) return;
  const html = generateParticipantHTML(c);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tree-test-' + c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== INIT =====

document.addEventListener('DOMContentLoaded', () => App.render());
