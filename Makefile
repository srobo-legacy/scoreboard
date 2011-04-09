knockouts_diagram.png: knockouts_diagram.svg
	inkscape -e knockouts_diagram.png knockouts_diagram.svg

.PHONY: clean

clean:
	-rm -f knockouts_diagram.png
