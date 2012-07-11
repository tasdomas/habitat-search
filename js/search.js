var species_tpl;

function clear_results(event) {
    event.preventDefault();
    $("option:selected", $('#species')).removeAttr("selected");
    $('#species').trigger("liszt:updated");
    $('#species-container').empty();
    return false;
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
				  'tip': 0};
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
				  'tip': 0};
			  }
			  buveines_c[value].count += 1;
			  buveines_c[value].tip += 1;
		      });
	   });
    buveines_c.sort(function(a, b) {return b.count - a.count;});
    $('#species-container').empty();
    $.each(buveines_c,
	   function(key, value)
	   {
	       if (typeof value != 'undefined')
	       {
	       	   $('#species-container').append(
		       species_tpl({
			   'buveine':buveines[value.id].buveine,
			   'count': value.count,
			   'bud': value.bud,
			   'tip': value.tip
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
    species_tpl = Handlebars.compile($("#species-template").html());
});
