/* Voca: Lektionen, IPA und Sprachausgabe, ohne Framework oder Cloud-Zwang */
(function () {
  'use strict';
  const STORAGE = 'voca-user-words-v2';
  const lessons = Array.isArray(window.VOCA_LESSONS) ? window.VOCA_LESSONS : [];
  const asText = value => String(value == null ? '' : value).trim();
  const canonicalLesson = value => {
    const str = asText(value);
    const number = str.match(/(?:lektion|lesson|lección)?\s*([1-5])$/i);
    return number ? number[1] : 'import';
  };
  const valid = item => Array.isArray(item) && item.length >= 2 &&
    typeof item[0] === 'string' && typeof item[1] === 'string' &&
    item[0].trim() !== '' && item[1].trim() !== '';
  const clean = item => [asText(item[0]), asText(item[1]), asText(item[2]), canonicalLesson(item[3])];

  // Migrate data from original version on first launch. Imported words are
  // stored separately so future book updates do not replace personal lists.
  let imports = [];
  try {
    const stored = localStorage.getItem(STORAGE);
    const prior = stored == null ? (pairs.length ? pairs : JSON.parse(localStorage.getItem('voca-pairs-v1') || '[]')) : JSON.parse(stored);
    imports = Array.isArray(prior) ? prior.filter(valid).map(clean) : [];
  } catch (_) { imports = pairs.filter(valid).map(clean); }
  const builtins = lessons.flatMap(lesson =>
    (lesson.words || []).filter(word => word && asText(word.de) && asText(word.es))
      .map(word => [asText(word.de), asText(word.es), asText(word.ipa), lesson.id])
  );

  const control = document.createElement('section');
  control.className = 'lesson-control';
  control.innerHTML = '<label for="lessonSelect">📚 Welche Lektion möchtest du üben?</label>' +
    '<select id="lessonSelect" aria-label="Lektion wählen"></select>' +
    '<p id="lessonDescription" class="lesson-description" role="status"></p>';
  document.querySelector('.mode-picker').before(control);
  const select = $('lessonSelect');

  const importControl = document.createElement('div');
  importControl.className = 'lesson-import';
  importControl.innerHTML = '<label for="batchLesson">Neue Tabelle gehört zu</label>' +
    '<select id="batchLesson">' +
    '<option value="import">Ohne Lektion / eigene Vokabeln</option>' +
    lessons.map(l => '<option value="' + l.id + '">' + l.name + '</option>').join('') +
    '</select><p class="import-message">Optional: Eine Tabellenspalte „Lektion“ überschreibt diese Auswahl. Eine Spalte „IPA“ ergänzt die Lautschrift.</p>';
  $('mapping').appendChild(importControl);

  function makePronunciation(id) {
    const row = document.createElement('div');
    row.className = 'pronunciation';
    row.id = id;
    row.hidden = true;
    const ipa = document.createElement('span');
    ipa.className = 'ipa';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'voice-button';
    btn.textContent = '🔊 Anhören';
    btn.setAttribute('aria-label', 'Spanische Aussprache anhören');
    btn.addEventListener('click', () => say(row.dataset.spanish || ''));
    row.append(ipa, btn);
    return row;
  }
  const learnPron = makePronunciation('learnPronunciation');
  const questionPron = makePronunciation('questionPronunciation');
  const examPron = makePronunciation('examPronunciation');
  $('learnSpanish').after(learnPron);
  document.querySelector('.flashcard').append(questionPron);
  $('feedback').after(examPron);

  function say(word) {
    if (!word || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const pronunciation = word.split('|')[0].replace(/\s*\([^)]*\)/g,'').replace(/\/[-a-záéíóúüñ]+/gi,'').replace(/\.\.\./g,'').trim();
      const utterance = new SpeechSynthesisUtterance(pronunciation);
      utterance.lang = 'es-ES';
      utterance.rate = .86;
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => /^es-ES$/i.test(v.lang)) ||
        voices.find(v => /^es\b/i.test(v.lang));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }
  function showPronunciation(node, item) {
    node.hidden = !item;
    if (!item) { node.dataset.spanish = ''; return; }
    const ipa = asText(item[2]).replace(/^\/|\/$/g, '');
    node.querySelector('.ipa').title = 'Automatisch angenäherte IPA-Lautschrift (europäisches Spanisch)';
    node.querySelector('.ipa').textContent = ipa
      ? '/' + ipa + '/'
      : 'Lautschrift noch nicht hinterlegt';
    node.dataset.spanish = item[1];
    const button = node.querySelector('button');
    button.disabled = !('speechSynthesis' in window);
    button.title = button.disabled ? 'Die Sprachausgabe wird auf diesem Gerät nicht unterstützt.' : 'Spanisch anhören (synthetische Stimme)';
  }
  function activePairs() {
    return select.value === 'all' ? pairs : pairs.filter(item => item[3] === select.value);
  }
  function updateLessonOptions() {
    const previous = select.value || 'all';
    const options = [{id:'all', name:'Alle Lektionen + eigene Wörter'},
      ...lessons.map(l => ({id:l.id, name:l.name})),
      {id:'import', name:'Eigene Wörter / ohne Lektion'}];
    select.replaceChildren();
    for (const o of options) {
      const option = document.createElement('option');
      option.value = o.id;
      const count = o.id === 'all' ? pairs.length : pairs.filter(p => p[3] === o.id).length;
      option.textContent = o.name + ' (' + count + ')';
      select.append(option);
    }
    select.value = options.some(o=>o.id===previous) ? previous : 'all';
    const active = activePairs();
    $('lessonDescription').textContent = active.length
      ? active.length + ' Vokabel' + (active.length === 1 ? '' : 'n') + ' in dieser Auswahl.'
      : 'Noch keine Vokabeln für diese Auswahl. Die Buchlektionen werden nach dem Hochladen der Fotos gefüllt.';
  }
  function persistImports() {
    try { localStorage.setItem(STORAGE, JSON.stringify(imports)); } catch (_) {}
  }
  function rebuild() {
    pairs = builtins.concat(imports);
    persistImports(); // Ensure migrated v1 data survives a reload.
    last = -1; learnIndex = 0; right = 0; total = 0; current = null;
    save();
    updateLessonOptions();
    next();
    renderLearn();
    $('importStatus').textContent =
      builtins.length + ' Buchvokabeln · ' + imports.length + ' eigene Vokabeln bereit.';
    $('mapping').hidden = true;
  }
  function addImports(newPairs) {
    const byKey = new Map(imports.map(row =>
      [row[3] + '\u0000' + row[0].toLocaleLowerCase() + '\u0000' + row[1].toLocaleLowerCase(), row]));
    for (const raw of newPairs.filter(valid)) {
      const row = clean(raw);
      byKey.set(row[3] + '\u0000' + row[0].toLocaleLowerCase() + '\u0000' + row[1].toLocaleLowerCase(), row);
    }
    imports = [...byKey.values()];
    persistImports();
    rebuild();
    $('importStatus').textContent = newPairs.length + ' Vokabeln importiert · ' +
      imports.length + ' eigene Vokabeln gespeichert.';
  }

  // Existing learning / testing UI now works on the lesson-filtered selection.
  next = function () {
    const pool = activePairs();
    if (!pool.length) {
      current = null; done = false;
      $('word').textContent = 'Noch keine Vokabeln';
      $('prompt').textContent = 'Wähle eine gefüllte Lektion';
      $('answer').value = '';
      $('feedback').textContent = '';
      showPronunciation(questionPron, null);
      showPronunciation(examPron, null);
      for (const id of ['answer','check','next','reveal']) $(id).disabled = true;
      stats();
      return;
    }
    let picked = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && pairs.indexOf(picked) === last) {
      picked = pool[(pool.indexOf(picked) + 1) % pool.length];
    }
    last = pairs.indexOf(picked);
    let direction = $('direction').value;
    if (direction === 'mixed') direction = Math.random() < .5 ? 'de' : 'es';
    current = {
      q: picked[direction === 'de' ? 0 : 1],
      a: picked[direction === 'de' ? 1 : 0],
      pair: picked, direction
    };
    done = false;
    $('word').textContent = current.q;
    $('prompt').textContent = direction === 'de' ? 'Übersetze ins Spanische' : 'Übersetze ins Deutsche';
    $('answer').value = '';
    $('feedback').textContent = '';
    for (const id of ['answer','check','next','reveal']) $(id).disabled = false;
    showPronunciation(questionPron, direction === 'es' ? picked : null);
    showPronunciation(examPron, null);
    if (mode === 'exam') $('answer').focus();
    stats();
  };

  const oldFinish = finish;
  finish = function (reveal = false) {
    const previouslyDone = done;
    oldFinish(reveal);
    if (!previouslyDone && done && current && current.pair) {
      showPronunciation(examPron, current.pair);
    }
  };

  renderLearn = function () {
    const pool = activePairs();
    $('learnEmpty').hidden = pool.length > 0;
    $('learnCards').hidden = !pool.length;
    if (!pool.length) {
      $('learnEmpty').textContent = 'Für diese Auswahl sind noch keine Vokabeln vorhanden.';
      $('learnGerman').textContent = '';
      $('learnSpanish').textContent = '';
      $('learnCount').textContent = '';
      showPronunciation(learnPron, null);
      return;
    }
    learnIndex = Math.min(Math.max(learnIndex, 0), pool.length - 1);
    const item = pool[learnIndex];
    $('learnGerman').textContent = item[0].split('|').join(' · ');
    $('learnSpanish').textContent = item[1].split('|').join(' · ');
    showPronunciation(learnPron, item);
    $('learnCount').textContent = 'Vokabel ' + (learnIndex + 1) + ' von ' + pool.length;
    $('learnPrev').disabled = learnIndex === 0;
    $('learnNext').disabled = learnIndex === pool.length - 1;
  };

  // Replace only import finalization, retaining original CSV/XLSX parsing.
  $('apply').onclick = () => {
    const d = Number($('deCol').value), s = Number($('esCol').value);
    if (d === s) { $('importStatus').textContent = 'Bitte zwei verschiedene Spalten auswählen.'; return; }
    const headerRow = $('header').checked ? rows[0].map(v => asText(v).toLowerCase()) : [];
    const ipaCol = headerRow.findIndex(h => /^(ipa|lautschrift|aussprache|phonetik)$/.test(h));
    const lessonCol = headerRow.findIndex(h => /^(lektion|lesson|lecci[oó]n)$/.test(h));
    const lesson = $('batchLesson').value;
    const incoming = rows.slice($('header').checked ? 1 : 0)
      .map(row => [asText(row[d]), asText(row[s]),
        ipaCol >= 0 ? asText(row[ipaCol]) : '',
        lessonCol >= 0 && asText(row[lessonCol]) ? canonicalLesson(row[lessonCol]) : lesson])
      .filter(valid);
    if (!incoming.length) { $('importStatus').textContent = 'Keine vollständigen Vokabelpaare gefunden.'; return; }
    addImports(incoming);
  };
  $('demo').onclick = () => addImports([
    ['Hallo','hola','ˈola','import'],
    ['Danke','gracias','ˈɡɾaθjas','import'],
    ['Haus','casa','ˈkasa','import'],
    ['Hund','perro','ˈpero','import'],
    ['Katze','gato','ˈɡato','import'],
    ['Guten Morgen','buenos días','ˈbwenos ˈdias','import']
  ]);
  $('clear').textContent = 'Eigene Vokabeln löschen';
  $('clear').addEventListener('click', () => {
    imports = [];
    try { localStorage.removeItem(STORAGE); } catch (_) {}
    // The original click handler removed the legacy store. Rebuild book words.
    rebuild();
  });
  select.addEventListener('change', () => {
    last = -1; learnIndex = 0; right = 0; total = 0;
    updateLessonOptions();
    next();
    renderLearn();
  });
  $('learnNext').onclick = () => {
    learnIndex = Math.min(activePairs().length - 1, learnIndex + 1);
    renderLearn();
  };
  // Update default selected target during file selection.
  $('file').addEventListener('change', () => {
    $('batchLesson').value = select.value === 'all' ? 'import' : select.value;
  });
  rebuild();
})();
