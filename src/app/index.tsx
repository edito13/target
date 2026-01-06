import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Alert, StatusBar, View } from "react-native";

import List from "@/components/List";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Target, { TargetI } from "@/components/Target";
import HomeHeader, { HomeHeaderProps } from "@/components/HomeHeader";

import { NumberToCurrency } from "@/utils/numberToCurrency";
import useTargetDatabase from "@/database/useTargetDatabase";
import useTransactionsDatabase from "@/database/useTransactionsDatabase";

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();
  const [summary, setSummary] = useState<HomeHeaderProps>();
  const [isFetching, setIsFetching] = useState(true);
  const [targets, setTargets] = useState<TargetI[]>([]);

  const fetchTargets = async (): Promise<TargetI[]> => {
    try {
      const response = await targetDatabase.listByClosestTarget();

      const formattedTargets: TargetI[] = response.map((item) => ({
        id: item.id,
        name: item.name,
        target: NumberToCurrency(item.amount),
        current: NumberToCurrency(item.current),
        percentage: `${item.percentage.toFixed(0)}%`,
      }));

      return formattedTargets;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      console.log(error);
    }
  };

  const fetchSummary = async (): Promise<HomeHeaderProps> => {
    try {
      const response = await transactionsDatabase.summary();

      const formattedSummary: HomeHeaderProps = {
        total: NumberToCurrency(response.input + response.output),
        input: {
          label: "Entradas",
          value: NumberToCurrency(response.input),
        },
        output: {
          label: "Saídas",
          value: NumberToCurrency(response.output),
        },
      };

      return formattedSummary;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      console.log(error);
    }
  };

  const fetchData = async () => {
    const targetDataPromise = fetchTargets();
    const summaryDataPromise = fetchSummary();

    const [targetData, summaryData] = await Promise.all([
      targetDataPromise,
      summaryDataPromise,
    ]);
    setTargets(targetData);
    setSummary(summaryData);
    setIsFetching(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isFetching) return <Loading />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <HomeHeader data={summary} />

      <List
        title="Metas"
        data={targets}
        keyExtractor={(item) => item.id}
        containerStyle={{ paddingHorizontal: 24 }}
        renderItem={({ item }) => (
          <Target
            data={item}
            onPress={() => router.navigate(`/in-progress/${item.id}`)}
          />
        )}
        emptyMessage="Nenhuma meta, toque em nova meta para criar."
      />
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Button title="Criar meta" onPress={() => router.navigate("target")} />
      </View>
    </View>
  );
};

export default Index;
