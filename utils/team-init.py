#!/usr/bin/env python
import holes

for x in range(1,1+holes.MAX_TEAM_N):
    if x in holes.holes:
        continue

    print """INSERT INTO teams SET number = %i, name = "n/a", robot_name = "n/a", college_name = "n/a"; """ % x
