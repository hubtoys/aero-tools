const R = 6371e3;

deg2Rad = (dms) => {
  if (!isNaN(parseFloat(dms)) && isFinite(dms)) return Number(dms);
  const dmsParts = String(dms)
    .trim()
    .replace(/^-/, "")
    .replace(/[NSEW]$/i, "")
    .split(/[^0-9.,]+/);
  if (dmsParts[dmsParts.length - 1] == "") dmsParts.splice(dmsParts.length - 1);

  if (dmsParts == "") return NaN;

  let deg = null;
  switch (dmsParts.length) {
    case 3:
      deg = dmsParts[0] / 1 + dmsParts[1] / 60 + dmsParts[2] / 3600;
      break;
    case 2:
      deg = dmsParts[0] / 1 + dmsParts[1] / 60;
      break;
    case 1:
      deg = dmsParts[0];
      break;
    default:
      return NaN;
  }
  if (/^-|[WS]$/i.test(dms.trim())) deg = -deg;

  return Number(deg);
};

allUnitsMeters = (meters) => {
  return {
    meters,
    nauticalMiles: meters2NauticMiles(meters),
    miles: meters2Miles(meters),
  };
};

allUnitsDms = (degrees) => {
  return {
    decimal: degrees,
    radian: deg2Rad(degrees),
    dms: deg2Dms(degrees),
  };
};

latitudeAllUnitsDms = (degrees) => {
  return {
    decimal: degrees,
    radian: deg2Rad(degrees),
    dms: latitude2Dms(degrees),
  };
};

longitudeAllUnitsDms = (degrees) => {
  return {
    decimal: degrees,
    radian: deg2Rad(degrees),
    dms: longitude2Dms(degrees),
  };
};

meters2NauticMiles = (meters) => {
  return meters * 0.000539957;
};

meters2Miles = (meters) => {
  return meters * 0.00062137141841645;
};

deg2Rad = (degrees) => {
  const pi = Math.PI;
  return degrees * (pi / 180);
};

deg2Dms = (deg) => {
  d = Math.floor(deg);
  m = Math.floor((deg * 3600) / 60) % 60;
  s = ((deg * 3600) % 60).toFixed(0);
  if (s == 60) {
    s = (0).toFixed(0);
    m++;
  }
  if (m == 60) {
    m = 0;
    d++;
  }
  d = ("000" + d).slice(-3);
  m = ("00" + m).slice(-2);
  if (s < 10) s = "0" + s;
  dms = d + "°" + m + "′" + s + "″";
  return dms;
};

latitude2Dms = (deg) => {
  let dms = deg2Dms(deg);
  if (deg < 0) {
    return `${dms}S`;
  }

  return `${dms}N`;
};

longitude2Dms = (deg) => {
  let dms = deg2Dms(deg);
  if (deg < 0) {
    return `${dms}W`;
  }

  return `${dms}E`;
};

rad2Deg = (radians) => {
  const pi = Math.PI;
  return radians * (180 / pi);
};

dms2Deg = (dms) => {
  d = parseInt(dms.substring(0, dms.indexOf("°")), 0);
  m = parseInt(dms.substring(dms.indexOf("°") + 1, dms.indexOf("′")), 0);
  s = parseInt(dms.substring(dms.indexOf("′") + 1), 0);

  return d + m / 60 + s / 3600;
};

bearing = (lat1, lon1, lat2, lon2) => {
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360;
  return {
    startPoint: {
      latitude: latitudeAllUnitsDms(lat1),
      longitude: longitudeAllUnitsDms(lon1),
    },
    endPoint: {
      latitude: latitudeAllUnitsDms(lat2),
      longitude: longitudeAllUnitsDms(lon2),
    },
    bearing: allUnitsDms(brng),
  };
};

finalBearing = (lat1, lon1, brng) => {};

destinationPoint = (lat1, lon1, brng, distance) => {
  let bearing = brng;
  let bearingDegrees = 0;
  if (typeof brng === "string" && brng.indexOf("°") > 0) {
    bearing = deg2Rad(dms2Deg(brng));
    bearingDegrees = dms2Deg(brng);
  } else {
    bearing = deg2Rad(brng);
    bearingDegrees = brng;
  }

  const φ2 = Math.asin(
    Math.sin(deg2Rad(lat1)) * Math.cos(distance / R) +
      Math.cos(deg2Rad(lat1)) * Math.sin(distance / R) * Math.cos(bearing)
  );
  const λ2 =
    deg2Rad(lon1) +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distance / R) * Math.cos(deg2Rad(lat1)),
      Math.cos(distance / R) - Math.sin(deg2Rad(lat1)) * Math.sin(φ2)
    );

  return {
    latitude: latitudeAllUnitsDms(rad2Deg(φ2)),
    longitude: longitudeAllUnitsDms(rad2Deg(λ2)),
  };
};

distance = (lat1, lon1, lat2, lon2) => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;

  return {
    startPoint: {
      latitude: latitudeAllUnitsDms(lat1),
      longitude: longitudeAllUnitsDms(lon1),
    },
    endPoint: {
      latitude: latitudeAllUnitsDms(lat2),
      longitude: longitudeAllUnitsDms(lon2),
    },
    distance: allUnitsMeters(d),
  };
};

rangeMap = (lat1, lon1, distance, steps) => {
  let iStep = 360 / steps;

  let rangeMap = [];

  for (let bearing = 0; bearing < 360; bearing += iStep) {
    rangeMap.push(destinationPoint(lat1, lon1, bearing, distance));
  }

  return rangeMap;
};

module.exports = {
  deg2Rad,
  deg2Dms,
  bearing,
  meters2Miles,
  meters2NauticMiles,
  distance,
  destinationPoint,
  rangeMap,
};
