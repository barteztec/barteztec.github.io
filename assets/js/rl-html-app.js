(function() {
    'use strict';
}());

/* eslint-env browser */
/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */


// widget, pass in the config
var intel_raptor_lake_html_app = function(cfg) {
    // private fields
    var _config = cfg;
    var _language;
    var _language_key = "EN";
    var _handset = false;
    var _tablet = false;
    var _handset_width = 480;
    var _tablet_width = 768;
    var _last_state = 0;
    // set _config.core to "default" as we
    // are not showing different cores for 2023
    _config.core = 'default'
    var _current_core = _config.core;
    var _current_activity = null;
    var _is_handset = is_handset();
    var _text_elems = [];
    var _engine_ready = false;
    var _language_ready = false;
    var _images_ready = false;
    var _preloading;
    //var _is_webgl = false;
    var _is_webgl = webgl_supported();
    

    var _app = new function() {
        function init() {
            // stub funx
            return true;
        }
        function resize() {
            // stub funx
            return true;
        }
        function set_core_state(core, activity) {
            var elem = elem_for_id('rl-static-img');
            if (activity === null) {
                activity = 'default';
            }
            elem.src = 'assets/img/rl-static-'+core+'-'+activity+'.jpg';
            elem.classList = [];
            add_class(elem, _current_core)
        }
        return {
            init: init,
            resize: resize,
            set_core_state: set_core_state
        };
    }
    // the canvas app
    if (_is_webgl) {
        _app = new intel_raptor_lake_canvas_app(cfg, _is_handset, _is_webgl);
    }else{
        // fallback for non-webgl conditions
        add_class(elem_for_id('rl-widget'), 'no-webgl');
        var elem = elem_for_id('rl-app');
        var img = document.createElement('img');
        img.setAttribute('id','rl-static-img');
        elem.appendChild(img);
    }

    

    // activity buttons
    var activity_btn_0 = elem_for_id('rl-activity-button-0');
    var activity_btn_1 = elem_for_id('rl-activity-button-1');
    var activity_btn_2 = elem_for_id('rl-activity-button-2');
    var _activity_buttons = {
        'gaming': activity_btn_0,
        'content_creation': activity_btn_1,
        'productivity': activity_btn_2
    };

    // ref some objects by id
    var _container = elem_for_id("rl-widget");
    var _shade = elem_for_id("modal-shade");
    var _preloader_percent = elem_for_id("preloader-percent");

    // if cfg contains settings, apply
    if (Object.prototype.hasOwnProperty.call(cfg, "core")) {
        _current_core = cfg.core;
    }
    if (Object.prototype.hasOwnProperty.call(cfg, "language")) {
        _language_key = cfg.language;
    }

    // wait for engine to be downloaded
    _preloading = setInterval(function() {
        if (_images_ready && _language_ready && !_engine_ready) {
            _preloader_percent.innerHTML = "Preparing...";
        }
        if (_images_ready && _language_ready && _engine_ready) {
            clearInterval(_preloading);
            widget_start();
        }
    }, 50);


    preload_images();
    preload_language();


    // ======================= //
    /* private : preload done, show the UI */
    function widget_start() {
        _tablet = elem_width(_container) <= _tablet_width ? true : false;
        _handset = elem_width(_container) <= _handset_width ? true : false;
        _app.init(_config.data, _is_handset);
        if(!_is_webgl){
            _app.set_core_state(_current_core, 'default');
        }

        // set the visual for the preselected button
        

        setTimeout(function() {
            resize();
            remove_shade();
        }, 100);
    }

    // ======================= //
    /* private : is handset? */
    function is_handset() {
        if (/mobile/i.test(navigator.userAgent) && !/ipad|tablet/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    }

    // ======================= //
    /* private : change text */
    function update_text() {
        return;
        var elem;
        var langs = _config.languages;
        var old_text;
        var new_text;
        var activity = _current_activity;
        _text_elems = [];

        if (!activity) {
            activity = 'default';
        }
        _language = langs[_language_key];

        for (var l in _language) {
            if (_language[l]) {
                elem = elem_for_id(l);
                if (elem) {
                    old_text = elem.innerHTML;
                    if (is_object(_language[l])) {
                        if (is_object(_language[l][_current_core])) {
                            new_text = _language[l][_current_core][activity];
                        } else {
                            new_text = _language[l][_current_core];
                        }
                        if (old_text !== new_text) {
                            elem.innerHTML = new_text;
                            _text_elems.push(elem);
                            if (elem.classList.toString().indexOf('rl-core-number') > -1) {
                                add_class(elem, 'active');
                            }
                        }
                    }
                }

            }
        }
        setTimeout(function() {
            for (var e in _text_elems) {
                remove_class(_text_elems[e], 'active');
            }
        }, 500)
    }

    // ======================= //
    /* private : determined if thing is an object */
    function is_object(thing) {
        if (typeof thing === 'string' || thing instanceof String) {
            return false;
        }
        return true;
    }

    // ======================= //
    /* private : scale elements */
    /*function scale_ui() {
        var ratio = 150 / 1366;
        if (_tablet)
            ratio = 130 / 768;
        if (_handset)
            ratio = 130 / 480;

        var base_w = 1366;
        if (_tablet)
            base_w = 900;
        if (_handset)
            base_w = 900;

        ratio = _container.getBoundingClientRect().width / base_w;



        var f0 = 22 * ratio;
        var t0 = elem_for_id('rl-core-btn-0-text');
        var t1 = elem_for_id('rl-core-btn-1-text');
        var t2 = elem_for_id('rl-core-btn-2-text');

        // min font size
        if (f0 < 12) {
            f0 = 12;
        }

        t0.style.fontSize = f0 + 'px';
        t1.style.fontSize = f0 + 'px';
        t2.style.fontSize = f0 + 'px';

        t0.style.lineHeight = f0 + 'px';
        t1.style.lineHeight = f0 + 'px';
        t2.style.lineHeight = f0 + 'px';


        var f1 = 32 * ratio;
        var a0 = elem_for_id('rl-activity-btn-0-text');
        var a1 = elem_for_id('rl-activity-btn-1-text');
        var a2 = elem_for_id('rl-activity-btn-2-text');

        // min font size
        if (f1 < 12) {
            f1 = 12;
        }

        a0.style.fontSize = f1 + 'px';
        a1.style.fontSize = f1 + 'px';
        a2.style.fontSize = f1 + 'px';
    }*/

    // ======================= //
    /* private : fades out an element with animate.css */
    function fade_out(elem) {
        elem.classList.remove("fadeIn");
        elem.classList.add("animated", "fadeOut", "fast");
    }

    // ======================= //
    /* private : fades in an element with animate.css */
    /*function fade_in(elem) {
        elem.classList.remove("fadeOut");
        elem.classList.add("animated", "fadeIn", "fast");
    }*/

    // ======================= //
    /* private : remove preloader */
    function remove_shade() {
        fade_out(_shade);
        setTimeout(function() {
            add_class(_shade, "hide");
        }, 250);
    }

    // ======================= //
    /* private : returns width of element with padding */
    function elem_width(elem) {
        var styles;
        try {
            styles = window.getComputedStyle(elem);
            return elem.clientWidth + parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
        } catch (err) {
            console.warn(err);
        }
        return 0;
    }



    // ======================= //
    /* private : load imgs */
    function preload_images() {
        var imgs = _config.images;
        var elem = elem_for_id("preload-container");
        var img;
        var loadCount = 0;
        var str = "Loading...";
        var viewport = _is_handset ? 'mobile' : 'desktop';
        _preloader_percent.innerHTML = str;
        for (var i in imgs) {
            if (imgs[i]) {
                if (imgs[i].indexOf('{0}') > -1) {
                    imgs[i] = imgs[i].replace('{0}', viewport);
                }
                img = document.createElement("img");
                elem.appendChild(img);
                img.src = imgs[i];
                img.onload = function() {
                    loadCount++;
                    str = parseInt((loadCount / imgs.length) * 100, 10) + "%";
                    _preloader_percent.innerHTML = str;
                    if (loadCount >= imgs.length) {
                        _images_ready = true;
                    }
                };
            }

        }
    }

    // ======================= //
    /* private : load lang */
    function preload_language() {
        var langs = _config.languages;
        var hasLanguage = Object.prototype.hasOwnProperty.call(langs, _language_key);
        if (!hasLanguage) {
            // language not found, use default
            alert("Language not found");
            return;
        }
        var elem;
        _language = langs[_language_key];
        for (var l in _language) {
            // load text into containers
            if (_language[l]) {
                elem = elem_for_id(l);

                if (elem) {
                    if (is_object(_language[l])) {
                        if (_config.core) {
                            if (is_object(_language[l][_config.core])) {
                                elem.innerHTML = _language[l][_config.core]['default'];
                            } else {
                                elem.innerHTML = _language[l][_config.core];
                            }

                        } else {
                            // not set, set to first key
                            for (var k in _language[l]) {
                                if (_language[l][k]) {
                                    elem.innerHTML = _language[l][k];
                                    continue;
                                }
                            }
                        }
                    } else {
                        elem.innerHTML = _language[l];
                    }
                }
            }
        }
        _language_ready = true;
    }

    // ======================= //
    /* private : add class to element */
    function add_class(elem, cls) {
        if (elem && cls) {
            elem.classList.add(cls);
        }
    }

    // ======================= //
    /* private : remove class from element */
    function remove_class(elem, cls) {
        if (elem && cls) {
            elem.classList.remove(cls);
        }
    }

    // ======================= //
    /* private : finds elements of class */
    function elems_for_class(str) {
        return document.getElementsByClassName(str);
    }

    // ======================= //
    /* private : finds the element for and id */
    function elem_for_id(str) {
        return document.getElementById(str);
    }


    // ============================================== //



    // ======================= //
    /* public : resize handler */
    function resize() {
        _tablet = elem_width(_container) <= _tablet_width ? true : false;
        _handset = elem_width(_container) <= _handset_width ? true : false;
        //scale_ui();
        _app.resize();
    }

    // ======================= //
    /* public : set engine ready state */
    function engine_ready() {
        _engine_ready = true;
    }

    // ======================= //
    /* public : UI sets the core by name */
    function select_core(id) {
        // do nothing if same button pressed
        if (id === _current_core) {
            return;
        }
        _current_core = id;
        update_text();
        add_class(btn, 'active');
        _app.set_core_state(_current_core, _current_activity);
    }

    // ======================= //
    /* public : UI sets the activity by name */
    function select_activity(id) {
        var ul0 = elem_for_id('rl-core-text-0');
        var ul1 = elem_for_id('rl-core-text-1');
        //remove_class(ul0, 'init');
        //remove_class(ul1, 'init');
        // toggle same button
        if (id === _current_activity) {
            _current_activity = 'default';
            //add_class(ul0, 'init');
            //add_class(ul1, 'init');
            remove_class(_activity_buttons[id], 'active');
            update_text();
            _app.set_core_state(_current_core, _current_activity);
            return;
        }
        ///////////
        var activity = _activity_buttons[id];
        for (var c in _activity_buttons) {
            if (c != id) {
                remove_class(_activity_buttons[c], 'active');
            }
        }
        add_class(activity, 'active');
        _current_activity = id;
        update_text();
        _app.set_core_state(_current_core, _current_activity);
    }

    // ======================= //
    /* private : detect webgl */
    function webgl_supported() {
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        return gl instanceof WebGLRenderingContext && !isIE11 ? true : false;
    }


    // ======================= //
    /* public : interface */
    return {
        engine_ready: engine_ready,
        resize: resize,
        select_core: select_core,
        select_activity: select_activity
    };
};