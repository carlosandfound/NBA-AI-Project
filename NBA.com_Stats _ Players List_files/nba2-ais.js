//NBA2 AdFuel Modules
//Deployed: 2018-11-15 17:36:59

////////////////////////////////////////////
//AA IndexExchange Wrapper 1.1
////////////////////////////////////////////

(function createAdFuelIndexExchangeWrapperModule() {
    // Added CNN Espanol filter when domestic user is detected
    'use strict';
    var MODULE_NAME = 'Index Exchange Wrapper';
    var MODULE_VERSION = 'v1.1.5';

    var scriptLoaded = false;
    var countryCode = (readCookie('CG') ? readCookie('CG').substr(0, 2) : '') || (readCookie('countryCode') ? readCookie('countryCode').substr(0, 2) : '');
    var noop = function () {};

    var scriptMap = {
        '^(.*\\.)?(www\\.)?cnn\\.com': {
            intl: '186370-96070407099023',
            dom: '186948-60896576130421'
        },
        '^(.*\\.)?edition\\.cnn\\.com': '186370-129055748395673',
        '^(.*\\.)?us\\.cnn\\.com': '186370-96070407099023',
        '^(.*\\.)?money\\.cnn\\.com': {
            intl: '186370-144448918822171',
            dom: '186948-10319041752160'
        },
        '^(.*\\.)?(cnne-test|cnnespanol)\\.cnn\\.com': {
            intl: '186370-263196174718504',
            dom: ''
        },
        '^(.*\\.)?arabic\\.cnn\\.com': '186370-164240128263733',
        '^(.*\\.)?pga\\.com': '186948-65293251488212',
        '^(.*\\.)?rydercup\\.com': '186948-65293251488212',
        '^(.*\\.)?pga-events\\.com': '186948-65293251488212',
        '^(.*\\.)?teamcoco\\.com': '186948-58699267721861',
        '^(.*\\.)?eleague\\.com': '186948-12519779424234',
        '^(.*\\.)?nba.com': '186948-120271757110262',
        '^(.*\\.)?ncaa.com': '186948-8121571303204',
        '^(.*\\.)?adultswim.com': '186948-113674687777483',
    }

    var log =  (window.console && window.console.log) ? function (/* arguments */) {
        var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ']'];
        args.push.apply(args, arguments);
        window.console.log.apply(window.console, args);
    } : noop;

    function readCookie(name) {
        var lsSupport = false;
        var data = '';
        // Check for native support
        if (localStorage) {
            lsSupport = true;
        }

        // No value supplied, return value
        if (typeof value === 'undefined') {
            // Get value
            if (lsSupport) { // Native support
                data = localStorage.getItem(name);
            }
            if (!lsSupport || data === null) { // Use cookie
                data = readTheCookie(name);
            }

            // Try to parse JSON...
            try {
                data = JSON.parse(data);
            } catch(e) { }

            return data;

        }
        /**
         * Returns contents of cookie
         * @param   {String}key The key or identifier for the store
         * @returns {String}    The contents of the cookie
         */
        function readTheCookie(key) {
            if (!document.cookie) {
                // there is no cookie, so go no further
                return '';
            } else { // there is a cookie
                var ca = document.cookie.split(';');
                var nameEQ = key + '=';
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        //delete spaces
                        c = c.substring(1, c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }
                return '';
            }
        }
    }

    function includeWrapper(scriptUrl) {
        if (!scriptLoaded) {
            log('Script URL: ', scriptUrl);
            // log('Initializing Module...');
            scriptLoaded = true;
            var a = document,
                b = a.createElement('script'),
                c = a.getElementsByTagName('script')[0]
            b.type = 'text/javascript';
            b.async = true;
            b.src = scriptUrl;
            c.parentNode.insertBefore(b, c);
        }
    }

    function setGeoTargeting(forceIntl) {
        // console.log('Force International: ', forceIntl ? 'yes' : 'no')
        function setGeoTarget() {
            if (countryCode !== 'US' && countryCode !== 'CA' && countryCode !== '') {
                // log('Setting IX Geo Target: EU');
                window.AdFuel.addPageLevelTarget('iom_geo', 'EU')
            }else if(forceIntl) {
                // log('Setting IX Geo Target: EU');
                window.AdFuel.addPageLevelTarget('iom_geo', 'EU')
            }else{
                // log('Setting IX Geo Target: US');
                window.AdFuel.addPageLevelTarget('iom_geo', 'US')
            }
        }
        window.googletag.cmd.push(setGeoTarget)
    }

    function registerModuleWithAdFuel() {
        // log('Registering Module...');
        var forceIntl = false;
        if (window.location.hostname.search(/^(edition|cnnespanol|arabic|cnne\-test)/) >= 0) forceIntl = true;
        // log('Setting Geo Targeting...', forceIntl);
        setGeoTargeting(forceIntl);
        window.AdFuel.registerModule(MODULE_NAME, {}) || { addMetric: function () {} };
    }

    function init() {
        var scriptUrl = null;
        Object.keys(scriptMap).forEach(function (regex) {
            var test = new RegExp(regex);
            var countryCode = readCookie('countryCode');
            var selectedEdition = readCookie('selectedEdition');
            var cnnRegex = new RegExp('/^(.*)?(edition|www|www\-m|us|us\-m|edition\-m)\.cnn\.com$/');
            var moneyRegex = new RegExp('/^(.*)?money\.cnn\.com$/');
            var espanolRegex = new RegExp('/^(.*)?(cnnespanol||cnne\-test)\.cnn\.com$/');
            if (window.location.hostname.search(test) === 0) {
                if (typeof scriptMap[regex] === 'string') {
                    scriptUrl = '//js-sec.indexww.com/ht/p/' + scriptMap[regex] + '.js';
                } else {
                    if (window.location.hostname.search(cnnRegex) &&
                        countryCode !== 'US' &&
                        countryCode !== 'CA' &&
                        countryCode !== '') {
                        scriptUrl = '//js-sec.indexww.com/ht/p/' + scriptMap[regex].intl + '.js';
                    } else if (window.location.hostname.search(espanolRegex) &&
                        countryCode !== 'US' &&
                        countryCode !== 'CA') {
                        if (countryCode === '' || countryCode === null){
                            log('Espanol detected but no country code detected.');
                            log('Defaulting to INTL');
                        }
                        scriptUrl = '//js-sec.indexww.com/ht/p/' + scriptMap[regex].intl + '.js';
                    } else if (window.location.hostname.search(moneyRegex) &&
                        selectedEdition === 'edition') {
                        scriptUrl = '//js-sec.indexww.com/ht/p/' + scriptMap[regex].intl + '.js';
                    } else {
                        scriptUrl = '//js-sec.indexww.com/ht/p/' + scriptMap[regex].dom + '.js';
                    }
                }
            }
        });
        if (scriptUrl !== null) includeWrapper(scriptUrl);
        else log('Country [' + (countryCode || 'undefined') + '] and/or Hostname [' + window.location.hostname + '] is invalid.');
        if (window.AdFuel && window.AdFuel.cmd) {
            window.AdFuel.cmd.push(registerModuleWithAdFuel);
        }else if (window.AdFuel) {
            //AdFuel loaded first
            registerModuleWithAdFuel();
        } else {
            //wait for AdFuel to load
            if (document.addEventListener) {
                document.addEventListener('AdFuelCreated', registerModuleWithAdFuel, true);
            } else if (document.attachEvent) {
                document.attachEvent('onAdFuelCreated', registerModuleWithAdFuel);
            }
        }
    }

    init();
})();

////////////////////////////////////////////
//AB Criteo 750ms 1.2
////////////////////////////////////////////

/*!
  - Revert of filter for super-ad-zone and super_ad_zone ad unit segments
  - Fix for SiteIDs on CNNMoney
  - Moved/Renamed PostQueue Function to PreQueue Event
  - 750ms Vendor Timeout
  - 800ms AdFuel Timeout
*/

(function createAdFuelCriteoModule() {
  window.Criteo = window.Criteo || {};
  window.Criteo.events = window.Criteo.events || [];

  var MODULE_NAME = 'Criteo';
  var MODULE_VERSION = 'v1.2.14';

  var metricApi;
  var objectProto = Object.prototype;
  var toString = objectProto.toString;
  var scriptLoaded = false;
  /**
     * @author: Kai Mallea (kmallea@gmail.com)
     * @license: http://creativecommons.org/publicdomain/zero/1.0/
     */
  var applePhone = /iPhone/i;
  var appleIpod = /iPod/i;
  var appleTablet = /iPad/i;
  var androidPhone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i; // Match 'Android' AND 'Mobile'
  var androidTablet = /Android/i;
  var amazonPhone = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i;
  var amazonTablet = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i;
  var windowsPhone = /Windows Phone/i;
  var windowsTablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i; // Match 'Windows' AND 'ARM'
  var otherBlackberry = /BlackBerry/i;
  var otherBlackberry10 = /BB10/i;
  var otherOpera = /Opera Mini/i;
  var otherChrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i;
  var otherFirefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i; // Match 'Firefox' AND 'Mobile'
  var sevenInch = new RegExp(
    '(?:' + // Non-capturing group
                  'Nexus 7' + // Nexus 7
                  '|' + // OR
                  'BNTV250' + // B&N Nook Tablet 7 inch
                  '|' + // OR
                  'Kindle Fire' + // Kindle Fire
                  '|' + // OR
                  'Silk' + // Kindle Fire, Silk Accelerated
                  '|' + // OR
                  'GT-P1000' + // Galaxy Tab 7 inch
                  ')', // End non-capturing group
    'i'); // Case-insensitive matching

  var match = function match(regex, userAgent) {
    return regex.test(userAgent);
  };

  var IsMobileClass = function IsMobileClass(userAgent) {
    var ua = userAgent || navigator.userAgent;

    // Facebook mobile app's integrated browser adds a bunch of strings that
    // match everything. Strip it out if it exists.
    var tmp = ua.split('[FBAN');
    if (typeof tmp[1] !== 'undefined') {
      ua = tmp[0];
    }

    // Twitter mobile app's integrated browser on iPad adds a "Twitter for
    // iPhone" string. Same probable happens on other tablet platforms.
    // This will confuse detection so strip it out if it exists.
    tmp = ua.split('Twitter');
    if (typeof tmp[1] !== 'undefined') {
      ua = tmp[0];
    }

    this.apple = {
      phone: match(applePhone, ua),
      ipod: match(appleIpod, ua),
      tablet: !match(applePhone, ua) && match(appleTablet, ua),
      device: match(applePhone, ua) || match(appleIpod, ua) || match(appleTablet, ua)
    };
    this.amazon = {
      phone: match(amazonPhone, ua),
      tablet: !match(amazonPhone, ua) && match(amazonTablet, ua),
      device: match(amazonPhone, ua) || match(amazonTablet, ua)
    };
    this.android = {
      phone: match(amazonPhone, ua) || match(androidPhone, ua),
      tablet: !match(amazonPhone, ua) && !match(androidPhone, ua) && (match(amazonTablet, ua) || match(androidTablet, ua)),
      device: match(amazonPhone, ua) || match(amazonTablet, ua) || match(androidPhone, ua) || match(androidTablet, ua)
    };
    this.windows = {
      phone: match(windowsPhone, ua),
      tablet: match(windowsTablet, ua),
      device: match(windowsPhone, ua) || match(windowsTablet, ua)
    };
    this.other = {
      blackberry: match(otherBlackberry, ua),
      blackberry10: match(otherBlackberry10, ua),
      opera: match(otherOpera, ua),
      firefox: match(otherFirefox, ua),
      chrome: match(otherChrome, ua),
      device: match(otherBlackberry, ua) || match(otherBlackberry10, ua) || match(otherOpera, ua) || match(otherFirefox, ua) || match(otherChrome, ua)
    };
    this.seven_inch = match(sevenInch, ua);
    this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

    // excludes 'other' devices and ipods, targeting touchscreen phones
    this.phone = this.apple.phone || this.android.phone || this.windows.phone;

    // excludes 7 inch devices, classifying as phone or tablet is left to the user
    this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

    if (typeof window === 'undefined') {
      return this;
    }
  };

  var instantiate = function instantiate() {
    var IM = new IsMobileClass();
    IM.Class = IsMobileClass;
    return IM;
  };

  var isMobile = instantiate();

  function isFunction(object) {
    return toString.call(object) === '[object Function]';
  }

  function isObject(object) {
    var type = typeof object;
    return type === 'function' || type === 'object' && !!object;
  }

  function getURLParam(name) {
    var nameParam = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regexS = '[\\?&]' + nameParam + '=([^&#]*)';
    var regex = new RegExp(regexS);
    if (document.location.search) {
      var results = regex.exec(document.location.search);
      if (results) {
        return results[1];
      }
      return '';
    }
    return '';
  }

  var log = function _logFunc() {}; // noop
  var error = function _errorFunc() {}; // noop

  var MaxPlacements = 8;

  var MULTISIZE_FIRST   = 'F';
  var MULTISIZE_LARGEST = 'L';
  var MULTISIZE_ALL     = 'A';

  var MultisizeMethod = MULTISIZE_LARGEST;

  MultisizeMethod = MultisizeMethod.toUpperCase();
  if (MultisizeMethod !== MULTISIZE_FIRST && MultisizeMethod !== MULTISIZE_LARGEST && MultisizeMethod !== MULTISIZE_ALL) {
    MultisizeMethod = MULTISIZE_LARGEST;
  }

  var zonesInSlot = {};
  var slotMaxArea = {};

  var RequestedCriteoAdUnits = { placements: [] };
  var CriteoZones = {
    'CNN': {
      '160x600': 1047134,
      '300x250': 1047135,
      '300x600': 1047136,
      '728x90': 1047137,
      'HP_970x90': 1128528,
      'HP_970x250': 1128527,
      'ROS_970x90': 1047140,
      'ROS_970x250': 1047139,
      '320x50': 1047138
    },
    'NBA': {
      '320x50': 1083217,
      '728x90': 1083216,
      '970x90': 1083218,
      '300x250': 1083215
    },
    'NCAA': {
      '160x600': 1083227,
      '320x50': 1083230,
      '300x250': 1083228,
      '728x90': 1083229,
      '970x90': 1083231
    },
    'PGA': {
      '728x90': 1083239,
      '300x250': 1083237,
      '970x90': 1083242,
      '300x600': 1083238,
      '970x250': 1083241,
      '320x50': 1083240
    },
    'ELEAGUE': {
      '320x50': 1083245,
      '300x250': 1083243,
      '728x90': 1083244
    },
    'CNNMoney': {
      '728x90': 1083234,
      '970x90': 1083236,
      '970x250': 1083235,
      '300x250': 1083232,
      '300x600': 1083233
    },
    'AS': {
      '320x50': 1083225,
      '728x90': 1083224,
      '300x250': 1083223,
      '970x90': 1083226
    },
    'TBS/shows/conan': {
      '300x250': 1083219,
      '728x90': 1083220,
      '970x90': 1083222,
      '970x250': 1083221
    },
    'MOBILE': {
      'CNN': {
        '300x250': 1090825,
        '320x50': 1090883
      },
      'NBA': {
        '300x250': 1090830,
        '320x50': 1090884
      },
      'NCAA': {
        '300x250': 1090831,
        '320x50': 1090885
      },
      'PGA': {
        '300x250': 1090832,
        '320x50': 1090886
      },
      'ELEAGUE': {
        '300x250': 1090833,
        '320x50': 1090887
      },
      'CNNMoney': {
        '300x250': 1090834,
        '320x50': 1090834
      },
      'AS': {
        '300x250': 1090835,
        '320x50': 1090888
      },
      'TBS/shows/conan': {
        '300x250': 1090836
      }
    }
  };

  if (isObject(window.console) && isFunction(window.console.log) && getURLParam('debug') === 'true') {
    log = function logFunc(/* arguments */) {
      var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ']'];
      args.push.apply(args, arguments);
      window.console.log.apply(window.console, args);
    };
    error = function errorFunc() {
      var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ']'];
      args.push.apply(args, arguments);
      window.console.error.apply(window.console, args);
    };
  }

  function includeCriteoLibrary() {
    if (!scriptLoaded) {
      log('Including Criteo Library...');
      scriptLoaded = true;

      var a = document;
      var b = a.createElement('script');
      var c = a.getElementsByTagName('script')[0];
      b.type = 'text/javascript';
      b.async = true;
      b.src = '//static.criteo.net/js/ld/publishertag.js';
      c.parentNode.insertBefore(b, c);
    }
  }

  function getViewport() {
    var viewportWidth;
    var viewportHeight;
    if (typeof window.innerWidth !== 'undefined') {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    } else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth !== 0) {
      viewportWidth = document.documentElement.clientWidth;
      viewportHeight = document.documentElement.clientHeight;
    } else {
      viewportWidth = document.getElementsByTagName('body')[0].clientWidth;
      viewportHeight = document.getElementsByTagName('body')[0].clientHeight;
    }
    return [viewportWidth, viewportHeight];
  }

  function preQueueCallback(asset, callback) {
    var CriteoAdUnits = { 'placements': [] };
    for (var slotIndex = 0; slotIndex < asset.length; slotIndex++) {
      var slot = asset[slotIndex];
      if (slot.rktr_slot_id !== 'page') {
        var responsiveSizes = [];
        var browser = getViewport();
        var viewportChecked = false;
        var isValid = true;
        for (var viewportId = 0; viewportId < slot.responsive.length; viewportId++) {
          var viewport = slot.responsive[viewportId];
          if (!viewportChecked && viewport[0][0] < browser[0] && viewport[0][1] < browser[1]) {
            viewportChecked = true;
            responsiveSizes = viewport[1];
            if (viewport[1][0] === 'suppress' || responsiveSizes === 'suppress') {
              isValid = false;
            }
          }
        }
        if (isValid && responsiveSizes.length > 0) {
          log('Setting Sizes To Responsive Sizes: ', responsiveSizes);
          slot.sizes = responsiveSizes;
        } else if (!isValid) {
          slot.sizes = [];
        }
        var slotSizes = slot.sizes;
        var slotid = slot.rktr_slot_id;
        var adUnit = slot.rktr_ad_id;
        zonesInSlot[slotid] = [];
        slotMaxArea[slotid] = 0;
        var siteAdUnit = adUnit.split('/')[0];
        if (isValid) {
          if (CriteoZones.hasOwnProperty(siteAdUnit)) {
            for (var index = 0; index < slotSizes.length; index++) {
              var sizeArray = slotSizes[index];
              var width = sizeArray[0] || null;
              var height = sizeArray[1] || null;
              var area = width !== null ? width * height : 0;
              var sizeName = width !== null ? width + 'x' + height : sizeArray.join('x');
              var zoneid;
              if (CriteoZones[siteAdUnit][sizeName]) {
                zoneid = CriteoZones[siteAdUnit][sizeName];
              } else {
                zoneid = CriteoZones[siteAdUnit]['ROS_' + sizeName] ? CriteoZones[siteAdUnit]['ROS_' + sizeName] : null;
              }
              if (siteAdUnit === 'CNN' && adUnit.indexOf('homepage') > 0) zoneid = CriteoZones[siteAdUnit]['HP_' + sizeName] || zoneid;
              if (['300x250', '320x50'].indexOf(sizeName) >= 0 && isMobile.any) {
                log('Using Mobile zoneId for size: ', sizeName);
                zoneid = CriteoZones.MOBILE[siteAdUnit][sizeName] || null;
              }
              if (zoneid !== null) {
                slotMaxArea[slotid] = area > slotMaxArea[slotid] ? area : slotMaxArea[slotid];
                var data = {'slotid': slotid, 'zoneid': zoneid, 'width': width, 'height': height, 'area': area};
                if (zonesInSlot[slotid].indexOf(data) === -1) {
                  log('Pushing data...', data);
                  zonesInSlot[slotid].push(data);
                } else {
                  log('Skipping... Already exists...', data);
                }
              }
            }
          }
        }
      }
    }
    var count = 0;
    for (slotid in zonesInSlot) {
      if (zonesInSlot.hasOwnProperty(slotid)) {
        var zones = zonesInSlot[slotid];
        for (var i = 0; i < zones.length; i++) {
          var zone = zones[i];
          if (count >= MaxPlacements) break;
          if (MultisizeMethod === MULTISIZE_LARGEST && zone.area !== slotMaxArea[zone.slotid]) continue;
          var placement = {'slotid': slotid, 'zoneid': zone.zoneid };
          var exists = false;
          for (var placementIndex = 0; placementIndex < CriteoAdUnits.placements.length; placementIndex++) {
            if (CriteoAdUnits.placements[placementIndex].slotid === placement.slotid && CriteoAdUnits.placements[placementIndex].zoneid === placement.zoneid) {exists = true;}
          }
          for (var requestedPlacementIndex = 0; requestedPlacementIndex < RequestedCriteoAdUnits.placements.length; requestedPlacementIndex++) {
            if (RequestedCriteoAdUnits.placements[requestedPlacementIndex].slotid === placement.slotid && RequestedCriteoAdUnits.placements[requestedPlacementIndex].zoneid === placement.zoneid) {exists = true;}
          }
          if (!exists) {
            log('Placement does not yet exist.  Adding to collection.', placement);
            CriteoAdUnits.placements.push(placement);
          }
          count++;
          if (MultisizeMethod === MULTISIZE_FIRST) break;
        }
      }
    }

    function eventFunction() {
      log('Setting LineItem Ranges...');
      // eslint-disable-next-line
      window.Criteo.SetLineItemRanges('0..5:0.01;5..30:0.05;30..100:1.00');
      log('Previously Requested: ', RequestedCriteoAdUnits);
      log('Requesting Bids...', CriteoAdUnits);
      metricApi.addMetric({type: 'vendor', id: 'Criteo', data: zonesInSlot});
      RequestedCriteoAdUnits.placements = RequestedCriteoAdUnits.placements.concat(CriteoAdUnits.placements);
      // eslint-disable-next-line
      window.Criteo.RequestBids(CriteoAdUnits, callback, 750);
    }
    if (CriteoAdUnits.placements.length > 0) window.googletag.cmd.push(function pushEventFunc() {window.Criteo.events.push(eventFunction);});
    else callback();
  }

  function preDispatchCallback(asset, callback) {
    log('Setting DFP KeyValue Targeting...');
    // eslint-disable-next-line
    try { window.googletag.cmd.push(function pushPreDispatchFunc() { window.Criteo.SetDFPKeyValueTargeting(); }); } catch (e) { error(e); }
    callback();
  }

  function preRefreshCallback(asset, callback) {
    var internalCallback = preDispatchCallback.bind(null, asset, callback);
    function eventFunc() {
      log('Setting LineItem Ranges...');
      // eslint-disable-next-line
      window.Criteo.SetLineItemRanges('0..3:0.01;3..8:0.05;8..20:0.50;20..30:1.00');
      log('Requesting Bids...', RequestedCriteoAdUnits);
      metricApi.addMetric({type: 'vendor', id: 'Criteo', data: zonesInSlot });
      // eslint-disable-next-line
      window.Criteo.RequestBids(RequestedCriteoAdUnits, internalCallback, 750);
    }
    window.Criteo.events.push(eventFunc);
  }

  function registerModuleWithAdFuel() {
    log('Registering Module...');
    window.AdFuel.setOptions({
      queueCallbackTimeoutInMilliseconds: 800,
      dispatchCallbackTimeoutInMilliseconds: 800,
      refreshCallbackTimeoutInMilliseconds: 800
    });
    metricApi = window.AdFuel.registerModule('criteo', {
      preQueueCallback: preQueueCallback,
      preDispatchCallback: preDispatchCallback,
      preRefreshCallback: preRefreshCallback
    }) || { addMetric: function addMetric() {} };
  }

  function init() {
    log('Initializing Module...');
    includeCriteoLibrary();
    if (window.AdFuel && window.AdFuel.cmd) {
      window.AdFuel.cmd.push(registerModuleWithAdFuel);
    } else if (window.AdFuel) {
      // AdFuel loaded first
      registerModuleWithAdFuel();
    } else {
      // wait for AdFuel to load
      if (document.addEventListener) {
        document.addEventListener('AdFuelCreated', registerModuleWithAdFuel, true);
      }
      if (document.attachEvent) {
        document.attachEvent('onAdFuelCreated', registerModuleWithAdFuel);
      }
    }
  }

  init();
})();




////////////////////////////////////////////
//AC A9 750ms 1.3
////////////////////////////////////////////

/* Amazon A9 AdFuel Module - Version 1.3.16
    - Switched wrappedFunction and timeoutFunction definition order
    - Added additional time logging
    - 750ms Vendor Timeout
    - 800ms AdFuel Timeout
 */

(function createA9AdFuelModule() {
  'use strict';
  // Promise Polyfill
  // eslint-disable-next-line
    !function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n()}(0,function(){"use strict";function e(){}function n(e){if(!(this instanceof n))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],f(e,this)}function t(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,n._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var i;try{i=n(e._value)}catch(f){return void r(t.promise,f)}o(t.promise,i)}else(1===e._state?o:r)(t.promise,e._value)})):e._deferreds.push(t)}function o(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var o=t.then;if(t instanceof n)return e._state=3,e._value=t,void i(e);if("function"==typeof o)return void f(function(e,n){return function(){e.apply(n,arguments)}}(o,t),e)}e._state=1,e._value=t,i(e)}catch(u){r(e,u)}}function r(e,n){e._state=2,e._value=n,i(e)}function i(e){2===e._state&&0===e._deferreds.length&&n._immediateFn(function(){e._handled||n._unhandledRejectionFn(e._value)});for(var o=0,r=e._deferreds.length;r>o;o++)t(e,e._deferreds[o]);e._deferreds=null}function f(e,n){var t=!1;try{e(function(e){t||(t=!0,o(n,e))},function(e){t||(t=!0,r(n,e))})}catch(i){if(t)return;t=!0,r(n,i)}}var u=setTimeout;n.prototype["catch"]=function(e){return this.then(null,e)},n.prototype.then=function(n,o){var r=new this.constructor(e);return t(this,new function(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}(n,o,r)),r},n.prototype["finally"]=function(e){var n=this.constructor;return this.then(function(t){return n.resolve(e()).then(function(){return t})},function(t){return n.resolve(e()).then(function(){return n.reject(t)})})},n.all=function(e){return new n(function(n,t){function o(e,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var u=f.then;if("function"==typeof u)return void u.call(f,function(n){o(e,n)},t)}r[e]=f,0==--i&&n(r)}catch(c){t(c)}}if(!e||"undefined"==typeof e.length)throw new TypeError("Promise.all accepts an array");var r=Array.prototype.slice.call(e);if(0===r.length)return n([]);for(var i=r.length,f=0;r.length>f;f++)o(f,r[f])})},n.resolve=function(e){return e&&"object"==typeof e&&e.constructor===n?e:new n(function(n){n(e)})},n.reject=function(e){return new n(function(n,t){t(e)})},n.race=function(e){return new n(function(n,t){for(var o=0,r=e.length;r>o;o++)e[o].then(n,t)})},n._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){u(e,0)},n._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var c=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==c)return c;throw Error("unable to locate global object")}();c.Promise||(c.Promise=n)});
  // Object.assign Polyfill
  // eslint-disable-next-line
    "function"!=typeof Object.assign&&Object.defineProperty(Object,"assign",{value:function(e,t){"use strict";if(null==e)throw new TypeError("Cannot convert undefined or null to object");for(var n=Object(e),r=1;r<arguments.length;r++){var o=arguments[r];if(null!=o)for(var c in o)Object.prototype.hasOwnProperty.call(o,c)&&(n[c]=o[c])}return n},writable:!0,configurable:!0});

  var objectProto = Object.prototype;
  var toString = objectProto.toString;
  var noop = function noop() {};

  var MODULE_NAME = 'Amazon A9';
  var MODULE_VERSION = 'v1.3.16';

  var metricApi = {
    metrics: {},
    addMetric: noop,
    getMetricById: noop,
    getMetricsByType: noop,
    getMetricTypes: noop
  };

  var blocked = false;

  function isFunction(object) {
    return toString.call(object) === '[object Function]';
  }

  function isObject(object) {
    var type = typeof object;
    return type === 'function' || type === 'object' && !!object;
  }

  function getURLParam(name) {
    var nameParam = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regexS = '[\\?&]' + nameParam + '=([^&#]*)';
    var regex = new RegExp(regexS);
    if (document.location.search) {
      var results = regex.exec(document.location.search);
      if (results) {
        return results[1];
      }
      return '';
    }
    return '';
  }

  function readCookie(name) {
    var lsSupport = false;
    var data = null;
    // Check for native support
    if (localStorage) {
      lsSupport = true;
    }

    // No value supplied, return value
    if (typeof value === 'undefined') {
      // Get value
      if (lsSupport) { // Native support
        data = localStorage.getItem(name);
      }
      if (!lsSupport || data === null) { // Use cookie
        data = readTheCookie(name);
      }

      // Try to parse JSON...
      try {
        data = JSON.parse(data);
      } catch (e) {
        // Do Nothing
      }
    }
    return data;

    function readTheCookie(key) {
      if (!document.cookie) {
        // there is no cookie, so go no further
        return null;
      }  // there is a cookie
      var ca = document.cookie.split(';');
      var nameEQ = key + '=';
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          // delete spaces
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
      return null;
    }
  }

  function getViewport() {
    var viewportWidth;
    var viewportHeight;
    if (typeof window.innerWidth !== 'undefined') {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    } else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth !== 0) {
      viewportWidth = document.documentElement.clientWidth;
      viewportHeight = document.documentElement.clientHeight;
    } else {
      viewportWidth = document.getElementsByTagName('body')[0].clientWidth;
      viewportHeight = document.getElementsByTagName('body')[0].clientHeight;
    }
    return [viewportWidth, viewportHeight];
  }

  var log = noop;
  var logTime = noop;
  var logTimeEnd = noop;

  if (isObject(window.console) && isFunction(window.console.log) && getURLParam('debug') === 'true') {
    log = function _log(/* arguments */) {
      var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ']'];
      args.push.apply(args, arguments);
      window.console.log.apply(window.console, args);
    };
    logTime = function _logTime(/* arguments */) {
      var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ' TIMER] '];
      args.push.apply(args, arguments);
      var timeKey = args.join('');
      window.console.time(timeKey);
    };
    logTimeEnd = function _logTimeEnd(/* arguments */) {
      var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ' TIMER] '];
      args.push.apply(args, arguments);
      var timeKey = args.join('');
      window.console.timeEnd(timeKey);
    };
  }

  var logger = { log: log, logTime: logTime, logTimeEnd: logTimeEnd };

  var countryCode = (readCookie('CG') ? readCookie('CG').substr(0, 2) : '') || readCookie('countryCode');
  var selectedEdition = readCookie('SelectedEdition') ? readCookie('SelectedEdition') : 'www';
  var parser = document.createElement('a');
  parser.href = document.location.href;

  var hostname = parser.hostname;
  var pathname = parser.pathname;

  var a9bids;                         // display a9 bid cache
  var bidSlots = [];                  // slots sent to a9 for auction
  var defaultTimeout = 500;           // 500ms default timeout (for video)
  var defaultRefreshTimeout = 1000;   // 1000ms default refresh timeout (for video)
  var timerEnded = false;

  function getTargetingData(timeout) {
    logger.logTime('getTargetingData');
    var timeoutVal = timeout || defaultTimeout;
    var timeoutOverride = getURLParam('mdt');
    if (timeoutOverride) {
      timeoutVal = timeoutOverride;
      logger.log('Overriding Max Duration Time: ', timeoutVal);
    }
    var wrappedFunction = function wrappedFunction(resolve) {
      logger.log('Getting A9 Video targeting...');
      var innerFunction = function _innerFunc(bids) {
        clearTimeout(window.targetingTimeoutId);
        var targetBid = {};
        bids.forEach(function _forEachBid(bid) {
          if (bid.slotID.indexOf('aps-') >= 0) {
            targetBid = bid;
          }
        });
        var result = {
          'amznbid': targetBid.amznbid || '',
          'amzniid': targetBid.amzniid || ''
        };
        logger.log('Returning A9 Targeting: ', result);
        if (!timerEnded) {
          logger.logTimeEnd('getTargetingData');
          timerEnded = true;
        }
        return result;
      };
      window.A9VideoAPI._targetingPromise.then(function _targetingPromiseFunc(bids) { resolve(innerFunction(bids)); });
    };
    var timeoutFunction = function timeoutFunction(resolve, reject) {
      window.targetingTimeoutId = setTimeout(function timeoutFunc() {
        logger.log('getTargetingData timed out after ' + timeout + 'ms.');
        clearTimeout(window.targetingTimeoutId);
        if (!timerEnded) {
          logger.logTimeEnd('getTargetingData');
          timerEnded = true;
        }
        reject('getTargetingData timed out after ' + timeout + 'ms.');
      }, timeoutVal);
    };
    var wrappedCallback = new Promise(wrappedFunction);
    var timeoutCallback = new Promise(timeoutFunction);

    // Returns a race between the timeout and the passed in promise
    return Promise.race([wrappedCallback, timeoutCallback]);
  }

  function getRefreshedTargetingData(slotName, timeout) {
    logger.logTime('getRefreshedTargetingData');
    var timeoutVal = timeout || defaultRefreshTimeout;
    var slotNameVal = slotName || 'aps-midroll';
    var timeoutOverride = getURLParam('mdt');
    var slotNameOverride = getURLParam('slotname');
    if (timeoutOverride) {
      timeoutVal = timeoutOverride;
      logger.log('Overriding Max Duration Time: ', timeoutVal);
    }
    if (slotNameOverride) {
      slotNameVal = slotNameOverride;
      logger.log('Overriding Slot Name: ', slotNameVal);
    }
    var wrappedFunction = function wrappedFunction(wrappedResolve) {
      window.A9VideoAPI._targetingPromise = new Promise(function _targetingPromiseFunc(resolve) {
        window.apstag.fetchBids({
          slots: [{
            slotID: slotName,
            mediaType: 'video'
          }],
          timeout: timeoutVal
        }, resolve);
      });
      var innerFunction = function innerFunction(bids) {
        clearTimeout(window.targetingTimeoutId);
        var targetBid = {};
        bids.forEach(function _forEachBid(bid) {
          if (bid.slotID === slotName) {
            targetBid = bid;
          }
        });
        var result = {
          'amznbid': targetBid.amznbid || '',
          'amzniid': targetBid.amzniid || ''
        };
        logger.log('Returning A9 Targeting: ', result);
        if (!timerEnded) {
          logger.logTimeEnd('getRefreshedTargetingData');
          timerEnded = true;
        }
        wrappedResolve(result);
      };
      logger.log('Refreshing A9 Video targeting...');
      window.A9VideoAPI._targetingPromise.then(innerFunction);
    };
    var timeoutFunction = function timeoutFunction(resolve, reject) {
      window.targetingTimeoutId = setTimeout(function _timeoutFunc() {
        logger.log('getRefreshedTargetingData timed out after ' + timeout + 'ms.');
        clearTimeout(window.targetingTimeoutId);
        if (!timerEnded) {
          logger.logTimeEnd('getRefreshedTargetingData');
          timerEnded = true;
        }
        reject('getRefreshedTargetingData timed out after ' + timeout + 'ms.');
      }, timeoutVal);
    };
    var wrappedCallback = new Promise(wrappedFunction);
    var timeoutCallback = new Promise(timeoutFunction);

    // Returns a race between the timeout and the passed in promise
    return Promise.race([wrappedCallback, timeoutCallback]);
  }

  function keyGPTSlots(slots) {
    return slots.reduce(function _reduceFunc(o, slot) {
      var slotId = slot.getSlotElementId();
      o[slotId] = slot;
      return o;
    }, {});
  }

  function handleA9Bids(bids, gptSlots, done) {
    log('Handling A9 Bids:', bids, gptSlots);
    logTime('Handling A9 Bids');
    window.googletag.cmd.push(function _handleA9Bids() {
      var slots = keyGPTSlots(gptSlots);
      bids.forEach(function _forEachBid(bid) {
        var gptSlot = slots[bid.slotID] || null;
        if (gptSlot !== null) {
          var targets = {};
          window.apstag.targetingKeys('display').forEach(function _forEachTargetingKey(key) {
            targets[key] = bid[key];
            gptSlot.setTargeting(key, bid[key]);
          });
          metricApi.addMetric({
            type: 'vendor',
            id: 'Amazon A9',
            data: {targeting: targets}
          });
        }
      });
      window.googletag.pubads().addEventListener('slotRenderEnded', function _slotRenderEndedFunc(e) {
        var renderedGPTSlots = keyGPTSlots(window.googletag.pubads().getSlots());
        var gptSlot = renderedGPTSlots[e.slot.getSlotElementId()];
        window.apstag.targetingKeys('display').forEach(function _forEachTargetingKey(key) {
          gptSlot.setTargeting(key, '');
        });
      });
    });
    logTimeEnd('Handling A9 Bids');
    done();
  }

  function preQueueCallback(asset, done) {
    logTime('A9 Slot Building');
    // Only sizes in this array will be sent in the request to Amazon.
    var validSizes = [ '160x600', '300x250', '300x600', '320x50', '728x90', '970x90', '970x250' ];
    // Any slot id with any of the following slot types will be excluded from the request to A9.
    var invalidMappings = [ '_ns_', '_nfs_' ];
    // Any slot with any of the following ad unit segments in the slot ad unit will be excluded from the request to A9.
    var invalidAdUnitSegments = [ 'super-ad-zone', 'super_ad_zone' ];
    var browser = getViewport();
    log('Browser Dimensions: ', browser);
    for (var x = 1; x < asset.length; x++) {
      var slotId = asset[x].originalElementId || asset[x].rktr_slot_id;
      var pieces = slotId.split('_');
      pieces.splice(0, 1);
      slotId = pieces.join('_');
      log('Checking slot and sizes for validity: ', slotId);
      var responsiveSizes = [];
      var isValid = true;
      var viewportChecked = false;
      for (var viewportId = 0; viewportId < asset[x].responsive.length; viewportId++) {
        var viewport = asset[x].responsive[viewportId];
        if (!viewportChecked) log('Checking For Responsive Viewport: ', viewport[0].join('x'));
        if (!viewportChecked && viewport[0][0] < browser[0] && viewport[0][1] < browser[1]) {
          log('Match found.');
          viewportChecked = true;
          responsiveSizes = viewport[1];
          if (viewport[1][0] === 'suppress' || responsiveSizes === 'suppress') {
            log('Slot is responsive and being suppressed.  Filtering slot.');
            isValid = false;
          }
        }
      }
      if (responsiveSizes.length > 0 && isValid) {
        log('Slot is responsive and not being suppressed.  Using responsive sizes: ', responsiveSizes);
        asset[x].sizes = responsiveSizes;
      }
      if (isValid) {
        for (var y = 0; y < asset[x].sizes.length; y++) {
          var size = asset[x].sizes[y].join('x');
          if (validSizes.indexOf(size) < 0) {
            log('Filtering out Invalid Size: ', size);
            asset[x].sizes.splice(y, 1);
            y = y - 1;
          }
        }
        if (asset[x].sizes.length === 0) {
          log('No Valid Sizes: ', asset[x].sizes);
          isValid = false;
        }
        for (var invalidMapping in invalidMappings) {
          if (asset[x].rktr_slot_id.indexOf(invalidMappings[invalidMapping]) >= 0) {
            log('Filtering out invalid slot type: ', invalidMappings[invalidMapping], asset[x]);
            isValid = false;
          }
        }
        for (var invalidAdUnitSegment in invalidAdUnitSegments) {
          if (asset[x].rktr_ad_id.indexOf(invalidAdUnitSegments[invalidAdUnitSegment]) >= 0) {
            log('Filtering out invalid ad unit segment: ', invalidAdUnitSegments[invalidAdUnitSegment], asset[x]);
            isValid = false;
          }
        }
        if (isValid) {
          log('Valid Slot: ', asset[x]);
          var obj = {slotID: asset[x].rktr_slot_id, sizes: asset[x].sizes};
          bidSlots.push(obj);
        }
      }
    }
    logTimeEnd('A9 Slot Building');
    function processBids(bids) {
      a9bids = bids;
      bidSlots = [];
      done();
    }
    if (bidSlots.length > 0) {
      window.apstag.fetchBids({
        slots: bidSlots,
        timeout: 750
      }, processBids);
    } else {
      log('No valid slots.');
    }
  }

  function preDispatchCallback(asset, done) {
    window.googletag.cmd.push(function _preDispatchCallbackFunc() {
      var gptSlots = window.googletag.pubads().getSlots();
      if (a9bids) handleA9Bids(a9bids, gptSlots, done);
      if (!a9bids) {
        log('No Bids.');
        done();
      }
    });
  }

  function preRefreshCallback(asset, done) {
    a9bids = null;
    logTime('Refreshing A9 Bids');
    window.apstag.fetchBids({
      slots: bidSlots,
      timeout: 750
    }, function _fetchBidsCallbackFunc(bids) {
      a9bids = bids;
      logTimeEnd('Refreshing A9 Bids');
      var gptSlots = window.googletag.pubads().getSlots();
      handleA9Bids(a9bids, gptSlots, done);
    });
  }

  function registerModuleWithAdFuel() {
    if (!blocked) {
      log('Registering ' + MODULE_NAME + ' module with AdFuel');
      window.AdFuel.setOptions({
        queueCallbackTimeoutInMilliseconds: 800,
        dispatchCallbackTimeoutInMilliseconds: 800,
        refreshCallbackTimeoutInMilliseconds: 800
      });
      metricApi = window.AdFuel.registerModule(MODULE_NAME, {
        preQueueCallback: preQueueCallback,
        preDispatchCallback: preDispatchCallback,
        preRefreshCallback: preRefreshCallback
      }) || metricApi;
    }
  }

  function configureA9Library() {
    var pubId = '3159';
    window.A9VideoAPI = {
      getTargetingData: getTargetingData,
      getRefreshedTargetingData: getRefreshedTargetingData
    };
    log('Defaulting to Domestic PubId.');
    log('Country Code: ', countryCode);
    log('Hostname: ', hostname);
    log('Pathname: ', pathname);
    log('Selected Edition: ', selectedEdition);
    if (hostname.search(/^(.*)?(edition|arabic)\./) >= 0) {
      log('Full international site. Using International PubId.');
      pubId = '3288';
    } else if (hostname.search(/^(.*)?money/) >= 0 && pathname === '/' && selectedEdition === 'edition') {
      log('International CNN Money Homepage. Using International PubId.');
      pubId = '3288';
    } else if (countryCode === '' || countryCode === null) {
      if (hostname.search(/^(.*)?(cnnespanol|cnne\-test)\./) >= 0) {
        log('No country code. Using International PubId.');
        pubId = '3288';
      }
    } else if (countryCode !== 'US' && countryCode !== 'CA') {
      if (hostname.search(/^(.*)?(money|cnnespanol|cnne\-test|www\.cnn)\./) >= 0) {
        log('International country code. Using International PubId.');
        pubId = '3288';
      }
    }
    // eslint-disable-next-line
    !(function (a9, a, p, s, t, A, g) {if (a[a9]) return; function q(c, r) {a[a9]._Q.push([c, r]);}a[a9] = {init: function () {q('i', arguments);}, fetchBids: function () {q('f', arguments);}, _Q: []}; A = p.createElement(s); A.async = !0; A.src = t; g = p.getElementsByTagName(s)[0]; g.parentNode.insertBefore(A, g);}('apstag', window, document, 'script', '//c.amazon-adsystem.com/aax2/apstag.js'));
    log('Final Pub ID: ', pubId);
    var bidTimeout = 500;
    var timeoutOverride = getURLParam('mdt');
    if (timeoutOverride) {
      bidTimeout = timeoutOverride;
      logger.log('Overriding Max Duration Time: ', bidTimeout);
    }
    var slotName = 'aps-preroll';
    var slotNameOverride = getURLParam('slotname');
    if (slotNameOverride) {
      slotName = slotNameOverride;
      logger.log('Overriding Slot Name: ', slotName);
    }
    window.apstag.init({
      pubID: pubId,
      adServer: 'googletag',
      videoAdServer: 'freeWheel',
      bidTimeout: 750
    });
    window.A9VideoAPI._targetingPromise = new Promise(function _targetingPromiseFunc(resolve) {
      window.apstag.fetchBids({
        slots: [
          {
            slotID: slotName,
            mediaType: 'video'
          }
        ],
        timeout: bidTimeout
      }, resolve);
    });
  }

  function init() {
    configureA9Library();
    if (window.AdFuel && window.AdFuel.cmd) {
      // AdFuel loaded first
      window.AdFuel.cmd.push(registerModuleWithAdFuel);
    } else if (window.AdFuel) {
      registerModuleWithAdFuel();
    } else {
      // wait for AdFuel to load
      if (document.addEventListener) {
        document.addEventListener('AdFuelCreated', registerModuleWithAdFuel, true);
      }
      if (document.attachEvent) {
        document.attachEvent('onAdFuelCreated', registerModuleWithAdFuel);
      }
    }
  }

  log('Initializing ' + MODULE_NAME + ' Module...');
  init();
})();


////////////////////////////////////////////
//AD Prebid for NBA 1.0
////////////////////////////////////////////

(function createPrebidAdFuelModule() {
  'use strict';
  var MODULE_NAME = 'Prebid';
  var MODULE_VERSION = 'v1.0.15';
  /*
  - Vendor Timeout to 750ms
  - AdFuel Timeout to 800ms
  */

  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  // BEGIN isMobile.js
  /**
       * @author: Kai Mallea (kmallea@gmail.com)
       * @license: http://creativecommons.org/publicdomain/zero/1.0/
       */
  var applePhone = /iPhone/i;
  var appleIpod = /iPod/i;
  var appleTablet = /iPad/i;
  var androidPhone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i; // Match 'Android' AND 'Mobile'
  var androidTablet = /Android/i;
  var amazonPhone = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i;
  var amazonTablet = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i;
  var windowsPhone = /Windows Phone/i;
  var windowsTablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i; // Match 'Windows' AND 'ARM'
  var otherBlackberry = /BlackBerry/i;
  var otherBlackberry10 = /BB10/i;
  var otherOpera = /Opera Mini/i;
  var otherChrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i;
  var otherFirefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i; // Match 'Firefox' AND 'Mobile'
  var sevenInch = new RegExp(
    '(?:' + // Non-capturing group
                  'Nexus 7' + // Nexus 7
                  '|' + // OR
                  'BNTV250' + // B&N Nook Tablet 7 inch
                  '|' + // OR
                  'Kindle Fire' + // Kindle Fire
                  '|' + // OR
                  'Silk' + // Kindle Fire, Silk Accelerated
                  '|' + // OR
                  'GT-P1000' + // Galaxy Tab 7 inch
                  ')', // End non-capturing group
    'i'); // Case-insensitive matching

  var match = function match(regex, userAgent) {
    return regex.test(userAgent);
  };

  var IsMobileClass = function IsMobileClass(userAgent) {
    var ua = userAgent || navigator.userAgent;

    // Facebook mobile app's integrated browser adds a bunch of strings that
    // match everything. Strip it out if it exists.
    var tmp = ua.split('[FBAN');
    if (typeof tmp[1] !== 'undefined') {
      ua = tmp[0];
    }

    // Twitter mobile app's integrated browser on iPad adds a "Twitter for
    // iPhone" string. Same probable happens on other tablet platforms.
    // This will confuse detection so strip it out if it exists.
    tmp = ua.split('Twitter');
    if (typeof tmp[1] !== 'undefined') {
      ua = tmp[0];
    }

    this.apple = {
      phone: match(applePhone, ua),
      ipod: match(appleIpod, ua),
      tablet: !match(applePhone, ua) && match(appleTablet, ua),
      device: match(applePhone, ua) || match(appleIpod, ua) || match(appleTablet, ua)
    };
    this.amazon = {
      phone: match(amazonPhone, ua),
      tablet: !match(amazonPhone, ua) && match(amazonTablet, ua),
      device: match(amazonPhone, ua) || match(amazonTablet, ua)
    };
    this.android = {
      phone: match(amazonPhone, ua) || match(androidPhone, ua),
      tablet: !match(amazonPhone, ua) && !match(androidPhone, ua) && (match(amazonTablet, ua) || match(androidTablet, ua)),
      device: match(amazonPhone, ua) || match(amazonTablet, ua) || match(androidPhone, ua) || match(androidTablet, ua)
    };
    this.windows = {
      phone: match(windowsPhone, ua),
      tablet: match(windowsTablet, ua),
      device: match(windowsPhone, ua) || match(windowsTablet, ua)
    };
    this.other = {
      blackberry: match(otherBlackberry, ua),
      blackberry10: match(otherBlackberry10, ua),
      opera: match(otherOpera, ua),
      firefox: match(otherFirefox, ua),
      chrome: match(otherChrome, ua),
      device: match(otherBlackberry, ua) || match(otherBlackberry10, ua) || match(otherOpera, ua) || match(otherFirefox, ua) || match(otherChrome, ua)
    };
    this.seven_inch = match(sevenInch, ua);
    this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

    // excludes 'other' devices and ipods, targeting touchscreen phones
    this.phone = this.apple.phone || this.android.phone || this.windows.phone;

    // excludes 7 inch devices, classifying as phone or tablet is left to the user
    this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

    if (typeof window === 'undefined') {
      return this;
    }
  };

  var instantiate = function instantiate() {
    var IM = new IsMobileClass();
    IM.Class = IsMobileClass;
    return IM;
  };

  var isMobile = instantiate();
  // END isMobile.js

  var objectProto = Object.prototype;
  var toString = objectProto.toString;
  var noop = function noop() {};

  var metricApi = {
    metrics: {},
    addMetric: noop,
    getMetricById: noop,
    getMetricsByType: noop,
    getMetricTypes: noop
  };

  function isFunction(object) {
    return toString.call(object) === '[object Function]';
  }

  function isObject(object) {
    var type = typeof object;
    return type === 'function' || type === 'object' && !!object;
  }

  function getURLParam(name) {
    var paramName = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regexS = '[\\?&]' + paramName + '=([^&#]*)';
    var regex = new RegExp(regexS);
    if (document.location.search) {
      var results = regex.exec(document.location.search);
      if (results) {
        return results[1];
      }
      return '';
    }
    return '';
  }

  function readCookie(name) {
    var lsSupport = false;
    var data = null;
    // Check for native support
    if (localStorage) {
      lsSupport = true;
    }

    // No value supplied, return value
    if (typeof value === 'undefined') {
      // Get value
      if (lsSupport) { // Native support
        data = localStorage.getItem(name);
      }
      if (!lsSupport || data === null) { // Use cookie
        data = readTheCookie(name);
      }

      // Try to parse JSON...
      try {
        data = JSON.parse(data);
      } catch (e) {
        // Do Nothing
      }
    }
    return data;
    function readTheCookie(key) {
      if (!document.cookie) {
        // there is no cookie, so go no further
        return null;
      }  // there is a cookie
      var ca = document.cookie.split(';');
      var nameEQ = key + '=';
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          // delete spaces
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
      return null;
    }
  }

  function getViewport() {
    var viewportWidth;
    var viewportHeight;
    if (typeof window.innerWidth !== 'undefined') {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    } else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth !== 0) {
      viewportWidth = document.documentElement.clientWidth;
      viewportHeight = document.documentElement.clientHeight;
    } else {
      viewportWidth = document.getElementsByTagName('body')[0].clientWidth;
      viewportHeight = document.getElementsByTagName('body')[0].clientHeight;
    }
    return [viewportWidth, viewportHeight];
  }

  var log = noop;
  var logTime = noop;
  var logTimeEnd = noop;

  if (isObject(window.console) && isFunction(window.console.log) && getURLParam('debug') === 'true') {
    log = function logFunction(/* arguments */) {
      var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ']'];
      args.push.apply(args, arguments);
      window.console.log.apply(window.console, args);
    };
    logTime = function logTimeFunction(/* arguments */) {
      var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ' TIMER] '];
      args.push.apply(args, arguments);
      var timeKey = args.join('');
      window.console.time(timeKey);
    };
    logTimeEnd = function logTimeEndFunction(/* arguments */) {
      var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ' TIMER] '];
      args.push.apply(args, arguments);
      var timeKey = args.join('');
      window.console.timeEnd(timeKey);
    };
  }

  var countryCode = (readCookie('CG') ? readCookie('CG').substr(0, 2) : '') || readCookie('countryCode');
  var selectedEdition = readCookie('SelectedEdition') ? readCookie('SelectedEdition') : 'www';
  var parser = document.createElement('a');
  parser.href = document.location.href;

  var hostname = parser.hostname;
  var pathname = parser.pathname;

  var isIntl = false;

  if (hostname.search(/^(.*)?(edition|arabic)\./) >= 0) {
    log('Full international site.');
    isIntl = true;
  } else if (hostname.search(/^(.*)?money/) >= 0 && pathname === '/' && selectedEdition === 'edition') {
    log('International CNN Money Homepage. Using International PubId.');
    isIntl = true;
  } else if (countryCode === '' || countryCode === null) {
    if (hostname.search(/^(.*)?(cnnespanol|cnne\-test)\./) >= 0) {
      log('No country code. Using International PubId.');
      isIntl = true;
    }
  } else if (countryCode !== 'US' && countryCode !== 'CA') {
    if (hostname.search(/^(.*)?(money|cnnespanol|cnne\-test|www\.cnn)\./) >= 0) {
      log('International country code. Using International PubId.');
      isIntl = true;
    }
  }

  var PREBID_TIMEOUT = 750;

  var DOMESTIC_BIDDERS = ['rubicon', 'appnexus'];

  var DOMESTIC_ACCOUNT_IDS = {
    rubicon: '11078',
    appnexus: '7745'
  };

  var RUBICON_ACCOUNT_ID = DOMESTIC_ACCOUNT_IDS.rubicon;
  var APPNEXUS_ACCOUNT_ID = DOMESTIC_ACCOUNT_IDS.appnexus;

  var RUBICON_DESKTOP_SITE_ID = 27048;
  var RUBICON_MOBILE_SITE_ID = 67294;

  var RUBICON_SIZE_MAPPING = {
    '728x90': 2,
    '160x600': 9,
    '300x600': 10,
    '300x250': 15,
    '320x50': 43,
    '970x90': 55,
    '970x250': 57
  };

  var RUBICON_DOMESTIC_DESKTOP_HP_ZONE_MAPPING = {
    'atf': 107850,
    'btf': 189024
  };

  var RUBICON_DOMESTIC_DESKTOP_ROS_ZONE_MAPPING = {
    'atf': 107852,
    'btf': 107854
  };

  var RUBICON_DOMESTIC_MOBILE_ZONE_MAPPING = {
    'atf': 317488,
    'btf': 317488
  };

  function preQueueCallback(asset, done) {
    logTime('Prebid AdUnit Building');
    // Only sizes in this array will be sent in the request to Amazon.
    var validSizes = [ '160x600', '300x250', '300x600', '320x50', '728x90', '970x90', '970x250' ];
    // Any slot id with any of the following slot types will be excluded from the request to A9.
    var invalidMappings = [ '_ns_', '_nfs_' ];
    // Any slot with any of the following ad unit segments in the slot ad unit will be excluded from the request to A9.
    var invalidAdUnitSegments = [ 'super-ad-zone', 'super_ad_zone' ];
    var browser = getViewport();
    log('Browser Dimensions: ', browser);
    var adUnits = [];
    log('Asset: ', asset);
    for (var x = 1; x < asset.length; x++) {
      var invCodeArray = asset[x].rktr_ad_id.split('/');
      var invCode = invCodeArray[0].toLowerCase() + (invCodeArray[1] ? '_' + invCodeArray[1].toLowerCase() : '');
      log('InvCode: ', invCode);
      var adUnitMock = {
        code: '',               // Div Id
        mediaTypes: {
          banner: {           // Always banner
            sizes: []      // Array of sizes
          }
        },
        bids: []                // Array of bid mocks
      };
      var bidMocks = {
        rubicon: {
          bidder: 'rubicon',                          // Fastlane (US and EU) and AppNexus (EU ONLY)
          params: {
            accountId: RUBICON_ACCOUNT_ID,          // Toggle based on location
            siteId: 26792,                          // Get From Mapping
            zoneId: 231942,                         // Get From Mapping
            position: 'btf'                        // Parse from Div Id
            // sizes: [2, 57],                         // Optional - Get From Mapping
            // keywords: [],                           // Optional - Get From External Source
            // inventory: [],                          // Optional - Get From External Source
            // visitor: { "search": ["iphone"]},       // Optional - Get From External Source
            // userId: '',                             // Optional - Get From External Source
            // floor: 0.50                             // Optional
          }
        },
        appnexus: {
          bidder: 'appnexus',
          params: {
            // placementId: asset.rktr_ad_id,          // Optional
            // allowSmallerSizes: false,               // Optional
            // keywords: { genre: ['rock', 'pop'] },   // Optional - Get From External Source
            invCode: invCode,                          // Top 3 Ad Unit levels + pos value
            member: APPNEXUS_ACCOUNT_ID                // Supplied from AppNexus
            // reserve: 0.90                           // Optional (Sets floor price)
          }
        }
      };
      log('Checking slot and sizes for validity: ', asset[x].rktr_slot_id || 'N/A');
      var responsiveSizes = [];
      var isValid = true;
      var viewportChecked = false;
      for (var viewportId = 0; viewportId < asset[x].responsive.length; viewportId++) {
        var viewport = asset[x].responsive[viewportId];
        if (!viewportChecked) log('Checking For Responsive Viewport: ', viewport[0].join('x'));
        if (!viewportChecked && viewport[0][0] < browser[0] && viewport[0][1] < browser[1]) {
          log('Match found.');
          viewportChecked = true;
          responsiveSizes = viewport[1];
          if (viewport[1][0] === 'suppress' || responsiveSizes === 'suppress') {
            log('Slot is responsive and being suppressed.  Filtering slot.');
            isValid = false;
          }
        }
      }
      if (responsiveSizes.length > 0 && isValid) {
        log('Slot is responsive and not being suppressed.  Using responsive sizes: ', responsiveSizes);
        asset[x].sizes = responsiveSizes;
      }
      log('Is Valid: ', isValid);
      if (isValid) {
        for (var y = 0; y < asset[x].sizes.length; y++) {
          var size = asset[x].sizes[y].join('x');
          if (validSizes.indexOf(size) < 0) {
            log('Filtering out Invalid Size: ', size);
            asset[x].sizes.splice(y, 1);
            y = y - 1;
          }
        }
        if (asset[x].sizes.length === 0) {
          log('No Valid Sizes: ', asset[x].sizes);
          isValid = false;
        }
        for (var invalidMapping in invalidMappings) {
          if (asset[x].rktr_slot_id.indexOf(invalidMappings[invalidMapping]) >= 0) {
            log('Filtering out invalid slot type: ', invalidMappings[invalidMapping], asset[x]);
            isValid = false;
          }
        }
        for (var invalidAdUnitSegment in invalidAdUnitSegments) {
          if (asset[x].rktr_ad_id.indexOf(invalidAdUnitSegments[invalidAdUnitSegment]) >= 0) {
            log('Filtering out invalid ad unit segment: ', invalidAdUnitSegments[invalidAdUnitSegment], asset[x]);
            isValid = false;
          }
        }
        log('Is Still Valid: ', isValid);
        if (isValid) {
          log('Yep... It\'s really still valid.');
          var sizeMapArray = [];
          log('Sizes: ', asset[x].sizes, asset[x].sizes.length);

          for (var sIndex = 0; sIndex < asset[x].sizes.length; sIndex++) {
            sizeMapArray.push(RUBICON_SIZE_MAPPING[asset[x].sizes[sIndex].join('x')]);
          }

          var posValue = '';
          var position = 'atf';

          var slotTargets = asset[x].targeting || [];
          log('slotTargets: ', slotTargets);

          for (var tIndex = 0; tIndex < slotTargets.length; tIndex++) {
            var target = slotTargets[tIndex];
            log('target: ', target);
            if (target[0] === 'pos') {
              log('yep... it\'s pos.');
              if (Array.isArray(target[1])) {
                log('yep... it\'s an array.');
                log('Setting POS for ' + asset[x].rktr_slot_id, target[1][0]);
                posValue = target[1][0];
                position = target[1][0].split('_')[1];
              } else {
                log('nope... not an array.');
                log('Setting POS for ' + asset[x].rktr_slot_id, target[1]);
                posValue = target[1];
                position = target[1].split('_')[1];
              }
            }
          }
          log('pos: ', posValue);
          log('position: ', position);

          var isHomepage = asset[x].rktr_ad_id.indexOf('/homepage') >= 0;
          log('Is Homepage: ', isHomepage);

          adUnitMock.code = asset[x].originalElementId || asset[x].rktr_slot_id;
          adUnitMock.mediaTypes.banner.sizes = asset[x].sizes;

          log('Starting AdUnitMock: ', JSON.parse(JSON.stringify(adUnitMock)));
          log('isIntl: ', isIntl);
          log('domestic bidders: ', DOMESTIC_BIDDERS, DOMESTIC_BIDDERS.length);
          for (var dbIndex = 0; dbIndex < DOMESTIC_BIDDERS.length; dbIndex++) {
            log('dbIndex: ', dbIndex);
            var domBidder = DOMESTIC_BIDDERS[dbIndex];
            log('bidder: ', domBidder);
            var domBidMock = bidMocks[domBidder];
            log('starting bidMock: ', JSON.parse(JSON.stringify(domBidMock)));
            switch (domBidder) {
            case 'rubicon':
              domBidMock.params.siteId = isMobile.any ? RUBICON_MOBILE_SITE_ID : RUBICON_DESKTOP_SITE_ID;
              if (isMobile.any) {
                domBidMock.params.zoneId = RUBICON_DOMESTIC_MOBILE_ZONE_MAPPING[position];
              } else {
                domBidMock.params.zoneId = isHomepage ? (
                  RUBICON_DOMESTIC_DESKTOP_HP_ZONE_MAPPING[position] || RUBICON_DOMESTIC_DESKTOP_ROS_ZONE_MAPPING[position]
                ) : RUBICON_DOMESTIC_DESKTOP_ROS_ZONE_MAPPING[position];
              }
              domBidMock.params.position = position;
              domBidMock.params.sizes = sizeMapArray;
              break;
            case 'appnexus':
              domBidMock.params.invCode = invCode + '_' + posValue;
              break;
            default:
              break;
            }
            log('ending bidMock: ', JSON.parse(JSON.stringify(domBidMock)));
            adUnitMock.bids.push(domBidMock);
          }
          log('Ending AdUnitMock: ', JSON.parse(JSON.stringify(adUnitMock)));
          adUnits.push(adUnitMock);
        }
      }
    }
    logTimeEnd('Prebid AdUnit Building');
    log('Final Ad Units: ', adUnits);
    var callbackExecuted = false;
    function pbQueueFunction() {
      log('Adding Ad Units...');
      window.pbjs.addAdUnits(adUnits);
      log('Requesting Bids...');
      logTime('Requesting Bids...');
      function bidsBackHandlerFunc(bids) {
        log('Bids: ', bids);
        logTimeEnd('Requesting Bids...');
        clearTimeout(window.fallbackTimeout);
        if (!callbackExecuted) {
          callbackExecuted = true;
          done();
        }
      }
      window.pbjs.requestBids({
        bidsBackHandler: bidsBackHandlerFunc
      });
      window.fallbackTimeout = setTimeout(function timeoutFunc() {
        clearTimeout(window.fallbackTimeout);
        if (!callbackExecuted) {
          log('Timed out...');
          callbackExecuted = true;
          done();
        }
      }, PREBID_TIMEOUT);
    }
    if (adUnits.length > 0) {
      window.pbjs.que.push(pbQueueFunction);
    }
  }

  function preDispatchCallback(asset, done) {
    log('Setting Targeting...');
    function innerFunc() {
      if (asset[0].rktr_slot_id.indexOf('_mod_') <= 0) {
        log('Page Slots: ', Object.keys(window.AdFuel.pageSlots));
        window.pbjs.setTargetingForGPTAsync();
      }
      done();
    }
    window.googletag.cmd.push(innerFunc);
  }

  function setGeoTargeting() {
    log('Setting GeoTargeting... ', countryCode);
    function setGeoTarget() {
      log('Setting Prebid Geo Target: ', isIntl ? 'EU' : 'US');
      window.AdFuel.addPageLevelTarget('hbg', isIntl ? 'EU' : 'US');
    }
    window.googletag.cmd.push(setGeoTarget);
  }


  function registerModuleWithAdFuel() {
    log('Registering ' + MODULE_NAME + ' module with AdFuel');
    window.AdFuel.setOptions({
      queueCallbackTimeoutInMilliseconds: 800
    });
    metricApi = window.AdFuel.registerModule(MODULE_NAME, {
      preQueueCallback: preQueueCallback,
      preDispatchCallback: preDispatchCallback
    }) || metricApi;
  }

  function configurePrebidLibrary() {
    window.pbjs = window.pbjs || {};
    window.pbjs.que = window.pbjs.que || [];
    var priceBuckets = {
      buckets: [{
        'precision': 2,
        'min': 0,
        'max': 5,
        'increment': 0.01
      }, {
        'precision': 2,
        'min': 5,
        'max': 30,
        'increment': 0.05
      }, {
        'precision': 2,
        'min': 30,
        'max': 50,
        'increment': 1.00
      }]
    };
    var innerFunc = function _innerFunc() {
      log('Setting config...', {buckets: priceBuckets, debug: true, enableSendAllBids: true, bidderTimeout: PREBID_TIMEOUT});
      window.pbjs.setConfig({
        // -- Re-enable these lines for Prebid-Server --
        /*
                    s2sConfig: {
                        accountId: 'f7c6e556-48f6-4b8c-9fb6-921c12c9362f',
                        bidders: ['rubicon'],
                        defaultVendor: 'appnexus',
                        enabled: true,
                        timeout: PREBID_TIMEOUT,
                        adapter: 'prebidServer'
                    },
                    */
        priceGranularity: priceBuckets,
        enableSendAllBids: true,
        bidderTimeout: PREBID_TIMEOUT
      });
      window.pbjs.bidderSettings = {
        rubicon: {
          alwaysUseBid: true,
          adserverTargeting: [{
            key: 'hb_db_rubicon',
            val: function bidResponseFunc(bidResponse) {
              var keyvalue;
              if (bidResponse.adserverTargeting && bidResponse.adserverTargeting.rpfl_11078) {
                keyvalue = bidResponse.adserverTargeting.rpfl_11078;
              } else if (bidResponse.rubiconTargeting && bidResponse.rubiconTargeting.rpfl_11078) {
                keyvalue = bidResponse.rubiconTargeting.rpfl_11078;
              } else {
                return null;
              }
              var dealTier = keyvalue.substring(keyvalue.indexOf('_') + 1);
              return dealTier;
            }
          }]
        }
      };
      setGeoTargeting();
    };
    window.pbjs.que.push(innerFunc);
    if (!document.getElementById('PrebidScript')){
      var a = document;
      var b = a.createElement('script');
      var c = a.getElementsByTagName('script')[0];
      b.type = 'text/javascript';
      b.id = "PrebidScript";
      b.src = '//i.cdn.turner.com/ads/adfuel/modules/prebid-1.23.0.js';
      c.parentNode.insertBefore(b, c);
    }
    var timeoutOverride = getURLParam('mdt');
    if (timeoutOverride) {
      PREBID_TIMEOUT = timeoutOverride;
      log('Overriding Max Duration Time: ', PREBID_TIMEOUT);
    }
  }

  function init() {
    configurePrebidLibrary();
    if (window.AdFuel && window.AdFuel.cmd) {
      // AdFuel loaded first
      window.AdFuel.cmd.push(registerModuleWithAdFuel);
    } else if (window.AdFuel) {
      registerModuleWithAdFuel();
    } else {
      // wait for AdFuel to load
      if (document.addEventListener) {
        document.addEventListener('AdFuelCreated', registerModuleWithAdFuel, true);
      }
      if (document.attachEvent) {
        document.attachEvent('onAdFuelCreated', registerModuleWithAdFuel);
      }
    }
  }

  log('Initializing ' + MODULE_NAME + ' Module...');
  init();
})();


////////////////////////////////////////////
//Amazon-Video 1.0
////////////////////////////////////////////

/*! Amazon Video Module
  - Initial Implementation
*/
window.AmazonDirectMatchBuy = (function CreateAmazonModule() {

    var arrayProto = Array.prototype;
    var objectProto = Object.prototype;

    var hasOwnProperty = objectProto.hasOwnProperty;
    var slice = arrayProto.slice;
    var toString = objectProto.toString;

    function hasOwn(object, key) {
        return object != null && hasOwnProperty.call(object, key);
    }

    function isFunction(object) {
        return toString.call(object) === '[object Function]';
    }

    function isObject(object) {
        var type = typeof object;
        return type === 'function' || type === 'object' && !!object;
    }

    function once(fn) {
        return function() {
            if (fn) {
                fn.apply(this, arguments);
                fn = null;
            }
        };
    }

    function getURLParam(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        if (document.location.search) {
            var results = regex.exec(document.location.search);
            if (results) {
                return results[1];
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    var log = function() {}; //noop

    if (isObject(window.console) && isFunction(window.console.log) && getURLParam("debug") == "true") {
        log = function( /* arguments */ ) {
            var args = ['[AdFuelModule - Amazon Video]'];
            args.push.apply(args, arguments);
            window.console.log.apply(window.console, args);
        };
    }

    function readCookie(name) {
        
        var lsSupport = false;
        var data = null;
        // Check for native support
        if (localStorage) {
            lsSupport = true;
        }

        // No value supplied, return value
        if (typeof value === "undefined") {
            // Get value
            if (lsSupport) { // Native support
                data = localStorage.getItem(name);
            }
            if (!lsSupport || data === null) { // Use cookie
                data = readTheCookie(name);
            }

            // Try to parse JSON...
            try {
                data = JSON.parse(data);
            }
            catch(e) {
                data = data;
            }

            return data;

        }
        /**
         * Returns contents of cookie
         * @param  key       The key or identifier for the store
         */
        function readTheCookie(key) {
            if (!document.cookie) {
                // there is no cookie, so go no further
                return '';
            } else { // there is a cookie
                var ca = document.cookie.split(';');
                var nameEQ = name + "=";
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        //delete spaces
                        c = c.substring(1, c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }
                return '';
            }
        }

    };
    var countryCode = (readCookie('CG') ? readCookie('CG').substr(0, 2) : '') || readCookie("countryCode");
    log("Country Code: ", countryCode);
    var hostname = window.location.hostname.toLowerCase();    
    var amznkey = '3159';
    if (countryCode == '' || countryCode == null){
        if (hostname.search(/^(edition|arabic|cnnespanol|cnne\-test)\./) >= 0){
            amznkey = '3288';
        }
    }else if (countryCode !== 'US' && countryCode !== 'CA'){
        if (hostname.search(/^(money|edition|arabic|cnnespanol|cnne\-test|www\.cnn)\./) >= 0){
            amznkey = '3288';
        }
    }

    var timeoutForGetAdsCallback = 1000; //1 second
    var initialized = false;

    function isAmazonApiAvailable() {
        return !!window.amznads;
    }

    function getTargetingData() {
        var data = {};

        if (isAmazonApiAvailable()) {
            data = window.amznads.getTargeting();
            if (!isObject(data)) {
                data = {};
            }
        }

        return data;
    }

    var keyMap = (function() {
        var map = {};

        function has(id) {
            return id in map;
        }

        function addKey(id, key) {
            if (!has(id)) {
                map[id] = [];
            }

            map[id].push(key);
        }

        function getKeys(id) {
            return has(id) ? slice.call(map[id]) : [];
        }

        function clearKeys(id) {
            if (has(id)) {
                map[id].length = 0;
                return true;
            }
            return false;
        }

        return ({
            has: has,
            clearKeys: clearKeys,
            getKeys: getKeys,
            addKey: addKey
        });
    }());

    function clearPreviousKeyValuePairs(player) {
        var playerId = player.getId();

        if (keyMap.has(playerId)) {
            var keys = keyMap.getKeys(playerId);
            if (keys.length) {
                log('clearing previous ad key-values: ' + keys.join(', '));

                for (var i = 0, endi = keys.length; i < endi; ++i) {
                    player.setAdKeyValue(keys[i], null);
                }

                keyMap.clearKeys(playerId);
            }
        }
    }

    function setAdKeyValue(player, key, value) {
        log('setting ad key-value: ' + key + ' = "' + value + '"');

        keyMap.addKey(player.getId(), key);
        player.setAdKeyValue(key, value);
    }

    function handleTargetingData(player) {
        var targeting = getTargetingData();

        // Clear previous key-value pairs.
        clearPreviousKeyValuePairs(player);

        // Set new key-value pairs.
        for (var key in targeting) {
            if (!hasOwn(targeting, key)) continue;

            var val = targeting[key];

            if (val instanceof Array) {
                // val = val.join(',');
                for (var i = 0, endi = val.length; i < endi; ++i) {
                    setAdKeyValue(player, val[i], "1");
                }
            } else {
                setAdKeyValue(player, key, val);
            }
        }
    }

    //this is only called by the CVP object
    function setAdKeyValuePairs(player) {
        if (player.getPlayerType() !== CVP.FLASH) return;

        log('setAdKeyValuePairs', player);
        handleTargetingData(player);
    }

    function refreshTargets(callback) {
        //remove amznslots

        if (!isAmazonApiAvailable()) {
            return (callback ? callback() : true);
        }

        var callbackWrapper = once(function() {
            //amazon has refreshed, update AdFuel targeting
            var targeting = window.amznads.getTargeting();
            return (callback ? callback() : true);
        });

        try {
            window.amznads.getAdsCallback(amznkey, callbackWrapper, timeoutForGetAdsCallback);
        } catch (e) {
            log('Exception thrown while requesting Amazon ads:', e);
            // manually execute callback if it hasn't run
            callbackWrapper();
        }
    }

    /* allows optional configuration:
      
        amznkey: Turner's Amazon key (default is '3159')
        timeout: duration in milliseconds for Amazon to call GetAdsCallback (default is 2000)
    */
    function init(config) {
        log('initializing', config);
        if (config) {
            //allow overrides
            amznkey = config.amznkey || amznkey;
            timeoutForGetAdsCallback = config.timeout || timeoutForGetAdsCallback;
        }
        initialized = true;
    }

    function requireInit(fn) {
        return function() {
            if (!initialized) {
                log('ERROR: init() must be called first!');
                return;
            }

            fn.apply(this, arguments);
        };
    }

    return ({
        requestAdRefresh: requireInit(refreshTargets),
        getTargetingData: requireInit(getTargetingData),
        setAdKeyValuePairs: requireInit(setAdKeyValuePairs),
        isAmazonApiAvailable: isAmazonApiAvailable,
        init: init
    });

}());
(function(callback) {
    var a = document,
        b = a.createElement("script"),
        c = a.getElementsByTagName("script")[0],
        d = /^(complete|loaded)$/,
        e = false;
    b.type = "text/javascript";
    b.async = true;
    b.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') + '//c.amazon-adsystem.com/aax2/amzn_ads.js';
    b.onload = b.onreadystatechange = function() {
        if (!e && !(('readyState' in b) && d.test(b.readyState))) {
            b.onload = b.onreadystatechange = null;
            e = true;
            callback();
        }
    };
    if (window.amznads) {
        callback();
    } else {
        c.parentNode.insertBefore(b, c);
    }
})(function() {
    window.AmazonDirectMatchBuy.init();
});

////////////////////////////////////////////
//Console Tool 2.2
////////////////////////////////////////////

/*! Console Tool & Creative Review v2.2.2
    - Added Hashchange Listener for Mobile Use Testing
    - Changed Creative Review hotkey
    - Updated to DHTMLXGrid to minified.
    - Fix for slotRenderEnded event
    - Update to post to adfuel.turnerapps.com
*/
(function createConsoleToolModule() {
    var noop = function () {
        return false;
    };
    var metricApi = {
        metrics: {},
        addMetric: noop,
        getMetricById: noop,
        getMetricsByType: noop,
        getMetricTypes: noop
    };
    var MODULE_NAME = 'Console Tool/Creative Review'
    var _consoleRendered = false;
    var _registeredTabs = [];
    var _timelineGrid;
    var overlaysHidden = true;
    //var h2cCanvas;
    //var h2cDone = false;
    //var _screenshotGenerated = false;
    var fullConsole = false;

    // Check for the various File API support.
    var fileUploadOK = (window.File && window.FileReader && window.FileList && window.Blob);

    var _showTempAds = [];
    var _hideTempAds = [];

    function checkHash() {
        if (location.hash.indexOf('^doh$') >= 0) {
            fullConsole = false;
            if (_consoleRendered) {
                _renderAdFuelConsole();
            }
            _renderAdFuelConsole();
        } else if (location.hash.indexOf('^afc$') >= 0) {
            fullConsole = true;
            if (_consoleRendered) {
                _renderAdFuelConsole();
            }
            _renderAdFuelConsole();
        } else if (_consoleRendered) {
            _renderAdFuelConsole();
        }
    }

    function addEvent(element, event, fn) {
        if (element.addEventListener) {
            return element.addEventListener(event, fn, true);
        } else if (element.attachEvent) {
            return element.attachEvent('on' + event, fn);
        }
    }

    var objectProto = Object.prototype;
    var toString = objectProto.toString;
    var hostname = document.location.hostname;
    var cdnRoot = hostname.indexOf('cnn.com') >= 0 ? 'i.cdn.cnn.com' : 'i.cdn.turner.com';

    function checkbox(name, value, text) {
        var el = document.createElement('div');
        el.style.width = '48%';
        el.style['float'] = 'left';
        el.style.display = 'inline-block';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.name = name;
        cb.id = name + '_' + value;
        cb.style['float'] = 'left';
        cb.style['margin-right'] = '2px';
        cb.style['position'] = 'relative';
        cb.style['top'] = '3px';
        cb.value = value;
        var lab = document.createElement('div');
        lab.style.width = 'calc(100% - 18px)';
        lab.appendChild(document.createTextNode(text));
        el.appendChild(cb);
        el.appendChild(lab);
        return el;
    }

    function element(name, text) {
        var el = document.createElement(name);
        el.appendChild(document.createTextNode(text));
        return el;
    }

    function button(item) {
        var el = document.createElement('button');
        el.onclick = item.action;
        el.id = item.name;
        el.appendChild(document.createTextNode(item.value));
        el.className = 'btn btn-sm btn-primary';
        return el;
    }

    function compare(a, b) {
        if (a.data[2] < b.data[2])
            return -1;
        else if (a.data[2] > b.data[2])
            return 1;
        else
            return 0;
    }

    function isValidURL(str) {
        var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
        if (!pattern.test(str)) {
            return false;
        } else {
            return true;
        }
    }

    function isFunction(object) {
        return toString.call(object) === '[object Function]';
    }

    function isObject(object) {
        var type = typeof object;
        return type === 'function' || type === 'object' && !!object;
    }

    function getURLParam(name) {
        name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var regexS = '[\\?&]' + name + '=([^&#]*)';
        var regex = new RegExp(regexS);
        if (document.location.search) {
            var results = regex.exec(document.location.search);
            if (results) {
                return results[1];
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    function getViewport() {
        logTime('Getting Viewport Dimensions');
        var viewPortWidth;
        var viewPortHeight;
        if (typeof window.innerWidth !== 'undefined') {
            viewPortWidth = window.innerWidth,
            viewPortHeight = window.innerHeight;
        } else if (typeof document.documentElement !== 'undefined' && typeof document
            .documentElement.clientWidth !== 'undefined' && document.documentElement
                .clientWidth !== 0) {
            viewPortWidth = document.documentElement.clientWidth,
            viewPortHeight = document.documentElement.clientHeight;
        } else {
            viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
            viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
        }
        logTimeEnd('Getting Viewport Dimensions');
        return [viewPortWidth, viewPortHeight];
    }

    function getBrowser() {
        logTime('Getting Browser Information');
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem !== null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) !== null) M.splice(1, 1, tem[1]);
        logTimeEnd('Getting Browser Information');
        return M.join(' ');
    }

    var log = noop;
    var logTime = noop;
    var logTimeEnd = noop;

    if (isObject(window.console) && isFunction(window.console.log) && getURLParam('debug') == 'true') {
        log = function (/* arguments */) {
            var args = ['[AdFuelModule - ' + MODULE_NAME + ']'];
            args.push.apply(args, arguments);
            window.console.log.apply(window.console, args);
        };
        logTime = function (/* arguments */) {
            var args = ['[AdFuelModule - ' + MODULE_NAME + ' TIMER] '];
            args.push.apply(args, arguments);
            var timeKey = args.join('');
            window.console.time(timeKey);
        };
        logTimeEnd = function (/* arguments */) {
            var args = ['[AdFuelModule - ' + MODULE_NAME + ' TIMER] '];
            args.push.apply(args, arguments);
            var timeKey = args.join('');
            window.console.timeEnd(timeKey);
        };
    }

    var isMobile = false;
    /**
     * isMobile.js v0.4.1
     *
     * A simple library to detect Apple phones and tablets,
     * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
     * and any kind of seven inch device, via user agent sniffing.
     *
     * @author: Kai Mallea (kmallea@gmail.com)
     *
     * @license: http://creativecommons.org/publicdomain/zero/1.0/
     */
    var apple_phone = /iPhone/i,
        apple_ipod = /iPod/i,
        apple_tablet = /iPad/i,
        android_phone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
        android_tablet = /Android/i,
        amazon_phone = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        amazon_tablet = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        windows_phone = /Windows Phone/i,
        windows_tablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
        other_blackberry = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera = /Opera Mini/i,
        other_chrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        other_firefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
        seven_inch = new RegExp(
            '(?:' + // Non-capturing group

            'Nexus 7' + // Nexus 7

            '|' + // OR

            'BNTV250' + // B&N Nook Tablet 7 inch

            '|' + // OR

            'Kindle Fire' + // Kindle Fire

            '|' + // OR

            'Silk' + // Kindle Fire, Silk Accelerated

            '|' + // OR

            'GT-P1000' + // Galaxy Tab 7 inch

            ')', // End non-capturing group

            'i'); // Case-insensitive matching

    var match = function (regex, userAgent) {
        return regex.test(userAgent);
    };

    var IsMobileClass = function (userAgent) {
        var ua = userAgent || navigator.userAgent;

        // Facebook mobile app's integrated browser adds a bunch of strings that
        // match everything. Strip it out if it exists.
        var tmp = ua.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        // Twitter mobile app's integrated browser on iPad adds a "Twitter for
        // iPhone" string. Same probable happens on other tablet platforms.
        // This will confuse detection so strip it out if it exists.
        tmp = ua.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        this.apple = {
            phone: match(apple_phone, ua),
            ipod: match(apple_ipod, ua),
            tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
        };
        this.amazon = {
            phone: match(amazon_phone, ua),
            tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua)
        };
        this.android = {
            phone: match(amazon_phone, ua) || match(android_phone, ua),
            tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
        };
        this.windows = {
            phone: match(windows_phone, ua),
            tablet: match(windows_tablet, ua),
            device: match(windows_phone, ua) || match(windows_tablet, ua)
        };
        this.other = {
            blackberry: match(other_blackberry, ua),
            blackberry10: match(other_blackberry_10, ua),
            opera: match(other_opera, ua),
            firefox: match(other_firefox, ua),
            chrome: match(other_chrome, ua),
            device: match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
        };
        this.seven_inch = match(seven_inch, ua);
        this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

        // excludes 'other' devices and ipods, targeting touchscreen phones
        this.phone = this.apple.phone || this.android.phone || this.windows.phone;

        // excludes 7 inch devices, classifying as phone or tablet is left to the user
        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

        if (typeof window === 'undefined') {
            return this;
        }
    };

    var instantiate = function () {
        var IM = new IsMobileClass();
        IM.Class = IsMobileClass;
        return IM;
    };

    var deviceInfo = null;
    var activeCRPanel = 1;

    function setDevice() {
        if (deviceInfo !== null) {
            return deviceInfo
        }
        logTime('Getting Device Information');
        isMobile = instantiate();
        var viewport = getViewport();
        deviceInfo = {
            availHeight: screen.availHeight,
            availLeft: screen.availLeft,
            availTop: screen.availTop,
            availWidth: screen.availWidth,
            colorDepth: screen.colorDepth,
            height: screen.height,
            orientation: {
                angle: screen.orientation ? screen.orientation.angle : 0,
                onchange: screen.orientation ? screen.orientation.onchange : null,
                type: screen.orientation ? screen.orientation.type : null
            },
            pixelDepth: screen.pixelDepth,
            width: screen.width,
            os: window.navigator.platform ? window.navigator.platform : 'Unknown',
            browser: getBrowser(),
            class: 'Desktop',
            viewport: viewport.join('x')
        };
        if (isMobile.amazon.device) {
            deviceInfo.os = 'Amazon';
            if (isMobile.amazon.phone) {
                deviceInfo.class = 'Phone';
            }
            if (isMobile.amazon.tablet) {
                deviceInfo.class = 'Tablet';
            }
        }
        if (isMobile.android.device) {
            deviceInfo.os = 'Android';
            if (isMobile.android.phone) {
                deviceInfo.class = 'Phone';
            }
            if (isMobile.android.tablet) {
                deviceInfo.class = 'Tablet';
            }
        }
        if (isMobile.apple.device) {
            deviceInfo.os = 'iOS';
            if (isMobile.apple.ipod) {
                deviceInfo.class = 'iPod';
            }
            if (isMobile.apple.phone) {
                deviceInfo.class = 'Phone';
            }
            if (isMobile.apple.tablet) {
                deviceInfo.class = 'Tablet';
            }
        }
        if (isMobile.windows.device) {
            deviceInfo.os = 'Windows';
            if (isMobile.windows.phone) {
                deviceInfo.class = 'Phone';
            }
            if (isMobile.windows.tablet) {
                deviceInfo.class = 'Tablet';
            }
        }
        if (isMobile.other.blackberry) {
            deviceInfo.os = 'Blackberry';
            deviceInfo.class = 'Phone';
        }
        if (isMobile.other.blackberry10) {
            deviceInfo.os = 'Blackberry10';
            deviceInfo.class = 'Phone';
        }
        if (isMobile.other.chrome) {
            deviceInfo.os = 'Chrome';
            deviceInfo.class = 'Phone';
        }
        if (isMobile.other.firefox) {
            deviceInfo.os = 'Firefox';
            deviceInfo.class = 'Phone';
        }
        if (isMobile.other.opera) {
            deviceInfo.os = 'Opera';
            deviceInfo.class = 'Phone';
        }

        metricApi.addMetric({
            type: 'modules',
            id: 'User Sciences',
            data: deviceInfo
        });
        logTimeEnd('Getting Device Information');
        return deviceInfo
    }

    function _renderAdFuelConsole() {
        var head = document.getElementsByTagName('head')[0];
        var body = document.getElementsByTagName('body')[0];
        if (!_consoleRendered) {
            var protocol = 'https:' === document.location.protocol;

            var iconStylesheet = document.createElement('link');
            iconStylesheet.type = 'text/css';
            iconStylesheet.rel = 'stylesheet';
            iconStylesheet.href = (protocol ? 'https:' : 'http:') + '//fonts.googleapis.com/icon?family=Material+Icons';
            iconStylesheet.id = 'material-icons-font';

            var consoleStylesheet = document.createElement('link');
            consoleStylesheet.rel = 'stylesheet';
            consoleStylesheet.href = (protocol ? 'https:' : 'http:') + '//'+cdnRoot+'/ads/adfuel/modules/consoleTool-2.1.css';
            // consoleStylesheet.   href = '/css/consoleTool-2.1.css';
            consoleStylesheet.id = 'adfuel-console-stylesheet';

            var dataTableStylesheet = document.createElement('link');
            dataTableStylesheet.rel = 'stylesheet';
            dataTableStylesheet.href = (protocol ? 'https:' : 'http:') + '//'+cdnRoot+'/ads/adfuel/modules/dhtmlxgrid.css';
            dataTableStylesheet.id = 'adfuel-console-table-stylesheet';

            var container = document.createElement('div');
            container.className = 'adfuel-console-button-container adfuel-open-console-button-container';

            var actionButton = document.createElement('a');
            actionButton.className = 'adfuel-console-button';

            var buttonIcon = document.createElement('i');
            buttonIcon.className = 'adfuel-console-button-icon material-icons';
            buttonIcon.innerHTML = 'view_module';
            buttonIcon.innerText = 'view_module';

            var adFuelConsoleFiller = document.createElement('div');
            adFuelConsoleFiller.className = 'adfuel-console-filler';

            var adFuelConsoleContainer = document.createElement('div');
            adFuelConsoleContainer.className = 'adfuel-console';

            actionButton.appendChild(buttonIcon);
            container.appendChild(actionButton);
            head.appendChild(iconStylesheet);
            head.appendChild(consoleStylesheet);
            head.appendChild(dataTableStylesheet);
            body.appendChild(container);
            body.appendChild(adFuelConsoleFiller);
            body.appendChild(adFuelConsoleContainer);
            (function (callback) {
                'use strict';
                var a = document,
                    b = a.createElement('script'),
                    c = a.getElementsByTagName('script')[0],
                    d = /^(complete|loaded)$/,
                    e = false,
                    f = 'https:' === document.location.protocol;
                b.type = 'text/javascript';
                b.async = true;
                b.src = (f ? 'https:' : 'http:') + '//www.geoplugin.net/javascript.gp';
                b.onload = b.onreadystatechange = function () {
                    if (!e && !(('readyState' in b) && d.test(b.readyState))) {
                        b.onload = b.onreadystatechange = null;
                        e = true;
                        callback();
                    }
                };
                c.parentNode.insertBefore(b, c);
            })(function () {
                var geoCountry, geoCity, geoRegion, geoLat, geoLong;
                var valueSet = false;
                if (window.geoplugin_countryCode) {
                    geoCountry = window.geoplugin_countryCode();
                    valueSet = true;
                }
                if (window.geoplugin_city) {
                    geoCity = window.geoplugin_city();
                    valueSet = true;
                }
                if (window.geoplugin_region) {
                    geoRegion = window.geoplugin_region();
                    valueSet = true;
                }
                if (window.geoplugin_latitude) {
                    geoLat = window.geoplugin_latitude();
                    valueSet = true;
                }
                if (window.geoplugin_longitude) {
                    geoLong = window.geoplugin_longitude();
                    valueSet = true;
                }
                if (valueSet === true) {
                    metricApi.addMetric({
                        type: 'configuration',
                        id: 'actual_user_location',
                        data: {
                            city: geoCity,
                            region: geoRegion,
                            country: geoCountry,
                            latitude: geoLat,
                            longitude: geoLong
                        }
                    });
                }
            });

            _buildAdFuelConsoleContainer(adFuelConsoleContainer);

            addEvent(actionButton, 'click', _openAdFuelConsole);
            _consoleRendered = true;
        } else {
            var iconStylesheet = document.getElementById('material-icons-font');
            var consoleStylesheet = document.getElementById('adfuel-console-stylesheet');

            var container = document.querySelector('div.adfuel-console-button-container');
            var adFuelConsoleFiller = document.querySelector('div.adfuel-console-filler');
            var adFuelConsoleContainer = document.querySelector('div.adfuel-console');

            head.removeChild(iconStylesheet);
            head.removeChild(consoleStylesheet);

            body.removeChild(container);
            body.removeChild(adFuelConsoleFiller);
            body.removeChild(adFuelConsoleContainer);
            _consoleRendered = false;
        }
    }

    function _openAdFuelConsole() {

        var adFuelConsoleFiller = document.querySelector('div.adfuel-console-filler');
        var adFuelConsoleContainer = document.querySelector('div.adfuel-console');

        var openContainer = document.querySelector('div.adfuel-console-button-container');
        var closeContainer = document.querySelector('div#adfuel-close-console-button-container');

        openContainer.style.display = 'none';
        closeContainer.style.display = 'inline-block';
        adFuelConsoleFiller.style.display = 'block';
        adFuelConsoleFiller.className = adFuelConsoleFiller.className + ' resizable';
        adFuelConsoleContainer.style.display = 'inline-block';
        adFuelConsoleContainer.style.resize = 'both';
        adFuelConsoleContainer.className = adFuelConsoleContainer.className + ' resizable';
        log('Opening AdFuel Console.');
        _buildAdFuelConsoleTabs(document.getElementsByClassName('adfuel-console-tab-link-container')[0]);
        _buildAdFuelConsoleContent(adFuelConsoleContainer);
        log('Full Console: ', fullConsole);
        _showAdFuelConsoleContent(fullConsole ? 'configuration' : 'creative review');

        return;
    }

    function _showAdFuelConsoleHelp() {
        window.open('http://docs.turner.com/display/DAD/AdFuel+Console+Documentation', 'ConsoleHelp');
    }

    function _toggleOverlays() {
        if (overlaysHidden) {
            var adElements = document.querySelectorAll('.adfuel-rendered');

            var len = adElements.length;

            for (var i = 0; i < len; i++) {
                var pId = adElements[i].id;

                var p = document.getElementById(pId);
                p.style.position = 'relative';

                var width = p.firstElementChild.firstElementChild ? p.firstElementChild.firstElementChild.width : p.firstElementChild.width;
                var height = p.firstElementChild.firstElementChild ? p.firstElementChild.firstElementChild.height : p.firstElementChild.height;

                p.style.width = width + 'px';
                p.style.height = height + 'px';

                var pos = pId.substring(pId.indexOf('_') + 1);

                var d = document.createElement('div');
                var text = document.createElement('p');
                text.innerHTML = 'Pos: ' + pos + '<br />Width: ' + width + '<br />Height: ' + height;

                d.className = 'pos_overlay';
                d.style.position = 'absolute';
                d.style.top = '0';
                d.style.left = '0';
                d.style.right = '0';
                d.style.bottom = '0';
                d.style.textAlign = 'left';
                d.style.padding = '3px';
                d.style.fontFamily = 'Verdana';
                d.style.fontSize = '12px';
                d.style.fontWeight = 'normal';
                d.style.lineHeight = '12px';
                d.style.background = 'rgba(0,100,0,0.7)';
                d.style.color = '#ffffff';
                d.style.zIndex = '1000';

                d.appendChild(text);
                p.appendChild(d);

                //elements[i].style.border = "5px solid red";
            }
            overlaysHidden = false;
        } else {
            var o_els = document.querySelectorAll('.pos_overlay');
            var len = o_els.length;

            for (i = 0; i < len; i++) {
                o_els[i].parentNode.removeChild(o_els[i]);
            }
            overlaysHidden = true;
        }
    }

    var metricTypes = metricApi.getMetricTypes() || {};

    function capitalizeFirstLetter(string) {
        string = string.toString();
        var splitString = string.split(' ');
        var returnString = '';
        if (splitString.length > 1) {
            for (var x = 0; x < splitString.length; x++) {
                var temp = splitString[x].charAt(0).toUpperCase() + splitString[x].slice(1);
                splitString[x] = temp;
            }
            returnString = splitString.join(' ');
        } else {
            returnString = string.charAt(0).toUpperCase() + string.slice(1);
        }
        return returnString;
    }

    function _buildAdFuelConsoleTabs(container) {
        log('Building Console Tabs...', container);
        if (!container) {
            container = document.getElementsByClassName('adfuel-console-tab-link-container')[0];
        }
        if (!container) {
            log('Error: No tab link container.');
            return false;
        }
        var tabList = document.getElementsByClassName('adfuel-console-tab-list')[0];
        if (tabList) {
            var parent = tabList.parentNode;
            parent.removeChild(tabList);
        }

        var consoleTabList = document.createElement('ul');
        consoleTabList.className = 'adfuel-console-tab-list';
        metricTypes = metricApi.getMetricTypes();
        metricTypes.sort();
        function showContent(event) {
            var tabname = event.srcElement ? event.srcElement.rel : event.target.rel;
            _showAdFuelConsoleContent(tabname);
        }
        for (var i = 0; i < metricTypes.length; i++) {
            if (metricTypes[i].indexOf('_') != 0 && metricTypes[i] !== 'watchers') {
                var consoleTabItem = document.createElement('li');
                //consoleTabItem.style.display = "inline-block";
                log('Full Console: ', fullConsole);
                consoleTabItem.style.display = fullConsole ? 'inline-block' : 'none';
                if (metricTypes[i] === 'creative review') {
                    consoleTabItem.style.display = 'none';
                }
                consoleTabItem.style.marginLeft = '15px';
                consoleTabItem.style.marginRight = 'auto';
                consoleTabItem.style.fontSize = '.8em';
                consoleTabItem.style.paddingBottom = '10px';
                var consoleTabLink = document.createElement('a');
                consoleTabLink.className = 'afcTab';
                if (i === 0) consoleTabLink.className = 'activeAFCTab afcTab';
                consoleTabLink.rel = metricTypes[i];
                addEvent(consoleTabLink, 'click', showContent);
                consoleTabLink.appendChild(document.createTextNode(capitalizeFirstLetter(metricTypes[i])));
                consoleTabItem.appendChild(consoleTabLink);
                consoleTabList.appendChild(consoleTabItem);
            }
        }

        container.appendChild(consoleTabList);
    }

    function _buildAdFuelConsoleContainer(container) {

        var closeContainer = document.createElement('div');
        closeContainer.className = 'adfuel-console-button-container';
        closeContainer.id = 'adfuel-close-console-button-container';

        var actionButton = document.createElement('a');
        actionButton.className = 'adfuel-console-button-plain';
        actionButton.id = 'adfuel-close-console-button';

        var buttonIcon = document.createElement('i');
        buttonIcon.className = 'adfuel-console-button-icon material-icons';
        buttonIcon.innerHTML = buttonIcon.innerText = 'close';

        var resizeButton = document.createElement('a');
        resizeButton.className = 'adfuel-console-button-plain';
        resizeButton.id = 'adfuel-resize-console-button';

        var resizeIcon = document.createElement('i');
        resizeIcon.className = 'adfuel-console-button-icon material-icons';
        resizeIcon.innerHTML = resizeIcon.innerText = 'help_outline';

        var overlayButton = document.createElement('a');
        overlayButton.className = 'adfuel-console-button-plain';
        overlayButton.id = 'adfuel-show-overlay-button';

        var overlayIcon = document.createElement('i');
        overlayIcon.className = 'adfuel-console-button-icon material-icons';
        overlayIcon.innerHTML = overlayIcon.innerText = 'vignette';

        var consoleBanner = document.createElement('div');
        consoleBanner.id = 'adfuel-console-banner';

        var consoleTabContainer = document.createElement('div');
        consoleTabContainer.className = 'adfuel-console-tab-link-container';
        //_buildAdFuelConsoleTabs(consoleTabContainer);

        overlayButton.appendChild(overlayIcon);
        resizeButton.appendChild(resizeIcon);
        actionButton.appendChild(buttonIcon);
        closeContainer.appendChild(overlayButton);
        closeContainer.appendChild(resizeButton);
        closeContainer.appendChild(actionButton);

        addEvent(actionButton, 'click', _closeAdFuelConsole);
        addEvent(resizeButton, 'click', _showAdFuelConsoleHelp);
        addEvent(overlayButton, 'click', _toggleOverlays);

        consoleBanner.appendChild(closeContainer);

        var title = document.createElement('div');
        title.className = 'adfuel-console-banner-title';
        log('Full Console: ', fullConsole);
        var titleText = fullConsole ? 'AdFuel Console Tool' : 'AdFuel Creative Review';
        title.appendChild(document.createTextNode(titleText));

        consoleBanner.appendChild(title);
        consoleBanner.appendChild(consoleTabContainer);

        container.appendChild(consoleBanner);

        return;
    }

    function _refreshAdFuelConsoleContent(changes, callback) {
        if (!changes.type)
            return;
        if (_registeredTabs.indexOf(changes.type) < 0) {
            _buildAdFuelConsoleTabs();
            _registeredTabs.push(changes.type);
        }
        var panel = document.getElementById('adfuel-console-panel-' + changes.type.replace(/ /g, '-'));
        if (changes.type == 'counts') {
            _buildCountsContent(panel);
        } else if (changes.type === 'creative review') {
            var viewportWidth = parseInt(deviceInfo.viewport.split('x')[0])
            if (viewportWidth > 800 && viewportWidth < 1250) {
                _buildTwoPanelCreativeReviewForm(panel);
            } else if (viewportWidth < 800) {
                _buildMobileCreativeReviewForm(panel);
            } else if (deviceInfo.class === 'Desktop') {
                _buildCreativeReviewForm(panel);
            } else {
                _buildCreativeReviewForm(panel);
            }
        } else if (changes.type === 'timeline') {
            _addGridBox(panel);
        } else {
            _buildPanelContent(panel, true);
        }
        if (callback) { callback(); }
    }

    function _showAdFuelConsoleContent(name) {
        var x;
        var allTabs = document.getElementsByClassName('afcTab');
        var activeTab = document.querySelector('li > a[rel=\'' + name + '\']');
        for (x = 0; x < allTabs.length; x++) {
            allTabs[x].className = allTabs[x].className.replace('activeAFCTab', '');
        }
        if (activeTab) activeTab.className = activeTab.className + ' activeAFCTab';
        var activePanel = document.getElementById('adfuel-console-panel-' + name.replace(/ /g, '-'));
        if (!activePanel) {
            var panelName = name;
            var panel = document.createElement('div');
            var container = document.getElementsByClassName('adfuel-console')[0];
            panel.id = 'adfuel-console-panel-' + panelName.replace(/ /g, '-');
            panel.style.display = 'none';
            panel.className = 'adfuel-console-panel adfuel-console-content';
            panel.style.width = '100%';
            panel.style.padding = '0';
            panel.style.margin = '0';
            panel.style.height = '80%';
            panel.style.minHeight = '250px';
            panel.style.overflowY = 'auto';
            container.appendChild(panel);
            activePanel = panel;
        }
        if (name == 'timeline') {
            var timelineData = _buildTimelineData();
            _addGridBox(activePanel, timelineData);
        }
        var allPanels = document.getElementsByClassName('adfuel-console-panel');
        for (x = 0; x < allPanels.length; x++) {
            allPanels[x].style.display = 'none';
        }
        activePanel.style.display = 'block';
        log('Full Console: ', fullConsole);
        if (fullConsole && name == 'configuration') {
            _showConsolePanelTabContent({
                target: {
                    dataset: {
                        panel: activePanel.id,
                        tab: 'adfuel_initialization_options',
                        content: 'adfuel-console-panel-configuration-tabContent-adfuel_initialization_options'
                    }
                }
            });
        }
    }

    function _buildAdFuelConsoleContent(container) {
        if (!container) {
            container = document.getElementsByClassName('adfuel-console')[0];
        }
        if (!container) {
            log('Error: No AdFuel-Console container.');
            return false;
        }
        for (var typeId = 0; typeId < metricTypes.length; typeId++) {
            if (metricTypes[typeId].indexOf('_') !== 0) {
                var panelName = metricTypes[typeId];
                var panel = document.createElement('div');
                panel.id = 'adfuel-console-panel-' + panelName.replace(/ /g, '-');
                panel.style.display = 'none';
                panel.className = 'adfuel-console-panel adfuel-console-content';
                panel.style.width = '100%';
                panel.style.padding = '0';
                panel.style.margin = '0';
                panel.style.height = '80%';
                panel.style.minHeight = '250px';
                container.appendChild(panel);

                // only show CR panel if not the full console
                log('Full Console: ', fullConsole);
                log('Panel Name: ', panelName);
                if (!fullConsole && panelName !== 'creative review') { continue; }

                switch (panelName) {
                case 'creative review':
                    var viewportWidth = parseInt(deviceInfo.viewport.split('x')[0])
                    if (viewportWidth > 800 && viewportWidth < 1250) {
                        _buildTwoPanelCreativeReviewForm(panel);
                    } else if (viewportWidth < 800) {
                        _buildMobileCreativeReviewForm(panel);
                    } else if (deviceInfo.class === 'Desktop') {
                        _buildCreativeReviewForm(panel);
                    } else {
                        _buildCreativeReviewForm(panel);
                    }
                    break;
                case 'counts':
                    _buildCountsContent(panel);
                    break;
                case 'configuration':
                case 'modules':
                case 'page':
                case 'registries':
                case 'requests':
                case 'slots':
                    panel.style.display = 'block';
                    _buildPanelContent(panel, true);
                    break;
                case 'timeline':
                    var timelineData = _buildTimelineData();
                    _addGridBox(panel, timelineData);
                    break;
                default:
                    _buildPanelContent(panel, true);
                    break;
                }
            }
        }

    }

    function _addGridBox(container, data) {
        if (!container || !data) return;

        var gridBox = document.createElement('div');
        gridBox.id = 'gridbox';
        gridBox.style.width = '100%';
        gridBox.style.height = '95%';
        gridBox.style.backgroundColor = '#ABABAB';
        gridBox.style.margin = '0';
        gridBox.style.padding = '0';
        gridBox.style.position = 'relative';
        gridBox.style.top = '-12px';

        try {
            container.removeChild(gridBox);
        } catch (e) {}

        container.style.height = '90%';
        container.appendChild(gridBox);

        try {
            _timelineGrid = new dhtmlXGridObject('gridbox');
            _timelineGrid.setImagePath((document.location.protocol === 'https:' ? 'https:' : 'http:') + '//ssl.cdn.turner.com/ads/adfuel/modules/');
            gridBox.style.position = 'relative';
            gridBox.style.top = '-12px';
            gridBox.style.left = '2px';
            _timelineGrid.setHeader('Name, Type, Timestamp, Start, End, Time From Previous, Time From Initial, Duration,');
            _timelineGrid.setInitWidths('350,100,200,200,200,150,150,100');
            _timelineGrid.setColAlign('left, left, left, left, left, left, left, left');
            // TODO: Figure out why column sorting is only working for the name
            //_timelineGrid.setColSorting("str, str, int, date, date, str");
            _timelineGrid.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro');
            _timelineGrid.enableColumnAutoSize(true);
            _timelineGrid.enableDragAndDrop(false);
            _timelineGrid.init();
            _timelineGrid.clearAll();
            _timelineGrid.parse(data, 'json');
        } catch (e) {}
    }

    function _showConsolePanelTabContent(e) {

        var target = e.target;
        var data = target.dataset;
        var panel = data.panel;
        var content = data.content;
        var panelTabContents = document.querySelectorAll('div#' + panel + ' .adfuel-console-panel-tab-content');
        var panelTabs = document.querySelectorAll('div#' + panel + ' ul.nav-stacked li');
        var activeTab = document.querySelector('div#' + panel + ' ul.nav-stacked li#' + data.tab.replace(/ /g, '_'));
        var x = 0;
        for (x = 0; x < panelTabContents.length; x++) {
            panelTabContents[x].style.display = 'none';
        }
        for (x = 0; x < panelTabs.length; x++) {
            panelTabs[x].className = '';
        }
        if (activeTab) activeTab.className = activeTab.className + ' active';
        var contentEl = document.getElementById(content);
        contentEl.style.display = 'block';
        return false;
    }

    function _buildCountsContent(panel) {
        if (!panel) return;

        panel.innerHTML = '';
        var countsContainer = document.createElement('div');
        countsContainer.style.width = '100%';
        countsContainer.style.height = '100%';
        countsContainer.style.display = 'inline-block';
        countsContainer.style.padding = '5px';
        countsContainer.style.margin = '0';

        var countList = document.createElement('ul');
        countList.className = 'nav nav-pills nav-stacked flex-column';
        countList.style.listStyleType = 'none';
        countList.style.margin = '0';
        countList.style.padding = '5px';
        countList.style.height = '100%';
        countList.style.minHeight = '250px';
        countList.style.overflow = 'auto';

        var countNames = [];
        if (metricApi.metrics && metricApi.metrics.counts) {
            countNames = Object.getOwnPropertyNames(metricApi.metrics.counts);
        }

        for (var x = 0; x < countNames.length; x++) {
            var countListItem = document.createElement('li');
            countListItem.style.margin = '5px';
            countListItem.style.padding = '5px';
            countListItem.style.fontSize = '14px';
            countListItem.style.width = '15%';
            countListItem.style.display = 'inline-block';
            countListItem.style['float'] = 'left';
            countListItem.style.borderRight = 'solid 1px #BCBCBC';
            countListItem.id = countNames[x].replace(/ /g, '_');
            countListItem.innerHTML = capitalizeFirstLetter(countNames[x].replace(/_/g, ' '));
            var countListBadge = document.createElement('span');
            countListBadge.style['float'] = 'right';
            countListBadge.className = 'badge badge-pill badge-primary';
            countListBadge.style.width = '15%';
            countListBadge.innerHTML = metricApi.metrics.counts[countNames[x]];
            countListItem.appendChild(countListBadge);
            countList.appendChild(countListItem);
        }
        countsContainer.appendChild(countList);

        panel.appendChild(countsContainer);
    }

    function _buildTimelineData() {

        /* Sample Data Structure
         data={
         rows:[
         { id:1, data: ["A Time to Kill", "John Grisham", "100"]},
         { id:2, data: ["Blood and Smoke", "Stephen King", "1000"]},
         { id:3, data: ["The Rainmaker", "John Grisham", "-200"]}
         ]
         };
         */

        var browserEvents = ['connection_start', 'document_request_start', 'domContentLoaded', 'dom_load_start', 'domain_lookup_start', 'fetch_start', 'navigation_start', 'window_load'];
        var adFuelEvents = ['_rendered', 'adfuel_initialized', 'building_gpt_slots', 'dispatch_queue'];
        var dfpEvents = ['request_to_dfp'];
        var moduleEvents = ['_preQueue', '_postQueue', '_preDispatch', '_postDispatch', '_preRefresh', '_postRefresh'];
        var metrics = metricApi.metrics.timeline;
        var eventCategory = '';
        var timelineData = {
            rows: []
        };
        for (var metricEvent in metrics) {
            if (metrics.hasOwnProperty(metricEvent)) {
                if (browserEvents.indexOf(metricEvent) >= 0) {
                    eventCategory = 'Browser';
                } else if (adFuelEvents.indexOf(metricEvent) >= 0 || metricEvent.indexOf('_rendered') > 0 || metricEvent.indexOf('building_gpt_slot_') >= 0) {
                    eventCategory = 'AdFuel';
                } else if (dfpEvents.indexOf(metricEvent) >= 0) {
                    eventCategory = 'DFP';
                } else {
                    for (var me = 0; me < moduleEvents.length; me++) {
                        if (metricEvent.indexOf(moduleEvents[me]) > 0) {
                            eventCategory = 'Module';
                        }
                    }
                    if (eventCategory === '')
                        eventCategory = 'UNKNOWN';
                }

                for (var x = 0; x < metrics[metricEvent].length; x++) {
                    var actualMetric = metrics[metricEvent][x];
                    var datePieces, dateTime;
                    if (actualMetric.timestamp) {
                        var actualTime = new Date();
                        actualTime.setTime(actualMetric.timestamp);
                        datePieces = actualTime.toISOString().split('T');
                        dateTime = datePieces[1].replace('Z', '');
                        actualTime = dateTime;
                        var namePieces = metricEvent.split('_');
                        for (var y = 0; y < namePieces.length; x++) {
                            namePieces[y] = capitalizeFirstLetter(namePieces[y]);
                        }
                        var metricName = namePieces.join(' ');
                        var eventData = {
                            id: metricEvent + '_' + x,
                            data: [
                                metricName,
                                eventCategory,
                                metrics[metricEvent][0].timestamp,
                                actualTime,
                                '',
                                '',
                                '',
                                0
                            ]
                        };
                        timelineData.rows.push(eventData);
                    } else if (actualMetric.start && actualMetric.end) {
                        var actualStartTime = new Date();
                        actualStartTime.setTime(actualMetric.start);
                        datePieces = actualStartTime.toISOString().split('T');
                        dateTime = datePieces[1].replace('Z', '');
                        actualStartTime = dateTime;
                        var actualEndTime = new Date();
                        actualEndTime.setTime(actualMetric.end);
                        datePieces = actualEndTime.toISOString().split('T');
                        dateTime = datePieces[1].replace('Z', '');
                        actualEndTime = dateTime;
                        var duration = (parseInt(actualMetric.end) - parseInt(actualMetric.start)) + 'ms';
                        var namePieces = metricEvent.split('_');
                        for (var x = 0; x < namePieces.length; x++) {
                            namePieces[x] = capitalizeFirstLetter(namePieces[x]);
                        }
                        var metricName = namePieces.join(' ');
                        var eventData = {
                            id: metricEvent + '_' + x,
                            data: [
                                metricName,
                                eventCategory,
                                metrics[metricEvent][0].start,
                                actualStartTime,
                                actualEndTime,
                                '',
                                '',
                                duration
                            ],
                            endStamp: actualMetric.end
                        };
                        timelineData.rows.push(eventData);
                    } else if (actualMetric.start) {
                        var actualStartTime = new Date();
                        actualStartTime.setTime(actualMetric.start);
                        datePieces = actualStartTime.toISOString().split('T');
                        dateTime = datePieces[1].replace('Z', '');
                        actualStartTime = dateTime;
                        var namePieces = metricEvent.split('_');
                        for (var x = 0; x < namePieces.length; x++) {
                            namePieces[x] = capitalizeFirstLetter(namePieces[x]);
                        }
                        var metricName = namePieces.join(' ');
                        var eventData = {
                            id: metricEvent + '_' + x,
                            data: [
                                metricName,
                                eventCategory,
                                metrics[metricEvent][0].start,
                                actualStartTime,
                                '',
                                '',
                                '',
                                ''
                            ]
                        };
                        timelineData.rows.push(eventData);
                    }
                }
            }
        }
        if (timelineData.rows.length > 0) {
            timelineData.rows.sort(compare);
            var initialTimestamp = timelineData.rows[0].data[2];
            for (var rowIndex = 1; rowIndex < timelineData.rows.length; rowIndex++) {
                var row = timelineData.rows[rowIndex];
                var previousTimestamp = timelineData.rows[rowIndex - 1].data[2];
                row.data[5] = row.data[2] - previousTimestamp + 'ms';
                row.data[6] = row.data[2] - initialTimestamp + 'ms';
            }
            var lastRow = timelineData.rows[timelineData.rows.length - 1];
            var latestTimestamp = lastRow.endStamp ? lastRow.endStamp : lastRow.data[2];
            var elapsedTimeToDate = latestTimestamp - initialTimestamp + 'ms';
            var eventData = {
                id: 'elapsed_time',
                data: [
                    'Total Elapsed Time',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    elapsedTimeToDate
                ]
            };
            timelineData.rows.push(eventData);
        }
        return timelineData;
    }

    function _buildPanelTabs(panel, tabNames) {
        var tabContainer = document.createElement('div');
        tabContainer.style.width = '27%';
        tabContainer.style.maxWidth = '400px';
        tabContainer.style.height = '100%';
        tabContainer.style.display = 'inline-block';
        tabContainer.style.margin = '0';
        tabContainer.style['float'] = 'left';
        tabContainer.style.borderRight = 'solid 1px #0052e7';

        panel.appendChild(tabContainer);

        var tabList = document.createElement('ul');
        tabList.className = 'nav nav-pills nav-stacked flex-column';
        tabList.style.listStyleType = 'none';
        tabList.style.margin = '0';
        tabList.style.padding = '5px';
        tabList.style.height = '100%';
        tabList.style.minHeight = '250px';
        tabList.style.overflow = 'auto';

        for (var x = 0; x < tabNames.length; x++) {
            if (!isNaN(parseInt(tabNames[x]))) {
                tabNames[x] = 'request_' + tabNames[x];
            }
            var contentContainer = document.createElement('div');
            contentContainer.id = panel.id + '-tabContent-' + tabNames[x].replace(/ /g, '_');
            contentContainer.className = 'adfuel-console-panel-tab-content';
            contentContainer.style.width = '72%';
            contentContainer.style.height = '100%';
            contentContainer.style.display = 'inline-block';
            contentContainer.style.padding = '0';
            contentContainer.style.margin = '5px';
            contentContainer.style['float'] = 'left';
            if (x !== 0) {
                contentContainer.style.display = 'none';
            }

            var tabListItem = document.createElement('li');
            if (x === 0) {
                tabListItem.className = tabListItem.className + ' active';
            }
            tabListItem.id = tabNames[x].replace(/ /g, '_');
            var tabListAnchor = document.createElement('a');
            tabListAnchor.rel = tabNames[x];
            tabListAnchor.dataset.panel = panel.id;
            tabListAnchor.dataset.tab = tabNames[x];
            tabListAnchor.dataset.content = contentContainer.id;
            tabListAnchor.innerHTML = capitalizeFirstLetter(tabNames[x].replace(/_/g, ' '));

            tabListItem.appendChild(tabListAnchor);
            tabList.appendChild(tabListItem);

            _buildTabContent(contentContainer, tabNames[x]);

            addEvent(tabListAnchor, 'click', _showConsolePanelTabContent);
            panel.appendChild(contentContainer);
        }

        tabContainer.appendChild(tabList);
    }

    function _buildCreativeReviewForm(panel, count) {
        log('Building Desktop Creative Review Form');
        count = count || 1;
        if (!panel) return;

        var firstPanelElements = [{
            type: 'input',
            name: 'Name',
            value: '',
            label: 'Your Name',
            required: true
        },
        {
            type: 'input',
            name: 'Email',
            value: '',
            label: 'Your Email',
            required: true
        },
        {
            type: 'fileUpload',
            name: 'Screenshot',
            value: '',
            label: 'Upload Screenshot',
            required: false
        }
        ];

        var secondPanelElements = [{
            type: 'listLabel',
            name: 'Reason',
            label: 'What is the issue you are reporting?',
            required: false
        },
        {
            type: 'list',
            name: 'Issue(s)',
            //label: "Why are you reporting this ad?",
            required: false,
            items: [{
                type: 'checkbox',
                name: 'Issue',
                value: 'block list violation',
                label: 'Ad violates site block list',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'video plays in display ad',
                label: 'Video plays in display ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'ad disrupts content',
                label: 'Ad disrupts content',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'ad incorrectly sized',
                label: 'Ad incorrectly sized',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'download initiated',
                label: 'Ad attempts to initiate download',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'blank ad',
                label: 'Blank ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'low quality',
                label: 'Low-quality ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'audio autostarts',
                label: 'Audio starts automatically',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'broken ad',
                label: 'Broken ad',
                required: false
            }
            ]
        },
        {
            type: 'select',
            name: 'Brand',
            label: 'What is brand is affected by the issue you are reporting?',
            required: true,
            options: [{
                text: '',
                value: 'placeholder'
            },
            {
                text: 'Adult Swim',
                value: 'Adult Swim'
            },
            {
                text: 'Bleacher Report',
                value: 'Bleacher'
            },
            {
                text: 'Cartoon Network',
                value: 'Cartoon Network'
            },
            {
                text: 'CNN',
                value: 'CNN'
            },
            {
                text: 'CNN Arabic',
                value: 'CNN Arabic'
            },
            {
                text: 'CNN Espanol',
                value: 'CNN Espanol'
            },
            {
                text: 'CNN International',
                value: 'CNN International'
            },
            {
                text: 'CNN Money',
                value: 'CNN Money'
            },
            {
                text: 'E-League',
                value: 'ELEAGUE'
            },
            {
                text: 'Great Big Story',
                value: 'Great Big Story'
            },
            {
                text: 'HLN',
                value: 'HLN'
            },
            {
                text: 'NBA',
                value: 'NBA'
            },
            {
                text: 'NBA International',
                value: 'NBA International'
            },
            {
                text: 'NCAA',
                value: 'NCAA'
            },
            {
                text: 'PGA',
                value: 'PGA'
            },
            {
                text: 'Ryder Cup',
                value: 'Ryder Cup'
            },
            {
                text: 'TBS',
                value: 'TBS'
            },
            {
                text: 'TCM',
                value: 'TCM'
            },
            {
                text: 'Team Coco',
                value: 'Team Coco'
            },
            {
                text: 'TNT',
                value: 'TNT'
            },
            {
                text: 'TruTV',
                value: 'truTV'
            }
            ]
        }
        ];

        var thirdPanelElements = [{
            type: 'textarea',
            name: 'Comments',
            label: 'Please describe the issue you are reporting',
            required: true
        }];

        function buildPanel(panel, container, elements) {
            for (var i = 0; i < elements.length; i++) {
                var item = elements[i];
                switch (item.type) {
                case 'textarea':
                    var textareaLabel = element('div', item.label + ':' + ((item.required === true) ? ' *' : ''));
                    textareaLabel.style.fontWeight = 'bolder';
                    panel.appendChild(textareaLabel);
                    panel.appendChild((item.element = document.createElement('textarea')));
                    item.element.name = item.name || '';
                    if (item.required === true) { item.element.attributes.required = 'required'; }
                    item.element.width = '95%';
                    item.element.cols = '60';
                    item.element.rows = '5';
                    break;
                case 'input':
                    var inputLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                    inputLabel.className = inputLabel.className + ' fixed';
                    inputLabel.style.fontWeight = 'bolder';
                    inputLabel.style.marginRight = '5px';
                    panel.appendChild(inputLabel);
                    item.element = document.createElement('input');
                    item.element.name = item.name || '';
                    if (item.required === true) { item.element.setAttribute('required', 'required'); }
                    panel.appendChild(item.element);
                    var clearDiv = document.createElement('div');
                    clearDiv.style.clear = 'both';
                    panel.appendChild(clearDiv);
                    panel.appendChild(document.createElement('br'));
                    break;
                case 'listLabel':
                    var listLabel = element('div', item.label + ':' + ((item.required === true) ? ' *' : ''));
                    listLabel.style.fontWeight = 'bolder';
                    panel.appendChild(listLabel);
                    break;
                case 'list':
                    var listEl = document.createElement('div');
                    for (var x = 0; x < item.items.length; x++) {
                        var listItem = item.items[x];
                        var checkboxWrapper = checkbox(listItem.name, listItem.value, listItem.label);
                        var checkboxEl = checkboxWrapper.firstChild;
                        item.items[x].element = checkboxEl;
                        listEl.appendChild(checkboxWrapper);
                    }
                    panel.appendChild(listEl);
                    var clearDiv = document.createElement('div');
                    clearDiv.style.clear = 'both';
                    panel.appendChild(clearDiv);
                    panel.appendChild(document.createElement('br'));
                    break;
                case 'select':
                    console.debug('Building Select Element', item);
                    var panelLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                    panelLabel.style.fontWeight = 'bolder';
                    panel.appendChild(panelLabel);
                    item.element = document.createElement('select');
                    item.element.name = item.name;
                    for (var optionIndex = 0; optionIndex < item.options.length; optionIndex++) {
                        console.debug('Building Select Option Element', item.options[optionIndex]);
                        var option = element('option', item.options[optionIndex].text);
                        option.value = item.options[optionIndex].value;
                        item.element.appendChild(option);
                    }
                    panel.appendChild(item.element);
                    break;
                case 'button':
                    panel.appendChild(button(item));
                    break;
                case 'fileUpload':
                    if (fileUploadOK) {
                        var inputLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                        inputLabel.className = inputLabel.className + ' fixed';
                        inputLabel.style.fontWeight = 'bolder';
                        inputLabel.style.marginRight = '5px';
                        panel.appendChild(inputLabel);
                        item.element = document.createElement('input');
                        item.element.name = item.name || '';
                        item.element.type = 'file';
                        item.element.accept = 'image/*';
                        panel.appendChild(item.element);
                        var clearDiv = document.createElement('div');
                        clearDiv.style.clear = 'both';
                        panel.appendChild(clearDiv);
                        panel.appendChild(document.createElement('br'));
                    }
                    break;
                }
            }
            container.appendChild(panel);
        }

        panel.innerHTML = '';
        panel.style.padding = '0';

        var formContainer = document.createElement('div');
        formContainer.style.width = '100%';
        formContainer.style.height = '100%';
        formContainer.style.display = 'inline-block';
        formContainer.style.padding = '5px';
        formContainer.style.margin = '0';

        var header = document.createElement('div');
        header.style.width = '99%';
        header.style.borderBottom = 'solid 1px black';

        var headerText = document.createElement('p');
        headerText.style.padding = '0';
        headerText.style.fontWeight = 'bolder';
        headerText.style.margin = 'auto';
        headerText.innerHTML = 'You can report an issue on this page by submitting the information below. A copy of the report will be sent to the email address specified.<br /><span style=\'color: red\'>* Denotes required fields.</span>';

        header.appendChild(headerText);

        formContainer.appendChild(header);

        var formElement = document.createElement('form');
        formElement.style.padding = '0';
        formElement.style.margin = '0';

        formContainer.appendChild(formElement);

        var panel1 = document.createElement('div');
        switch (count) {
        case 1:
            panel1.style.width = '25%';
            panel1.style.height = '60%';
            panel1.style.display = 'inline-block';
            panel1.style.padding = '5px 5px';
            panel1.style.margin = '0';
            panel1.style['float'] = 'left';
            break;
        case 2:
            panel1.style.width = '50%';
            panel1.style.height = '100%';
            panel1.style.minHeight = '160px';
            panel1.style.display = 'inline-block';
            panel1.style.padding = '5px 5px';
            panel1.style.margin = '0';
            panel1.style['float'] = 'left';
            panel1.style.fontSize = '12px';
            panel1.id = 'cr_panel_1';
            break;
        case 3:
            panel1.style.width = '100%';
            panel1.style.height = '100%';
            panel1.style.minHeight = '160px';
            panel1.style.display = 'inline-block';
            panel1.style.padding = '5px 5px';
            panel1.style.margin = '0';
            panel1.style['float'] = 'left';
            panel1.style.fontSize = '12px';
            panel1.id = 'cr_panel_1';
            break;
        }

        buildPanel(panel1, formElement, firstPanelElements);

        var panel2 = document.createElement('div');
        switch (count) {
        case 1:
            panel2.style.width = '39%';
            panel2.style.height = '60%';
            panel2.style.display = 'inline-block';
            panel2.style.padding = '5px 5px';
            panel2.style.margin = '0';
            panel2.style['float'] = 'left';
            break;
        case 2:
            panel2.style.width = '50%';
            panel2.style.height = '100%';
            panel2.style.minHeight = '160px';
            panel2.style.padding = '5px 5px';
            panel2.style.margin = '0';
            panel2.style['float'] = 'left';
            panel2.style.fontSize = '12px';
            panel2.style.display = 'inline-block';
            panel2.id = 'cr_panel_2';
            break;
        case 3:
            panel2.style.width = '100%';
            panel2.style.height = '100%';
            panel2.style.minHeight = '160px';
            panel2.style.padding = '5px 5px';
            panel2.style.margin = '0';
            panel2.style['float'] = 'left';
            panel2.style.fontSize = '12px';
            panel2.style.display = 'none';
            panel2.id = 'cr_panel_2';
            break;
        }

        buildPanel(panel2, formElement, secondPanelElements);

        var panel3 = document.createElement('div');
        switch (count) {
        case 1:
            panel3.style.width = '32%';
            panel3.style.height = '60%';
            panel3.style.display = 'inline-block';
            panel3.style.padding = '5px 5px';
            panel3.style.margin = '0';
            panel3.style['float'] = 'left';
            break;
        case 2:
        case 3:
            panel3.style.width = '100%';
            panel3.style.height = '100%';
            panel3.style.minHeight = '160px';
            panel3.style.padding = '5px 5px';
            panel3.style.margin = '0';
            panel3.style['float'] = 'left';
            panel3.style.fontSize = '12px';
            panel3.style.display = 'none';
            panel3.id = 'cr_panel_3';
            break;
        }

        buildPanel(panel3, formElement, thirdPanelElements);

        var clearDiv = document.createElement('div');
        clearDiv.style.clear = 'both';
        formContainer.appendChild(clearDiv);

        var footer = document.createElement('div');
        footer.style.width = '99%';
        footer.style.height = '10%';
        footer.style.padding = '0';
        footer.style.margin = '0';

        var submitContainer = document.createElement('div');
        submitContainer.style.display = 'inline-block';
        submitContainer.style['float'] = 'right';

        var submitMessage = document.createElement('div');
        submitMessage.style.cssText = 'display: none; margin-right: 14px; margin-top: 7px; color: #FFFFFF; font-style: italic; font-weight: bold; font-size: 12px; padding: 5px; margin-bottom: 5px; border: solid 1px black; background-color: red;';

        function setSubmitMessage(message) {
            // set the message
            if (message !== '') {
                submitMessage.style.display = 'inline-block';
                submitMessage.innerHTML = message;
            } else {
                submitMessage.style.display = 'none';
            }
            //clear the message after 3 sec.
            window.setTimeout(function () {
                submitMessage.style.display = 'none';
            }, 3000);
        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        // submit confirmation alert box
        var confirmAlert = document.createElement('div');
        confirmAlert.className = 'cr-confirm-alert';
        confirmAlert.style.visibility = 'hidden';
        var confirmAlertText = document.createElement('div');
        confirmAlertText.className = 'cr-confirm-alert-text';

        var today = new Date();
        var dayOfWeek = today.getDay();
        var hour = today.getHours();
        var offHours = dayOfWeek === 0 || dayOfWeek === 6 || hour < 8 || hour > 17;
        var responseTime = offHours ? '2 hours outside of' : '1 hour during';

        confirmAlertText.innerHTML = 'Your report has been successfully submitted to Ad Operations. If you do not get a response within ' + responseTime + ' normal business hours (8am - 6pm Eastern), further contact information can be found in the confirmation email that has been sent to you.';
        confirmAlert.appendChild(confirmAlertText);
        confirmAlert.appendChild(document.createElement('br'));
        var confirmAlertBtn = document.createElement('button');
        confirmAlertBtn.className = 'btn btn-primary btn-sm';
        confirmAlertBtn.innerHTML = 'OK';
        confirmAlertBtn.onclick = function (e) {
            e.preventDefault();
            _closeAdFuelConsole();
            confirmAlert.style.visibility = 'hidden';
            // clear all inputs
            formElement.reset();
        };
        confirmAlert.appendChild(confirmAlertBtn);
        panel.appendChild(confirmAlert);

        var submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary btn-sm cr-confirm-alert-btn';
        submitButton.onclick = function (e) {
            e.preventDefault();

            // validate inputs
            if (formElement.elements['Name'].value === '' ||
                formElement.elements['Comments'].value === '' ||
                formElement.elements['Email'].value === '') {
                setSubmitMessage('Please fill out all required fields.');
                return;
            } else if (!validateEmail(formElement.elements['Email'].value)) {
                setSubmitMessage('Email address is not valid.');
                return;
            } else {
                submitCreativeReviewForm(formElement, function () {
                    //alert("Form Submitted!");
                    confirmAlert.style.visibility = 'visible';
                });
            }
        };

        var nextButton = document.createElement('button');
        nextButton.type = 'button'
        nextButton.className = 'btn btn-primary btn-sn cr-confirm-alert-btn';
        nextButton.onclick = function () {
            switch (count) {
            case 2:
                // validate inputs
                if (formElement.elements['Name'].value === '' ||
                        formElement.elements['Email'].value === '' ||
                        formElement.elements['Brand'].value === '' ||
                        formElement.elements['Brand'].value === 'placeholder') {
                    setSubmitMessage('Please fill out all required fields.');
                    return;
                } else if (!validateEmail(formElement.elements['Email'].value)) {
                    setSubmitMessage('Email address is not valid.');
                    return;
                } else if (formElement.elements['Brand'].value === '' || formElement.elements['Brand'].value === 'placeholder') {
                    setSubmitMessage('Please select the brand affected by this issue.');
                    return;
                } else {
                    document.getElementById('cr_panel_1').style.display = 'none';
                    document.getElementById('cr_panel_2').style.display = 'none';
                    document.getElementById('cr_panel_3').style.display = 'inline-block';
                    submitContainer.removeChild(nextButton);
                    submitContainer.appendChild(backButton);
                    submitContainer.appendChild(submitButton);
                }
                break;
            case 3:
                switch (activeCRPanel) {
                case 1:
                    // validate inputs
                    if (formElement.elements['Name'].value === '' ||
                                formElement.elements['Email'].value === '') {
                        setSubmitMessage('Please fill out all required fields.');
                        return;
                    } else if (!validateEmail(formElement.elements['Email'].value)) {
                        setSubmitMessage('Email address is not valid.');
                        return;
                    } else {
                        document.getElementById('cr_panel_1').style.display = 'none';
                        document.getElementById('cr_panel_2').style.display = 'inline-block';
                        submitContainer.insertBefore(backButton, nextButton)
                        activeCRPanel++;
                    }
                    break;
                case 2:
                    if (formElement.elements['Brand'].value === '' || formElement.elements['Brand'].value === 'placeholder') {
                        setSubmitMessage('Please select the brand affected by this issue.');
                        return;
                    } else {
                        document.getElementById('cr_panel_2').style.display = 'none';
                        document.getElementById('cr_panel_3').style.display = 'inline-block';
                        submitContainer.removeChild(nextButton);
                        submitContainer.appendChild(submitButton);
                        activeCRPanel++;
                    }
                    break;
                }
                break;
            }
        }
        nextButton.style.padding = '5px 10px';
        nextButton.style.fontSize = '12px';
        nextButton.style.lineHeight = '1.5';
        nextButton.style.borderRadius = '3px';
        nextButton.innerHTML = 'Next >>';

        var backButton = document.createElement('button');
        backButton.type = 'button'
        backButton.className = 'btn btn-primary btn-sn cr-confirm-alert-btn';
        backButton.onclick = function () {
            switch (count) {
            case 2:
                setSubmitMessage('');
                document.getElementById('cr_panel_1').style.display = 'inline-block';
                document.getElementById('cr_panel_2').style.display = 'inline-block';
                document.getElementById('cr_panel_3').style.display = 'none';
                submitContainer.appendChild(nextButton);
                submitContainer.removeChild(submitButton);
                break;
            case 3:
                switch (activeCRPanel) {
                    case 2:
                        setSubmitMessage('');
                        document.getElementById('cr_panel_1').style.display = 'inline-block';
                        document.getElementById('cr_panel_2').style.display = 'none';
                        submitContainer.removeChild(backButton);
                        break;
                    case 3:
                        setSubmitMessage('');
                        document.getElementById('cr_panel_2').style.display = 'inline-block';
                        document.getElementById('cr_panel_3').style.display = 'none';
                        submitContainer.appendChild(nextButton);
                        submitContainer.removeChild(submitButton);
                        break;
                }
                activeCRPanel--;
                break;
            }
        }
        backButton.style.padding = '5px 10px';
        backButton.style.fontSize = '12px';
        backButton.style.lineHeight = '1.5';
        backButton.style.borderRadius = '3px';
        backButton.style.marginRight = '10px';
        backButton.innerHTML = '<< Back';

        submitContainer.appendChild(submitMessage);
        if (count === 1) { submitContainer.appendChild(submitButton); } else { submitContainer.appendChild(nextButton); }

        footer.appendChild(submitContainer);

        formContainer.appendChild(footer);

        panel.insertBefore(formContainer, confirmAlert);
    }

    function _buildMobileCreativeReviewForm(panel) {
        log('Building Mobile Creative Review Form');
        if (!panel) return;

        var firstPanelElements = [{
            type: 'input',
            name: 'Name',
            value: '',
            label: 'Your Name',
            required: true
        },
        {
            type: 'input',
            name: 'Email',
            value: '',
            label: 'Your Email',
            required: true
        },
        {
            type: 'fileUpload',
            name: 'Screenshot',
            value: '',
            label: 'Upload Screenshot',
            required: false
        }
        ];

        var secondPanelElements = [{
            type: 'listLabel',
            name: 'Reason',
            label: 'What is the issue you are reporting?',
            required: false
        },
        {
            type: 'list',
            name: 'Issue(s)',
            //label: "Why are you reporting this ad?",
            required: false,
            items: [{
                type: 'checkbox',
                name: 'Issue',
                value: 'block list violation',
                label: 'Ad violates site block list',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'video plays in display ad',
                label: 'Video plays in display ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'ad disrupts content',
                label: 'Ad disrupts content',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'ad incorrectly sized',
                label: 'Ad incorrectly sized',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'download initiated',
                label: 'Ad attempts to initiate download',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'blank ad',
                label: 'Blank ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'low quality',
                label: 'Low-quality ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'audio autostarts',
                label: 'Audio starts automatically',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'broken ad',
                label: 'Broken ad',
                required: false
            }
            ]
        },
        {
            type: 'select',
            name: 'Brand',
            label: 'What is brand is affected by the issue you are reporting?',
            required: true,
            options: [{
                text: '',
                value: 'placeholder'
            },
            {
                text: 'Adult Swim',
                value: 'Adult Swim'
            },
            {
                text: 'Bleacher Report',
                value: 'Bleacher'
            },
            {
                text: 'Cartoon Network',
                value: 'Cartoon Network'
            },
            {
                text: 'CNN',
                value: 'CNN'
            },
            {
                text: 'CNN Arabic',
                value: 'CNN Arabic'
            },
            {
                text: 'CNN Espanol',
                value: 'CNN Espanol'
            },
            {
                text: 'CNN International',
                value: 'CNN International'
            },
            {
                text: 'CNN Money',
                value: 'CNN Money'
            },
            {
                text: 'E-League',
                value: 'ELEAGUE'
            },
            {
                text: 'Great Big Story',
                value: 'Great Big Story'
            },
            {
                text: 'HLN',
                value: 'HLN'
            },
            {
                text: 'NBA',
                value: 'NBA'
            },
            {
                text: 'NBA International',
                value: 'NBA International'
            },
            {
                text: 'NCAA',
                value: 'NCAA'
            },
            {
                text: 'TBS',
                value: 'TBS'
            },
            {
                text: 'TCM',
                value: 'TCM'
            },
            {
                text: 'Team Coco',
                value: 'Team Coco'
            },
            {
                text: 'TNT',
                value: 'TNT'
            },
            {
                text: 'TruTV',
                value: 'truTV'
            }
            ]
        }
        ];

        var thirdPanelElements = [{
            type: 'textarea',
            name: 'Comments',
            label: 'Please describe the issue you are reporting',
            required: true
        }];

        function buildPanel(panel, container, elements) {
            for (var i = 0; i < elements.length; i++) {
                var item = elements[i];
                switch (item.type) {
                case 'textarea':
                    var textareaLabel = element('div', item.label + ':' + ((item.required === true) ? ' *' : ''));
                    textareaLabel.style.fontWeight = 'bolder';
                    panel.appendChild(textareaLabel);
                    panel.appendChild((item.element = document.createElement('textarea')));
                    item.element.name = item.name || '';
                    if (item.required === true) { item.element.attributes.required = 'required'; }
                    item.element.width = '95%';
                    item.element.cols = '60';
                    item.element.rows = '5';
                    break;
                case 'input':
                    var inputLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                    inputLabel.className = inputLabel.className + ' fixed';
                    inputLabel.style.fontWeight = 'bolder';
                    inputLabel.style.marginRight = '5px';
                    panel.appendChild(inputLabel);
                    item.element = document.createElement('input');
                    item.element.name = item.name || '';
                    if (item.required === true) { item.element.setAttribute('required', 'required'); }
                    panel.appendChild(item.element);
                    var clearDiv = document.createElement('div');
                    clearDiv.style.clear = 'both';
                    panel.appendChild(clearDiv);
                    panel.appendChild(document.createElement('br'));
                    break;
                case 'listLabel':
                    var listLabel = element('div', item.label + ':' + ((item.required === true) ? ' *' : ''));
                    listLabel.style.fontWeight = 'bolder';
                    panel.appendChild(listLabel);
                    break;
                case 'list':
                    var listEl = document.createElement('div');
                    for (var x = 0; x < item.items.length; x++) {
                        var listItem = item.items[x];
                        var checkboxWrapper = checkbox(listItem.name, listItem.value, listItem.label);
                        var checkboxEl = checkboxWrapper.firstChild;
                        item.items[x].element = checkboxEl;
                        listEl.appendChild(checkboxWrapper);
                    }
                    panel.appendChild(listEl);
                    var clearDiv = document.createElement('div');
                    clearDiv.style.clear = 'both';
                    panel.appendChild(clearDiv);
                    panel.appendChild(document.createElement('br'));
                    break;
                case 'select':
                    var panelLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                    panelLabel.style.fontWeight = 'bolder';
                    panel.appendChild(panelLabel);
                    item.element = document.createElement('select');
                    item.element.name = item.name;
                    for (var optionIndex = 0; optionIndex < item.options.length; optionIndex++) {
                        var option = element('option', item.options[optionIndex].text);
                        option.value = item.options[optionIndex].value;
                        item.element.appendChild(option);
                    }
                    panel.appendChild(item.element);
                    break;
                case 'button':
                    panel.appendChild(button(item));
                    break;
                case 'fileUpload':
                    if (fileUploadOK) {
                        var inputLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                        inputLabel.className = inputLabel.className + ' fixed';
                        inputLabel.style.fontWeight = 'bolder';
                        inputLabel.style.marginRight = '5px';
                        panel.appendChild(inputLabel);
                        item.element = document.createElement('input');
                        item.element.name = item.name || '';
                        item.element.type = 'file';
                        item.element.accept = 'image/*';
                        panel.appendChild(item.element);
                        var clearDiv = document.createElement('div');
                        clearDiv.style.clear = 'both';
                        panel.appendChild(clearDiv);
                        panel.appendChild(document.createElement('br'));
                    }
                    break;
                }
            }
            container.appendChild(panel);
        }

        panel.innerHTML = '';
        panel.style.padding = '0';
        var formContainer = document.createElement('div');
        formContainer.style.width = '100%';
        formContainer.style.height = '100%';
        formContainer.style.display = 'inline-block';
        formContainer.style.padding = '5px';
        formContainer.style.margin = '0';
        formContainer.style.border = 'solid 2px purple';

        var header = document.createElement('div');
        header.style.width = '99%';
        header.style.borderBottom = 'solid 1px black';
        header.style.fontSize = '12px';

        var headerText = document.createElement('p');
        headerText.style.padding = '0';
        headerText.style.fontWeight = 'bolder';
        headerText.style.margin = 'auto';
        headerText.innerHTML = 'You can report an issue on this page by submitting the information below. A copy of the report will be sent to the email address specified.<br /><span style=\'color: red\'>* Denotes required fields.</span>';

        header.appendChild(headerText);

        formContainer.appendChild(header);

        var formElement = document.createElement('form');
        formElement.style.padding = '0';
        formElement.style.margin = '0';

        formContainer.appendChild(formElement);

        var panel1 = document.createElement('div');
        panel1.style.width = '100%';
        panel1.style.height = '100%';
        panel1.style.minHeight = '160px';
        panel1.style.display = 'inline-block';
        panel1.style.padding = '5px 5px';
        panel1.style.margin = '0';
        panel1.style['float'] = 'left';
        panel1.style.fontSize = '12px';
        panel1.id = 'cr_panel_1';

        buildPanel(panel1, formElement, firstPanelElements);

        var panel2 = document.createElement('div');
        panel2.style.width = '100%';
        panel2.style.height = '100%';
        panel2.style.minHeight = '160px';
        panel2.style.padding = '5px 5px';
        panel2.style.margin = '0';
        panel2.style['float'] = 'left';
        panel2.style.fontSize = '12px';
        panel2.style.display = 'none';
        panel2.id = 'cr_panel_2';

        buildPanel(panel2, formElement, secondPanelElements);

        var panel3 = document.createElement('div');
        panel3.style.width = '100%';
        panel3.style.height = '100%';
        panel3.style.minHeight = '160px';
        panel3.style.padding = '5px 5px';
        panel3.style.margin = '0';
        panel3.style['float'] = 'left';
        panel3.style.fontSize = '12px';
        panel3.style.display = 'none';
        panel3.id = 'cr_panel_3';

        buildPanel(panel3, formElement, thirdPanelElements);

        var clearDiv = document.createElement('div');
        clearDiv.style.clear = 'both';
        formContainer.appendChild(clearDiv);

        var footer = document.createElement('div');
        footer.style.width = '99%';
        footer.style.height = '10%';
        footer.style.padding = '0';
        footer.style.margin = '0';

        var submitContainer = document.createElement('div');
        submitContainer.style.display = 'inline-block';
        submitContainer.style['float'] = 'right';
        submitContainer.style.height = '10%';

        var submitMessage = document.createElement('div');
        submitMessage.style.cssText = 'display: none; margin-right: 14px; margin-top: 7px; color: #FFFFFF; font-style: italic; font-weight: bold; font-size: 12px; padding: 5px; margin-bottom: 5px; border: solid 1px black; background-color: red;';

        function setSubmitMessage(message) {
            // set the message
            if (message !== '') {
                submitMessage.style.display = 'inline-block';
                submitMessage.innerHTML = message;
            } else {
                submitMessage.style.display = 'none';
            }
            //clear the message after 3 sec.
            window.setTimeout(function () {
                submitMessage.style.display = 'none';
            }, 3000);
        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        // submit confirmation alert box
        var confirmAlert = document.createElement('div');
        confirmAlert.className = 'cr-confirm-alert';
        confirmAlert.style.visibility = 'hidden';
        var confirmAlertText = document.createElement('div');
        confirmAlertText.className = 'cr-confirm-alert-text';

        var today = new Date();
        var dayOfWeek = today.getDay();
        var hour = today.getHours();
        var offHours = dayOfWeek === 0 || dayOfWeek === 6 || hour < 8 || hour > 17;
        var responseTime = offHours ? '2 hours outside of' : '1 hour during';

        confirmAlertText.innerHTML = 'Your report has been successfully submitted to Ad Operations. If you do not get a response within ' + responseTime + ' normal business hours (8am - 6pm Eastern), further contact information can be found in the confirmation email that has been sent to you.';
        confirmAlert.appendChild(confirmAlertText);
        confirmAlert.appendChild(document.createElement('br'));
        var confirmAlertBtn = document.createElement('button');
        confirmAlertBtn.className = 'btn btn-primary btn-sm';
        confirmAlertBtn.innerHTML = 'OK';
        confirmAlertBtn.onclick = function (e) {
            e.preventDefault();
            _closeAdFuelConsole();
            confirmAlert.style.visibility = 'hidden';
            // clear all inputs
            formElement.reset();
        };
        confirmAlert.appendChild(confirmAlertBtn);
        panel.appendChild(confirmAlert);

        var submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary btn-sm cr-confirm-alert-btn';
        submitButton.onclick = function (e) {
            e.preventDefault();

            // validate inputs
            if (formElement.elements['Comments'].value == '') {
                setSubmitMessage('Please describe the issue you are reporting.');
                return;
            } else {
                submitCreativeReviewForm(formElement, function () {
                    //alert("Form Submitted!");
                    confirmAlert.style.visibility = 'visible';
                });
            }
        };

        var nextButton = document.createElement('button');
        nextButton.type = 'button'
        nextButton.className = 'btn btn-primary btn-sn cr-confirm-alert-btn';
        nextButton.onclick = function () {
            switch (activeCRPanel) {
            case 1:
                // validate inputs
                if (formElement.elements['Name'].value === '' ||
                        formElement.elements['Email'].value === '') {
                    setSubmitMessage('Please fill out all required fields.');
                    return;
                } else if (!validateEmail(formElement.elements['Email'].value)) {
                    setSubmitMessage('Email address is not valid.');
                    return;
                } else {
                    document.getElementById('cr_panel_1').style.display = 'none';
                    document.getElementById('cr_panel_2').style.display = 'inline-block';
                    submitContainer.insertBefore(backButton, nextButton)
                    activeCRPanel++;
                }
                break;
            case 2:
                if (formElement.elements['Brand'].value === '' || formElement.elements['Brand'].value === 'placeholder') {
                    setSubmitMessage('Please select the brand affected by this issue.');
                    return;
                } else {
                    document.getElementById('cr_panel_2').style.display = 'none';
                    document.getElementById('cr_panel_3').style.display = 'inline-block';
                    submitContainer.removeChild(nextButton);
                    submitContainer.appendChild(submitButton);
                    activeCRPanel++;
                }
                break;
            }
        }
        nextButton.style.padding = '5px 10px';
        nextButton.style.fontSize = '12px';
        nextButton.style.lineHeight = '1.5';
        nextButton.style.borderRadius = '3px';
        nextButton.innerHTML = 'Next >>';

        var backButton = document.createElement('button');
        backButton.type = 'button'
        backButton.className = 'btn btn-primary btn-sn cr-confirm-alert-btn';
        backButton.onclick = function () {
            switch (activeCRPanel) {
            case 2:
                setSubmitMessage('');
                document.getElementById('cr_panel_1').style.display = 'inline-block';
                document.getElementById('cr_panel_2').style.display = 'none';
                submitContainer.removeChild(backButton);
                break;
            case 3:
                setSubmitMessage('');
                document.getElementById('cr_panel_2').style.display = 'inline-block';
                document.getElementById('cr_panel_3').style.display = 'none';
                submitContainer.appendChild(nextButton);
                submitContainer.removeChild(submitButton);
                break;

            }
            activeCRPanel--;
        }
        backButton.style.padding = '5px 10px';
        backButton.style.fontSize = '12px';
        backButton.style.lineHeight = '1.5';
        backButton.style.borderRadius = '3px';
        backButton.style.marginRight = '10px';
        backButton.innerHTML = '<< Back';

        submitContainer.appendChild(submitMessage);
        submitContainer.appendChild(nextButton);
        footer.appendChild(submitContainer);

        formContainer.appendChild(footer);

        panel.insertBefore(formContainer, confirmAlert);
    }

    function _buildTwoPanelCreativeReviewForm(panel) {
        log('Building Mobile Creative Review Form');
        if (!panel) return;

        var firstPanelElements = [{
            type: 'input',
            name: 'Name',
            value: '',
            label: 'Your Name',
            required: true
        },
        {
            type: 'input',
            name: 'Email',
            value: '',
            label: 'Your Email',
            required: true
        },
        {
            type: 'fileUpload',
            name: 'Screenshot',
            value: '',
            label: 'Upload Screenshot',
            required: false
        }
        ];

        var secondPanelElements = [{
            type: 'listLabel',
            name: 'Reason',
            label: 'What is the issue you are reporting?',
            required: false
        },
        {
            type: 'list',
            name: 'Issue(s)',
            //label: "Why are you reporting this ad?",
            required: false,
            items: [{
                type: 'checkbox',
                name: 'Issue',
                value: 'block list violation',
                label: 'Ad violates site block list',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'video plays in display ad',
                label: 'Video plays in display ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'ad disrupts content',
                label: 'Ad disrupts content',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'ad incorrectly sized',
                label: 'Ad incorrectly sized',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'download initiated',
                label: 'Ad attempts to initiate download',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'blank ad',
                label: 'Blank ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'low quality',
                label: 'Low-quality ad',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'audio autostarts',
                label: 'Audio starts automatically',
                required: false
            },
            {
                type: 'checkbox',
                name: 'Issue',
                value: 'broken ad',
                label: 'Broken ad',
                required: false
            }
            ]
        },
        {
            type: 'select',
            name: 'Brand',
            label: 'What is brand is affected by the issue you are reporting?',
            required: true,
            options: [{
                text: '',
                value: 'placeholder'
            },
            {
                text: 'Adult Swim',
                value: 'Adult Swim'
            },
            {
                text: 'Bleacher Report',
                value: 'Bleacher'
            },
            {
                text: 'Cartoon Network',
                value: 'Cartoon Network'
            },
            {
                text: 'CNN',
                value: 'CNN'
            },
            {
                text: 'CNN Arabic',
                value: 'CNN Arabic'
            },
            {
                text: 'CNN Espanol',
                value: 'CNN Espanol'
            },
            {
                text: 'CNN International',
                value: 'CNN International'
            },
            {
                text: 'CNN Money',
                value: 'CNN Money'
            },
            {
                text: 'E-League',
                value: 'ELEAGUE'
            },
            {
                text: 'Great Big Story',
                value: 'Great Big Story'
            },
            {
                text: 'HLN',
                value: 'HLN'
            },
            {
                text: 'NBA',
                value: 'NBA'
            },
            {
                text: 'NBA International',
                value: 'NBA International'
            },
            {
                text: 'NCAA',
                value: 'NCAA'
            },
            {
                text: 'TBS',
                value: 'TBS'
            },
            {
                text: 'TCM',
                value: 'TCM'
            },
            {
                text: 'Team Coco',
                value: 'Team Coco'
            },
            {
                text: 'TNT',
                value: 'TNT'
            },
            {
                text: 'TruTV',
                value: 'truTV'
            }
            ]
        }
        ];

        var thirdPanelElements = [{
            type: 'textarea',
            name: 'Comments',
            label: 'Please describe the issue you are reporting',
            required: true
        }];

        function buildPanel(panel, container, elements) {
            for (var i = 0; i < elements.length; i++) {
                var item = elements[i];
                switch (item.type) {
                case 'textarea':
                    var textareaLabel = element('div', item.label + ':' + ((item.required === true) ? ' *' : ''));
                    textareaLabel.style.fontWeight = 'bolder';
                    panel.appendChild(textareaLabel);
                    panel.appendChild((item.element = document.createElement('textarea')));
                    item.element.name = item.name || '';
                    if (item.required === true) { item.element.attributes.required = 'required'; }
                    item.element.width = '95%';
                    item.element.cols = '60';
                    item.element.rows = '5';
                    break;
                case 'input':
                    var inputLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                    inputLabel.className = inputLabel.className + ' fixed';
                    inputLabel.style.fontWeight = 'bolder';
                    inputLabel.style.marginRight = '5px';
                    panel.appendChild(inputLabel);
                    item.element = document.createElement('input');
                    item.element.name = item.name || '';
                    if (item.required === true) { item.element.setAttribute('required', 'required'); }
                    panel.appendChild(item.element);
                    var clearDiv = document.createElement('div');
                    clearDiv.style.clear = 'both';
                    panel.appendChild(clearDiv);
                    panel.appendChild(document.createElement('br'));
                    break;
                case 'listLabel':
                    var listLabel = element('div', item.label + ':' + ((item.required === true) ? ' *' : ''));
                    listLabel.style.fontWeight = 'bolder';
                    panel.appendChild(listLabel);
                    break;
                case 'list':
                    var listEl = document.createElement('div');
                    for (var x = 0; x < item.items.length; x++) {
                        var listItem = item.items[x];
                        var checkboxWrapper = checkbox(listItem.name, listItem.value, listItem.label);
                        var checkboxEl = checkboxWrapper.firstChild;
                        item.items[x].element = checkboxEl;
                        listEl.appendChild(checkboxWrapper);
                    }
                    panel.appendChild(listEl);
                    var clearDiv = document.createElement('div');
                    clearDiv.style.clear = 'both';
                    panel.appendChild(clearDiv);
                    panel.appendChild(document.createElement('br'));
                    break;
                case 'select':
                    var panelLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                    panelLabel.style.fontWeight = 'bolder';
                    panel.appendChild(panelLabel);
                    item.element = document.createElement('select');
                    item.element.name = item.name;
                    for (var optionIndex = 0; optionIndex < item.options.length; optionIndex++) {
                        var option = element('option', item.options[optionIndex].text);
                        option.value = item.options[optionIndex].value;
                        item.element.appendChild(option);
                    }
                    panel.appendChild(item.element);
                    break;
                case 'button':
                    panel.appendChild(button(item));
                    break;
                case 'fileUpload':
                    if (fileUploadOK) {
                        var inputLabel = element('div', item.label + ': ' + ((item.required === true) ? ' *' : ''));
                        inputLabel.className = inputLabel.className + ' fixed';
                        inputLabel.style.fontWeight = 'bolder';
                        inputLabel.style.marginRight = '5px';
                        panel.appendChild(inputLabel);
                        item.element = document.createElement('input');
                        item.element.name = item.name || '';
                        item.element.type = 'file';
                        item.element.accept = 'image/*';
                        panel.appendChild(item.element);
                        var clearDiv = document.createElement('div');
                        clearDiv.style.clear = 'both';
                        panel.appendChild(clearDiv);
                        panel.appendChild(document.createElement('br'));
                    }
                    break;
                }
            }
            container.appendChild(panel);
        }

        panel.innerHTML = '';
        panel.style.padding = '0';
        var formContainer = document.createElement('div');
        formContainer.style.width = '100%';
        formContainer.style.height = '100%';
        formContainer.style.display = 'inline-block';
        formContainer.style.padding = '5px';
        formContainer.style.margin = '0';
        formContainer.style.border = 'solid 2px purple';

        var header = document.createElement('div');
        header.style.width = '99%';
        header.style.borderBottom = 'solid 1px black';
        header.style.fontSize = '12px';

        var headerText = document.createElement('p');
        headerText.style.padding = '0';
        headerText.style.fontWeight = 'bolder';
        headerText.style.margin = 'auto';
        headerText.innerHTML = 'You can report an issue on this page by submitting the information below. A copy of the report will be sent to the email address specified.<br /><span style=\'color: red\'>* Denotes required fields.</span>';

        header.appendChild(headerText);

        formContainer.appendChild(header);

        var formElement = document.createElement('form');
        formElement.style.padding = '0';
        formElement.style.margin = '0';

        formContainer.appendChild(formElement);

        var panel1 = document.createElement('div');
        panel1.style.width = '50%';
        panel1.style.height = '100%';
        panel1.style.minHeight = '160px';
        panel1.style.display = 'inline-block';
        panel1.style.padding = '5px 5px';
        panel1.style.margin = '0';
        panel1.style['float'] = 'left';
        panel1.style.fontSize = '12px';
        panel1.id = 'cr_panel_1';

        buildPanel(panel1, formElement, firstPanelElements);

        var panel2 = document.createElement('div');
        panel2.style.width = '50%';
        panel2.style.height = '100%';
        panel2.style.minHeight = '160px';
        panel2.style.padding = '5px 5px';
        panel2.style.margin = '0';
        panel2.style['float'] = 'left';
        panel2.style.fontSize = '12px';
        panel2.style.display = 'inline-block';
        panel2.id = 'cr_panel_2';

        buildPanel(panel2, formElement, secondPanelElements);

        var panel3 = document.createElement('div');
        panel3.style.width = '100%';
        panel3.style.height = '100%';
        panel3.style.minHeight = '160px';
        panel3.style.padding = '5px 5px';
        panel3.style.margin = '0';
        panel3.style['float'] = 'left';
        panel3.style.fontSize = '12px';
        panel3.style.display = 'none';
        panel3.id = 'cr_panel_3';

        buildPanel(panel3, formElement, thirdPanelElements);

        var clearDiv = document.createElement('div');
        clearDiv.style.clear = 'both';
        formContainer.appendChild(clearDiv);

        var footer = document.createElement('div');
        footer.style.width = '99%';
        footer.style.height = '10%';
        footer.style.padding = '0';
        footer.style.margin = '0';

        var submitContainer = document.createElement('div');
        submitContainer.style.display = 'inline-block';
        submitContainer.style['float'] = 'right';
        submitContainer.style.height = '10%';

        var submitMessage = document.createElement('div');
        submitMessage.style.cssText = 'display: none; margin-right: 14px; margin-top: 7px; color: #FFFFFF; font-style: italic; font-weight: bold; font-size: 12px; padding: 5px; margin-bottom: 5px; border: solid 1px black; background-color: red;';

        function setSubmitMessage(message) {
            // set the message
            if (message !== '') {
                submitMessage.style.display = 'inline-block';
                submitMessage.innerHTML = message;
            } else {
                submitMessage.style.display = 'none';
            }
            //clear the message after 3 sec.
            window.setTimeout(function () {
                submitMessage.style.display = 'none';
            }, 3000);
        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        // submit confirmation alert box
        var confirmAlert = document.createElement('div');
        confirmAlert.className = 'cr-confirm-alert';
        confirmAlert.style.visibility = 'hidden';
        var confirmAlertText = document.createElement('div');
        confirmAlertText.className = 'cr-confirm-alert-text';

        var today = new Date();
        var dayOfWeek = today.getDay();
        var hour = today.getHours();
        var offHours = dayOfWeek === 0 || dayOfWeek === 6 || hour < 8 || hour > 17;
        var responseTime = offHours ? '2 hours outside of' : '1 hour during';

        confirmAlertText.innerHTML = 'Your report has been successfully submitted to Ad Operations. If you do not get a response within ' + responseTime + ' normal business hours (8am - 6pm Eastern), further contact information can be found in the confirmation email that has been sent to you.';
        confirmAlert.appendChild(confirmAlertText);
        confirmAlert.appendChild(document.createElement('br'));
        var confirmAlertBtn = document.createElement('button');
        confirmAlertBtn.className = 'btn btn-primary btn-sm';
        confirmAlertBtn.innerHTML = 'OK';
        confirmAlertBtn.onclick = function (e) {
            e.preventDefault();
            _closeAdFuelConsole();
            confirmAlert.style.visibility = 'hidden';
            // clear all inputs
            formElement.reset();
        };
        confirmAlert.appendChild(confirmAlertBtn);
        panel.appendChild(confirmAlert);

        var submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary btn-sm cr-confirm-alert-btn';
        submitButton.onclick = function (e) {
            e.preventDefault();

            // validate inputs
            if (formElement.elements['Comments'].value == '') {
                setSubmitMessage('Please describe the issue you are reporting.');
                return;
            } else {
                submitCreativeReviewForm(formElement, function () {
                    //alert("Form Submitted!");
                    confirmAlert.style.visibility = 'visible';
                });
            }
        };

        var nextButton = document.createElement('button');
        nextButton.type = 'button'
        nextButton.className = 'btn btn-primary btn-sn cr-confirm-alert-btn';
        nextButton.onclick = function (e) {
            // validate inputs
            if (formElement.elements['Name'].value == '' ||
                formElement.elements['Email'].value == '' ||
                formElement.elements['Brand'].value == 'placeholder' ||
                formElement.elements['Brand'].value == '') {
                setSubmitMessage('Please fill out all required fields.');
                return;
            } else if (!validateEmail(formElement.elements['Email'].value)) {
                setSubmitMessage('Email address is not valid.');
                return;
            } else {
                document.getElementById('cr_panel_1').style.display = 'none';
                document.getElementById('cr_panel_2').style.display = 'none';
                document.getElementById('cr_panel_3').style.display = 'inline-block';
                log('Appending Back and Submit Buttons.  Removing Next Button.');
                submitContainer.removeChild(nextButton);
                submitContainer.appendChild(backButton);
                submitContainer.appendChild(submitButton);
            }
        }
        nextButton.style.padding = '5px 10px';
        nextButton.style.fontSize = '12px';
        nextButton.style.lineHeight = '1.5';
        nextButton.style.borderRadius = '3px';
        nextButton.innerHTML = 'Next >>';

        var backButton = document.createElement('button');
        backButton.type = 'button'
        backButton.className = 'btn btn-primary btn-sn cr-confirm-alert-btn';
        backButton.onclick = function () {
            setSubmitMessage('');
            document.getElementById('cr_panel_1').style.display = 'inline-block';
            document.getElementById('cr_panel_2').style.display = 'inline-block';
            document.getElementById('cr_panel_3').style.display = 'none';
            log('Adding Next Button. Removing Submit and Back Buttons.');

            submitContainer.appendChild(nextButton);
            submitContainer.removeChild(backButton);
            submitContainer.removeChild(submitButton);
        }
        backButton.style.padding = '5px 10px';
        backButton.style.fontSize = '12px';
        backButton.style.lineHeight = '1.5';
        backButton.style.borderRadius = '3px';
        backButton.style.marginRight = '10px';
        backButton.innerHTML = '<< Back';

        submitContainer.appendChild(submitMessage);
        submitContainer.appendChild(nextButton);
        footer.appendChild(submitContainer);

        formContainer.appendChild(footer);

        panel.insertBefore(formContainer, confirmAlert);
    }

    var _appliedTargeting = [];

    function parseMessage(msg) {
        var data = {};
        if (msg.data && typeof msg.data.indexOf === 'function' && msg.data.indexOf('{') == 0 && msg.data.indexOf('googMsgType') < 0) {
            try {
                data = JSON.parse(msg.data);
                if (data.pos) {
                    // console.log("CREATEREV MESSAGE: ", {data: data});
                }
            } catch (err) {
                // console.error("CREATEREV MESSAGE: ", err, msg);
                return;
            }
        }
        if (data.divId) {
            if (Array.isArray(data.divId) && data.divId.length > 1) {
                data.divId = data.divId[0];
            }
            if (data.filteredSources.length > 0) {
                for (var z = 0; z < data.filteredSources.length; z++) {
                    var filteredSource = data.filteredSources[z];
                    if (filteredSource.indexOf('javascript:') < 0) {
                        var showTempAd = function () {
                            var imgSrc = filteredSource;
                            var imgEl = document.createElement('img');
                            var adWrapper = document.getElementById(data.divId);
                            var childIframes = document.querySelectorAll('div[id=\'' + data.divId + '\'] div[id^=\'google_ads_iframe\']');
                            imgEl.className = 'adfuel-temp-image';
                            imgEl.src = imgSrc;
                            if (imgSrc.indexOf('http://') === 0 || imgSrc.indexOf('https://') === 0 || imgSrc.indexOf('//') === 0) {
                                adWrapper.appendChild(imgEl);
                                for (var x = 0; x < childIframes.length; x++) {
                                    var iframe = childIframes[x];
                                    iframe.style.display = 'none';
                                }
                            }
                        };
                        var hideTempAd = function () {
                            var adWrapper = document.getElementById(data.divId);
                            var childImages = document.querySelectorAll('div[id=\'' + data.divId + '\'] img.adfuel-temp-image');
                            var childIframes = document.querySelectorAll('div[id=\'' + data.divId + '\'] div[id^=\'google_ads_iframe\']');
                            for (var y = 0; y < childImages.length; y++) {
                                var childImage = childImages[y];
                                try {
                                    adWrapper.removeChild(childImage);
                                } catch (err) {}
                            }
                            for (var x = 0; x < childIframes.length; x++) {
                                var iframe = childIframes[x];
                                iframe.style.display = 'block';
                            }
                        };
                        _showTempAds.push(showTempAd);
                        _hideTempAds.push(hideTempAd);
                    }
                }
            }
            metricApi.addMetric({ type: 'creatives', id: data.divId, data: data });
        }
    }

    function serialize(form) {
        if (!form || form.nodeName !== 'FORM') {
            return;
        }
        var i, j, q = [],
            t = {};
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
            if (form.elements[i].name === '') {
                continue;
            }
            switch (form.elements[i].nodeName) {
            case 'INPUT':
                switch (form.elements[i].type) {
                case 'text':
                case 'hidden':
                case 'password':
                case 'button':
                case 'reset':
                case 'submit':
                    q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
                    t[form.elements[i].name] = form.elements[i].value;
                    break;
                case 'file':
                    if (form.elements[i].files.length > 0) {
                        q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
                        t[form.elements[i].name] = form.elements[i].files[0]; // FileList object
                        t[form.elements[i].name + 'FileName'] = t[form.elements[i].name].name;
                    }
                    break;
                case 'checkbox':
                    if (form.elements[i].checked) {
                        q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
                        // to support multiple checkboxes in a group, store the values as an array
                        if (t[form.elements[i].name]) {
                            t[form.elements[i].name].push(form.elements[i].value);
                        } else {
                            t[form.elements[i].name] = [form.elements[i].value];
                        }
                    }
                    break;
                case 'radio':
                    if (form.elements[i].checked) {
                        q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
                        t[form.elements[i].name] = form.elements[i].value;
                    }
                    break;
                }
                break;
            case 'TEXTAREA':
                q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
                t[form.elements[i].name] = form.elements[i].value;
                break;
            case 'SELECT':
                switch (form.elements[i].type) {
                case 'select-one':
                    q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
                    t[form.elements[i].name] = form.elements[i].value;
                    break;
                case 'select-multiple':
                    for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                        if (form.elements[i].options[j].selected) {
                            q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].options[j].value));
                            t[form.elements[i].name] = form.elements[i].options[j].value;
                        }
                    }
                    break;
                }
                break;
            case 'BUTTON':
                switch (form.elements[i].type) {
                case 'reset':
                case 'submit':
                case 'button':
                    q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
                    t[form.elements[i].name] = form.elements[i].value;
                    break;
                }
                break;
            }
        }
        // return q.join("&");
        return t;
    }

    /*
    function retrieveFormData(form){
        if ( this._data !== undefined ) {
            // return cached value
            return this._data;
        }
        var i = 0, len = form.elements.length, item, data = {};
        for (; i < len; i++) {
            item = form.elements[ i ];
            if (item.items){
                var j = 0, innerLen = item.items.length, innerItem;
                for(; j < innerLen; j++){
                    innerItem = item.items[j];
                    if (innerItem.element.checked){
                        data[innerItem.name] = data[innerItem.name] ? data[innerItem.name] + ", " + innerItem.element.value : innerItem.element.value;
                    }
                }
            }else {
                if (item.element)
                    data[item.name] = item.element.value;
            }
        }
        // cache and return data
        return ( this._data = data );
    }

    */

    function submitCreativeReviewForm(form, callback) {
        /*
                console.log("h2cCanvas:", h2cCanvas);
                if (!_screenshotGenerated){
                    if (!confirm("You have not yet generated the screenshot. Are you sure you want to submit the form?")){
                        return;
                    }
                }
        */

        var data = serialize(form);
        //var canvasData = h2cCanvas ? renderScreenshotToURL() : "";
        // window.open(data[1], '_blank');

        var processData = function () {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    callback((xhr.status === 200));
                }
            };

            /*
             function b64toBlob(b64Data, contentType, sliceSize) {
             contentType = contentType || '';
             sliceSize = sliceSize || 512;

             var byteCharacters = atob(b64Data);
             var byteArrays = [];

             for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
             var slice = byteCharacters.slice(offset, offset + sliceSize);

             var byteNumbers = new Array(slice.length);
             for (var i = 0; i < slice.length; i++) {
             byteNumbers[i] = slice.charCodeAt(i);
             }

             var byteArray = new Uint8Array(byteNumbers);

             byteArrays.push(byteArray);
             }

             var blob = new Blob(byteArrays, {type: contentType});
             return blob;
             }
             */

            var formBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            //var screenshotBlob = b64toBlob(canvasData.replace("data:image/png;base64,",""), "image/png", 512);
            var requestBlob = new Blob([JSON.stringify(window.AdFuel.requestScriptText, null, 2)], { type: 'application/json' });
            var registryBlob = new Blob([JSON.stringify(window.AdFuel.registry, null, 2)], { type: 'application/json' });
            var browserData = {
                availHeight: screen.availHeight,
                availLeft: screen.availLeft,
                availTop: screen.availTop,
                availWidth: screen.availWidth,
                colorDepth: screen.colorDepth,
                height: screen.height,
                orientation: {
                    angle: screen.orientation.angle,
                    onchange: screen.orientation.onchange,
                    type: screen.orientation.type
                },
                pixelDepth: screen.pixelDepth,
                width: screen.width
            };
            var slotData = JSON.parse(JSON.stringify(window.AdFuel.metrics.slots));
            for (var x in slotData) {
                if (slotData.hasOwnProperty(x)) {
                    delete slotData[x].build_end;
                    delete slotData[x].build_start;
                    delete slotData[x].display;
                    delete slotData[x].queued;
                    delete slotData[x].render_start;
                    delete slotData[x].render_end;
                }
            }
            var slotsBlob = new Blob([JSON.stringify(slotData, null, 2)], { type: 'application/json' });
            var cookiesBlob = new Blob([JSON.stringify(document.cookie, null, 2)], { type: 'application/json' });
            var browserBlob = new Blob([JSON.stringify(browserData, null, 2)], { type: 'application/json' });
            var timelineBlob = new Blob([JSON.stringify(window.AdFuel.metrics.timeline, null, 2)], { type: 'application/json' });
            var urlBlob = new Blob([JSON.stringify(window.location.href, null, 2)], { type: 'application/json' });

            var fdata = new FormData();
            fdata.append('formData', formBlob);
            //fdata.append('screenshot', screenshotBlob);
            fdata.append('request', requestBlob);
            fdata.append('registry', registryBlob);
            fdata.append('slots', slotsBlob);
            fdata.append('cookies', cookiesBlob);
            fdata.append('browser', browserBlob);
            fdata.append('timeline', timelineBlob);
            fdata.append('url', urlBlob);

            var url = '//adfuel.turnerapps.com/api/email';
            if (url.indexOf('adfuel-services-host') !== -1) { // for testing
                url = 'http://localhost:3050/api/email';
            }
            xhr.open('POST', url, true);
            // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=AaB03x");
            xhr.send(fdata);
            // xhr.send( "formData=" + encodeURIComponent( window.JSON.stringify( data[0] ) ) );
            // xhr.send( "captureData=" + encodeURIComponent( window.JSON.stringify( data[1] ) ) );
            // xhr.send( "registryData=" + encodeURIComponent( window.JSON.stringify( data[2] ) ) );
            //metricApi.addMetric({type: 'modules', id: 'Creative Review', data: { reported_information: data[0], screenshot: data[1] } } );
            metricApi.addMetric({ type: 'modules', id: 'Creative Review', data: { reported_information: data[0] } });
        };

        if (data.Screenshot) {
            // Only process image files.
            if (!data.Screenshot.type.match('image.*')) {
                processData();
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function () {
                return function (e) {
                    data.Screenshot = e.target.result;
                    processData();
                };
            })(data.Screenshot);

            // Read in the image file as a data URL.
            reader.readAsDataURL(data.Screenshot);
        } else {
            processData();
        }
    }

    function _buildTabContent(container, tabName) {
        var collectionContainer = document.createElement('div');
        //collectionContainer.className = "adfuel-console-collection-container";
        if (tabName.indexOf('request_') === 0) {
            tabName = tabName.replace('request_', '');
        }
        var collectionId = container.id.split('-')[3];
        var collection = metricApi.metrics[collectionId][tabName];
        var collectionItems = document.createElement('ul');
        collectionItems.id = 'adfuel_console_' + collectionId + '_items';
        //collectionItems.className = "adfuel-console-collection-list";
        collectionItems.style.listStyleType = 'none';
        collectionItems.style.padding = '0';
        collectionItems.style.margin = '0';
        for (var collectionItemName in collection) {
            if (collection.hasOwnProperty(collectionItemName)) {
                var collectionItem = collection[collectionItemName];
                if (!isNaN(parseInt(collectionItemName))) {
                    collectionItemName = 'request_' + (parseInt(collectionItemName) + 1);
                }
                var collectionListItem = document.createElement('li');
                collectionListItem.id = 'adfuel-console-' + collectionId + '-' + collectionItemName;
                collectionListItem.style.display = 'block';
                //collectionListItem.className = "adfuel-console-collection-list-item";

                var collectionListItemContainer = document.createElement('div');
                //collectionListItemContainer.className = "adfuel-console-collection-list-item-container";

                var collectionListItemLabelHeading = document.createElement('span');
                collectionListItemLabelHeading.style.display = 'inline-block';
                collectionListItemLabelHeading.style.width = '25%';
                collectionListItemLabelHeading.style.minWidth = '150px';
                collectionListItemLabelHeading.style.textAlign = 'left';
                collectionListItemLabelHeading.style.margin = '0';
                collectionListItemLabelHeading.style.padding = '0';
                collectionListItemLabelHeading.style.paddingRight = '10px';
                collectionListItemLabelHeading.style['float'] = 'left';
                collectionListItemLabelHeading.style.fontWeight = 'bolder';
                collectionListItemLabelHeading.style.borderBottom = 'solid 1px #BCBCBC';
                collectionListItemLabelHeading.innerHTML = capitalizeFirstLetter(collectionItemName.replace(/_/g, ' ') + ': ');

                collectionListItemContainer.appendChild(collectionListItemLabelHeading);

                if (collectionItem === null) {
                    collectionItem = 'N/A';
                } else if (!collectionItem) {
                    collectionItem = 'False';
                }

                var collectionItemDetailFields = Object.getOwnPropertyNames(collectionItem);
                var collectionType = typeof collectionItem;


                if (collectionType === 'string' || collectionType === 'boolean' || collectionType === 'number' || (Array.isArray(collectionItem) && collectionItem.length == 1)) {
                    var propName = '';
                    var isURL = false;
                    if (Array.isArray(collectionItem)) {
                        isURL = isValidURL(collectionItem[0]);
                        propName = isURL ? collectionItem[0] : capitalizeFirstLetter(collectionItem[0]);
                    } else {
                        isURL = isValidURL(collectionItem);
                        propName = isURL ? collectionItem : capitalizeFirstLetter(collectionItem);
                    }

                    var propSpan = document.createElement('div');
                    propSpan.style.margin = '0';
                    propSpan.style.padding = '0';
                    propSpan.style.display = 'block';
                    propSpan.style.width = '65%';
                    propSpan.style.maxWidth = '800px';
                    propSpan.style['float'] = 'left';
                    propSpan.style.borderBottom = 'solid 1px #BCBCBC';
                    propSpan.style.textOverflow = 'ellipsis';
                    propSpan.style.whiteSpace = 'nowrap';
                    propSpan.style.overflow = 'hidden';

                    if (isURL) {
                        var propAnchor = document.createElement('a');
                        propAnchor.href = propName;
                        propAnchor.target = '_blank';
                        propAnchor.title = propName;
                        propAnchor.appendChild(document.createTextNode(propName));
                        propSpan.appendChild(propAnchor);
                    } else {
                        propSpan.appendChild(document.createTextNode(propName));
                    }

                    collectionListItemContainer.appendChild(propSpan);

                    var clearEl = document.createElement('div');
                    clearEl.style.clear = 'both';
                    collectionListItemContainer.appendChild(clearEl);

                } else if (Array.isArray(collectionItem)) {
                    var collectionDetailListContainer = document.createElement('div');
                    collectionDetailListContainer.style.width = '65%';
                    collectionDetailListContainer.style.margin = '0';
                    collectionDetailListContainer.style.position = 'relative';
                    collectionDetailListContainer.style['float'] = 'left';
                    collectionDetailListContainer.style.textOverflow = 'ellipsis';
                    collectionDetailListContainer.style.whiteSpace = 'nowrap';
                    collectionDetailListContainer.style.overflowX = 'hidden';
                    var collectionDetailList = document.createElement('ul');
                    collectionDetailList.style.listStyleType = 'none';
                    collectionDetailList.style.margin = '0';
                    collectionDetailList.style.padding = '0';
                    for (var x = 0; x < collectionItem.length; x++) {
                        var detailListItem = document.createElement('li');
                        detailListItem.style.marginLeft = '0';
                        detailListItem.style.paddingLeft = '0';
                        detailListItem.style.borderBottom = 'solid 1px #BCBCBC';
                        detailListItem.style.margin = '0';
                        detailListItem.style.padding = '0';
                        detailListItem.style.display = 'block';
                        detailListItem.style.width = '100%';
                        detailListItem.style.maxWidth = '800px';
                        detailListItem.style['float'] = 'left';
                        detailListItem.style.borderBottom = 'solid 1px #BCBCBC';
                        detailListItem.style.textOverflow = 'ellipsis';
                        detailListItem.style.whiteSpace = 'nowrap';
                        detailListItem.style.overflow = 'hidden';
                        var isURL = isValidURL(collectionItem[x]);
                        var propName = '';
                        if (isURL) {
                            propName = collectionItem[x];
                            var propAnchor = document.createElement('a');
                            propAnchor.href = propName;
                            propAnchor.target = '_blank';
                            propAnchor.title = propName;
                            propAnchor.appendChild(document.createTextNode(propName));
                            detailListItem.appendChild(propAnchor);
                        } else {
                            propName = capitalizeFirstLetter(collectionItem[x]);
                            detailListItem.appendChild(document.createTextNode(propName));
                        }
                        collectionDetailList.appendChild(detailListItem);
                    }
                    collectionDetailListContainer.appendChild(collectionDetailList);
                    collectionListItemContainer.appendChild(collectionDetailListContainer);
                    var clearEl = document.createElement('div');
                    clearEl.style.clear = 'both';
                    collectionListItemContainer.appendChild(clearEl);
                } else {
                    var collectionDetailListContainer = document.createElement('div');
                    collectionDetailListContainer.style.width = '65%';
                    collectionDetailListContainer.style.maxWidth = '800px';
                    collectionDetailListContainer.style.margin = '0';
                    collectionDetailListContainer.style.position = 'relative';
                    collectionDetailListContainer.style.left = '5px';
                    //collectionDetailListContainer.style['float'] = "right";
                    collectionDetailListContainer.style.borderBottom = 'solid 1px #BCBCBC';
                    collectionDetailListContainer.style.textOverflow = 'ellipsis';
                    collectionDetailListContainer.style.whiteSpace = 'nowrap';
                    collectionDetailListContainer.style.overflowX = 'hidden';
                    var collectionDetailList = document.createElement('ul');
                    collectionDetailList.style.listStyleType = 'none';
                    collectionDetailList.style.margin = '0';
                    collectionDetailList.style.padding = '0';
                    for (var x = 0; x < collectionItemDetailFields.length; x++) {
                        var detailListItem = document.createElement('li');
                        detailListItem.style.padding = '0';
                        detailListItem.style.margin = '0';
                        var isURL = isValidURL(collectionItemDetailFields[x]);
                        var propName = '';
                        if (isURL) {
                            propName = collectionItemDetailFields[x];
                        } else {
                            propName = capitalizeFirstLetter(collectionItemDetailFields[x]);
                        }
                        var value = collectionItem[collectionItemDetailFields[x]];
                        if (typeof value !== 'undefined') {
                            var propLabel = document.createElement('label');
                            propLabel.style.width = '25%';
                            propLabel.appendChild(document.createTextNode(propName + ': '));
                            detailListItem.appendChild(propLabel);
                            var valueType = typeof value;
                            if (valueType == 'object') {
                                if (Array.isArray(value)) {
                                    value = value.join(', ');
                                } else {
                                    value = JSON.stringify(value);
                                }
                            }
                            var propSpan = document.createElement('span');
                            propSpan.title = value;
                            propSpan.appendChild(document.createTextNode(value));
                            detailListItem.appendChild(propSpan);
                        } else {
                            detailListItem.appendChild(document.createTextNode(propName));
                        }
                        collectionDetailList.appendChild(detailListItem);
                    }
                    collectionDetailListContainer.appendChild(collectionDetailList);
                    collectionListItemContainer.appendChild(collectionDetailListContainer);
                    //var clearEl = document.createElement("div");
                    //clearEl.style.clear = "both";
                    //collectionListItemContainer.appendChild(clearEl);
                }

                collectionListItem.appendChild(collectionListItemContainer);
                collectionItems.appendChild(collectionListItem);
            }
        }
        collectionContainer.style.overflowY = 'auto';
        collectionContainer.style.height = '80%';
        collectionContainer.style.minHeight = '250px';

        collectionContainer.appendChild(collectionItems);

        container.appendChild(collectionContainer);
    }

    function _buildPanelContent(panel, tabs) {
        if (!panel) return;

        panel.innerHTML = '';
        var containerId = panel.id.replace('adfuel-console-panel-', '');
        var collection = metricApi.metrics[containerId];
        function filterPrivate(value) {
            return value.indexOf('_') < 0 || value.indexOf('_') > 0;
        }
        function buildConsolePanelCollectionItem(collectionItem, nested) {
            var collectionDetailList = document.createElement('ul');
            collectionDetailList.className = 'adfuel-console-collection-list-item-detail-list';

            var collectionItemDetailFields = Object.getOwnPropertyNames(collectionItem).filter(filterPrivate);

            for (var y = 0; y < collectionItemDetailFields.length; y++) {
                var collectionDetailListItem = document.createElement('li');
                collectionDetailListItem.className = 'adfuel-console-collection-list-item-detail-list-item';

                var collectionDetailListItemContainer = document.createElement('div');
                collectionDetailListItemContainer.className = 'adfuel-console-collection-list-item-detail-list-item-container';

                var collectionDetailListItemLabel = document.createElement('label');
                collectionDetailListItemLabel.className = 'adfuel-console-collection-list-item-detail-list-item-label';

                var propKey = collectionItemDetailFields[y];
                var propName = capitalizeFirstLetter(propKey.replace(/_/g, ' '));

                collectionDetailListItemLabel.appendChild(document.createTextNode(propName));
                collectionDetailListItem.appendChild(collectionDetailListItemLabel);

                if (Array.isArray(collectionItem[propKey]) && collectionItem[propKey].length > 1) {
                    collectionItem[propKey] = collectionItem[propKey].join('<br>');
                    collectionItem[propKey] = collectionItem[propKey] + '<br><br>';
                }

                var clearDiv = document.createElement('div');
                clearDiv.style.clear = 'both';

                var valueWrapper = document.createElement('div');
                if (!Array.isArray(collectionItem[propKey]) && typeof collectionItem[propKey] === 'object' && collectionItem[propKey] !== null) {
                    var objectList = buildConsolePanelCollectionItem(collectionItem[propKey], true);
                    var clear = document.createElement('div');
                    clear.style.clear = 'both';
                    valueWrapper.appendChild(clear);
                    valueWrapper.appendChild(objectList);
                } else {
                    valueWrapper.className = 'truncate';
                    valueWrapper.innerText = collectionItem[propKey];
                    valueWrapper.innerHTML = collectionItem[propKey];
                    valueWrapper.title = collectionItem[propKey];
                }
                if (nested) collectionDetailListItem.appendChild(clearDiv);
                collectionDetailListItem.appendChild(valueWrapper);
                collectionDetailListItem.appendChild(clearDiv);


                collectionDetailList.appendChild(collectionDetailListItem);
            }
            return collectionDetailList;
        }

        if (tabs) {
            var tabNames = Object.getOwnPropertyNames(collection);
            _buildPanelTabs(panel, tabNames);
        } else {
            // Old Style Panels
            var collectionContainer = document.createElement('div');
            collectionContainer.className = 'adfuel-console-collection-container';

            var collectionItems = document.createElement('ul');
            collectionItems.id = 'adfuel_console_' + containerId + '_items';
            collectionItems.className = 'adfuel-console-collection-list';
            collectionItems.style.listStyleType = 'none';
            collectionItems.style.padding = '0';
            collectionItems.style.margin = '0';

            for (var collectionItemName in collection) {
                if (collection.hasOwnProperty(collectionItemName)) {
                    var collectionItem = collection[collectionItemName];
                    var collectionListItem = document.createElement('li');
                    collectionListItem.id = 'adfuel-console-' + containerId + '-' + collectionItemName;
                    collectionListItem.className = 'adfuel-console-collection-list-items';

                    var collectionListItemContainer = document.createElement('div');
                    collectionListItemContainer.className = 'adfuel-console-collection-list-item-container';

                    var collectionListItemLabel = document.createElement('label');
                    collectionListItemLabel.className = 'adfuel-console-collection-list-item-label';

                    var collectionListItemLabelHeading = document.createElement('span');

                    collectionListItemLabel.appendChild(collectionListItemLabelHeading);
                    collectionListItemLabel.appendChild(document.createTextNode(capitalizeFirstLetter(collectionItemName.replace(/_/g, ' '))));
                    collectionListItemContainer.appendChild(collectionListItemLabel);

                    var separator = document.createElement('hr');
                    separator.className = 'adfuel-console-separator';

                    collectionListItemContainer.appendChild(separator);

                    var collectionDetailList;

                    if (Array.isArray(collectionItem)) {
                        for (var arrayIndex = 0; arrayIndex < collectionItem.length; arrayIndex++) {
                            collectionItem = collectionItem[arrayIndex];
                            collectionDetailList = buildConsolePanelCollectionItem(collectionItem);
                            collectionListItemContainer.appendChild(collectionDetailList);
                        }
                    } else {
                        collectionDetailList = buildConsolePanelCollectionItem(collectionItem);
                        collectionListItemContainer.appendChild(collectionDetailList);
                    }

                    collectionListItem.appendChild(collectionListItemContainer);
                    collectionItems.appendChild(collectionListItem);
                }
            }

            collectionContainer.appendChild(collectionItems);

            panel.appendChild(collectionContainer);
        }
    }

    function _closeAdFuelConsole() {

        var openContainer = document.querySelector('div.adfuel-console-button-container');
        var openButton = document.querySelector('body > div.adfuel-console-button-container > a');

        var consoleFiller = document.querySelector('div.adfuel-console-filler');
        var consoleContainer = document.querySelector('div.adfuel-console');

        consoleFiller.style.display = 'none';
        consoleContainer.style.display = 'none';

        if (openContainer && openButton) {
            openContainer.style.display = 'inline-block';
            addEvent(openButton, 'click', _openAdFuelConsole);
            window.AdFuel.openConsole = _openAdFuelConsole;
        }
        return;
    }

    function setRenderCompleteListener() {
        window.googletag.cmd.push(function () {
            window.googletag.pubads().addEventListener('slotRenderEnded', function (event) {
                try {
                    var detail = {};
                    if (event.slot) {
                        detail.asset = event.slot;
                    }
                    if (event.slot.getTargeting('pos')) {
                        detail.pos = event.slot.getTargeting('pos');
                    }
                    if (event.isEmpty) {
                        detail.empty = true;
                    } else {
                        detail.empty = false;
                    }
                    if (event.size) {
                        detail.renderedSize = event.size;
                    }
                    if (event.creativeId) {
                        detail.creativeId = event.creativeId;
                    }
                    if (event.lineItemId) {
                        detail.lineItemId = event.lineItemId;
                    }
                    if (event.serviceName) {
                        detail.serviceName = event.serviceName;
                    }
                    if (event.slot.getSlotElementId()) {
                        detail.divId = event.slot.getSlotElementId();
                    }
                    var info = window.AdFuel.pageSlots[detail.divId].getResponseInformation();
                    detail.campaignId = info && info.campaignId ? info.campaignId : 0;
                    detail.advertiserId = info && info.advertiserId ? info.advertiserId : 0;
                    metricApi.addMetric({
                        type: 'slots',
                        id: detail.divId,
                        data: {
                            advertiserId: detail.advertiserId,
                            campaignId: detail.campaignId,
                            creativeId: detail.creativeId,
                            lineItemId: detail.lineItemId
                        }
                    });
                } catch (ex) {
                    console.error('error reading slotRenderEnded event', {
                        error: ex
                    });
                }
            });
        });
    }

    function _addTargetingForCreativeExtraction(slots, callback) {
        for (var slotIndex = 1; slotIndex < slots.length; slotIndex++) {
            var slot = slots[slotIndex];
            if (_appliedTargeting.indexOf(slot.rktr_slot_id) < 0) {
                window.AdFuel.addSlotLevelTarget(slot.rktr_slot_id, 'elemId', slot.rktr_slot_id);
                _appliedTargeting.push(slot.rktr_slot_id);
            }
        }
        window.AdFuel.addEvent(document, 'SlotIdChange', function (e) {
            if (e.detail.newId !== e.detail.originalId) {
                if (_appliedTargeting.indexOf(e.detail.newId) < 0) {
                    window.AdFuel.addSlotLevelTarget(e.detail.newId, 'elemId', e.detail.newId);
                    _appliedTargeting.push(e.detail.newId);
                }
            }
        });
        callback();
    }

    function registerModuleWithAdFuel() {
        metricApi = window.AdFuel.registerModule('AdFuel Console Tool', {
            preQueueCallback: _addTargetingForCreativeExtraction,
            metricUpdateCallback: _refreshAdFuelConsoleContent
        });
        metricApi.addMetric({ type: 'creative review', id: 'Form', data: {} });
        window.AdFuel.addEvent(window, 'message', parseMessage);
        addKeypressModule();
        addDHTMLGridModule();
        setRenderCompleteListener();
        //window.AdFuel.renderAdFuelConsole();
        _refreshAdFuelConsoleContent({});
        checkHash();
        window.addEventListener('hashchange', checkHash, false);
    }

    function addKeypressModule() {
        var renderFullConsole = function () {
            fullConsole = true;
            _renderAdFuelConsole();
        };
        var renderCreativeReviewConsole = function () {
            fullConsole = false;
            _renderAdFuelConsole();
        };
        var initializeKeypressListeners = function () {
            // Ctrl-Shift-Z to open full console
            var defaults = {
                prevent_default: false,
                prevent_repeat: false,
                is_sequence: false,
                is_exclusive: true,
                is_solitary: true
            };
            var options = {
                keys: 'ctrl shift z',
                on_keydown: renderFullConsole
            };
            var consoleListener = new window.keypress.Listener(window, defaults);
            consoleListener.register_combo(options);

            // d-o-h to open just Creative Review
            defaults = {
                prevent_default: false,
                prevent_repeat: false,
                is_sequence: true,
                is_exclusive: true,
                is_solitary: true
            };
            options = {
                keys: '^ d o h $',
                on_keydown: renderCreativeReviewConsole
            };
            var feedbackListener = new window.keypress.Listener(window, defaults);
            feedbackListener.register_combo(options);
        };

        if (!window.keypress) {
            var a = document,
                b = a.createElement('script'),
                c = a.getElementsByTagName('script')[0],
                d = /^(complete|loaded)$/,
                e = false,
                f = 'https:' === document.location.protocol;
            b.type = 'text/javascript';
            b.async = true;
            b.src = (f ? 'https:' : 'http:') + '//'+cdnRoot+'/ads/adfuel/modules/keypress.js';
            b.onload = b.onreadystatechange = function () {
                if (!e && !(('readyState' in b) && d.test(b.readyState))) {
                    b.onload = b.onreadystatechange = null;
                    e = true;
                    initializeKeypressListeners();
                }
            };
            c.parentNode.insertBefore(b, c);
        } else {
            initializeKeypressListeners();
        }
    }

    function addDHTMLGridModule() {
        var a = document,
            b = a.createElement('script'),
            c = a.getElementsByTagName('script')[0],
            d = /^(complete|loaded)$/,
            e = false,
            f = 'https:' === document.location.protocol;
        b.type = 'text/javascript';
        b.async = true;
        b.src = (f ? 'https:' : 'http:') + '//'+cdnRoot+'/ads/adfuel/modules/dhtmlxgrid.min.js';
        c.parentNode.insertBefore(b, c);
    }

    function init() {
        setDevice();
        if (window.AdFuel && window.AdFuel.cmd) {
            window.AdFuel.cmd.push(registerModuleWithAdFuel);
        } else if (window.AdFuel) {
            registerModuleWithAdFuel();
        } else {
            if (document.addEventListener) {
                document.addEventListener('AdFuelCreated', registerModuleWithAdFuel, true);
            } else if (document.attachEvent) {
                document.attachEvent('onAdFuelCreated', registerModuleWithAdFuel);
            }
        }
    }

    init();
})();


////////////////////////////////////////////
//GUID 2.1
////////////////////////////////////////////

/*!
 GUID AdFuel Module - Version 2.1
 - Implementation of MetricAPI returned from AdFuel when registering module
 - CSD-1129: Protocol-less url for GUID cookie
  !*/

(function createGUIDModule() {

    var noop = function() {
        return false;
    };
    var metricApi = {
        addMetric: noop,
        getMetricById: noop,
        getMetricsByType: noop,
        getMetricTypes: noop
    };

    //todo: may be privatized
    window.cnnad_haveCookie = function(name) {
        return document.cookie && (document.cookie.indexOf("; " + name + "=") >= 0 || document.cookie.indexOf(name + "=") == 0);
    };

    //todo: may be privatized
    window.cnnad_readCookie = function(name) {
        if (document.cookie) {
            var ca = document.cookie.split(';');
            var nameEQ = name + "=";
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length); //delete spaces
                }
                if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        }
    };

    //used by freewheel helper
    window.turner_getGuid = function() {
        return window.cnnad_readCookie("ug");
    };

    (function cnnad_ugsync() {

        var objectProto = Object.prototype;
        var toString = objectProto.toString;

        function isFunction(object) {
            return toString.call(object) === '[object Function]';
        }

        function isObject(object) {
            var type = typeof object;
            return type === 'function' || type === 'object' && !!object;
        }

        function getURLParam(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            if (document.location.search) {
                var results = regex.exec(document.location.search);
                if (results) {
                    return results[1];
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }

        var log = function() {}; //noop

        if (isObject(window.console) && isFunction(window.console.log) && getURLParam("debug") == "true") {
            log = function( /* arguments */ ) {
                var args = ['[AdFuelModule - Guid]'];
                args.push.apply(args, arguments);
                window.console.log.apply(window.console, args);
            };
        }

        function processCookie() {

            function registerModuleWithAdFuel() {
                //todo: remove AdFuel.readCookie("ug") once everyone is on new ais.js
                var guid = window.turner_getGuid();
                metricApi = window.AdFuel.registerModule('GUID', {});
                log('setting guid targeting', {
                    guid: guid
                });
                metricApi.addMetric({
                    type: 'modules',
                    id: 'GUID',
                    data: {
                        targeting: {
                            guid: guid
                        }
                    }
                });
                window.AdFuel.addPageLevelTarget('guid', guid);
            }

            if (window.AdFuel) {
                //AdFuel loaded first
                registerModuleWithAdFuel();
            } else {
                //wait for AdFuel to load
                if (document.addEventListener) {
                    document.addEventListener('AdFuelCreated', registerModuleWithAdFuel, true);
                } else if (document.attachEvent) {
                    document.attachEvent('onAdFuelCreated', registerModuleWithAdFuel);
                }
            }
        }

        if (window.cnnad_haveCookie('ugs')) {
            processCookie();
        } else {
            //execute script to set cookie
            var guid_url = "//www.ugdturner.com/xd.sjs";

            var a = document,
                b = a.createElement("script"),
                c = a.getElementsByTagName("script")[0],
                d = /^(complete|loaded)$/,
                e = false;

            b.type = "text/javascript";
            b.async = true;
            b.src = guid_url;

            b.onload = b.onreadystatechange = function() {
                if (!e && !(('readyState' in b) && d.test(b.readyState))) {
                    b.onload = b.onreadystatechange = null;
                    e = true;
                    processCookie();
                }
            };

            c.parentNode.insertBefore(b, c);
        }

    })();
})();

////////////////////////////////////////////
//Krux 1.2
////////////////////////////////////////////

/*
   <arguments>
        {
            "controlTag" : {
                "isRequired": false,
                "isBoolean": false,
                "defaultValue": ""
            }
        }
   </arguments>
*/
/*!
    Krux AdFuel Module - Version 1.2.2
    - PII Filtering
    - Fix for AdFuel-1.1.x
!*/
(function createKruxModule() {

    var re = /(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/i;

    var MODULE_NAME = 'Krux';
    var MODULE_VERSION = '1.2.2';

    window.Krux || ((window.Krux = function () {window.Krux.q.push(arguments);}).q = []);
    (function () {
        function retrieve(n) {
            var k = 'kx' + '' + n, ls = (function () {
                try {
                    return window.localStorage;
                } catch(e) {
                    return null;
                }
            })();
            if (ls) {
                return ls[k] || '';
            } else if (navigator.cookieEnabled) {
                var m = document.cookie.match(k + '=([^;]*)');
                return (m && unescape(m[1])) || '';
            } else {
                return '';
            }
        }
        window.Krux.user = retrieve('user');
        window.Krux.segments = retrieve('segs') ? retrieve('segs').split(',') : [];
    })();


    window.krux_getDESegments = function () {
        var segmentString = '&kxid=';
        if (window.Krux.user) {
            segmentString += window.Krux.user;
        }
        segmentString += '&kxseg=' + window.kvs.join(',');
        return segmentString;
    };

    window.krux_getFWSegments = function () {
        return 'kxseg=' + window.Krux.segments.join(',kxseg=');
    };

    window.krux_getUser = function () {
        return window.Krux.user;
    };

    window.krux_getFWKeyValues = function (prefix, limit) {
        var segPrefix = prefix || '_fwu:386123:';
        var segLimit = limit || 35;
        var fwKVP = {};
        for (var x = 0; x < window.Krux.segments.length; x++) {
            if (x < segLimit) fwKVP[segPrefix + window.Krux.segments[x]] = 1;
        }
        return fwKVP;
    };

    function piiIsPresentInQueryString() {
        if (document.location.search) {
            var dirtyResults = document.location.search.search(re) + 1;
            var cleanResults;
            try{
                cleanResults = decodeURIComponent(document.location.search).search(re) + 1;
            }catch(err) {
                cleanResults = dirtyResults;
            }
            return dirtyResults || cleanResults;
        } else {
            return false;
        }
    }

    function piiIsPresentInHash() {
        if (document.location.hash) {
            var dirtyResults = document.location.hash.search(re) + 1;
            var cleanResults;
            try{
                cleanResults = decodeURIComponent(document.location.hash).search(re) + 1;
            }catch(err) {
                cleanResults = dirtyResults;
            }
            return dirtyResults || cleanResults;
        } else {
            return false;
        }
    }

    function piiIsPresentInReferrer() {
        if (document.referrer) {
            var dirtyResults = document.referrer.search(re) + 1;
            var cleanResults;
            try{
                cleanResults = decodeURIComponent(document.location.referrer).search(re) + 1;
            }catch(err) {
                cleanResults = dirtyResults;
            }
            return dirtyResults || cleanResults;
        } else {
            return false;
        }
    }

    window.Krux.setControlTag = function (controlTagId) {

        var objectProto = Object.prototype;
        var toString = objectProto.toString;

        function isFunction(object) {
            return toString.call(object) === '[object Function]';
        }

        function isObject(object) {
            var type = typeof object;
            return type === 'function' || type === 'object' && !!object;
        }

        function getURLParam(name) {
            name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
            var regexS = '[\\?&]' + name + '=([^&#]*)';
            var regex = new RegExp(regexS);
            if (document.location.search) {
                var results = regex.exec(document.location.search);
                if (results) {
                    return results[1];
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }

        var log = function () {}; //noop

        if (isObject(window.console) && isFunction(window.console.log) && getURLParam('debug') === 'true') {
            log = function (/* arguments */) {
                var args = ['[AdFuelModule - ' + MODULE_NAME + ' ' + MODULE_VERSION + ']'];
                args.push.apply(args, arguments);
                window.console.log.apply(window.console, args);
            };
        }

        function processCookie() {

            var noop = function () {return false;};
            var metricApi = { addMetric: noop, getMetricById: noop, getMetricsByType: noop, getMetricTypes: noop };

            function registerModuleWithAdFuel() {
                var kuid = window.Krux.user;
                var ksg = window.Krux.segments.filter(function (segment, index) {
                    return index < 35;
                });

                log('setting krux targeting', {kuid: kuid, ksg: ksg});
                metricApi = window.AdFuel.registerModule('Krux', {}) || metricApi;
                window.AdFuel.addPageLevelTarget('kuid', kuid);
                window.AdFuel.addPageLevelTarget('ksg', ksg);
                metricApi.addMetric({type: 'modules', id: 'Krux', data: { targeting: { kuid: kuid, ksg: ksg } } });
            }

            if (window.AdFuel) {
                //AdFuel loaded first
                registerModuleWithAdFuel();
            } else {
                //wait for AdFuel to load
                if (document.addEventListener) {
                    document.addEventListener('AdFuelCreated', registerModuleWithAdFuel, true);
                } else if (document.attachEvent) {
                    document.attachEvent('onAdFuelCreated', registerModuleWithAdFuel);
                }
            }
        }

        //execute script to set cookie
        var a = document,
            b = a.createElement('script'),
            c = a.getElementsByTagName('script')[0],
            d = /^(complete|loaded)$/,
            e = false;

        b.type = 'text/javascript';
        b.async = true;

        var m, src = (m = a.location.href.match(/\bkxsrc=([^&]+)/)) && decodeURIComponent(m[1]);
        b.src = /^https?:\/\/([^\/]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === 'disable' ? '' :
            (a.location.protocol === 'https:' ? 'https:' : 'http:') + '//cdn.krxd.net/controltag?confid=' + controlTagId;

        b.onload = b.onreadystatechange = function () {
            if (!e && !(('readyState' in b) && d.test(b.readyState))) {
                b.onload = b.onreadystatechange = null;
                e = true;
                processCookie();
            }
        };

        if (!piiIsPresentInHash() && !piiIsPresentInQueryString() && !piiIsPresentInReferrer()) {
            c.parentNode.insertBefore(b, c);
        }
    };

    //eslint-disable-next-line
    if ('ITcATbN4') {
        //set based on site
        var controlTag = window.location.hostname.toLowerCase().match(/^edition\.cnn\.com/) ? 'ITb_9Zup' : 'ITcATbN4';
        window.Krux.setControlTag(controlTag);
    }
})();


////////////////////////////////////////////
//PII Filter
////////////////////////////////////////////

/*!
    PII Filter AdFuel Module - Version 1.0
    - Compatible with AdFuel 1.x and AdFuel 2.x
    - Initial Implementation
!*/
(function createAdFuelModule() {

    var MODULE_NAME = "PII Filter";
    var re = /(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/i;

    function piiIsPresentInQueryString() {
        var regex = new RegExp(re);
        if (document.location.search) {
            var dirtyResults = document.location.search.search(re) + 1;
            var cleanResults;
            try{
                cleanResults = decodeURIComponent(document.location.search).search(re) + 1;
            }catch(err){
                cleanResults = dirtyResults;
            }
            var results = { dirty: dirtyResults, clean: cleanResults };
            return dirtyResults || cleanResults;
        } else {
            return false;
        }
    }

    function piiIsPresentInHash() {
        var regex = new RegExp(re);
        if (document.location.hash) {
            var dirtyResults = document.location.hash.search(re) + 1;
            var cleanResults;
            try{
                cleanResults = decodeURIComponent(document.location.hash).search(re) + 1;
            }catch(err){
                cleanResults = dirtyResults;
            }
            var results = { dirty: dirtyResults, clean: cleanResults };
            return dirtyResults || cleanResults;
        } else {
            return false;
        }
    }

    function piiIsPresentInReferrer() {
        var regex = new RegExp(re);
        if (document.referrer){
            var dirtyResults = document.referrer.search(re) + 1;
            var cleanResults;
            try{
                cleanResults = decodeURIComponent(document.location.referrer).search(re) + 1;
            }catch(err){
                cleanResults = dirtyResults;
            }
            var results = { dirty: dirtyResults, clean: cleanResults };
            return dirtyResults || cleanResults;
        } else {
            return false;
        }
    }

    function filterDFPRequest(){
        if (piiIsPresentInQueryString() || piiIsPresentInHash() || piiIsPresentInReferrer()){
            console.log("[AdFuelModule - PII Filter] Filtering DFP Request due to PII in query string.");
            var AdFuelMethods = Object.getOwnPropertyNames(window.AdFuel);
            for (var x = 0; x < AdFuelMethods.length; x++){
                window.AdFuel[AdFuelMethods[x]] = function(){};
            }
            window.googletag = null;
        }
    }

    function init() {
        if (window.AdFuel) {
            //AdFuel loaded first
            filterDFPRequest();
        } else {
            //wait for AdFuel to load
            if (document.addEventListener) {
                document.addEventListener("AdFuelCreated", filterDFPRequest, true);
            } else if (document.attachEvent) {
                document.attachEvent('onAdFuelCreated', filterDFPRequest);
            }
        }
    }

    init();

})();


////////////////////////////////////////////
//Transaction ID 2.0
////////////////////////////////////////////

/*!
 TransactionID AdFuel Module - Version 2.0
 - Implementation of MetricAPI returned from AdFuel when registering module
 !*/
(function createTransactionIDModule() {
    var noop = function(){return false;};
    var metricApi = { addMetric: noop, getMetricById: noop, getMetricsByType: noop, getMetricTypes: noop };

    window.cnnad_transactionID = null;

    //referenced by registries
    window.cnnad_getTransactionID = function () {
        if (!window.cnnad_transactionID) {
            window.cnnad_transactionID = Math.round((new Date()).getTime() / 1000) + '' + Math.floor(Math.random() * 9007199254740992);
        }
        return window.cnnad_transactionID;
    };

    window.turner_getTransactionId = window.cnnad_getTransactionID;

    window.turner_getTransactionId();


    function init() {

        var objectProto = Object.prototype;
        var toString = objectProto.toString;

        function isFunction(object) {
            return toString.call(object) === '[object Function]';
        }

        function isObject(object) {
            var type = typeof object;
            return type === 'function' || type === 'object' && !!object;
        }

        function getURLParam(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            if (document.location.search) {
                var results = regex.exec(document.location.search);
                if (results) {
                    return results[1];
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }

        var log = function () {
        }; //noop

        if (isObject(window.console) && isFunction(window.console.log) && getURLParam("debug") == "true") {
            log = function (/* arguments */) {
                var args = ['[AdFuelModule - TransactionId]'];
                args.push.apply(args, arguments);
                window.console.log.apply(window.console, args);
            };
        }

        function registerModuleWithAdfuel() {
            var transId = window.turner_getTransactionId();
            metricApi = AdFuel.registerModule('Transaction Id', {});
            metricApi.addMetric({type: 'modules', id: 'Transaction Id', data: { targeting: { transId: transId } } } );
            window.AdFuel.addPageLevelTarget('transId', transId);
        }

        if (window.AdFuel) {
            //AdFuel loaded first
            registerModuleWithAdfuel();
        } else {
            //wait for AdFuel to load
            if (document.addEventListener) {
                document.addEventListener('AdFuelCreated', registerModuleWithAdfuel, true);
            } else if (document.attachEvent) {
                document.attachEvent('onAdFuelCreated', registerModuleWithAdfuel);
            }
        }
    }

    init();
})();

