var species_tpl;

function clear_results(event) {
    event.preventDefault();
    $("option:selected", $('#species')).removeAttr("selected");
    $('#species').trigger("liszt:updated");
    $('#species-container').empty();
    return false;
}

function buv_cmp(a, b) {
    if ((b.c_tip != 0) || (a.c_tip != 0))
    {
	var a_v = 0.0;
	var b_v = 0.0;
	if (a.c_tip != 0)
	{
	    a_v = a.tip /  a.c_tip;
	}
	if (b.c_tip != 0)
	{
	    b_v = b.tip /  b.c_tip;
	}
	return b_v - a_v;
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
		      function(key, value) {
			  if (typeof buveines_c[value] == 'undefined') {
			      buveines_c[value] = {
				  'id': value,
				  'count': 0,
				  'bud': 0,
				  'tip': 0,
				  'c_tip': kriterijai[buveines[value].buveine].TipRusys
			      };
			  }
			  buveines_c[value].count += 1;
			  buveines_c[value].bud += 1;
		      });
	       $.each(rusys[value].tip_buveines,
		      function(key, value) {
			  if (typeof buveines_c[value] == 'undefined') {
			      buveines_c[value] = {
				  'id': value,
				  'count': 0,
				  'bud': 0,
				  'tip': 0,
				  'c_tip': kriterijai[buveines[value].buveine].TipRusys
			      };
			  }
			  buveines_c[value].count += 1;
			  buveines_c[value].tip += 1;
		      });
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

		   prc = "";
		   if (value.c_tip != 0) {
		       prc = "("+Math.round(100*value.tip / value.c_tip)+"%)";
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
			   'proc': prc
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
    $(".chzn-select").chosen({no_results_text: "tokių rūšių nerasta...", disable_search_threshold: 3});
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
