// src/app/climb/[id].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";
import { API_BASE_URL } from "../../constants/apis";
import Svg, { Polygon } from "react-native-svg";

type Point = { x:number; y:number};
type Hold = { x_pos: number; y_pos: number; points: Point[] | null};
type Climb = {
    id: string;
    name: string;
    grade: string;
    description: string | null;
    holds: Hold[];
};

export default function ClimbDetail() {
    const { id } = useLocalSearchParams();
    const [climb, setClimb] = useState<Climb | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function showClimbs(){
            try{
                const res = await fetch(`${API_BASE_URL}/climbs/${id}`);
                if(!res.ok){
                    throw new Error(`Server responded ${res.status}`);
                }
                const data: Climb = await res.json();
                setClimb(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        showClimbs();
    }, [id]);

    // TODO 2: handle loading and error states (return early with a message)
    if(loading){
        return <Text>Loading... </Text>;
    }
    if(error){
        return <Text>{error}</Text>;
    }
    if(!climb){
        return <Text>No climb found</Text>;
    }
    return(
        <View style={styles.screen}>
            <Stack.Screen options={{ headerShown: false }} />
            <ResumableZoom>
                <View style={styles.wallLayer}>
                    <Image source={wallSource} style={styles.wallImage} resizeMode="contain" />
                    <Svg
                        width={width}
                        height={wallHeight}
                        style={{ position: "absolute", top: 0, left: 0 }}
                        pointerEvents="none"
                    >
                        {climb.holds.map((hold, index) => {
                            if (!hold.points) return null;

                            const pointsString = hold.points
                                .map((p) => `${p.x * width},${p.y * wallHeight}`)
                                .join(" ");

                            return (
                                <Polygon
                                    key={index}
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
        </View>
    );

    
}

const wallSource = require("../../../assets/images/wall-image.jpg");
const { width: imgW, height: imgH } = Image.resolveAssetSource(wallSource);
const { width } = Dimensions.get("window");
const wallHeight = width * (imgH / imgW);
const MARKER_SIZE = 44;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#0d0d0f",
        justifyContent: "center",
    },  
    wallLayer: {
        width: width,
        height: wallHeight,
    },
    wallImage: {
        height: "100%",
        width: "100%",
    },
});