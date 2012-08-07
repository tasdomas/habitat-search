var species_tpl;

function clear_results(event) {
    event.preventDefault();
    $("option:selected", $('#species')).removeAttr("selected");
    $('#species').trigger("liszt:updated");
    $('#species-container').empty();
    return false;
}

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

function search_execute(event) {
    event.preventDefault();
    var values = $('#species').val();
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
    $('#species-container').empty();
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
				  tip_r.push(rusys[value].rusis);
			      }
			  });
		   temp = buveines[value.id].bud_rusys;
		   var bud_r = [];
		   $.each(temp,
			  function(key, value)
			  {
			      if ($.inArray(String(value), values) == -1)
			      {
				  bud_r.push(rusys[value].rusis);
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
	       	   $('#species-container').append(
		       species_tpl({
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

    return false;
}

$(function() {
    var options = $('#species');
    $.each(rusys,
	   function() {
	       if (typeof this.id != 'undefined') {
		   options.append($("<option />").val(this.id).text(this.rusis));
	       };
	   });
    $(".chzn-select").chosen({no_results_text: "tokių rūšių nerasta...", 'disable_search_threshold': 3, 'search_contains' : false});
    $('#search-clear').click(clear_results);
    $('#search-exec').click(search_execute);
    $('h4.criteria-header').live("click",
	       function() {
		   $(this).siblings('table.criteria').toggle();
	       });
    $('h4.missingspecies-header').live("click",
	       function() {
		   $(this).siblings('div.missingspecies').toggle();
	       });

    species_tpl = Handlebars.compile($("#species-template").html());
});
