import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Stack />
    </GestureHandlerRootView>
  );
}

export const fonts = {
  body: "Barlow_400Regular",
  bodyMedium: "Barlow_500Medium",
  heading: "BarlowCondensed_700Bold",
  headingExtraBold: "BarlowCondensed_800ExtraBold",
};