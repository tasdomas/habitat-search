import csv
from collections import defaultdict


def empty_species():
    return {'id': None,
            'rusis': None,
            'akronimas': None,
            'bud_buveines': [],
            'tip_buveines': []}

def empty_habitat():
    return {'id': None,
            'anketa': None,
            'rusys': set()}

rusys = defaultdict(empty_species)
buveines = defaultdict(empty_habitat)

spc_rd = csv.reader(open('rusys.csv', 'rb'), delimiter='\t', quotechar="\"")

line = 0

rusys_id_map = defaultdict(int)
buveines_id_map = defaultdict(int)
rusis_id_counter = 1
buveines_id_counter = 1
for row in spc_rd:
    line += 1
    if line <= 1:
        continue

    rusis = row[0]
    akronimas = row[1]
    buveine = row[2]
    buv_tipas = row[3]
    tipiskumas = row[4]
    aug_tipas = row[5]

    if buveines_id_map[buveine] == 0:
        buveine_id = buveines_id_counter
        buveines[buveine_id]['id'] = buveine
        buveines[buveine_id]['anketa'] = buv_tipas
        buveines_id_map[buveine] = buveine_id
        buveines_id_counter += 1
    else:
        buveine_id = buveines_id_map[buveine]

    if rusys_id_map[rusis] == 0:
        rusis_id = rusis_id_counter
        rusys[rusis_id]['id'] = rusis_id
        rusys[rusis_id]['rusis'] = rusis
        rusys[rusis_id]['akronimas'] = akronimas
        rusys_id_map[rusis] = rusis_id
        rusis_id_counter += 1
    else:
        rusis_id = rusys_id_map[rusis]

    buveines[buveine_id]['rusys'].add(str(rusis_id))

    if int(tipiskumas) != 0:
        rusys[rusis_id]['tip_buveines'].append(str(buveine_id))
    else:
        rusys[rusis_id]['bud_buveines'].append(str(buveine_id))

out = open("rusys.js", "wt")
out.write("var rusys = [];\n");
for id, rusis in rusys.items():
    out.write("rusys[%d] = {'rusis' : '%s', 'id' : %d, 'akronimas': '%s', 'bud_buveines': [%s], 'tip_buveines': [%s]};\n" %
              (id,
               rusis['rusis'],
               id,
               rusis['akronimas'],
               (len(rusis['bud_buveines']) > 0) and "" + ", ".join(rusis['bud_buveines']) + "" or ' ',
               (len(rusis['tip_buveines']) > 0) and "" + ", ".join(rusis['tip_buveines']) + "" or ' '))
out.write("var buveines = [];\n");
for id, buveine in buveines.items():
    out.write("buveines[%d] = {'buveine': '%s', 'id' : %d, 'rusys': [%s], 'anketa': '%s'};\n" %
              (id,
               buveine['id'],
               id,
               (len(buveine['rusys']) > 0) and "" + ", ".join(buveine['rusys']) + "" or ' ',
               buveine['anketa']))

out.close()

