/*
 * Angular Eyedropper Directive
 *
 * Eddie Ferrer
 *
 * @licence: http://opensource.org/licenses/MIT
 */
'use strict';
var eyeDropper = angular.module('eyedropper', []);

eyeDropper.directive('eyeDropper', [function () {
    return {
        restrict: 'EA',
        replace:  true,
        scope: {
          outputFormat: '@',
          imgSrc:   '@',
          width:    '@',
          height:   '@',
          ngModel:  '=',
          ngChange: '&'
        },
        template: '<canvas class="eyedropper" width="{{width}}" height="{{height}}"></canvas>',
        link: function (scope, element, attrs) {
          attrs.$observe('imgSrc', function (src) {
            if (!src || src === undefined || src === null) {
              return false;
            }
            // console.log('output format', scope.outputFormat);

            var canvas = element[0];
            var ctx = canvas.getContext("2d");
            var img = new window.Image();

            img.onload = function () {
              var width = scope.width || img.width;
              var height = scope.height || img.height;
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
            };
            img.crossOrigin = "Anonymous";
            img.src = src;

            // http://www.javascripter.net/faq/rgbtohex.htm
          	function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
          	function toHex(n) {
          	  n = parseInt(n,10);
          	  if (isNaN(n)) return "00";
          	  n = Math.max(0,Math.min(n,255));
          	  return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
          	}

            element.bind('click', function (e) {
              // Find coordinates of click inside of canvas element.
              // using offsetLeft methods and similar do not work if the
              // canvas is inside of a position: fixed div.
              // this seems to work everywhere
              var rect = this.getBoundingClientRect();
              var x = e.clientX - rect.left;
              var y = e.clientY - rect.top;

              var c = this.getContext('2d');
              var img_data = c.getImageData(x, y, 1, 1).data;
          	  var R = img_data[0];
          	  var G = img_data[1];
          	  var B = img_data[2];

              scope.$apply(function () {
                var output_color = '';
                if (scope.outputFormat == 'rgb') {
                  output_color = 'rgb('+ R + ',' + G + ',' + B + ')';
                } else {
                  output_color = '#' + rgbToHex(R,G,B);
                }
                scope.ngModel = output_color;
                if (angular.isFunction(scope.ngChange)) {
                  scope.ngChange(output_color);
                }
              });
            });
        });
      }
    }
}]);
