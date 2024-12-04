function getCircleIntersectionPoints(c1, c2) {
  try {
    const { x: x1, y: y1, r: r1 } = c1;
    const { x: x2, y: y2, r: r2 } = c2;
  
    const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  
    //No intersection or outside touch at single point
    if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0 ||d === r1 + r2 || d === Math.abs(r1 - r2)) {
      // No intersection or the circles are identical
      return [];
    }
    const a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
    const h = Math.sqrt(r1 ** 2 - a ** 2);
    const x0 = x1 + (a * (x2 - x1)) / d;
    const y0 = y1 + (a * (y2 - y1)) / d;
    const rx = -(y2 - y1) * (h / d);
    const ry = (x2 - x1) * (h / d);
    const intersection1 = { x: (x0 + rx).toFixed(1), y: (y0 + ry).toFixed(1) };
    const intersection2 = { x: (x0 - rx).toFixed(1), y: (y0 - ry).toFixed(1) };
    return [intersection1, intersection2];
    }
    catch (error) {
      console.error("Trilateration Error",error)
    }
  }
  
  function findAllIntersections(c1, c2, c3) {
    try {
      const intersections = [];
    
      intersections.push(...getCircleIntersectionPoints(c1, c2));
      intersections.push(...getCircleIntersectionPoints(c2, c3));
      intersections.push(...getCircleIntersectionPoints(c3, c1));
      return intersections;
    }
    catch (error) {
      console.error("Trilateration Error",error)
    }
  }
  
  
  function pointDistanceFromCircleBorder(point, circle) {
    try {
      const dx = parseFloat(point.x) - circle.x;
      const dy = parseFloat(point.y) - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const variation = Math.abs(distance - circle.r);
      return variation;
    }
    catch (error) {
      console.error("Trilateration Error",error)
    }
  }
  
  function findCentroid(p1, p2, p3) {
    try {
      return {
        x: (parseFloat(p1.x) + parseFloat(p2.x) + parseFloat(p3.x)) / 3,
        y: (parseFloat(p1.y) + parseFloat(p2.y) + parseFloat(p3.y)) / 3,
      };
    }
    catch (error) {
      console.error("Trilateration Error",error)
    }
  }
  
  function distance(p1, p2) {
    try {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    catch (error) {
      console.error("Trilateration Error",error)
    }
  }
  
  function findSmallestDistancePairs(intersections) {
    try {
      let distances = [];
      for (let i = 0; i < intersections.length; i++) {
        for (let j = i + 1; j < intersections.length; j++) {
          // Avoid distances between first and second point and third and fourth point
          if ((i === 0 && j === 1) || (i === 2 && j === 3)) {
            continue;
          }
          distances.push({
            distance: distance(intersections[i], intersections[j]),
            points: [intersections[i], intersections[j]],
          });
        }
      }
      distances.sort((a, b) => a.distance - b.distance);
      // Get the two closest pairs
      let closestPairs = distances[0].points;
      if (closestPairs.length === 2) {
        let centers = findCenterPoint(closestPairs[0], closestPairs[1]);
        return centers;
      } else {
        console.error("Not enough valid closest pairs found.");
      }
    }
    catch (error) {
      console.error("Trilateration Error",error)
    }
  }
  
  function findCenterPoint(p1, p2) {
    try {
      const center = {
        x: (parseFloat(p1.x) + parseFloat(p2.x)) / 2,
        y: (parseFloat(p1.y) + parseFloat(p2.y)) / 2,
      };
      return center;
    }
    catch (error) {
    console.error('Trilateration Error',error)
    return {};
   }
  }
  
  function findPointOnCircleClosestToPoint(circle, point) {
  try {
    const angle = Math.atan2(point.y - circle.y, point.x - circle.x);
    return {
      x: circle.x + circle.r * Math.cos(angle),
      y: circle.y + circle.r * Math.sin(angle),
    };
  }
  catch (error) {
    console.error("Trilateration Error",error)
  }
  }
  
  function middleOfClosestPointsOnCircumferences(c1, c2) {
    try {
      const theta = Math.atan2(c2.y - c1.y, c2.x - c1.x);
      // Theta is basically a line that cuts the 2 circles
      // and its made by 2 point swhich are the center of the circle
      const p1 = {
        x: c1.x + c1.r * Math.cos(theta),
        y: c1.y + c1.r * Math.sin(theta)
      };
    
      const p2 = {
        x: c1.x - c1.r * Math.cos(theta),
        y: c1.y - c1.r * Math.sin(theta)
      };
    
      const q1 = {
        x: c2.x + c2.r * Math.cos(theta),
        y: c2.y + c2.r * Math.sin(theta)
      };
    
      const q2 = {
        x: c2.x - c2.r * Math.cos(theta),
        y: c2.y - c2.r * Math.sin(theta)
      };
      // these are the 4 points on 2 circles the line cuts through
      const d1 = distance(p1, q1);
      const d2 = distance(p1, q2);
      const d3 = distance(p2, q1);
      const d4 = distance(p2, q2);
      const minDist = Math.min(d1, d2, d3, d4);
      // Determine the closest pair based on the smallest distance
      let closestPair;
      if (minDist === d1) {
        closestPair = { p: p1, q: q1 };
      } else if (minDist === d2) {
        closestPair = { p: p1, q: q2 };
      } else if (minDist === d3) {
        closestPair = { p: p2, q: q1 };
      } else {
        closestPair = { p: p2, q: q2 };
      }
      // Calculate and return the midpoint of the closest pair
      const midpoint = {
        x: (closestPair.p.x + closestPair.q.x) / 2,
        y: (closestPair.p.y + closestPair.q.y) / 2
      };
      // which point in p and q are closest
      return midpoint;
    }
    catch (error) {
      console.error("Trilateration Error",error)
    }
  }
  
  
  function triLaterationCalculate(c1, c2, c3) {
    try {
      if (
        !c1 || !c2 || !c3 ||
        typeof c1.x !== 'number' || typeof c1.y !== 'number' || typeof c1.r !== 'number' ||
        typeof c2.x !== 'number' || typeof c2.y !== 'number' || typeof c2.r !== 'number' ||
        typeof c3.x !== 'number' || typeof c3.y !== 'number' || typeof c3.r !== 'number'
      ) {
        console.error("Invalid Values of position or Radius");
        return {};
      }
      let intersections = findAllIntersections(c1, c2, c3);
      switch (intersections.length) {
        case 6:
          console.error("6 intersections found");
          let bestArea = [];
          if (intersections.length >= 6) {
            // Calculate cumulative deviation for each point
            intersections.forEach((point) => {
              let deviation = 0;
              deviation += Math.abs(distance(point, {x:c1.x, y:c1.y}) - c1.r);
              deviation += Math.abs(distance(point, {x:c2.x, y:c2.y}) - c2.r);
              deviation += Math.abs(distance(point, {x:c3.x, y:c3.y}) - c3.r);
              point.deviation = deviation;
          });
    
          // Sort points by their deviation frm radius
          intersections.sort((a, b) => a.deviation - b.deviation);
    
          // Keep the three points withthe lowest deviation
          bestArea = intersections.slice(0, 3);
          let centroid = findCentroid(
            bestArea[0],
            bestArea[1],
            bestArea[2]
          );
        return centroid;
          } else {
              return {};
          }
        case 4:
          let midOfClosestPairs = findSmallestDistancePairs(intersections);
          if(midOfClosestPairs) {
              return midOfClosestPairs;
          }
        return {};
        case 2:
          if (intersections.length === 2) {
            let circleWithNoIntersection = null;
            [c1,c2,c3].forEach(circle => {
              circle.totalDistanceFromBoundry = 0;
            });      
            intersections.forEach(point => {
              [c1,c2,c3].forEach(circle => {
                circle.totalDistanceFromBoundry += pointDistanceFromCircleBorder(point,circle);
              });
            });
            circleWithNoIntersection = [c1,c2,c3].reduce((maxCircle, circle) => {
              return (circle.totalDistanceFromBoundry > maxCircle.totalDistanceFromBoundry) ? circle : maxCircle;
            });         
            if (circleWithNoIntersection) {
              let closestIntersectionPoint = null;
              let closestDist = Infinity;
              for (let i = 0; i < intersections.length; i++) {
                let currentPoint = intersections[i];
                let currentDist = Math.abs(distance(currentPoint, {x: circleWithNoIntersection.x, y: circleWithNoIntersection.y}) - circleWithNoIntersection.r);
                if (currentDist < closestDist) {
                  closestIntersectionPoint = currentPoint;
                  closestDist = currentDist;
                }
              }
              let pointOnCircle = findPointOnCircleClosestToPoint(
                circleWithNoIntersection,
                closestIntersectionPoint
              );
              let center = findCenterPoint(closestIntersectionPoint, pointOnCircle);
              return center;
            } else {
              console.error("Cannot determine the circle for the two points.");
            }
          } else {
            console.error("Not the correct number of intersection points.");
          }
          return {};
        case 0:
          let closestCircumference1 = middleOfClosestPointsOnCircumferences(c1,c2);
          let closestCircumference2 = middleOfClosestPointsOnCircumferences(c2,c3);
          let closestCircumference3 = middleOfClosestPointsOnCircumferences(c3,c1);
          let centroid = findCentroid(
            closestCircumference1,
            closestCircumference2,
            closestCircumference3
          );
          if(centroid && centroid.x && !isNaN(centroid.x)){
            return centroid
          }
          return {};
        default:
          console.log(
            `${intersections.length} intersections found, unexpected case.`
          );
          // Handle unexpected number of intersections
          intersections.forEach((point, index) => {
            console.log(`Intersection ${index + 1}: (${point.x}, ${point.y})`);
          });
          return {};
      }
    } catch(error) {
      console.error("Error in Calculating Trilat",error)
    }
  }
  
  module.exports = triLaterationCalculate
