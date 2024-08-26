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
  Dimensions,
  Alert,
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

  const createCard = useMutation(api.cards.createCard);

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
            {cards?.map(({ question, answer, _id }, index) => (
              <Card
                id={_id}
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
        <View
          className="absolute"
          style={{
            top: Dimensions.get("window").height - 30,
            left: Dimensions.get("window").width - 80,
          }}
        >
          <IconButton
            onPress={() =>
              createCard({
                question: "not added",
                answer: "not added",
                flashCardId: params.flashCardID,
              })
            }
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10, // For Android
              backgroundColor: "black",
            }}
            icon="plus"
          />
        </View>
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
  id: string;
}
function Card({ onHold, question, answer, cardNumber, id }: CardProps) {
  const [qs, setQs] = useState(question);
  const [ans, setAns] = useState(answer);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (question) setQs(question);
    if (answer) setAns(answer);
  }, [question, answer]);
  const updateData = useMutation(api.cards.updateCardData);
  const deleteFlash = useMutation(api.cards.deleteCard);

  async function remove(id: Id<"cards">) {
    Alert.alert(
      "Delete",
      `Your card will be deleted`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteFlash({ id: id });
            } catch (error) {
            } finally {
              alert("deleted");
            }
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  }
  const update = async () => {
    setLoading(true);
    try {
      await updateData({ id: id as Id<"cards">, question: qs, answer: ans });
    } catch (error) {
      alert("Some error happened");
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setQs(question);
    setAns(answer);
  };
  return (
    <View
      className="rounded-2xl p-4 my-2 relative"
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
          value={qs}
          placeholderTextColor="#a1a1a1"
          textColor="white"
          className="flex-1 bg-transparent"
          multiline
          onChangeText={(text) => setQs(text)}
        />
      </View>
      <TextInput
        value={ans}
        placeholder="Enter your answer"
        placeholderTextColor="#a1a1a1"
        textColor="white"
        className="mb-3 bg-transparent"
        multiline
        onChangeText={(text) => setAns(text)}
      />
      <View className="flex flex-row space-x-6 justify-end px-3">
        <TouchableOpacity onPress={reset}>
          <ThemedText className="text-lg font-semibold text-[#4d88f5]">
            Reset
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={update} disabled={loading}>
          <ThemedText className="text-lg font-semibold text-[#4d88f5]">
            {loading ? "Saving..." : "Save"}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <IconButton onPress={()=>remove(id as Id<"cards">)} icon="delete" color="#ef4444" className="absolute right-5 top-1"/>
    </View>
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
