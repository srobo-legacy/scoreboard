all: knockouts_diagram.png

knockouts_diagram.svg: knockouts_template.svg finals.csv
	./utils/finals-munge finals.csv knockouts_template.svg knockouts_diagram.svg

knockouts_diagram.png: knockouts_diagram.svg
	inkscape -e knockouts_diagram.png knockouts_diagram.svg

.PHONY: clean

clean:
	-rm -f knockouts_diagram.png
