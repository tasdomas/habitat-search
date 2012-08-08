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

//$("#searchPage").bind("pageshow", function(e) {
$(function(){
    // compile handlebars templates
    load_templates();

    console.log("ok");



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
	    };
	    $("#searchField").autocomplete('clear');
	},
	minLength: 1,
	matchFromStart: true
    });

});
