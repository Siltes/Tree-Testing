/* Generates a self-contained participant HTML file for a given campaign. */
function generateParticipantHTML(campaign) {
  const campaignJson = JSON.stringify(campaign).replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(campaign.name)} — Tree Test</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f5f9;
      color: #1e293b;
      font-size: 16px;
      line-height: 1.5;
      min-height: 100vh;
    }
    #app {
      max-width: 680px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }

    /* HEADER */
    .p-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .p-header .campaign-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #64748b;
      margin-bottom: .25rem;
    }
    .p-header .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -.02em;
    }

    /* CARD */
    .card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    /* PROGRESS */
    .progress-bar-wrap {
      background: #e2e8f0;
      border-radius: 99px;
      height: 6px;
      margin-bottom: 1.5rem;
      overflow: hidden;
    }
    .progress-bar-fill {
      background: #2563eb;
      height: 100%;
      border-radius: 99px;
      transition: width .35s ease;
    }
    .progress-label {
      font-size: .8rem;
      color: #64748b;
      text-align: right;
      margin-bottom: .35rem;
    }

    /* TASK QUESTION */
    .task-number {
      font-size: .75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: #2563eb;
      margin-bottom: .4rem;
    }
    .task-question {
      font-size: 1.2rem;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.45;
    }
    .task-hint {
      font-size: .82rem;
      color: #64748b;
      margin-top: .5rem;
    }

    /* BREADCRUMB */
    .breadcrumb {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: .3rem;
      font-size: .82rem;
      margin-bottom: 1rem;
      padding: .6rem .75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .breadcrumb-item {
      color: #2563eb;
      cursor: pointer;
      padding: .1rem .3rem;
      border-radius: 4px;
    }
    .breadcrumb-item:hover { background: #dbeafe; }
    .breadcrumb-sep { color: #94a3b8; }
    .breadcrumb-current { color: #64748b; font-weight: 500; }

    /* TREE ITEMS */
    .tree-items { display: flex; flex-direction: column; gap: .45rem; }

    .tree-item-row {
      display: flex;
      align-items: stretch;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      transition: border-color .12s, box-shadow .12s;
    }
    .tree-item-row:hover { border-color: #93c5fd; box-shadow: 0 2px 8px rgba(37,99,235,.08); }

    .item-main {
      flex: 1;
      display: flex;
      align-items: center;
      gap: .6rem;
      padding: .7rem 1rem;
      cursor: pointer;
      user-select: none;
    }
    .item-main:hover { background: #f0f7ff; }

    .item-icon { font-size: 1rem; flex-shrink: 0; }
    .item-label { font-size: .95rem; color: #1e293b; font-weight: 500; flex: 1; }
    .item-chevron { color: #94a3b8; font-size: .8rem; flex-shrink: 0; }

    .item-select-btn {
      display: flex;
      align-items: center;
      padding: 0 .9rem;
      background: none;
      border: none;
      border-left: 1px solid #e2e8f0;
      cursor: pointer;
      font-size: .78rem;
      font-weight: 600;
      color: #2563eb;
      white-space: nowrap;
      transition: background .1s;
    }
    .item-select-btn:hover { background: #dbeafe; color: #1d4ed8; }

    /* BUTTONS */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      padding: .55rem 1.1rem;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      font-size: .9rem;
      font-weight: 600;
      font-family: inherit;
      transition: background .12s;
    }
    .btn-primary { background: #2563eb; color: #fff; border-color: #2563eb; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #fff; color: #374151; border-color: #d1d5db; }
    .btn-secondary:hover { background: #f9fafb; }
    .btn-lg { padding: .7rem 1.6rem; font-size: 1rem; }

    /* FORM */
    .form-input {
      width: 100%;
      padding: .6rem .85rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      color: #1e293b;
      margin-top: .4rem;
      transition: border-color .12s, box-shadow .12s;
    }
    .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
    label { font-size: .875rem; font-weight: 500; color: #374151; }

    /* WELCOME / DONE */
    .center-box { text-align: center; padding: 2rem 0; }
    .big-icon { font-size: 3rem; margin-bottom: .75rem; }
    .center-box h1 { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin-bottom: .5rem; }
    .center-box h2 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: .5rem; }
    .center-box p { color: #64748b; margin-bottom: 1rem; font-size: .95rem; }
    .center-box .name-input-row { display: flex; flex-direction: column; gap: .5rem; max-width: 320px; margin: 1.5rem auto; text-align: left; }
    .mailto-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 10px;
      padding: 1.25rem;
      margin: 1rem 0;
      text-align: left;
    }
    .mailto-box h4 { color: #166534; margin-bottom: .5rem; font-size: .95rem; }
    .mailto-box p { color: #15803d; font-size: .875rem; margin-bottom: .75rem; }
    .filename-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: .75rem 1rem;
      font-family: monospace;
      font-size: .875rem;
      color: #92400e;
      word-break: break-all;
      margin: .5rem 0;
    }
    .step-list { list-style: decimal; padding-left: 1.3rem; display: flex; flex-direction: column; gap: .4rem; font-size: .875rem; color: #374151; }
    .text-muted { color: #64748b; }
    .small { font-size: .8rem; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 1rem 0; }
  </style>
</head>
<body>
<div id="app"></div>
<script>
var CAMPAIGN = ${campaignJson};

var state = {
  screen: 'welcome',
  participantName: '',
  currentTaskIndex: 0,
  currentNodeId: null,     // null = at tree root
  breadcrumb: [],          // [{id, label}]
  taskStartTime: 0,
  currentNavHistory: [],   // [{nodeId, label, action}] for this task
  taskResults: [],
  resultFilename: ''
};

// ---- Tree helpers ----

function getChildren(nodeId) {
  if (!nodeId) return CAMPAIGN.tree.nodes;
  var node = findNode(CAMPAIGN.tree.nodes, nodeId);
  return node ? node.children : [];
}

function findNode(nodes, id) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return nodes[i];
    if (nodes[i].children && nodes[i].children.length) {
      var found = findNode(nodes[i].children, id);
      if (found) return found;
    }
  }
  return null;
}

function eh(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- Render ----

function render() {
  var app = document.getElementById('app');
  if (state.screen === 'welcome') app.innerHTML = renderWelcome();
  else if (state.screen === 'task') app.innerHTML = renderTask();
  else if (state.screen === 'done') app.innerHTML = renderDone();
  window.scrollTo(0, 0);
}

function renderWelcome() {
  return '<div class="card">' +
    '<div class="center-box">' +
    '<div class="big-icon">🌳</div>' +
    '<h1>' + eh(CAMPAIGN.name) + '</h1>' +
    (CAMPAIGN.description ? '<p>' + eh(CAMPAIGN.description) + '</p>' : '') +
    '<p>You will be asked <strong>' + CAMPAIGN.tasks.length + ' task' + (CAMPAIGN.tasks.length !== 1 ? 's' : '') + '</strong>. ' +
    'For each one, navigate the menu tree and select the item where you would expect to find what is described.</p>' +
    '<p class="small text-muted">There are no right or wrong answers — we are testing the navigation, not you.</p>' +
    '<div class="name-input-row">' +
    '<label for="pname">Your name</label>' +
    '<input type="text" id="pname" class="form-input" placeholder="Your full name" autocomplete="name">' +
    '</div>' +
    '<button class="btn btn-primary btn-lg" onclick="startTest()">Start Test &#8594;</button>' +
    '</div>' +
    '</div>';
}

function renderTask() {
  var task = CAMPAIGN.tasks[state.currentTaskIndex];
  var children = getChildren(state.currentNodeId);
  var progress = Math.round((state.currentTaskIndex / CAMPAIGN.tasks.length) * 100);

  var html = '';

  // Progress
  html += '<div class="progress-label">Task ' + (state.currentTaskIndex + 1) + ' of ' + CAMPAIGN.tasks.length + '</div>';
  html += '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:' + progress + '%"></div></div>';

  // Question
  html += '<div class="card">';
  html += '<div class="task-number">Task ' + (state.currentTaskIndex + 1) + '</div>';
  html += '<div class="task-question">' + eh(task.question) + '</div>';
  html += '<div class="task-hint">Navigate the tree below and click <strong>Select</strong> next to the item where you\'d expect to find it.</div>';
  html += '</div>';

  // Breadcrumb
  html += '<div class="breadcrumb">';
  html += '<span class="breadcrumb-item" onclick="navigateToRoot()">&#8962; Home</span>';
  state.breadcrumb.forEach(function(crumb, i) {
    html += '<span class="breadcrumb-sep">&#8250;</span>';
    if (i < state.breadcrumb.length - 1) {
      html += '<span class="breadcrumb-item" onclick="navigateToBreadcrumb(' + i + ')">' + eh(crumb.label) + '</span>';
    } else {
      html += '<span class="breadcrumb-current">' + eh(crumb.label) + '</span>';
    }
  });
  html += '</div>';

  // Tree items
  html += '<div class="tree-items">';
  if (children.length === 0) {
    html += '<p class="text-muted small" style="padding:.5rem 0">No items at this level.</p>';
  } else {
    children.forEach(function(node) {
      var hasChildren = node.children && node.children.length > 0;
      html += '<div class="tree-item-row">';
      html += '<div class="item-main" onclick="' + (hasChildren ? 'navigateInto(\'' + node.id + '\')' : 'selectNode(\'' + node.id + '\')') + '">';
      html += '<span class="item-icon">' + (hasChildren ? '&#128193;' : '&#128196;') + '</span>';
      html += '<span class="item-label">' + eh(node.label) + '</span>';
      if (hasChildren) html += '<span class="item-chevron">&#9658;</span>';
      html += '</div>';
      html += '<button class="item-select-btn" onclick="selectNode(\'' + node.id + '\')">Select</button>';
      html += '</div>';
    });
  }
  html += '</div>';

  return html;
}

function renderDone() {
  var mailtoHref = '';
  if (CAMPAIGN.ownerEmail) {
    var subject = encodeURIComponent('Tree Test Results: ' + CAMPAIGN.name);
    var body = encodeURIComponent(
      'Hi,\n\nI have completed the tree test "' + CAMPAIGN.name + '".\n' +
      'Please find the results file attached: ' + state.resultFilename + '\n\n' +
      'Participant: ' + state.participantName
    );
    mailtoHref = 'mailto:' + encodeURIComponent(CAMPAIGN.ownerEmail) +
      '?subject=' + subject + '&body=' + body;
  }

  var html = '<div class="card"><div class="center-box">';
  html += '<div class="big-icon">&#127881;</div>';
  html += '<h2>All done — thank you!</h2>';
  html += '<p>You have completed all ' + CAMPAIGN.tasks.length + ' task' + (CAMPAIGN.tasks.length !== 1 ? 's' : '') + '.</p>';
  html += '<hr class="divider">';

  html += '<div style="text-align:left">';
  html += '<h4 style="margin-bottom:.6rem">How to send your results</h4>';
  html += '<ol class="step-list">';
  html += '<li>Your results file has been downloaded automatically.</li>';
  html += '<li>Locate it in your <strong>Downloads folder</strong>.</li>';

  if (mailtoHref) {
    html += '<li>Click the button below to open a pre-filled email — then <strong>attach the file</strong> and send.</li>';
  } else {
    html += '<li>Send the file to the study organiser as instructed.</li>';
  }
  html += '</ol>';

  html += '<div class="filename-box" style="margin-top:1rem">';
  html += '<span id="result-filename">' + eh(state.resultFilename) + '</span>';
  html += '</div>';

  if (mailtoHref) {
    html += '<div class="mailto-box">';
    html += '<h4>&#128231; Send results by email</h4>';
    html += '<p>Click below to open your email client. <strong>Attach the file above</strong> before sending.</p>';
    html += '<a href="' + mailtoHref + '" class="btn btn-primary">Open Email Client</a>';
    html += '</div>';
  }

  html += '<p class="small text-muted" style="margin-top:1rem">If the file did not download automatically, <a href="#" onclick="redownload();return false;" style="color:#2563eb">click here</a> to download it again.</p>';
  html += '</div>';
  html += '</div></div>';

  return html;
}

// ---- Actions ----

function startTest() {
  var nameEl = document.getElementById('pname');
  var name = nameEl ? nameEl.value.trim() : '';
  if (!name) { alert('Please enter your name before starting.'); if (nameEl) nameEl.focus(); return; }
  state.participantName = name;
  state.screen = 'task';
  beginTask();
  render();
}

function beginTask() {
  state.currentNodeId = null;
  state.breadcrumb = [];
  state.currentNavHistory = [];
  state.taskStartTime = Date.now();
}

function navigateInto(nodeId) {
  var node = findNode(CAMPAIGN.tree.nodes, nodeId);
  if (!node) return;
  state.currentNavHistory.push({ nodeId: nodeId, label: node.label, action: 'open' });
  state.currentNodeId = nodeId;
  state.breadcrumb.push({ id: nodeId, label: node.label });
  render();
}

function navigateToRoot() {
  if (state.breadcrumb.length === 0) return;
  state.currentNavHistory.push({ nodeId: null, label: 'Home', action: 'back' });
  state.currentNodeId = null;
  state.breadcrumb = [];
  render();
}

function navigateToBreadcrumb(index) {
  var crumb = state.breadcrumb[index];
  if (!crumb) return;
  state.currentNavHistory.push({ nodeId: crumb.id, label: crumb.label, action: 'back' });
  state.breadcrumb = state.breadcrumb.slice(0, index + 1);
  state.currentNodeId = crumb.id;
  render();
}

function selectNode(nodeId) {
  var node = findNode(CAMPAIGN.tree.nodes, nodeId);
  if (!node) return;

  var task = CAMPAIGN.tasks[state.currentTaskIndex];
  var timeSpent = Date.now() - state.taskStartTime;

  // Build full path to this node
  var selectedPath = buildPath(CAMPAIGN.tree.nodes, nodeId);
  var isCorrect = (task.correctNodeIds || []).indexOf(nodeId) !== -1;

  state.currentNavHistory.push({ nodeId: nodeId, label: node.label, action: 'select' });

  state.taskResults.push({
    taskId: task.id,
    question: task.question,
    selectedNodeId: nodeId,
    selectedNodeLabel: node.label,
    selectedPath: selectedPath,
    correctNodeIds: task.correctNodeIds || [],
    isCorrect: isCorrect,
    timeSpentMs: timeSpent,
    navigationHistory: state.currentNavHistory.slice()
  });

  if (state.currentTaskIndex < CAMPAIGN.tasks.length - 1) {
    state.currentTaskIndex++;
    beginTask();
    render();
  } else {
    state.screen = 'done';
    render();
    setTimeout(downloadResults, 400);
  }
}

function buildPath(nodes, targetId, path) {
  path = path || [];
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var newPath = path.concat([node.label]);
    if (node.id === targetId) return newPath;
    if (node.children && node.children.length) {
      var result = buildPath(node.children, targetId, newPath);
      if (result) return result;
    }
  }
  return null;
}

var lastResultsBlob = null;

function downloadResults() {
  var results = {
    campaignId: CAMPAIGN.id,
    campaignName: CAMPAIGN.name,
    participantName: state.participantName,
    timestamp: new Date().toISOString(),
    tasks: state.taskResults
  };

  var safeName = state.participantName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  var safeCampaign = CAMPAIGN.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  var filename = 'results-' + safeName + '-' + safeCampaign + '.json';
  state.resultFilename = filename;

  var json = JSON.stringify(results, null, 2);
  lastResultsBlob = new Blob([json], { type: 'application/json' });

  var url = URL.createObjectURL(lastResultsBlob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 60000);

  // Update filename display if already rendered
  var el = document.getElementById('result-filename');
  if (el) el.textContent = filename;
}

function redownload() {
  if (!lastResultsBlob) { downloadResults(); return; }
  var url = URL.createObjectURL(lastResultsBlob);
  var a = document.createElement('a');
  a.href = url;
  a.download = state.resultFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 10000);
}

// ---- Boot ----
render();
<\/script>
</body>
</html>`;
}
