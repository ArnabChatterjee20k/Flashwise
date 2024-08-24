import Container from "@/components/Container";
import IconButton from "@/components/IconButton";
import ThemedText from "@/components/ThemedText";
import { AntDesign } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Vibration,
  ScrollView,
} from "react-native";
import { PaperProvider, TextInput, Menu, Divider } from "react-native-paper";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function Form() {
  const params = useLocalSearchParams<{ flashCardID: Id<"flash"> }>();
  console.log({ params });
  if (!params.flashCardID) return <Text>{JSON.stringify(params)}</Text>;
  const flashCardDetails = useQuery(api.cards.getProjectDetails, {
    id: params.flashCardID,
  });
  const flash = useQuery(api.cards.getFlashCardById, {
    id: params.flashCardID,
  });
  const flashTitle = flash?.length ? flash[0].name : "";
  const cards = useQuery(api.cards.getCards, {
    flashCardId: params.flashCardID,
  });
  const changeFlashCardTitle = useMutation(api.cards.updateFlashCard);
  // at points the bar should stop while dragging
  const snapPoints = useMemo(() => ["25%"], []);
  const ref = useRef<BottomSheet>(null);
  const openSheet = () => {
    Vibration.vibrate(1);
    ref.current?.expand();
  };
  useFocusEffect(
    useCallback(() => {
      return () => ref.current?.close();
    }, [])
  );

  return (
    <PaperProvider>
      <GestureHandlerRootView>
        <Container className="gap-2">
          <Header
            savingStatus={true}
            id={params.flashCardID}
            name={flashTitle}
          />
          <View className="flex-row items-center">
            <Text className="text-white text-lg">{flashTitle}</Text>
            <IconButton icon="edit" onPress={() => ref.current?.expand()} />
          </View>
          <ScrollView>
            {cards?.map(({ question, answer }, index) => (
              <Card
                question={question}
                answer={answer}
                cardNumber={index + 1}
                onHold={openSheet}
              />
            ))}
          </ScrollView>
        </Container>
        <BottomSheet
          ref={ref}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ backgroundColor: "white" }}
          backgroundStyle={{ backgroundColor: "#232323" }}
        >
          <TitleChangeBox
            id={params.flashCardID}
            title={flashTitle}
            onCancel={() => ref?.current?.close()}
          />
        </BottomSheet>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

interface TitleChangeBoxProps {
  title: string;
  onCancel: () => void;
  id: string;
}
function TitleChangeBox({ title, onCancel, id }: TitleChangeBoxProps) {
  const [state, setState] = useState(title);
  const [loading, setLoading] = useState(false);
  const updateTitle = useMutation(api.cards.updateFlashCard);
  const onSave = async () => {
    try {
      setLoading(true);
      await updateTitle({ id: id as Id<"flash">, title: state });
    } catch (error) {
      alert("some error happened while updating title");
    } finally {
      setLoading(false);
      onCancel();
    }
  };
  useEffect(() => {
    setState(title || ""); // Update state if title changes
  }, [title]);

  return (
    <View className="gap-2 p-6">
      <ThemedText className="text-lg font-bold">Enter your {title}</ThemedText>
      <TextInput
        placeholder="Enter your flash card title"
        value={state}
        placeholderTextColor="#a1a1a1"
        textColor="white"
        className="mb-3 bg-transparent"
        underlineColor="#4d88f5"
        mode="flat"
        onChangeText={(text) => setState(text)}
      />
      <View className="flex flex-row space-x-6 justify-end px-3">
        <TouchableOpacity
          onPress={() => {
            onCancel();
            setState(title);
          }}
        >
          <ThemedText className="text-lg font-semibold text-[#4d88f5]">
            Cancel
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSave} disabled={loading}>
          <ThemedText className="text-lg font-semibold text-[#4d88f5]">
            {loading ? "Saving..." : "Save"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
interface CardProps {
  onHold: (id: string) => void;
  question: string;
  answer: string;
  cardNumber: number;
}
function Card({ onHold, question, answer, cardNumber }: CardProps) {
  return (
    <TouchableOpacity
      onLongPress={() => onHold("12")}
      className="rounded-2xl p-4 my-2"
      style={{ backgroundColor: "#242e31" }}
    >
      <View className="flex-row items-center justify-between">
        <ThemedText className="mx-2 text-xl font-bold">
          Card {cardNumber}
        </ThemedText>
      </View>
      <View className="flex-row mb-3">
        <TextInput
          placeholder="Enter your question"
          value={question}
          placeholderTextColor="#a1a1a1"
          textColor="white"
          className="flex-1 bg-transparent"
          multiline
        />
      </View>
      <TextInput
        value={answer}
        placeholder="Enter your answer"
        placeholderTextColor="#a1a1a1"
        textColor="white"
        className="mb-3 bg-transparent"
        multiline
      />
      <View className="flex-row space-x-4 justify-center">
        <AddOptionsButton />
      </View>
    </TouchableOpacity>
  );
}

function AddOptionsButton() {
  return (
    <TouchableOpacity
      className="flex-row py-3 px-6 space-x-2 rounded-full items-center justify-center"
      style={{ backgroundColor: "#2c6adb" }}
    >
      <AntDesign name="plus" size={20} color="white" />
      <ThemedText>Add Next</ThemedText>
    </TouchableOpacity>
  );
}

interface HeaderProps {
  savingStatus: boolean;
  name: string;
  id: Id<"flash">;
}
function Header({ savingStatus, id, name }: HeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const router = useRouter();
  const goToAI = () => {
    router.push({
      pathname: "/ai",
      params: { flashcard: name, flashcardID: id },
    });
  };
  const save = () => {
    alert("save");
  };
  const goBack = () => {
    router.back();
  };
  return (
    <SafeAreaView className="flex-row mb-4 items-center justify-between">
      <IconButton onPress={goBack} icon="arrowleft" style={styles.icon} />
      <View className="items-center">
        <ThemedText className="text-2xl">Create Cards</ThemedText>
        <ThemedText className="text-yellow-400">
          {savingStatus ? "Saved" : "Not Saved"}
        </ThemedText>
      </View>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        contentStyle={{ marginTop: 60 }}
        mode="elevated"
        anchor={
          <IconButton icon="ellipsis1" style={styles.icon} onPress={openMenu} />
        }
        anchorPosition="bottom"
      >
        <Menu.Item title="Save" onPress={save} />
        <Menu.Item title="Create with AI" onPress={goToAI} />
      </Menu>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: "#242e31",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
    color: "#fff",
  },
});
