"use strict";

let pricesByProductType = {
    "common": {
        "price1": 75,
        "price6": 420,
        "price12": 750
    },
    "premium": {
        "price1": 90,
        "price6": 480,
        "price12": 900
    }, 
    "cone": {
        "price1": 60,
        "price6": 330,
        "price12": 660
    }
}

let products = [
    {
        "name": "Manto Negro",
        "type": "common",
    },
    {
        "name": "Manto Blanco",
        "type": "common",
    },
    {
        "name": "Manto Frutilla",
        "type": "common",
    },
    {
        "name": "Manto Polar",
        "type": "common",
    },
    {
        "name": "Manto Premium",
        "type": "premium",
    },
    {
        "name": "Manto Almendras",
        "type": "premium",
    },
    {
        "name": "Manto Nueces",
        "type": "premium",
    },
    {
        "name": "Cono Manto",
        "type": "cone",
    }
]