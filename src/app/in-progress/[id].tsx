import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { Alert, StatusBar, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import List from "@/components/List";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Progress from "@/components/Progress";
import PageHeader from "@/components/PageHeader";
import Transation, { TransactionI } from "@/components/Transation";

import { TransactionTypes } from "@/types";
import useNotification from "@/hooks/useNotifications";
import { NumberToCurrency } from "@/utils/numberToCurrency";
import useTargetDatabase from "@/database/useTargetDatabase";
import useTransactionsDatabase from "@/database/useTransactionsDatabase";

interface InProgressProps {}

const InProgress: React.FC<InProgressProps> = () => {
  const targetDatabase = useTargetDatabase();
  const [isFetching, setIsFetching] = useState(true);
  const transactionsDatabase = useTransactionsDatabase();
  const [transactions, setTransations] = useState<TransactionI[]>([]);
  const [details, setDetails] = useState({
    name: "",
    current: "R$ 0,00",
    target: "R$ 0,00",
    percentage: 0,
  });
  const [isAchieved, setIsAchieved] = useState(false);

  const { handleNotificate } = useNotification();
  const params = useLocalSearchParams<{ id: string }>();

  const fetchDetails = async () => {
    try {
      const response = await targetDatabase.show(Number(params.id));
      setDetails({
        name: response.name,
        current: NumberToCurrency(response.current),
        target: NumberToCurrency(response.amount),
        percentage: response.percentage,
      });

      if (response.percentage >= 100) setIsAchieved(true);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes da meta");
      console.log(error);
    }
  };

  const fetchData = async () => {
    const fetchDetailsPromise = fetchDetails();
    const fetchTransactionsPromise = fetchTransactions();

    await Promise.all([fetchDetailsPromise, fetchTransactionsPromise]);
    setIsFetching(false);
  };

  const fetchTransactions = async () => {
    const id = Number(params.id);
    try {
      const response = await transactionsDatabase.listByTargetId(id);
      const formattedTransactions: TransactionI[] = response.map((item) => ({
        id: String(item.id),
        value: NumberToCurrency(item.amount),
        date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
        description: item.observation,
        type:
          item.amount >= 0 ? TransactionTypes.Input : TransactionTypes.Output,
      }));

      setTransations(formattedTransactions);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as transações da meta");
      console.log(error);
    }
  };

  const handleTransactionRemove = (id: number) => {
    Alert.alert(
      "Deletar Transação",
      "Tem certeza que deseja deletar esta transação?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          onPress: () => handleTransactionDelete(id),
        },
      ]
    );
  };

  const handleTransactionDelete = async (id: number) => {
    try {
      await transactionsDatabase.remove(id);
      fetchData();
      await handleNotificate({
        title: "Excluir Transação",
        message: "Transação deletada com sucesso!",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível deletar a transação.");
      console.log(error);
    }
  };

  const handleAchieveTarget = async () => {
    try {
      const stored = await AsyncStorage.getItem("achievedTargets");
      const items: string[] = stored ? JSON.parse(stored) : [];
      const id = params.id;

      if (!items.includes(id)) {
        items.push(id);
      }

      await AsyncStorage.setItem("achievedTargets", JSON.stringify(items));
      await handleNotificate({
        title: "Parabéns🎉",
        message: `Você acabou de concluir a sua meta de ${details.name}.`,
      });
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível concluir a meta.");
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isFetching) return <Loading />;

  return (
    <View style={{ flex: 1, padding: 24, gap: 32 }}>
      <StatusBar barStyle="dark-content" />
      <PageHeader
        title={details.name}
        rightButton={{
          icon: "edit",
          onPress: () => router.navigate(`/target?id=${params.id}`),
        }}
      />

      <Progress data={details} />

      <List
        title="Transações"
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Transation
            data={item}
            onRemove={() => handleTransactionRemove(Number(item.id))}
          />
        )}
        emptyMessage="Nenhuma transação, crie a sua primeira transação e guarde o seu dinheiro."
      />
      {isAchieved ? (
        <Button title="Concluir Meta" onPress={handleAchieveTarget} />
      ) : (
        <Button
          title="Nova transação"
          onPress={() => router.navigate(`/transaction/${params.id}`)}
        />
      )}
    </View>
  );
};

export default InProgress;
