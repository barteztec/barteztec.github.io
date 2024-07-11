(function() {
    'use strict';
}());

/* eslint-env browser */
/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */


// never called directly
// instantiates from the canvas app
// handles all the core animations

var intel_raptor_lake_scene = function(data, img_path, app, name, bases, masks, decals, is_handset) {

    var _data = data;
    var _scene = new PIXI.Container();
    var _img_path = img_path;
    var _app = app;
    var _cores = [];
    var _init_state = false;
    var _hilite;
    var _names = ['gaming', 'content_creation', 'productivity'];
    var _bases = bases;
    var _masks = masks;
    var _decals = decals;
    var _is_handset = is_handset;
    var _interval;
    var _current_activity;

    // ======================= //
    /* public : initialize scene */
    function init() {
        _interval = setInterval(function() {
            if (!_scene.visible) {
                return;
            }
            var r = Math.floor(Math.random() * 100);
            if (r > 66) {
                if (_cores) {
                    try {
                        var c = _cores[Math.floor(Math.random() * _cores.length)];
                        for (var d in c.children[0].children[1].children) {
                            if (c.children[0].children[1].children[d]) {
                                var decal = c.children[0].children[1].children[d];
                                if (decal.name === _current_activity) {
                                    //gsap.killTweensOf(decal)
                                    if (!gsap.isTweening(decal)) {
                                        gsap.to(decal, 0.5, {
                                            pixi: { brightness: 1.5 },
                                            onComplete: function() {
                                                gsap.to(decal, 3, { pixi: { brightness: 1 }, ease: Power2.easeInOut });
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                }
            }
        }, 250);

        var str = _is_handset ? 'mobile' : 'desktop';

        var bg = new PIXI.Container();
        var floor = new PIXI.Sprite.from(_img_path + _data.default.bg.replace('{0}', str));
        var hilite = new PIXI.Sprite.from(_img_path + _data.default.bgh.replace('{0}', str));
        var floor_mask = new PIXI.Sprite.from(_img_path + _data.default.bgmask.replace('{0}', str));


        floor.anchor.set(0.5);
        floor.x = 0;
        floor.y = 0;
        floor.alpha = 1;

        floor_mask.anchor.set(0.5);
        floor_mask.x = 0;
        floor_mask.y = 0;

        floor.mask = floor_mask;
        hilite.mask = floor_mask;
        


        hilite.anchor.set(0.5);
        hilite.x = 0;
        hilite.y = 0;
        hilite.alpha = 0;

        bg.addChild(floor_mask);
        bg.addChild(floor);
        bg.addChild(hilite);
        bg.alpha = 1;
        bg.x = 0;
        bg.y = 0;
        if (_is_handset) {
            bg.scale.x = 2;
            bg.scale.y = 2;
        }

        _hilite = hilite;
        _scene.name = name;
        _scene.addChild(bg);

        var graphics = _data.default.gfx;

        for (var graphics_row in graphics) {
            if (graphics[graphics_row]) {
                for (var g in graphics[graphics_row]) {

                    if (graphics[graphics_row][g]) {

                        var core = new PIXI.Container();
                        var core_mask = new PIXI.Container();
                        var core_images = new PIXI.Container();
                        var core_decals = new PIXI.Container();
                        core_decals.sortableChildren = true;

                        var png = _data.default.gfx[graphics_row][g];
                        var mask = _data.default.mask[graphics_row][g];
                        var pos = _data.default.pos[graphics_row][g];

                        var sprite;
                        sprite = new PIXI.Sprite(_bases.textures[png]);
                        sprite.anchor.set(0, 1);
                        sprite.x = pos[0] - _app.screen.width / 2;
                        sprite.y = pos[1] - _app.screen.height / 2;
                        core_images.addChild(sprite);

                        for (var d = 0; d < _names.length; d++) {

                            png = _data.default.decal_base[graphics_row][g];
                            png = png.replace("{0}", _names[d]);        
                            
                            /* 
                            this version of the app has more cores for i7, it's more similar to i9
                            because i9 has a weird .5 core that we accounted for prev, we'll need to override the core in i7
                            the i7 core at front row, last on the right doesn't have a height, so we're
                            hard-coding the image to something inoffensive and never raising it over 0 height saves a rewrite of the i9 .5 core
                            */

                            /*if(name === 'i7' && parseInt(graphics_row + '', 10) === 1 && parseInt(g + '', 10) === 5){
                                png = 'small_base_decal_3_productivity';
                            }*/

                            
                            sprite = new PIXI.Sprite(_decals.textures[png]);
                            sprite.anchor.set(0, 1);
                            sprite.name = _names[d];
                            sprite.x = pos[0] - _app.screen.width / 2;
                            sprite.y = pos[1] - _app.screen.height / 2;
                            sprite.alpha = 0;
                            core_decals.addChild(sprite);
                        }
                        //================================
                        // add default state
                        png = _data.default.decal_overrides[graphics_row][g];
                        sprite = new PIXI.Sprite(_decals.textures[png]);
                        sprite.anchor.set(0, 1);
                        sprite.x = pos[0] - _app.screen.width / 2;
                        sprite.y = pos[1] - _app.screen.height / 2;
                        sprite.alpha = 1;
                        sprite.name = 'default';
                        core_decals.addChild(sprite);
                        //================================

                        var brush = new PIXI.Sprite(_masks.textures[mask]);
                        brush.anchor.set(0, 1);
                        brush.x = pos[0] - _app.screen.width / 2;
                        brush.y = pos[1] - _app.screen.height / 2;
                        core_mask.addChild(brush);

                        //////////////////////////////

                        core.cap_height = _data.default.gfx_cap_height[graphics_row][g];
                        core_images.addChild(core_decals);
                        core.addChild(core_images);
                        core.addChild(core_mask);
                        core_images.mask = brush;

                        _scene.addChild(core);

                        // store ref
                        _cores.push(core);
                    }
                }
            }
        }
    }

    // ======================= //
    /* public : hide cores */
    function hide_cores(forced) {
        var cnt = 0;
        var graphics = _data.default.gfx;
        for (var graphics_row in graphics) {
            if (graphics[graphics_row]) {
                for (var g in graphics[graphics_row]) {
                    if (graphics[graphics_row][g]) {
                        var c = _cores[cnt];
                        var y = 0;
                        var flush = c.cap_height;
                        //var rate = (Math.random() * .75) + .25;
                        var rate = 0.5;
                        var _y = Math.abs(Math.floor((-y + c.children[0].height) - flush));
                        if (forced) {
                            gsap.killTweensOf(c.children[0]);
                            gsap.set(c.children[0], { pixi: { y: _y } });
                        } else {
                            if (_scene.visible || !forced) {
                                gsap.killTweensOf(c.children[0]);
                                gsap.to(c.children[0], rate, { pixi: { y: _y }, ease: Power2.easeInOut });
                            }
                        }
                        cnt++;
                    }
                }
            }
        }
        gsap.killTweensOf(_hilite);
        gsap.to(_hilite, .33, { pixi: { autoAlpha: 0}, ease: Power2.easeInOut });
    }

    // ======================= //
    /* public : set score state by activity */
    function set_core_state(core,activity) {
        if (!activity) {
            activity = 'default';
        }
        if (!core) {
            core = 'default';
        }
        var cnt = 0;
        var core_delay;
        var decal_delay;
        var graphics = _data.default.gfx;
        

        for (var graphics_row in graphics) {
            if (graphics[graphics_row]) {
                for (var g in graphics[graphics_row]) {
                    if (graphics[graphics_row][g]) {
                        var c = _cores[cnt];
                        var y = _data.default.height[graphics_row][g];
                        var flush = c.cap_height;
                        y = _data[activity].height[graphics_row][g];

                        var rate = (Math.random() * 0.5) + 0.5;
                        var _y = Math.abs(Math.floor((-y + c.children[0].height) - flush));

                        core_delay = 0.1;
                        decal_delay = 0;

                        if (c.children[0].y > _y) {
                            core_delay = 0;
                            decal_delay = 0.1;
                        }

                        gsap.killTweensOf(c.children[0]);
                        gsap.to(c.children[0], rate, { pixi: { y: _y }, ease: Power2.easeInOut, delay: core_delay });

                        // update the decals
                        for (var d in c.children[0].children[1].children) {
                            if (c.children[0].children[1].children[d]) {
                                var decal = c.children[0].children[1].children[d];
                                gsap.killTweensOf(decal);
                                if (decal.name === activity) {
                                    gsap.set(decal, { pixi: { brightness: 7, blur: 10 } });
                                    gsap.to(decal, rate * 0.75, { pixi: { autoAlpha: 1, brightness: 1, blur: 0 }, ease: Power2.easeInOut, delay: decal_delay });
                                    decal.zIndex = 1;
                                } else {
                                    gsap.to(decal, rate * 0.75, { pixi: { autoAlpha: 0 }, ease: Power2.easeInOut, delay: decal_delay * 2 });
                                    decal.zIndex = 0;
                                }
                            }
                        }
                        

                        
                        if (cnt === 11) {
                            // this is the weird half core thing
                            var core_base = c.children[0].children[0];
                            gsap.killTweensOf(core_base);
                            if (activity === 'productivity') {
                                gsap.to(core_base, rate * 0.75, { pixi: { autoAlpha: 0 }, ease: Power2.easeInOut, delay: decal_delay });
                            } else {
                                gsap.to(core_base, rate * 0.75, { pixi: { autoAlpha: 1 }, ease: Power2.easeInOut, delay: decal_delay });
                            }
                        }
                        
                        
                        

                        // unselected state
                        if (activity == 'default') {
                            for(var dflt in c.children[0].children[1].children){
                                if(c.children[0].children[1].children[dflt] === 'default'){
                                    gsap.to(c.children[0].children[1].children[dflt], rate, { pixi: { autoAlpha: 1 }, ease: Power2.easeInOut, delay: decal_delay });
                                    c.children[0].children[1].children[dflt].zIndex = 1;        
                                }
                            }
                        }
                        cnt++;
                    }
                }
            }
        }
        gsap.killTweensOf(_hilite);
        gsap.to(_hilite, 1, { pixi: { autoAlpha: 1}, delay:0.33, ease: Power2.easeInOut });
        _current_activity = activity;
        _init_state = true;
    }

    return {
        init: init,
        set_core_state: set_core_state,
        hide_cores: hide_cores,
        // scene getter
        scene: _scene,
    };
};