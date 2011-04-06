#!/usr/bin/env python

N_TEAMS = 17

for x in range(1,1+N_TEAMS):
    print """INSERT INTO teams SET number = %i, name = "n/a", robot_name = "n/a", college_name = "n/a"; """ % x
