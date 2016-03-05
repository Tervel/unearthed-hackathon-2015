            // Based off an example taken from:
            // threejs.org/examples/webgl_buffergeometry_points.html
            // using three.js

            fileName = "./xyzdata.csv";

            if (!Detector.webgl) Detector.addGetWebGLMessage();

            var container, stats;
            var camera, scene, renderer;
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

                var minAndMaxTime = minAndMax(processedCSVContents, "Time");
                var minAndMaxtimeFromLastRepair = minAndMax(processedCSVContents, "timeFromLastRepair");
                var minAndMaxtimeToNextRepair = minAndMax(processedCSVContents, "timeToNextRepair");

                var temp;

                // Object {Time: "40569.90625", timeFromLastRepair: "2.08333333", timeToNextRepair: "22.33472"}
                // var i = 0;
                // var positions = new Float32Array(processedCSVContents.length * 3);
                // var color =  new THREE.Color();

                var ratio = minAndMaxTime[1] / 100;
                var CSVLength = processedCSVContents.length;

                for (var i = 0; i < CSVLength; i++) {
                    processedCSVContents[i].Time = processedCSVContents[i].Time / ratio;
                }

                ratio = minAndMaxtimeFromLastRepair[1] / 100;

                for (var i = 0; i < CSVLength; i++) {
                    processedCSVContents[i].timeFromLastRepair = processedCSVContents[i].timeFromLastRepair / ratio;
                }

                ratio = minAndMaxtimeToNextRepair[1] / 100;

                for (var i = 0; i < CSVLength; i++) {
                    processedCSVContents[i].timeToNextRepair = processedCSVContents[i].timeToNextRepair / ratio;
                }

                // console.log(processedCSVContents);

                // for (var point of processedCSVContents) {
                //     // console.log(point.Time);
                //     // console.log(point.timeFromLastRepair);
                //     // console.log(point.timeToNextRepair);


                // } // end for

                init();
                animate();
            }

            function init() {
                container = document.getElementById('container');

                //

                camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
                camera.position.z = 2750;

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
                for (var point of processedCSVContents) {
                    var x = point.Time;
                    var y = point.timeFromLastRepair;
                    var z = point.timeToNextRepair;

                    console.log(x, y, z);

                    i += 3;
                    positions[i]     = x;
                    positions[i + 1] = y;
                    positions[i + 2] = z;

                    // colors
                    var vx = (x / n) + 0.5;
                    var vy = (y / n) + 0.5;
                    var vz = (z / n) + 0.5;

                    color.setRGB(vx, vy, vz);

                    colors[i]     = color.r;
                    colors[i + 1] = color.g;
                    colors[i + 2] = color.b;


                } // end for

                //

                geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

                geometry.computeBoundingSphere();

                //

                var material = new THREE.PointsMaterial({ size: 15, vertexColors: THREE.VertexColors });

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

            function render() {
                var time = Date.now() * 0.001;

                particleSystem.rotation.x = time * 0.25;
                particleSystem.rotation.y = time * 0.5;

                renderer.render(scene, camera);

            } // end render


            // Function calls
            openCSVFile(fileName, onCSVRead);







