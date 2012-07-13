var species_tpl;

function clear_results(event) {
    event.preventDefault();
    $("option:selected", $('#species')).removeAttr("selected");
    $('#species').trigger("liszt:updated");
    $('#species-container').empty();
    return false;
}

function buv_cmp(a, b) {
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
				  'tip': 0
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
				  'tip': 0
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

	       	   $('#species-container').append(
		       species_tpl({
			   'buveine': kriterijai[buveines[value.id].buveine].Pavadinimas,
			   'kodas': buveines[value.id].buveine,
			   'count': value.count,
			   'bud': value.bud,
			   'tip': value.tip,
			   'kriterijai': kriterijai[buveines[value.id].buveine],
			   'tip_rusys': tip_r,
			   'bud_rusys': bud_r
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
