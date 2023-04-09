function Runes(basin_object, tab_object, slider_object, tabbed_slider_object) {
  switch (arguments.length) {
    case 0 :
      return;
    case 1 :
      Basins.call(this, arguments[0]);
      break;
     case 2 :
      Basins.call(this, arguments[0]).start_up();
      if (arguments[1].hasOwnProperty('sliders')) {
        Sliders.call(this, arguments[1]);
      } else {
        Tabs.call(this, arguments[1]);
      }
      break;
    case 3 :
      Basins.call(this, arguments[0]).start_up();
      Tabs.call(this, arguments[1]).start_up();
      Sliders.call(this, arguments[2]);
      break;
    case 4 :
      Basins.call(this, arguments[0]).start_up();
      Tabs.call(this, arguments[1]).start_up();
      Sliders.call(this, arguments[2]).start_up();
      Tabbed_sliders.call(this, arguments[3]);
      break;
    default :
      break;
  }
  return this;
}
/* ------------------------- Slider -----------------------------
/	** Slider class used to progress basinis up and down 
  * Dependent on the basins class... use Runes class to exstantiate.
  *	@param {jQuery} the containing element of the 
  */
/* --------------------------------------------------------- */
function Tabbed_sliders(tabbed_slider_object) {
  var self = this;
  this.first_visible = 0;
  this.tab_slide_seed = 2;
  this.tabbed_slide_switch_method = tabbed_slider_object.switch_method;
  
  this.seed_out = function(e) {
    self.thumbed_basins.basins = self.tabs;
    if (self.active_index  > self.tab_slide_seed) {
     if ((self.active_index + self.tab_slide_seed) < self.tabs.length) {
        self.thumbed_basins[self.tabbed_slide_switch_method](self.active_index - self.tab_slide_seed);
      } else {
        self.thumbed_basins[self.tabbed_slide_switch_method](self.tabs.length - (self.tab_slide_seed * 2));
      }
    } else {
      self.thumbed_basins[self.tabbed_slide_switch_method](0);
    }
  }
  this.tumb_slide = function(e) {
    if ((self.active_index - self.tab_slide_seed)  > 0 && (self.active_index + self.tab_slide_seed) < self.tabs.length) {
      self.thumbed_basins[self.tabbed_slide_switch_method](self.active_index - self.tab_slide_seed + e.data);
    } else {
      //self.thumbed_basins[self.tabbed_slide_switch_method](0);
    }
  }
  this.start_up = function() {
    self.thumbed_basins = new Basins({basins:self.tabs, basin_visual_active : false, infinate_scroll : true}).start_up();
    self.tabs.bind('click', self.seed_out);
    var temp_query = self.sliders.eq(0);
    for (var i = 0; i < self.sliders.length; i++) {
      temp_query = self.sliders.eq(i);
      temp_query.bind('click', temp_query.data('direction'), self.tumb_slide);
    }
    return self;
  }

  return this;
}
/* ------------------------- Slider -----------------------------
/	** Slider class used to progress basinis up and down 
  * Dependent on the basins class... use Runes class to exstantiate.
  *	@param {jQuery} the containing element of the 
  */
/* --------------------------------------------------------- */
function Sliders(slider_object) {
  var self = this;
  this.sliders = slider_object.sliders;
  this.slide_switch_method = slider_object.switch_method;
  this.sliders.eq(0).data('direction', -1);
  this.sliders.eq(1).data('direction', 1);
  this.current_slide = 0;
  this.number_visible = slider_object.number_visible;
  this.auto = (slider_object.auto ? slider_object.auto : false);
  this.basin_click_advance = (typeof slider_object.basin_click_advance == "boolean" ? slider_object.basin_click_advance : false);
  this.delay = (slider_object.delay ? slider_object.delay : 7);
  this.seed = (slider_object.seed ? slider_object.seed : 1);
  this.slide_animation = (slider_object.slide_animation ? slider_object.slide_animation : new Object());
  /** 
   * @member start_up: initilizer
  */
  this.set_disabled = function(e) {
    if (self.active_index == 0) {
      self.sliders.eq(0).addClass('disabled');
      self.sliders.eq(1).removeClass('disabled');
    } else if (self.active_index == self.basins.length -1) {
      self.sliders.eq(1).addClass('disabled');
      self.sliders.eq(0).removeClass('disabled');
    }
    else {
      self.sliders.removeClass('disabled');
    }
  }
  
  this.start_up = function() {
    var temp_query = self.sliders.eq(0);
    for (var i = 0; i < self.sliders.length; i++) {
      temp_query = self.sliders.eq(i);
      temp_query.bind('click', temp_query.data('direction'), self.slide_on);
      temp_query.bind('mouseenter', temp_query.data('direction'), self.slide_over);
      temp_query.bind('mouseleave', temp_query.data('direction'), self.slide_out);
    }
    self.basin_wrapper.bind('new_active', self.set_disabled);
    self.basin_wrapper.trigger('new_active');
    if (self.auto) {
      self.timer_set();
    }
    self.slide_bind_up();
    return self;
  }
  
  this.click_advance_bind = function() {
    self.sliders.eq(1).trigger('click');
  }
  
  this.slide_bind_up = function() {
    if (self.basin_click_advance) {
      self.basins.bind('click', this.click_advance_bind);
    }
  }
  
  this.slide_on = function(e) {
    e.preventDefault();
    if (self.auto) {
      self.timer_set();
    }
    if ((self.active_index >= self.seed) && (self.active_index < (self.basins.length - self.seed))) {
      self[self.slide_switch_method](self.active_index + (self.seed * e.data), e.data);
    } else if (self.shiftable(e.data)) {
      self[self.slide_switch_method](self.active_index + (1 * e.data), e.data)
    }
  }
    
  this.slide_to = function(index, direction) {
    if (self.auto) {
      self.timer_set();
    }
    self[self.slide_switch_method](index, direction);
  }
    
  this.shiftable = function(direction) {
    return !(self.min_reached !== self.max_reached && ((self.min_reached + self.max_reached) * direction) > 0);
  }
  /** 
   * @event tab_switch: used to 
   * @param e {Click} is a reference to a jquery selector
  */
  this.slide_over = function(e) {
    e.preventDefault();
    self.sketcher.draw($(e.currentTarget), self.slide_animation.over);
  }
  /** 
   * @event tab_switch: used to 
   * @param e {Click} is a reference to a jquery selector
  */
  this.slide_out = function(e) {
    e.preventDefault();
    self.sketcher.draw($(e.currentTarget), self.slide_animation.out);
  }
  
  this.next_up = function() {
    if (!self.sliders.eq(1).hasClass('disabled')) {
      self.sliders.eq(1).trigger('click');
    } else {
			var wrap_end_hack = self.basins.eq(0).clone();
			self.basin_wrapper.append(wrap_end_hack);
			self.basin_wrapper.width(self.basin_wrapper.width() + self.basins.eq(0).width());
			self.basins = self.basin_wrapper.children();
      self.slide_to(self.basins.length - 1, 1);
			setTimeout(function() {
				self.slide_goto(0);
				setTimeout(function() {
					self.basins.eq(self.basins.length-1).remove();
					self.basins = self.basin_wrapper.children();
				}, 400);
			}, 1500);
    }
  }
  
  this.timer_set = function() {
    if (self.on_own != null) {
      clearTimeout(self.on_own);
    }
    self.on_own = setTimeout(self.next_up, self.delay * 1000);
  }

  
  this.all_slide_switch_shift = function(index, basin_distance, marker_distance, direction, marker) {
    self.shift_distance = direction * basin_distance;
    self.sketcher.draw(marker, {
      left: marker_distance * direction
    }, null, .2);
    self.sketcher.draw(self.basin_wrapper, {
      left: self.current_slide - self.shift_distance
    });
  }
  this.vertical_all_slide_shift = function(index, basin_distance, marker_distance, direction, marker) {
    self.shift_distance = direction * -basin_distance;
    self.sketcher.draw(marker, {
      top: marker_distance * direction
    }, null, .2);
    self.sketcher.draw(self.basin_wrapper, {
      top: self.current_slide + (self.shift ? self.shift_distance : 0)
    });
  }

  
  return this;
}
/* ------------------------- Tabs -----------------------------
/	** Tabs Class used to set up tabbing functionality 
  * 
  *	@param {jQuery} the containing element of the 
  */
/* --------------------------------------------------------- */
function Tabs(tab_object) {
  var self = this;
  this.tabs = tab_object.tabs;
  this.tab_wrapper = this.tabs.parent();
  this.tab_switch_method = (tab_object.switch_method ? tab_object.switch_method : 'two_slide_switch');
  this.active_hover = null;
  this.active_click = null;
  this.tab_animation = tab_object.tab_animation
  this.tab_visual_active = (typeof tab_object.tab_visual_active == "boolean" ? tab_object.tab_visual_active : true);
  
  /** 
   * @member start_up: initilizer
  */
  this.start_up = function() {
    if (self.tab_switch_method && self.tab_switch_method  == 'all_slide_switch') {
      //self.basins.bind('load', self.set_wrapper_width);
    }
    self.tabs.bind('click', self.tab_switch);
    if (self.tab_animation) {
      self.tabs.bind('mouseenter', self.tab_over);
      self.tab_wrapper.bind('mouseleave', self.tab_out);
    }
    self.active_index++;
    self.tabs.eq(self.active_index - 1).trigger('click');
    
    self.active_hover = self.tabs.eq(self.active_index);
    return self;
  }
  /** 
   * @event tab_switch: used to 
   * @param e {Click} is a reference to a jquery selector
  */
  this.tab_over = function(e) {
    e.stopPropagation();
    self.tab_out(e);
    self.active_hover = $(e.currentTarget);
    self.sketcher.draw(self.active_hover, self.tab_animation.over);
  }
  /** 
   * @event tab_switch: used to 
   * @param e {Click} is a reference to a jquery selector
  */
  this.tab_out = function(e) {
    e.preventDefault();
    self.sketcher.draw(self.active_hover, self.tab_animation.out);
  }
  /** 
   * @event tab_switch: used to 
   * @param e {Click} is a reference to a jquery selector
  */
  this.tab_switch = function(e) {
    e.preventDefault();
    var new_index = $(e.currentTarget).prevAll().length;
    if (new_index == self.active_index) {
      return false;
    } else if (new_index < self.active_index) {
      self[self.tab_switch_method](new_index, -1);
    } else if (new_index > self.active_index) {
      self[self.tab_switch_method](new_index, 1);
    }
  }
  
  return this;
}
/* ------------------------- Basins -----------------------------
/	** Basins: those majical containers..
  * An abstract class consisting of basins, an active pasin and the parent 'wrapper'
  *	@param basins{jQuery} the 'baisins' of content that will be veiwed
  */
/* --------------------------------------------------------- */
function Basins(basin_object) {
  var self = this;
  this.basins = basin_object.basins;
  this.active_index = 0
  this.active = this.basins.eq(this.active_index).addClass('first');
  this.basin_wrapper = this.basins.parent();
  this.basin_width = self.basin_wrapper.outerWidth();
  this.sketcher = new Sketch();
  this.infinate_scroll = (basin_object.infinate_scroll ? basin_object.infinate_scroll : false);
  this.change_wrapper_height = (basin_object.change_wrapper_height ? basin_object.change_wrapper_height : false);
  this.change_wrapper_width = (basin_object.change_wrapper_width ? basin_object.change_wrapper_width : false);
  this.basin_visual_active = (typeof basin_object.basin_visual_active == "boolean" ? basin_object.basin_visual_active : true);
  this.first_up = true;
  this.center_basin = (typeof basin_object.center_basin == "boolean" ? basin_object.center_basin : false);
  this.wrapper_widther = {
    "load" : {
      basins_width : 0,
      iteration : 0
    },
    "rewidth" : {
      basins_width : 0,
      iteration : 0
    }
  }
  this.clone_iteration = 0;
  if (basin_object.special_transition) {
    self[basin_object.special_transition.namer] = self[basin_object.special_transition.transition]
  }
  /** 
   * @member start_up: initilizer
  */
  this.start_up = function() {
    if (self.basin_wrapper.hasClass('holder')) {
      //self.basin_bind_up();
    }
    self.set_active(self.active_index); // -- setting active
    //self.basins.trigger('rewidth');
    return self;
  }
  
  this.basin_bind_up = function() {
    self.basins.bind('load', self.set_wrapper_width);
    self.basins.bind('rewidth', self.set_wrapper_width);
  }
  /** 
   * @member set_active: used to set the active state on a 'basin'
   * @param index {number} this refers to the index of the new active element
  */
  this.set_active = function(index, manual_fire) {
    if (index >= self.basins.length) {
      index = self.basins.length -1;
      self.max_reached = 1;
      self.min_reached = 0;
    } else if (index < 0) {
      index = 0;
      self.min_reached = -1;
      self.max_reached = 0;
    } else if (index >= self.basins.length - 1) {
      self.max_reached = 1;
      self.min_reached = 0;
    } else if (index < 1) {
      self.min_reached = -1;
      self.max_reached = 0;
    } else {
      self.min_reached = 0;
      self.max_reached = 0;
    }
    self.active_index = index;
    self.active = self.basins.eq(index);
    if (self.basin_visual_active) {
      self.basins.eq(index).addClass('active').siblings().removeClass('active');
    }
    if (self.tab_visual_active) {
      self.tabs.eq(index).addClass('active').siblings().removeClass('active');
    }
    if (!manual_fire) {
      self.basin_wrapper.trigger('new_active');
    }
  }
  /** 
   *  @member basic_switch: a simple method just used to 
   *    switch back and forth between 'basins' by showing and hidein
   *  @param index {number} this refers to the index of the new active element
  */
  this.basic_switch = function(index) {
    if (index == self.active_index) return false;
    self.active.hide();
    self.set_active(index); // -- setting active
    self.active.show();
  }
  /** 
   * @event tab_switch: used to 
   * @param e {Click} is a reference to a jquery selector
  */
  this.set_wrapper_width = function(e) {
    self.wrapper_widther[e.type].basins_width +=  ($(e.currentTarget).outerHeight(true) < 20 ? 2000 : $(e.currentTarget).outerWidth(true));
    self.wrapper_widther[e.type].iteration++;
    if (self.wrapper_widther[e.type].iteration == self.basins.length) {
      self.basin_wrapper.width(self.wrapper_widther[e.type].basins_width);
      self.wrapper_widther[e.type].iteration = 0;
      self.wrapper_widther[e.type].basins_width = 0;
    }
  }
  this.slide_goto = function(index) {
    self.set_active(index); // -- setting active
    self.current_slide = self.active.position().left;
    self.basin_wrapper.css({left: -self.current_slide});
    if (self.change_wrapper_height) {
      self.basin_wrapper.css({height: self.active.outerHeight(true)});
    }
    if (self.change_wrapper_width) {
      var temp_width = self.active.outerWidth(true)
      if (temp_width != self.basin_wrapper.parent().parent().width()) {
        self.basin_wrapper.parent().parent().css({
          width: temp_width,
          marginLeft : -temp_width / 2
        });
      }
    }
  }
  /** 
   * @member two_slide_switch: used to attach the basins to the tabs
   * @param index {number} this refers to the index of the new active element
  */
  this.two_slide_switch = function(index, direction) {
    if (index == self.active_index) return false;
    if (self.first_up) { 
      self.set_active(index);
      self.first_up = false;
      return false;
    }
    self.basin_width = self.active.outerWidth() * direction;
    self.active.css({position : 'relative', left : 0})
    self.sketcher.draw(self.active, {
      left: -self.basin_width
    }, function() {
      this.style.position = 'absolute';
      this.style.left = self.basin_width + 'px';
    }, .66);
    self.set_active(index, true); // -- setting active
    
    self.active.css({position : 'absolute', left : self.basin_width});
    self.basin_wrapper.trigger('new_active');
    if (self.change_wrapper_height) {
      self.sketcher.draw(self.basin_wrapper, {
        height: self.active.outerHeight(true)
      });
    }
    self.sketcher.draw(self.active, {
      left: 0
    }, function() {
      this.style.position = 'relative';
    }, .65);
  }
  /** 
   * @member all_slide_switch: used to attach the basins to the tabs
   * @param index {number} this refers to the index of the new active element
  */
  this.all_slide_switch =  function(index, direction) {
    if (index == self.active_index) return false;
    self.set_active(index); // -- setting active
    var temp_width = self.active.outerWidth();
    if (self.center_basin) {
      self.current_slide = -self.active.position().left + ((self.basin_wrapper.parent().outerWidth() - self.active.outerWidth(true)) / 2);
    } else {
      self.current_slide = -self.active.position().left;
    }
    self.sketcher.draw(self.basin_wrapper, {
      left: self.current_slide + (self.shiftable && self.shiftable(direction) && self.shift_distance ? -self.shift_distance : 0)
    }, null, 1.2);
    if (self.change_wrapper_width && temp_width > 200) {
      if (temp_width != self.basin_wrapper.parent().parent().width()) {
        self.sketcher.draw(self.basin_wrapper.parent().parent(), {
          width: temp_width,
          marginLeft : -temp_width / 2
        }, null, 1.2);
      }
    }
    if (self.change_wrapper_height && self.active.outerHeight(true) > 200) {
      self.sketcher.draw(self.basin_wrapper, {
        height: self.active.outerHeight(true)
      });
    }
  }
  
  /** 
   * @member all_slide_switch: used to attach the basins to the tabs
   * @param index {number} this refers to the index of the new active element
  */
  this.vertical_all_slide = function(index, direction) {
    if (index == self.active_index) return false;
    self.set_active(index); // -- setting active
    self.current_slide = -self.active.position().top;
    self.sketcher.draw(self.basin_wrapper, {
      top: self.current_slide + (self.shiftable && self.shiftable(direction) && self.shift_distance ? self.shift_distance : 0)
    });
    self.current_height = 0;
    for (var i = self.active_index; i < self.basins.length && i < self.active_index + self.number_visible; i++) {
      self.current_height += self.basins.eq(i).outerHeight(true);
    }
    if (self.current_height > 0) {
      self.sketcher.draw(self.basin_wrapper.parent(), {
        height: self.current_height - self.number_visible
      });
    }
  }
  
  
  return this;
}