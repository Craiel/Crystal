declare("Utils", function() {
	include("$");
    
    // Get the global namespace and register the local namespace root
    var global = Function('return this')() || (42, eval)('this');

    function Utils() {
        // ---------------------------------------------------------------------------
        // misc utility functions
        // ---------------------------------------------------------------------------
        this.rgba = function(r, g, b, a) {
              r = ~~r || 0;
              g = ~~g || 0;
              b = ~~b || 0;
              a = a || 1;
              return ["rgba(", r, ",", g,",", b, ",", a,")"].join("");
        };
        
        this.pad = function(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        };
        
        this.getRandom = function(min, max) {
            return Math.random() * (max - min) + min;
        };
        
        this.getRandomInt = function(min, max) {
            return ~~(Math.random() * (max - min + 1)) + min;
        };
        
        this.getGlobal = function() {
            return global;
        };
        
        this.isJsonString = function(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            
            return true;
        };
        
        this.enumIsDefined = function(enumObject, value) {
            for(var key in enumObject) {
                if(enumObject[key] === value) {
                    return true;
                }
            }
            
            return false;
        };
        
        this.mergeObjects = function(objectA, objectB) {
            var result = {};
            if(objectA !== undefined) {
                for(var key in objectA) {
                    result[key] = objectA[key];
                };
            }
            
            if(objectB !== undefined) {
                for(var key in objectB) {
                    result[key] = objectB[key];
                };
            }
            
            return result;
        };
        
        this.getStackTrace = function() {
            return new Error().stack;
        };
        
        // ---------------------------------------------------------------------------
        // element and jquery functions
        // ---------------------------------------------------------------------------
        
        // NOTE: this will not work when running from disk, at least for chrome.
        //   Both rules lists will be null
        this.getDefinedClasses = function() {
            var definedClasses = [];
            for(var i = 0;i < document.styleSheets.length; i++) {
                var styleSheet = document.styleSheets[i];
                var classes = styleSheet.rules || styleSheet.cssRules;
                for(var n = 0; n < classes.length; n++) {
                    if($.inArray( classes[n], definedClasses ) >= 0) {
                        console.assert(false, StrLoc("Potential duplicate CSS: {0}").format(classes[n]));
                        continue;
                    }
                    
                    definedClasses.push(classes[n]);
                }
            }
            
            return definedClasses;
        };
        
        this.getUsedClasses = function(elementObject) {
            var usedList = [];
            var processQueue = [elementObject];
            while(processQueue.length > 0) {
                var current = processQueue.pop();
                
                var children = current.children();
                for(var i = 0;i < children.length; i++) {
                    processQueue.push($(children[i]));
                }
                
                var rawClasses = current.attr("class");
                if(rawClasses === undefined) {
                    continue;
                }
                
                var split = $.trim(rawClasses).replace(/\s+/g,' ').split(' ');
                for(var i = 0; i < split.length; i++) {
                    if($.inArray( split[i], usedList ) >= 0) {
                        continue;
                    }
                    
                    usedList.push(split[i]);
                }
            };
            
            return usedList;
        };
        
        // ---------------------------------------------------------------------------
        // Time / Date functions
        // ---------------------------------------------------------------------------        
        // Note: This has to use math.floor otherwise the value will be skewed for large time
        this.splitDateTime = function(seconds) {
            // returns array of [y, d, h, m, s, z]
            var result = [0, 0, 0, 0, 0, 0];
            var milliSeconds = Math.floor(seconds);
            
            result[0] = Math.floor(milliSeconds / (365 * 24 * 60 * 60 * 1000));
            
            milliSeconds %= (365 * 24 * 60 * 60 * 1000);
            result[1] = Math.floor(milliSeconds / (24 * 60 * 60 * 1000));
            
            milliSeconds %= (24 * 60 * 60 * 1000);
            result[2] = Math.floor(milliSeconds / (60 * 60 * 1000));
        
            milliSeconds %= (60 * 60 * 1000);
            result[3] = Math.floor(milliSeconds / (60 * 1000));
        
            milliSeconds %= (60 * 1000);
            result[4] = Math.floor(milliSeconds / 1000);
            result[5] = milliSeconds;
            
            return result;
        };
        
        this.getDurationDisplay = function(seconds) {
        	if (seconds === 0 || seconds === Number.POSITIVE_INFINITY) {
                return '~~';
            }
            
            var timeSplit = this.splitDateTime(seconds);
            years = timeSplit[0] > 0 ? timeSplit[0] + 'y ' : '';
            days = timeSplit[1] > 0 ? timeSplit[1] + 'd ' : '';
            time = this.getTimeDisplay(seconds);
            
            return years + days + time;
        };
        
        this.getTimeDisplay = function(seconds, use24hourTime) {
            if (seconds === 0 || seconds === Number.POSITIVE_INFINITY) {
                return '~~';
            }
            
            var timeSplit = this.splitDateTime(seconds);
            var suffix = '';
            if (use24hourTime === false) {
            	if (timeSplit[2] > 12) {
            		timeSplit[2] -= 12;
            		suffix = ' ' + StrLoc('pm');
            	} else {
            		suffix = ' ' + StrLoc('am');
            	}
            }
            
            var hours = this.pad(timeSplit[2], 2) + ':';
            var minutes = this.pad(timeSplit[3], 2) + ':';
            var seconds = this.pad(timeSplit[4], 2);
            return hours + minutes + seconds + suffix;
        };
        
        // ---------------------------------------------------------------------------
        // Formatting
        // ---------------------------------------------------------------------------
        this.formatEveryThirdPower = function(notations) 
        {
          return function (value)
          {
            var base = 0;
            var notationValue = '';
            if (value >= 1000000 && Number.isFinite(value))
            {
              value /= 1000;
              while(Math.round(value) >= 1000) {
                value /= 1000;
                base++;
              }
              
              if (base > notations.length) {
                return StrLoc('Infinity');
              } else {
                notationValue = notations[base];
              }
            }
        
            return ( Math.round(value * 1000) / 1000.0 ) + notationValue;
          };
        };
        
        this.formatScientificNotation = function(value)
        {
          if (value === 0 || !Number.isFinite(value) || (Math.abs(value) > 1 && Math.abs(value) < 100))
          {
            return this.formatRaw(value);
          }
          
          var sign = value > 0 ? '' : '-';
          value = Math.abs(value);
          var exp = ~~(Math.log(value)/Math.LN10);
          var num = Math.round((value/Math.pow(10, exp)) * 100) / 100;
          var output = num.toString();
          if (num === Math.round(num)) {
            output += '.00';
          } else if (num * 10 === Math.round(num * 10)) {
            output += '0';
          }
          
          return sign + output + '*10^' + exp;
        };
        
        this.formatRounded = function(value)
        {
          return (Math.round(value * 1000) / 1000).toString();
        };
        
        this.formatRaw = function(value) {
            if(value === undefined) {
                return "";
            }
            
            return value.toString();
        };
        
        this.formatters = {
                'raw': this.formatRaw,
                'rounded': this.formatRaw,
                'name': this.formatEveryThirdPower(['', StrLoc(' million'), StrLoc(' billion'), StrLoc(' trillion'), StrLoc(' quadrillion'),
                                                    StrLoc(' quintillion'), StrLoc(' sextillion'), StrLoc(' septillion'), StrLoc(' octillion'),
                                                    StrLoc(' nonillion'), StrLoc(' decillion')
                                                        ]),
                'shortName': this.formatEveryThirdPower(['', StrLoc(' M'), StrLoc(' B'), StrLoc(' T'), StrLoc(' Qa'), StrLoc(' Qi'), StrLoc(' Sx'),StrLoc(' Sp'), StrLoc(' Oc'), StrLoc(' No'), StrLoc(' De') ]),
                'shortName2': this.formatEveryThirdPower(['', StrLoc(' M'), StrLoc(' G'), StrLoc(' T'), StrLoc(' P'), StrLoc(' E'), StrLoc(' Z'), StrLoc(' Y')]),
                'scientific': this.formatScientificNotation,
        };
        
        // ---------------------------------------------------------------------------
        // LZW Compression
        // ---------------------------------------------------------------------------
        this.lzwEncode = function(source) {
        	var dict = {};
            var data = (source + "").split("");
            var out = [];
            var currChar;
            var phrase = data[0];
            var code = 256;
            for (var i=1; i<data.length; i++) {
                currChar=data[i];
                if (dict[phrase + currChar] != null) {
                    phrase += currChar;
                }
                else {
                    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                    dict[phrase + currChar] = code;
                    code++;
                    phrase=currChar;
                }
            }
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            for (var i=0; i<out.length; i++) {
                out[i] = String.fromCharCode(out[i]);
            }
            return out.join("");
        };

        this.lzwDecode = function(source) {
        	var dict = {};
            var data = (source + "").split("");
            var currChar = data[0];
            var oldPhrase = currChar;
            var out = [currChar];
            var code = 256;
            var phrase;
            for (var i=1; i<data.length; i++) {
                var currCode = data[i].charCodeAt(0);
                if (currCode < 256) {
                    phrase = data[i];
                }
                else {
                   phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
                }
                out.push(phrase);
                currChar = phrase.charAt(0);
                dict[code] = oldPhrase + currChar;
                code++;
                oldPhrase = phrase;
            }
            return out.join("");
        };
        
        this.utf8Encode = function(s) {
          return unescape(encodeURIComponent(s));
        };
         
        this.utf8Decode = function(s) {
          return decodeURIComponent(escape(s));
        };
    };
        
    return new Utils();
});
