(function() {
  'use strict';
}());
/* eslint-env browser */
/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
// never called directly
// instantiates from the html app
// handles canvas scenes, passes through interactions
var intel_raptor_lake_canvas_app = function(cfg, is_handset) {
  var _data = cfg.data;
  var _app;
  var _img_path = 'assets/img/';
  var _world;
  var _core;
  var _scenes = {};
  var _current_scene;
  var _is_handset = is_handset;
  var _max_width = 1366;
  var _max_height = 730;
  // ======================= //
  /* private : set-up the UI */
  function ui_setup() {
    var masks;
    var bases;
    var decals;
    var str = _is_handset ? 'mobile' : 'desktop';
    // load assets into resources cache
    masks = _app.loader.resources['assets/img/masks_' + str + '.json'];
    bases = _app.loader.resources['assets/img/bases_' + str + '.json'];
    decals = _app.loader.resources['assets/img/decals_' + str + '.json'];
    // load bgs for the scenes
    for (var scn in _data) {
      if (_data[scn]) {
        var bg = _data[scn].default.bg.replace('{0}', str);
        var bgh = _data[scn].default.bgh.replace('{0}', str);
        _app.loader.resources[bg];
        _app.loader.resources[bgh];
      }
    }
    // set default scene
    var scene;
    _core = 'default';
    _current_scene = _core;
    // set cfg scene
    if (Object.prototype.hasOwnProperty.call(cfg, "core")) {
      _core = cfg.core;
    }
    // create container for all elements
    _world = new PIXI.Container();
    _world.name = 'world';
    _world.x = _max_width * .5;
    _world.y = _max_height * .5;
    _world.sortableChildren = true;
    _world.scale.set(1, 1);
    _app.stage.addChild(_world);
    // add some stars to the world
    var stars = new PIXI.Sprite.from(_img_path + 'rl-bg-stars.jpg');
    stars.anchor.set(0.5);
    stars.x = 0;
    stars.y = 0;
    stars.scale.set(1, 1);
    _world.addChild(stars);
    // create the scenes from cfg data
    var s;
    for (var d in _data) {
      if (_data[d]) {
        scene = new intel_raptor_lake_scene(_data[d], _img_path, _app, d, bases, masks, decals, _is_handset);
        scene.init();
        scene.hide_cores(true);
        _scenes[d] = scene;
        s = scene.scene;
        s.visible = false;
        s.alpha = 0;
        // nudge default position
        /*switch (d) {
            case 'i9':
            case 'i7':
                s.x = 50
                break;
        }*/
        _world.addChild(s);
      }
    }
    // set default state
    if (_core) {
      _scenes[_core].scene.alpha = 1;
      _scenes[_core].scene.visible = true;
      _scenes[d].hide_cores(true);
    }
    // animate the world into view
    gsap.from(_world, 2, { pixi: { contrast: 0, brightness: 0 } }, 0.66);
    gsap.from(_world, 1, {
      //pixi: { blur: 20 },
      onComplete: function() {
        //set_core_state(_core);
        _scenes[_core].scene.zIndex = 1;
        _scenes[_core].set_core_state();
      }
    }, 0.33);
    // save init state
    _current_scene = _core;
    // add to dom
    var div = document.getElementById('rl-app');
    div.appendChild(_app.view);
    // take a beat, do a resize
    setTimeout(function() {
      resize();
    }, 100);
  }
  // ======================= //
  /* public : initialize the canvas app */
  function init() {
    // init canvas render engine
    PIXI.utils.skipHello();
    PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
    _app = new PIXI.Application({
      width: _max_width,
      height: _max_height,
      backgroundColor: 0x000000,
      //backgroundColor: 0xFF0000,
      resolution: window.devicePixelRatio || 1,
      // debugging masking issue
      // forceCanvas: true
    });
    // debug in chrome
    globalThis.__PIXI_APP__ = _app;
    // allow dom scrolling
    _app.renderer.plugins.interaction.autoPreventDefault = false;
    _app.renderer.view.style.touchAction = 'auto';
    // determine which sprite set to use
    var str = 'desktop';
    if (_is_handset) {
      str = 'mobile';
    }
    // preload sprites assets
    _app.loader.add("assets/img/bases_" + str + ".json");
    _app.loader.add("assets/img/masks_" + str + ".json");
    _app.loader.add("assets/img/decals_" + str + ".json");
    // on load complete, set-up the ui
    _app.loader.load(ui_setup);
  }
  // ======================= //
  /* public : set the core state */
  function set_core_state(core, activity) {
    // set the core state
    if (core === null) {
      core = 'default';
    }
    for (var s in _scenes) {
      if (core === s) {
        if (core !== _current_scene) {
          // changing scenes
          _scenes[s].hide_cores(true);
          gsap.killTweensOf(_scenes[s].scene);
          // allow cores to hide before changing scene
          gsap.to(_scenes[s].scene, 0.66, {
            pixi: { autoAlpha: 1 },
            onComplete: function() {
              setTimeout(function() {
                _scenes[_current_scene].scene.zIndex = 1;
                _scenes[_current_scene].set_core_state(core, activity);
              }, 150);
              _scenes[s].hide_cores();
            }
          }, 333);
        } else {
          // immediately change the heights
          _scenes[_current_scene].set_core_state(core, activity);
        }
      } else {
        _scenes[s].scene.zIndex = 0;
        _scenes[s].hide_cores();
        gsap.killTweensOf(_scenes[s].scene);
        gsap.to(_scenes[s].scene, 0.5, { pixi: { autoAlpha: 0 }, delay: 0.33 });
      }
    }
    _current_scene = core;
  }
  /* public : resize handler */
  function resize() {
    if (!_app) {
      return;
    }
    var w, h;
    var small_viewport = false;
    var small_viewport_multiplier = 1.8;
    var canvasRatio = _max_height / _max_width;
    var windowRatio = window.innerHeight / window.innerWidth;
    w = window.innerWidth;
    if (w <= 768) {
      w = w * small_viewport_multiplier;
      small_viewport = true;
    }
    h = w * canvasRatio;
    if (w >= _max_width) {
      w = _max_width;
    }
    if (h >= _max_height) {
      h = _max_height;
    }
    _app.view.style.width = w + 'px';
    _app.view.style.height = h + 'px';
    if (_scenes.default) {
      if (small_viewport) {
        // change the canvas scale for small viewports
        gsap.set(_world, { pixi: { scale: 1, x: _max_width * .5, y: _max_height * .5 }, ease: Power2.easeInOut });
        gsap.set(_scenes.default.scene, { pixi: { scale: 1, x: 12, y: 0 }, ease: Power2.easeInOut });
        if (w / small_viewport_multiplier <= 480) {
          //gsap.set(_world, { pixi: { scale: 1.1, x: 350 }, ease: Power2.easeInOut });
          //gsap.set(_scenes.default.scene, { pixi: { y: -25 }, ease: Power2.easeInOut });

          gsap.set(_world, { pixi: { scale: 1.1, x: 350, y:450 }, ease: Power2.easeInOut });
          gsap.set(_scenes.default.scene, { pixi: { x:4, y: -100 }, ease: Power2.easeInOut });

        } else if (w / small_viewport_multiplier <= 768) {
          gsap.set(_world, { pixi: { scale: .9, x: 350}, ease: Power2.easeInOut });
          gsap.set(_scenes.default.scene, { pixi: { y: -130 }, ease: Power2.easeInOut });
        }
      } else {
        // scale canvas elements to format for breakpoints
        gsap.set(_world, { pixi: { scale: 1, x: _max_width * .5, y: _max_height * .5 }, ease: Power2.easeInOut });
        if (w <= 992) {
          gsap.set(_scenes.default.scene, { pixi: { scale: 1, x: 150, y: 0 }, ease: Power2.easeInOut });
        } else if (w <= 1365) {
          gsap.set(_scenes.default.scene, { pixi: { scale: 1, x: 100, y: 50 }, ease: Power2.easeInOut });
        } else {
          gsap.set(_scenes.default.scene, { pixi: { scale: 1, x: 100, y: -20 }, ease: Power2.easeInOut });
        }
      }
    }
  }
  // ======================= //
  /* public : interface */
  return {
    init: init,
    resize: resize,
    set_core_state: set_core_state
  };
};