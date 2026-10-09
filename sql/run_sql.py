import sqlite3, re, pathlib
d = pathlib.Path(__file__).parent
con = sqlite3.connect(':memory:')
con.executescript((d/'schema.sql').read_text())
out = []
for i, q in enumerate([s for s in (d/'queries.sql').read_text().split(';') if 'SELECT' in s or 'WITH' in s], 1):
    cur = con.execute(q)
    cols = [c[0] for c in cur.description]
    out.append(f'-- Scenario {i} output\n' + ' | '.join(cols))
    out += [' | '.join(map(str, r)) for r in cur.fetchall()] + ['']
(d/'query_output.txt').write_text('\n'.join(out)); print('\n'.join(out))
