BUILD_CHROME=build_chrome/katakana2romaji
BUILD_FIREFOX=build_firefox

all: firefox chrome-prepare

firefox:
	rm -rf $(BUILD_FIREFOX)
	mkdir -p $(BUILD_FIREFOX)
	cp -a package.json index.js data $(BUILD_FIREFOX)
	( cd $(BUILD_FIREFOX) && jpm xpi )

chrome-prepare:
	rm -rf $(BUILD_CHROME)
	mkdir -p $(BUILD_CHROME)
	cp -a manifest.json data _locales $(BUILD_CHROME)
