import React, { Suspense } from "react";
import {
  useFonts,
  Inter_700Bold,
  Inter_500Medium,
  Inter_400Regular,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { colors } from "@/theme/colors";
import Loading from "@/components/Loading";
import { SQLiteProvider } from "expo-sqlite";
import { migrate } from "@/database/migrate";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  if (!fontsLoaded) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName="target.db" onInit={migrate} useSuspense>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.white },
          }}
        />
      </SQLiteProvider>
    </Suspense>
  );
};

export default Layout;
