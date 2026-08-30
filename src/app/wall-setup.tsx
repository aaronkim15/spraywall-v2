import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";
import Svg, { Polygon } from "react-native-svg";
import { API_BASE_URL } from "../../constants/apis";

const WALL_ID = "a99a7ad1-834a-4770-99d3-2904f08dcca8"; // temporary hardcode

type Point = { x: number; y: number };
type Hold = { id: string; x_pos: number; y_pos: number; points: Point[] | null; source: string };

export default function WallSetup() {
    const [holds, setHolds] = useState<Hold[]>([]);
    const [detecting, setDetecting] = useState(false);

    // Load the wall's existing holds (the catalog) on mount.
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

    // Trigger detection, then reload the catalog so new holds appear.
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
            <Stack.Screen options={{ title: "Set up wall" }} />

            <ResumableZoom>
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
                                    fill="rgba(255, 107, 53, 0.3)"
                                    stroke="#ff6b35"
                                    strokeWidth={2}
                                />
                            );
                        })}
                    </Svg>
                </View>
            </ResumableZoom>

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