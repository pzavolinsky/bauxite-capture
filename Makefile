.PHONY: all run loop xpi
all: run

EXT:=bauxite-capture
SDK:=addon-sdk-1.17
FILES:=$(shell find $(EXT) -name '*.js' -o -name '*.html')
XPI:=$(EXT)/$(EXT).xpi
CFX:=cd $(SDK); . bin/activate; cd ../$(EXT); cfx

$(XPI): $(FILES)
	@$(CFX) xpi
	wget --post-file=$@ http://localhost:8888/; true

xpi: $(XPI)

run:
	@$(CFX) run

loop:
	@(firefox -P ext -no-remote &); \
	while true; do $(MAKE) --no-print-directory xpi; sleep 5; done
