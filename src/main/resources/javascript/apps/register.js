(function () {
    'use strict';

    var REACT_ELEMENT = Symbol.for('react.element');
    var contextPath = window.contextJsParameters ? window.contextJsParameters.contextPath : '';
    var iconsJsonUrl = contextPath + '/modules/bootstrap-icons/javascript/apps/icons-list.json';
    var iconsBaseUrl = contextPath + '/modules/bootstrap-icons/img/';

    /** React element factory — key is 3rd arg, ref callback is 4th arg (same as addStuff). */
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

    var iconsCache = null;

    function loadIcons(cb) {
        if (iconsCache) {
            cb(iconsCache);
            return;
        }
        fetch(iconsJsonUrl)
            .then(function (r) { return r.json(); })
            .then(function (list) {
                iconsCache = list;
                cb(list);
            });
    }

    function BootstrapIconPickerCmp(props) {
        var value = props.value || '';
        var onChange = props.onChange;

        return h('div', {className: 'bip-root'}, 'bip-root', function (container) {
            if (!container || container._bip_init) return;
            container._bip_init = true;

            var style = document.createElement('style');
            style.textContent = [
                '.bip-root { display:flex; flex-direction:column; gap:8px; font-family:sans-serif; }',
                '.bip-search { padding:6px 8px; border:1px solid #ccc; border-radius:4px; font-size:13px; width:100%; box-sizing:border-box; }',
                '.bip-bar { display:flex; align-items:center; min-height:20px; font-size:12px; color:#555; }',
                '.bip-clear { color:#0078d4; cursor:pointer; margin-left:8px; }',
                '.bip-grid { display:flex; flex-wrap:wrap; gap:6px; max-height:260px; overflow-y:auto; border:1px solid #eee; border-radius:4px; padding:8px; box-sizing:border-box; }',
                '.bip-item { display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:3px; width:64px; height:64px; padding:4px; border:2px solid transparent; border-radius:4px; cursor:pointer; font-size:10px; color:#555; text-align:center; overflow:hidden; box-sizing:border-box; }',
                '.bip-item:hover { border-color:#0078d4; background:#f0f6ff; }',
                '.bip-item.selected { border-color:#0078d4; background:#e0f0ff; }',
                '.bip-item img { width:24px; height:24px; }',
                '.bip-more { width:100%; text-align:center; font-size:11px; color:#888; padding:4px; }'
            ].join('\n');
            document.head.appendChild(style);

            var currentValue = value;

            var search = document.createElement('input');
            search.type = 'text';
            search.placeholder = 'Search icons…';
            search.className = 'bip-search';
            container.appendChild(search);

            var bar = document.createElement('div');
            bar.className = 'bip-bar';
            var barLabel = document.createElement('span');
            barLabel.textContent = currentValue ? 'Selected: ' + currentValue : '';
            bar.appendChild(barLabel);
            container.appendChild(bar);

            var grid = document.createElement('div');
            grid.className = 'bip-grid';
            container.appendChild(grid);

            function renderGrid(filter) {
                grid.innerHTML = '';
                if (!iconsCache) return;
                var q = (filter || '').toLowerCase().trim();
                var filtered = q ? iconsCache.filter(function (n) { return n.indexOf(q) !== -1; }) : iconsCache;
                var shown = filtered.slice(0, 200);
                shown.forEach(function (name) {
                    var item = document.createElement('div');
                    item.className = 'bip-item' + (name === currentValue ? ' selected' : '');
                    item.title = name;

                    var img = document.createElement('img');
                    img.src = iconsBaseUrl + name + '.svg';
                    img.alt = '';

                    var lbl = document.createElement('span');
                    lbl.textContent = name.length > 10 ? name.slice(0, 9) + '…' : name;

                    item.appendChild(img);
                    item.appendChild(lbl);
                    item.onclick = function () {
                        currentValue = name;
                        barLabel.textContent = 'Selected: ' + name;
                        updateClearBtn();
                        grid.querySelectorAll('.bip-item.selected').forEach(function (el) { el.classList.remove('selected'); });
                        item.classList.add('selected');
                        if (onChange) onChange(name);
                    };
                    grid.appendChild(item);
                });
                if (filtered.length > 200) {
                    var more = document.createElement('div');
                    more.className = 'bip-more';
                    more.textContent = (filtered.length - 200) + ' more — refine your search';
                    grid.appendChild(more);
                }
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
                        search.value = '';
                        renderGrid('');
                        if (onChange) onChange('');
                    };
                    bar.appendChild(btn);
                } else if (!currentValue && existing) {
                    existing.remove();
                }
            }

            updateClearBtn();

            search.oninput = function () { renderGrid(search.value); };

            loadIcons(function () { renderGrid(''); });
        });
    }

    window.jahia.uiExtender.registry.add('selectorType', 'BootstrapIconPicker', {
        cmp: BootstrapIconPickerCmp,
        supportMultiple: false
    });
}());
