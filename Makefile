BUILDDIR="az4db"

# default build
default:
	@$(MAKE) standard >/dev/null
	@$(MAKE) build >/dev/null

all:
	@$(MAKE) clean >/dev/null
	@$(MAKE) standard >/dev/null
	@$(MAKE) build >/dev/null
	@$(MAKE) package >/dev/null

# define "local" build piece here
local:
	@$(MAKE) standard >/dev/null
	@$(MAKE) buildcss >/dev/null
	
# package built files together
package:
	@rm -rf $(BUILDDIR)/
	@mkdir $(BUILDDIR)/
	@cp -f css/style.css $(BUILDDIR)/style.css
	@cp -r css/img $(BUILDDIR)/img
	@cp -f php/az4db.php $(BUILDDIR)/
	@(cd js && node ../modules/r.js/dist/r.js -o name=../modules/almond/almond wrap=true include=az4db excludeShallow=jquery.min out=../$(BUILDDIR)/az4db.js >/dev/null)
	@(cd js && node ../modules/r.js/dist/r.js -o name=../modules/almond/almond wrap=true include=az4db out=../$(BUILDDIR)/az4db-jquery.js >/dev/null)
	@cp _test.html $(BUILDDIR)/test.html
	
# remove all built files, leaving just source code
clean:
	@rm -f css/style.css
	@rm -rf css/img
	@rm -rf $(BUILDDIR)/
	@rm -f js/jquery.min.js
	@rm -f js/bootstrap.min.js
	@rm -f js/require.js

##### INTERNAL MAKE FUNCTIONS #####
# features always employed
standard:
	@git submodule init
	@git submodule update

# basic build, build external pieces then local ones
build:
	@$(MAKE) buildext >/dev/null
	@$(MAKE) local >/dev/null

# build external modules together
buildext:
	@$(MAKE) buildextjs >/dev/null

# compile all CSS
buildcss:
	@cp -r modules/bootstrap/less css/tmp
	@cat css/variables.less >> css/tmp/variables.less
	@cat css/bootswatch.less >> css/tmp/bootstrap.less
	@cat css/custom.less >> css/tmp/bootstrap.less
	@(cd css/tmp/ && echo ".az4db {" > style.css && lessc bootstrap.less >> style.css && echo "}" >> style.css)
	@(cd css/tmp/ && lessc style.css > ../style.css)
	@(cd css/ && sed -i 's|.az4db body|.az4db|g' style.css)
	@rm -rf css/tmp/
	@(cd css/ && sed -i 's|/\*.*\*/||g' style.css)
	@rm -rf css/img
	@cp -r modules/bootstrap/img css/img

# build external JavaScript (jQuery)
buildextjs:
	@(cd modules/jquery && npm install && node_modules/grunt/bin/grunt submodules && node_modules/grunt/bin/grunt selector build:*:* lint min dist:* compare_size)
	@cp modules/jquery/dist/jquery.min.js js/
	@cp modules/bootstrap/docs/assets/js/bootstrap.min.js js/
