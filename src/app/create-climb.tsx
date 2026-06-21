import { Link, Stack } from "expo-router";
import { ArrowLeft, Mountain } from "lucide-react-native";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";

export default function CreateClimb() {
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
                        <Text style={{ color: "white"}}>0 HOLDS SELECTED</Text> 
                    </View>
                </View>

                <View style={styles.zoomContainer}>
                    <ResumableZoom>
                        <View style={styles.wallLayer}>
                            <Image 
                                source={require("../../assets/images/wall-image.jpg")}
                                style={styles.wallImage}
                                resizeMode="contain"
                            />
                        </View>
                    </ResumableZoom>
                </View>
                
            </View>
            
            <View style={styles.bottomSheet}>
                <Link href="/review-climb" asChild>
                    <Pressable style={[styles.button, styles.clearButton]}>
                        <Text style={styles.buttonText}>CLEAR</Text>
                    </Pressable>
                </Link>

                <Link href="/create-climb" asChild>
                    <Pressable style={[styles.button, styles.nextButton]}>
                        <Text style={styles.buttonText}>NEXT</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

const { width } = Dimensions.get("window");
const wallHeight = width * 2;

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
        flex:1,
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
    },
});

