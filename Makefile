BUILDDIR=build
JQUERY=jquery-1.8.3.min.js

# default build
default:
	$(MAKE) standard
	$(MAKE) build

all:
	$(MAKE) clean
	$(MAKE) standard
	$(MAKE) build
	$(MAKE) package

# define "local" build piece here
local:
	$(MAKE) standard
	$(MAKE) buildcss
	
# package built files together
package: default
	rm -rf $(BUILDDIR)/
	mkdir $(BUILDDIR)/
	cp -f css/style.css $(BUILDDIR)/style.css
	cp -r css/img $(BUILDDIR)/img
	cp -f php/az4db.php $(BUILDDIR)/
	(cd js && node ../modules/r.js/dist/r.js -o name=../modules/almond/almond wrap=true include=az4db out=../$(BUILDDIR)/az4db.js)
	(cd $(BUILDDIR) && cat ../js/scripts/${JQUERY} az4db.js >> az4db-jquery.js )
	cp _test.html $(BUILDDIR)/index.html
	cp css/loader.gif $(BUILDDIR)
	cp css/sprite.png $(BUILDDIR)
	
# remove all built files, leaving just source code
clean:
	rm -f css/style.css
	rm -rf css/img
	rm -rf css/sprite.png
	rm -rf css/tmp
	rm -rf $(BUILDDIR)/
	rm -f js/scripts/require-jquery.js
	rm -f js/scripts/jquery.imagesloaded.js
	rm -f js/scripts/bootstrap.min.js
	rm -f js/version.js

##### INTERNAL MAKE FUNCTIONS #####
# features always employed
standard:
	command -v npm >/dev/null 2>&1 || ( echo "NPM not found :( NPM is required for install! http://nodejs.org/" >&2 && exit 1 );
	npm install
	git submodule init
	git submodule update

# basic build, build external pieces then local ones
build:
	$(MAKE) buildext
	$(MAKE) local

# build external modules together
buildext:
	$(MAKE) buildextjs

# compile all CSS
buildcss:
	cp -r modules/bootstrap/less css/tmp
	node spriteBuild.js
	cat css/custom.less css/sprite.css >> css/tmp/bootstrap.less
	rm -f css/sprite.css
	(cd css/tmp/ && echo ".az4db {" > style.css && lessc bootstrap.less >> style.css && echo "}" >> style.css)
	(cd css/tmp/ && ../../node_modules/less/bin/lessc style.css > ../style.css)
	(cd css/ && sed -i 's|.az4db body|.az4db|g' style.css)
	(cd css/ && cat force_scrollbars.css style.css > tmp.css && mv tmp.css style.css)
	rm -rf css/tmp/
	(cd css/ && sed -i 's|/\*.*\*/||g' style.css)
	rm -rf css/img
	cp -r modules/bootstrap/img css/img

# build external JavaScript (jQuery)
buildextjs:
	cat modules/requirejs/require.js js/scripts/${JQUERY} >> js/scripts/require-jquery.js
	cp modules/bootstrap/docs/assets/js/bootstrap.min.js js/scripts
	cp modules/imagesloaded/jquery.imagesloaded.js js/scripts
	node versionBuild.js
