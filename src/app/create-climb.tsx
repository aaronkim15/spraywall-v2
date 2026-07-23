import { Link, Stack } from "expo-router";
import { ArrowLeft, Mountain } from "lucide-react-native";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ResumableZoom, ResumableZoomRefType } from "react-native-zoom-toolkit";
import { useRef, useState } from "react";

export default function CreateClimb() {
    const [holds, setHolds] = useState([{x:0.5, y:0.5}, {x:1, y:1}]);
    const zoomRef = useRef<ResumableZoomRefType>(null);

    function handleTap(clickEvent: {x:number, y:number}){
        const state = zoomRef.current?.getState();
        if (!state) return;

        const {containerSize, childSize, scale, translateX, translateY} = state;

        const imageX = (clickEvent.x - containerSize.width / 2 - translateX) / scale + childSize.width / 2;
        const imageY = (clickEvent.y - containerSize.height / 2 - translateY) / scale + childSize.height / 2;

        if (imageX < 0 || imageY < 0 || imageX > childSize.width || imageY > childSize.height) {
            console.log("tap outside image");
            return;
        }
        const normalizedX = imageX / childSize.width;   
        const normalizedY = imageY / childSize.height;

        setHolds([...holds, {x:normalizedX, y:normalizedY}]);


        console.log("image position", imageX, imageY);
        
    }

    return(

        <View style={styles.screen}>
            <Stack.Screen options={{headerShown:false}} /> 
            <View style={styles.wallArea}>
                <View style={styles.header}>
                    <View style={styles.leftSection}>
                    <Link href="/" asChild>
                        <Pressable>
                            <ArrowLeft size={16} color={"white"}/>
                        </Pressable>
                    </Link>

                    <View style={styles.mountain}> 
                        <Mountain color={"white"} size={12} strokeWidth={2} />
                    </View>
                    <Text style={{ color: "white"}}>SPRAYWALL</Text>

                </View>
                    <View style={styles.rightSection}>
                        <Text style={{ color: "white"}}>{holds.length} HOLDS SELECTED</Text> 
                    </View>
                </View>

                <View style={styles.zoomContainer}>
                    <ResumableZoom onTap={handleTap} ref={zoomRef}>
                        <View style={styles.wallLayer}>
                            <Image 
                                source={wallSource}
                                style={styles.wallImage}
                                resizeMode="contain"
                            />
                            {holds.map((hold, index) => (
                                <View
                                    key={index}
                                    pointerEvents="none"
                                    style={{
                                        position: "absolute",
                                        left: hold.x * width - MARKER_SIZE / 2,
                                        top: hold.y * wallHeight - MARKER_SIZE / 2,
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
                
            </View>
            
            <View style={styles.bottomSheet}>
                <Pressable onPress={() => setHolds([])} style={[styles.button, styles.clearButton]}>
                    <Text style={styles.buttonText}>CLEAR</Text>
                </Pressable>

                <Link href= {{pathname: "/review-climb", params: { holds: JSON.stringify(holds) } }} asChild>
                    <Pressable style={[styles.button, styles.nextButton]}>
                        <Text style={styles.buttonText}>NEXT</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

const MARKER_SIZE = 22;
const wallSource = require("../../assets/images/wall-image.jpg");
const { width: imgW, height: imgH } = Image.resolveAssetSource(wallSource);
const { width } = Dimensions.get("window");
const wallHeight = width * (imgH / imgW);

const styles = StyleSheet.create({
    // ====== SCREEN =======
    screen:{
        flex:1,
        backgroundColor: "#0d0d0f",
    },

    // ====== WALL =======
    wallArea:{
        height:"90%",
        position:"relative",
        overflow:"hidden",
        justifyContent:"center",
        alignItems:"center",
    },
    wallImage:{
        height:"100%",
        width:"100%",
    },
    wallLayer:{
        width:width,
        height:wallHeight,
    },
    zoomContainer:{
        width:width,
        height:wallHeight,
    },

    // ======= HEADER =======
    header: {
        position:"absolute",
        flexDirection: "row",      
        justifyContent: "space-between", 
        alignItems: "center",      
        paddingHorizontal: 20,     
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,        
    },
    leftSection:{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    rightSection:{
        flex: 1,
        alignItems: "flex-end",
    },
    mountain:{
        backgroundColor: "#ff6b35",
        height: 24,
        width: 24,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },

    bottomSheet:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 16,
    },

    // ====== BUTTONS =======
    button:{
        height: 64,
        borderRadius: 22,
        backgroundColor: "#2C2C30",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: 1,
    },
    clearButton:{
        flex: 1,
    },
    nextButton: {
        flex: 2.2,
        backgroundColor: "#ff6b35",
    },
});