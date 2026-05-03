/* Generates a self-contained participant HTML file for a given campaign. */
function generateParticipantHTML(campaign) {
  const campaignJson = JSON.stringify(campaign).replace(/<\/script>/gi, '<\\/script>');
  const defaultLang = campaign.lang || 'en';

  return `<!DOCTYPE html>
<html lang="${defaultLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(campaign.name)} — Tree Test</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f5f9; color: #1e293b; font-size: 16px; line-height: 1.5; min-height: 100vh;
    }
    #app { max-width: 680px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }

    /* Header */
    .p-top-bar {
      display: flex; justify-content: flex-end; align-items: center;
      margin-bottom: 1.5rem;
    }
    .lang-toggle { display: flex; background: #e2e8f0; border-radius: 99px; padding: 2px; gap: 2px; }
    .lang-opt {
      background: none; border: none; padding: .2rem .65rem; border-radius: 99px;
      font-size: .75rem; font-weight: 600; cursor: pointer; color: #64748b; transition: background .12s, color .12s;
    }
    .lang-opt.active { background: #fff; color: #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,.12); }

    /* Card */
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }

    /* Progress */
    .progress-label { font-size: .8rem; color: #64748b; text-align: right; margin-bottom: .35rem; }
    .progress-bar-wrap { background: #e2e8f0; border-radius: 99px; height: 6px; margin-bottom: 1.5rem; overflow: hidden; }
    .progress-bar-fill { background: #2563eb; height: 100%; border-radius: 99px; transition: width .35s ease; }

    /* Task */
    .task-number { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #2563eb; margin-bottom: .4rem; }
    .task-question { font-size: 1.2rem; font-weight: 600; color: #0f172a; line-height: 1.45; }
    .task-hint { font-size: .82rem; color: #64748b; margin-top: .5rem; }

    /* Full tree */
    .tree-full { margin-top: .75rem; }
    .tree-ul { list-style: none; margin: 0; }
    .tree-li { margin: 3px 0; }
    .tree-sub { padding-left: 1.4rem; margin-top: 3px; }
    .tree-node-btn {
      display: flex; align-items: center; gap: .5rem; width: 100%;
      padding: .45rem .75rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px;
      cursor: pointer; font-size: .9rem; font-family: inherit; color: #1e293b; text-align: left;
      transition: background .1s, border-color .1s, transform .05s;
    }
    .tree-node-btn:hover { background: #f0f7ff; border-color: #93c5fd; }
    .tree-node-btn.selecting { background: #dbeafe; border-color: #2563eb; transform: scale(.99); }
    .tree-bullet { color: #94a3b8; flex-shrink: 0; font-size: .85rem; width: 12px; text-align: center; }
    .tree-node-label { flex: 1; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; gap: .35rem; padding: .55rem 1.1rem;
      border-radius: 8px; border: 1px solid transparent; cursor: pointer;
      font-size: .9rem; font-weight: 600; font-family: inherit; transition: background .12s;
    }
    .btn-primary { background: #2563eb; color: #fff; border-color: #2563eb; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-lg { padding: .7rem 1.6rem; font-size: 1rem; }

    /* Form */
    .form-input {
      width: 100%; padding: .6rem .85rem; border: 1px solid #d1d5db; border-radius: 8px;
      font-size: 1rem; font-family: inherit; color: #1e293b; margin-top: .4rem;
      transition: border-color .12s, box-shadow .12s;
    }
    .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
    label { font-size: .875rem; font-weight: 500; color: #374151; }

    /* Welcome / Done */
    .center-box { text-align: center; padding: 2rem 0; }
    .big-icon { font-size: 3rem; margin-bottom: .75rem; }
    .center-box h1 { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin-bottom: .5rem; }
    .center-box h2 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: .5rem; }
    .center-box p { color: #64748b; margin-bottom: 1rem; font-size: .95rem; }
    .name-input-row { display: flex; flex-direction: column; gap: .5rem; max-width: 320px; margin: 1.5rem auto; text-align: left; }
    .mailto-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 1.25rem; margin: 1rem 0; text-align: left; }
    .mailto-box h4 { color: #166534; margin-bottom: .5rem; font-size: .95rem; }
    .mailto-box p { color: #15803d; font-size: .875rem; margin-bottom: .75rem; }
    .filename-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: .75rem 1rem; font-family: monospace; font-size: .875rem; color: #92400e; word-break: break-all; margin: .5rem 0; }
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

var PT = {
  en: {
    startTitle: "Tree Test",
    noRightWrong: "There are no right or wrong answers — we are testing the navigation, not you.",
    willBeAsked: "You will be asked",
    task: "task", tasks: "tasks",
    yourName: "Your name",
    namePlaceholder: "Your full name",
    startBtn: "Start Test →",
    taskOf: "Task {0} of {1}",
    taskHint: "Click any item in the tree below to select it as your answer.",
    doneTitle: "All done — thank you!",
    doneCompleted: "You have completed all {0} {1}.",
    howToSend: "How to send your results",
    step1: "Your results file has been downloaded automatically.",
    step2a: "Locate it in your",
    step2b: "Downloads folder",
    step3a: "Click the button below to open a pre-filled email — then",
    step3b: "attach the file",
    step3c: "and send.",
    step3noEmail: "Send the file to the study organiser as instructed.",
    openEmail: "Open Email Client",
    retryMsg: "If the file did not download automatically,",
    clickHere: "click here",
    retryMsg2: "to download it again.",
    nameAlert: "Please enter your name before starting."
  },
  fr: {
    startTitle: "Test Arborescent",
    noRightWrong: "Il n'y a pas de bonne ou mauvaise réponse — nous testons la navigation, pas vous.",
    willBeAsked: "On vous posera",
    task: "tâche", tasks: "tâches",
    yourName: "Votre nom",
    namePlaceholder: "Votre nom complet",
    startBtn: "Commencer le test →",
    taskOf: "Tâche {0} sur {1}",
    taskHint: "Cliquez sur n'importe quel élément de l'arbre pour le sélectionner comme réponse.",
    doneTitle: "Terminé — merci !",
    doneCompleted: "Vous avez complété {0} {1}.",
    howToSend: "Comment envoyer vos résultats",
    step1: "Votre fichier de résultats a été téléchargé automatiquement.",
    step2a: "Localisez-le dans votre dossier",
    step2b: "Téléchargements",
    step3a: "Cliquez ci-dessous pour ouvrir un email pré-rempli — puis",
    step3b: "joignez le fichier",
    step3c: "et envoyez.",
    step3noEmail: "Envoyez le fichier à l'organisateur de l'étude comme indiqué.",
    openEmail: "Ouvrir le client email",
    retryMsg: "Si le fichier ne s'est pas téléchargé automatiquement,",
    clickHere: "cliquez ici",
    retryMsg2: "pour le télécharger à nouveau.",
    nameAlert: "Veuillez entrer votre nom avant de commencer."
  }
};

var state = {
  screen: 'welcome',
  participantName: '',
  currentTaskIndex: 0,
  taskStartTime: 0,
  currentNavHistory: [],
  taskResults: [],
  resultFilename: '',
  lang: CAMPAIGN.lang || 'en'
};

function tl(key, a, b) {
  var s = (PT[state.lang] || PT.en)[key] || key;
  if (a !== undefined) s = s.replace('{0}', a).replace('{1}', b);
  return s;
}

function setLang(l) { state.lang = l; render(); }

function eh(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function findNode(nodes, id) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return nodes[i];
    if (nodes[i].children && nodes[i].children.length) {
      var f = findNode(nodes[i].children, id);
      if (f) return f;
    }
  }
  return null;
}

// ---- Render ----

function render() {
  var app = document.getElementById('app');
  if (state.screen === 'welcome') app.innerHTML = renderWelcome();
  else if (state.screen === 'task') app.innerHTML = renderTask();
  else if (state.screen === 'done') app.innerHTML = renderDone();
  window.scrollTo(0, 0);
}

function renderLangBar() {
  return '<div class="p-top-bar"><div class="lang-toggle">' +
    '<button class="lang-opt' + (state.lang === 'en' ? ' active' : '') + '" onclick="setLang(&quot;en&quot;)">EN</button>' +
    '<button class="lang-opt' + (state.lang === 'fr' ? ' active' : '') + '" onclick="setLang(&quot;fr&quot;)">FR</button>' +
    '</div></div>';
}

function renderWelcome() {
  var n = CAMPAIGN.tasks.length;
  var taskWord = n !== 1 ? tl('tasks') : tl('task');
  return renderLangBar() +
    '<div class="card"><div class="center-box">' +
    '<div class="big-icon">🌳</div>' +
    '<h1>' + eh(CAMPAIGN.name) + '</h1>' +
    (CAMPAIGN.description ? '<p>' + eh(CAMPAIGN.description) + '</p>' : '') +
    '<p>' + tl('willBeAsked') + ' <strong>' + n + ' ' + taskWord + '</strong>.</p>' +
    '<p class="small text-muted">' + tl('noRightWrong') + '</p>' +
    '<div class="name-input-row">' +
    '<label for="pname">' + tl('yourName') + '</label>' +
    '<input type="text" id="pname" class="form-input" placeholder="' + tl('namePlaceholder') + '" autocomplete="name">' +
    '</div>' +
    '<button class="btn btn-primary btn-lg" onclick="startTest()">' + tl('startBtn') + '</button>' +
    '</div></div>';
}

function renderTask() {
  var task = CAMPAIGN.tasks[state.currentTaskIndex];
  var progress = Math.round((state.currentTaskIndex / CAMPAIGN.tasks.length) * 100);
  var taskLabel = tl('taskOf', state.currentTaskIndex + 1, CAMPAIGN.tasks.length);

  var html = renderLangBar();
  html += '<div class="progress-label">' + taskLabel + '</div>';
  html += '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:' + progress + '%"></div></div>';

  html += '<div class="card">';
  html += '<div class="task-number">' + taskLabel + '</div>';
  html += '<div class="task-question">' + eh(task.question) + '</div>';
  html += '<div class="task-hint">' + tl('taskHint') + '</div>';
  html += '</div>';

  html += '<div class="tree-full">';
  html += renderFullTree(CAMPAIGN.tree.nodes, false);
  html += '</div>';

  return html;
}

function renderFullTree(nodes, isSub) {
  var html = '<ul class="tree-ul' + (isSub ? '' : '') + '">';
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var hasChildren = node.children && node.children.length > 0;
    html += '<li class="tree-li">';
    html += '<button class="tree-node-btn" id="btn-' + node.id + '" onclick="selectNode(&quot;' + node.id + '&quot;)">';
    html += '<span class="tree-bullet">' + (hasChildren ? '◦' : '•') + '</span>';
    html += '<span class="tree-node-label">' + eh(node.label) + '</span>';
    html += '</button>';
    if (hasChildren) {
      html += '<div class="tree-sub">' + renderFullTree(node.children, true) + '</div>';
    }
    html += '</li>';
  }
  html += '</ul>';
  return html;
}

function renderDone() {
  var mailtoHref = '';
  if (CAMPAIGN.ownerEmail) {
    var subject = encodeURIComponent('Tree Test Results: ' + CAMPAIGN.name);
    var body = encodeURIComponent(
      'Hi,\\n\\nI have completed the tree test "' + CAMPAIGN.name + '".\\n' +
      'Please find the results file attached: ' + state.resultFilename + '\\n\\n' +
      'Participant: ' + state.participantName
    );
    mailtoHref = 'mailto:' + encodeURIComponent(CAMPAIGN.ownerEmail) + '?subject=' + subject + '&body=' + body;
  }

  var n = CAMPAIGN.tasks.length;
  var taskWord = n !== 1 ? tl('tasks') : tl('task');

  var html = renderLangBar();
  html += '<div class="card"><div class="center-box">';
  html += '<div class="big-icon">&#127881;</div>';
  html += '<h2>' + tl('doneTitle') + '</h2>';
  html += '<p>' + tl('doneCompleted', n, taskWord) + '</p>';
  html += '<hr class="divider">';
  html += '<div style="text-align:left">';
  html += '<h4 style="margin-bottom:.6rem">' + tl('howToSend') + '</h4>';
  html += '<ol class="step-list">';
  html += '<li>' + tl('step1') + '</li>';
  html += '<li>' + tl('step2a') + ' <strong>' + tl('step2b') + '</strong>.</li>';
  if (mailtoHref) {
    html += '<li>' + tl('step3a') + ' <strong>' + tl('step3b') + '</strong> ' + tl('step3c') + '</li>';
  } else {
    html += '<li>' + tl('step3noEmail') + '</li>';
  }
  html += '</ol>';
  html += '<div class="filename-box" style="margin-top:1rem"><span id="result-filename">' + eh(state.resultFilename) + '</span></div>';
  if (mailtoHref) {
    html += '<div class="mailto-box">';
    html += '<h4>&#128231; ' + tl('openEmail') + '</h4>';
    html += '<p>' + tl('step3a') + ' <strong>' + tl('step3b') + '</strong> ' + tl('step3c') + '</p>';
    html += '<a href="' + eh(mailtoHref) + '" class="btn btn-primary">' + tl('openEmail') + '</a>';
    html += '</div>';
  }
  html += '<p class="small text-muted" style="margin-top:1rem">' + tl('retryMsg') + ' <a href="#" onclick="redownload();return false;" style="color:#2563eb">' + tl('clickHere') + '</a> ' + tl('retryMsg2') + '</p>';
  html += '</div></div></div>';
  return html;
}

// ---- Actions ----

function startTest() {
  var nameEl = document.getElementById('pname');
  var name = nameEl ? nameEl.value.trim() : '';
  if (!name) { alert(tl('nameAlert')); if (nameEl) nameEl.focus(); return; }
  state.participantName = name;
  state.screen = 'task';
  beginTask();
  render();
}

function beginTask() {
  state.taskStartTime = Date.now();
  state.currentNavHistory = [];
}

function selectNode(nodeId) {
  var btn = document.getElementById('btn-' + nodeId);
  if (btn) { btn.classList.add('selecting'); }
  setTimeout(function() { commitSelection(nodeId); }, 180);
}

function commitSelection(nodeId) {
  var node = findNode(CAMPAIGN.tree.nodes, nodeId);
  if (!node) return;

  var task = CAMPAIGN.tasks[state.currentTaskIndex];
  var timeSpent = Date.now() - state.taskStartTime;
  var selectedPath = buildPath(CAMPAIGN.tree.nodes, nodeId);
  var isCorrect = (task.correctNodeIds || []).indexOf(nodeId) !== -1;

  state.currentNavHistory.push({ nodeId: nodeId, label: node.label, action: 'select' });
  state.taskResults.push({
    taskId: task.id, question: task.question,
    selectedNodeId: nodeId, selectedNodeLabel: node.label,
    selectedPath: selectedPath, correctNodeIds: task.correctNodeIds || [],
    isCorrect: isCorrect, timeSpentMs: timeSpent,
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
    campaignId: CAMPAIGN.id, campaignName: CAMPAIGN.name,
    participantName: state.participantName, timestamp: new Date().toISOString(),
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
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 60000);

  var el = document.getElementById('result-filename');
  if (el) el.textContent = filename;
}

function redownload() {
  if (!lastResultsBlob) { downloadResults(); return; }
  var url = URL.createObjectURL(lastResultsBlob);
  var a = document.createElement('a');
  a.href = url; a.download = state.resultFilename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 10000);
}

render();
<\/script>
</body>
</html>`;
}
