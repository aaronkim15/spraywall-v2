// src/app/climb/[id].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";
import { API_BASE_URL } from "../../constants/apis";

type Hold = { x_pos: number; y_pos: number };
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
                            {climb.holds.map((hold, index) => (
                                <View
                                    key={index}
                                    style={{
                                        position: "absolute",
                                        left: hold.x_pos * width - MARKER_SIZE / 2,
                                        top: hold.y_pos * wallHeight - MARKER_SIZE / 2,
                                        width: MARKER_SIZE,
                                        height: MARKER_SIZE,
                                        borderRadius: MARKER_SIZE / 2,
                                        borderWidth: 3,
                                        borderColor: "#ff6b35",
                                        backgroundColor: "rgba(255, 107, 53, 0.15)",
                                    }}
                                />
                            ))}
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