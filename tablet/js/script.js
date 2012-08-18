var species_list_entry_tpl;
var species_autocomplete = [];
var search_query = [];

//templates
var search_tpl;
var habitat_tpl;

// main search function
function buv_cmp(a, b) {
    if ((b.tip_perc != 0) || (a.tip_perc != 0))
    {
	return b.tip_perc - a.tip_perc;
    }
    if ((b.bud_perc != 0) || (a.bud_perc != 0))
    {
	return b.bud_perc - a.bud_perc;
    }
    if (b.tip == a.tip)
    {
	return b.bud - a.bud;
    } else {
	return b.tip - a.tip;
    }
}

function search_execute() {
    var values = search_query;
    var buveines_c = [];

    $.each(values,
	   function(key, value) {
	       $.each(rusys[value].bud_buveines,
		      function(key, bvalue) {
			  if (typeof buveines_c[bvalue] == 'undefined') {
			      buveines_c[bvalue] = {
				  'id': bvalue,
				  'count': 0,
				  'bud': 0,
				  'bud_nemedz': 0,
				  'bud_medz': 0,
				  'bud_zol': 0,
				  'tip': 0,
				  'tip_nemedz': 0,
				  'tip_zol': 0,
				  'c_tip': kriterijai[buveines[bvalue].buveine].TipRusys,
				  'c_tipnemedz': kriterijai[buveines[bvalue].buveine].TipNeMedzRusys,
				  'c_tipzol': kriterijai[buveines[bvalue].buveine].TipZolRusys,
				  'c_bud': kriterijai[buveines[bvalue].buveine].BudRusys,
				  'c_budnemedz': kriterijai[buveines[bvalue].buveine].BudNeMedzRusys,
				  'c_budzol': kriterijai[buveines[bvalue].buveine].BudZolRusys,
				  'c_budmedz': kriterijai[buveines[bvalue].buveine].BudMedzRusys,
				  'tip_perc': 0,
				  'bud_perc': 0
			      };
			  }
			  buveines_c[bvalue].count += 1;
			  buveines_c[bvalue].bud += 1;
			  buveines_c[bvalue].bud_nemedz += rusys[value].nemedz;
			  buveines_c[bvalue].bud_zol += rusys[value].zol;
			  buveines_c[bvalue].bud_medz += rusys[value].medz;
		      });
	       $.each(rusys[value].tip_buveines,
		      function(key, bvalue) {
			  if (typeof buveines_c[bvalue] == 'undefined') {
			      buveines_c[bvalue] = {
				  'id': bvalue,
				  'count': 0,
				  'bud': 0,
				  'bud_nemedz': 0,
				  'bud_medz': 0,
				  'bud_zol': 0,
				  'tip': 0,
				  'tip_nemedz': 0,
				  'tip_zol': 0,
				  'c_tip': kriterijai[buveines[bvalue].buveine].TipRusys,
				  'c_tipnemedz': kriterijai[buveines[bvalue].buveine].TipNeMedzRusys,
				  'c_tipzol': kriterijai[buveines[bvalue].buveine].TipZolRusys,
				  'c_bud': kriterijai[buveines[bvalue].buveine].BudRusys,
				  'c_budnemedz': kriterijai[buveines[bvalue].buveine].BudNeMedzRusys,
				  'c_budzol': kriterijai[buveines[bvalue].buveine].BudZolRusys,
				  'c_budmedz': kriterijai[buveines[bvalue].buveine].BudMedzRusys,
				  'tip_perc': 0,
				  'bud_perc': 0
			      };
			  }
			  buveines_c[bvalue].count += 1;
			  buveines_c[bvalue].tip += 1;
			  buveines_c[bvalue].tip_nemedz += rusys[value].nemedz;
			  buveines_c[bvalue].tip_zol += rusys[value].zol;
		      });
	   });
    $.each(buveines_c,
	   function(key, bvalue) {
	       if (typeof bvalue != 'undefined')
	       {
		   if (buveines_c[key].c_tipnemedz != 0) {
		       buveines_c[key].tip_perc += buveines_c[key].tip_nemedz / buveines_c[key].c_tipnemedz;
		   }
		   if (buveines_c[key].c_tipzol != 0) {
		       buveines_c[key].tip_perc += buveines_c[key].tip_zol / buveines_c[key].c_tipzol;
		   }
		   if (buveines_c[key].c_tip != 0) {
		       buveines_c[key].tip_perc += buveines_c[key].tip / buveines_c[key].c_tip;
		   }
		   if (buveines_c[key].c_bud != 0) {
		       buveines_c[key].bud_perc += buveines_c[key].bud / buveines_c[key].c_bud;
		   }

		   if (buveines_c[key].c_budnemedz != 0) {
		       buveines_c[key].bud_perc += buveines_c[key].bud_nemedz / buveines_c[key].c_budnemedz;
		   }
		   if (buveines_c[key].c_budmedz != 0) {
		       buveines_c[key].bud_perc += buveines_c[key].bud_medz / buveines_c[key].c_budmedz;
		   }
		   if (buveines_c[key].c_budzol != 0) {
		       buveines_c[key].bud_perc += buveines_c[key].bud_zol / buveines_c[key].c_budzol;
		   }

	       }
	   });
    buveines_c.sort(buv_cmp);

    $('#results').empty();
    $.each(buveines_c,
	   function(key, value)
	   {
	       if (typeof value != 'undefined')
	       {
		   var temp = buveines[value.id].tip_rusys;
		   var tip_r = [];
		   $.each(temp,
			  function(key, value)
			  {
			      if ($.inArray(String(value), values) == -1)
			      {
				  tip_r.push({
				      'label': rusys[value].rusis,
				      'value': value
				      });
			      }
			  });
		   temp = buveines[value.id].bud_rusys;
		   var bud_r = [];
		   $.each(temp,
			  function(key, value)
			  {
			      if ($.inArray(String(value), values) == -1)
			      {
				  bud_r.push({
				      'label': rusys[value].rusis,
				      'value': value
				  });
			      }
			  });

		   tip_prc = "";
		   if (value.tip_perc != 0) {
		       tip_prc = "("+Math.round(100*value.tip_perc)+"%)";
		   }
		   bud_prc = "";
		   if (value.bud_perc != 0) {
		       bud_prc = "("+Math.round(100*value.bud_perc)+"%)";
		   }

		   tip_r.sort();
		   bud_r.sort();
	       	   $('#results').append(
		       habitat_tpl({
			   'buveine': kriterijai[buveines[value.id].buveine].Pavadinimas,
			   'kodas': buveines[value.id].buveine,
			   'count': value.count,
			   'bud': value.bud,
			   'tip': value.tip,
			   'kriterijai': kriterijai[buveines[value.id].buveine],
			   'tip_rusys': tip_r,
			   'bud_rusys': bud_r,
			   'tip_zol': value.tip_zol,
			   'tip_nemedz': value.tip_nemedz,
			   'bud_medz' : value.bud_medz,
			   'bud_zol' : value.bud_zol,
			   'bud_nemedz' : value.bud_nemedz,
			   'tip_proc': tip_prc,
			   'bud_proc': bud_prc
		       }));
	       }
	   });
}



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
    habitat_tpl = Handlebars.compile($("#habitat-tpl").html());
};

function add_selected(id) {
    $("#search").append(search_tpl({
	'id' : id,
	'name' : rusys[id].rusis
    }));
    $("#search").listview("refresh");
    search_query.push(id);
};

function update_selected() {
    $('#selected-count').text(search_query.length);
};


function search_clear() {
    search_query = [];
    $("#search").empty().listview("refresh");
    update_selected();
    update_autocomplete();
};

function search_exec() {
    $.mobile.changePage('#resultsPage');
    search_execute();
    $('.clps').trigger("create");
    $('#results').trigger("create");
};

function search_click() {
    var id = +this.id;
    search_query.splice(search_query.indexOf(id), 1);
    $(this).remove();
    update_selected();
    update_autocomplete();
};

function search_add() {
    id = +this.id;
    add_selected(id);
    update_selected();
    search_execute();
    $('.clps').trigger("create");
    $('#results').trigger("create");
};

// filter autocomplete list, removing values that exist in the present list
function filter_complete(original, remove) {
    results = [];
    $.each(original,
	   function(k, v) {
	       if ($.inArray(v.value, remove) == -1)
	       {
		   results.push(v);
	       }
	   });
    return results;
};

function update_autocomplete() {
    new_autocomplete = filter_complete(species_autocomplete, search_query);
    $("#searchField").autocomplete("update", {
	'source': new_autocomplete});

};

//$("#searchPage").bind("pageshow", function(e) {
$(function(){
    // compile handlebars templates
    load_templates();

    // bind event handlers
    $('#search-clear').click(search_clear);
    $('#search-exec').click(search_exec);

    $('#search li').live('click', search_click);
    $('.missing-list li').live('click', search_add);

    // initialize auto-complete
    load_autocomplete(rusys);
    $("#searchField").autocomplete({
	target: $('#species'),
	source: species_autocomplete,
	link: '',
	callback: function(e) {
	    var selected = $(e.currentTarget);
	    var id = +selected.attr("href");
	    $('#searchField').val('');
	    if ($.inArray(id, search_query) == -1) {
		add_selected(id);
		update_selected();
		update_autocomplete();
		$('#searchField').focus();
	    };
	    $("#searchField").autocomplete('clear');
	},
	minLength: 1,
	matchFromStart: true
    });

});
