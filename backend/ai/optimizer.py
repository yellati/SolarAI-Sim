# =========================================================
# SOLAR AI OPTIMIZER
# =========================================================

COLLECTOR_FACTORS = {
    "flatplate": 0.75,
    "evacuated": 0.90,
    "parabolic": 0.82,
    "fresnel": 0.78,
    "cpc": 0.80,
    "heatpipe": 0.88,
    "thermosyphon": 0.72,
    "storage": 0.74,
    "unglazed": 0.60
}


# =========================================================
# CALCULATE SOLAR PERFORMANCE
# =========================================================

def calculate_performance(
    irradiance,
    cloud_cover,
    tilt,
    azimuth,
    flow_rate,
    collector_area,
    collector_type="flatplate"
):

    collector_factor = COLLECTOR_FACTORS.get(
        collector_type,
        0.75
    )

    cloud_factor = 1 - (
        cloud_cover / 100 * 0.25
    )

    tilt_factor = max(
        0.70,
        1 - abs(tilt - 30) * 0.005
    )

    azimuth_factor = max(
        0.75,
        1 - abs(azimuth - 180) * 0.0015
    )

    flow_factor = max(
        0.75,
        1 - abs(flow_rate - 3) * 0.04
    )

    efficiency = (
        collector_factor
        * cloud_factor
        * tilt_factor
        * azimuth_factor
        * flow_factor
    )

    efficiency = max(
        0.10,
        min(
            efficiency,
            0.95
        )
    )

    output_power = (
        irradiance
        * collector_area
        * efficiency
    )

    useful_heat = (
        output_power * 0.82
    )

    heat_loss = (
        output_power - useful_heat
    )

    co2_reduction = (
        useful_heat * 0.0007
    )

    return {
        "efficiency": round(
            efficiency * 100,
            2
        ),

        "output_power": round(
            output_power,
            2
        ),

        "useful_heat": round(
            useful_heat,
            2
        ),

        "heat_loss": round(
            heat_loss,
            2
        ),

        "co2_reduction": round(
            co2_reduction,
            3
        )
    }


# =========================================================
# OPTIMIZATION
# =========================================================

def optimize_solar_system(
    irradiance,
    cloud_cover,
    collector_area,
    collector_type="flatplate"
):

    best_result = None

    tilt_values = range(
        0,
        61,
        5
    )

    azimuth_values = range(
        90,
        271,
        15
    )

    flow_values = [
        1.0,
        1.5,
        2.0,
        2.5,
        3.0,
        3.5,
        4.0,
        4.5,
        5.0
    ]


    for tilt in tilt_values:

        for azimuth in azimuth_values:

            for flow_rate in flow_values:

                result = calculate_performance(

                    irradiance=irradiance,

                    cloud_cover=cloud_cover,

                    tilt=tilt,

                    azimuth=azimuth,

                    flow_rate=flow_rate,

                    collector_area=collector_area,

                    collector_type=collector_type
                )

                score = (
                    result["output_power"]
                    + result["useful_heat"] * 0.2
                    + result["efficiency"] * 10
                )

                if (
                    best_result is None
                    or score > best_result["score"]
                ):

                    best_result = {

                        "score": score,

                        "tilt": tilt,

                        "azimuth": azimuth,

                        "flow_rate": flow_rate,

                        **result
                    }


    best_result.pop(
        "score",
        None
    )

    return best_result