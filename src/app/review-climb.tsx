import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const GRADES = ["V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"];

export default function ReviewClimb() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Holds were passed as a JSON string from create-climb.
    // Guard against arriving with no holds param.
    const holds = params.holds ? JSON.parse(params.holds as string) : [];

    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [description, setDescription] = useState("");

    function handleSave() {
        const climb = { name, grade, description, holds };
        console.log("saving climb:", climb);
        // TODO (later): POST this to the backend, then navigate away.
    }

    return (
        <View style={styles.screen}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Link href="/create-climb" asChild>
                    <Pressable>
                        <ArrowLeft size={20} color={"white"} />
                    </Pressable>
                </Link>
                <Text style={styles.headerTitle}>REVIEW CLIMB</Text>
                <View style={{ width: 20 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.holdCount}>{holds.length} holds selected</Text>

                {/* NAME */}
                <Text style={styles.label}>NAME</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Sunday Slab"
                    placeholderTextColor="#666"
                />

                {/* GRADE */}
                <Text style={styles.label}>GRADE</Text>
                <View style={styles.gradeRow}>
                    {GRADES.map((g) => (
                        <Pressable
                            key={g}
                            onPress={() => setGrade(g)}
                            style={[
                                styles.gradeButton,
                                grade === g && styles.gradeButtonSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.gradeText,
                                    grade === g && styles.gradeTextSelected,
                                ]}
                            >
                                {g}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* DESCRIPTION */}
                <Text style={styles.label}>DESCRIPTION</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Any notes about the climb (optional)"
                    placeholderTextColor="#666"
                    multiline
                />
            </ScrollView>

            <View style={styles.bottomSheet}>
                <Pressable
                    style={[styles.saveButton, !name && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={!name}
                >
                    <Text style={styles.saveButtonText}>SAVE CLIMB</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#0d0d0f",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
    },
    headerTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 1,
    },
    form: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 12,
    },
    holdCount: {
        color: "#ff6b35",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    label: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
        marginTop: 8,
    },
    input: {
        backgroundColor: "#1a1a1e",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "white",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#2c2c30",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    gradeRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    gradeButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#1a1a1e",
        borderWidth: 1,
        borderColor: "#2c2c30",
    },
    gradeButtonSelected: {
        backgroundColor: "#ff6b35",
        borderColor: "#ff6b35",
    },
    gradeText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 15,
        fontWeight: "600",
    },
    gradeTextSelected: {
        color: "white",
    },
    bottomSheet: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    saveButton: {
        height: 60,
        borderRadius: 18,
        backgroundColor: "#ff6b35",
        justifyContent: "center",
        alignItems: "center",
    },
    saveButtonDisabled: {
        backgroundColor: "#2c2c30",
    },
    saveButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 1,
    },
});