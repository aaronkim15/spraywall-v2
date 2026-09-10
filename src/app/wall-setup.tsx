import { Stack } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ResumableZoom, ResumableZoomRefType } from "react-native-zoom-toolkit";
import Svg, { Polygon } from "react-native-svg";
import { API_BASE_URL } from "../constants/apis";
import { findHoldAtPoint } from "../utils/holds";

const WALL_ID = "a99a7ad1-834a-4770-99d3-2904f08dcca8"; // temporary hardcode

type Point = { x: number; y: number };
type Hold = { id: string; x_pos: number; y_pos: number; points: Point[] | null; source: string };

export default function WallSetup() {
    const [holds, setHolds] = useState<Hold[]>([]);
    const [detecting, setDetecting] = useState(false);
    const zoomRef = useRef<ResumableZoomRefType>(null);

    async function loadHolds() {
        try {
            const res = await fetch(`${API_BASE_URL}/walls/${WALL_ID}/holds`);
            if (!res.ok) throw new Error(`Server responded ${res.status}`);
            const data = await res.json();
            setHolds(data.holds);
        } catch (err) {
            console.log("Failed to load holds:", err);
        }
    }

    useEffect(() => {
        loadHolds();
    }, []);

    function handleTap(clickEvent: { x: number; y: number }) {
        const state = zoomRef.current?.getState();
        if (!state) return;

        const { containerSize, childSize, scale, translateX, translateY } = state;

        const imageX = (clickEvent.x - containerSize.width / 2) / scale - translateX / scale + childSize.width / 2;
        const imageY = (clickEvent.y - containerSize.height / 2) / scale - translateY / scale + childSize.height / 2;

        if (imageX < 0 || imageY < 0 || imageX > childSize.width || imageY > childSize.height) {
            return;
        }

        const point = {
            x: imageX / childSize.width,
            y: imageY / childSize.height,
        };

        const hit = findHoldAtPoint(point, holds);
        if (hit) {
            removeHold(hit.id);
        } else {
            addHold(point);
        }
    }
    async function removeHold(holdId: string) {
        try {
            const res = await fetch(`${API_BASE_URL}/holds/${holdId}`, { method: "DELETE" });
            console.log("delete status:", res.status);
            if (!res.ok) throw new Error(`Delete failed ${res.status}`);
            setHolds((prev) => prev.filter((h) => h.id !== holdId));
        } catch (err) {
            console.log("Remove failed:", err);
        }
    }

   async function addHold(point: { x: number; y: number }) {
        const s = 0.015;
        const points = [
            { x: point.x - s, y: point.y },
            { x: point.x, y: point.y - s },
            { x: point.x + s, y: point.y },
            { x: point.x, y: point.y + s },
        ];
        try {
            const res = await fetch(`${API_BASE_URL}/walls/${WALL_ID}/holds`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ x_pos: point.x, y_pos: point.y, points }),
            });
            if (!res.ok) throw new Error(`Add failed ${res.status}`);
            const data = await res.json();
            setHolds((prev) => [...prev, data.hold]); // append the new hold immediately
        } catch (err) {
            console.log("Add failed:", err);
        }
    }

    async function runDetection() {
        setDetecting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/walls/${WALL_ID}/detect`, {
                method: "POST",
            });
            if (!res.ok) throw new Error(`Detection failed ${res.status}`);
            await loadHolds();
        } catch (err) {
            console.log("Detection failed:", err);
        } finally {
            setDetecting(false);
        }
    }

    return (
        <View style={styles.screen}>
            <Stack.Screen options={{ title: "Set up wall", headerShown: false }} />

            <View style={styles.zoomContainer}>
                <ResumableZoom onTap={handleTap} ref={zoomRef}>
                    <View style={styles.wallLayer}>
                        <Image source={wallSource} style={styles.wallImage} resizeMode="contain" />
                        <Svg
                            width={width}
                            height={wallHeight}
                            style={{ position: "absolute", top: 0, left: 0 }}
                            pointerEvents="none"
                        >
                            {holds.map((hold) => {
                                if (!hold.points) return null;
                                const pointsString = hold.points
                                    .map((p) => `${p.x * width},${p.y * wallHeight}`)
                                    .join(" ");
                                return (
                                    <Polygon
                                        key={hold.id}
                                        points={pointsString}
                                        fill="none"
                                        stroke="#ff6b35"
                                        strokeWidth={2}
                                    />
                                );
                            })}
                        </Svg>
                    </View>
                </ResumableZoom>
            </View>

            <TouchableOpacity style={styles.button} onPress={runDetection} disabled={detecting}>
                <Text style={styles.buttonText}>
                    {detecting ? "Detecting..." : "Detect holds"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const wallSource = require("../../assets/images/wall-image.jpg");
const { width: imgW, height: imgH } = Image.resolveAssetSource(wallSource);
const { width } = Dimensions.get("window");
const wallHeight = width * (imgH / imgW);

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#0d0d0f", justifyContent: "center" },
    zoomContainer: { width: width, height: wallHeight, alignSelf: "center" },
    wallLayer: { width: width, height: wallHeight },
    wallImage: { height: "100%", width: "100%" },
    button: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "#ff6b35",
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 8,
    },
    buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
});