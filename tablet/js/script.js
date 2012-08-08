var species_list_entry_tpl;
var species_autocomplete = [];
var search_query = [];

//templates
var search_tpl;

function load_autocomplete(source) {
    $.each(source,
	   function() {
	       if (typeof this.id != 'undefined') {
		   species_autocomplete.push({
		       'value': this.id,
		       'label': this.rusis
		   });
	       };
	   });
};

function load_templates() {
    search_tpl = Handlebars.compile($("#search-tpl").html());
};


function update_selected() {
    $('#selected-count').text(search_query.length);
};


function search_clear() {
    search_query = [];
    $("#search").empty().listview("refresh");
    update_selected();
};


//$("#searchPage").bind("pageshow", function(e) {
$(function(){
    // compile handlebars templates
    load_templates();

    // bind event handlers
    $('#search-clear').click(search_clear);


    // initialize auto-complete
    load_autocomplete(rusys);
    $("#searchField").autocomplete({
	target: $('#species'),
	source: species_autocomplete,
	link: '',
	callback: function(e) {
	    var selected = $(e.currentTarget);
	    var id = selected.attr("href");
	    $('#searchField').val('');
	    if ($.inArray(id, search_query) == -1) {
		search_query.push(id);
		$("#search").append(search_tpl({
		    'id' : id,
		    'name' : selected.text()
		}));
		$("#search").listview("refresh");
		update_selected();
	    };
	    $("#searchField").autocomplete('clear');
	},
	minLength: 1,
	matchFromStart: true
    });

});
