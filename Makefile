BUILDDIR="build"

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
package: default
	@rm -rf $(BUILDDIR)/
	@mkdir $(BUILDDIR)/
	@cp -f css/style.css $(BUILDDIR)/style.css
	@cp -r css/img $(BUILDDIR)/img
	@cp -f php/az4db.php $(BUILDDIR)/
	@(cd js && node ../modules/r.js/dist/r.js -o name=../modules/almond/almond wrap=true include=az4db out=../$(BUILDDIR)/az4db.js >/dev/null)
	@(cd $(BUILDDIR) && cat ../modules/jquery/dist/jquery.min.js az4db.js >> az4db-jquery.js )
	@cp _test.html $(BUILDDIR)/index.html
	@cp css/loader.gif $(BUILDDIR)
	@cp css/sprite.png $(BUILDDIR)
	
# remove all built files, leaving just source code
clean:
	@rm -f css/style.css
	@rm -rf css/img
	@rm -rf css/sprite.png
	@rm -rf $(BUILDDIR)/
	@rm -f js/require-jquery.js
	@rm -f js/jquery.imagesloaded.js
	@rm -f js/bootstrap.min.js

##### INTERNAL MAKE FUNCTIONS #####
# features always employed
standard:
	@command -v npm >/dev/null 2>&1 || ( echo "NPM not found :( NPM is required for install! http://nodejs.org/" >&2 && exit 1 );
	@npm install
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
	@node spriteBuild.js >/dev/null
	@cat css/custom.less css/sprite.css >> css/tmp/bootstrap.less
	@rm -f css/sprite.css
	@(cd css/tmp/ && echo ".az4db {" > style.css && lessc bootstrap.less >> style.css && echo "}" >> style.css)
	@(cd css/tmp/ && ../../node_modules/less/bin/lessc style.css > ../style.css)
	@(cd css/ && sed -i 's|.az4db body|.az4db|g' style.css)
	@(cd css/ && cat force_scrollbars.css style.css > tmp.css && mv tmp.css style.css)
	@rm -rf css/tmp/
	@(cd css/ && sed -i 's|/\*.*\*/||g' style.css)
	@rm -rf css/img
	@cp -r modules/bootstrap/img css/img

# build external JavaScript (jQuery)
buildextjs:
	@(cd modules/jquery && npm install && node_modules/grunt/bin/grunt)
	@cat modules/requirejs/require.js modules/jquery/dist/jquery.min.js >> js/require-jquery.js
	@cp modules/bootstrap/docs/assets/js/bootstrap.min.js js/
	@cp modules/imagesloaded/jquery.imagesloaded.js js/
