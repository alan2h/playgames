/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "86c24040063b1b7dcd5b"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 1;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/apps-compiler/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(30)(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ({

/***/ 30:
/***/ (function(module, exports) {

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                var precio_enviar = '';\n                switch (forma_pago) {\n                    case 'efectivo':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'descuento':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'credito':\n                        precio_enviar = data.precio_credito;\n                        break;\n                    case 'debito':\n                        precio_enviar = data.precio_debito;\n                        break;\n                };\n                contador_tabla += 1;\n                calcular_total('1', data.id, precio_enviar);\n                $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\r\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\r\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n});\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    if (descuento != '0') {\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    } else {\n        var vuelto = parseFloat(pago) - parseFloat(total);\n    }\n    var representar = vuelto.toFixed(2);\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5Iiwic2VsZWNjaW9uX2FydGljdWxvIiwiaWQiLCJkZXNjcmlwY2lvbiIsIm1hcmNhIiwicnVicm8iLCJwcmVjaW9fdmVudGEiLCJwcmVjaW9fY3JlZGl0byIsInByZWNpb19kZWJpdG8iLCJwcmVjaW9fY29tcHJhIiwic3RvY2siLCJwcm92ZWVkb3IiLCJjYW50aWRhZCIsInByb21wdCIsInByZWNpb19lbnZpYXIiLCJjYWxjdWxhcl90b3RhbCIsIiQiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJ2ZW50YXMiLCJKU09OIiwic3RyaW5naWZ5IiwiZmVjaGEiLCJ2YWwiLCJpZF9zb2NpbyIsInBvcmNlbnRhamVfZGVzY3VlbnRvIiwicHJlY2lvX3ZlbnRhX3RvdGFsIiwiY3NyZm1pZGRsZXdhcmV0b2tlbiIsInN1Y2Nlc3MiLCJQTm90aWZ5IiwidGl0bGUiLCJ0ZXh0IiwiaHRtbCIsImVtcHR5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaWRfdmVudGEiLCJrZXlwcmVzcyIsImUiLCJ3aGljaCIsIm5vbWJyZSIsIm9iaiIsInB1c2giLCJjb25zb2xlIiwibG9nIiwicGFyc2VGbG9hdCIsInJlcGxhY2UiLCJyZXByZXNlbnRhciIsInRvRml4ZWQiLCJjYWxjdWxhcl90aXBvX3BhZ28iLCJmb3JtYV9wYWdvX3BhcmFtZXRybyIsInByb3AiLCJoaWRlIiwiZWxpbWluYXJfYXJ0aWN1bG8iLCJzcGxpY2UiLCJyZW1vdmUiLCJhZ3JlZ2FyX2NhbnRpZGFkIiwiY29udGFkb3IiLCJwcmVjaW8iLCJjYW50aWRhZF90YWJsYSIsInJvd3MiLCJjZWxscyIsIml0ZW0iLCJpbm5lckhUTUwiLCJwYXJzZUludCIsImNsaWNrIiwiZm9jdXNvdXQiLCJjYWxjdWxhcl92dWVsdG8iLCJrZXlDb2RlIiwicGFnbyIsImRlc2N1ZW50byIsImRlc2N1ZW50b190b3RhbCIsInZ1ZWx0byIsInJlcHJlc2VudGFyMiIsImNhbGN1bGFyX2F1bWVudG8iLCJwb3JjZW50YWplIiwiYXVtZW50byIsInRvdGFsX2F1bWVudGFkbyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDWSxJQUFJQSxRQUFRLEdBQVo7QUFDQSxJQUFJQyxzQkFBc0IsR0FBMUI7QUFDQSxJQUFJQyxZQUFZLEdBQWhCO0FBQ0EsSUFBSUMsaUJBQWlCLENBQXJCO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMscUJBQXFCLEVBQXpCO0FBQ0EsSUFBSUMsYUFBYSxFQUFqQjtBQUNQO0FBQ09DLFNBQVNDLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUNDLEtBQXZDLENBQTZDQyxPQUE3QyxHQUF1RCxNQUF2RDtBQUNBSCxTQUFTQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDQyxLQUF6QyxDQUErQ0MsT0FBL0MsR0FBeUQsTUFBekQ7QUFDUDtBQUNPSCxTQUFTQyxjQUFULENBQXdCLG1CQUF4QixFQUE2Q0MsS0FBN0MsQ0FBbURDLE9BQW5ELEdBQTZELE1BQTdEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0Isc0JBQXhCLEVBQWdEQyxLQUFoRCxDQUFzREMsT0FBdEQsR0FBZ0UsTUFBaEU7QUFDUDtBQUNPSCxTQUFTQyxjQUFULENBQXdCLGtCQUF4QixFQUE0Q0MsS0FBNUMsQ0FBa0RDLE9BQWxELEdBQTRELE1BQTVEOztBQUVBLElBQUlDLHFCQUFxQixVQUFTQyxFQUFULEVBQWFDLFdBQWIsRUFBMEJDLEtBQTFCLEVBQWlDQyxLQUFqQyxFQUF3Q0MsWUFB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bUJBQW1CLFlBQVU7QUFDN0I7QUFDQSxRQUFJQyxhQUFhakUsRUFBRSxnQkFBRixFQUFvQlksR0FBcEIsRUFBakI7QUFDQWxDLHlCQUFxQnVGLFVBQXJCO0FBQ0EsUUFBSUMsVUFBVS9CLFdBQVc3RCxLQUFYLElBQW9CZ0YsU0FBU1csVUFBVCxDQUFwQixHQUF5QyxHQUF2RDtBQUNBLFFBQUlFLGtCQUFrQmhDLFdBQVc3RCxLQUFYLElBQW9CNkQsV0FBVytCLE9BQVgsQ0FBMUM7QUFDQSxRQUFJN0IsY0FBYzhCLGdCQUFnQjdCLE9BQWhCLENBQXdCLENBQXhCLENBQWxCO0FBQ0F0QyxNQUFFLG1CQUFGLEVBQXVCcUIsSUFBdkIsQ0FBNEIsT0FBT2dCLFlBQVluQyxRQUFaLEdBQXVCa0MsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsR0FBcEMsQ0FBbkM7QUFDSCxDQVJEIiwiZmlsZSI6IjMwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLSB2YXJpYWJsZXMgZ2xvYmFsZXMgLS0tLSAqL1xyXG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwLjA7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbF9jb25fZGVzY3VlbnRvID0gMC4wO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0YWRvID0gMC4wO1xyXG4gICAgICAgICAgICB2YXIgY29udGFkb3JfdGFibGEgPSAwO1xyXG4gICAgICAgICAgICB2YXIgY3JlZGl0b19wb3JjZW50YWplID0gMDtcclxuICAgICAgICAgICAgdmFyIGFydGljdWxvc192ZW5kaWRvcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgZm9ybWFfcGFnbyA9ICcnO1xyXG4gICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBlZmVjdGl2byAtLS0tICovXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcGFnbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgY3LDqWRpdG8gLS0tLSAqL1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBkZXNjdWVudG8gLS0tLSAqL1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2Rlc2N1ZW50bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7ICBcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxlY2Npb25fYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgZGVzY3JpcGNpb24sIG1hcmNhLCBydWJybywgcHJlY2lvX3ZlbnRhLCBwcmVjaW9fY3JlZGl0bywgcHJlY2lvX2RlYml0bywgcHJlY2lvX2NvbXByYSwgc3RvY2ssIHByb3ZlZWRvcil7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZWNpb19lbnZpYXIgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZXNjdWVudG8nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX2NyZWRpdG87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fZGViaXRvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbChjYW50aWRhZCwgaWQsIHByZWNpb19lbnZpYXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgKyBjYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkZXNjcmlwY2lvbiArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvdGQ+JyArICAnPHRkPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGNhbnRpZGFkICsgJywnICsgcHJlY2lvX2VudmlhciArJylcIiAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3VhcmRhcl9jb21wcmEgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdG90YWxfY29uX2Rlc2N1ZW50byA9IHJlc3VsdGFkbztcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3ZlbnRhcy9hamF4L3ZlbnRhcy9hbHRhLycsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVudGFzOiBKU09OLnN0cmluZ2lmeShhcnRpY3Vsb3NfdmVuZGlkb3MpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWNoYTogJCgnI2lkX2ZlY2hhJykudmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF9zb2NpbzogJCgnI2lkX3NvY2lvJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcmNlbnRhamVfZGVzY3VlbnRvOiAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG86IHRvdGFsX2Nvbl9kZXNjdWVudG8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb192ZW50YV90b3RhbDogdG90YWwudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWFfcGFnbzogZm9ybWFfcGFnbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplOiBjcmVkaXRvX3BvcmNlbnRhamUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzcmZtaWRkbGV3YXJldG9rZW46ICQoXCJpbnB1dFtuYW1lPWNzcmZtaWRkbGV3YXJldG9rZW5dXCIpLnZhbCgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUE5vdGlmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaXN0ZW1hJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLnN1Y2Nlc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgMC4wJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zJykuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy92ZW50YXMvdGlja2V0LycgKyBkYXRhLmlkX3ZlbnRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAvKiAtLS0tIGZ1bmNpb24gcGFyYSBlbCBsZWN0b3IgZGUgY29kaWdvIGRlIGJhcnJhcyAtLS0gKi9cclxuICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKXtcclxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvY29kaWdvL2FydGljdWxvLycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvZGlnb19hcnRpY3Vsbyc6ICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykudmFsKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZXNjdWVudG8nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjcmVkaXRvJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX2NyZWRpdG87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb19kZWJpdG87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKCcxJywgZGF0YS5pZCwgcHJlY2lvX2Vudmlhcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEubm9tYnJlICsgJzwvdGQ+JyArICc8dGQ+ICQnICsgcHJlY2lvX2VudmlhclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD48YSBvbmNsaWNrPVwiYWdyZWdhcl9jYW50aWRhZCgnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuaWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICsgJ2NsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9hPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4teHNcIj48aSBjbGFzcz1cImZhIGZhLXRyYXNoXCI+PC9pPiA8L2E+PC90ZD48L3RyPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xyXG5cclxuICAgIC8qIC0tLS0tLS0tLS0gRXN0YSBmdW5jaW9uIGNhbGN1bGEgZWwgdG90YWwgeSBsYSBjb2xvY2FcclxuICAgICoqKiAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXHJcbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90b3RhbCA9IGZ1bmN0aW9uKGNhbnRpZGFkLCBpZCwgcHJlY2lvX3ZlbnRhKXtcclxuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqWydpZCddID0gaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqWydjYW50aWRhZCddID0gY2FudGlkYWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnB1c2gob2JqKTtcclxuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcmVjaW9fdmVudGEpXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fdmVudGEudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXHJcbiAgICAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXHJcblxyXG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cclxuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3RpcG9fcGFnbyA9IGZ1bmN0aW9uKGZvcm1hX3BhZ29fcGFyYW1ldHJvKXtcclxuICAgICAgICAgICAgICAgICQoJyNpZF9mZWNoYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcclxuICAgICAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xyXG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9idXNjYXInKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XHJcbiAgICAgICAgICAgICAgICAkKCcjYnVzY2FyX3NvY2lvJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xyXG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9ndWFyZGFyX2NvbXByYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcclxuICAgICAgICAgICAgICAgIC8vIFBvbmdvIGRpc2FibGVkIGxhIHNlbGVjY2lvbiBkZSBsYSBmb3JtYSBkZSBwYWdvXHJcbiAgICAgICAgICAgICAgICBmb3JtYV9wYWdvID0gZm9ybWFfcGFnb19wYXJhbWV0cm87XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnZWZlY3Rpdm8nKXtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBlZmVjdGl2byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3NcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3Z1ZWx0bycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdkZXNjdWVudG8nKXtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBkZXNjdWVudG8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIHBhZ29zIHkgZGVzY3VlbnRvXHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2Rlc2N1ZW50bycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdjcmVkaXRvJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgY3JlZGl0byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgYXVtZW50b3NcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZWZlY3Rpdm8nKXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZWZlY3Rpdm8nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2NyZWRpdG8nKXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0bycpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGViaXRvJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2RlYml0bycpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGVzY3VlbnRvJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAvKiAtLS0tIGRldGVjdGFyIHF1ZSB0aXBvIGRlIHBhZ28gZXMgLS0tLSAqL1xyXG5cclxuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xyXG4gICAgICAgICAgICB2YXIgZWxpbWluYXJfYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgY2FudGlkYWQsIHByZWNpb19lbnZpYXIpe1xyXG5cclxuICAgICAgICAgICAgICAgIGFydGljdWxvc192ZW5kaWRvcy5zcGxpY2UoaWQsIDEpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3RyXycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0b3RhbCAtPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb19lbnZpYXIudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWwudG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xyXG5cclxuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cclxuICAgICAgICAgICAgdmFyIGFncmVnYXJfY2FudGlkYWQgPSBmdW5jdGlvbihjb250YWRvciwgaWQsIHByZWNpbyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWRfdGFibGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MID0gcGFyc2VJbnQoY2FudGlkYWRfdGFibGEpICsgcGFyc2VJbnQoY2FudGlkYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cclxuXHJcbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSB2dWVsdG9zIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cclxuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5jbGljayggZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcwJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS52YWwoJyAnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5jbGljayggZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCkgPT0gJzAnKXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcgJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgLyogLS0tIHBvciBjYWRhIGV2ZW50byBjYWxjdWxhciBlbCB2dWVsdG8gLS0tICovXHJcbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BhZ28nKS52YWwoKSA9PSAnJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS52YWwoJzAnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCkgPT0gJycpe1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoJzAnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3Z1ZWx0byA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGVmZWN0aXZvIGVsIHZ1ZWx0byAtLS0tLSAqL1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwYWdvID0gJCgnI2lkX3BhZ28nKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIHZhciBkZXNjdWVudG8gPSAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVzY3VlbnRvICE9ICcwJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvKSkgLyAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IHBhcnNlRmxvYXQodG90YWwpIC0gcGFyc2VGbG9hdChkZXNjdWVudG9fdG90YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIyID0gcmVzdWx0YWRvLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZ1ZWx0byA9IHBhcnNlRmxvYXQocGFnbykgLSBwYXJzZUZsb2F0KHRvdGFsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB2dWVsdG8udG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdnVlbHRvJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSB2dWVsdG9zIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cclxuICAgXHJcbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSBhdW1lbnRvIHNpIGVzIGNyZWRpdG8gLS0tLSAqL1xyXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmNsaWNrKCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wb3JjZW50YWplJykudmFsKCkgPT0gJzAnKXtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgnICcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIC8qIC0tLSBwb3IgY2FkYSBldmVudG8gY2FsY3VsYXIgZWwgdnVlbHRvIC0tLSAqL1xyXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykua2V5cHJlc3MoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfYXVtZW50byA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGNyZWRpdG8gZWwgYXVtZW50byAtLS0tLSAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcmNlbnRhamUgPSAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplID0gcG9yY2VudGFqZTtcclxuICAgICAgICAgICAgICAgIHZhciBhdW1lbnRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKiBwYXJzZUludChwb3JjZW50YWplKS8xMDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxfYXVtZW50YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKyBwYXJzZUZsb2F0KGF1bWVudG8pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWxfYXVtZW50YWRvLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0b190b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xyXG4gICAgICAgICAgICB9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });