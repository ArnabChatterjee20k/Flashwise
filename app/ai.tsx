import ThemedText from "@/components/ThemedText";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction, useQuery } from "convex/react";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Form = () => {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState("");
  const params = useLocalSearchParams<{
    flashcard: string;
    flashcardID: Id<"flash">;
  }>();
  const createWithAIAction = useAction(api.cards.createQuestionAI);
  const projectDetails = useQuery(api.cards.getProjectDetails, {
    id: params.flashcardID,
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <>
        <ThemedText className="text-2xl my-2 font-bold">
          {params.flashcard}
        </ThemedText>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={count}
            onChangeText={setCount}
            placeholder="Count of cards"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            createWithAIAction({
              prompt: prompt,
              count: parseInt(count),
              flashCardId: params.flashcardID,
            })
          }
        >
          <Text style={styles.buttonText}>
            {projectDetails?.generating ? "Loading..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "black",
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 4,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#71717a",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Form;
