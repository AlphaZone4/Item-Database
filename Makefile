BUILDDIR=build
JQUERY=jquery-1.8.3.min.js

##### Standard make functions, either just make or make all
# default build
default: standard
	$(MAKE) build

all: standard
	$(MAKE) clean
	$(MAKE) build
	$(MAKE) package

##### Use these only if you know what you're doing #####
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

# package built files together
package:
	rm -rf $(BUILDDIR)/
	mkdir $(BUILDDIR)/
	cp -f css/style.css $(BUILDDIR)/style.css
	cp -r css/img $(BUILDDIR)/img
	cp -f php/az4db.php $(BUILDDIR)/
	cp -f modules/JSON-js/json2.js $(BUILDDIR)/
	(cd js && node ../modules/r.js/dist/r.js -o name=../modules/almond/almond wrap=true include=az4db out=../$(BUILDDIR)/az4db.js)
	(cd $(BUILDDIR) && cat ../modules/easyXDM/work/easyXDM.js ../js/scripts/${JQUERY} az4db.js >> az4db-jquery.js )
	cp _test.html $(BUILDDIR)/index.html
	cp css/loader.gif $(BUILDDIR)
	cp css/sprite.png $(BUILDDIR)
	
##### INTERNAL MAKE FUNCTIONS #####
# features always employed
standard:
	command -v npm >/dev/null 2>&1 || ( echo "NPM not found :( NPM is required for install! http://nodejs.org/" >&2 && exit 1 );
	npm install
	git submodule init
	git submodule update

# basic build, build external pieces then local ones
build:
	$(MAKE) buildcss
	$(MAKE) buildjs

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
buildjs:
	cat modules/requirejs/require.js js/scripts/${JQUERY} >> js/scripts/require-jquery.js
	cp modules/bootstrap/docs/assets/js/bootstrap.min.js js/scripts
	cp modules/imagesloaded/jquery.imagesloaded.js js/scripts
	node versionBuild.js
	(cd modules/easyXDM && ./build.sh)
