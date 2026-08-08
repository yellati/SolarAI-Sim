/* =========================================================
   SOLARAI SIM - AI OPTIMIZATION
========================================================= */

const API_BASE = "http://127.0.0.1:5000";


/* =========================================================
   ELEMENTS
========================================================= */

const locationInput =
    document.getElementById("location");

const locationResults =
    document.getElementById("locationResults");

const latitudeInput =
    document.getElementById("latitude");

const longitudeInput =
    document.getElementById("longitude");

const irradianceInput =
    document.getElementById("irradiance");

const cloudCoverInput =
    document.getElementById("cloudCover");

const collectorTypeInput =
    document.getElementById("collectorType");

const collectorAreaInput =
    document.getElementById("collectorArea");

const getSolarDataBtn =
    document.getElementById("getSolarDataBtn");

const optimizeBtn =
    document.getElementById("optimizeBtn");

const weatherStatus =
    document.getElementById("weatherStatus");

const optimizationStatus =
    document.getElementById(
        "optimizationStatus"
    );

const optimizationResults =
    document.getElementById(
        "optimizationResults"
    );


/* =========================================================
   LOCATION DATA
========================================================= */

let selectedLocation = null;


/* =========================================================
   CHART
========================================================= */

let monthlyEnergyChart = null;


/* =========================================================
   LOCATION SEARCH
========================================================= */

let searchTimer = null;

locationInput.addEventListener(
    "input",
    function () {

        const name =
            locationInput.value.trim();

        clearTimeout(searchTimer);

        locationResults.innerHTML = "";

        if (name.length < 2) {
            return;
        }

        searchTimer = setTimeout(
            () => searchLocation(name),
            400
        );
    }
);


/* =========================================================
   SEARCH LOCATION
========================================================= */

async function searchLocation(name) {

    try {

        locationResults.innerHTML =
            `<div class="location-result">
                Searching...
            </div>`;

        const response = await fetch(
            `${API_BASE}/api/location/search?name=${encodeURIComponent(name)}`
        );

        if (!response.ok) {
            throw new Error(
                "Location search failed."
            );
        }

        const data =
            await response.json();

        locationResults.innerHTML = "";

        if (
            data.status !== "success" ||
            !data.results ||
            data.results.length === 0
        ) {

            locationResults.innerHTML =
                `<div class="location-result">
                    <span>No locations found.</span>
                </div>`;

            return;
        }


        data.results.forEach(
            location => {

                const item =
                    document.createElement("div");

                item.className =
                    "location-result";

                item.innerHTML = `
                    <strong>
                        ${escapeHTML(location.name)}
                    </strong>

                    <span>
                        ${escapeHTML(location.state || "")}
                        ${location.state ? ", " : ""}
                        ${escapeHTML(location.country || "")}
                    </span>
                `;

                item.addEventListener(
                    "click",
                    () => {

                        selectLocation(location);

                    }
                );

                locationResults.appendChild(item);

            }
        );

    } catch (error) {

        console.error(error);

        locationResults.innerHTML =
            `<div class="location-result">
                <span>
                    Unable to search location.
                </span>
            </div>`;
    }
}


/* =========================================================
   SELECT LOCATION
========================================================= */

function selectLocation(location) {

    selectedLocation = location;

    locationInput.value =
        location.name || "";

    latitudeInput.value =
        location.latitude ?? "";

    longitudeInput.value =
        location.longitude ?? "";

    locationResults.innerHTML = "";

    weatherStatus.textContent =
        `Selected ${location.name}, ${location.country || ""}`;

}


/* =========================================================
   GET SOLAR DATA
========================================================= */

getSolarDataBtn.addEventListener(
    "click",
    getSolarData
);


async function getSolarData() {

    const latitude =
        Number(latitudeInput.value);

    const longitude =
        Number(longitudeInput.value);


    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        weatherStatus.textContent =
            "Please select a valid location first.";

        return;
    }


    getSolarDataBtn.disabled = true;

    weatherStatus.textContent =
        "Loading real solar/weather data...";


    try {

        const response = await fetch(
            `${API_BASE}/api/solar-weather?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {

            throw new Error(
                "Solar weather request failed."
            );
        }

        const data =
            await response.json();


        if (data.status !== "success") {

            throw new Error(
                data.message ||
                "Unable to retrieve solar data."
            );
        }


        const current =
            data.current || {};


        if (
            current.solar_irradiance !== null &&
            current.solar_irradiance !== undefined
        ) {

            irradianceInput.value =
                current.solar_irradiance;
        }


        if (
            current.cloud_cover !== null &&
            current.cloud_cover !== undefined
        ) {

            cloudCoverInput.value =
                current.cloud_cover;
        }


        weatherStatus.textContent =
            "Real solar/weather data loaded successfully.";

    } catch (error) {

        console.error(error);

        weatherStatus.textContent =
            error.message ||
            "Unable to load solar data.";

    } finally {

        getSolarDataBtn.disabled = false;

    }
}


/* =========================================================
   OPTIMIZE BUTTON
========================================================= */

optimizeBtn.addEventListener(
    "click",
    runOptimization
);


/* =========================================================
   RUN AI OPTIMIZATION
========================================================= */

async function runOptimization() {

    const latitude =
        Number(latitudeInput.value);

    const longitude =
        Number(longitudeInput.value);

    const irradiance =
        Number(irradianceInput.value);

    const cloudCover =
        Number(cloudCoverInput.value);

    const collectorArea =
        Number(collectorAreaInput.value);

    const collectorType =
        collectorTypeInput.value;


    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        optimizationStatus.textContent =
            "Please select a location.";

        return;
    }


    if (
        !Number.isFinite(irradiance) ||
        irradiance < 0
    ) {

        optimizationStatus.textContent =
            "Please enter valid solar irradiance.";

        return;
    }


    if (
        !Number.isFinite(cloudCover) ||
        cloudCover < 0 ||
        cloudCover > 100
    ) {

        optimizationStatus.textContent =
            "Cloud cover must be between 0 and 100.";

        return;
    }


    if (
        !Number.isFinite(collectorArea) ||
        collectorArea <= 0
    ) {

        optimizationStatus.textContent =
            "Collector area must be greater than zero.";

        return;
    }


    /* -----------------------------------------------------
       LOADING
    ----------------------------------------------------- */

    optimizeBtn.disabled = true;

    optimizeBtn.textContent =
        "⚙️ Optimizing...";

    optimizationStatus.textContent =
        "AI is analyzing the solar system...";


    try {

        /* -------------------------------------------------
           CALL AI OPTIMIZATION API
        ------------------------------------------------- */

        const response =
            await fetch(
                `${API_BASE}/api/optimize`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        location:
                            locationInput.value ||
                            "Unknown",

                        latitude:
                            latitude,

                        longitude:
                            longitude,

                        irradiance:
                            irradiance,

                        cloud_cover:
                            cloudCover,

                        collector_area:
                            collectorArea,

                        collector_type:
                            collectorType

                    })
                }
            );


        if (!response.ok) {

            const errorData =
                await response.json()
                    .catch(() => ({}));

            throw new Error(
                errorData.message ||
                `Optimization failed (${response.status}).`
            );
        }


        const data =
            await response.json();


        if (data.status !== "success") {

            throw new Error(
                data.message ||
                "Optimization failed."
            );
        }


        /* -------------------------------------------------
           DISPLAY OPTIMIZATION RESULTS
        ------------------------------------------------- */

        displayOptimizationResults(data);


        /* -------------------------------------------------
           GET MONTHLY ENERGY
        ------------------------------------------------- */

        await loadMonthlyEnergy(
            latitude,
            longitude,
            data.optimization
        );


        optimizationStatus.textContent =
            "Solar system optimized successfully.";

    } catch (error) {

        console.error(error);

        optimizationStatus.textContent =
            error.message ||
            "Unable to optimize the solar system.";

    } finally {

        optimizeBtn.disabled = false;

        optimizeBtn.textContent =
            "⚡ Optimize Solar System";
    }
}


/* =========================================================
   DISPLAY OPTIMIZATION RESULTS
========================================================= */

function displayOptimizationResults(data) {

    const optimization =
        data.optimization || {};

    const performance =
        data.predicted_performance || {};


    /* -----------------------------------------------------
       OPTIMIZED PARAMETERS
    ----------------------------------------------------- */

    document.getElementById(
        "recommendedTilt"
    ).textContent =
        formatNumber(
            optimization.recommended_tilt
        );


    document.getElementById(
        "recommendedAzimuth"
    ).textContent =
        formatNumber(
            optimization.recommended_azimuth
        );


    document.getElementById(
        "recommendedFlow"
    ).textContent =
        formatNumber(
            optimization.recommended_flow_rate
        );


    document.getElementById(
        "recommendedArea"
    ).textContent =
        formatNumber(
            optimization.recommended_area
        );


    /* -----------------------------------------------------
       PERFORMANCE
    ----------------------------------------------------- */

    document.getElementById(
        "performanceEfficiency"
    ).textContent =
        `${formatNumber(
            performance.efficiency
        )}%`;


    document.getElementById(
        "performancePower"
    ).textContent =
        `${formatNumber(
            performance.output_power
        )} W`;


    document.getElementById(
        "performanceHeat"
    ).textContent =
        `${formatNumber(
            performance.useful_heat
        )} W`;


    document.getElementById(
        "performanceLoss"
    ).textContent =
        `${formatNumber(
            performance.heat_loss
        )} W`;


    document.getElementById(
        "performanceCO2"
    ).textContent =
        `${formatNumber(
            performance.co2_reduction
        )} kg`;


    /* -----------------------------------------------------
       AI SUMMARY
    ----------------------------------------------------- */

    const locationName =
        data.location?.name ||
        locationInput.value ||
        "selected location";


    const summary =
        document.getElementById(
            "aiRecommendationText"
        );


    summary.innerHTML = `

        <p>
            The AI optimizer analyzed the solar
            conditions for
            <strong>
                ${escapeHTML(locationName)}
            </strong>.
        </p>

        <br>

        <p>
            The recommended collector tilt is
            <strong>
                ${formatNumber(
                    optimization.recommended_tilt
                )}°
            </strong>,
            with an azimuth of
            <strong>
                ${formatNumber(
                    optimization.recommended_azimuth
                )}°
            </strong>.
        </p>

        <br>

        <p>
            The recommended flow rate is
            <strong>
                ${formatNumber(
                    optimization.recommended_flow_rate
                )} L/min
            </strong>
            and the recommended collector area is
            <strong>
                ${formatNumber(
                    optimization.recommended_area
                )} m²
            </strong>.
        </p>

    `;


    /* -----------------------------------------------------
       SHOW RESULTS
    ----------------------------------------------------- */

    optimizationResults.classList.remove(
        "hidden"
    );


    optimizationResults.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   MONTHLY ENERGY API
========================================================= */

async function loadMonthlyEnergy(
    latitude,
    longitude,
    optimization
) {

    const tilt =
        Number(
            optimization.recommended_tilt
        );

    const azimuth =
        Number(
            optimization.recommended_azimuth
        );

    const area =
        Number(
            optimization.recommended_area
        );

    const collectorType =
        collectorTypeInput.value;


    const url =
        `${API_BASE}/api/monthly-energy` +
        `?latitude=${encodeURIComponent(latitude)}` +
        `&longitude=${encodeURIComponent(longitude)}` +
        `&tilt=${encodeURIComponent(tilt)}` +
        `&azimuth=${encodeURIComponent(azimuth)}` +
        `&collector_area=${encodeURIComponent(area)}` +
        `&collector_type=${encodeURIComponent(collectorType)}`;


    const response =
        await fetch(url);


    if (!response.ok) {

        const errorData =
            await response.json()
                .catch(() => ({}));

        throw new Error(
            errorData.message ||
            "Monthly energy request failed."
        );
    }


    const data =
        await response.json();


    if (data.status !== "success") {

        throw new Error(
            data.message ||
            "Monthly energy calculation failed."
        );
    }


    /* -----------------------------------------------------
       ANNUAL ENERGY
    ----------------------------------------------------- */

    document.getElementById(
        "annualEnergy"
    ).textContent =
        formatNumber(
            data.annual_energy_kwh
        );


    /* -----------------------------------------------------
       DRAW CHART
    ----------------------------------------------------- */

    createMonthlyEnergyChart(
        data.monthly_energy || []
    );
}


/* =========================================================
   CREATE MONTHLY ENERGY CHART
========================================================= */

function createMonthlyEnergyChart(
    monthlyData
) {

    const canvas =
        document.getElementById(
            "monthlyEnergyChart"
        );


    if (!canvas) {
        return;
    }


    const labels =
        monthlyData.map(
            item => item.month
        );


    const values =
        monthlyData.map(
            item => Number(
                item.energy_kwh || 0
            )
        );


    /* -----------------------------------------------------
       DESTROY PREVIOUS CHART
    ----------------------------------------------------- */

    if (monthlyEnergyChart) {

        monthlyEnergyChart.destroy();

        monthlyEnergyChart = null;
    }


    /* -----------------------------------------------------
       CREATE CHART
    ----------------------------------------------------- */

    monthlyEnergyChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Energy Generated (kWh)",

                            data: values,

                            borderWidth: 3,

                            tension: 0.35,

                            fill: true,

                            pointRadius: 4,

                            pointHoverRadius: 6

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        mode: "index",

                        intersect: false

                    },

                    plugins: {

                        legend: {

                            display: true

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            " Energy: " +
                                            Number(
                                                context.raw
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    maximumFractionDigits:
                                                        2
                                                }
                                            ) +
                                            " kWh"
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            title: {

                                display: true,

                                text:
                                    "Energy (kWh)"

                            },

                            ticks: {

                                callback:
                                    function(value) {

                                        return Number(
                                            value
                                        ).toLocaleString(
                                            "en-IN"
                                        );

                                    }

                            }

                        },

                        x: {

                            title: {

                                display: true,

                                text:
                                    "Month"

                            }

                        }

                    }

                }

            }
        );
}


/* =========================================================
   NUMBER FORMATTER
========================================================= */

function formatNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "--";
    }


    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "--";
    }


    return number.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   CLOSE LOCATION RESULTS WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            !locationInput.contains(event.target) &&
            !locationResults.contains(event.target)
        ) {

            locationResults.innerHTML = "";

        }

    }
);
/* =========================================================
   THEME TOGGLE
========================================================= */

const themeButton = document.getElementById("themeButton");
const themeIcon = document.getElementById("themeIcon");


// Load saved theme
const savedTheme = localStorage.getItem("solarTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");

}


// Click theme button
themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    const darkMode =
        document.body.classList.contains("dark-mode");


    if (darkMode) {

        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");

        localStorage.setItem(
            "solarTheme",
            "dark"
        );

    } else {

        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");

        localStorage.setItem(
            "solarTheme",
            "light"
        );

    }

});