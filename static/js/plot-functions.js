// import scatterPlotCurrentGymTaskIndex from './static/js/script.js';





function updateScatterPlot() {
    console.log('scatterPlotCurrentGymTaskIndex', scatterPlotCurrentGymTaskIndex);

    let task_folder = '';
    task_name = scatterTasks[scatterPlotCurrentGymTaskIndex];
    switch (task_name) {
        case 'swimmer':
            task_folder = 'static/data/learning_results/swimmer/';
            break;
        case 'pong':
            task_folder = 'static/data/learning_results/pong/';
            break;
        case 'mountain_car':
            task_folder = 'static/data/learning_results/mountain_car/';
            break;
        default:
            console.error('Invalid task index:', scatterPlotCurrentGymTaskIndex);
            return; // Exit if the task index is invalid
    }



    const plotContainer = document.getElementById('plot-container');
    const gifPopup = document.getElementById('gif-popup');
    const gifImage = gifPopup.querySelector('video');
    const gifPopupIteration = document.getElementById('gif-popup-iteration-scatter');
    const gifPopupReward = document.getElementById('gif-popup-reward-scatter');
    const heatmapImageContainerScatterPlot = document.getElementById('heatmap-image-container-scatter-plot');
    const heatmapImageContainerScatterPlotImg = heatmapImageContainerScatterPlot.querySelector('img');
    const justificationTextScatterPlot = document.getElementById('justification-text-scatter-plot');
    const parentContainer = document.getElementById('learning-info-box');

    // Clear existing data points before adding new ones
    while (plotContainer.firstChild) {
        plotContainer.removeChild(plotContainer.firstChild);
    }



    // Function to render points (we'll call this after fetching data)
    function renderScatterPoints(scatterData) {

        console.log('Rendering scatter points:', scatterData.length, 'points');





        scatterData.forEach((data, idx) => {
            const point = document.createElement('div');
            point.id = `tsne-point-${idx}`;
            point.classList.add('data-point');
            point.style.left = `${data.x}%`;
            point.style.top = `${data.y}%`;
            point.style.backgroundColor = `rgba(${data.rgb[0] * 255}, ${data.rgb[1] * 255}, ${data.rgb[2] * 255}, 0.5)`;
            point.style.border = `1px solid rgb(${data.rgb[0] * 255}, ${data.rgb[1] * 255}, ${data.rgb[2] * 255}, 0.8)`;
            const scale = data.size ? data.size / 3000 : 0.05;
            point.style.width = `${scale * 100}%`;
            point.style.height = `${scale * 125}%`;



            point.video_file = data.video_file; 
            point.heatmap_file = data.heatmap_file;
            point.iter = (data.iteration_id + 1) * 20;
            point.reward = data.reward;
            
            point.addEventListener('mouseover', function(event) {

                console.log('initScatterPoint', initScatterPoint);
                if (initScatterPoint != null && scatterPlotInited == true) {
                    console.log('Mouseout on initScatterPoint:', initScatterPoint.id);
                    initScatterPoint.dispatchEvent(new Event('mouseout'));
                    initScatterPoint = null;
                }
                else if (initScatterPoint != null && scatterPlotInited == false) {
                    scatterPlotInited = true;
                }
                console.log('Mouseover on point:', this.id, 'with data:', data);

                gifImage.src = task_folder + 'videos/' + this.video_file;
                console.log('GIF URL:', gifImage.src);

                heatmapImageContainerScatterPlotImg.src = task_folder + 'heatmaps/' + this.heatmap_file;
                console.log('Heatmap URL:', heatmapImageContainerScatterPlotImg.src);

                justificationTextScatterPlot.textContent = data.justification || 'No justification text available.';
                console.log('Justification Text:', justificationTextScatterPlot.textContent);

                gifPopupIteration.textContent = `Episode ${this.iter}`;
                gifPopupReward.textContent = `Reward: ${this.reward.toFixed(2)}`;

                gifPopup.style.display = 'block';
                updatePopupPosition(event, idx);
                
                // Store original styles
                this.originalStyles = {
                    backgroundColor: this.style.backgroundColor,
                    border: this.style.border
                };
                
                // Highlight point
                this.style.backgroundColor = 'rgba(255, 24, 3, 0.5)';
                this.style.border = '1px solid rgba(255, 24, 3, 0.8)';
                this.style.zIndex = '1000';
            });

            point.addEventListener('mouseout', function() {
                console.log('Mouseout on point:', this.id, 'with data:', data);
                // Hide GIF popup
                gifPopup.style.display = 'none';
                gifImage.src = '';
                
                // Restore original styles
                if (this.originalStyles) {
                    console.log('Restoring original styles for point:', this.id);
                    this.style.backgroundColor = this.originalStyles.backgroundColor;
                    this.style.border = this.originalStyles.border;
                }
                
                // Reset z-index
                this.style.zIndex = '';
            });

            plotContainer.appendChild(point);
        });
    }

    // Fetch the data from the JSON file
    fetch(task_folder + 'scatter_data.json') // Path relative to index.html
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            renderScatterPoints(data); // Call the function to create points
            scatterPlotInited = false;
            numScatterPoints = data.length;
            console.log('Scatter Data Plotting Done');
            console.log('Current initScatterPoint:', initScatterPoint);
            initScatterPoint = document.getElementById(`tsne-point-39`);
            if (!initScatterPoint) {
                console.log('numScatterPoints:', numScatterPoints);
                console.error('Last 5th point not found in the DOM.');
            }
            else {
                // Simulate mouseover on the last 5th point
                initScatterPoint.dispatchEvent(new MouseEvent('mouseover', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
            }
            console.log('initScatterPoint:', initScatterPoint);



            // heatmapImageContainerScatterPlotImg.src = task_folder + 'heatmaps/' + data.slice(-5)[0].heatmap_file;
            // console.log('Heatmap URL:', heatmapImageContainerScatterPlotImg.src);

            // justificationTextScatterPlot.textContent = data.slice(-5)[0].justification || 'No justification text available.';
            // console.log('Justification Text:', justificationTextScatterPlot.textContent);
            
            // // Store original styles
            // data.slice(-5)[0].originalStyles = {
            //     backgroundColor: data.slice(-5)[0].style.backgroundColor,
            //     border: data.slice(-5)[0].style.border
            // };
    
            // // Highlight point
            // data.slice(-5)[0].style.backgroundColor = 'rgba(255, 165, 0, 0.5)';
            // data.slice(-5)[0].style.border = '1px solid rgba(255, 165, 0, 0.8)';
            // data.slice(-5)[0].style.zIndex = '1000';
        })
        .catch(error => {
            console.error('Error fetching or parsing scatter data:', error);
            plotContainer.innerHTML = `<p style="color: red; text-align: center;">Error loading data. Please check the console.</p>`;
        });


    // // Update GIF Popup Position on Mouse Move
    // // This function and its event listener can remain as they are,
    // // they don't directly depend on the data loading, only on the popup state.
    // document.addEventListener('mousemove', updatePopupPosition);

    function updatePopupPosition(event, idx) {
        if (gifPopup.style.display === 'block') {

            const point = document.getElementById(`tsne-point-${idx}`);
            if (!point) {
                console.error(`Point with index ${idx} not found.`);
                return;
            }

            // console.log('point style left top', point.style.left, point.style.top);
            // gifPopup.style.left = 'calc(' + point.style.left + ' + 15px)'; // Offset to the right

            window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            console.log('window_width', window_width);

            // gifPopup.style.left = 'min(calc(' + point.style.left + ' + 15px), ' + (window_width - 160) + 'px)'; // Offset to the right

            // gifPopup.style.left = `min(calc(${point.style.left} + 15px), ${window_width - 160}px)`; // Offset to the right
            // console.log(`min(calc(${point.style.left} + 15px), ${window_width - 160}px)`);

            // const pointLeft = parseInt(point.style.left, 10); // remove 'px' and convert to number
            // const offset = 15;
            // const maxLeft = 240;
            // const newLeft = Math.min(pointLeft + offset, maxLeft);
            // point.style.left = `${newLeft}px`;
            // console.log('point.style.left', point.style.left);

            // gifPopup.style.left = `calc(${point.style.left} + 15px)`; // Offset to the right

            const percentLeft = point.style.left; // e.g., "40%"
            const parentLeftPixel = plotContainer.getBoundingClientRect().left;
            const pixelLimit = window_width - 170 - parentLeftPixel;
            gifPopup.style.left = `min(calc(${percentLeft} + 15px), ${pixelLimit}px)`;
            console.log('gifPopup style left', `min(calc(${percentLeft} + 15px), ${pixelLimit}px)`, gifPopup.style.left);
            gifPopup.style.top = 'calc(' + point.style.top + ' + 15px)'; // Offset down
            // console.log('gifPopup style left top', gifPopup.style.left, gifPopup.style.top);
        }
    }
}

window.updateScatterPlot = updateScatterPlot;





function updateLearningCurvePlot() {
    console.log('learningCurvePlotCurrentGymTaskIndex', learningCurvePlotCurrentGymTaskIndex);

    let task_folder = '';
    task_name = learningCurveTasks[learningCurvePlotCurrentGymTaskIndex];
    switch (task_name) {
        case 'swimmer':
            task_folder = 'static/data/learning_results/swimmer/';
            break;
        case 'pong':
            task_folder = 'static/data/learning_results/pong/';
            break;
        case 'mountain_car':
            task_folder = 'static/data/learning_results/mountain_car/';
            break;
        default:
            console.error('Invalid task index:', learningCurvePlotCurrentGymTaskIndex);
            return; // Exit if the task index is invalid
    }



    const plotContainer = document.getElementById('plot-container-learning-curve');
    const gifPopup = document.getElementById('gif-popup-learning-curve');
    const gifImage = gifPopup.querySelector('video');
    const gifPopupIteration = document.getElementById('gif-popup-iteration-learning-curve');
    const gifPopupReward = document.getElementById('gif-popup-reward-learning-curve');
    const heatmapImageContainerLearningCurve = document.getElementById('heatmap-image-container-learning-curve');
    const heatmapImageContainerLearningCurveImg = heatmapImageContainerLearningCurve.querySelector('img');
    const justificationTextLearningCurve = document.getElementById('justification-text-learning-curve');

    // Clear existing data points before adding new ones
    while (plotContainer.firstChild) {
        plotContainer.removeChild(plotContainer.firstChild);
    }



    // Function to render points (we'll call this after fetching data)
    function renderScatterPoints(scatterData) {

        heatmapImageContainerLearningCurveImg.src = task_folder + 'heatmaps/' + scatterData.slice(-5)[0].heatmap_file;
        console.log('Heatmap URL:', heatmapImageContainerLearningCurveImg.src);

        justificationTextLearningCurve.textContent = scatterData.slice(-5)[0].justification || 'No justification text available.';
        console.log('Justification Text:', justificationTextLearningCurve.textContent);

        rgb_1st = scatterData[0].rgb;
        
        scatterData.forEach((data, idx) => {
            const point = document.createElement('div');
            point.classList.add('data-point');
            point.id = `tsne-point-${idx}-learning-curve`;
            point.style.left = `${data.epoch_percentage}%`;
            point.style.top = `${100 - data.reward_percentage}%`;
            point.style.backgroundColor = `rgba(${rgb_1st[0] * 255}, ${rgb_1st[1] * 255}, ${rgb_1st[2] * 255}, 0.5)`;
            point.style.border = `1px solid rgb(${rgb_1st[0] * 255}, ${rgb_1st[1] * 255}, ${rgb_1st[2] * 255}, 0.8)`;
            const scale = 0.03;
            point.style.width = `${scale * 100}%`;
            point.style.height = `${scale * 125}%`;





            point.video_file = data.video_file; 
            point.heatmap_file = data.heatmap_file; // Assuming heatmap_file is part of the data
            point.iter = idx * 10;
            point.reward = data.reward;
            
            point.addEventListener('mouseover', function(event) {

                console.log('initCurvePoint', initCurvePoint);
                if (initCurvePoint != null && curvePlotInited == true) {
                    console.log('Mouseout on initCurvePoint:', initCurvePoint.id);
                    initCurvePoint.dispatchEvent(new Event('mouseout'));
                    initCurvePoint = null;
                }
                else if (initCurvePoint != null && curvePlotInited == false) {
                    curvePlotInited = true;
                }

                gifImage.src = task_folder + 'videos/' + this.video_file;
                console.log('GIF URL:', gifImage.src);

                heatmapImageContainerLearningCurveImg.src = task_folder + 'heatmaps/' + this.heatmap_file;
                console.log('Heatmap URL:', heatmapImageContainerLearningCurveImg.src);

                justificationTextLearningCurve.textContent = data.justification || 'No justification text available.';
                console.log('Justification Text:', justificationTextLearningCurve.textContent);

                gifPopupIteration.textContent = `Iteration ${this.iter}`;
                gifPopupReward.textContent = `Reward: ${this.reward.toFixed(2)}`;

                gifPopup.style.display = 'block';
                updatePopupPosition(event, idx);
                
                // Store original styles
                this.originalStyles = {
                    backgroundColor: this.style.backgroundColor,
                    border: this.style.border
                };
                
                // Highlight point
                this.style.backgroundColor = 'rgba(255, 24, 3, 0.5)';
                this.style.border = '1px solid rgba(255, 24, 3, 0.8)';
                this.style.zIndex = '1000';
            });

            point.addEventListener('mouseout', function() {
                // Hide GIF popup
                gifPopup.style.display = 'none';
                gifImage.src = '';
                
                // Restore original styles
                if (this.originalStyles) {
                    this.style.backgroundColor = this.originalStyles.backgroundColor;
                    this.style.border = this.originalStyles.border;
                }
                
                // Reset z-index
                this.style.zIndex = '';
            });

            plotContainer.appendChild(point);
        });
    }

    function renderLearningCurveLines(learningCurveData) {
        // Create container for learning curve lines
        const linesContainer = document.createElement('div');
        linesContainer.classList.add('learning-curves-container');
        linesContainer.style.position = 'relative';
        linesContainer.style.top = '0';
        linesContainer.style.left = '0';
        linesContainer.style.width = '100%';
        linesContainer.style.height = '100%';
        linesContainer.style.pointerEvents = 'none'; // Allow clicks to pass through

        // Create an SVG element for the lines
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100'); // coordinate system from 0-100
        svg.setAttribute('preserveAspectRatio', 'none'); // fill the container completely
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');

        // Create path for the curve
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Generate the path data
        let pathData = '';
        
    if (learningCurveData.length > 0) {
        learningCurveData.forEach((point, i) => {
            const x = point.epoch_percentage; // 0-100
            const y = 100 - point.reward_percentage; // invert Y for SVG

            pathData += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
        });
    }


        
        // Set path attributes
        // path.setAttribute('d', pathData.trim());
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', `#00bfff`);
        path.setAttribute('stroke-width', '0.5');
        path.setAttribute('stroke-linejoin', 'round');
        
        // Add path to SVG
        svg.appendChild(path);

        // Add SVG to the lines container
        linesContainer.appendChild(svg);

        // Add lines container to plot container
        plotContainer.appendChild(linesContainer);
    }



    // Fetch the data from the JSON file
    console.log('Fetching scatter data from:', task_folder + 'scatter_data.json');

    // Fetch the learning curve data
    fetch(task_folder + 'learning_curves/epoch_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderLearningCurveLines(data);
        })
        .catch(error => {
            console.error('Error fetching or parsing learning curve data:', error);
        });

    fetch(task_folder + 'scatter_data.json') // Path relative to index.html
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
            // renderScatterPoints(data); // Call the function to create points
            // scatterPlotInited = false;
            // numScatterPoints = data.length;
            // console.log('Scatter Data Plotting Done');
            // console.log('Current initScatterPoint:', initScatterPoint);
            // initScatterPoint = document.getElementById(`tsne-point-${numScatterPoints - 5}`);
            // if (!initScatterPoint) {
            //     console.log('numScatterPoints:', numScatterPoints);
            //     console.error('Last 5th point not found in the DOM.');
            // }
            // else {
            //     // Simulate mouseover on the last 5th point
            //     initScatterPoint.dispatchEvent(new MouseEvent('mouseover', {
            //         view: window,
            //         bubbles: true,
            //         cancelable: true
            //     }));
            // }
            // console.log('initScatterPoint:', initScatterPoint);



            data = data.slice(0, Math.ceil(data.length / 2));
            renderScatterPoints(data); // Call the function to create points
            curvePlotInited = false;

            numCurvePoints = data.length;
            console.log('numCurvePoints:', numCurvePoints);
            console.log('Curve Data Plotting Done');
            console.log('Current initCurvePoint:', initCurvePoint);
            initCurvePoint = document.getElementById(`tsne-point-${numCurvePoints - 5}-learning-curve`);
            if (!initCurvePoint) {
                console.log('numCurvePoints:', numCurvePoints);
                console.error(`tsne-point-${numCurvePoints - 5}-learning-curve not found in the DOM.`);
            }
            else {
                // Simulate mouseover on the last 5th point
                initCurvePoint.dispatchEvent(new MouseEvent('mouseover', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
            }
            console.log('initCurvePoint:', initCurvePoint);
        })
        .catch(error => {
            console.error('Error fetching or parsing scatter data:', error);
            plotContainer.innerHTML = `<p style="color: red; text-align: center;">Error loading data. Please check the console.</p>`;
        });

    // Update GIF Popup Position on Mouse Move
    // This function and its event listener can remain as they are,
    // they don't directly depend on the data loading, only on the popup state.
    // document.addEventListener('mousemove', updatePopupPosition);

    function updatePopupPosition(event, idx) {
        if (gifPopup.style.display === 'block') {


            const point = document.getElementById(`tsne-point-${idx}-learning-curve`);
            if (!point) {
                console.error(`Point with index ${idx} not found.`);
                return;
            }

            // gifPopup.style.left = 'calc(' + point.style.left + ' + 15px)'; // Offset to the right
            // gifPopup.style.top = 'calc(' + point.style.top + ' + 15px)'; // Offset down


            const percentLeft = point.style.left; // e.g., "40%"
            const parentLeftPixel = plotContainer.getBoundingClientRect().left;
            const pixelLimit = window_width - 170 - parentLeftPixel;
            gifPopup.style.left = `min(calc(${percentLeft} + 15px), ${pixelLimit}px)`;
            console.log('gifPopup style left', `min(calc(${percentLeft} + 15px), ${pixelLimit}px)`, gifPopup.style.left);
            gifPopup.style.top = 'calc(' + point.style.top + ' + 15px)'; // Offset down


            // const offsetX = 15;
            // const offsetY = 15;

            // let newLeft = event.clientX + offsetX;
            // let newTop = event.clientY + offsetY;

            // const popupRect = gifPopup.getBoundingClientRect();

            // // Adjust if popup goes off the right edge
            // if (newLeft + popupRect.width > window.innerWidth) {
            //     newLeft = event.clientX - offsetX - popupRect.width;
            // }
            // // Adjust if popup goes off the bottom edge
            // if (newTop + popupRect.height > window.innerHeight) {
            //     newTop = event.clientY - offsetY - popupRect.height;
            // }
            // // Adjust if popup goes off the left edge (if it was shifted)
            // if (newLeft < 0) {
            //     newLeft = event.clientX + offsetX; // Revert to original right offset
            // }
            // // Adjust if popup goes off the top edge (if it was shifted)
            // if (newTop < 0) {
            //     newTop = event.clientY + offsetY; // Revert to original bottom offset
            // }


            // gifPopup.style.left = newLeft + 'px';
            // gifPopup.style.top = newTop + 'px';
        }
    }
}

window.updateLearningCurvePlot = updateLearningCurvePlot;


function updateNumOptimPlot()  {
    console.log('numOptimObjectiveIndex', numOptimObjectiveIndex);
    console.log('numOptimDimIndex', numOptimDimIndex);

    let task_folder = '';
    let objective_function = numOptimObjectives[numOptimObjectiveIndex];
    let dimension = numOptimDims[numOptimDimIndex];

    optimizers = ['gd', 'adam', 'gemini-1.5-pro', 'gpt-4o'];

    optimizers.forEach(optimizer => {
        console.log(`Processing optimizer: ${optimizer}`);
        image_file = `static/images/all_num_optim_jpegs/${objective_function}_${dimension}D_${optimizer}.jpg`;
        console.log(`Image file: ${image_file}`);
        const img = document.getElementById(`${optimizer}-curve`);
        img.src = image_file;
        img.alt = `${objective_function} in ${dimension}D using ${optimizer}`;
    });
}

window.updateNumOptimPlot = updateNumOptimPlot;