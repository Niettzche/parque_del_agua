
import type { UserLocation, POI, GraphNode } from '../types';
import { mockData } from '../data';

// Haversine distance formula
export const getDistance = (loc1: { lat: number, lon: number }, loc2: { lat: number, lon: number }): number => {
    const R = 6371e3; // metres
    const φ1 = loc1.lat * Math.PI / 180;
    const φ2 = loc2.lat * Math.PI / 180;
    const Δφ = (loc2.lat - loc1.lat) * Math.PI / 180;
    const Δλ = (loc2.lon - loc1.lon) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const findNearestNode = (location: { lat: number, lon: number }): GraphNode => {
    let nearestNode = mockData.graph.nodes[0];
    let minDistance = Infinity;

    mockData.graph.nodes.forEach(node => {
        const distance = getDistance(location, node);
        if (distance < minDistance) {
            minDistance = distance;
            nearestNode = node;
        }
    });

    return nearestNode;
};

const mapDimensions = { width: 800, height: 1200 };
const mapBounds = {
  minLat: 25.6670, maxLat: 25.6715,
  minLon: -100.2510, maxLon: -100.2450
};

const latLonToPixels = (lat: number, lon: number) => {
  const x = ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) * mapDimensions.width;
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * mapDimensions.height;
  return { x, y };
};


export const findPath = (start: UserLocation, end: POI, accessibleOnly: boolean) => {
    const startNode = findNearestNode(start);
    const endNode = findNearestNode(end);
    
    const nodes = mockData.graph.nodes.reduce((acc, node) => {
        acc[node.id] = { ...node, dist: Infinity, prev: null };
        return acc;
    }, {} as Record<string, GraphNode & { dist: number, prev: string | null }>);

    const adj: Record<string, { node: string, weight: number }[]> = {};
    mockData.graph.nodes.forEach(node => adj[node.id] = []);
    mockData.graph.edges.forEach(edge => {
        if (!accessibleOnly || edge.accessible) {
            adj[edge.a].push({ node: edge.b, weight: edge.dist });
            adj[edge.b].push({ node: edge.a, weight: edge.dist });
        }
    });
    
    nodes[startNode.id].dist = 0;
    const unvisited = new Set(Object.keys(nodes));

    while (unvisited.size > 0) {
        let currentNodeId = [...unvisited].reduce((a, b) => nodes[a].dist < nodes[b].dist ? a : b);
        
        unvisited.delete(currentNodeId);

        if (currentNodeId === endNode.id) break;

        for (const neighbor of adj[currentNodeId]) {
            const newDist = nodes[currentNodeId].dist + neighbor.weight;
            if (newDist < nodes[neighbor.node].dist) {
                nodes[neighbor.node].dist = newDist;
                nodes[neighbor.node].prev = currentNodeId;
            }
        }
    }

    const pathNodes: GraphNode[] = [];
    let current: string | null = endNode.id;
    while (current) {
        pathNodes.unshift(nodes[current]);
        current = nodes[current].prev;
    }
    
    if(pathNodes.length === 0 || pathNodes[0].id !== startNode.id) return null; // No path found

    const pathPixels = [
        latLonToPixels(start.lat, start.lon),
        ...pathNodes.map(n => latLonToPixels(n.lat, n.lon)),
        latLonToPixels(end.lat, end.lon)
    ];

    const totalDistance = nodes[endNode.id].dist + getDistance(start, startNode) + getDistance(end, endNode);
    
    return { path: pathPixels, distance: totalDistance };
};
