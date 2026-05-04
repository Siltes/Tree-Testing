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
    #app { max-width: 680px; margin: 0 auto; padding: 2rem 1.25rem 6rem; }

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

    /* Progress + task nav */
    .task-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: .35rem; }
    .btn-back {
      background: none; border: none; color: #64748b; font-size: .85rem; font-family: inherit;
      cursor: pointer; padding: 0; display: flex; align-items: center; gap: .3rem;
      transition: color .12s;
    }
    .btn-back:hover { color: #1e293b; }
    .progress-label { font-size: .8rem; color: #64748b; }
    .progress-bar-wrap { background: #e2e8f0; border-radius: 99px; height: 6px; margin-bottom: 1.5rem; overflow: hidden; }
    .progress-bar-fill { background: #2563eb; height: 100%; border-radius: 99px; transition: width .35s ease; }

    /* Task */
    .task-number { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #2563eb; margin-bottom: .4rem; }
    .task-question { font-size: 1.2rem; font-weight: 600; color: #0f172a; line-height: 1.45; }
    .task-hint { font-size: .82rem; color: #64748b; margin-top: .5rem; }

    /* Collapsible tree */
    .tree-full { margin-top: .75rem; }
    .tree-ul { list-style: none; margin: 0; padding: 0; }
    .tree-li { margin: 3px 0; }
    .tree-ch { padding-left: 1.4rem; margin-top: 3px; }
    .tree-row { display: flex; align-items: center; gap: .35rem; width: 100%; }
    .tree-toggle {
      flex-shrink: 0; width: 24px; height: 30px; border: none; background: none;
      cursor: pointer; font-size: .75rem; color: #64748b; padding: 0; display: flex;
      align-items: center; justify-content: center; border-radius: 4px;
      transition: background .1s; font-family: inherit;
    }
    .tree-toggle:hover { background: #e2e8f0; }
    .tree-spacer { flex-shrink: 0; width: 24px; text-align: center; color: #94a3b8; font-size: .8rem; }
    .tree-lbl {
      flex: 1; padding: .45rem .75rem; background: #fff; border: 1px solid #e2e8f0;
      border-radius: 6px; cursor: pointer; font-size: .9rem; font-family: inherit;
      color: #1e293b; text-align: left; transition: background .1s, border-color .1s;
    }
    .tree-lbl:hover { background: #f0f7ff; border-color: #93c5fd; }
    .tree-row.selected .tree-lbl {
      background: #dbeafe; border-color: #3b82f6; color: #1e40af; font-weight: 500;
    }
    .tree-check {
      flex-shrink: 0; width: 28px; text-align: center; color: #2563eb;
      font-size: 1.05rem; font-weight: 700;
    }

    /* Task action bar */
    .task-actions {
      display: flex; align-items: center; justify-content: space-between; gap: .75rem;
      position: sticky; bottom: 1rem; margin-top: 1.25rem;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
      padding: .85rem 1rem; box-shadow: 0 4px 16px rgba(0,0,0,.08);
    }
    .btn-cant-find {
      background: none; border: 1px solid #d1d5db; color: #64748b; border-radius: 8px;
      padding: .5rem 1rem; font-size: .875rem; font-family: inherit; cursor: pointer;
      transition: background .12s, border-color .12s, color .12s; white-space: nowrap;
    }
    .btn-cant-find:hover { background: #f8fafc; border-color: #94a3b8; color: #334155; }
    .btn-confirm {
      background: #2563eb; color: #fff; border: none; border-radius: 8px;
      padding: .6rem 1.25rem; font-size: .95rem; font-weight: 600; font-family: inherit;
      cursor: pointer; transition: background .12s; white-space: nowrap;
      display: flex; align-items: center; gap: .4rem;
    }
    .btn-confirm:hover:not(:disabled) { background: #1d4ed8; }
    .btn-confirm:disabled {
      background: #e2e8f0; color: #94a3b8; cursor: not-allowed;
    }

    /* Instructions page */
    .how-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.75rem 1.5rem; }
    .how-title { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: .5rem; }
    .how-intro { color: #475569; font-size: .95rem; line-height: 1.6; margin-bottom: 1.25rem; }
    .how-steps { display: flex; flex-direction: column; gap: .85rem; margin: 1.25rem 0; }
    .how-step { display: flex; gap: .85rem; align-items: flex-start; }
    .how-step-num {
      flex-shrink: 0; width: 28px; height: 28px; background: #2563eb; color: #fff;
      border-radius: 50%; font-size: .8rem; font-weight: 700; display: flex;
      align-items: center; justify-content: center; margin-top: .1rem;
    }
    .how-step-body strong { display: block; font-size: .9rem; color: #0f172a; margin-bottom: .15rem; }
    .how-step-body span { font-size: .875rem; color: #64748b; line-height: 1.5; }
    .how-cta { margin-top: 1.5rem; display: flex; justify-content: flex-end; }

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
    startBtn: "Next →",
    howTitle: "Here is how it works",
    howIntro: "Before we dive in — this is a navigation exercise, not a quiz. There are no right or wrong answers. We are just curious to see how you would naturally find your way around.",
    howStep1Title: "Browse",
    howStep1: "Click the arrows to open and close sections of the tree.",
    howStep2Title: "Pick your spot",
    howStep2: "When you find where you would expect to look, click that item to select it — it will highlight blue.",
    howStep3Title: "Confirm",
    howStep3: "Hit the blue button to lock in your answer. Changed your mind? You can always go back.",
    letsGoBtn: "Got it — let us start!",
    taskOf: "Task {0} of {1}",
    taskHint: "Browse the tree below and click an item to select it as your answer.",
    back: "&#8592; Back",
    confirmBtn: "I would find it here",
    cantFind: "I can't find it",
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
    startBtn: "Suivant →",
    howTitle: "Voici comment ça marche",
    howIntro: "Avant de commencer — ceci est un exercice de navigation, pas un quiz. Il n'y a pas de bonne ou mauvaise réponse. On est simplement curieux de voir comment vous vous repéreriez naturellement.",
    howStep1Title: "Explorez",
    howStep1: "Cliquez sur les flèches pour ouvrir et fermer les sections de l'arbre.",
    howStep2Title: "Choisissez",
    howStep2: "Quand vous trouvez l'endroit où vous vous attendriez à chercher, cliquez dessus pour le sélectionner — il apparaîtra en bleu.",
    howStep3Title: "Confirmez",
    howStep3: "Cliquez sur le bouton bleu pour valider votre réponse. Vous avez changé d'avis ? Vous pouvez toujours revenir en arrière.",
    letsGoBtn: "C'est compris — on y va !",
    taskOf: "Tâche {0} sur {1}",
    taskHint: "Parcourez l'arbre et cliquez sur un élément pour le sélectionner.",
    back: "&#8592; Retour",
    confirmBtn: "Je le trouverais ici",
    cantFind: "Je ne trouve pas",
    doneTitle: "Terminé — merci !",
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
  lang: CAMPAIGN.lang || 'en',
  expandedNodes: {},
  selectedNodeId: null
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
  else if (state.screen === 'instructions') app.innerHTML = renderInstructions();
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
    '<div class="big-icon">&#127795;</div>' +
    '<h1>' + eh(CAMPAIGN.name) + '</h1>' +
    (CAMPAIGN.description ? '<p>' + eh(CAMPAIGN.description) + '</p>' : '') +
    '<p>' + tl('willBeAsked') + ' <strong>' + n + ' ' + taskWord + '</strong>.</p>' +
    '<p class="small text-muted">' + tl('noRightWrong') + '</p>' +
    '<div class="name-input-row">' +
    '<label for="pname">' + tl('yourName') + '</label>' +
    '<input type="text" id="pname" class="form-input" placeholder="' + tl('namePlaceholder') + '" autocomplete="name" onkeydown="if(event.key===&#39;Enter&#39;)startTest()">' +
    '</div>' +
    '<button class="btn btn-primary btn-lg" onclick="startTest()">' + tl('startBtn') + '</button>' +
    '</div></div>';
}

function renderInstructions() {
  var svg = '<svg viewBox="0 0 430 148" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:430px;display:block;margin:1.25rem auto">' +
    '<rect x="0" y="0" width="126" height="132" rx="8" fill="#fff" stroke="#e2e8f0"/>' +
    '<rect x="8" y="14" width="110" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="8" y="34" width="93" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="20" y="54" width="81" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="20" y="74" width="81" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="8" y="94" width="93" height="15" rx="3" fill="#f1f5f9"/>' +
    '<text x="11" y="25" font-size="8" fill="#64748b" font-family="sans-serif">&#9660;</text>' +
    '<text x="11" y="45" font-size="8" fill="#64748b" font-family="sans-serif">&#9654;</text>' +
    '<text x="23" y="65" font-size="8" fill="#94a3b8" font-family="sans-serif">&#8226;</text>' +
    '<text x="23" y="85" font-size="8" fill="#94a3b8" font-family="sans-serif">&#8226;</text>' +
    '<text x="11" y="105" font-size="8" fill="#64748b" font-family="sans-serif">&#9654;</text>' +
    '<text x="63" y="145" font-size="9" fill="#94a3b8" font-family="sans-serif" text-anchor="middle">1. Browse</text>' +
    '<text x="138" y="72" font-size="16" fill="#cbd5e1" font-family="sans-serif">&#8250;</text>' +
    '<rect x="152" y="0" width="126" height="132" rx="8" fill="#fff" stroke="#e2e8f0"/>' +
    '<rect x="160" y="14" width="110" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="160" y="34" width="93" height="15" rx="3" fill="#dbeafe" stroke="#93c5fd"/>' +
    '<rect x="172" y="54" width="81" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="172" y="74" width="81" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="160" y="94" width="93" height="15" rx="3" fill="#f1f5f9"/>' +
    '<text x="163" y="25" font-size="8" fill="#64748b" font-family="sans-serif">&#9660;</text>' +
    '<text x="163" y="45" font-size="8" fill="#2563eb" font-family="sans-serif" font-weight="bold">&#10003;</text>' +
    '<text x="175" y="65" font-size="8" fill="#94a3b8" font-family="sans-serif">&#8226;</text>' +
    '<text x="175" y="85" font-size="8" fill="#94a3b8" font-family="sans-serif">&#8226;</text>' +
    '<text x="163" y="105" font-size="8" fill="#64748b" font-family="sans-serif">&#9654;</text>' +
    '<text x="215" y="145" font-size="9" fill="#94a3b8" font-family="sans-serif" text-anchor="middle">2. Select</text>' +
    '<text x="290" y="72" font-size="16" fill="#cbd5e1" font-family="sans-serif">&#8250;</text>' +
    '<rect x="304" y="0" width="126" height="132" rx="8" fill="#fff" stroke="#e2e8f0"/>' +
    '<rect x="312" y="14" width="110" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="312" y="34" width="93" height="15" rx="3" fill="#dbeafe" stroke="#93c5fd"/>' +
    '<rect x="324" y="54" width="81" height="15" rx="3" fill="#f1f5f9"/>' +
    '<rect x="312" y="74" width="93" height="15" rx="3" fill="#f1f5f9"/>' +
    '<text x="315" y="25" font-size="8" fill="#64748b" font-family="sans-serif">&#9660;</text>' +
    '<text x="315" y="45" font-size="8" fill="#2563eb" font-family="sans-serif" font-weight="bold">&#10003;</text>' +
    '<text x="327" y="65" font-size="8" fill="#94a3b8" font-family="sans-serif">&#8226;</text>' +
    '<text x="315" y="85" font-size="8" fill="#64748b" font-family="sans-serif">&#9654;</text>' +
    '<rect x="312" y="97" width="110" height="24" rx="5" fill="#2563eb"/>' +
    '<text x="367" y="113" font-size="8" fill="#fff" font-family="sans-serif" text-anchor="middle" font-weight="bold">I would find it here</text>' +
    '<text x="367" y="145" font-size="9" fill="#94a3b8" font-family="sans-serif" text-anchor="middle">3. Confirm</text>' +
    '</svg>';

  return renderLangBar() +
    '<div class="how-card">' +
    '<div class="how-title">' + tl('howTitle') + '</div>' +
    '<p class="how-intro">' + tl('howIntro') + '</p>' +
    svg +
    '<div class="how-steps">' +
    '<div class="how-step"><div class="how-step-num">1</div><div class="how-step-body"><strong>' + tl('howStep1Title') + '</strong><span>' + tl('howStep1') + '</span></div></div>' +
    '<div class="how-step"><div class="how-step-num">2</div><div class="how-step-body"><strong>' + tl('howStep2Title') + '</strong><span>' + tl('howStep2') + '</span></div></div>' +
    '<div class="how-step"><div class="how-step-num">3</div><div class="how-step-body"><strong>' + tl('howStep3Title') + '</strong><span>' + tl('howStep3') + '</span></div></div>' +
    '</div>' +
    '<div class="how-cta"><button class="btn btn-primary btn-lg" onclick="beginTest()">' + tl('letsGoBtn') + '</button></div>' +
    '</div>';
}

function renderTask() {
  var task = CAMPAIGN.tasks[state.currentTaskIndex];
  var total = CAMPAIGN.tasks.length;
  var idx = state.currentTaskIndex;
  var progress = Math.round((idx / total) * 100);
  var taskLabel = tl('taskOf', idx + 1, total);
  var hasSelection = state.selectedNodeId != null;

  var html = renderLangBar();

  html += '<div class="task-nav">';
  if (idx > 0) {
    html += '<button class="btn-back" onclick="goBack()">' + tl('back') + '</button>';
  } else {
    html += '<span></span>';
  }
  html += '<span class="progress-label">' + taskLabel + '</span>';
  html += '</div>';
  html += '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:' + progress + '%"></div></div>';

  html += '<div class="card">';
  html += '<div class="task-number">' + taskLabel + '</div>';
  html += '<div class="task-question">' + eh(task.question) + '</div>';
  html += '<div class="task-hint">' + tl('taskHint') + '</div>';
  html += '</div>';

  html += '<div class="tree-full">';
  html += renderCollapsibleTree(CAMPAIGN.tree.nodes);
  html += '</div>';

  html += '<div class="task-actions">';
  html += '<button class="btn-cant-find" onclick="dontFind()">' + tl('cantFind') + '</button>';
  html += '<button class="btn-confirm"' + (hasSelection ? '' : ' disabled') + ' onclick="confirmSelection()">&#10003; ' + tl('confirmBtn') + '</button>';
  html += '</div>';

  return html;
}

function renderCollapsibleTree(nodes) {
  var html = '<ul class="tree-ul">';
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var hasChildren = node.children && node.children.length > 0;
    var isOpen = !!state.expandedNodes[node.id];
    var isSelected = state.selectedNodeId === node.id;

    html += '<li class="tree-li">';
    html += '<div class="tree-row' + (isSelected ? ' selected' : '') + '">';

    if (hasChildren) {
      html += '<button class="tree-toggle" onclick="toggleNode(&quot;' + node.id + '&quot;)">' +
        (isOpen ? '&#9660;' : '&#9654;') + '</button>';
    } else {
      html += '<span class="tree-spacer">&#8226;</span>';
    }

    html += '<button class="tree-lbl" onclick="selectNode(&quot;' + node.id + '&quot;)">' +
      eh(node.label) + '</button>';

    if (isSelected) {
      html += '<span class="tree-check">&#10003;</span>';
    }

    html += '</div>';

    if (hasChildren && isOpen) {
      html += '<div class="tree-ch">' + renderCollapsibleTree(node.children) + '</div>';
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
  state.screen = 'instructions';
  render();
}

function beginTest() {
  state.screen = 'task';
  state.currentTaskIndex = 0;
  beginTask();
  render();
}

function beginTask() {
  state.taskStartTime = Date.now();
  state.currentNavHistory = [];
  state.expandedNodes = {};
  state.selectedNodeId = null;
}

function toggleNode(nodeId) {
  state.expandedNodes[nodeId] = !state.expandedNodes[nodeId];
  render();
}

function selectNode(nodeId) {
  state.selectedNodeId = (state.selectedNodeId === nodeId) ? null : nodeId;
  render();
}

function confirmSelection() {
  if (state.selectedNodeId == null) return;
  commitSelection(state.selectedNodeId);
}

function dontFind() { commitSelection(null); }

function goBack() {
  if (state.currentTaskIndex === 0) return;
  state.currentTaskIndex--;
  var prev = state.taskResults.pop();
  state.selectedNodeId = prev ? prev.selectedNodeId : null;
  state.expandedNodes = {};
  state.currentNavHistory = [];
  state.taskStartTime = Date.now();
  render();
}

function commitSelection(nodeId) {
  var task = CAMPAIGN.tasks[state.currentTaskIndex];
  var timeSpent = Date.now() - state.taskStartTime;
  var node = nodeId != null ? findNode(CAMPAIGN.tree.nodes, nodeId) : null;
  var selectedPath = nodeId != null ? buildPath(CAMPAIGN.tree.nodes, nodeId) : null;
  var isCorrect = nodeId != null && (task.correctNodeIds || []).indexOf(nodeId) !== -1;

  if (node) { state.currentNavHistory.push({ nodeId: nodeId, label: node.label, action: 'select' }); }
  state.taskResults.push({
    taskId: task.id, question: task.question,
    selectedNodeId: nodeId != null ? nodeId : null,
    selectedNodeLabel: node ? node.label : null,
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
