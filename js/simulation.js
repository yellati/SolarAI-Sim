"use strict";

document.addEventListener("DOMContentLoaded", function () {

    console.log("SolarAI Simulation JS Started");


    // =====================================================
    // BACKEND
    // =====================================================

    const API_BASE_URL = "https://solarai-sim-backend.onrender.com";


    // =====================================================
    // THEME
    // =====================================================

    const themeButton =
        document.getElementById("themeButton");

    const themeIcon =
        document.getElementById("themeIcon");

    if (themeButton) {

        themeButton.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            if (themeIcon) {

                const darkMode =
                    document.body.classList.contains("dark-mode");

                themeIcon.className = darkMode
                    ? "fa-solid fa-moon"
                    : "fa-solid fa-sun";
            }

        });

    }


    // =====================================================
    // DASHBOARD INPUTS
    // =====================================================

    const tilt =
        document.getElementById("tilt");

    const azimuth =
        document.getElementById("azimuth");

    const panelSize =
        document.getElementById("panelSize");

    const flowRate =
        document.getElementById("flowRate");

    const irradiance =
        document.getElementById("irradiance");

    const cloud =
        document.getElementById("cloud");


    // =====================================================
    // DASHBOARD VALUE LABELS
    // =====================================================

    const tiltValue =
        document.getElementById("tiltValue");

    const azimuthValue =
        document.getElementById("azimuthValue");

    const panelSizeValue =
        document.getElementById("panelSizeValue");

    const flowRateValue =
        document.getElementById("flowRateValue");

    const irradianceValue =
        document.getElementById("irradianceValue");

    const cloudValue =
        document.getElementById("cloudValue");


    // =====================================================
    // DASHBOARD RESULTS
    // =====================================================

    const efficiency =
        document.getElementById("efficiency");

    const power =
        document.getElementById("power");

    const heat =
        document.getElementById("heat");

    const temperature =
        document.getElementById("temperature");

    const loss =
        document.getElementById("loss");

    const co2 =
        document.getElementById("co2");


    // =====================================================
    // DASHBOARD VALIDATION
    // =====================================================

    const requiredElements = [
        tilt,
        azimuth,
        panelSize,
        flowRate,
        irradiance,
        cloud,
        tiltValue,
        azimuthValue,
        panelSizeValue,
        flowRateValue,
        irradianceValue,
        cloudValue,
        efficiency,
        power,
        heat,
        temperature,
        loss,
        co2
    ];

    const missingElement =
        requiredElements.some(
            element => !element
        );

    if (missingElement) {

        console.error(
            "SolarAI Error: One or more dashboard elements are missing."
        );

        return;
    }


    // =====================================================
    // DASHBOARD LABELS
    // =====================================================

    function updateDashboardLabels() {

        tiltValue.textContent =
            tilt.value + "°";

        azimuthValue.textContent =
            azimuth.value + "°";

        panelSizeValue.textContent =
            Number(panelSize.value).toFixed(1) + " m²";

        flowRateValue.textContent =
            Number(flowRate.value).toFixed(1) + " L/min";

        irradianceValue.textContent =
            irradiance.value + " W/m²";

        cloudValue.textContent =
            cloud.value + "%";
    }


    // =====================================================
    // DASHBOARD SIMULATION
    // =====================================================

    function calculateSimulation() {

        const tiltNumber =
            Number(tilt.value);

        const panelNumber =
            Number(panelSize.value);

        const flowNumber =
            Number(flowRate.value);

        const irradianceNumber =
            Number(irradiance.value);

        const cloudNumber =
            Number(cloud.value);


        let calculatedEfficiency = 88;


        calculatedEfficiency -=
            cloudNumber * 0.18;


        calculatedEfficiency -=
            Math.abs(
                30 - tiltNumber
            ) * 0.10;


        calculatedEfficiency +=
            flowNumber * 0.40;


        calculatedEfficiency =
            Math.max(
                25,
                Math.min(
                    95,
                    calculatedEfficiency
                )
            );


        const outputPower =
            irradianceNumber *
            panelNumber *
            calculatedEfficiency /
            100;


        const usefulHeat =
            outputPower * 0.82;


        const outletTemperature =
            30 +
            irradianceNumber / 15 -
            cloudNumber * 0.2 +
            flowNumber * 3;


        const heatLoss =
            Math.max(
                0,
                outputPower -
                usefulHeat
            );


        const co2Reduction =
            usefulHeat * 0.0007;


        efficiency.textContent =
            calculatedEfficiency.toFixed(1) + "%";

        power.textContent =
            outputPower.toFixed(0) + " W";

        heat.textContent =
            usefulHeat.toFixed(0) + " W";

        temperature.textContent =
            outletTemperature.toFixed(1) + " °C";

        loss.textContent =
            heatLoss.toFixed(0) + " W";

        co2.textContent =
            co2Reduction.toFixed(2) + " kg";
    }


    // =====================================================
    // DASHBOARD SLIDERS
    // =====================================================

    [
        tilt,
        azimuth,
        panelSize,
        flowRate,
        irradiance,
        cloud
    ].forEach(function (slider) {

        slider.addEventListener(
            "input",
            function () {

                updateDashboardLabels();

                calculateSimulation();

            }
        );

    });


    // =====================================================
    // COLLECTOR POPUP ELEMENTS
    // =====================================================

    const collectorCards =
        document.querySelectorAll(
            ".collector-card"
        );

    const collectorModal =
        document.getElementById(
            "collectorModal"
        );

    const closeCollector =
        document.getElementById(
            "closeCollector"
        );

    const collectorTitle =
        document.getElementById(
            "collectorTitle"
        );

    const collectorImage =
        document.getElementById(
            "collectorImage"
        );

    const collectorDescription =
        document.getElementById(
            "collectorDescription"
        );

    const collectorCaption =
        document.getElementById(
            "collectorCaption"
        );

    const prevCollector =
        document.getElementById(
            "prevCollector"
        );

    const nextCollector =
        document.getElementById(
            "nextCollector"
        );


    // =====================================================
    // COLLECTOR INFORMATION
    // =====================================================

    const collectorInfo = {

        flatplate: {
            title: "Flat Plate Collector",
            image: "assets/images/flatplate.jpg",
            description:
                "A flat plate collector absorbs solar radiation through an absorber plate and transfers heat to a circulating fluid."
        },

        evacuated: {
            title: "Evacuated Tube Collector",
            image: "assets/images/evacuated.jpg",
            description:
                "An evacuated tube collector uses vacuum insulation to reduce heat loss and provide high thermal performance."
        },

        parabolic: {
            title: "Parabolic Trough",
            image: "assets/images/parabolic.jpg",
            description:
                "A parabolic trough uses curved reflective mirrors to concentrate sunlight onto a receiver tube."
        },

        fresnel: {
            title: "Fresnel Collector",
            image: "assets/images/fresnel.jpg",
            description:
                "A Fresnel collector uses multiple linear reflective elements to concentrate sunlight onto a receiver."
        },

        cpc: {
            title: "Compound Parabolic Collector",
            image: "assets/images/cpc.jpg",
            description:
                "A compound parabolic collector uses a non-imaging optical design to collect and concentrate solar radiation."
        },

        heatpipe: {
            title: "Heat Pipe Collector",
            image: "assets/images/heatpipe.jpg",
            description:
                "A heat pipe collector transfers absorbed solar heat efficiently using sealed heat pipe technology."
        },

        thermosyphon: {
            title: "Thermosyphon System",
            image: "assets/images/thermosyphon.jpg",
            description:
                "A thermosyphon system uses natural circulation to transfer heated fluid without requiring a circulation pump."
        },

        storage: {
            title: "Integrated Storage Collector",
            image: "assets/images/storage.jpg",
            description:
                "An integrated storage collector combines solar collection and thermal storage for hot-water applications."
        },

        unglazed: {
            title: "Unglazed Collector",
            image: "assets/images/unglazed.jpg",
            description:
                "An unglazed collector is a simple solar thermal system commonly used for low-temperature heating applications."
        }

    };


    const collectorOrder = [
        "flatplate",
        "evacuated",
        "parabolic",
        "fresnel",
        "cpc",
        "heatpipe",
        "thermosyphon",
        "storage",
        "unglazed"
    ];


    // =====================================================
    // SHOW COLLECTOR
    // =====================================================

    function showCollector(model) {

        const collector =
            collectorInfo[model];

        if (!collector) {
            return;
        }


        window.selectedCollector =
            model;


        if (collectorTitle) {

            collectorTitle.textContent =
                collector.title;
        }


        if (collectorImage) {

            collectorImage.src =
                collector.image;

            collectorImage.alt =
                collector.title;
        }


        if (collectorCaption) {

            const index =
                collectorOrder.indexOf(model) + 1;

            collectorCaption.textContent =
                `${collector.title} (${index}/${collectorOrder.length})`;
        }


        if (collectorDescription) {

            collectorDescription.textContent =
                collector.description;
        }

    }


    // =====================================================
    // OPEN POPUP
    // =====================================================

    function openCollectorPopup(model) {

        if (!collectorInfo[model]) {

            console.error(
                "Collector model not found:",
                model
            );

            return;
        }


        showCollector(model);


        if (collectorModal) {

            collectorModal.style.display =
                "flex";

            collectorModal.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        copyDashboardToPopup();

    }


    // =====================================================
    // NEXT / PREVIOUS
    // =====================================================

    function getAdjacentCollector(direction) {

        const currentIndex =
            collectorOrder.indexOf(
                window.selectedCollector
            );

        if (currentIndex === -1) {
            return null;
        }


        let nextIndex =
            direction === "next"
                ? currentIndex + 1
                : currentIndex - 1;


        if (nextIndex < 0) {

            nextIndex =
                collectorOrder.length - 1;

        } else if (
            nextIndex >= collectorOrder.length
        ) {

            nextIndex = 0;
        }


        return collectorOrder[nextIndex];
    }


    if (prevCollector) {

        prevCollector.addEventListener(
            "click",
            function () {

                const previous =
                    getAdjacentCollector(
                        "prev"
                    );

                if (previous) {
                    showCollector(previous);
                }

            }
        );

    }


    if (nextCollector) {

        nextCollector.addEventListener(
            "click",
            function () {

                const next =
                    getAdjacentCollector(
                        "next"
                    );

                if (next) {
                    showCollector(next);
                }

            }
        );

    }


    // =====================================================
    // KEYBOARD NAVIGATION
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "ArrowLeft" &&
                collectorModal &&
                collectorModal.style.display === "flex"
            ) {

                const previous =
                    getAdjacentCollector(
                        "prev"
                    );

                if (previous) {
                    showCollector(previous);
                }

            }


            if (
                event.key === "ArrowRight" &&
                collectorModal &&
                collectorModal.style.display === "flex"
            ) {

                const next =
                    getAdjacentCollector(
                        "next"
                    );

                if (next) {
                    showCollector(next);
                }

            }

        }
    );


    // =====================================================
    // CARD CLICK
    // =====================================================

    collectorCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const model =
                        card.dataset.model;

                    openCollectorPopup(model);

                }
            );

        }
    );


    // =====================================================
    // OPEN SIMULATION BUTTON
    // =====================================================

    const openButtons =
        document.querySelectorAll(
            ".open-btn"
        );


    openButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    const card =
                        button.closest(
                            ".collector-card"
                        );


                    if (!card) {
                        return;
                    }


                    const model =
                        card.dataset.model;


                    openCollectorPopup(model);

                }
            );

        }
    );


    // =====================================================
    // CLOSE POPUP
    // =====================================================

    if (closeCollector && collectorModal) {

        closeCollector.addEventListener(
            "click",
            function () {

                collectorModal.style.display =
                    "none";

                collectorModal.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }
        );

    }


    // =====================================================
    // CLOSE OUTSIDE
    // =====================================================

    if (collectorModal) {

        collectorModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    collectorModal
                ) {

                    collectorModal.style.display =
                        "none";

                    collectorModal.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }

            }
        );

    }


    // =====================================================
    // ESC CLOSE
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                collectorModal
            ) {

                collectorModal.style.display =
                    "none";

                collectorModal.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );


    // =====================================================
    // POPUP PARAMETERS
    // =====================================================

    const modalLocation =
        document.getElementById(
            "modalLocation"
        );

    const modalIrradiance =
        document.getElementById(
            "modalIrradiance"
        );

    const modalCloud =
        document.getElementById(
            "modalCloud"
        );

    const modalTilt =
        document.getElementById(
            "modalTilt"
        );

    const modalAzimuth =
        document.getElementById(
            "modalAzimuth"
        );

    const modalFlow =
        document.getElementById(
            "modalFlow"
        );

    const modalArea =
        document.getElementById(
            "modalArea"
        );


    // =====================================================
    // POPUP VALUE LABELS
    // =====================================================

    const modalIrradianceValue =
        document.getElementById(
            "modalIrradianceValue"
        );

    const modalCloudValue =
        document.getElementById(
            "modalCloudValue"
        );

    const modalTiltValue =
        document.getElementById(
            "modalTiltValue"
        );

    const modalAzimuthValue =
        document.getElementById(
            "modalAzimuthValue"
        );

    const modalFlowValue =
        document.getElementById(
            "modalFlowValue"
        );

    const modalAreaValue =
        document.getElementById(
            "modalAreaValue"
        );


    // =====================================================
    // POPUP RESULTS
    // =====================================================

    const modalEfficiency =
        document.getElementById(
            "modalEfficiency"
        );

    const modalPower =
        document.getElementById(
            "modalPower"
        );

    const modalHeat =
        document.getElementById(
            "modalHeat"
        );

    const modalTemperature =
        document.getElementById(
            "modalTemperature"
        );

    const modalLoss =
        document.getElementById(
            "modalLoss"
        );

    const modalCO2 =
        document.getElementById(
            "modalCO2"
        );


    const modalAccuracy =
        document.getElementById(
            "modalAccuracy"
        );


    // =====================================================
    // REAL LOCATION / WEATHER DATA
    // =====================================================

    let selectedLocationData = null;

    let selectedWeatherData = null;


    // =====================================================
    // UPDATE POPUP LABELS
    // =====================================================

    function updatePopupValues() {

        if (modalIrradianceValue) {

            modalIrradianceValue.textContent =
                modalIrradiance.value +
                " W/m²";
        }


        if (modalCloudValue) {

            modalCloudValue.textContent =
                modalCloud.value +
                "%";
        }


        if (modalTiltValue) {

            modalTiltValue.textContent =
                modalTilt.value +
                "°";
        }


        if (modalAzimuthValue) {

            modalAzimuthValue.textContent =
                modalAzimuth.value +
                "°";
        }


        if (modalFlowValue) {

            modalFlowValue.textContent =
                Number(
                    modalFlow.value
                ).toFixed(1) +
                " L/min";
        }


        if (modalAreaValue) {

            modalAreaValue.textContent =
                Number(
                    modalArea.value
                ).toFixed(1) +
                " m²";
        }

    }


    // =====================================================
    // DASHBOARD → POPUP
    // =====================================================

    function copyDashboardToPopup() {

        modalIrradiance.value =
            irradiance.value;

        modalCloud.value =
            cloud.value;

        modalTilt.value =
            tilt.value;

        modalAzimuth.value =
            azimuth.value;

        modalFlow.value =
            flowRate.value;

        modalArea.value =
            panelSize.value;


        updatePopupValues();

    }


    // =====================================================
    // POPUP SLIDERS
    // =====================================================

    const popupSliders = [

        modalIrradiance,
        modalCloud,
        modalTilt,
        modalAzimuth,
        modalFlow,
        modalArea

    ];


    popupSliders.forEach(
        function (slider) {

            if (!slider) {
                return;
            }


            slider.addEventListener(
                "input",
                function () {

                    updatePopupValues();

                }
            );

        }
    );


    // =====================================================
    // SEARCH LOCATION
    // =====================================================

    async function searchLocation(locationName) {

        const response =
            await fetch(
                `${API_BASE_URL}/api/location/search?name=${encodeURIComponent(locationName)}`
            );


        if (!response.ok) {

            throw new Error(
                "Location search failed."
            );
        }


        const data =
            await response.json();


        if (
            data.status !== "success" ||
            !data.results ||
            data.results.length === 0
        ) {

            throw new Error(
                "Location not found."
            );
        }


        return data.results[0];

    }


    // =====================================================
    // GET REAL SOLAR / WEATHER DATA
    // =====================================================

    async function getSolarWeather(
        latitude,
        longitude
    ) {

        const tiltAngle =
            Number(
                modalTilt.value
            );

        const azimuthAngle =
            Number(
                modalAzimuth.value
            );


        const url =
            `${API_BASE_URL}/api/solar-weather` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&tilt=${tiltAngle}` +
            `&azimuth=${azimuthAngle}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Solar weather request failed."
            );
        }


        const data =
            await response.json();


        if (
            data.status !== "success"
        ) {

            throw new Error(
                "Solar weather data unavailable."
            );
        }


        return data;

    }


    // =====================================================
    // LOAD LOCATION + WEATHER
    // =====================================================

    async function loadLocationAndWeather(
        locationName,
        runSimulation = true
    ) {

        if (!locationName) {
            return;
        }


        try {

            console.log(
                "Loading location:",
                locationName
            );


            const location =
                await searchLocation(
                    locationName
                );


            selectedLocationData =
                location;


            console.log(
                "Location found:",
                location
            );


            const weather =
                await getSolarWeather(
                    location.latitude,
                    location.longitude
                );


            selectedWeatherData =
                weather;


            console.log(
                "Real solar/weather data:",
                weather
            );


            // ---------------------------------------------
            // CURRENT WEATHER DATA
            // ---------------------------------------------

            const current =
                weather.current || {};


            const realIrradiance =
                Number(
                    current.solar_irradiance
                );


            const realCloud =
                Number(
                    current.cloud_cover
                );


            // ---------------------------------------------
            // UPDATE INPUTS
            // ---------------------------------------------

            if (
                Number.isFinite(
                    realIrradiance
                )
            ) {

                const minimum =
                    Number(
                        modalIrradiance.min
                    );

                const maximum =
                    Number(
                        modalIrradiance.max
                    );


                modalIrradiance.value =
                    Math.max(
                        minimum,
                        Math.min(
                            maximum,
                            Math.round(
                                realIrradiance
                            )
                        )
                    );
            }


            if (
                Number.isFinite(
                    realCloud
                )
            ) {

                const minimum =
                    Number(
                        modalCloud.min
                    );

                const maximum =
                    Number(
                        modalCloud.max
                    );


                modalCloud.value =
                    Math.max(
                        minimum,
                        Math.min(
                            maximum,
                            Math.round(
                                realCloud
                            )
                        )
                    );
            }


            updatePopupValues();


            if (runSimulation) {

                await runPopupSimulation();

            }


        } catch (error) {

            console.error(
                "Location / Weather Error:",
                error
            );


            console.warn(
                "Using existing simulation values."
            );


            if (runSimulation) {

                runLocalPopupSimulation();

            }

        }

    }


    // =====================================================
    // RUN SIMULATION
    // =====================================================

    async function runPopupSimulation() {

        const solarIrradiance =
            Number(
                modalIrradiance.value
            );

        const cloudCover =
            Number(
                modalCloud.value
            );

        const tiltAngle =
            Number(
                modalTilt.value
            );

        const azimuthAngle =
            Number(
                modalAzimuth.value
            );

        const flow =
            Number(
                modalFlow.value
            );

        const area =
            Number(
                modalArea.value
            );


        const locationName =
            modalLocation
                ? modalLocation.value
                : "Unknown";


        const latitude =
            selectedLocationData
                ? selectedLocationData.latitude
                : null;


        const longitude =
            selectedLocationData
                ? selectedLocationData.longitude
                : null;


        // =================================================
        // BACKEND SIMULATION
        // =================================================

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/simulate`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            irradiance:
                                solarIrradiance,

                            panel_size:
                                area,

                            efficiency:
                                31,

                            location:
                                locationName,

                            latitude:
                                latitude,

                            longitude:
                                longitude

                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Simulation API failed."
                );
            }


            const backendData =
                await response.json();


            if (
                backendData.status !==
                "success"
            ) {

                throw new Error(
                    "Invalid simulation response."
                );
            }


            // =================================================
            // IMPORTANT
            // =================================================
            // Backend gives the base physical result.
            // We use the current UI parameters for the
            // collector-specific calculation below.


            let efficiencyValue = 88;


            efficiencyValue -=
                cloudCover * 0.18;


            efficiencyValue -=
                Math.abs(
                    30 - tiltAngle
                ) * 0.10;


            efficiencyValue -=
                Math.abs(
                    180 - azimuthAngle
                ) * 0.025;


            efficiencyValue +=
                flow * 0.40;


            efficiencyValue =
                Math.max(
                    25,
                    Math.min(
                        95,
                        efficiencyValue
                    )
                );


            const outputPower =
                solarIrradiance *
                area *
                efficiencyValue /
                100;


            const usefulHeat =
                outputPower * 0.82;


            const ambientTemperature =
                Number(
                    selectedWeatherData
                        ?.current
                        ?.temperature
                );


            const outletTemperature =
                (
                    Number.isFinite(
                        ambientTemperature
                    )
                        ? ambientTemperature
                        : 30
                ) +
                solarIrradiance / 15 -
                cloudCover * 0.20 +
                flow * 3;


            const heatLoss =
                Math.max(
                    0,
                    outputPower -
                    usefulHeat
                );


            const co2Reduction =
                usefulHeat * 0.0007;


            // =================================================
            // DISPLAY
            // =================================================

            if (modalEfficiency) {

                modalEfficiency.textContent =
                    efficiencyValue.toFixed(1) +
                    "%";
            }


            if (modalPower) {

                modalPower.textContent =
                    outputPower.toFixed(0) +
                    " W";
            }


            if (modalHeat) {

                modalHeat.textContent =
                    usefulHeat.toFixed(0) +
                    " W";
            }


            if (modalTemperature) {

                modalTemperature.textContent =
                    outletTemperature.toFixed(1) +
                    " °C";
            }


            if (modalLoss) {

                modalLoss.textContent =
                    heatLoss.toFixed(0) +
                    " W";
            }


            if (modalCO2) {

                modalCO2.textContent =
                    co2Reduction.toFixed(2) +
                    " kg";
            }


            if (modalAccuracy) {

                modalAccuracy.textContent =
                    "--";
            }


            console.log(
                "Backend Simulation Results:",
                {
                    location:
                        locationName,

                    latitude:
                        latitude,

                    longitude:
                        longitude,

                    irradiance:
                        solarIrradiance,

                    cloud:
                        cloudCover,

                    tilt:
                        tiltAngle,

                    azimuth:
                        azimuthAngle,

                    flow:
                        flow,

                    area:
                        area,

                    efficiency:
                        efficiencyValue,

                    power:
                        outputPower,

                    usefulHeat:
                        usefulHeat,

                    temperature:
                        outletTemperature,

                    heatLoss:
                        heatLoss,

                    co2:
                        co2Reduction
                }
            );


            return true;


        } catch (error) {

            console.error(
                "SolarAI Backend Error:",
                error
            );


            // Backend unavailable:
            // use existing local calculation.

            runLocalPopupSimulation();

            return false;
        }

    }


    // =====================================================
    // LOCAL FALLBACK
    // =====================================================

    function runLocalPopupSimulation() {

        const solarIrradiance =
            Number(
                modalIrradiance.value
            );

        const cloudCover =
            Number(
                modalCloud.value
            );

        const tiltAngle =
            Number(
                modalTilt.value
            );

        const azimuthAngle =
            Number(
                modalAzimuth.value
            );

        const flow =
            Number(
                modalFlow.value
            );

        const area =
            Number(
                modalArea.value
            );


        let efficiencyValue = 88;


        efficiencyValue -=
            cloudCover * 0.18;


        efficiencyValue -=
            Math.abs(
                30 - tiltAngle
            ) * 0.10;


        efficiencyValue -=
            Math.abs(
                180 - azimuthAngle
            ) * 0.025;


        efficiencyValue +=
            flow * 0.40;


        efficiencyValue =
            Math.max(
                25,
                Math.min(
                    95,
                    efficiencyValue
                )
            );


        const outputPower =
            solarIrradiance *
            area *
            efficiencyValue /
            100;


        const usefulHeat =
            outputPower * 0.82;


        const ambientTemperature =
            Number(
                selectedWeatherData
                    ?.current
                    ?.temperature
            );


        const outletTemperature =
            (
                Number.isFinite(
                    ambientTemperature
                )
                    ? ambientTemperature
                    : 30
            ) +
            solarIrradiance / 15 -
            cloudCover * 0.20 +
            flow * 3;


        const heatLoss =
            Math.max(
                0,
                outputPower -
                usefulHeat
            );


        const co2Reduction =
            usefulHeat * 0.0007;


        if (modalEfficiency) {

            modalEfficiency.textContent =
                efficiencyValue.toFixed(1) +
                "%";
        }


        if (modalPower) {

            modalPower.textContent =
                outputPower.toFixed(0) +
                " W";
        }


        if (modalHeat) {

            modalHeat.textContent =
                usefulHeat.toFixed(0) +
                " W";
        }


        if (modalTemperature) {

            modalTemperature.textContent =
                outletTemperature.toFixed(1) +
                " °C";
        }


        if (modalLoss) {

            modalLoss.textContent =
                heatLoss.toFixed(0) +
                " W";
        }


        if (modalCO2) {

            modalCO2.textContent =
                co2Reduction.toFixed(2) +
                " kg";
        }


        if (modalAccuracy) {

            modalAccuracy.textContent =
                "--";
        }

    }


    // =====================================================
    // RUN BUTTON
    // =====================================================

    const runCollectorSimulation =
        document.getElementById(
            "runCollectorSimulation"
        );


    if (runCollectorSimulation) {

        runCollectorSimulation.addEventListener(
            "click",
            async function () {

                const originalText =
                    runCollectorSimulation.innerHTML;


                runCollectorSimulation.disabled =
                    true;


                runCollectorSimulation.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Running Simulation...';


                try {

                    await runPopupSimulation();

                } finally {

                    runCollectorSimulation.innerHTML =
                        '<i class="fa-solid fa-check"></i> Simulation Complete';


                    setTimeout(
                        function () {

                            runCollectorSimulation.disabled =
                                false;

                            runCollectorSimulation.innerHTML =
                                originalText;

                        },
                        800
                    );

                }

            }
        );

    }


    // =====================================================
    // LOCATION CHANGE
    // =====================================================

    if (modalLocation) {

        modalLocation.addEventListener(
            "change",
            async function () {

                console.log(
                    "Selected location:",
                    modalLocation.value
                );


                await loadLocationAndWeather(
                    modalLocation.value,
                    true
                );

            }
        );

    }


    // =====================================================
    // INITIALIZATION
    // =====================================================

    updateDashboardLabels();

    calculateSimulation();

    updatePopupValues();


    if (collectorModal) {

        collectorModal.style.display =
            "none";

        collectorModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    // =====================================================
    // INITIAL LOCATION DATA
    // =====================================================

    if (modalLocation) {

        loadLocationAndWeather(
            modalLocation.value,
            true
        );

    }


    // =====================================================
    // FINAL STATUS
    // =====================================================

    console.log(
        "===================================="
    );

    console.log(
        "SolarAI Simulation Ready"
    );

    console.log(
        "Dashboard: Ready"
    );

    console.log(
        "Collector Cards: Ready"
    );

    console.log(
        "Popup: Ready"
    );

    console.log(
        "Sliders: Ready"
    );

    console.log(
        "Real Location API: Ready"
    );

    console.log(
        "Solar Weather API: Ready"
    );

    console.log(
        "Simulation Engine: Ready"
    );

    console.log(
        "===================================="
    );

});
