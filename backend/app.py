from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

from api.optimization import optimization_bp


app = Flask(__name__)

CORS(app)

# =========================================================
# REGISTER AI OPTIMIZATION API
# =========================================================

app.register_blueprint(optimization_bp)


# =========================================================
# HOME
# =========================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "status": "success",
        "message": "SolarAI Sim Backend Running Successfully!"
    })


# =========================================================
# LOCATION SEARCH
# =========================================================

@app.route("/api/location/search", methods=["GET"])
def search_location():

    name = request.args.get("name", "").strip()

    if not name:

        return jsonify({
            "status": "error",
            "message": "Please enter a location name."
        }), 400

    try:

        url = "https://geocoding-api.open-meteo.com/v1/search"

        params = {
            "name": name,
            "count": 10,
            "language": "en",
            "format": "json"
        }

        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        response.raise_for_status()

        data = response.json()

        results = []

        for location in data.get("results", []):

            results.append({
                "id": location.get("id"),
                "name": location.get("name"),
                "country": location.get("country"),
                "country_code": location.get("country_code"),
                "state": location.get("admin1"),
                "latitude": location.get("latitude"),
                "longitude": location.get("longitude"),
                "elevation": location.get("elevation")
            })

        return jsonify({
            "status": "success",
            "results": results
        })

    except requests.RequestException as error:

        return jsonify({
            "status": "error",
            "message": "Location service could not be reached.",
            "error": str(error)
        }), 500


# =========================================================
# REAL SOLAR / WEATHER DATA
# =========================================================

@app.route("/api/solar-weather", methods=["GET"])
def solar_weather():

    latitude = request.args.get(
        "latitude",
        type=float
    )

    longitude = request.args.get(
        "longitude",
        type=float
    )

    tilt = request.args.get(
        "tilt",
        default=30,
        type=float
    )

    azimuth = request.args.get(
        "azimuth",
        default=180,
        type=float
    )

    if latitude is None or longitude is None:

        return jsonify({
            "status": "error",
            "message": "Latitude and longitude are required."
        }), 400

    try:

        url = "https://api.open-meteo.com/v1/forecast"

        params = {
            "latitude": latitude,
            "longitude": longitude,

            "current": (
                "temperature_2m,"
                "relative_humidity_2m,"
                "cloud_cover,"
                "shortwave_radiation,"
                "direct_normal_irradiance"
            ),

            "hourly": (
                "temperature_2m,"
                "cloud_cover,"
                "shortwave_radiation,"
                "direct_normal_irradiance,"
                "global_tilted_irradiance"
            ),

            "tilt": tilt,
            "azimuth": azimuth,

            "forecast_days": 1,

            "timezone": "auto"
        }

        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        response.raise_for_status()

        data = response.json()

        current = data.get(
            "current",
            {}
        )

        units = data.get(
            "current_units",
            {}
        )

        return jsonify({

            "status": "success",

            "location": {

                "latitude": latitude,

                "longitude": longitude,

                "timezone":
                    data.get("timezone"),

                "elevation":
                    data.get("elevation")
            },

            "current": {

                "temperature":
                    current.get(
                        "temperature_2m"
                    ),

                "temperature_unit":
                    units.get(
                        "temperature_2m",
                        "°C"
                    ),

                "humidity":
                    current.get(
                        "relative_humidity_2m"
                    ),

                "cloud_cover":
                    current.get(
                        "cloud_cover"
                    ),

                "solar_irradiance":
                    current.get(
                        "shortwave_radiation"
                    ),

                "dni":
                    current.get(
                        "direct_normal_irradiance"
                    )
            },

            "hourly":
                data.get(
                    "hourly",
                    {}
                )
        })

    except requests.RequestException as error:

        return jsonify({

            "status": "error",

            "message":
                "Solar weather service could not be reached.",

            "error":
                str(error)

        }), 500


# =========================================================
# SOLAR SIMULATION
# =========================================================

@app.route("/simulate", methods=["POST"])
def simulate():

    data = request.get_json() or {}

    irradiance = float(
        data.get(
            "irradiance",
            1000
        )
    )

    panel_size = float(
        data.get(
            "panel_size",
            2
        )
    )

    efficiency = float(
        data.get(
            "efficiency",
            31
        )
    )

    location = data.get(
        "location",
        "Unknown"
    )

    latitude = data.get(
        "latitude"
    )

    longitude = data.get(
        "longitude"
    )

    efficiency_decimal = (
        efficiency / 100
    )

    output_power = (
        irradiance
        * panel_size
        * efficiency_decimal
    )

    useful_heat = (
        output_power * 0.85
    )

    co2_reduction = (
        output_power * 0.45 / 1000
    )

    return jsonify({

        "status": "success",

        "location": {

            "name": location,

            "latitude": latitude,

            "longitude": longitude
        },

        "inputs": {

            "irradiance":
                irradiance,

            "panel_size":
                panel_size,

            "efficiency":
                efficiency
        },

        "results": {

            "efficiency":
                round(
                    efficiency,
                    1
                ),

            "output_power":
                round(
                    output_power,
                    2
                ),

            "useful_heat":
                round(
                    useful_heat,
                    2
                ),

            "co2_reduction":
                round(
                    co2_reduction,
                    2
                )
        }
    })


# =========================================================
# MONTHLY ENERGY GENERATION
# =========================================================

@app.route("/api/monthly-energy", methods=["GET"])
def monthly_energy():

    latitude = request.args.get(
        "latitude",
        type=float
    )

    longitude = request.args.get(
        "longitude",
        type=float
    )

    tilt = request.args.get(
        "tilt",
        default=30,
        type=float
    )

    azimuth = request.args.get(
        "azimuth",
        default=180,
        type=float
    )

    collector_area = request.args.get(
        "collector_area",
        default=5,
        type=float
    )

    collector_type = request.args.get(
        "collector_type",
        default="flatplate"
    )

    # -----------------------------------------------------
    # Validate location
    # -----------------------------------------------------

    if latitude is None or longitude is None:

        return jsonify({
            "status": "error",
            "message": "Latitude and longitude are required."
        }), 400

    # -----------------------------------------------------
    # Validate collector area
    # -----------------------------------------------------

    if collector_area <= 0:

        return jsonify({
            "status": "error",
            "message": "Collector area must be greater than zero."
        }), 400

    try:

        # -------------------------------------------------
        # OPEN-METEO HISTORICAL DATA
        # -------------------------------------------------

        url = (
            "https://archive-api.open-meteo.com/v1/archive"
        )

        params = {

            "latitude":
                latitude,

            "longitude":
                longitude,

            "start_date":
                "2025-01-01",

            "end_date":
                "2025-12-31",

            "daily":
                "shortwave_radiation_sum",

            "timezone":
                "auto"
        }

        response = requests.get(
            url,
            params=params,
            timeout=20
        )

        response.raise_for_status()

        data = response.json()

        # -------------------------------------------------
        # GET DAILY DATA
        # -------------------------------------------------

        daily = data.get(
            "daily",
            {}
        )

        dates = daily.get(
            "time",
            []
        )

        radiation = daily.get(
            "shortwave_radiation_sum",
            []
        )

        # -------------------------------------------------
        # COLLECTOR EFFICIENCY FACTORS
        # -------------------------------------------------

        collector_factors = {

            "flatplate":
                0.75,

            "evacuated":
                0.90,

            "parabolic":
                0.82,

            "fresnel":
                0.78,

            "cpc":
                0.80,

            "heatpipe":
                0.88,

            "thermosyphon":
                0.72,

            "storage":
                0.74,

            "unglazed":
                0.60
        }

        collector_factor = collector_factors.get(
            collector_type,
            0.75
        )

        # -------------------------------------------------
        # MONTHLY ENERGY CALCULATION
        # -------------------------------------------------

        monthly_energy = {}

        for date, value in zip(
            dates,
            radiation
        ):

            if value is None:
                continue

            month = int(
                date.split("-")[1]
            )

            # Open-Meteo:
            # MJ/m²/day
            #
            # Conversion:
            # 1 kWh = 3.6 MJ

            solar_kwh = (
                float(value) / 3.6
            )

            energy = (
                solar_kwh
                * collector_area
                * collector_factor
            )

            monthly_energy[month] = (
                monthly_energy.get(
                    month,
                    0
                )
                + energy
            )

        # -------------------------------------------------
        # MONTH NAMES
        # -------------------------------------------------

        month_names = [

            "January",

            "February",

            "March",

            "April",

            "May",

            "June",

            "July",

            "August",

            "September",

            "October",

            "November",

            "December"
        ]

        # -------------------------------------------------
        # CREATE RESULT
        # -------------------------------------------------

        results = []

        for month_number, month_name in enumerate(
            month_names,
            start=1
        ):

            energy = monthly_energy.get(
                month_number,
                0
            )

            results.append({

                "month":
                    month_name,

                "energy_kwh":
                    round(
                        energy,
                        2
                    )
            })

        # -------------------------------------------------
        # ANNUAL ENERGY
        # -------------------------------------------------

        total_energy = sum(

            item["energy_kwh"]

            for item in results

        )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return jsonify({

            "status":
                "success",

            "location": {

                "latitude":
                    latitude,

                "longitude":
                    longitude
            },

            "system": {

                "tilt":
                    tilt,

                "azimuth":
                    azimuth,

                "collector_area":
                    collector_area,

                "collector_type":
                    collector_type
            },

            "monthly_energy":
                results,

            "annual_energy_kwh":
                round(
                    total_energy,
                    2
                )
        })

    except requests.RequestException as error:

        return jsonify({

            "status":
                "error",

            "message":
                "Solar historical data service could not be reached.",

            "error":
                str(error)

        }), 500


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )