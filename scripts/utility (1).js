/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/

if (typeof(console) == "undefined") { 
  var console = { 
    log: function() {}
  }
} else {
  var logger = function(message) {
    console.log(message);
  }
};


function Esi_ajax_content() {
  var self = this;
  this.esi_link = this.root;
  this.esi_url = this.esi_link.attr('href');
  this.esi_nurse = this.esi_link.parent();
  
  this.esi_switch = function(data) {
    self.esi_link.replaceWith(data);
    self.esi_nurse.trigger('esi_loaded', self.esi_url);
  }
  
  this.start_up = function() {
    $.get(self.esi_url, '', self.esi_switch);
    return self;
  }
  
  return this;
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Cookier(name) {
  var self = this;
  this.cookie_name = name + "=";
  
  this.make_cookie = function (value, days_around) {
    var date = new Date();
    date.setTime(date.getDate() + days_around);
    var expires = "; expires=" + date.toGMTString();
    document.cookie = self.cookie_name + value + expires + "; path=/";
  }
  this.eat_cookie = function () {
    var cookie_jar = document.cookie;
    var cookie_start = cookie_jar.indexOf(self.cookie_name) + self.cookie_name.length;
    var cookie_end = cookie_jar.slice(cookie_start).indexOf(';') + cookie_start;
    return cookie_jar.slice(cookie_start, cookie_end);
  }
  this.toss_cookie = function () {
    self.make_cookie(self.cookie_name, "", -1);
  }
}
/* ------------------------- Wrap_up --------------------------
/	** Wrap_up name
  *  wraps all sibbling elements after a given element and returns the wrapper
  *  no specific formatting is necisarry
  *  this way you can use this funciton in a recursive way to do multi level wraps, and also for lists of colapses
  *  @element element{jQuery} this is the element that is going to end up directly inforn of the wrapper
  *  @element stoper_seletor{String} if you wish to have the wrapper stop at a certin selector..
  */
/* --------------------------------------------------------- */
function Wrap_up(element, stoper_seletor) {
  if (!stoper_selector) stoper_seletor = ''
  element = element.next();
  var wrap = element;
  while (!element.is(stoper_seletor) && element.html()) {
    wrap = wrap.add(element);
    element = element.next();
  }
  return wrap.wrapAll('<div class="wrapper"></div>').parent();
}

/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Snippet_dialog(element) {
	var self = this;
	this.root = element;
	this.dialogizer = function(e) {
		self.root.unbind('click', self.dialogizer);
		e.preventDefault();
		$('#jax_content').append('<div id="new_box"> </div>');
		$('#new_box').load($(this).attr('href')).addClass('dialogized').dialog({
			modal: true,
			overlay: {
				backgroundColor: "#d9d1b6",
				 opacity: '.8'
			 },
			dialogClass: 'deskman',
			height: 700,
			width: 500,
			close: function()  {
				self.root.bind('click', self.dialogizer);
				$(this).dialog('destory').remove();
			}
		});
	}
	this.root.bind('click', this.dialogizer);
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Text_resizer(element) {
  var self = this;
  this.root = element;
  this.current_size = 10;
  this.content_basins = $('.deskman');
  
  this.increase_size = function(e) {
    self.content_basins.css({fontSize: ++self.current_size});
  }
  this.decrease_size = function(e) {
    if (self.current_size > 10)
      self.content_basins.css({fontSize: --self.current_size});
  }

  this.root.children('a[href="#increase"]').bind('click', this.increase_size);
  this.root.children('a[href="#decrease"]').bind('click', this.decrease_size);
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function Is_image(filename) {
  if (!filename) {
    return false;
  }
  var extention = new Path_plus(filename).extention();
	switch (extention) {
    case 'jpg': case 'jpeg': case 'png': case 'tiff': case 'gif':
      return true;
    case 'mov': case 'mp4': case 'flv': case 'swf':
    default : 
      return false;
  }
}

function Path_plus(filename) {
  var self = this;
  this.file_path = filename;
  this.file_extention = '';
  this.file_directory = '';
  
  this.extention = function() {
    self.file_extention = self.file_path.match(/([^.?]+)($|\?)/)[1].toString()
    return self.file_extention;
  }
  
  this.directory = function() {
    self.file_directory = self.file_path.match(/.+[\/^]/)[0].toString()
    return self.file_directory;
  }
  
  return this;
}

function File_extension(filename) {
  var temp_path = '';
  temp_path = filename.match(/([^.?]+)($|\?)/)[1].toString();
  if(temp_path) {
    return temp_path.toString();
  } else {
    return false;
  }
}
function File_directory(filepath) {
	return (/[\/]/).exec(filepath) ? (/.+[\/^]/).exec(filepath) : null;
}
function Number_to_currency(price_in) {
  price_in = Number(price_in).toFixed(2).toString();
  var price_out = '$' + price_in.split('.')[0].slice(0, -3) + (price_in.split('.')[0].slice(0, -3).length > 0 ? ',' : '');
  price_out += price_in.split('.')[0].substr(-3);
  price_out += '.' + price_in.split('.')[1];
  return price_out;
}
/* -----------------------------------------------------------
/* ------------------------- cLone ----------------------------
*/
function External_link(element) {
  var self = this;
  this.linkers = ( arguments.length != 0 ? element : this.root );
  
  this.start_up = function() {
    self.linkers.bind('click', self.blank_window);
  }
  
  this.blank_window = function(e) {
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      return true;
    } else {
      e.preventDefault();
    }
    window.open($(e.currentTarget).attr('href'), '_blank');
  }
  
  return this;
}
/* ------------------------- Sketch ----------------------------
/	** Sketch
  *  a short-cut for animations.. if just the element is passed in, the item will fade away and then be removed
  *  what ever element 
  *  short explination for why done the way that it is
  *  @param element{jQuery} the element to be animated
  *  @param animate_object{object} the object with the css atributes to be animated to
  *  @param callback_function{funtion} a function to be called upon completion.
  *  @param animation_durration{number} the durration of the animation in seconds
  */
/* --------------------------------------------------------- */
function Sketch() {
  this.draw = function(element, animate_object, callback_function, animation_durration, animation_ease) {
    switch (arguments.length) {
      case 0 :
        return false;
      case 1 :
        animate_object = {opacity: 0};
      case 2 :
        if (animate_object.opacity != 0) {
          callback_function = new Function();
        } else {
          callback_function = function() {element.hide().remove();}
        }
      case 3 :
        animation_durration = .65;
      case 4:
        animation_ease = 'easeOutQuart';
      default :
        if (element.length < 1) { return false; }
        break;
    }
    element.animate( animate_object , {
      duration: animation_durration * 1000, 
      easing: animation_ease,
      queue: false,
      complete: callback_function
    });
    
    return element;
  }
  return this;
}
/* ------------------------- cLone ----------------------------
/	** cLone name
  *  short description of what class does
  *  short description of how html needs to be formated.. if at all
  *  short explination for why done the way that it is
  *  @param cLone{data type} variable: discirption of what the variable does does
  *  @memeber cLone: function: discirption of what the function does and how it is used
  *  @event cLone{event type}: function: discirption of what the event does, and when or why it is called
  */
/* --------------------------------------------------------- */
function Overlay(element) {
  var self = this;
  this.wind = $(window);
  this.jax_space = element;
  this.jax_space.append('<div class="overlay"></div>')
  this.overlay = this.jax_space.children(':last');
  if (this.jax_space.attr('id') == 'jax_container') {
    this.jax_space = this.jax_space.siblings('#container');
  }
  
  this.set_width = function() {
    self.overlay.width(self.jax_space.width());
    self.overlay.height(self.jax_space.height());
  }
  
  this.get_gone = function() {
    new Sketch().draw(self.overlay);
  }
  this.wind.bind('resize', this.set_width);
  this.set_width();
  new Sketch().draw(this.overlay, {opacity :  0.7});
}

function Popin(current_popin_view) {
  var self = this;
  this.view = current_popin_view.view;  
  this.popin_actions = null;
  
  this.set_scroll_top = function() {
    if (!$.browser.msie) {
      self.scroll_top = window.pageYOffset;
    } else {
      self.scroll_top = document.documentElement.scrollTop;
    }
    return self.scroll_top;
  }
  
  this.plugin_popin = function(parent_element) {
    self.overlay = new Overlay(parent_element);
    self.popin = $(self.view.make_popin()).appendTo(parent_element);
    new Sketch().draw(self.popin.css({top:self.set_scroll_top()}), {opacity : 1});
    self.popin_actions = self.popin.children('div.title').children('div.actions');
    self.popin_content = self.popin.children('div.content');
    self.popin_actions.children('.close').bind('click', self.close_popin);
  }
  
  this.close_popin = function(e) {
    self.overlay.get_gone();
    new Sketch().draw(self.popin);
  }
  
  return this;
}
/* ------------------------- cLone ----------------------------
/	** cLone name
  *  short description of what class does
  *  short description of how html needs to be formated.. if at all
  *  short explination for why done the way that it is
  *  @param cLone{data type} variable: discirption of what the variable does does
  *  @memeber cLone: function: discirption of what the function does and how it is used
  *  @event cLone{event type}: function: discirption of what the event does, and when or why it is called
  */
/* --------------------------------------------------------- */
