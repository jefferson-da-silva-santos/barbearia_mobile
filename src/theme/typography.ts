// src/theme/typography.ts
import { StyleSheet } from "react-native";

export const typography = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: "700", letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: "600" },
  h4: { fontSize: 16, fontWeight: "600" },
  body: { fontSize: 15, fontWeight: "400", lineHeight: 22 },
  bodyLg: { fontSize: 17, fontWeight: "400", lineHeight: 26 },
  label: { fontSize: 13, fontWeight: "500", letterSpacing: 0.3 },
  caption: { fontSize: 12, fontWeight: "400" },
  button: { fontSize: 15, fontWeight: "600", letterSpacing: 0.2 },
  mono: { fontSize: 13, fontFamily: "monospace" },
});

