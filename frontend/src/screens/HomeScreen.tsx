import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Share,
} from "react-native";

import api from "../services/api";

export default function HomeScreen() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedStyle, setSelectedStyle] =
    useState("Realistic");
  const[history, setHistory] = useState<string[]>([]);

  const trendingPrompts = [
    "A futuristic penguin astronaut in space",
    "Cyberpunk city at night with neon lights",
    "Anime warrior standing in rain",
    "Fantasy castle floating in the sky",
    "Ultra realistic sports car",
  ];


  const stylePrompts: Record<string, string> = {
    Realistic:
      "ultra realistic, professional photography, highly detailed",

    Anime:
      "anime style, studio ghibli, vibrant colors, masterpiece",

    Cartoon:
      "cartoon style, disney pixar, colorful, cute",

    "3D":
      "3d render, octane render, cinematic lighting",

    Fantasy:
      "fantasy art, magical atmosphere, epic composition",
  };

  const handleGenerate = async () => {
    try {
      if (!prompt.trim()) {
        alert("Please enter a prompt");
        return;
      }

      setLoading(true);

      const finalPrompt = `${prompt}, ${stylePrompts[selectedStyle]}`;

      const response = await api.post("/api/generate", {
        prompt: finalPrompt,
      });

      setImageUrl(response.data.imageUrl);
      setHistory((prev) => [prompt, ...prev.filter((item) => item!== prompt)].slice(0, 5));
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleGenerateAgain = async () => {
    if (!prompt.trim()) {
      alert("No prompt available");
      return;
    }
  
    handleGenerate();
  };

  const handleShare = async () => {
    try {
      if (!imageUrl) {
        alert("No image to share");
        return;
      }

      await Share.share({
        message: imageUrl,
      });
    } catch (error) {
      console.log(error);
      alert("Unable to share image");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.title}>🐧 PenguinAI</Text>

      <Text style={styles.subtitle}>
        Create stunning AI images from text
      </Text>
      {/* Trending Prompts */}
      <View style={styles.trendingContainer}>
        <Text style={styles.trendingTitle}>
          🔥 Trending Prompts
        </Text>
      
        {trendingPrompts.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.trendingChip}
            onPress={() => setPrompt(item)}
          >
            <Text style={styles.trendingText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>
            🕒 Recent Prompts
          </Text>
      
          {history.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyChip}
              onPress={() => setPrompt(item)}
            >
              <Text
                style={styles.historyText}
                numberOfLines={1}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Style Presets */}
      <View style={styles.stylesContainer}>
        {[
          "Realistic",
          "Anime",
          "Cartoon",
          "3D",
          "Fantasy",
        ].map((style) => (
          <TouchableOpacity
            key={style}
            style={[
              styles.styleChip,
              selectedStyle === style &&
                styles.selectedStyleChip,
            ]}
            onPress={() => setSelectedStyle(style)}
          >
            <Text
              style={[
                styles.styleChipText,
                selectedStyle === style &&
                  styles.selectedStyleChipText,
              ]}
            >
              {style}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Prompt Input */}
      <View style={styles.promptCard}>
        <Text style={styles.label}>
          Describe your image
        </Text>

        <TextInput
          placeholder="A penguin holding a FIFA World Cup trophy..."
          placeholderTextColor="#94A3B8"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          style={styles.input}
        />
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.loadingText}>
              Generating...
            </Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>
            Generate Image ✨
          </Text>
        )}
      </TouchableOpacity>

      {/* Generated Image */}
      {imageUrl ? (
        <View style={styles.imageCard}>
          <Text style={styles.imageTitle}>
            Generated Image
          </Text>

          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                alert(
                  "Download feature coming soon 🚀"
                )
              }
            >
              <Text style={styles.actionText}>
                Download
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Text style={styles.actionText}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={handleGenerateAgain}
            >
              <Text style={styles.regenerateText}>
                🔄 Generate Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            ✨ Your generated image will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 10,
    marginBottom: 25,
    fontSize: 16,
  },
  trendingContainer: {
    marginBottom: 20,
  },
  
  trendingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  
  trendingChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  
  trendingText: {
    color: "#334155",
  },
  historyContainer: {
    marginBottom: 20,
  },
  
  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  
  historyChip: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  
  historyText: {
    color: "#334155",
  },

  stylesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  styleChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 10,
    marginBottom: 10,
  },

  selectedStyleChip: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  styleChipText: {
    color: "#0F172A",
    fontWeight: "600",
  },

  selectedStyleChipText: {
    color: "#FFFFFF",
  },

  promptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 15,
  },

  input: {
    minHeight: 140,
    color: "#0F172A",
    fontSize: 16,
    textAlignVertical: "top",
  },

  generateButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontWeight: "600",
  },

  imageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  imageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 320,
    borderRadius: 16,
  },

  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  actionButton: {
    flex: 0.48,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  actionText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 15,
  },
  regenerateButton: {
    marginTop: 15,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  
  regenerateText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  emptyCard: {
    marginTop: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 320,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});