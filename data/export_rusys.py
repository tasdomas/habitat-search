#!/usr/bin/env python
# -- coding: utf-8 --

import csv
from collections import defaultdict


def empty_species():
    return {'id': None,
            'rusis': None,
            'nemedz': 0,
            'zol': 0,
            'akronimas': None,
            'bud_buveines': [],
            'tip_buveines': []}

def empty_habitat():
    return {'id': None,
            'anketa': None,
            'tip_rusys': set(),
            'bud_rusys': set()}

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
        if aug_tipas.startswith("Žolės"):
            rusys[rusis_id]['zol'] = 1
        if not aug_tipas.startswith("Medžiai"):
            rusys[rusis_id]['nemedz'] = 1
        rusys_id_map[rusis] = rusis_id
        rusis_id_counter += 1
    else:
        rusis_id = rusys_id_map[rusis]

    if int(tipiskumas) != 0:
        rusys[rusis_id]['tip_buveines'].append(str(buveine_id))
        buveines[buveine_id]['tip_rusys'].add(str(rusis_id))
    else:
        rusys[rusis_id]['bud_buveines'].append(str(buveine_id))
        buveines[buveine_id]['bud_rusys'].add(str(rusis_id))

out = open("../js/rusys.js", "wt")
out.write("var rusys = [];\n");
for id, rusis in rusys.items():
    out.write("rusys[%d] = {'rusis' : '%s', 'id' : %d, 'akronimas': '%s', 'bud_buveines': [%s], 'tip_buveines': [%s], 'nemedz': %d, 'zol': %d};\n" %
              (id,
               rusis['rusis'],
               id,
               rusis['akronimas'],
               (len(rusis['bud_buveines']) > 0) and "" + ", ".join(rusis['bud_buveines']) + "" or ' ',
               (len(rusis['tip_buveines']) > 0) and "" + ", ".join(rusis['tip_buveines']) + "" or ' ',
               rusis['nemedz'],
               rusis['zol']))
out.write("var buveines = [];\n");
for id, buveine in buveines.items():
    out.write("buveines[%d] = {'buveine': '%s', 'id' : %d, 'tip_rusys': [%s], 'bud_rusys': [%s], 'anketa': '%s'};\n" %
              (id,
               buveine['id'],
               id,
               (len(buveine['tip_rusys']) > 0) and "" + ", ".join(buveine['tip_rusys']) + "" or ' ',
               (len(buveine['bud_rusys']) > 0) and "" + ", ".join(buveine['bud_rusys']) + "" or ' ',
               buveine['anketa']))

out.close()

