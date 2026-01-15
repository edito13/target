import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Alert, StatusBar, View } from "react-native";

import List from "@/components/List";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Target, { TargetI } from "@/components/Target";
import HomeHeader, { HomeHeaderProps } from "@/components/HomeHeader";

import useNotification from "@/hooks/useNotifications";
import { NumberToCurrency } from "@/utils/numberToCurrency";
import useTargetDatabase from "@/database/useTargetDatabase";
import useTransactionsDatabase from "@/database/useTransactionsDatabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const targetDatabase = useTargetDatabase();
  const { handleNotificate } = useNotification();
  const transactionsDatabase = useTransactionsDatabase();

  const [isFetching, setIsFetching] = useState(true);
  const [targets, setTargets] = useState<TargetI[]>([]);
  const [summary, setSummary] = useState<HomeHeaderProps>();
  const [achievedTargets, setAchievedTargets] = useState<string[]>([]);

  const fetchTargets = async (): Promise<TargetI[]> => {
    try {
      const response = await targetDatabase.listByClosestTarget();

      const formattedTargets: TargetI[] = response.map((item) => ({
        id: String(item.id),
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
    const achievedPromise = AsyncStorage.getItem("achievedTargets");

    const [targetData, summaryData, achievedData] = await Promise.all([
      targetDataPromise,
      summaryDataPromise,
      achievedPromise,
    ]);

    const achievedItems = achievedData ? JSON.parse(achievedData) : [];
    console.log("achieved: " + achievedItems);
    setTargets(targetData);
    setSummary(summaryData);
    setAchievedTargets(achievedItems);
    setIsFetching(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleConfirm = (target_id?: number) => {
    Alert.alert(
      "Meta já concluída",
      "Você já concluíu essa meta. Deseja eliminar da sua lista?",
      [
        {
          text: "Sim",
          onPress: () => handleDelete(target_id),
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await targetDatabase.remove(id);
      fetchData();
      await handleNotificate({
        title: "Exluir Meta",
        message: "Meta deletada com sucesso!",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível deletar a meta.");
      console.log(error);
    }
  };

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
        renderItem={({ item }) =>
          achievedTargets.includes(item.id) ? (
            <Target
              data={item}
              onPress={() => handleConfirm(Number(item.id))}
              isAchieved={true}
            />
          ) : (
            <Target
              data={item}
              onPress={() => router.navigate(`/in-progress/${item.id}`)}
            />
          )
        }
        emptyMessage="Nenhuma meta, toque em nova meta para criar."
      />
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Button title="Criar meta" onPress={() => router.navigate("target")} />
      </View>
    </View>
  );
};

export default Index;
