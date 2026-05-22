(function () {
    'use strict';

    var REACT_ELEMENT = Symbol.for('react.element');
    var contextPath = window.contextJsParameters ? window.contextJsParameters.contextPath : '';
    var iconsJsonUrl = contextPath + '/modules/bootstrap-icons/javascript/apps/icons-list.json';
    var iconsBaseUrl = contextPath + '/modules/bootstrap-icons/img/';

    function h(type, props) {
        var children = Array.prototype.slice.call(arguments, 2);
        return {
            $$typeof: REACT_ELEMENT,
            type: type,
            key: null,
            ref: null,
            props: Object.assign({}, props, {children: children.length === 1 ? children[0] : children.length ? children : undefined}),
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

        return h('div', {
            className: 'bootstrap-icon-picker',
            style: {fontFamily: 'sans-serif'}
        }, function (container) {
            if (!container) return;
            if (container._bip_init) return;
            container._bip_init = true;

            var style = document.createElement('style');
            style.textContent = [
                '.bootstrap-icon-picker { display:flex; flex-direction:column; gap:8px; }',
                '.bip-search { padding:6px 8px; border:1px solid #ccc; border-radius:4px; font-size:13px; width:100%; box-sizing:border-box; }',
                '.bip-grid { display:flex; flex-wrap:wrap; gap:6px; max-height:260px; overflow-y:auto; border:1px solid #eee; border-radius:4px; padding:8px; box-sizing:border-box; }',
                '.bip-item { display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:3px; width:64px; height:64px; padding:4px; border:2px solid transparent; border-radius:4px; cursor:pointer; font-size:10px; color:#555; text-align:center; overflow:hidden; box-sizing:border-box; }',
                '.bip-item:hover { border-color:#0078d4; background:#f0f6ff; }',
                '.bip-item.selected { border-color:#0078d4; background:#e0f0ff; }',
                '.bip-item img { width:24px; height:24px; }',
                '.bip-selected-label { font-size:12px; color:#555; min-height:16px; }',
                '.bip-clear { font-size:11px; color:#0078d4; cursor:pointer; margin-left:8px; }'
            ].join('\n');
            document.head.appendChild(style);

            var search = document.createElement('input');
            search.type = 'text';
            search.placeholder = 'Search icons…';
            search.className = 'bip-search';
            if (value) search.value = value;
            container.appendChild(search);

            var selectedBar = document.createElement('div');
            selectedBar.style.cssText = 'display:flex;align-items:center;min-height:20px;';
            var selectedLabel = document.createElement('span');
            selectedLabel.className = 'bip-selected-label';
            selectedLabel.textContent = value ? 'Selected: ' + value : '';
            selectedBar.appendChild(selectedLabel);
            if (value) {
                var clearBtn = document.createElement('span');
                clearBtn.className = 'bip-clear';
                clearBtn.textContent = '✕ clear';
                clearBtn.onclick = function () {
                    search.value = '';
                    selectedLabel.textContent = '';
                    clearBtn.remove();
                    render('', '');
                    if (onChange) onChange('');
                };
                selectedBar.appendChild(clearBtn);
            }
            container.appendChild(selectedBar);

            var grid = document.createElement('div');
            grid.className = 'bip-grid';
            container.appendChild(grid);

            function render(filterText, currentValue) {
                grid.innerHTML = '';
                if (!iconsCache) return;
                var q = filterText.toLowerCase().trim();
                var filtered = q
                    ? iconsCache.filter(function (n) { return n.indexOf(q) !== -1; })
                    : iconsCache;
                var shown = filtered.slice(0, 200);
                shown.forEach(function (name) {
                    var item = document.createElement('div');
                    item.className = 'bip-item' + (name === currentValue ? ' selected' : '');
                    item.title = name;

                    var img = document.createElement('img');
                    img.src = iconsBaseUrl + name + '.svg';
                    img.alt = name;

                    var label = document.createElement('span');
                    label.textContent = name.length > 10 ? name.slice(0, 9) + '…' : name;

                    item.appendChild(img);
                    item.appendChild(label);

                    item.onclick = function () {
                        var prev = grid.querySelector('.bip-item.selected');
                        if (prev) prev.classList.remove('selected');
                        item.classList.add('selected');
                        selectedLabel.textContent = 'Selected: ' + name;
                        var existingClear = selectedBar.querySelector('.bip-clear');
                        if (!existingClear) {
                            var cb = document.createElement('span');
                            cb.className = 'bip-clear';
                            cb.textContent = '✕ clear';
                            cb.onclick = function () {
                                search.value = '';
                                selectedLabel.textContent = '';
                                cb.remove();
                                render('', '');
                                if (onChange) onChange('');
                            };
                            selectedBar.appendChild(cb);
                        }
                        if (onChange) onChange(name);
                    };

                    grid.appendChild(item);
                });

                if (filtered.length > 200) {
                    var more = document.createElement('div');
                    more.style.cssText = 'width:100%;text-align:center;font-size:11px;color:#888;padding:4px;';
                    more.textContent = (filtered.length - 200) + ' more — refine your search';
                    grid.appendChild(more);
                }
            }

            loadIcons(function (list) {
                render(value, value);
            });

            search.oninput = function () {
                var currentSelected = selectedLabel.textContent.replace('Selected: ', '');
                render(search.value, currentSelected);
            };
        });
    }

    window.jahia.uiExtender.registry.add('selectorType', 'BootstrapIconPicker', {
        cmp: BootstrapIconPickerCmp,
        supportMultiple: false
    });
}());
