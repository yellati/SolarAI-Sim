from flask import Blueprint, jsonify, request

from ai.optimizer import optimize_solar_system


# =========================================================
# AI OPTIMIZATION BLUEPRINT
# =========================================================

optimization_bp = Blueprint(
    "optimization",
    __name__
)


# =========================================================
# AI OPTIMIZATION API
# =========================================================

@optimization_bp.route(
    "/api/optimize",
    methods=["POST"]
)
def optimize():

    data = request.get_json() or {}


    # -----------------------------------------------------
    # INPUT PARAMETERS
    # -----------------------------------------------------

    irradiance = float(
        data.get(
            "irradiance",
            800
        )
    )

    cloud_cover = float(
        data.get(
            "cloud_cover",
            20
        )
    )

    collector_area = float(
        data.get(
            "collector_area",
            5
        )
    )

    collector_type = data.get(
        "collector_type",
        "flatplate"
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


    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

    if irradiance < 0:

        return jsonify({
            "status": "error",
            "message":
                "Irradiance cannot be negative."
        }), 400


    if cloud_cover < 0 or cloud_cover > 100:

        return jsonify({
            "status": "error",
            "message":
                "Cloud cover must be between 0 and 100."
        }), 400


    if collector_area <= 0:

        return jsonify({
            "status": "error",
            "message":
                "Collector area must be greater than zero."
        }), 400


    # -----------------------------------------------------
    # RUN OPTIMIZATION
    # -----------------------------------------------------

    recommendation = optimize_solar_system(

        irradiance=irradiance,

        cloud_cover=cloud_cover,

        collector_area=collector_area,

        collector_type=collector_type
    )


    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return jsonify({

        "status": "success",

        "location": {

            "name": location,

            "latitude": latitude,

            "longitude": longitude

        },

        "input_parameters": {

            "irradiance":
                irradiance,

            "cloud_cover":
                cloud_cover,

            "collector_area":
                collector_area,

            "collector_type":
                collector_type

        },

        "optimization": {

            "recommended_tilt":
                recommendation["tilt"],

            "recommended_azimuth":
                recommendation["azimuth"],

            "recommended_flow_rate":
                recommendation["flow_rate"],

            "recommended_area":
                collector_area

        },

        "predicted_performance": {

            "efficiency":
                recommendation["efficiency"],

            "output_power":
                recommendation["output_power"],

            "useful_heat":
                recommendation["useful_heat"],

            "heat_loss":
                recommendation["heat_loss"],

            "co2_reduction":
                recommendation["co2_reduction"]

        },

        "message":
            "Solar system parameters optimized successfully."

    })