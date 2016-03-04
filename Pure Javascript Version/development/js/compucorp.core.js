function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  // for a polyfill
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
     sub.prototype[key] = origProto[key];
  }
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
  // In ECMAScript5+ (all modern browsers), you can make the constructor property
  // non-enumerable if you define it like this instead
  Object.defineProperty(sub.prototype, 'constructor', { 
    enumerable: false, 
    value: sub 
  });
} 

var CompucorpCore = (function(){

  function CompucorpCore(){
    this.scope = [];
    this.completeRecurseDomChildren = false;
  }

  CompucorpCore.prototype ={

    recurseDomChildren : function (start, output){

      var nodes;
      if(start.childNodes){
        nodes = start.childNodes;
        CompucorpCore.prototype.loopNodeChildren(nodes, output);
      }
    } 

    , getElementsByAttribute :function (attribute, context) {
        var nodeList = (context || document).getElementsByTagName('*');
        var iterator = 0;
        var node = null;

        while (node = nodeList[iterator++]) {
          if (node.hasAttribute(attribute)) {
            return node;
          }
        }

    }

    , loopNodeChildren : function (nodes, output){
      var node;
      for(var i=0; i<nodes.length; i++){
        node = nodes[i];
        if(output){
          CompucorpCore.prototype.outputNode(node);
        }
        if(node.childNodes){
          CompucorpCore.prototype.recurseDomChildren(node, output);
        }
      }
    }
    , parseHTML : function (node){

      try {
        if(node.hasAttribute('compucorp-repeat')){

          var loop = node.getAttribute('compucorp-repeat').split(' in ');
          node.removeAttribute('compucorp-repeat');
 
          var nodeHTML = node.innerHTML;
          node.innerHTML = "";
          var parentNode = node.parentNode;
          var index = loop[0].trim();
          var variable = loop[1].trim();
          var returnString = [];
          eval("for("+index+" in this.scope."+variable+"){"
          +   "var i = "+index+";"
          +   "returnString["+index+"] = CompucorpCore.prototype.replaceAll(nodeHTML,index,'"+variable+"['+i+']')" 
          + "}");
 
          nodeHTML  = returnString.join('');

          var t = document.createElement('template');
          t.innerHTML = nodeHTML;
          var c = t.content.cloneNode(true); 

          node.appendChild(c);

        }
      }catch(err){

      }

    }
    , escapeRegExp : function (str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    , replaceAll : function (str, find, replace) {
        return str.replace(new RegExp(CompucorpCore.prototype.escapeRegExp(find), 'g'), replace);
    }
    , outputNode : function (node) {

        if(node.nodeType === 1)
        {
            CompucorpCore.prototype.parseHTML(node);
        }
        else if(node.nodeType === 3){ 
          
          if(node.data)
          { 
            try{
              if(CompucorpCore.prototype.completeRecurseDomChildren){
                var val = "{{";
                var posStart = node.data.indexOf(val);

                while (posStart !== -1) {
                  var posEnd = node.data.indexOf("}}",posStart+2);
                  var checkIsFunction = node.data.indexOf("(",posStart+2);
                  if(checkIsFunction > 0){
                    var getEndFunction = node.data.indexOf(")",checkIsFunction+1);
                    var getFunctionName = node.data.slice(posStart+2,checkIsFunction);
                     console.log('yes this is a function ', getFunctionName,node.data.slice(checkIsFunction+1 ,getEndFunction));
                    /* i identify that here is a function but i dont have implemented yet*/
                    eval("var value = CompucorpCore.prototype.scope."+node.data.slice(checkIsFunction+1 ,getEndFunction));
                  }else{
                    eval("var value = CompucorpCore.prototype.scope."+node.data.slice(posStart+2,posEnd));
                  }

                  
                  node.data = node.data.replace(node.data.slice(posStart+2,posEnd),value);
                  posStart = node.data.indexOf(val, posStart + 2);
                }
                node.data = CompucorpCore.prototype.replaceAll(node.data,"{{","");
                node.data = CompucorpCore.prototype.replaceAll(node.data,"}}",""); 
              }
            }catch(err){

            }
          }  
        }  
    },
    getScope: function() {
    // Abstract this function need to be implemented by all classes
    },
    getTemplate: function() {
    // Abstract this function need to be implemented by all classes
    },
    request : function(_method,_url,_callback){
      var xhr = new XMLHttpRequest();
      
      xhr.open(_method, _url, true);
      
      xhr.onload = function (){
        if (this.readyState === 4){
          if (this.status === 200){
            _callback(this.responseText);
          }
        } 
      };

      xhr.send(); 
    }

    , _manipulateHTMLFile : function (_callback){

        CompucorpCore.prototype.scope = this.getScope();
        if(!CompucorpCore.prototype.scope.cache_template){
          CompucorpCore.prototype.request("GET", CompucorpCore.prototype.scope.template_url, function(responseText){ 
            var template = document.createElement('template');
            template.innerHTML = responseText;
            CompucorpCore.prototype.scope.cache_template = template;
            CompucorpCore.prototype.cache_template = template;
            var clone = template.content.cloneNode(true);
            CompucorpCore.prototype.recurseDomChildren(clone, true);
            CompucorpCore.prototype.completeRecurseDomChildren = true;
            CompucorpCore.prototype.recurseDomChildren(clone, true);
            _callback(clone);

          });
      }else{
          var template = CompucorpCore.prototype.scope.cache_template;
          var clone = template.content.cloneNode(true);
          CompucorpCore.prototype.recurseDomChildren(clone, true);
          CompucorpCore.prototype.completeRecurseDomChildren = true;
          CompucorpCore.prototype.recurseDomChildren(clone, true);
          _callback(clone);

      }

    }

  }

   return CompucorpCore;

 }());


var CC_Weather = (function(){
  /**
   * contructor of the class and the super class
   * @return {void}
   */ 

    
  function CC_Weather(){



    this.scope = {};

    this.scope.geolocation;
    this.scope.api_openweather = 'http://api.openweathermap.org/data/2.5/weather?';
    this.scope.api_openweather_nextday = 'http://api.openweathermap.org/data/2.5/forecast/daily?';
    this.scope.openweather_key = '8d0ae863745d6192e0282e029267d8dd';
    this.scope.positionUser  = false;
    this.scope.degree = 'F';
    this.scope.defaultPlace = 'London';
    this.scope.degreeSwitch = 'C';
    this.scope.messageSwitchDegree = 'Switch to';
    this.scope.template_url = './templates/template.html';
    this.cache_template = false;
    this.scope.ForeCast = new CC_ForeCast();
    this.setInputSearch(this.getElementsByAttribute("compucorp-input-search"));
    this.setButtonSearch(this.getElementsByAttribute("compucorp-button-search"));

    

  }


  CC_Weather.prototype = {
    setButtonSearch : function(node){
      var _self = this;
      this.scope.buttonSearch = node;
      console.log(node);
      this.scope.buttonSearch.addEventListener('click',function(e){
         
          _self.getDefaultPlace(_self.scope.inputSearch.value); 
      //     alert(_self.scope.inputSearch);
      });
    },
    setInputSearch : function(node){
      var _self = this;
      this.scope.inputSearch = node;
      this.scope.inputSearch.addEventListener('keypress',function(e){
        if (e.keyCode == 13) {
          _self.getDefaultPlace(this.value); 
        }
      })
    },
    getScope : function(){
      return this.scope;
    },
    _getPlaceByLatLon : function(position){
        // $http.get(api_openweather+'lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&APPID='+openweather_key)
        var _self = this;
        this.request("GET"
          , _self.scope.api_openweather+'lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&APPID='+_self.scope.openweather_key
          , function (responseText){
              _self.scope.myPlace = JSON.parse(responseText);
              _self.run();
              _self.scope.ForeCast.getForeCast(_self.scope.myPlace.id);
          });
    },
    _callbackErrorOnGetLocation : function(error){
      var _error_message = false;
       switch(error.code) {
        case error.PERMISSION_DENIED:
            // _error_message = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            _error_message = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            _error_message = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            _error_message = "An unknown error occurred."
            break;
        }
        if(_error_message === false){
          this.getDefaultPlace();
        }else{
          alert(_error_message);
        }
    },
    checkBrowserPosition : function (){
      var _self = this;
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
                  function (position){
                    _self._callbackSuccessOnGetLocation(position);
                  }
                  , function (error){
                    _self._callbackErrorOnGetLocation(error);
                  }
                );
      }else{
         _self.getDefaultPlace();
      }
    },
    _callbackSuccessOnGetLocation : function(postion){
       this._getPlaceByLatLon(postion);
    },
    getTemplate : function(){
      return this.scope.template_url;
    },
    run : function(){
      
      var _self = this
      , place = this.scope.defaultPlace;

      _self._manipulateHTMLFile(function(responseText){
        var el = _self.getElementsByAttribute("compucorp-view");
        el.innerHTML = "";
        el.appendChild(responseText);
      }); 

    },
    getDefaultPlace : function(place){
      if(place === undefined){
        place = this.scope.defaultPlace || 'London';
      }
      var _self = this;
       this.request("GET",_self.scope.api_openweather+"q="+place+"&APPID="+_self.scope.openweather_key,function(responseText){
        
          var myPlace = JSON.parse(responseText);
          
          if(myPlace .cod == 200){
            _self.scope.myPlace = myPlace;
            _self.run();
            _self.scope.ForeCast.getForeCast(_self.scope.myPlace.id);
          }
        
       });
    } 
  }

  // Expõe o construtor
  return CC_Weather;

}()); 


var CC_ForeCast = (function(){
  /**
   * contructor of the class and the super class
   * @return {void}
   */ 

    
  function CC_ForeCast(){
    this.scope = {};
    this.scope.api_openweather = 'http://api.openweathermap.org/data/2.5/weather?';
    this.scope.api_openweather_nextday = 'http://api.openweathermap.org/data/2.5/forecast/daily?';
    this.scope.openweather_key = '8d0ae863745d6192e0282e029267d8dd';
    this.cache_template = false;
    this.scope.template_url = './templates/template2.html';
  }


  CC_ForeCast.prototype = { 
    getScope : function(){
      return this.scope;
    },
    getTemplate : function(){
      return this.scope.template_url;
    },
    run : function(){
      
      var _self = this;
      _self._manipulateHTMLFile(function(responseText){
        var el = _self.getElementsByAttribute("forecast-view");
        el.innerHTML = "";
        el.appendChild(responseText);
      }); 

    }, 
    getForeCast : function(cityId){
      var _self = this;
       this.request("GET",_self.scope.api_openweather_nextday+'id='+cityId+'&cnt=10&APPID='+_self.scope.openweather_key,function(responseText){
          _self.scope.nextDays = JSON.parse(responseText);
          _self.run();
       });
    }
  }
  // Expõe o construtor
  return CC_ForeCast;

}()); 

extend(CompucorpCore, CC_Weather);
extend(CompucorpCore, CC_ForeCast); 




