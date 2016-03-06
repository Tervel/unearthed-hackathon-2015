            // Based off an example taken from:
            // threejs.org/examples/webgl_buffergeometry_points.html
            // using three.js

            fileName = "./a_files/ydata_0218.csv";

            if (!Detector.webgl) Detector.addGetWebGLMessage();

            var container, stats;
            var camera, scene, renderer, controls;
            var mesh;

            var csv;
            var processedCSVContents;

            function xhrSuccess () {
                this.callback.apply(this, this.arguments);
            }

            // openCSVFile and processCSVContents functions originally posted
            // at https://stackoverflow.com/questions/21798139/how-do-i-read-csv-file-in-an-array-in-javascript
            function openCSVFile(CSVfileName, callback) {
                // create the object
                var httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    processedCSVContents = processCSVContents(httpRequest);
                };

                httpRequest.callback = onCSVRead;
                httpRequest.onload = xhrSuccess;

                // Send the request
                httpRequest.open("GET", CSVfileName, true);
                httpRequest.send(null);

            } // end openCSVFile

            function processCSVContents(httpRequest) {
                // console.log("--> here");

                if (httpRequest.readyState == 4){
                    // everything is good, the response is received
                    if ((httpRequest.status == 200)
                    || (httpRequest.status == 0)){
                        // Analys the contents using the stats library
                        // and display the results
                        CSVContents = $.csv.toObjects(httpRequest.responseText);
                        // console.log($.csv.toObjects(CSVContents));
                        // console.log(" => Response status: " + httpRequest.status)
                        // console.log(CSVContents);
                        return CSVContents;
                    } else {
                    alert(' => There was a problem with the request. ' 
                            + httpRequest.status + httpRequest.responseText);
                    }
                }

            } // end processCSVContents

            // Modified min/max function inspired by:
            // https://stackoverflow.com/questions/8864430/compare-javascript-array-of-objects-to-get-min-max
            function minAndMax(array, property) {
                var lowest = Number.POSITIVE_INFINITY;
                var highest = Number.NEGATIVE_INFINITY;
                var minMax = [];
                var temp;


                for (var i = array.length - 1; i >= 0; i--) {
                    temp = array[i][property];
                    if (temp < lowest) lowest = temp;
                    if (temp > highest) highest = temp;
                }

                minMax.push(lowest);
                minMax.push(highest);

                return minMax;
            }

            // CSVRead callback function
            function onCSVRead(data) {
                console.log(processedCSVContents);

                // var minAndMaxTime = minAndMax(processedCSVContents, "xdata");
                // var minAndMaxtimeFromLastRepair = minAndMax(processedCSVContents, "ydata");
                // var minAndMaxtimeToNextRepair = minAndMax(processedCSVContents, "zdata");

                var temp;

                // Object {Time: "40569.90625", timeFromLastRepair: "2.08333333", timeToNextRepair: "22.33472"}
                // var i = 0;
                var positions = new Float32Array(processedCSVContents.length * 3);
                var color =  new THREE.Color();

                // var ratio = minAndMaxTime[1] / 100;
                // var CSVLength = processedCSVContents.length;

                // for (var i = 0; i < CSVLength; i++) {
                //     processedCSVContents[i].xdata = processedCSVContents[i].xdata / ratio;
                // }

                // ratio = minAndMaxtimeFromLastRepair[1] / 100;

                // for (var i = 0; i < CSVLength; i++) {
                //     processedCSVContents[i].ydata = processedCSVContents[i].ydata / ratio;
                // }

                // ratio = minAndMaxtimeToNextRepair[1] / 100;

                // for (var i = 0; i < CSVLength; i++) {
                //     processedCSVContents[i].zdata = processedCSVContents[i].zdata / ratio;
                // }

                // console.log(processedCSVContents);

                // for (var point of processedCSVContents) {
                //     // console.log(point.Time);
                //     // console.log(point.ydata);
                //     // console.log(point.zdata);


                // } // end for

                init();
                animate();
            }

            // HSVtoRGB function provided by:
            // https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
            /* accepts parameters
             * h  Object = {h:x, s:y, v:z}
             * OR 
             * h, s, v
            */
            function HSVtoRGB(h, s, v) {
                var r, g, b, i, f, p, q, t;
                if (arguments.length === 1) {
                    s = h.s, v = h.v, h = h.h;
                }
                i = Math.floor(h * 6);
                f = h * 6 - i;
                p = v * (1 - s);
                q = v * (1 - f * s);
                t = v * (1 - (1 - f) * s);
                switch (i % 6) {
                    case 0: r = v, g = t, b = p; break;
                    case 1: r = q, g = v, b = p; break;
                    case 2: r = p, g = v, b = t; break;
                    case 3: r = p, g = q, b = v; break;
                    case 4: r = t, g = p, b = v; break;
                    case 5: r = v, g = p, b = q; break;
                }
                return {
                    r: (r * 255),
                    g: (g * 255),
                    b: (b * 255)
                };
            }

            function init() {
                container = document.getElementById('container');

                //

                camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
                camera.position.z = 150;
                camera.position.y = 0;
                camera.position.x = 0;

                controls = new THREE.TrackballControls(camera);

                scene = new THREE.Scene();
                scene.fog = new THREE.Fog(0x050505, 2000, 3500);

                //

                var particles = 500000;
                var geometry = new THREE.BufferGeometry();

                // 
                // var positions = new Float32Array(particles * 3);
                var data = 0;
                //

                // var colors = new Float32Array(particles * 3);

                // var color = new THREE.Color();

                var n = 1000, n2 = n / 2; // particles spread in the cube

                // for (var i = 0; i < positions.length; i += 3) {
                //     // positions
                //     var x = Math.random() * n - n2;
                //     var y = Math.random() * n - n2;
                //     var z = Math.random() * n - n2;

                //     positions[i]     = x;
                //     positions[i + 1] = y;
                //     positions[i + 2] = z;

                //     // colors
                //     var vx = (x / n) + 0.5;
                //     var vy = (y / n) + 0.5;
                //     var vz = (z / n) + 0.5;

                //     color.setRGB(vx, vy, vz);

                //     colors[i]     = color.r;
                //     colors[i + 1] = color.g;
                //     colors[i + 2] = color.b;

                // } // end for

                var positions = new Float32Array(processedCSVContents.length * 3);
                var colors = new Float32Array(processedCSVContents.length * 3);
                var color =  new THREE.Color();

                var i = 0;
                var x, y, z,
                    vx, vy, vz;
                var rgbValue;
                for (var point of processedCSVContents) {
                    x = point.xdata;
                    y = point.ydata;
                    z = point.zdata;

                    // console.log(x, y, z);

                    i += 3;
                    positions[i]     = x;
                    positions[i + 1] = y;
                    positions[i + 2] = z;

                    // colors
                    // var vx = (point.xdata / n) + 0.5;
                    // var vy = (point.ydata / n) + 0.5;
                    // var vz = (point.zdata / n) + 0.5;

                    // rgbValue = HSVtoRGB(0.8299217192646176, 0.984605566599897, 0.0027364713176354473);
                    rgbValue = HSVtoRGB(point.color, 0.98, 0.002);
                    console.log(rgbValue);

                    // RGB values
                    vx = 0.6837363266386092;
                    vy = 0.01074223848991096;
                    vz = 0.6978001859970391;

                    console.log(RGBtoHSV(vx, vy, vz));

                    // color.setRGB(vx, vy, vz);

                    colors[i]     = rgbValue.r;
                    colors[i + 1] = rgbValue.g;
                    colors[i + 2] = rgbValue.b;

                    // color = new THREE.Color("hsl(0, 100%, 50%)");


                } // end for

                function RGBtoHSV(r, g, b) {
                    if (arguments.length === 1) {
                        g = r.g, b = r.b, r = r.r;
                    }
                    var max = Math.max(r, g, b), min = Math.min(r, g, b),
                        d = max - min,
                        h,
                        s = (max === 0 ? 0 : d / max),
                        v = max / 255;

                    switch (max) {
                        case min: h = 0; break;
                        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
                        case g: h = (b - r) + d * 2; h /= 6 * d; break;
                        case b: h = (r - g) + d * 4; h /= 6 * d; break;
                    }

                    return {
                        h: h,
                        s: s,
                        v: v
                    };
                }

                function HSLtoHSV(h, s, l) {
                    if (arguments.length === 1) {
                        s = h.s, l = h.l, h = h.h;
                    }
                    var _h = h,
                        _s,
                        _v;

                    l *= 2;
                    s *= (l <= 1) ? l : 2 - l;
                    _v = (l + s) / 2;
                    _s = (2 * s) / (l + s);

                    return {
                        h: _h,
                        s: _s,
                        v: _v
                    };
                }

                function HSLtoRGB(h, s, l) {
                    var color;

                    color = HSLtoHSV(h, s, l);
                    color = HSVtoRGB(color.h, color.s, color.v);

                    return color;
                }

                //

                geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

                geometry.computeBoundingSphere();

                //

                var material = new THREE.PointsMaterial({ size: 0.5, vertexColors: THREE.VertexColors });

                particleSystem = new THREE.Points(geometry, material);
                scene.add(particleSystem);

                //

                renderer = new THREE.WebGLRenderer({ antialias: false });
                renderer.setClearColor(scene.fog.color);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);

                container.appendChild(renderer.domElement);

                //

                stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.top = '0px';
                container.appendChild(stats.domElement);

                //

                window.addEventListener('resize', onWindowResize, false);

            } // end init

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);

            } // end onWindowResize

            //

            function animate() {
                requestAnimationFrame(animate);

                render();
                stats.update();

            } // end animate

            // Render function
            function render() {
                var time = Date.now() * 0.001;

                // particleSystem.rotation.x = time * 0.25;
                // particleSystem.rotation.y = time * 0.25;

                renderer.render(scene, camera);

            } // end render


            // // Movement stuff partially based off:
            // // http://bl.ocks.org/phil-pedruco/9852362
            // window.onmousedown = function(ev) {
            //     down = true;
            //     sx = ev.clientX;
            //     sy = ev.clientY;
            // };

            // window.onmouseup = function() {
            //     down = false;
            // };

            // window.onmousemove = function(ev) {
            //     if (down) {
            //         var dx = ev.clientX - sx;
            //         var dy = ev.clientY - sy;
            //         scatterPlot.rotation.y += dx * 0.01;
            //         camera.position.y += dy;
            //         sx += dx;
            //         sy += dy;
            //     }
            // };

            // var animating = false;

            // window.ondblclick = function() {
            //     animating = !animating;
            // };

            // renderer.render(scene, camera);
            // var paused = false;
            // var last = new Date().getTime();
            // var down = false;
            // var sx = 0,
            //     sy = 0;

            // var mat = new THREE.ParticleBasicMaterial({
            //     vertexColors: true,
            //     size: 10
            // });
            // var pointGeo = new THREE.Geometry();
            // var points = new THREE.ParticleSystem(pointGeo, mat);

            // function animate(t) {
            //     if (!paused) {
            //         last = t;
            //         if (animating) {
            //             var v = pointGeo.vertices;
            //             for (var i = 0; i < v.length; i++) {
            //                 var u = v[i];
            //                 console.log(u);
            //                 u.angle += u.speed * 0.01;
            //                 u.x = Math.cos(u.angle) * u.radius;
            //                 u.z = Math.sin(u.angle) * u.radius;
            //             }
            //             pointGeo.__dirtyVertices = true;

            //         }
            //         renderer.clear();
            //         camera.lookAt(scene.position);
            //         renderer.render(scene, camera);

            //     }
            //     window.requestAnimationFrame(animate, renderer.domElement);

            // }

            // animate(new Date().getTime());

            // onmessage = function(ev) {
            //     paused = (ev.data == 'pause');
            // };


            // Function calls
            openCSVFile(fileName, onCSVRead);







