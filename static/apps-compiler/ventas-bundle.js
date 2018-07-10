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
/******/ 	var hotCurrentHash = "8101d27d18528ef09969"; // eslint-disable-line no-unused-vars
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

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* ---- hacer invisible los campos que solo son para los socios ---*/\ndocument.getElementById('id_div_puntos_socios').style.display = 'none';\ndocument.getElementById('id_form_canjear').style.display = 'none';\ndocument.getElementById('id_form_efectivo').style.display = 'none';\n\n/* ----------- habilitar campos para canje de puntos en socio ---*/\nhabilitar_campos_canje = function (socio) {\n    $('#id_puntos_socios').val(socio.puntos);\n    document.getElementById('id_div_puntos_socios').style.display = 'block';\n};\n/* --------------------------------------------------------------*/\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor, no_suma_caja) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        if (no_suma_caja) {\n            if (!$('#id_no_sumar').is(':checked')) {\n                swal({\n                    title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                    text: \"Desea que el sistema tilde el check por usted ? \",\n                    icon: \"info\",\n                    buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                    dangerMode: false\n                }).then(willDelete => {\n                    if (willDelete) {\n                        $('#id_no_sumar').prop(\"checked\", true);\n                    }\n                });\n            }\n        }\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    var no_sumar = false;\n    var canje_socios = false;\n\n    $('#id_button_guardar_compra').prop(\"disabled\", true);\n    if ($('#id_no_sumar').is(':checked')) {\n        no_sumar = true;\n    }\n    if ($('#id_canje_socios').is(':checked')) {\n        canje_socios = true;\n    }\n\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            no_sumar: no_sumar,\n            puntos_socios: $('#id_puntos_socios').val(),\n            canje_socios: canje_socios,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                if (Object.keys(data).length == 0) {\n                    swal({\n                        title: \"El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. \",\n                        text: \"Desea realizar el pedido ? \",\n                        icon: \"warning\",\n                        buttons: true,\n                        dangerMode: true\n                    });\n                    /*.then((willDelete) => {\n                      if (willDelete) {\n                        swal(\"Poof! Your imaginary file has been deleted!\", {\n                          icon: \"success\",\n                        });\n                      } else {\n                        swal(\"El pedido ha sido enviado\");\n                      }\n                    });*/\n                } else {\n\n                    var precio_enviar = '';\n                    switch (forma_pago) {\n                        case 'efectivo':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'descuento':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'credito':\n                            precio_enviar = data.precio_credito;\n                            break;\n                        case 'debito':\n                            precio_enviar = data.precio_debito;\n                            break;\n                    };\n                    contador_tabla += 1;\n                    calcular_total('1', data.id, precio_enviar);\n                    if (data.no_suma_caja) {\n                        if (!$('#id_no_sumar').is(':checked')) {\n                            swal({\n                                title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                                text: \"Desea que el sistema tilde el check por usted ? \",\n                                icon: \"info\",\n                                buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                                dangerMode: false\n                            }).then(willDelete => {\n                                if (willDelete) {\n                                    $('#id_no_sumar').prop(\"checked\", true);\n                                }\n                            });\n                        }\n                    }\n                    $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n                }\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    $('#id_no_sumar').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        //document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n\n    // hago invisibles las imagenes de tipos de pagos\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/*------ cuando selecciona el canje se agrega las cajas de texto ----*/\n$(\"#id_canje_socios\").change(function () {\n    if (this.checked) {\n        $('#id_canje_credito').prop(\"checked\", false);\n        document.getElementById('id_form_canjear').style.display = 'block';\n        document.getElementById('id_form_efectivo').style.display = 'none';\n    } else {\n        document.getElementById('id_form_canjear').style.display = 'none';\n    }\n});\n$(\"#id_canje_credito\").change(function () {\n    if (this.checked) {\n        $('#id_canje_socios').prop(\"checked\", false);\n        document.getElementById('id_form_efectivo').style.display = 'block';\n        document.getElementById('id_form_canjear').style.display = 'none';\n    } else {\n        document.getElementById('id_form_efectivo').style.display = 'none';\n    }\n});\n/*-------------------------------------------------------------------*/\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n// descuento para socios\n$('#id_descuento_socios').click(function () {\n    if ($('#id_descuento_socios').val() == '0') {\n        $('#id_descuento_socios').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_descuento_socios').focusout(function () {\n    if ($('#id_descuento_socios').val() == '') {\n        $('#id_descuento_socios').val('0');\n    }\n    calcular_vuelto();\n});\n\n$('#id_descuento_socios').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_descuento_socios').val() == '') {\n            $('#id_descuento_socios').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    var descuento_socio = $('#id_descuento_socios').val();\n\n    var vuelto = parseFloat(pago) - parseFloat(total);\n    console.log(descuento_socio);\n    if ($('#id_canje_socios').is(':checked')) {\n        if (descuento_socio != '0') {\n            // descuento para socios\n            descuento_total = parseFloat(total) * parseFloat(descuento_socio) / 100;\n            resultado = 0.0;\n            resultado = parseFloat(total) - parseFloat(descuento_total);\n            var vuelto = parseFloat(pago) - parseFloat(resultado);\n            var representar2 = resultado.toFixed(2);\n            $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n        }\n    }\n    console.log(descuento);\n    if (descuento != '0') {\n        // descuento extraordinario\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n    console.log(vuelto);\n    console.log(vuelto.toFixed(2));\n    var representar = vuelto.toFixed(2);\n\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwiaGFiaWxpdGFyX2NhbXBvc19jYW5qZSIsInNvY2lvIiwiJCIsInZhbCIsInB1bnRvcyIsInNlbGVjY2lvbl9hcnRpY3VsbyIsImlkIiwiZGVzY3JpcGNpb24iLCJtYXJjYSIsInJ1YnJvIiwicHJlY2lvX3ZlbnRhIiwicHJlY2lvX2NyZWRpdG8iLCJwcmVjaW9fZGViaXRvIiwicHJlY2lvX2NvbXByYSIsInN0b2NrIiwicHJvdmVlZG9yIiwibm9fc3VtYV9jYWphIiwiY2FudGlkYWQiLCJwcm9tcHQiLCJwcmVjaW9fZW52aWFyIiwiaXMiLCJzd2FsIiwidGl0bGUiLCJ0ZXh0IiwiaWNvbiIsImJ1dHRvbnMiLCJkYW5nZXJNb2RlIiwidGhlbiIsIndpbGxEZWxldGUiLCJwcm9wIiwiY2FsY3VsYXJfdG90YWwiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJub19zdW1hciIsImNhbmplX3NvY2lvcyIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInZlbnRhcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJmZWNoYSIsImlkX3NvY2lvIiwicG9yY2VudGFqZV9kZXNjdWVudG8iLCJwcmVjaW9fdmVudGFfdG90YWwiLCJwdW50b3Nfc29jaW9zIiwiY3NyZm1pZGRsZXdhcmV0b2tlbiIsInN1Y2Nlc3MiLCJQTm90aWZ5IiwiaHRtbCIsImVtcHR5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaWRfdmVudGEiLCJrZXlwcmVzcyIsImUiLCJ3aGljaCIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJub21icmUiLCJvYmoiLCJwdXNoIiwiY29uc29sZSIsImxvZyIsInBhcnNlRmxvYXQiLCJyZXBsYWNlIiwicmVwcmVzZW50YXIiLCJ0b0ZpeGVkIiwiY2FsY3VsYXJfdGlwb19wYWdvIiwiZm9ybWFfcGFnb19wYXJhbWV0cm8iLCJoaWRlIiwiZWxpbWluYXJfYXJ0aWN1bG8iLCJzcGxpY2UiLCJyZW1vdmUiLCJhZ3JlZ2FyX2NhbnRpZGFkIiwiY29udGFkb3IiLCJwcmVjaW8iLCJjYW50aWRhZF90YWJsYSIsInJvd3MiLCJjZWxscyIsIml0ZW0iLCJpbm5lckhUTUwiLCJwYXJzZUludCIsImNoYW5nZSIsImNoZWNrZWQiLCJjbGljayIsImZvY3Vzb3V0IiwiY2FsY3VsYXJfdnVlbHRvIiwia2V5Q29kZSIsInBhZ28iLCJkZXNjdWVudG8iLCJkZXNjdWVudG9fc29jaW8iLCJ2dWVsdG8iLCJkZXNjdWVudG9fdG90YWwiLCJyZXByZXNlbnRhcjIiLCJjYWxjdWxhcl9hdW1lbnRvIiwicG9yY2VudGFqZSIsImF1bWVudG8iLCJ0b3RhbF9hdW1lbnRhZG8iXSwibWFwcGluZ3MiOiJBQUFZO0FBQ0EsSUFBSUEsUUFBUSxHQUFaO0FBQ0EsSUFBSUMsc0JBQXNCLEdBQTFCO0FBQ0EsSUFBSUMsWUFBWSxHQUFoQjtBQUNBLElBQUlDLGlCQUFpQixDQUFyQjtBQUNBLElBQUlDLHFCQUFxQixDQUF6QjtBQUNBLElBQUlDLHFCQUFxQixFQUF6QjtBQUNBLElBQUlDLGFBQWEsRUFBakI7QUFDQTtBQUNBQyxTQUFTQyxjQUFULENBQXdCLGFBQXhCLEVBQXVDQyxLQUF2QyxDQUE2Q0MsT0FBN0MsR0FBdUQsTUFBdkQ7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsS0FBekMsQ0FBK0NDLE9BQS9DLEdBQXlELE1BQXpEO0FBQ0E7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixtQkFBeEIsRUFBNkNDLEtBQTdDLENBQW1EQyxPQUFuRCxHQUE2RCxN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ekYsRUFBRSxxQkFBRixFQUF5QnVELFFBQXpCLENBQWtDLFlBQVc7QUFDekMsUUFBSUMsRUFBRWtDLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUNqQkQ7QUFDSDtBQUNKLENBSkQ7QUFLQXpGLEVBQUUsZ0JBQUYsRUFBb0J1RCxRQUFwQixDQUE2QixVQUFTQyxDQUFULEVBQVk7QUFDckMsUUFBSUEsRUFBRWtDLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUNqQk87QUFDSDtBQUNKLENBSkQ7QUFLQSxJQUFJQSxtQkFBbUIsWUFBVTtBQUM3QjtBQUNBLFFBQUlDLGFBQWFsRyxFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixFQUFqQjtBQUNBVix5QkFBcUIyRyxVQUFyQjtBQUNBLFFBQUlDLFVBQVVqQyxXQUFXL0UsS0FBWCxJQUFvQmlHLFNBQVNjLFVBQVQsQ0FBcEIsR0FBeUMsR0FBdkQ7QUFDQSxRQUFJRSxrQkFBa0JsQyxXQUFXL0UsS0FBWCxJQUFvQitFLFdBQVdpQyxPQUFYLENBQTFDO0FBQ0EsUUFBSS9CLGNBQWNnQyxnQkFBZ0IvQixPQUFoQixDQUF3QixDQUF4QixDQUFsQjtBQUNBckUsTUFBRSxtQkFBRixFQUF1QmlELElBQXZCLENBQTRCLE9BQU9tQixZQUFZdEMsUUFBWixHQUF1QnFDLE9BQXZCLENBQStCLEdBQS9CLEVBQW9DLEdBQXBDLENBQW5DO0FBQ0gsQ0FSRCIsImZpbGUiOiIzMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiAgICAgICAgICAgIC8qIC0tLS0gdmFyaWFibGVzIGdsb2JhbGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDAuMDtcbiAgICAgICAgICAgIHZhciB0b3RhbF9jb25fZGVzY3VlbnRvID0gMC4wO1xuICAgICAgICAgICAgdmFyIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgIHZhciBjb250YWRvcl90YWJsYSA9IDA7XG4gICAgICAgICAgICB2YXIgY3JlZGl0b19wb3JjZW50YWplID0gMDtcbiAgICAgICAgICAgIHZhciBhcnRpY3Vsb3NfdmVuZGlkb3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBmb3JtYV9wYWdvID0gJyc7XG4gICAgICAgICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgZWZlY3Rpdm8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBjcsOpZGl0byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9jcmVkaXRvX3RvdGFsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBkZXNjdWVudG8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgLyogLS0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBsb3Mgc29jaW9zIC0tLSovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3B1bnRvc19zb2Npb3MnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fY2FuamVhcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9lZmVjdGl2bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgICAgIC8qIC0tLS0tLS0tLS0tIGhhYmlsaXRhciBjYW1wb3MgcGFyYSBjYW5qZSBkZSBwdW50b3MgZW4gc29jaW8gLS0tKi9cbiAgICAgICAgICAgIGhhYmlsaXRhcl9jYW1wb3NfY2FuamUgPSBmdW5jdGlvbihzb2Npbyl7XG4gICAgICAgICAgICAgICAgJCgnI2lkX3B1bnRvc19zb2Npb3MnKS52YWwoc29jaW8ucHVudG9zKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3B1bnRvc19zb2Npb3MnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgdmFyIHNlbGVjY2lvbl9hcnRpY3VsbyA9IGZ1bmN0aW9uKGlkLCBkZXNjcmlwY2lvbiwgbWFyY2EsIHJ1YnJvLCBwcmVjaW9fdmVudGEsIHByZWNpb19jcmVkaXRvLCBwcmVjaW9fZGViaXRvLCBwcmVjaW9fY29tcHJhLCBzdG9jaywgcHJvdmVlZG9yLCBub19zdW1hX2NhamEpe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybWFfcGFnbyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlZmVjdGl2byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rlc2N1ZW50byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fY3JlZGl0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb19kZWJpdG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChub19zdW1hX2NhamEpe1xuICAgICAgICAgICAgICAgICAgICAgIGlmICghKCQoJyNpZF9ub19zdW1hcicpLmlzKCc6Y2hlY2tlZCcpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbCDDoXJ0aWN1bG8gZXN0YSB0aWxkYWRvIHBhcmEgbm8gc3VtYXJzZSBhIGNhamEuIFBlcm8gbm8gc2UgdGlsZG8gZW4gZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRlc2VhIHF1ZSBlbCBzaXN0ZW1hIHRpbGRlIGVsIGNoZWNrIHBvciB1c3RlZCA/IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwiaW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFsnTm8sIHBvcnF1ZSBxdWllcm8gc3VtYXJsbyBhIGNhamEnLCAnU2ksIHBvcnF1ZSBubyBsbyB2b3kgYSBzdW1hciBhIGNhamEnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigod2lsbERlbGV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aWxsRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbm9fc3VtYXInKS5wcm9wKCBcImNoZWNrZWRcIiwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcyB0cjpsYXN0JykuYWZ0ZXIoJzx0ciBpZD1cInRyXycgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJ1wiPjx0ZD4nICsgY2FudGlkYWQgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGVzY3JpcGNpb24gKyAnPC90ZD4nICsgJzx0ZD4gJCcgKyBwcmVjaW9fZW52aWFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgICc8dGQ+PGEgb25jbGljaz1cImVsaW1pbmFyX2FydGljdWxvKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsnKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGd1YXJkYXJfY29tcHJhID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0b3RhbF9jb25fZGVzY3VlbnRvID0gcmVzdWx0YWRvO1xuICAgICAgICAgICAgICAgIHZhciBub19zdW1hciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBjYW5qZV9zb2Npb3MgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fZ3VhcmRhcl9jb21wcmEnKS5wcm9wKCBcImRpc2FibGVkXCIsIHRydWUgKTtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX25vX3N1bWFyJykuaXMoJzpjaGVja2VkJykpe25vX3N1bWFyID0gdHJ1ZTt9XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9jYW5qZV9zb2Npb3MnKS5pcygnOmNoZWNrZWQnKSl7Y2FuamVfc29jaW9zID0gdHJ1ZTt9XG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvdmVudGFzL2FsdGEvJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZW50YXM6IEpTT04uc3RyaW5naWZ5KGFydGljdWxvc192ZW5kaWRvcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWNoYTogJCgnI2lkX2ZlY2hhJykudmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfc29jaW86ICQoJyNpZF9zb2NpbycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9yY2VudGFqZV9kZXNjdWVudG86ICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG86IHRvdGFsX2Nvbl9kZXNjdWVudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fdmVudGFfdG90YWw6IHRvdGFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYV9wYWdvOiBmb3JtYV9wYWdvLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9fc3VtYXI6IG5vX3N1bWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVudG9zX3NvY2lvczogJCgnI2lkX3B1bnRvc19zb2Npb3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmplX3NvY2lvczogY2FuamVfc29jaW9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplOiBjcmVkaXRvX3BvcmNlbnRhamUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3Mpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaXN0ZW1hJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5zdWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckIDAuMCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MnKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy92ZW50YXMvdGlja2V0LycgKyBkYXRhLmlkX3ZlbnRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAvKiAtLS0tIGZ1bmNpb24gcGFyYSBlbCBsZWN0b3IgZGUgY29kaWdvIGRlIGJhcnJhcyAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykua2V5cHJlc3MoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpe1xuXG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvY29kaWdvL2FydGljdWxvLycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvZGlnb19hcnRpY3Vsbyc6ICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NyZm1pZGRsZXdhcmV0b2tlbjogJChcImlucHV0W25hbWU9Y3NyZm1pZGRsZXdhcmV0b2tlbl1cIikudmFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVsIMOhcnRpY3VsbyBubyBmdWUgZW5jb250cmFkbyBvIGVsIHN0b2NrIGVzIDAuIFZlcmlmaXF1ZSBlbiBsYSBsaXN0YSBkZSDDoXJ0aWN1bG9zIGxvcyBkYXRvcyBjb3JyZXNwb25kaWVudGVzLiBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRGVzZWEgcmVhbGl6YXIgZWwgcGVkaWRvID8gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoudGhlbigod2lsbERlbGV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbGxEZWxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dhbChcIlBvb2YhIFlvdXIgaW1hZ2luYXJ5IGZpbGUgaGFzIGJlZW4gZGVsZXRlZCFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoXCJFbCBwZWRpZG8gaGEgc2lkbyBlbnZpYWRvXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZWNpb19lbnZpYXIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZXNjdWVudG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb19jcmVkaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fZGViaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWRvcl90YWJsYSArPTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKCcxJywgZGF0YS5pZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm5vX3N1bWFfY2FqYSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoJCgnI2lkX25vX3N1bWFyJykuaXMoJzpjaGVja2VkJykpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVsIMOhcnRpY3VsbyBlc3RhIHRpbGRhZG8gcGFyYSBubyBzdW1hcnNlIGEgY2FqYS4gUGVybyBubyBzZSB0aWxkbyBlbiBlbCBmb3JtdWxhcmlvIGRlIHZlbnRhc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRGVzZWEgcXVlIGVsIHNpc3RlbWEgdGlsZGUgZWwgY2hlY2sgcG9yIHVzdGVkID8gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJpbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogWydObywgcG9ycXVlIHF1aWVybyBzdW1hcmxvIGEgY2FqYScsICdTaSwgcG9ycXVlIG5vIGxvIHZveSBhIHN1bWFyIGEgY2FqYSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCh3aWxsRGVsZXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbGxEZWxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9ub19zdW1hcicpLnByb3AoIFwiY2hlY2tlZFwiLCB0cnVlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcyB0cjpsYXN0JykuYWZ0ZXIoJzx0ciBpZD1cInRyXycgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJ1wiPjx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEubm9tYnJlICsgJzwvdGQ+JyArICc8dGQ+ICQnICsgcHJlY2lvX2VudmlhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAnPHRkPjxhIG9uY2xpY2s9XCJhZ3JlZ2FyX2NhbnRpZGFkKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgZGF0YS5pZCArICcsJyArIHByZWNpb19lbnZpYXIgKyAnKVwiICcgKyAnY2xhc3M9XCJidG4gYnRuLWluZm8gYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPiA8L2E+PGEgb25jbGljaz1cImVsaW1pbmFyX2FydGljdWxvKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgZGF0YS5jYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKyAnKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG5cbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgKioqIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90b3RhbCA9IGZ1bmN0aW9uKGNhbnRpZGFkLCBpZCwgcHJlY2lvX3ZlbnRhKXtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgb2JqWydpZCddID0gaWQ7XG4gICAgICAgICAgICAgICAgICAgIG9ialsnY2FudGlkYWQnXSA9IGNhbnRpZGFkO1xuICAgICAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3MucHVzaChvYmopO1xuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJlY2lvX3ZlbnRhKVxuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb192ZW50YS50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgLS0tLS0tLS0tLSBlbiBsYSBwYXJ0ZSBpbmZlcmlvciBkZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXMgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90aXBvX3BhZ28gPSBmdW5jdGlvbihmb3JtYV9wYWdvX3BhcmFtZXRybyl7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2ZlY2hhJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNidXNjYXJfc29jaW8nKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9ndWFyZGFyX2NvbXByYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfbm9fc3VtYXInKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgLy8gUG9uZ28gZGlzYWJsZWQgbGEgc2VsZWNjaW9uIGRlIGxhIGZvcm1hIGRlIHBhZ29cbiAgICAgICAgICAgICAgICBmb3JtYV9wYWdvID0gZm9ybWFfcGFnb19wYXJhbWV0cm87XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gPT0gJ2VmZWN0aXZvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGVmZWN0aXZvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvc1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdkZXNjdWVudG8nKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgZGVzY3VlbnRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvcyB5IGRlc2N1ZW50b1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdjcmVkaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGNyZWRpdG8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIGF1bWVudG9zXG4gICAgICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wb3JjZW50YWplJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfY3JlZGl0b190b3RhbCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBoYWdvIGludmlzaWJsZXMgbGFzIGltYWdlbmVzIGRlIHRpcG9zIGRlIHBhZ29zXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2VmZWN0aXZvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9lZmVjdGl2bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdjcmVkaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2RlYml0bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGViaXRvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2Rlc2N1ZW50bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGVsaW1pbmFyX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGNhbnRpZGFkLCBwcmVjaW9fZW52aWFyKXtcblxuICAgICAgICAgICAgICAgIGFydGljdWxvc192ZW5kaWRvcy5zcGxpY2UoaWQsIDEpO1xuICAgICAgICAgICAgICAgICQoJyN0cl8nICsgaWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRvdGFsIC09IChwYXJzZUZsb2F0KGNhbnRpZGFkKSAqIHBhcnNlRmxvYXQocHJlY2lvX2Vudmlhci50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcblxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBhZ3JlZ2FyX2NhbnRpZGFkID0gZnVuY3Rpb24oY29udGFkb3IsIGlkLCBwcmVjaW8pe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkX3RhYmxhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUwgPSBwYXJzZUludChjYW50aWRhZF90YWJsYSkgKyBwYXJzZUludChjYW50aWRhZCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qLS0tLS0tIGN1YW5kbyBzZWxlY2Npb25hIGVsIGNhbmplIHNlIGFncmVnYSBsYXMgY2FqYXMgZGUgdGV4dG8gLS0tLSovXG4gICAgJChcIiNpZF9jYW5qZV9zb2Npb3NcIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICQoJyNpZF9jYW5qZV9jcmVkaXRvJykucHJvcCggXCJjaGVja2VkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9lZmVjdGl2bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fY2FuamVhcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKFwiI2lkX2NhbmplX2NyZWRpdG9cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICQoJyNpZF9jYW5qZV9zb2Npb3MnKS5wcm9wKCBcImNoZWNrZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2VmZWN0aXZvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9lZmVjdGl2bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBkZXNjdWVudG8gcGFyYSBzb2Npb3NcbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wYWdvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5mb2N1c291dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdnVlbHRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGVmZWN0aXZvIGVsIHZ1ZWx0byAtLS0tLSAqL1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhZ28gPSAkKCcjaWRfcGFnbycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBkZXNjdWVudG8gPSAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2N1ZW50b19zb2NpbyA9ICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQodG90YWwpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlc2N1ZW50b19zb2NpbylcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2NhbmplX3NvY2lvcycpLmlzKCc6Y2hlY2tlZCcpKXtcbiAgICAgICAgICAgICAgICAgIGlmIChkZXNjdWVudG9fc29jaW8gIT0gJzAnKSB7IC8vIGRlc2N1ZW50byBwYXJhIHNvY2lvc1xuICAgICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvX3NvY2lvKSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IHBhcnNlRmxvYXQodG90YWwpIC0gcGFyc2VGbG9hdChkZXNjdWVudG9fdG90YWwpO1xuICAgICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIyID0gcmVzdWx0YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZXNjdWVudG8pXG4gICAgICAgICAgICAgICAgaWYgKGRlc2N1ZW50byAhPSAnMCcpIHsgLy8gZGVzY3VlbnRvIGV4dHJhb3JkaW5hcmlvXG4gICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvKSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGRlc2N1ZW50b190b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyMiA9IHJlc3VsdGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZ1ZWx0bylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2dWVsdG8udG9GaXhlZCgyKSlcbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB2dWVsdG8udG9GaXhlZCgyKTtcblxuICAgICAgICAgICAgICAgICQoJyNpZF92dWVsdG8nKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG5cbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSBhdW1lbnRvIHNpIGVzIGNyZWRpdG8gLS0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLSBwb3IgY2FkYSBldmVudG8gY2FsY3VsYXIgZWwgdnVlbHRvIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmtleXByZXNzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX2F1bWVudG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl9hdW1lbnRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGNyZWRpdG8gZWwgYXVtZW50byAtLS0tLSAqL1xuICAgICAgICAgICAgICAgIHZhciBwb3JjZW50YWplID0gJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBjcmVkaXRvX3BvcmNlbnRhamUgPSBwb3JjZW50YWplO1xuICAgICAgICAgICAgICAgIHZhciBhdW1lbnRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKiBwYXJzZUludChwb3JjZW50YWplKS8xMDA7XG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsX2F1bWVudGFkbyA9IHBhcnNlRmxvYXQodG90YWwpICsgcGFyc2VGbG9hdChhdW1lbnRvKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbF9hdW1lbnRhZG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0b190b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N0YXRpYy9hcHBzL3ZlbnRhcy9qcy9vcGVyYWNpb25lcy5qcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });