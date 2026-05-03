'use strict';

// ===== TRANSLATIONS =====

const T = {
  en: {
    appName: 'Tree Testing',
    cancel: 'Cancel', save: 'Save',
    campaigns: 'Campaigns',
    newCampaign: '+ New Campaign',
    noCampaignsTitle: 'No campaigns yet',
    noCampaignsDesc: 'Create your first tree testing campaign to get started.',
    createCampaign: 'Create Campaign',
    open: 'Open', exportBtn: '⬇ Export', delete: 'Delete',
    treeSet: '✓ Tree set', noTree: '⚠ No tree',
    task: 'task', tasks: 'tasks', result: 'result', results: 'results',
    editInfo: 'Edit Info', resultsTo: 'Results to:',
    tabTree: 'Tree', tabTasks: 'Tasks', tabExport: 'Export', tabResults: 'Results',
    treeStructure: 'Tree Structure',
    node: 'node', nodes: 'nodes',
    importCsv: 'Import CSV', importMarkdown: 'Import Markdown',
    noTreeMsg: 'No tree defined yet. Import a CSV or Markdown list to create your navigation tree.',
    addTask: '+ Add Task', noTreeForTasks: 'Define the tree structure first before adding tasks.',
    noTasksMsg: 'No tasks yet. Tasks define what participants will be asked to find in the tree.',
    addFirstTask: 'Add First Task',
    expectedAnswer: 'Expected answer', expectedAnswers: 'Expected answers', noAnswerSet: 'None set',
    exportTitle: 'Export Participant File',
    exportDesc: 'Generate a self-contained HTML file you can send to participants. Each participant completes the test locally and emails you their results JSON.',
    exportChecklist: 'Pre-export checklist',
    exportBtn2: '⬇ Export Participant File',
    howItWorks: 'How it works',
    exportStep1: 'Click <strong>Export</strong> — a standalone <code>.html</code> file is downloaded.',
    exportStep2: 'Send that file to your participants (email, Slack, etc.).',
    exportStep3: 'Participants open it in any browser — no server needed.',
    exportStep4: 'After completing all tasks they download a <code>.json</code> results file and are prompted to email it to you.',
    exportStep5: 'Import the JSON files here in the <strong>Results</strong> tab to see aggregated analysis.',
    completeChecklist: 'Complete the checklist above before exporting.',
    importResults: '⬆ Import Results',
    noResultsMsg: 'No results yet. Export the participant file, collect responses, then import the JSON files here.',
    participants: 'Participants', avgSuccess: 'Avg Success',
    perTaskBreakdown: 'Per-Task Breakdown',
    response: 'response', responses: 'responses', correct: 'correct', avgTime: 'avg',
    participant: 'Participant', selected: 'Selected', pathTaken: 'Path taken', time: 'Time',
    passed: 'PASSED', failed: 'FAILED',
    errorRateChart: 'Error Rate by Task (%)', avgTimeChart: 'Average Time by Task (s)',
    newCampaignTitle: 'New Campaign', editCampaignTitle: 'Edit Campaign Info',
    campaignNameLabel: 'Campaign name', descriptionLabel: 'Description',
    descriptionOptional: '(optional)', ownerEmailLabel: 'Your email',
    ownerEmailHint: '(participants will be asked to send results here)',
    createBtn: 'Create Campaign', saveBtn: 'Save',
    importCsvTitle: 'Import Tree from CSV',
    importCsvDesc: 'Each row is a path from root to leaf. Use comma <code>,</code> or <code>&gt;</code> as separator.',
    importMdTitle: 'Import Tree from Markdown',
    importMdDesc: 'Nested Markdown list — indent with 2 or 4 spaces per level.',
    uploadCsvLabel: 'Upload a CSV / TXT file', uploadMdLabel: 'Upload a Markdown / TXT file',
    pasteContent: 'Or paste content', importTreeBtn: 'Import Tree',
    nodesParsed: n => `${n} node${n !== 1 ? 's' : ''} parsed`,
    errorParsingCsv: 'Error parsing CSV.', errorParsingMd: 'Error parsing Markdown.',
    addTaskTitle: 'Add Task', editTaskTitle: 'Edit Task',
    questionLabel: 'Question', correctAnswersLabel: 'Expected correct answer(s)',
    correctAnswersHint: '(check all that apply)',
    addTaskBtn: 'Add Task', saveTaskBtn: 'Save Task',
    deleteConfirm: 'Delete this campaign? This cannot be undone.',
    deleteTaskConfirm: 'Delete this task?',
    enterCsvAlert: 'Please enter or upload CSV content.',
    enterMdAlert: 'Please enter or upload Markdown content.',
    noNodesParsed: 'No nodes could be parsed. Please check the format.',
    enterQuestionAlert: 'Please enter a question.',
    edit: 'Edit', delete2: 'Delete',
    checkTreeOk: '✓ Tree structure defined', checkTreeFail: '✗ Tree structure defined',
    checkEmailNotSet: "not set — participants won't get a mailto link",
  },
  fr: {
    appName: 'Test Arborescent',
    cancel: 'Annuler', save: 'Enregistrer',
    campaigns: 'Campagnes',
    newCampaign: '+ Nouvelle campagne',
    noCampaignsTitle: 'Aucune campagne',
    noCampaignsDesc: 'Créez votre première campagne de test arborescent pour commencer.',
    createCampaign: 'Créer une campagne',
    open: 'Ouvrir', exportBtn: '⬇ Exporter', delete: 'Supprimer',
    treeSet: '✓ Arbre défini', noTree: '⚠ Sans arbre',
    task: 'tâche', tasks: 'tâches', result: 'résultat', results: 'résultats',
    editInfo: 'Modifier', resultsTo: 'Résultats à :',
    tabTree: 'Arbre', tabTasks: 'Tâches', tabExport: 'Exporter', tabResults: 'Résultats',
    treeStructure: 'Structure de l\'arbre',
    node: 'nœud', nodes: 'nœuds',
    importCsv: 'Importer CSV', importMarkdown: 'Importer Markdown',
    noTreeMsg: 'Aucun arbre défini. Importez un CSV ou une liste Markdown pour créer votre arbre de navigation.',
    addTask: '+ Ajouter une tâche', noTreeForTasks: 'Définissez d\'abord la structure de l\'arbre avant d\'ajouter des tâches.',
    noTasksMsg: 'Aucune tâche. Les tâches définissent ce que les participants devront trouver dans l\'arbre.',
    addFirstTask: 'Ajouter la première tâche',
    expectedAnswer: 'Réponse attendue', expectedAnswers: 'Réponses attendues', noAnswerSet: 'Non définie',
    exportTitle: 'Exporter le fichier participant',
    exportDesc: 'Générez un fichier HTML autonome à envoyer aux participants. Chaque participant effectue le test localement et vous envoie son fichier JSON de résultats.',
    exportChecklist: 'Liste de vérification',
    exportBtn2: '⬇ Exporter le fichier participant',
    howItWorks: 'Comment ça marche',
    exportStep1: 'Cliquez sur <strong>Exporter</strong> — un fichier <code>.html</code> autonome est téléchargé.',
    exportStep2: 'Envoyez ce fichier à vos participants (email, Slack, etc.).',
    exportStep3: 'Les participants l\'ouvrent dans n\'importe quel navigateur — aucun serveur requis.',
    exportStep4: 'Après avoir complété toutes les tâches, ils téléchargent un fichier <code>.json</code> et sont invités à vous l\'envoyer.',
    exportStep5: 'Importez les fichiers JSON dans l\'onglet <strong>Résultats</strong> pour voir l\'analyse agrégée.',
    completeChecklist: 'Complétez la liste de vérification ci-dessus avant d\'exporter.',
    importResults: '⬆ Importer les résultats',
    noResultsMsg: 'Aucun résultat. Exportez le fichier participant, collectez les réponses, puis importez les fichiers JSON ici.',
    participants: 'Participants', avgSuccess: 'Succès moy.',
    perTaskBreakdown: 'Détail par tâche',
    response: 'réponse', responses: 'réponses', correct: 'correct', avgTime: 'moy.',
    participant: 'Participant', selected: 'Sélectionné', pathTaken: 'Chemin parcouru', time: 'Temps',
    passed: 'RÉUSSI', failed: 'ÉCHOUÉ',
    errorRateChart: 'Taux d\'erreur par tâche (%)', avgTimeChart: 'Temps moyen par tâche (s)',
    newCampaignTitle: 'Nouvelle campagne', editCampaignTitle: 'Modifier la campagne',
    campaignNameLabel: 'Nom de la campagne', descriptionLabel: 'Description',
    descriptionOptional: '(optionnel)', ownerEmailLabel: 'Votre email',
    ownerEmailHint: '(les participants seront invités à vous envoyer les résultats)',
    createBtn: 'Créer la campagne', saveBtn: 'Enregistrer',
    importCsvTitle: 'Importer l\'arbre depuis un CSV',
    importCsvDesc: 'Chaque ligne est un chemin racine-feuille. Utilisez la virgule <code>,</code> ou <code>&gt;</code> comme séparateur.',
    importMdTitle: 'Importer l\'arbre depuis Markdown',
    importMdDesc: 'Liste Markdown imbriquée — indentez avec 2 ou 4 espaces par niveau.',
    uploadCsvLabel: 'Télécharger un fichier CSV / TXT', uploadMdLabel: 'Télécharger un fichier Markdown / TXT',
    pasteContent: 'Ou coller le contenu', importTreeBtn: 'Importer l\'arbre',
    nodesParsed: n => `${n} nœud${n !== 1 ? 's' : ''} analysé${n !== 1 ? 's' : ''}`,
    errorParsingCsv: 'Erreur lors de l\'analyse du CSV.', errorParsingMd: 'Erreur lors de l\'analyse du Markdown.',
    addTaskTitle: 'Ajouter une tâche', editTaskTitle: 'Modifier la tâche',
    questionLabel: 'Question', correctAnswersLabel: 'Réponse(s) correcte(s) attendue(s)',
    correctAnswersHint: '(cochez tout ce qui s\'applique)',
    addTaskBtn: 'Ajouter la tâche', saveTaskBtn: 'Enregistrer la tâche',
    deleteConfirm: 'Supprimer cette campagne ? Cette action est irréversible.',
    deleteTaskConfirm: 'Supprimer cette tâche ?',
    enterCsvAlert: 'Veuillez saisir ou télécharger du contenu CSV.',
    enterMdAlert: 'Veuillez saisir ou télécharger du contenu Markdown.',
    noNodesParsed: 'Aucun nœud analysé. Veuillez vérifier le format.',
    enterQuestionAlert: 'Veuillez saisir une question.',
    edit: 'Modifier', delete2: 'Supprimer',
    checkTreeOk: '✓ Structure de l\'arbre définie', checkTreeFail: '✗ Structure de l\'arbre définie',
    checkEmailNotSet: 'non défini — les participants ne recevront pas de lien mailto',
  }
};

let lang = localStorage.getItem('tt-lang') || 'en';
function t(key) { const v = (T[lang] || T.en)[key]; return v !== undefined ? v : key; }
function setLang(l) { lang = l; localStorage.setItem('tt-lang', l); App.render(); }

// ===== UTILS =====

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ===== DATA LAYER =====

const DB = {
  KEY: 'tree-testing-v1',
  load() { try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); } catch { return []; } },
  save(d) { localStorage.setItem(this.KEY, JSON.stringify(d)); },
  getCampaigns() { return this.load(); },
  getCampaign(id) { return this.load().find(c => c.id === id) || null; },
  saveCampaign(c) {
    const all = this.load();
    const i = all.findIndex(x => x.id === c.id);
    if (i >= 0) all[i] = c; else all.push(c);
    this.save(all);
  },
  deleteCampaign(id) { this.save(this.load().filter(c => c.id !== id)); }
};

// ===== TREE UTILS =====

function parseCSV(text) {
  const root = { nodes: [] };
  const idx = {};
  text.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
    const sep = line.includes('>') ? '>' : ',';
    const parts = line.split(sep).map(p => p.trim()).filter(Boolean);
    let children = root.nodes, pathKey = '';
    parts.forEach(part => {
      pathKey = pathKey ? pathKey + '\x00' + part : part;
      if (!idx[pathKey]) { const n = { id: 'n_' + generateId(), label: part, children: [] }; idx[pathKey] = n; children.push(n); }
      children = idx[pathKey].children;
    });
  });
  return root;
}

function parseMD(text) {
  const root = { nodes: [] };
  const stack = [{ level: -1, children: root.nodes }];
  text.split('\n').forEach(line => {
    const m = line.match(/^(\s*)[*\-+]\s+(.+)$/);
    if (!m) return;
    const level = Math.floor(m[1].length / 2);
    const node = { id: 'n_' + generateId(), label: m[2].trim(), children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push({ level, children: node.children });
  });
  return root;
}

function flattenTree(nodes, result = []) {
  (nodes || []).forEach(n => { result.push(n); if (n.children && n.children.length) flattenTree(n.children, result); });
  return result;
}

function findNodeById(nodes, id) {
  for (const n of (nodes || [])) { if (n.id === id) return n; const f = findNodeById(n.children, id); if (f) return f; }
  return null;
}

// ===== SORT STATE =====

let _tableSort = { col: null, dir: 'asc' };

function sortColumn(col, campaignId) {
  _tableSort = _tableSort.col === col
    ? { col, dir: _tableSort.dir === 'asc' ? 'desc' : 'asc' }
    : { col, dir: 'asc' };
  App.navigate('campaign', { campaignId, tab: 'results' });
}

function sortedRows(rows, results) {
  if (!_tableSort.col) return rows;
  return [...rows].sort((a, b) => {
    let va, vb;
    if (_tableSort.col === 'name') {
      const ra = results.find(r => (r.tasks || []).includes(a));
      const rb = results.find(r => (r.tasks || []).includes(b));
      va = (ra || {}).participantName || '';
      vb = (rb || {}).participantName || '';
    } else if (_tableSort.col === 'selected') {
      va = a.selectedNodeLabel || ''; vb = b.selectedNodeLabel || '';
    } else if (_tableSort.col === 'path') {
      va = (a.selectedPath || []).join('>'); vb = (b.selectedPath || []).join('>');
    } else if (_tableSort.col === 'correct') {
      va = a.isCorrect ? 1 : 0; vb = b.isCorrect ? 1 : 0;
    } else if (_tableSort.col === 'time') {
      va = a.timeSpentMs || 0; vb = b.timeSpentMs || 0;
    }
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
    return _tableSort.dir === 'asc' ? cmp : -cmp;
  });
}

function sortHeader(col, label, campaignId) {
  const icon = _tableSort.col === col ? (_tableSort.dir === 'asc' ? ' ▲' : ' ▼') : '';
  return `<th class="sortable" onclick="sortColumn('${col}','${campaignId}')">${label}${icon}</th>`;
}

// ===== CHARTS =====

function renderBarChart(items, color) {
  if (!items.length) return '';
  const maxVal = Math.max(...items.map(i => i.value), 1);
  const barH = 28, gap = 8, labelW = 64, barMaxW = 260;
  const h = items.length * (barH + gap) - gap;
  const w = labelW + barMaxW + 56;
  let svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w}px;display:block;overflow:visible">`;
  items.forEach(({ label, value, display }, i) => {
    const y = i * (barH + gap);
    const bw = Math.max(Math.round((value / maxVal) * barMaxW), value > 0 ? 4 : 0);
    svg += `<text x="${labelW - 6}" y="${y + barH / 2 + 4}" text-anchor="end" font-size="11" fill="#64748b" font-family="system-ui,sans-serif">${escapeHtml(label)}</text>`;
    svg += `<rect x="${labelW}" y="${y}" width="${barMaxW}" height="${barH}" rx="4" fill="#f1f5f9"/>`;
    if (bw > 0) svg += `<rect x="${labelW}" y="${y}" width="${bw}" height="${barH}" rx="4" fill="${color}"/>`;
    svg += `<text x="${labelW + barMaxW + 6}" y="${y + barH / 2 + 4}" font-size="11" font-weight="600" fill="#1e293b" font-family="system-ui,sans-serif">${escapeHtml(display)}</text>`;
  });
  svg += '</svg>';
  return svg;
}

// ===== ROUTER =====

const App = {
  state: { view: 'home', campaignId: null, tab: 'tree' },
  navigate(view, params = {}) { this.state = { view, tab: 'tree', ...params }; this.render(); window.scrollTo(0, 0); },
  render() {
    const main = document.getElementById('main-content');
    const bc = document.getElementById('header-breadcrumb');
    const toggle = document.getElementById('lang-toggle');
    if (toggle) toggle.innerHTML = renderLangToggle();

    if (this.state.view === 'home') {
      bc.innerHTML = '';
      main.innerHTML = renderHome();
    } else if (this.state.view === 'campaign') {
      const c = DB.getCampaign(this.state.campaignId);
      if (!c) { this.navigate('home'); return; }
      bc.innerHTML = `/ <a href="#" onclick="App.navigate('home');return false;">${t('campaigns')}</a> &rsaquo; <span>${escapeHtml(c.name)}</span>`;
      main.innerHTML = renderCampaignPage(c, this.state.tab);
    }
  }
};

function renderLangToggle() {
  return `<button class="lang-opt${lang === 'en' ? ' active' : ''}" onclick="setLang('en')">EN</button>` +
         `<button class="lang-opt${lang === 'fr' ? ' active' : ''}" onclick="setLang('fr')">FR</button>`;
}

// ===== HOME VIEW =====

function renderHome() {
  const campaigns = DB.getCampaigns();
  return `
    <div class="page-header">
      <h2>${t('campaigns')}</h2>
      <button class="btn btn-primary" onclick="showNewCampaignModal()">${t('newCampaign')}</button>
    </div>
    ${campaigns.length === 0
      ? `<div class="empty-state">
          <div class="empty-icon">🌳</div>
          <h3>${t('noCampaignsTitle')}</h3>
          <p>${t('noCampaignsDesc')}</p>
          <button class="btn btn-primary btn-lg" onclick="showNewCampaignModal()">${t('createCampaign')}</button>
        </div>`
      : `<div class="campaigns-grid">${campaigns.map(renderCampaignCard).join('')}</div>`}`;
}

function renderCampaignCard(c) {
  const taskCount = (c.tasks || []).length;
  const resultCount = (c.results || []).length;
  const hasTree = c.tree && c.tree.nodes && c.tree.nodes.length > 0;
  return `
    <div class="campaign-card">
      <div class="campaign-card-header">
        <h3>${escapeHtml(c.name)}</h3>
        <span class="campaign-date">${formatDate(c.createdAt)}</span>
      </div>
      ${c.description ? `<p class="campaign-desc">${escapeHtml(c.description)}</p>` : ''}
      <div class="campaign-meta">
        <span class="meta-badge ${hasTree ? '' : 'meta-warn'}">${hasTree ? t('treeSet') : t('noTree')}</span>
        <span class="meta-badge">${taskCount} ${taskCount !== 1 ? t('tasks') : t('task')}</span>
        ${resultCount > 0 ? `<span class="meta-badge">${resultCount} ${resultCount !== 1 ? t('results') : t('result')}</span>` : ''}
      </div>
      <div class="campaign-card-actions">
        <button class="btn btn-primary btn-sm" onclick="App.navigate('campaign',{campaignId:'${c.id}',tab:'tree'})">${t('open')}</button>
        ${hasTree && taskCount > 0 ? `<button class="btn btn-secondary btn-sm" onclick="exportCampaign('${c.id}')">${t('exportBtn')}</button>` : ''}
        <button class="btn btn-danger btn-sm" onclick="deleteCampaign('${c.id}')">${t('delete')}</button>
      </div>
    </div>`;
}

// ===== CAMPAIGN PAGE =====

function renderCampaignPage(campaign, activeTab) {
  const tabs = [
    { key: 'tree', label: t('tabTree') },
    { key: 'tasks', label: t('tabTasks') },
    { key: 'export', label: t('tabExport') },
    { key: 'results', label: `${t('tabResults')}${(campaign.results || []).length > 0 ? ' (' + campaign.results.length + ')' : ''}` }
  ];
  return `
    <div class="campaign-page">
      <div class="campaign-page-header">
        <div>
          <h2>${escapeHtml(campaign.name)}</h2>
          ${campaign.description ? `<p class="text-muted">${escapeHtml(campaign.description)}</p>` : ''}
          ${campaign.ownerEmail ? `<p class="text-muted small">${t('resultsTo')} ${escapeHtml(campaign.ownerEmail)}</p>` : ''}
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showEditCampaignModal('${campaign.id}')">${t('editInfo')}</button>
      </div>
      <div class="tabs">
        ${tabs.map(tab => `<button class="tab-btn${tab.key === activeTab ? ' active' : ''}" onclick="App.navigate('campaign',{campaignId:'${campaign.id}',tab:'${tab.key}'})">${tab.label}</button>`).join('')}
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
        <h3>${t('treeStructure')}${hasTree ? ` <span class="text-muted small">(${count} ${count !== 1 ? t('nodes') : t('node')})</span>` : ''}</h3>
        <div class="btn-group">
          <button class="btn btn-secondary btn-sm" onclick="showCSVImportModal('${campaign.id}')">${t('importCsv')}</button>
          <button class="btn btn-secondary btn-sm" onclick="showMDImportModal('${campaign.id}')">${t('importMarkdown')}</button>
        </div>
      </div>
      ${hasTree
        ? `<div class="card tree-preview">${renderAdminTree(campaign.tree.nodes, 0)}</div>`
        : `<div class="empty-state small">
            <p>${t('noTreeMsg')}</p>
            <div class="btn-group" style="justify-content:center">
              <button class="btn btn-primary" onclick="showCSVImportModal('${campaign.id}')">${t('importCsv')}</button>
              <button class="btn btn-primary" onclick="showMDImportModal('${campaign.id}')">${t('importMarkdown')}</button>
            </div>
          </div>`}
    </div>`;
}

function renderAdminTree(nodes, depth) {
  if (!nodes || !nodes.length) return '';
  return `<ul class="tree-list" style="padding-left:${depth > 0 ? '1.5rem' : '0'}">
    ${nodes.map(node => {
      const hasChildren = node.children && node.children.length > 0;
      const tid = `tt-${node.id}`, cid = `tc-${node.id}`;
      return `<li class="tree-item">
        <div class="tree-node" onclick="${hasChildren ? `toggleTreeNode('${tid}','${cid}')` : ''}">
          <span class="tree-node-icon">${hasChildren ? '📁' : '📄'}</span>
          <span class="tree-node-label">${escapeHtml(node.label)}</span>
          ${hasChildren ? `<span class="tree-toggle" id="${tid}">▶</span>` : ''}
        </div>
        ${hasChildren ? `<div class="tree-children" id="${cid}">${renderAdminTree(node.children, depth + 1)}</div>` : ''}
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
        <h3>${t('tabTasks')}</h3>
        ${hasTree ? `<button class="btn btn-primary btn-sm" onclick="showAddTaskModal('${campaign.id}')">${t('addTask')}</button>` : ''}
      </div>
      ${!hasTree
        ? `<div class="alert alert-warn">${t('noTreeForTasks')}</div>`
        : tasks.length === 0
          ? `<div class="empty-state small">
              <p>${t('noTasksMsg')}</p>
              <button class="btn btn-primary" onclick="showAddTaskModal('${campaign.id}')">${t('addFirstTask')}</button>
            </div>`
          : `<div class="tasks-list">${tasks.map((task, i) => renderTaskItem(campaign, task, i)).join('')}</div>`}
    </div>`;
}

function renderTaskItem(campaign, task, index) {
  const correctNodes = (task.correctNodeIds || []).map(id => {
    const n = findNodeById(campaign.tree.nodes, id);
    return n ? n.label : '(?)';
  });
  return `
    <div class="task-card card">
      <div class="task-header">
        <span class="task-number">${t('tabTasks').replace(/s$/, '')} ${index + 1}</span>
        <div class="task-actions">
          <button class="btn btn-secondary btn-sm" onclick="showEditTaskModal('${campaign.id}','${task.id}')">${t('edit')}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask('${campaign.id}','${task.id}')">${t('delete2')}</button>
        </div>
      </div>
      <p class="task-question">${escapeHtml(task.question)}</p>
      <div class="task-answers">
        <span class="answer-label">${correctNodes.length !== 1 ? t('expectedAnswers') : t('expectedAnswer')}:</span>
        ${correctNodes.length > 0
          ? correctNodes.map(n => `<span class="answer-tag">${escapeHtml(n)}</span>`).join('')
          : `<span class="text-muted">${t('noAnswerSet')}</span>`}
      </div>
    </div>`;
}

// ===== EXPORT TAB =====

function renderExportTab(campaign) {
  const hasTree = campaign.tree && campaign.tree.nodes && campaign.tree.nodes.length > 0;
  const hasTasks = campaign.tasks && campaign.tasks.length > 0;
  const canExport = hasTree && hasTasks;
  const n = (campaign.tasks || []).length;
  return `
    <div>
      <h3 style="margin-bottom:.75rem">${t('exportTitle')}</h3>
      <p class="text-muted" style="margin-bottom:1rem">${t('exportDesc')}</p>
      <div class="card export-checklist">
        <h4>${t('exportChecklist')}</h4>
        <ul>
          <li class="${hasTree ? 'check-ok' : 'check-fail'}">${hasTree ? t('checkTreeOk') : t('checkTreeFail')}</li>
          <li class="${hasTasks ? 'check-ok' : 'check-fail'}">${hasTasks ? '✓' : '✗'} ${lang === 'fr' ? `Au moins une tâche ajoutée (${n})` : `At least one task added (${n})`}</li>
          <li class="${campaign.ownerEmail ? 'check-ok' : 'check-warn'}">${campaign.ownerEmail ? `✓ ${lang === 'fr' ? 'Email du propriétaire' : 'Owner email'}: ${escapeHtml(campaign.ownerEmail)}` : `⚠ ${lang === 'fr' ? 'Email du propriétaire' : 'Owner email'}: <em>${t('checkEmailNotSet')}</em>`}</li>
        </ul>
      </div>
      ${canExport
        ? `<div class="export-actions"><button class="btn btn-primary btn-lg" onclick="exportCampaign('${campaign.id}')">${t('exportBtn2')}</button></div>
          <div class="card export-instructions" style="margin-top:1rem">
            <h4>${t('howItWorks')}</h4>
            <ol>
              <li>${t('exportStep1')}</li><li>${t('exportStep2')}</li><li>${t('exportStep3')}</li>
              <li>${t('exportStep4')}</li><li>${t('exportStep5')}</li>
            </ol>
          </div>`
        : `<div class="alert alert-warn">${t('completeChecklist')}</div>`}
    </div>`;
}

// ===== RESULTS TAB =====

function renderResultsTab(campaign) {
  const results = campaign.results || [];
  return `
    <div>
      <div class="section-header">
        <h3>${t('tabResults')}</h3>
        <label class="btn btn-secondary btn-sm" style="cursor:pointer">
          ${t('importResults')}
          <input type="file" accept=".json" multiple style="display:none" onchange="importResults('${campaign.id}', this.files)">
        </label>
      </div>
      ${results.length === 0
        ? `<div class="empty-state small"><p>${t('noResultsMsg')}</p></div>`
        : renderResultsData(campaign, results)}
    </div>`;
}

function renderResultsData(campaign, results) {
  const tasks = campaign.tasks || [];
  const taskStats = tasks.map(task => {
    const responses = results.flatMap(r => (r.tasks || []).filter(tr => tr.taskId === task.id));
    const correct = responses.filter(tr => tr.isCorrect).length;
    const times = responses.filter(tr => tr.timeSpentMs != null).map(tr => tr.timeSpentMs);
    const avgTime = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000) : null;
    const errRate = responses.length > 0 ? Math.round((1 - correct / responses.length) * 100) : 0;
    return { task, responses, correct, avgTime, errRate };
  });

  const overallSuccess = taskStats.length > 0
    ? Math.round(taskStats.reduce((s, ts) => s + (ts.responses.length > 0 ? ts.correct / ts.responses.length * 100 : 0), 0) / taskStats.length)
    : null;

  // Chart data
  const errChartData = taskStats.map((ts, i) => ({
    label: `T${i + 1}`, value: ts.errRate, display: ts.errRate + '%'
  }));
  const timeChartData = taskStats.filter(ts => ts.avgTime != null).map((ts, i) => ({
    label: `T${i + 1}`, value: ts.avgTime, display: ts.avgTime + 's'
  }));

  return `
    <div class="results-summary">
      <div class="stats-row">
        <div class="stat-card"><div class="stat-value">${results.length}</div><div class="stat-label">${t('participants')}</div></div>
        <div class="stat-card"><div class="stat-value">${tasks.length}</div><div class="stat-label">${t('tabTasks')}</div></div>
        <div class="stat-card"><div class="stat-value">${overallSuccess !== null ? overallSuccess + '%' : '—'}</div><div class="stat-label">${t('avgSuccess')}</div></div>
      </div>

      ${results.length > 0 && tasks.length > 0 ? `
        <div class="charts-row">
          <div class="chart-card card">
            <h4>${t('errorRateChart')}</h4>
            ${renderBarChart(errChartData, '#ef4444')}
          </div>
          ${timeChartData.length > 0 ? `
            <div class="chart-card card">
              <h4>${t('avgTimeChart')}</h4>
              ${renderBarChart(timeChartData, '#3b82f6')}
            </div>` : ''}
        </div>` : ''}

      <h4 style="margin:.5rem 0 .75rem">${t('perTaskBreakdown')}</h4>
      <div class="tasks-results">
        ${taskStats.map((ts, i) => renderTaskResultCard(campaign, results, ts, i)).join('')}
      </div>
    </div>`;
}

function renderTaskResultCard(campaign, results, ts, i) {
  const rows = sortedRows(ts.responses, results);
  return `
    <div class="task-result-card card">
      <div class="task-result-header"><strong>${t('tabTasks').replace(/s$/, '')} ${i + 1}:</strong> ${escapeHtml(ts.task.question)}</div>
      <div class="task-result-stats">
        <span class="stat-inline">${ts.responses.length} ${ts.responses.length !== 1 ? t('responses') : t('response')}</span>
        <span class="stat-inline success">${ts.responses.length > 0 ? Math.round(ts.correct / ts.responses.length * 100) : 0}% ${t('correct')}</span>
        ${ts.avgTime != null ? `<span class="stat-inline">${t('avgTime')} ${ts.avgTime}s</span>` : ''}
      </div>
      ${rows.length > 0 ? `
        <div class="scroll-x">
          <table class="results-table">
            <thead><tr>
              ${sortHeader('name', t('participant'), campaign.id)}
              ${sortHeader('selected', t('selected'), campaign.id)}
              ${sortHeader('path', t('pathTaken'), campaign.id)}
              ${sortHeader('correct', '✓?', campaign.id)}
              ${sortHeader('time', t('time'), campaign.id)}
            </tr></thead>
            <tbody>
              ${rows.map(tr => {
                const p = results.find(r => (r.tasks || []).includes(tr));
                return `<tr>
                  <td>${escapeHtml((p || {}).participantName || '?')}</td>
                  <td>${escapeHtml(tr.selectedNodeLabel || '—')}</td>
                  <td class="path-cell">${(tr.selectedPath || []).join(' › ')}</td>
                  <td>${tr.isCorrect
                    ? `<span class="result-pass">${t('passed')}</span>`
                    : `<span class="result-fail">${t('failed')}</span>`}</td>
                  <td>${tr.timeSpentMs != null ? Math.round(tr.timeSpentMs / 1000) + 's' : '—'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>` : ''}
    </div>`;
}

// ===== MODALS =====

function showModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function hideModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal-overlay').addEventListener('click', function(e) { if (e.target === this) hideModal(); });
});

function showNewCampaignModal() {
  showModal(`<h3>${t('newCampaignTitle')}</h3>
    <form onsubmit="createCampaign(event)">
      <div class="form-group"><label>${t('campaignNameLabel')} <span style="color:#dc2626">*</span></label>
        <input type="text" name="name" class="form-input" required placeholder="${lang === 'fr' ? 'ex. Test de navigation du site' : 'e.g. Website Navigation Test'}" autofocus></div>
      <div class="form-group"><label>${t('descriptionLabel')} <span class="text-muted">${t('descriptionOptional')}</span></label>
        <textarea name="description" class="form-input" rows="2"></textarea></div>
      <div class="form-group"><label>${t('ownerEmailLabel')} <span class="text-muted">${t('ownerEmailHint')}</span></label>
        <input type="email" name="ownerEmail" class="form-input" placeholder="you@example.com"></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="hideModal()">${t('cancel')}</button>
        <button type="submit" class="btn btn-primary">${t('createBtn')}</button>
      </div>
    </form>`);
}

function showEditCampaignModal(campaignId) {
  const c = DB.getCampaign(campaignId);
  if (!c) return;
  showModal(`<h3>${t('editCampaignTitle')}</h3>
    <form onsubmit="updateCampaign(event,'${campaignId}')">
      <div class="form-group"><label>${t('campaignNameLabel')} <span style="color:#dc2626">*</span></label>
        <input type="text" name="name" class="form-input" required value="${escapeHtml(c.name)}"></div>
      <div class="form-group"><label>${t('descriptionLabel')}</label>
        <textarea name="description" class="form-input" rows="2">${escapeHtml(c.description || '')}</textarea></div>
      <div class="form-group"><label>${t('ownerEmailLabel')}</label>
        <input type="email" name="ownerEmail" class="form-input" value="${escapeHtml(c.ownerEmail || '')}"></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="hideModal()">${t('cancel')}</button>
        <button type="submit" class="btn btn-primary">${t('saveBtn')}</button>
      </div>
    </form>`);
}

function showCSVImportModal(campaignId) {
  showModal(`<h3>${t('importCsvTitle')}</h3>
    <p class="text-muted small" style="margin-bottom:.5rem">${t('importCsvDesc')}</p>
    <div class="code-example">Home &gt; Products &gt; Electronics<br>Home &gt; Products &gt; Clothing<br>Home &gt; About Us</div>
    <div class="form-group"><label>${t('uploadCsvLabel')}</label>
      <input type="file" accept=".csv,.txt" class="form-input" onchange="loadFileIntoTextarea(this,'csv-text',updateCSVPreview)"></div>
    <div class="form-group"><label>${t('pasteContent')}</label>
      <textarea id="csv-text" class="form-input monospace" rows="7"
        placeholder="Home,Products,Electronics&#10;Home,Products,Clothing&#10;Home,About Us"
        oninput="updateCSVPreview()"></textarea></div>
    <div id="csv-preview" style="margin-top:.5rem"></div>
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="hideModal()">${t('cancel')}</button>
      <button class="btn btn-primary" onclick="importCSV('${campaignId}')">${t('importTreeBtn')}</button>
    </div>`);
}

function showMDImportModal(campaignId) {
  showModal(`<h3>${t('importMdTitle')}</h3>
    <p class="text-muted small" style="margin-bottom:.5rem">${t('importMdDesc')}</p>
    <div class="code-example">- Home<br>&nbsp;&nbsp;- Products<br>&nbsp;&nbsp;&nbsp;&nbsp;- Electronics<br>&nbsp;&nbsp;&nbsp;&nbsp;- Clothing<br>&nbsp;&nbsp;- About Us</div>
    <div class="form-group"><label>${t('uploadMdLabel')}</label>
      <input type="file" accept=".md,.txt" class="form-input" onchange="loadFileIntoTextarea(this,'md-text',updateMDPreview)"></div>
    <div class="form-group"><label>${t('pasteContent')}</label>
      <textarea id="md-text" class="form-input monospace" rows="9"
        placeholder="- Home&#10;  - Products&#10;    - Electronics"
        oninput="updateMDPreview()"></textarea></div>
    <div id="md-preview" style="margin-top:.5rem"></div>
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="hideModal()">${t('cancel')}</button>
      <button class="btn btn-primary" onclick="importMD('${campaignId}')">${t('importTreeBtn')}</button>
    </div>`);
}

function showAddTaskModal(campaignId) {
  const campaign = DB.getCampaign(campaignId);
  if (!campaign) return;
  showModal(`<h3>${t('addTaskTitle')}</h3>
    <div class="form-group"><label>${t('questionLabel')} <span style="color:#dc2626">*</span></label>
      <textarea id="task-question" class="form-input" rows="3" autofocus></textarea></div>
    <div class="form-group"><label>${t('correctAnswersLabel')} <span class="text-muted">${t('correctAnswersHint')}</span></label>
      <div class="tree-selector card">${renderTreeSelector(campaign.tree.nodes, [])}</div></div>
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="hideModal()">${t('cancel')}</button>
      <button class="btn btn-primary" onclick="addTask('${campaignId}')">${t('addTaskBtn')}</button>
    </div>`);
}

function showEditTaskModal(campaignId, taskId) {
  const campaign = DB.getCampaign(campaignId);
  if (!campaign) return;
  const task = (campaign.tasks || []).find(t => t.id === taskId);
  if (!task) return;
  showModal(`<h3>${t('editTaskTitle')}</h3>
    <div class="form-group"><label>${t('questionLabel')} <span style="color:#dc2626">*</span></label>
      <textarea id="task-question" class="form-input" rows="3">${escapeHtml(task.question)}</textarea></div>
    <div class="form-group"><label>${t('correctAnswersLabel')}</label>
      <div class="tree-selector card">${renderTreeSelector(campaign.tree.nodes, task.correctNodeIds || [])}</div></div>
    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick="hideModal()">${t('cancel')}</button>
      <button class="btn btn-primary" onclick="updateTask('${campaignId}','${taskId}')">${t('saveTaskBtn')}</button>
    </div>`);
}

function renderTreeSelector(nodes, selectedIds, depth) {
  depth = depth || 0;
  if (!nodes || !nodes.length) return '';
  return `<ul class="tree-selector-list" style="padding-left:${depth > 0 ? '1.25rem' : '0'}">
    ${nodes.map(node => `<li>
      <label class="tree-selector-item">
        <input type="checkbox" name="correct-nodes" value="${node.id}" ${(selectedIds || []).includes(node.id) ? 'checked' : ''}>
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
    id: generateId(), name: f.name.value.trim(), description: f.description.value.trim(),
    ownerEmail: f.ownerEmail.value.trim(), createdAt: new Date().toISOString(),
    tree: { nodes: [] }, tasks: [], results: [], lang
  };
  DB.saveCampaign(campaign);
  hideModal();
  App.navigate('campaign', { campaignId: campaign.id, tab: 'tree' });
}

function updateCampaign(e, campaignId) {
  e.preventDefault();
  const f = e.target;
  const c = DB.getCampaign(campaignId);
  c.name = f.name.value.trim(); c.description = f.description.value.trim(); c.ownerEmail = f.ownerEmail.value.trim();
  DB.saveCampaign(c);
  hideModal();
  App.navigate('campaign', { campaignId, tab: App.state.tab });
}

function deleteCampaign(id) {
  if (!confirm(t('deleteConfirm'))) return;
  DB.deleteCampaign(id);
  App.navigate('home');
}

function loadFileIntoTextarea(input, textareaId, previewFn) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById(textareaId).value = e.target.result; previewFn(); };
  reader.readAsText(file);
}

function updateCSVPreview() {
  const text = document.getElementById('csv-text').value;
  const el = document.getElementById('csv-preview');
  if (!text.trim()) { el.innerHTML = ''; return; }
  try {
    const tree = parseCSV(text);
    const count = flattenTree(tree.nodes).length;
    el.innerHTML = `<p class="text-muted small" style="margin-bottom:.35rem">${t('nodesParsed')(count)}</p>
      <div class="card" style="padding:.75rem;max-height:200px;overflow-y:auto">${renderAdminTree(tree.nodes, 0)}</div>`;
  } catch { el.innerHTML = `<p class="text-danger small">${t('errorParsingCsv')}</p>`; }
}

function updateMDPreview() {
  const text = document.getElementById('md-text').value;
  const el = document.getElementById('md-preview');
  if (!text.trim()) { el.innerHTML = ''; return; }
  try {
    const tree = parseMD(text);
    const count = flattenTree(tree.nodes).length;
    el.innerHTML = `<p class="text-muted small" style="margin-bottom:.35rem">${t('nodesParsed')(count)}</p>
      <div class="card" style="padding:.75rem;max-height:200px;overflow-y:auto">${renderAdminTree(tree.nodes, 0)}</div>`;
  } catch { el.innerHTML = `<p class="text-danger small">${t('errorParsingMd')}</p>`; }
}

function importCSV(campaignId) {
  const text = document.getElementById('csv-text').value;
  if (!text.trim()) { alert(t('enterCsvAlert')); return; }
  const tree = parseCSV(text);
  if (!tree.nodes.length) { alert(t('noNodesParsed')); return; }
  const c = DB.getCampaign(campaignId);
  c.tree = tree; pruneTaskAnswers(c); DB.saveCampaign(c);
  hideModal(); App.navigate('campaign', { campaignId, tab: 'tree' });
}

function importMD(campaignId) {
  const text = document.getElementById('md-text').value;
  if (!text.trim()) { alert(t('enterMdAlert')); return; }
  const tree = parseMD(text);
  if (!tree.nodes.length) { alert(t('noNodesParsed')); return; }
  const c = DB.getCampaign(campaignId);
  c.tree = tree; pruneTaskAnswers(c); DB.saveCampaign(c);
  hideModal(); App.navigate('campaign', { campaignId, tab: 'tree' });
}

function pruneTaskAnswers(campaign) {
  const allIds = new Set(flattenTree(campaign.tree.nodes).map(n => n.id));
  (campaign.tasks || []).forEach(task => {
    task.correctNodeIds = (task.correctNodeIds || []).filter(id => allIds.has(id));
  });
}

function addTask(campaignId) {
  const question = document.getElementById('task-question').value.trim();
  if (!question) { alert(t('enterQuestionAlert')); return; }
  const correctNodeIds = Array.from(document.querySelectorAll('input[name="correct-nodes"]:checked')).map(cb => cb.value);
  const c = DB.getCampaign(campaignId);
  c.tasks.push({ id: generateId(), question, correctNodeIds });
  DB.saveCampaign(c);
  hideModal();
  App.navigate('campaign', { campaignId, tab: 'tasks' });
}

function updateTask(campaignId, taskId) {
  const question = document.getElementById('task-question').value.trim();
  if (!question) { alert(t('enterQuestionAlert')); return; }
  const correctNodeIds = Array.from(document.querySelectorAll('input[name="correct-nodes"]:checked')).map(cb => cb.value);
  const c = DB.getCampaign(campaignId);
  const idx = c.tasks.findIndex(task => task.id === taskId);
  if (idx >= 0) c.tasks[idx] = { ...c.tasks[idx], question, correctNodeIds };
  DB.saveCampaign(c);
  hideModal();
  App.navigate('campaign', { campaignId, tab: 'tasks' });
}

function deleteTask(campaignId, taskId) {
  if (!confirm(t('deleteTaskConfirm'))) return;
  const c = DB.getCampaign(campaignId);
  c.tasks = c.tasks.filter(task => task.id !== taskId);
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
      if (++done === files.length) { DB.saveCampaign(c); App.navigate('campaign', { campaignId, tab: 'results' }); }
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
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== INIT =====

document.addEventListener('DOMContentLoaded', () => {
  // Insert lang toggle into header
  const header = document.querySelector('.header-inner');
  if (header) {
    const toggleWrap = document.createElement('div');
    toggleWrap.id = 'lang-toggle';
    toggleWrap.className = 'lang-toggle';
    toggleWrap.innerHTML = renderLangToggle();
    header.appendChild(toggleWrap);
  }
  App.render();
});
