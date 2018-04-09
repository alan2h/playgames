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
/******/ 	var hotCurrentHash = "c2a3907da874fce6a381"; // eslint-disable-line no-unused-vars
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

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_compra, stock, proveedor) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_venta;\n                break;\n            case 'debito':\n                precio_enviar = precio_venta;\n                break;\n        };\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td>' + marca + '</td>' + '<td>' + rubro + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td>' + stock + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                var precio_enviar = '';\n                switch (forma_pago) {\n                    case 'efectivo':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'descuento':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'credito':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'debito':\n                        precio_enviar = data.precio_venta;\n                        break;\n                };\n                contador_tabla += 1;\n                calcular_total('1', data.id, precio_enviar);\n                $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.descripcion + '</td>' + '<td>' + data.marca + '</td>' + '<td>' + data.rubro + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td>' + data.stock + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n});\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    if (descuento != '0') {\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    } else {\n        var vuelto = parseFloat(pago) - parseFloat(total);\n    }\n    var representar = vuelto.toFixed(2);\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5Iiwic2VsZWNjaW9uX2FydGljdWxvIiwiaWQiLCJkZXNjcmlwY2lvbiIsIm1hcmNhIiwicnVicm8iLCJwcmVjaW9fdmVudGEiLCJwcmVjaW9fY3JlZGl0byIsInByZWNpb19jb21wcmEiLCJzdG9jayIsInByb3ZlZWRvciIsImNhbnRpZGFkIiwicHJvbXB0IiwicHJlY2lvX2VudmlhciIsImNhbGN1bGFyX3RvdGFsIiwiJCIsImFmdGVyIiwidG9TdHJpbmciLCJndWFyZGFyX2NvbXByYSIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInZlbnRhcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJmZWNoYSIsInZhbCIsInBvcmNlbnRhamVfZGVzY3VlbnRvIiwicHJlY2lvX3ZlbnRhX3RvdGFsIiwiY3NyZm1pZGRsZXdhcmV0b2tlbiIsInN1Y2Nlc3MiLCJQTm90aWZ5IiwidGl0bGUiLCJ0ZXh0IiwiaHRtbCIsImVtcHR5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaWRfdmVudGEiLCJrZXlwcmVzcyIsImUiLCJ3aGljaCIsIm9iaiIsInB1c2giLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsInJlcHJlc2VudGFyIiwidG9GaXhlZCIsImNhbGN1bGFyX3RpcG9fcGFnbyIsImZvcm1hX3BhZ29fcGFyYW1ldHJvIiwicHJvcCIsImhpZGUiLCJlbGltaW5hcl9hcnRpY3VsbyIsInNwbGljZSIsInJlbW92ZSIsImFncmVnYXJfY2FudGlkYWQiLCJjb250YWRvciIsInByZWNpbyIsImNhbnRpZGFkX3RhYmxhIiwicm93cyIsImNlbGxzIiwiaXRlbSIsImlubmVySFRNTCIsInBhcnNlSW50IiwiY2xpY2siLCJmb2N1c291dCIsImNhbGN1bGFyX3Z1ZWx0byIsImtleUNvZGUiLCJwYWdvIiwiZGVzY3VlbnRvIiwiZGVzY3VlbnRvX3RvdGFsIiwidnVlbHRvIiwicmVwcmVzZW50YXIyIiwiY2FsY3VsYXJfYXVtZW50byIsInBvcmNlbnRhamUiLCJhdW1lbnRvIiwidG90YWxfYXVtZW50YWRvIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNZLElBQUlBLFFBQVEsR0FBWjtBQUNBLElBQUlDLHNCQUFzQixHQUExQjtBQUNBLElBQUlDLFlBQVksR0FBaEI7QUFDQSxJQUFJQyxpQkFBaUIsQ0FBckI7QUFDQSxJQUFJQyxxQkFBcUIsQ0FBekI7QUFDQSxJQUFJQyxxQkFBcUIsRUFBekI7QUFDQSxJQUFJQyxhQUFhLEVBQWpCO0FBQ1A7QUFDT0MsU0FBU0MsY0FBVCxDQUF3QixhQUF4QixFQUF1Q0MsS0FBdkMsQ0FBNkNDLE9BQTdDLEdBQXVELE1BQXZEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNDLEtBQXpDLENBQStDQyxPQUEvQyxHQUF5RCxNQUF6RDtBQUNQO0FBQ09ILFNBQVNDLGNBQVQsQ0FBd0IsbUJBQXhCLEVBQTZDQyxLQUE3QyxDQUFtREMsT0FBbkQsR0FBNkQsTUFBN0Q7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixzQkFBeEIsRUFBZ0RDLEtBQWhELENBQXNEQyxPQUF0RCxHQUFnRSxNQUFoRTtBQUNQO0FBQ09ILFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLEVBQTRDQyxLQUE1QyxDQUFrREMsT0FBbEQsR0FBNEQsTUFBNUQ7O0FBRUEsSUFBSUMscUJBQXFCLFVBQVNDLEVBQVQsRUFBYUMsV0FBYixFQUEwQkMsS0FBMUIsRUFBaUNDLEtBQWpDLEVBQXdDQyxZQUF4QyxFQUFzREMsY0FBdEQsRUFBc0VDLGFBQXRFLEVBQXFGQyxLQUFyRixFQUE0RkMsU0FB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QUNKLENBSkQ7QUFLQSxJQUFJQSxtQkFBbUIsWUFBVTtBQUM3QjtBQUNBLFFBQUlDLGFBQWE3RCxFQUFFLGdCQUFGLEVBQW9CWSxHQUFwQixFQUFqQjtBQUNBakMseUJBQXFCa0YsVUFBckI7QUFDQSxRQUFJQyxVQUFVL0IsV0FBV3hELEtBQVgsSUFBb0IyRSxTQUFTVyxVQUFULENBQXBCLEdBQXlDLEdBQXZEO0FBQ0EsUUFBSUUsa0JBQWtCaEMsV0FBV3hELEtBQVgsSUFBb0J3RCxXQUFXK0IsT0FBWCxDQUExQztBQUNBLFFBQUk3QixjQUFjOEIsZ0JBQWdCN0IsT0FBaEIsQ0FBd0IsQ0FBeEIsQ0FBbEI7QUFDQWxDLE1BQUUsbUJBQUYsRUFBdUJvQixJQUF2QixDQUE0QixPQUFPYSxZQUFZL0IsUUFBWixHQUF1QjhCLE9BQXZCLENBQStCLEdBQS9CLEVBQW9DLEdBQXBDLENBQW5DO0FBQ0gsQ0FSRCIsImZpbGUiOiIzMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0gdmFyaWFibGVzIGdsb2JhbGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDAuMDtcbiAgICAgICAgICAgIHZhciB0b3RhbF9jb25fZGVzY3VlbnRvID0gMC4wO1xuICAgICAgICAgICAgdmFyIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgIHZhciBjb250YWRvcl90YWJsYSA9IDA7XG4gICAgICAgICAgICB2YXIgY3JlZGl0b19wb3JjZW50YWplID0gMDtcbiAgICAgICAgICAgIHZhciBhcnRpY3Vsb3NfdmVuZGlkb3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBmb3JtYV9wYWdvID0gJyc7XG4gICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgY3LDqWRpdG8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wb3JjZW50YWplJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfY3JlZGl0b190b3RhbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBkZXNjdWVudG8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyAgXG5cbiAgICAgICAgICAgIHZhciBzZWxlY2Npb25fYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgZGVzY3JpcGNpb24sIG1hcmNhLCBydWJybywgcHJlY2lvX3ZlbnRhLCBwcmVjaW9fY3JlZGl0bywgcHJlY2lvX2NvbXByYSwgc3RvY2ssIHByb3ZlZWRvcil7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkID0gcHJvbXB0KFwiSW5ncmVzZSBsYSBjYW50aWRhZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybWFfcGFnbyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlZmVjdGl2byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rlc2N1ZW50byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhazsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjcmVkaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbChjYW50aWRhZCwgaWQsIHByZWNpb19lbnZpYXIpO1xuICAgICAgICAgICAgICAgICAgICBjb250YWRvcl90YWJsYSArPTE7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArIGNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRlc2NyaXBjaW9uICsgJzwvdGQ+JyArICc8dGQ+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgbWFyY2EgKyAnPC90ZD4nICsgJzx0ZD4nICsgcnVicm8gKyAnPC90ZD4nICsgJzx0ZD4gJCcgKyBwcmVjaW9fZW52aWFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD4nICsgc3RvY2sgKyAnPC90ZD4nICsgJzx0ZD48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBjYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKycpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgZ3VhcmRhcl9jb21wcmEgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG8gPSByZXN1bHRhZG87XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3ZlbnRhcy9hamF4L3ZlbnRhcy9hbHRhLycsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVudGFzOiBKU09OLnN0cmluZ2lmeShhcnRpY3Vsb3NfdmVuZGlkb3MpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmVjaGE6ICQoJyNpZF9mZWNoYScpLnZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcmNlbnRhamVfZGVzY3VlbnRvOiAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbF9jb25fZGVzY3VlbnRvOiB0b3RhbF9jb25fZGVzY3VlbnRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX3ZlbnRhX3RvdGFsOiB0b3RhbC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWFfcGFnbzogZm9ybWFfcGFnbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZTogY3JlZGl0b19wb3JjZW50YWplLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3NyZm1pZGRsZXdhcmV0b2tlbjogJChcImlucHV0W25hbWU9Y3NyZm1pZGRsZXdhcmV0b2tlbl1cIikudmFsKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2lzdGVtYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEuc3VjY2VzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAwLjAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zJykuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvdmVudGFzL3RpY2tldC8nICsgZGF0YS5pZF92ZW50YVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLmtleXByZXNzKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKXtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC9jb2RpZ28vYXJ0aWN1bG8vJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29kaWdvX2FydGljdWxvJzogJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rlc2N1ZW50byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhazsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbCgnMScsIGRhdGEuaWQsIHByZWNpb19lbnZpYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEuZGVzY3JpcGNpb24gKyAnPC90ZD4nICsgJzx0ZD4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBkYXRhLm1hcmNhICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEucnVicm8gKyAnPC90ZD4nICsgJzx0ZD4gJCcgKyBwcmVjaW9fZW52aWFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGF0YS5zdG9jayArICc8dGQ+PGEgb25jbGljaz1cImFncmVnYXJfY2FudGlkYWQoJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBkYXRhLmlkICsgJywnICsgcHJlY2lvX2VudmlhciArICcpXCIgJyArICdjbGFzcz1cImJ0biBidG4taW5mbyBidG4teHNcIj48aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+IDwvYT48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBkYXRhLmNhbnRpZGFkICsgJywnICsgcHJlY2lvX2VudmlhciArICcpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG5cbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgKioqIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90b3RhbCA9IGZ1bmN0aW9uKGNhbnRpZGFkLCBpZCwgcHJlY2lvX3ZlbnRhKXtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgb2JqWydpZCddID0gaWQ7XG4gICAgICAgICAgICAgICAgICAgIG9ialsnY2FudGlkYWQnXSA9IGNhbnRpZGFkO1xuICAgICAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3MucHVzaChvYmopO1xuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cblxuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb192ZW50YS50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgLS0tLS0tLS0tLSBlbiBsYSBwYXJ0ZSBpbmZlcmlvciBkZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXMgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90aXBvX3BhZ28gPSBmdW5jdGlvbihmb3JtYV9wYWdvX3BhcmFtZXRybyl7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2ZlY2hhJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fZ3VhcmRhcl9jb21wcmEnKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgLy8gUG9uZ28gZGlzYWJsZWQgbGEgc2VsZWNjaW9uIGRlIGxhIGZvcm1hIGRlIHBhZ29cbiAgICAgICAgICAgICAgICBmb3JtYV9wYWdvID0gZm9ybWFfcGFnb19wYXJhbWV0cm87XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gPT0gJ2VmZWN0aXZvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGVmZWN0aXZvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvc1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdkZXNjdWVudG8nKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgZGVzY3VlbnRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvcyB5IGRlc2N1ZW50b1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdjcmVkaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGNyZWRpdG8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIGF1bWVudG9zXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZWZlY3Rpdm8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZWJpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2RlYml0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZXNjdWVudG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIGRldGVjdGFyIHF1ZSB0aXBvIGRlIHBhZ28gZXMgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFbGltaW5hciB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG4gICAgICAgICAgICB2YXIgZWxpbWluYXJfYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgY2FudGlkYWQsIHByZWNpb19lbnZpYXIpe1xuXG4gICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnNwbGljZShpZCwgMSk7XG4gICAgICAgICAgICAgICAgJCgnI3RyXycgKyBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdG90YWwgLT0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fZW52aWFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLCcsICcuJykpKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuXG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBBZ3JlZ2FyIGNhbnRpZGFkIGEgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGFncmVnYXJfY2FudGlkYWQgPSBmdW5jdGlvbihjb250YWRvciwgaWQsIHByZWNpbyl7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkID0gcHJvbXB0KFwiSW5ncmVzZSBsYSBjYW50aWRhZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FudGlkYWQgIT0gbnVsbCAmJiBjYW50aWRhZCAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWRfdGFibGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRfdGFibGFfYXJ0aWN1bG9zXCIpLnJvd3NbY29udGFkb3IgKyAxXS5jZWxscy5pdGVtKDApLmlubmVySFRNTCA9IHBhcnNlSW50KGNhbnRpZGFkX3RhYmxhKSArIHBhcnNlSW50KGNhbnRpZGFkKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoY2FudGlkYWQsIGlkLCBwcmVjaW8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBBZ3JlZ2FyIGNhbnRpZGFkIGEgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tIHBvciBjYWRhIGV2ZW50byBjYWxjdWxhciBlbCB2dWVsdG8gLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdnVlbHRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGVmZWN0aXZvIGVsIHZ1ZWx0byAtLS0tLSAqL1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhZ28gPSAkKCcjaWRfcGFnbycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBkZXNjdWVudG8gPSAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCk7XG4gICAgICAgICAgICAgICAgaWYgKGRlc2N1ZW50byAhPSAnMCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3VlbnRvX3RvdGFsID0gKHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VGbG9hdChkZXNjdWVudG8pKSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAtIHBhcnNlRmxvYXQoZGVzY3VlbnRvX3RvdGFsKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZ1ZWx0byA9ICBwYXJzZUZsb2F0KHBhZ28pIC0gcGFyc2VGbG9hdChyZXN1bHRhZG8pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIyID0gcmVzdWx0YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyMi50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZ1ZWx0byA9IHBhcnNlRmxvYXQocGFnbykgLSBwYXJzZUZsb2F0KHRvdGFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHZ1ZWx0by50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdnVlbHRvJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIHZ1ZWx0b3Mgc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuICAgXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgYXVtZW50byBzaSBlcyBjcmVkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wb3JjZW50YWplJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5rZXlwcmVzcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfYXVtZW50byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBjcmVkaXRvIGVsIGF1bWVudG8gLS0tLS0gKi9cbiAgICAgICAgICAgICAgICB2YXIgcG9yY2VudGFqZSA9ICQoJyNpZF9wb3JjZW50YWplJykudmFsKCk7XG4gICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplID0gcG9yY2VudGFqZTtcbiAgICAgICAgICAgICAgICB2YXIgYXVtZW50byA9IHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VJbnQocG9yY2VudGFqZSkvMTAwO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9hdW1lbnRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSArIHBhcnNlRmxvYXQoYXVtZW50byk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWxfYXVtZW50YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });