import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { authClient } from "@/lib/auth-client";

export default function AuthScreen() {
  const { data: session, isPending } = authClient.useSession();

  // Show loading while checking auth
  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-app-bg">
        <ActivityIndicator size="large" color="#FD6E20" />
      </View>
    );
  }

  // Redirect to tabs if already signed in
  if (session?.user) {
    return <Redirect href="/(tabs)" />;
  }

  // Redirect to login page by default
  return <Redirect href="/(auth)/login" />;
}
