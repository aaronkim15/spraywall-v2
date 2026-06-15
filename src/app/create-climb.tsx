import { Link, Stack } from "expo-router";
import { Mountain } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";


export default function CreateClimb() {
    return(
        <View>
            <Stack.Screen options={{headerShown:true}} /> 
            <View style={styles.header}>

                <View style={styles.leftSection}>
                    <Link href="/" asChild>
                        <Pressable>
                            <Text>Back(This is an icon)</Text>
                        </Pressable>
                    </Link>
                </View>
                
                <View style={styles.centerSection}>
                    <Mountain />
                    <Text>SPRAYWALL</Text>
                </View>

                <View style={styles.rightSection}>
                    <Text>0 HOLDS SELECTED</Text> 
                </View>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",      
        justifyContent: "space-between", 
        alignItems: "center",      
        paddingHorizontal: 20,     
        paddingTop: 16,            
        paddingBottom: 12,         
    },
    leftSection:{
        flex: 1,
    },

    centerSection:{
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    
    rightSection:{
        flex: 1,
        alignItems: "flex-end",
    },
});