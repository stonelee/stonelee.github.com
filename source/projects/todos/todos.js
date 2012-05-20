// 去掉不必要的全局变量，更好的结构
// modified by stonelee(http://stonelee.info)
//
// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.
//
$(function() {

	var App = {
		Models: {},
		Views: {},
		Collections: {},
		initialize: function() {
			new App.Views.App();
		}
	};

	App.Models.Todo = Backbone.Model.extend({
		defaults: {
			done: false
		},

		toggle: function() {
			this.save({
				done: ! this.get("done")
			});
		}

	});

	App.Collections.Todo = Backbone.Collection.extend({
		model: App.Models.Todo,
		localStorage: new Store("todos"),

		done: function() {
			return this.filter(function(todo) {
				return todo.get('done');
			});
		},

		remaining: function() {
			return this.without.apply(this, this.done());
		},

		nextOrder: function() {
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		comparator: function(todo) {
			return todo.get('order');
		}

	});

	App.Views.Todo = Backbone.View.extend({
		tagName: "li",
		template: _.template($('#item-template').html()),

		events: {
			"click .check": "toggleDone",
			"dblclick div.todo-text": "edit",
			"click span.todo-destroy": "clear",
			"keypress .todo-input": "updateOnEnter"
		},

		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},

		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			this.setText();
			return this;
		},

		setText: function() {
			var text = this.model.get('text');
			this.$('.todo-text').text(text);
			this.input = this.$('.todo-input');
			this.input.bind('blur', _.bind(this.close, this)).val(text);
		},

		toggleDone: function() {
			this.model.toggle();
		},

		edit: function() {
			$(this.el).addClass("editing");
			this.input.focus();
		},

		close: function() {
			this.model.save({
				text: this.input.val()
			});
			$(this.el).removeClass("editing");
		},

		updateOnEnter: function(e) {
			if (e.keyCode == 13) {
				this.close();
			}
		},

		remove: function() {
			$(this.el).remove();
		},

		clear: function() {
			this.model.destroy();
		}

	});

	App.Views.App = Backbone.View.extend({
		el: $("#todoapp"),
		statsTemplate: _.template($('#stats-template').html()),

		events: {
			"keypress #new-todo": "createOnEnter",
			"keyup #new-todo": "showTooltip",
			"click .todo-clear a": "clearCompleted"
		},

		initialize: function() {
			this.input = this.$("#new-todo");
			this.todos = new App.Collections.Todo();

			this.todos.bind('add', this.addOne, this);
			this.todos.bind('reset', this.addAll, this);
			this.todos.bind('all', this.render, this);

			this.todos.fetch();
		},

		render: function() {
			this.$('#todo-stats').html(this.statsTemplate({
				total: this.todos.length,
				done: this.todos.done().length,
				remaining: this.todos.remaining().length
			}));
		},

		addOne: function(todo) {
			var view = new App.Views.Todo({
				model: todo
			});
			this.$("#todo-list").append(view.render().el);
		},

		addAll: function() {
			this.todos.each(this.addOne);
		},

		createOnEnter: function(e) {
			var text = this.input.val();
			if (!text || e.keyCode != 13) {
				return;
			}
			this.todos.create({
				text: text,
				order: this.todos.nextOrder()
			});
			this.input.val('');
		},

		clearCompleted: function() {
			_.each(this.todos.done(), function(todo) {
				todo.destroy();
			});
			return false;
		},

		showTooltip: function(e) {
			var tooltip = this.$(".ui-tooltip-top");
			var val = this.input.val();
			tooltip.fadeOut();
			if (this.tooltipTimeout) {
				clearTimeout(this.tooltipTimeout);
			}
			if (val === '' || val == this.input.attr('placeholder')) {
				return;
			}
			var show = function() {
				tooltip.show().fadeIn();
			};
			this.tooltipTimeout = _.delay(show, 1000);
		}

	});

	App.initialize();
});

