import csv
out = open("kriterijai.js", "wt")
spc_rd = csv.reader(open('kriterijai.csv', 'rb'), delimiter='\t', quotechar="\"")

out.write("var kriterijai = [];\n");
line = 0
for row in spc_rd:
    line += 1
    if line <= 1:
        continue

    row[1:] = map(lambda x: int(x) if x != '-' else 0, row[1:])
    out.write("kriterijai['%s'] = {'BudRusys': %d, 'TipRusys': %d,"
              "'BudNeMedzRusys': %d, 'TipNeMedzRusys': %d,"
              "'TipMedzRusys': %d, 'BudZolRusys': %d, 'TipZolRusys': %d}; \n" % tuple(row))

out.close()
