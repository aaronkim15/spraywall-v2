import { Link, Stack } from "expo-router";
import { Mountain } from "lucide-react-native";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/background-image.avif')}
        style={styles.background}
        resizeMode="cover">

        <Stack.Screen options={{headerShown: false}} />
        <View style={styles.overlay}></View>

        <View style={styles.content}> 
          <View style={styles.hero}>
            <Mountain></Mountain>
            <Text style={styles.title}>SPRAYWALL</Text>
            <Text style={styles.subtitle}>SET · LOG · CLIMB</Text>
          </View>

          <View style={styles.buttons}>
            <Link href="/create-climb" asChild>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>+ CREATE CLIMB</Text>
              </Pressable>
            </Link>
            
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>☰ VIEW CLIMBS</Text>
            </Pressable>
        </View>
      </View>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0f",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },

  hero:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title:{
    textAlign: "center",
    fontSize: 48,
    color: "#ffffff",
    letterSpacing: 4,
  },

  subtitle:{
    textAlign: "center",
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 3,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  buttons: {
    gap: 6,
    paddingBottom: 8,
  },

  primaryButton:{
    backgroundColor: "#ff6b35",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryButtonText:{
    color: "#ffffff",
    fontWeight: "700",
  },

  secondaryButtonText:{
    color: "#ffffff",
    fontWeight: "700",
  },

  overlay:{
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  background:{
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
