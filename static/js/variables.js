var currentAlgorithmIndex = 0;
var currentTauIndex = 0;
var currentSeedIndex = 0;
var scatterPlotCurrentGymTaskIndex = 0;
var learningCurvePlotCurrentGymTaskIndex = 0;
var numOptimObjectiveIndex = 0;
var numOptimDimIndex = 0;

const algorithms = ['bclone', 'ibc', 'dagger', 'gail', 'act', 'diffusion'];
const numTaus = [50, 100, 200];
const seeds = [1, 2, 3];
const environments = ['quad_insert_a0o0', 'quad_insert_aLoL', 'quad_insert_aMoM'];
const percents = [10, 50, 100];
const scatterTasks = ['swimmer', 'pong', 'mountain_car'];
const learningCurveTasks = ['swimmer', 'pong', 'mountain_car'];
const numOptimObjectives = ['ackley', 'levy', 'rastrigin', 'salomon', 'weierstrass'];
const numOptimDims = [2, 4, 8, 16];

const algNameMap = {
    'bclone' : 'BC',
    'ibc' : 'IBC',
    'dagger' : 'DAgger',
    'gail' : 'GAIL',
    'act' : 'ACT',
    'diffusion' : 'Diffusion',
};

const labelMap = {
    'currentAlgorithmIndex': 'Algorithm',
    'currentTauIndex': 'Num Expert',
    'currentSeedIndex': 'Seed',
    'scatterPlotCurrentGymTaskIndex': 'Task',
    'learningCurvePlotCurrentGymTaskIndex': 'Task',
    'numOptimObjectiveIndex': 'Objective',
    'numOptimDimIndex': 'Dimension',
};

var numScatterPoints = 0;
var initScatterPoint = null;
var scatterPlotInited = false;


var numCurvePoints = 0;
var initCurvePoint = null;
var curvePlotInited = false;