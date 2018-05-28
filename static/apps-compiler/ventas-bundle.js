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
/******/ 	var hotCurrentHash = "ac4eca41dce0e104b678"; // eslint-disable-line no-unused-vars
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

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    var no_sumar = false;\n    if ($('#id_no_sumar').is(':checked')) {\n        no_sumar = true;\n    }\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            no_sumar: no_sumar,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                if (Object.keys(data).length == 0) {\n                    alert('El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. ');\n                } else {\n\n                    var precio_enviar = '';\n                    switch (forma_pago) {\n                        case 'efectivo':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'descuento':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'credito':\n                            precio_enviar = data.precio_credito;\n                            break;\n                        case 'debito':\n                            precio_enviar = data.precio_debito;\n                            break;\n                    };\n                    contador_tabla += 1;\n                    calcular_total('1', data.id, precio_enviar);\n                    $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n                }\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    $('#id_no_sumar').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n});\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    if (descuento != '0') {\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    } else {\n        var vuelto = parseFloat(pago) - parseFloat(total);\n    }\n    var representar = vuelto.toFixed(2);\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5Iiwic2VsZWNjaW9uX2FydGljdWxvIiwiaWQiLCJkZXNjcmlwY2lvbiIsIm1hcmNhIiwicnVicm8iLCJwcmVjaW9fdmVudGEiLCJwcmVjaW9fY3JlZGl0byIsInByZWNpb19kZWJpdG8iLCJwcmVjaW9fY29tcHJhIiwic3RvY2siLCJwcm92ZWVkb3IiLCJjYW50aWRhZCIsInByb21wdCIsInByZWNpb19lbnZpYXIiLCJjYWxjdWxhcl90b3RhbCIsIiQiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJub19zdW1hciIsImlzIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwidmVudGFzIiwiSlNPTiIsInN0cmluZ2lmeSIsImZlY2hhIiwidmFsIiwiaWRfc29jaW8iLCJwb3JjZW50YWplX2Rlc2N1ZW50byIsInByZWNpb192ZW50YV90b3RhbCIsImNzcmZtaWRkbGV3YXJldG9rZW4iLCJzdWNjZXNzIiwiUE5vdGlmeSIsInRpdGxlIiwidGV4dCIsImh0bWwiLCJlbXB0eSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImlkX3ZlbnRhIiwia2V5cHJlc3MiLCJlIiwid2hpY2giLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiYWxlcnQiLCJub21icmUiLCJvYmoiLCJwdXNoIiwiY29uc29sZSIsImxvZyIsInBhcnNlRmxvYXQiLCJyZXBsYWNlIiwicmVwcmVzZW50YXIiLCJ0b0ZpeGVkIiwiY2FsY3VsYXJfdGlwb19wYWdvIiwiZm9ybWFfcGFnb19wYXJhbWV0cm8iLCJwcm9wIiwiaGlkZSIsImVsaW1pbmFyX2FydGljdWxvIiwic3BsaWNlIiwicmVtb3ZlIiwiYWdyZWdhcl9jYW50aWRhZCIsImNvbnRhZG9yIiwicHJlY2lvIiwiY2FudGlkYWRfdGFibGEiLCJyb3dzIiwiY2VsbHMiLCJpdGVtIiwiaW5uZXJIVE1MIiwicGFyc2VJbnQiLCJjbGljayIsImZvY3Vzb3V0IiwiY2FsY3VsYXJfdnVlbHRvIiwia2V5Q29kZSIsInBhZ28iLCJkZXNjdWVudG8iLCJkZXNjdWVudG9fdG90YWwiLCJ2dWVsdG8iLCJyZXByZXNlbnRhcjIiLCJjYWxjdWxhcl9hdW1lbnRvIiwicG9yY2VudGFqZSIsImF1bWVudG8iLCJ0b3RhbF9hdW1lbnRhZG8iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ1ksSUFBSUEsUUFBUSxHQUFaO0FBQ0EsSUFBSUMsc0JBQXNCLEdBQTFCO0FBQ0EsSUFBSUMsWUFBWSxHQUFoQjtBQUNBLElBQUlDLGlCQUFpQixDQUFyQjtBQUNBLElBQUlDLHFCQUFxQixDQUF6QjtBQUNBLElBQUlDLHFCQUFxQixFQUF6QjtBQUNBLElBQUlDLGFBQWEsRUFBakI7QUFDUDtBQUNPQyxTQUFTQyxjQUFULENBQXdCLGFBQXhCLEVBQXVDQyxLQUF2QyxDQUE2Q0MsT0FBN0MsR0FBdUQsTUFBdkQ7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsS0FBekMsQ0FBK0NDLE9BQS9DLEdBQXlELE1BQXpEO0FBQ1A7QUFDT0gsU0FBU0MsY0FBVCxDQUF3QixtQkFBeEIsRUFBNkNDLEtBQTdDLENBQW1EQyxPQUFuRCxHQUE2RCxNQUE3RDtBQUNBSCxTQUFTQyxjQUFULENBQXdCLHNCQUF4QixFQUFnREMsS0FBaEQsQ0FBc0RDLE9BQXRELEdBQWdFLE1BQWhFO0FBQ1A7QUFDT0gsU0FBU0MsY0FBVCxDQUF3QixrQkFBeEIsRUFBNENDLEtBQTVDLENBQWtEQyxPQUFsRCxHQUE0RCxNQUE1RDs7QUFFQSxJQUFJQyxxQkFBcUIsVUFBU0MsRUFB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QUYsRUFBb0I4RCxRQUFwQixDQUE2QixZQUFXO0FBQ3BDUTtBQUNILENBRkQ7QUFHQXRFLEVBQUUscUJBQUYsRUFBeUI4RCxRQUF6QixDQUFrQyxZQUFXO0FBQ3pDQztBQUNILENBRkQ7QUFHQS9ELEVBQUUscUJBQUYsRUFBeUI2QixRQUF6QixDQUFrQyxZQUFXO0FBQ3pDLFFBQUlDLEVBQUVrQyxPQUFGLElBQWEsRUFBakIsRUFBcUI7QUFDakJEO0FBQ0g7QUFDSixDQUpEO0FBS0EvRCxFQUFFLGdCQUFGLEVBQW9CNkIsUUFBcEIsQ0FBNkIsVUFBU0MsQ0FBVCxFQUFZO0FBQ3JDLFFBQUlBLEVBQUVrQyxPQUFGLElBQWEsRUFBakIsRUFBcUI7QUFDakJNO0FBQ0g7QUFDSixDQUpEO0FBS0EsSUFBSUEsbUJBQW1CLFlBQVU7QUFDN0I7QUFDQSxRQUFJQyxhQUFhdkUsRUFBRSxnQkFBRixFQUFvQmMsR0FBcEIsRUFBakI7QUFDQXBDLHlCQUFxQjZGLFVBQXJCO0FBQ0EsUUFBSUMsVUFBVS9CLFdBQVduRSxLQUFYLElBQW9Cc0YsU0FBU1csVUFBVCxDQUFwQixHQUF5QyxHQUF2RDtBQUNBLFFBQUlFLGtCQUFrQmhDLFdBQVduRSxLQUFYLElBQW9CbUUsV0FBVytCLE9BQVgsQ0FBMUM7QUFDQSxRQUFJN0IsY0FBYzhCLGdCQUFnQjdCLE9BQWhCLENBQXdCLENBQXhCLENBQWxCO0FBQ0E1QyxNQUFFLG1CQUFGLEVBQXVCdUIsSUFBdkIsQ0FBNEIsT0FBT29CLFlBQVl6QyxRQUFaLEdBQXVCd0MsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsR0FBcEMsQ0FBbkM7QUFDSCxDQVJEIiwiZmlsZSI6IjMwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLSB2YXJpYWJsZXMgZ2xvYmFsZXMgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gMC4wO1xuICAgICAgICAgICAgdmFyIHRvdGFsX2Nvbl9kZXNjdWVudG8gPSAwLjA7XG4gICAgICAgICAgICB2YXIgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgdmFyIGNvbnRhZG9yX3RhYmxhID0gMDtcbiAgICAgICAgICAgIHZhciBjcmVkaXRvX3BvcmNlbnRhamUgPSAwO1xuICAgICAgICAgICAgdmFyIGFydGljdWxvc192ZW5kaWRvcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGZvcm1hX3BhZ28gPSAnJztcbiAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcGFnbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3Z1ZWx0bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBjcsOpZGl0byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9jcmVkaXRvX3RvdGFsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGRlc2N1ZW50byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2Rlc2N1ZW50bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7ICBcblxuICAgICAgICAgICAgdmFyIHNlbGVjY2lvbl9hcnRpY3VsbyA9IGZ1bmN0aW9uKGlkLCBkZXNjcmlwY2lvbiwgbWFyY2EsIHJ1YnJvLCBwcmVjaW9fdmVudGEsIHByZWNpb19jcmVkaXRvLCBwcmVjaW9fZGViaXRvLCBwcmVjaW9fY29tcHJhLCBzdG9jaywgcHJvdmVlZG9yKXtcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGVzY3VlbnRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fY3JlZGl0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb19kZWJpdG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcyB0cjpsYXN0JykuYWZ0ZXIoJzx0ciBpZD1cInRyXycgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJ1wiPjx0ZD4nICsgY2FudGlkYWQgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGVzY3JpcGNpb24gKyAnPC90ZD4nICsgJzx0ZD4gJCcgKyBwcmVjaW9fZW52aWFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgICc8dGQ+PGEgb25jbGljaz1cImVsaW1pbmFyX2FydGljdWxvKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsnKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGd1YXJkYXJfY29tcHJhID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0b3RhbF9jb25fZGVzY3VlbnRvID0gcmVzdWx0YWRvO1xuICAgICAgICAgICAgICAgIHZhciBub19zdW1hciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbm9fc3VtYXInKS5pcygnOmNoZWNrZWQnKSl7bm9fc3VtYXIgPSB0cnVlO31cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvdmVudGFzL2FsdGEvJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZW50YXM6IEpTT04uc3RyaW5naWZ5KGFydGljdWxvc192ZW5kaWRvcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWNoYTogJCgnI2lkX2ZlY2hhJykudmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfc29jaW86ICQoJyNpZF9zb2NpbycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9yY2VudGFqZV9kZXNjdWVudG86ICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG86IHRvdGFsX2Nvbl9kZXNjdWVudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fdmVudGFfdG90YWw6IHRvdGFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYV9wYWdvOiBmb3JtYV9wYWdvLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9fc3VtYXI6IG5vX3N1bWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplOiBjcmVkaXRvX3BvcmNlbnRhamUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3Mpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaXN0ZW1hJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5zdWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckIDAuMCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MnKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy92ZW50YXMvdGlja2V0LycgKyBkYXRhLmlkX3ZlbnRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAvKiAtLS0tIGZ1bmNpb24gcGFyYSBlbCBsZWN0b3IgZGUgY29kaWdvIGRlIGJhcnJhcyAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykua2V5cHJlc3MoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpe1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC9jb2RpZ28vYXJ0aWN1bG8vJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29kaWdvX2FydGljdWxvJzogJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdFbCDDoXJ0aWN1bG8gbm8gZnVlIGVuY29udHJhZG8gbyBlbCBzdG9jayBlcyAwLiBWZXJpZmlxdWUgZW4gbGEgbGlzdGEgZGUgw6FydGljdWxvcyBsb3MgZGF0b3MgY29ycmVzcG9uZGllbnRlcy4gJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rlc2N1ZW50byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb19jcmVkaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fZGViaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWRvcl90YWJsYSArPTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKCcxJywgZGF0YS5pZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkYXRhLm5vbWJyZSArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD48YSBvbmNsaWNrPVwiYWdyZWdhcl9jYW50aWRhZCgnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuaWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICsgJ2NsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9hPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xuXG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgICoqKiAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdG90YWwgPSBmdW5jdGlvbihjYW50aWRhZCwgaWQsIHByZWNpb192ZW50YSl7XG4gICAgLyogLS0tLSBBcm1hciB1biBhcnJheSBjb24gbG9zIGFydGljdWxvcyB2ZW5kaWRvcyAtLS0tLSAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICAgICAgICAgIG9ialsnaWQnXSA9IGlkO1xuICAgICAgICAgICAgICAgICAgICBvYmpbJ2NhbnRpZGFkJ10gPSBjYW50aWRhZDtcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnB1c2gob2JqKTtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZWNpb192ZW50YSlcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fdmVudGEudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdGlwb19wYWdvID0gZnVuY3Rpb24oZm9ybWFfcGFnb19wYXJhbWV0cm8pe1xuICAgICAgICAgICAgICAgICQoJyNpZF9mZWNoYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjYnVzY2FyX3NvY2lvJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fZ3VhcmRhcl9jb21wcmEnKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX25vX3N1bWFyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgIC8vIFBvbmdvIGRpc2FibGVkIGxhIHNlbGVjY2lvbiBkZSBsYSBmb3JtYSBkZSBwYWdvXG4gICAgICAgICAgICAgICAgZm9ybWFfcGFnbyA9IGZvcm1hX3BhZ29fcGFyYW1ldHJvO1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBlZmVjdGl2byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3NcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnZGVzY3VlbnRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGRlc2N1ZW50byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3MgeSBkZXNjdWVudG9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBjcmVkaXRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBhdW1lbnRvc1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9jcmVkaXRvX3RvdGFsJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZWZlY3Rpdm8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2VmZWN0aXZvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2NyZWRpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGViaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZWJpdG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGVzY3VlbnRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGVsaW1pbmFyX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGNhbnRpZGFkLCBwcmVjaW9fZW52aWFyKXtcblxuICAgICAgICAgICAgICAgIGFydGljdWxvc192ZW5kaWRvcy5zcGxpY2UoaWQsIDEpO1xuICAgICAgICAgICAgICAgICQoJyN0cl8nICsgaWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRvdGFsIC09IChwYXJzZUZsb2F0KGNhbnRpZGFkKSAqIHBhcnNlRmxvYXQocHJlY2lvX2Vudmlhci50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcblxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBhZ3JlZ2FyX2NhbnRpZGFkID0gZnVuY3Rpb24oY29udGFkb3IsIGlkLCBwcmVjaW8pe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkX3RhYmxhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUwgPSBwYXJzZUludChjYW50aWRhZF90YWJsYSkgKyBwYXJzZUludChjYW50aWRhZCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIHZ1ZWx0b3Mgc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BhZ28nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLSBwb3IgY2FkYSBldmVudG8gY2FsY3VsYXIgZWwgdnVlbHRvIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BhZ28nKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3Z1ZWx0byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBlZmVjdGl2byBlbCB2dWVsdG8gLS0tLS0gKi9cblxuICAgICAgICAgICAgICAgIHZhciBwYWdvID0gJCgnI2lkX3BhZ28nKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3VlbnRvID0gJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmIChkZXNjdWVudG8gIT0gJzAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvKSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGRlc2N1ZW50b190b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyMiA9IHJlc3VsdGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSBwYXJzZUZsb2F0KHBhZ28pIC0gcGFyc2VGbG9hdCh0b3RhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB2dWVsdG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3Z1ZWx0bycpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSB2dWVsdG9zIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cbiAgIFxuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIGF1bWVudG8gc2kgZXMgY3JlZGl0byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tIHBvciBjYWRhIGV2ZW50byBjYWxjdWxhciBlbCB2dWVsdG8gLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX2F1bWVudG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykua2V5cHJlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX2F1bWVudG8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8qIC0tLS0tIGNhbGN1bGEgc2kgZXMgY3JlZGl0byBlbCBhdW1lbnRvIC0tLS0tICovXG4gICAgICAgICAgICAgICAgdmFyIHBvcmNlbnRhamUgPSAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZSA9IHBvcmNlbnRhamU7XG4gICAgICAgICAgICAgICAgdmFyIGF1bWVudG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlSW50KHBvcmNlbnRhamUpLzEwMDtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxfYXVtZW50YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKyBwYXJzZUZsb2F0KGF1bWVudG8pO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsX2F1bWVudGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3RhdGljL2FwcHMvdmVudGFzL2pzL29wZXJhY2lvbmVzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });