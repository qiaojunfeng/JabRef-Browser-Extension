/*
    ***** BEGIN LICENSE BLOCK *****
    
    Copyright © 2011 Center for History and New Media
                     George Mason University, Fairfax, Virginia, USA
                     http://zotero.org
    
    This file is part of Zotero.
    
    Zotero is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    Zotero is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    
    You should have received a copy of the GNU Affero General Public License
    along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
    
    ***** END LICENSE BLOCK *****
*/

WECHAT_TRANSLATOR_METADATA = {
	"translatorID": "9660c625-e906-488d-ac00-5e96587a545a",
	"label": "WeChat",
	"creator": "zsx",
	"target": "https?://mp.weixin.qq.com/s/.*",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2020-02-13 08:26:04"
}
WECHAT_TRANSLATOR = `{
	"translatorID": "9660c625-e906-488d-ac00-5e96587a545a",
	"label": "WeChat",
	"creator": "zsx",
	"target": "https?://mp.weixin.qq.com/s/.*",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2020-02-13 08:26:04"
}

function doWeb(doc, url) {
	scrape(doc, url)
}


function detectWeb(doc, url) {
	return 'blogPost'
}


function scrape(doc, url) {
	var translator = Zotero.loadTranslator('web');

	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	// translator.setDocument(doc)
	
	translator.setHandler('itemDone', function (obj, item) {
		if (item.attachments && item.attachments[0] && item.attachments[0].document) {
			var images = item.attachments[0].document.querySelectorAll('img[data-src]')
			Array.from(images).forEach(image => {
				image.setAttribute('src', image.getAttribute('data-src'))
			})
		}
		var blogTitle = ZU.xpathText(doc, '//a[@id="js_name"]')
		var authorName = ZU.xpathText(doc, '//span[@class="rich_media_meta rich_media_meta_text"]')
		var data = ZU.xpathText(doc, '//*[@id="meta_content"]')

		item.blogTitle = "微信公众号：" + ZU.trimInternal(blogTitle)
		var timestamp = ZU.xpathText(doc, '//script').match(/ct = "(.*?)"/)[1]
		item.title = ZU.xpathText(doc, '//h2[@class="rich_media_title"]')
		item.date = ZU.strToISO(new Date(timestamp * 1000).toISOString())
		item.creators = []
		if (authorName === null) {
			item.creators.push(ZU.cleanAuthor(blogTitle, "author"))
		} else {
			item.creators.push(ZU.cleanAuthor(authorName, "author"))
		}
		delete item.publicationTitle
		item.complete()
	})

	translator.getTranslatorObject(function(trans) {
		trans.itemType = "blogPost"
		trans.doWeb(doc, url)
	})

}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://mp.weixin.qq.com/s/qIkik6OWQQ4ue-giIpVL1w",
		"items": [
			{
				"itemType": "blogPost",
				"title": "国务院任免国家工作人员",
				"creators": [
					{
						"firstName": "",
						"lastName": "新华社",
						"creatorType": "author"
					}
				],
				"date": "2020-02-13",
				"blogTitle": "微信公众号：新华社",
				"url": "http://mp.weixin.qq.com/s?__biz=MzA4NDI3NjcyNA==&mid=2649503900&idx=1&sn=06c44b265e7e50e436484307ad753a8f&chksm=87f13c07b086b511d93276a62c95733cd58e307b60a4391a80149611f3169c1ccef9bb07694f#rd",
				"attachments": [
					{
						"title": "Snapshot"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://mp.weixin.qq.com/s/ZLGuwQRb19lqyVGD7BDPrw",
		"items": [
			{
				"itemType": "blogPost",
				"title": "夜读 | 熬得住才能出彩，熬不住只能出局",
				"creators": [
					{
						"firstName": "",
						"lastName": "明心的",
						"creatorType": "author"
					}
				],
				"date": "2020-02-12",
				"abstractNote": "将苦难化为成长",
				"blogTitle": "微信公众号：新华社",
				"url": "http://mp.weixin.qq.com/s?__biz=MzA4NDI3NjcyNA==&mid=2649503848&idx=1&sn=b9577f26cfce63c089757c93270ae92a&chksm=87f13cf3b086b5e5a904dd19131bfce6842315296f39755ce5f9837e02a89708ec9ec0ebfd75#rd",
				"attachments": [
					{
						"title": "Snapshot"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
`

Zotero.Repo = new function() {
	var _nextCheck;
	var _timeoutID;
	const infoRe = /^\s*{[\S\s]*?}\s*?[\r\n]/;

	this.SOURCE_ZOTERO_STANDALONE = 1;
	this.SOURCE_REPO = 2;

	/**
	 * Try to retrieve translator metadata from Zotero Standalone and initialize repository check
	 * timer
	 */
	this.init = new function() {
		var promise;
		return function() {
			// get time of next check
			_nextCheck = Zotero.Prefs.get("connector.repo.lastCheck.localTime") +
				ZOTERO_CONFIG.REPOSITORY_CHECK_INTERVAL * 1000;

			if (promise) return promise;
			// update from standalone, but only cascade to repo if we are overdue
			// TODO: make update/cascade to repo explicit
			promise = _updateFromStandalone(_nextCheck <= Date.now());
			return promise.catch(() => 0).then(() => promise = null);
		}
	};

	/**
	 * Force updating translators
	 */
	var update = this.update = function(reset) {
		return _updateFromStandalone(true, reset);
	};

	/**
	 * Get translator code from repository
	 * @param {String} translatorID ID of the translator to retrieve code for
	 */
	this.getTranslatorCode = Zotero.Promise.method(function(translatorID, debugMode) {
		// try standalone
		return Zotero.Connector.callMethod("getTranslatorCode", {
			"translatorID": translatorID
		}).then(function(result) {
			return Zotero.Promise.all(
				[
					_haveCode(result, translatorID),
					Zotero.Repo.SOURCE_ZOTERO_STANDALONE
				]
			)
		}, function() {
			// Don't fetch from repo in debug mode
			if (debugMode) {
				return [false, Zotero.Repo.SOURCE_ZOTERO_STANDALONE]
			}
			
			if (translatorID == WECHAT_TRANSLATOR_METADATA["translatorID"]) {
                var responseText;
                responseText = WECHAT_TRANSLATOR;
                return Zotero.Promise.all([
					_haveCode(responseText, translatorID),
					Zotero.Repo.SOURCE_REPO
				]);
            }

			// then try repo
			let url = `${ZOTERO_CONFIG.REPOSITORY_URL}code/${translatorID}?version=${Zotero.version}`;
			// TODO: reject promise on failure (needs update to zotero/zotero)
			return Zotero.HTTP.request("GET", url).then(function(xmlhttp) {
				return Zotero.Promise.all([
					_haveCode(xmlhttp.responseText, translatorID),
					Zotero.Repo.SOURCE_REPO
				]);
			}, function() {
				return Zotero.Promise.all([
					_haveCode(false, translatorID),
					Zotero.Repo.SOURCE_REPO
				]);
			});
		});
	});

	/**
	 * Called when code has been retrieved from standalone or repo
	 */
	function _haveCode(code, translatorID) {
		if (!code) {
			Zotero.logError(new Error("Code could not be retrieved for " + translatorID));
			return false;
		}

		code = Zotero.Translator.replaceDeprecatedStatements(code);

		var m = infoRe.exec(code);
		if (!m) {
			Zotero.logError(new Error("Invalid or missing translator metadata JSON object for " + translatorID));
			return false;
		}

		try {
			var metadata = JSON.parse(m[0]);
		} catch (e) {
			Zotero.logError(new Error("Invalid or missing translator metadata JSON object for " + translatorID));
			return false;
		}

		var translator = Zotero.Translators.getWithoutCode(translatorID);

		if (metadata.lastUpdated !== translator.lastUpdated) {
			if (Zotero.Date.sqlToDate(metadata.lastUpdated) > Zotero.Date.sqlToDate(translator.lastUpdated)) {
				Zotero.debug("Repo: Retrieved code for " + metadata.label + " newer than stored metadata; updating");
				Zotero.Translators.update([metadata]);
			} else {
				Zotero.debug("Repo: Retrieved code for " + metadata.label + " older than stored metadata; not caching");
			}
		}
		return code;
	}

	/**
	 * Retrieve translator metadata from Zotero Standalone
	 * @param {Boolean} [tryRepoOnFailure] If true, run _updateFromRepo() if standalone cannot be
	 *                                     contacted
	 */
	function _updateFromStandalone(tryRepoOnFailure, reset) {
		return Zotero.Connector.callMethod("getTranslators", {}).then(function(result) {
			// Standalone always returns all translators without .deleted property
			_handleResponse(result, true);
			return !!result;
		}, function() {
			if (tryRepoOnFailure) {
				return _updateFromRepo(reset);
			} else {
				throw new Error("Failed to update translator metadata");
			}
		});
	}

	/**
	 * Retrieve metadata from repository
	 */
	function _updateFromRepo(reset) {
		var url = ZOTERO_CONFIG.REPOSITORY_URL + "metadata?version=" + Zotero.version + "&last=" +
			(reset ? "0" : Zotero.Prefs.get("connector.repo.lastCheck.repoTime"));
		return Zotero.HTTP.request('GET', url).then(function(xmlhttp) {
			var date = xmlhttp.getResponseHeader("Date");
			Zotero.Prefs.set("connector.repo.lastCheck.repoTime", Math.floor(Date.parse(date) / 1000));
			_handleResponse(JSON.parse(xmlhttp.responseText), reset);
			return true;
		}, function() {
			_handleResponse(false, reset);
			return false;
		});
	}

	/**
	 * Handle response from Zotero Standalone or repository and set timer for next update
	 */
	function _handleResponse(result, reset) {
		// set up timer
		var now = Date.now();
        
        result.push(WECHAT_TRANSLATOR_METADATA)

		if (result) {
			Zotero.Translators.update(result, reset);
			Zotero.Prefs.set("connector.repo.lastCheck.localTime", now);
			Zotero.debug("Repo: Check succeeded");
		} else {
			Zotero.debug("Repo: Check failed");
		}

		if (result || _nextCheck <= now) {
			// if we failed a scheduled check, then use retry interval
			_nextCheck = now + (result ?
				ZOTERO_CONFIG.REPOSITORY_CHECK_INTERVAL :
				ZOTERO_CONFIG.REPOSITORY_RETRY_INTERVAL) * 1000;
		} else if (_timeoutID) {
			// if we didn't fail a scheduled check and another is already scheduled, leave it
			return;
		}

		// remove old timeout and create a new one
		if (_timeoutID) clearTimeout(_timeoutID);
		var nextCheckIn = (_nextCheck - now + 2000);
		_timeoutID = setTimeout(update, nextCheckIn);
		Zotero.debug("Repo: Next check in " + nextCheckIn);
	}
}
