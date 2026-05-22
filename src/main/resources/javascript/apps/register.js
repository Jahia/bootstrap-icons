(function () {
    'use strict';

    var REACT_ELEMENT = Symbol.for('react.element');
    var contextPath = window.contextJsParameters ? window.contextJsParameters.contextPath : '';
    var iconsJsonUrl = contextPath + '/modules/bootstrap-icons/javascript/apps/icons-list.json';
    var iconsBaseUrl = contextPath + '/modules/bootstrap-icons/img/';

    function h(type, props, key, ref) {
        return {
            $$typeof: REACT_ELEMENT,
            type: type,
            key: key !== undefined && key !== null ? String(key) : null,
            ref: ref || null,
            props: props || {},
            _owner: null,
            _store: {}
        };
    }

    var dataCache = null;

    function loadIcons(cb) {
        if (dataCache) { cb(dataCache); return; }
        fetch(iconsJsonUrl)
            .then(function (r) { return r.json(); })
            .then(function (data) { dataCache = data; cb(data); });
    }

    function BootstrapIconPickerCmp(props) {
        var value = props.value || '';
        var onChange = props.onChange;

        return h('div', {className: 'bip-root'}, 'bip-root', function (container) {
            if (!container || container._bip_init) return;
            container._bip_init = true;

            var style = document.createElement('style');
            style.textContent = [
                '.bip-root{display:flex;flex-direction:column;gap:6px;font-family:sans-serif;}',
                '.bip-search{padding:6px 8px;border:1px solid #ccc;border-radius:4px;font-size:13px;width:100%;box-sizing:border-box;}',
                '.bip-tabs{display:flex;flex-wrap:wrap;gap:3px;}',
                '.bip-tab{padding:3px 8px;border:1px solid #ccc;border-radius:12px;font-size:11px;color:#555;cursor:pointer;background:#f7f7f7;white-space:nowrap;}',
                '.bip-tab:hover{border-color:#0078d4;color:#0078d4;background:#f0f6ff;}',
                '.bip-tab.active{border-color:#0078d4;background:#0078d4;color:#fff;}',
                '.bip-bar{display:flex;align-items:center;min-height:18px;font-size:12px;color:#555;}',
                '.bip-clear{color:#0078d4;cursor:pointer;margin-left:8px;font-size:11px;}',
                '.bip-scroll{max-height:300px;overflow-y:auto;border:1px solid #eee;border-radius:4px;padding:8px;box-sizing:border-box;}',
                '.bip-cat-label{width:100%;font-size:11px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:.05em;margin:8px 0 4px;padding-bottom:2px;border-bottom:1px solid #eee;}',
                '.bip-cat-label:first-child{margin-top:0;}',
                '.bip-grid{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px;}',
                '.bip-item{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px;width:56px;height:56px;padding:3px;border:2px solid transparent;border-radius:4px;cursor:pointer;box-sizing:border-box;}',
                '.bip-item:hover{border-color:#0078d4;background:#f0f6ff;}',
                '.bip-item.selected{border-color:#0078d4;background:#ddeeff;}',
                '.bip-item img{width:22px;height:22px;flex-shrink:0;}',
                '.bip-item span{font-size:9px;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;text-align:center;display:block;}'
            ].join('');
            document.head.appendChild(style);

            var currentValue = value;
            var activeTab = 'All';

            // Search
            var search = document.createElement('input');
            search.type = 'text';
            search.placeholder = 'Search icons…';
            search.className = 'bip-search';
            container.appendChild(search);

            // Tabs
            var tabBar = document.createElement('div');
            tabBar.className = 'bip-tabs';
            container.appendChild(tabBar);

            // Selected bar
            var bar = document.createElement('div');
            bar.className = 'bip-bar';
            var barLabel = document.createElement('span');
            barLabel.textContent = currentValue ? 'Selected: ' + currentValue : '';
            bar.appendChild(barLabel);
            container.appendChild(bar);

            // Scroll area
            var scroll = document.createElement('div');
            scroll.className = 'bip-scroll';
            container.appendChild(scroll);

            var tabEls = {};

            function setActiveTab(name) {
                activeTab = name;
                Object.keys(tabEls).forEach(function (k) {
                    tabEls[k].classList.toggle('active', k === name);
                });
                search.value = '';
                render();
            }

            function buildTabs(data) {
                tabBar.innerHTML = '';
                tabEls = {};
                var allTab = document.createElement('span');
                allTab.className = 'bip-tab' + (activeTab === 'All' ? ' active' : '');
                allTab.textContent = 'All';
                allTab.onclick = function () { setActiveTab('All'); };
                tabBar.appendChild(allTab);
                tabEls['All'] = allTab;

                Object.keys(data).forEach(function (cat) {
                    var tab = document.createElement('span');
                    tab.className = 'bip-tab' + (activeTab === cat ? ' active' : '');
                    // Short label: drop last word if > 2 words for space
                    tab.textContent = cat;
                    tab.title = cat;
                    tab.onclick = function () { setActiveTab(cat); };
                    tabBar.appendChild(tab);
                    tabEls[cat] = tab;
                });
            }

            function render() {
                scroll.innerHTML = '';
                if (!dataCache) return;
                var q = search.value.toLowerCase().trim();

                var cats = activeTab === 'All' ? Object.keys(dataCache) : [activeTab];

                cats.forEach(function (cat) {
                    var icons = dataCache[cat] || [];
                    var filtered = q ? icons.filter(function (n) { return n.indexOf(q) !== -1; }) : icons;
                    if (!filtered.length) return;

                    var catLabel = document.createElement('div');
                    catLabel.className = 'bip-cat-label';
                    catLabel.textContent = cat + ' (' + filtered.length + ')';
                    scroll.appendChild(catLabel);

                    var grid = document.createElement('div');
                    grid.className = 'bip-grid';
                    filtered.forEach(function (name) { grid.appendChild(buildItem(name)); });
                    scroll.appendChild(grid);
                });
            }

            function buildItem(name) {
                var item = document.createElement('div');
                item.className = 'bip-item' + (name === currentValue ? ' selected' : '');
                item.title = name;

                var img = document.createElement('img');
                img.src = iconsBaseUrl + name + '.svg';
                img.alt = '';

                var lbl = document.createElement('span');
                lbl.textContent = name;

                item.appendChild(img);
                item.appendChild(lbl);
                item.onclick = function () {
                    currentValue = name;
                    barLabel.textContent = 'Selected: ' + name;
                    updateClearBtn();
                    scroll.querySelectorAll('.bip-item.selected').forEach(function (e) { e.classList.remove('selected'); });
                    item.classList.add('selected');
                    if (onChange) onChange(name);
                };
                return item;
            }

            function updateClearBtn() {
                var existing = bar.querySelector('.bip-clear');
                if (currentValue && !existing) {
                    var btn = document.createElement('span');
                    btn.className = 'bip-clear';
                    btn.textContent = '✕ clear';
                    btn.onclick = function () {
                        currentValue = '';
                        barLabel.textContent = '';
                        btn.remove();
                        render();
                        if (onChange) onChange('');
                    };
                    bar.appendChild(btn);
                } else if (!currentValue && existing) {
                    existing.remove();
                }
            }

            updateClearBtn();
            search.oninput = function () {
                if (search.value && activeTab !== 'All') {
                    activeTab = 'All';
                    Object.keys(tabEls).forEach(function (k) {
                        tabEls[k].classList.toggle('active', k === 'All');
                    });
                }
                render();
            };

            loadIcons(function (data) {
                var total = Object.values(data).reduce(function (s, a) { return s + a.length; }, 0);
                search.placeholder = 'Search ' + total + ' icons…';
                buildTabs(data);
                render();
            });
        });
    }

    window.jahia.uiExtender.registry.add('selectorType', 'BootstrapIconPicker', {
        cmp: BootstrapIconPickerCmp,
        supportMultiple: false
    });
}());
